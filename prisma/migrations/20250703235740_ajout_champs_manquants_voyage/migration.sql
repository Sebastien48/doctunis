/*
  Warnings:

  - You are about to alter the column `heureDepart` on the `voyage` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(5)`.

*/
-- DropIndex
DROP INDEX `Reservation_utilisateursId_fkey` ON `reservation`;

-- DropIndex
DROP INDEX `Reservation_voyageId_fkey` ON `reservation`;

-- AlterTable
ALTER TABLE `voyage` ADD COLUMN `dateDepartSejour` DATETIME(3) NULL,
    ADD COLUMN `dateEvent` DATETIME(3) NULL,
    ADD COLUMN `dateRetour` DATETIME(3) NULL,
    ADD COLUMN `destinationEvent` VARCHAR(100) NULL,
    ADD COLUMN `destinationSejour` VARCHAR(100) NULL,
    ADD COLUMN `duree` INTEGER NULL,
    ADD COLUMN `départEvent` VARCHAR(100) NULL,
    ADD COLUMN `départSejour` VARCHAR(100) NULL,
    ADD COLUMN `heureEvent` VARCHAR(5) NULL,
    ADD COLUMN `heureRetour` VARCHAR(5) NULL,
    ADD COLUMN `moyenTransportEvent` VARCHAR(100) NULL,
    MODIFY `heureDepart` VARCHAR(5) NULL;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_voyageId_fkey` FOREIGN KEY (`voyageId`) REFERENCES `Voyage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_utilisateursId_fkey` FOREIGN KEY (`utilisateursId`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_colisId_fkey` FOREIGN KEY (`colisId`) REFERENCES `Colis`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
