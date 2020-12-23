CREATE SCHEMA `users` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
CREATE TABLE `users`.`users_info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(256) NOT NULL,
  `pass` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;
INSERT INTO `users`.`users_info` (`login`, `pass`) VALUES ('daniil', '1234');

CREATE TABLE `users`.`img` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `path` VARCHAR(1024) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;
INSERT INTO `users`.`img` (`path`, `name`) VALUES ('./img/1.jpg', '1.jpg');
INSERT INTO `users`.`img` (`path`, `name`) VALUES ('./img/2.jpg', '2.jpg');
INSERT INTO `users`.`img` (`path`, `name`) VALUES ('./img/3.jpg', '3.jpg');
INSERT INTO `users`.`img` (`path`, `name`) VALUES ('./img/4.jpg', '4.jpg');
INSERT INTO `users`.`img` (`path`, `name`) VALUES ('./img/5.jpg', '5.jpg');
INSERT INTO `users`.`img` (`path`, `name`) VALUES ('./img/6.jpg', '6.jpg');

ALTER TABLE `users`.`img` 
ADD COLUMN `price` INT NOT NULL AFTER `name`;
ALTER TABLE `users`.`img` 
ADD COLUMN `category_id` INT NOT NULL AFTER `price`;

CREATE TABLE `users`.`categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category` VARCHAR(512) NOT NULL,
  PRIMARY KEY (`id`));

INSERT INTO `users`.`categories` (`category`) VALUES ('sea');
INSERT INTO `users`.`categories` (`category`) VALUES ('landscape');
INSERT INTO `users`.`categories` (`category`) VALUES ('others');
INSERT INTO `users`.`categories` (`category`) VALUES ('city');


UPDATE `users`.`img` SET `price` = '200', `category_id` = '2' WHERE (`id` = '1');
UPDATE `users`.`img` SET `price` = '245', `category_id` = '1' WHERE (`id` = '2');
UPDATE `users`.`img` SET `price` = '543', `category_id` = '2' WHERE (`id` = '3');
UPDATE `users`.`img` SET `price` = '345', `category_id` = '3' WHERE (`id` = '4');
UPDATE `users`.`img` SET `price` = '564', `category_id` = '1' WHERE (`id` = '5');
UPDATE `users`.`img` SET `price` = '899', `category_id` = '4' WHERE (`id` = '6');

CREATE TABLE `users`.`orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `date` TIMESTAMP NOT NULL,
  `status` INT NOT NULL,
  PRIMARY KEY (`id`));
  ALTER TABLE `users`.`orders` 
  CHANGE COLUMN `date` `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ;
  
  CREATE TABLE `users`.`orders_pics` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `price` VARCHAR(50) NOT NULL,
  `count` INT NOT NULL,
  PRIMARY KEY (`id`));