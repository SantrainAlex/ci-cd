const request = require('supertest');
const express = require('express');
const app = express();

// Importer la route
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur notre site !' });
});

describe('API Endpoints', () => {
  it('should return welcome message', async () => {
    const res = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toEqual({
      message: 'Bienvenue sur notre site !'
    });
  });
});
