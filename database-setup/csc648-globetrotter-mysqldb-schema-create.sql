-- MySQL Script generated by MySQL Workbench
-- Mon Jul  5 17:41:45 2021
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema GlobetrotterV1
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema GlobetrotterV1
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `GlobetrotterV1` DEFAULT CHARACTER SET utf8 ;
USE `GlobetrotterV1` ;

-- -----------------------------------------------------
-- Table `GlobetrotterV1`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GlobetrotterV1`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `passwordHash` VARCHAR(128) NOT NULL,
  `address` VARCHAR(90) NULL,
  `phoneCountryCode` VARCHAR(2) NULL,
  `phoneNumber` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `passwordHash_UNIQUE` (`passwordHash` ASC) VISIBLE)
ENGINE = InnoDB;

CREATE USER 'team2' IDENTIFIED BY 'YE2n4qh4wV';

GRANT ALL ON `GlobetrotterV1`.* TO 'team2';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
