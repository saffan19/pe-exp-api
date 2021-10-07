-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema pw2
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pw2
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pw2` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
USE `pw2` ;

-- -----------------------------------------------------
-- Table `pw2`.`login`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pw2`.`login` (
  `email` VARCHAR(70) NOT NULL,
  `password` VARCHAR(25) NULL DEFAULT NULL,
  PRIMARY KEY (`email`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `pw2`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pw2`.`user` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(70) NULL DEFAULT NULL,
  `branch` VARCHAR(50) NULL DEFAULT NULL,
  `grad_year` VARCHAR(4) NULL DEFAULT NULL,
  `email` VARCHAR(70) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `company` VARCHAR(30) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  INDEX `email` (`email` ASC) VISIBLE,
  CONSTRAINT `user_ibfk_1`
    FOREIGN KEY (`email`)
    REFERENCES `pw2`.`login` (`email`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 15
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `pw2`.`question`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pw2`.`question` (
  `question_id` INT(11) NOT NULL AUTO_INCREMENT,
  `question` TEXT NULL DEFAULT NULL,
  `user_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`question_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `question_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `pw2`.`user` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `pw2`.`answer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pw2`.`answer` (
  `answer_id` INT(11) NOT NULL AUTO_INCREMENT,
  `answer` TEXT NULL DEFAULT NULL,
  `question_id` INT(11) NULL DEFAULT NULL,
  `user_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`answer_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `question_id` (`question_id` ASC) VISIBLE,
  CONSTRAINT `answer_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `pw2`.`user` (`user_id`),
  CONSTRAINT `answer_ibfk_2`
    FOREIGN KEY (`question_id`)
    REFERENCES `pw2`.`question` (`question_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `pw2`.`post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pw2`.`post` (
  `post_id` INT(11) NOT NULL AUTO_INCREMENT,
  `company` VARCHAR(100) NULL DEFAULT NULL,
  `image_content` VARCHAR(255) NULL DEFAULT NULL,
  `text_content` TEXT NOT NULL,
  `user_id` INT(11) NULL DEFAULT NULL,
  `date_time` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `post_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `pw2`.`user` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `pw2`.`post_reaction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pw2`.`post_reaction` (
  `reaction_id` INT(11) NOT NULL AUTO_INCREMENT,
  `post_id` INT(11) NULL DEFAULT NULL,
  `user_id` INT(11) NULL DEFAULT NULL,
  `upvote` TINYINT(1) NULL DEFAULT NULL,
  `comment` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`reaction_id`),
  INDEX `post_id` (`post_id` ASC) VISIBLE,
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `post_reaction_ibfk_1`
    FOREIGN KEY (`post_id`)
    REFERENCES `pw2`.`post` (`post_id`)
    ON DELETE CASCADE,
  CONSTRAINT `post_reaction_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `pw2`.`user` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 26
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
