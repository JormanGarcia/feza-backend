-- AlterTable
ALTER TABLE `Operation` MODIFY `status` ENUM('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELED', 'REJECTED', 'WAITING') NOT NULL;