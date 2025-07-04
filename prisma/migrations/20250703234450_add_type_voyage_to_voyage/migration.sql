/*
  Warnings:

  - Added the required column `typeVoyage` to the `Voyage` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Reservation_utilisateursId_fkey` ON `reservation`;

-- DropIndex
DROP INDEX `Reservation_voyageId_fkey` ON `reservation`;

-- AlterTable
ALTER TABLE `voyage` ADD COLUMN `typeVoyage` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_voyageId_fkey` FOREIGN KEY (`voyageId`) REFERENCES `Voyage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_utilisateursId_fkey` FOREIGN KEY (`utilisateursId`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_colisId_fkey` FOREIGN KEY (`colisId`) REFERENCES `Colis`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
