const express = require('express');
const app = express();

// Middleware de sécurité
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Middleware pour parser le JSON avec gestion des erreurs
app.use((req, res, next) => {
  express.json()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: 'JSON malformé' });
    }
    next();
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API CI/CD Demo !' });
});

// Route pour tester les erreurs 500
app.get('/error', (req, res, next) => {
  next(new Error('Test d\'erreur serveur'));
});

// Gestion des 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  });
}

module.exports = app;
