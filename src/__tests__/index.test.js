const request = require('supertest');
const app = require('../index');

describe('API Endpoints', () => {
  test('should return welcome message', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Bienvenue sur l\'API CI/CD Demo !');
  });

  test('should handle 404 errors', async () => {
    const response = await request(app)
      .get('/route-inexistante')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Route non trouvée');
  });

  test('should handle server errors (500)', async () => {
    // Simuler une erreur dans le middleware
    app.get('/error', (req, res, next) => {
      next(new Error('Test d\'erreur serveur'));
    });

    const response = await request(app)
      .get('/error')
      .expect('Content-Type', /json/)
      .expect(500);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Erreur interne du serveur');
  });

  test('should handle JSON parsing errors', async () => {
    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send('{malformed json')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  test('should set security headers', async () => {
    const response = await request(app)
      .get('/');

    expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
    expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
    expect(response.headers).toHaveProperty('x-xss-protection', '1; mode=block');
  });
});
