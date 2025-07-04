-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3307
-- Généré le : sam. 28 juin 2025 à 09:27
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
-- Structure de la table `colis`
--

DROP TABLE IF EXISTS `colis`;
CREATE TABLE IF NOT EXISTS `colis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `utilisateurNom` varchar(191) NOT NULL,
  `utilisateurPrenom` varchar(191) NOT NULL,
  `utilisateurEmail` varchar(191) NOT NULL,
  `utilisateurTelephone` varchar(191) NOT NULL,
  `depart` varchar(191) NOT NULL,
  `destination` varchar(191) NOT NULL,
  `image` varchar(191) NOT NULL,
  `dateEnvoi` datetime(3) NOT NULL,
  `heureEnvoi` varchar(191) NOT NULL,
  `moyensTransport` varchar(191) NOT NULL,
  `prix` int(11) DEFAULT NULL,
  `dateRetour` datetime(3) DEFAULT NULL,
  `heureRetour` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'en_attente',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `paiement`
--

DROP TABLE IF EXISTS `paiement`;
CREATE TABLE IF NOT EXISTS `paiement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `montant` double NOT NULL,
  `methode` enum('carte','mobile_money','espece','virement') NOT NULL,
  `statut` varchar(191) NOT NULL DEFAULT 'en_attente',
  `datePaiement` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `reservationId` int(11) DEFAULT NULL,
  `colisId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Paiement_reservationId_key` (`reservationId`),
  UNIQUE KEY `Paiement_colisId_key` (`colisId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE IF NOT EXISTS `reservation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) NOT NULL,
  `prenom` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `telephone` varchar(191) NOT NULL,
  `placesPrise` int(11) NOT NULL,
  `prixReservation` int(11) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'en_attente',
  `voyageId` int(11) NOT NULL,
  `utilisateursId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Reservation_voyageId_fkey` (`voyageId`),
  KEY `Reservation_utilisateursId_fkey` (`utilisateursId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `email`, `telephone`, `mot_de_passe`, `role`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(6, 'santos ', 'françois', 'santosfrancois@gmail.com', '+1 100785525', '$2b$10$tcRBA7eJtd.XraUt/AooKuLXvFjZvs6zFE78i42YI3q2IF0DkQWeG', 'utilisateur', '2025-06-25 18:27:40.549', '2025-06-25 18:27:40.549', NULL),
(2, 'david', 'karnou', 'karnou@gmail.com', '+225 0555330393', '$2b$10$/uXq5lE3O8q9vUIudDRi0O9vf/R0orB/rn7dTutGSd16bYaP.UJ4S', 'utilisateur', '2025-06-14 02:27:32.494', '2025-06-14 02:27:32.494', NULL),
(3, 'david', 'jean françois', 'david@gmail.com', '0555330393', '$2b$10$HMLRcv5wTcBGRyOyFGXbeee9Zc2RI8nlZoDgrNcKl6y4mqYpkI6PO', 'utilisateur', '2025-06-14 02:29:09.338', '2025-06-14 02:29:09.338', NULL),
(4, 'vianney', 'kouadio', 'vianney@gmail.com', '555107312', '$2b$10$ToGiM.YoN/FZ5rjzZTF8web.ZHa6hzOBvw/yGnXgtir8hrG5bjq0i', 'admin', '2025-06-14 02:32:20.712', '2025-06-14 02:32:20.712', NULL),
(5, 'naruto', 'kurosaki', 'karnouvianney@gmail.com', '+1 100785525', '$2b$10$EnjMj8khWuadctrmQmD0RuWK35WW9.rjj/QZu00fgw7sCvfmjDlzK', 'utilisateur', '2025-06-16 16:25:46.024', '2025-06-16 16:25:46.024', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `voyage`
--

DROP TABLE IF EXISTS `voyage`;
CREATE TABLE IF NOT EXISTS `voyage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(191) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `prix` double NOT NULL,
  `placesDisponible` int(11) NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `départ` varchar(100) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `date` datetime(3) NOT NULL,
  `heure` varchar(5) DEFAULT NULL,
  `dateFinSejour` datetime(3) DEFAULT NULL,
  `categorie` varchar(50) NOT NULL,
  `moyensTransport` varchar(100) NOT NULL,
  `published` tinyint(1) NOT NULL DEFAULT 0,
  `lieu` varchar(255) DEFAULT NULL,
  `organisateur` varchar(255) DEFAULT NULL,
  `hotel` varchar(255) DEFAULT NULL,
  `activites` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
