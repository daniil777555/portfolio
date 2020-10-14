CREATE SCHEMA `images` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin ;
CREATE TABLE `images`.`img` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `addres` VARCHAR(128) NOT NULL,
  `size` VARCHAR(128) NOT NULL,
  `clicks` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;
INSERT INTO `images`.`img` ( `addres`, `size`) VALUES ('./big/1.png', '1,31MB');
INSERT INTO `images`.`img` (`addres`, `size`) VALUES ('./big/2.png', '305KB');
INSERT INTO `images`.`img` (`addres`, `size`) VALUES ('./big/3.png', '614KB');
INSERT INTO `images`.`img` (`addres`, `size`) VALUES ('./big/4.png', '131KB');
INSERT INTO `images`.`img` (`addres`, `size`) VALUES ('./big/5.png', '139KB');
INSERT INTO `images`.`img` (`addres`, `size`) VALUES ('./big/6.png', '303KB');




