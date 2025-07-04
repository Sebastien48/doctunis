-- CreateTable
CREATE TABLE `utilisateurs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `mot_de_passe` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'utilisateur',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `utilisateurs_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Voyage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `prix` DOUBLE NOT NULL,
    `placesDisponible` INTEGER NOT NULL,
    `image` VARCHAR(191) NULL,
    `départ` VARCHAR(100) NOT NULL,
    `destination` VARCHAR(100) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `heure` VARCHAR(5) NULL,
    `dateFinSejour` DATETIME(3) NULL,
    `categorie` VARCHAR(50) NOT NULL,
    `moyensTransport` VARCHAR(100) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `titre` VARCHAR(255) NULL,
    `lieu` VARCHAR(255) NULL,
    `organisateur` VARCHAR(255) NULL,
    `hotel` VARCHAR(255) NULL,
    `activites` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `placesPrise` INTEGER NOT NULL,
    `prixReservation` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'en_attente',
    `voyageId` INTEGER NOT NULL,
    `utilisateursId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Paiement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `montant` DOUBLE NOT NULL,
    `methode` ENUM('carte', 'mobile_money', 'espece', 'virement') NOT NULL,
    `statut` VARCHAR(191) NOT NULL DEFAULT 'en_attente',
    `datePaiement` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reservationId` INTEGER NULL,
    `colisId` INTEGER NULL,

    UNIQUE INDEX `Paiement_reservationId_key`(`reservationId`),
    UNIQUE INDEX `Paiement_colisId_key`(`colisId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Colis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateurNom` VARCHAR(191) NOT NULL,
    `utilisateurPrenom` VARCHAR(191) NOT NULL,
    `utilisateurEmail` VARCHAR(191) NOT NULL,
    `utilisateurTelephone` VARCHAR(191) NOT NULL,
    `depart` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `dateEnvoi` DATETIME(3) NOT NULL,
    `heureEnvoi` VARCHAR(191) NOT NULL,
    `moyensTransport` VARCHAR(191) NOT NULL,
    `prix` INTEGER NULL,
    `dateRetour` DATETIME(3) NULL,
    `heureRetour` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'en_attente',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_voyageId_fkey` FOREIGN KEY (`voyageId`) REFERENCES `Voyage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_utilisateursId_fkey` FOREIGN KEY (`utilisateursId`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_colisId_fkey` FOREIGN KEY (`colisId`) REFERENCES `Colis`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
