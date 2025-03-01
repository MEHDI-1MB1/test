const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'team_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Routes
const teamRoutes = require('./routes/teams.js');
app.use('/api/teams', teamRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('API de gestion d\'équipes fonctionne correctement');
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

module.exports = { pool };