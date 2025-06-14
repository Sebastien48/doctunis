-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3307
-- Généré le : sam. 14 juin 2025 à 01:10
-- Version du serveur : 11.5.2-MariaDB
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `voyages`
--

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) NOT NULL,
  `prenom` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `telephone` varchar(191) NOT NULL,
  `mot_de_passe` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'utilisateur',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilisateurs_email_key` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `email`, `telephone`, `mot_de_passe`, `role`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Jean', 'Dupont', 'jean@example.com', '+33612345678', 'secret123', 'utilisateur', '2025-06-13 10:13:59.479', '2025-06-13 10:13:59.479', NULL),
(2, 'vianney', 'kouadio', 'karnouvianney@gmail.com', '555107312', '$2b$10$fSVF4D1VbHk5.QlyZ9.SN.v1a.6m2oAtItQFb.lbrukg0FC8YEo.2', 'utilisateur', '2025-06-13 10:27:48.182', '2025-06-13 10:27:48.182', NULL),
(3, 'medard', 'kouadio', 'vianney@gmail.com', '+225 04 78 4501', '$2b$10$ZTN.rlvmAg6sYjEe5CMFgOvtcnwGd2vW7WhjfbyOnL8.eHSG1.rPi', 'admin', '2025-06-13 11:53:08.807', '2025-06-13 11:53:08.807', NULL),
(4, 'santos ', 'bertrand francois', 'santosfrancois@gmail.com', '+33 45569658', '$2b$10$NP.xcYakwPwZCZq7WF8kMeAJU7Ebk62AXcqdSb/fTsXFS8.ATdkVa', 'utilisateur', '2025-06-13 12:00:25.276', '2025-06-13 12:00:25.276', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
