-- Création de la base de données
CREATE DATABASE IF NOT EXISTS team_management;
USE team_management;

-- Table des équipes
CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des membres d'équipe
CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  role ENUM('chef', 'membre') NOT NULL,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telephone VARCHAR(20),
  filiere VARCHAR(100),
  cne VARCHAR(50),
  cin VARCHAR(50),
  membre_appinsciences BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Index pour accélérer les recherches
CREATE INDEX idx_team_members_email ON team_members(email);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);

