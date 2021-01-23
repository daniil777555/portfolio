create schema if not exists shop;
use shop;
DROP TABLE IF EXISTS catalogs;
CREATE TABLE catalogs (
  id serial primary key,
  name VARCHAR(255)
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id serial primary key,
  name VARCHAR(255),
  birthday_at DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT = 'Покупатели';

insert into users(name, birthday_at) values
("Mark", "2000.04.01"),
("John", "1990.07.21"),
("Anna", "1996.11.11");

DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id serial primary key,
  name VARCHAR(255),
  desription TEXT,
  price DECIMAL (11,2),
  catalog_id INT UNSIGNED,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id serial primary key,
  user_id INT UNSIGNED,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS orders_products;
CREATE TABLE orders_products (
  id serial primary key,
  order_id INT UNSIGNED,
  product_id INT UNSIGNED,
  total INT UNSIGNED DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS discounts;
CREATE TABLE discounts (
  id serial primary key,
  user_id INT UNSIGNED,
  product_id INT UNSIGNED,
  discount FLOAT UNSIGNED,
  finished_at DATETIME NULL,
  started_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS storehouses;
CREATE TABLE storehouses (
  id serial primary key,
  name VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS storehouses_products;
CREATE TABLE storehouses_products (
  id serial primary key,
  storehouse_id INT UNSIGNED,
  product_id INT UNSIGNED,
  value INT UNSIGNED,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PAST HW
insert into catalogs(name) values
('Videocards'),
('Keyboards'),
('Processors'),
('Laptops'),
('Mouses');
update catalogs set name='empty' where id and name='';


create schema if not exists files;
use files;
DROP TABLE IF EXISTS elements;
CREATE TABLE elements(
id int not null auto_increment primary key,
name_id INT NOT NULL,
type_id int not null
);

DROP TABLE IF EXISTS `names`;
CREATE TABLE `names`(
id int not null auto_increment primary key,
file_name varchar(1024) NOT NULL,
`path` varchar(1024) NOT NULL
);

DROP TABLE IF EXISTS `types`;
CREATE TABLE `types`(
id int not null auto_increment primary key,
tipe_name varchar(128) NOT NULL
);

ALTER TABLE elements
ADD CONSTRAINT `fk_id_file`
  FOREIGN KEY (`name_id`)
  REFERENCES `names` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_id_type`
  FOREIGN KEY (`type_id`)
  REFERENCES `types` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

insert into `names`(file_name, `path`) values('name', 'path');
insert into `types`(tipe_name) values('type');
insert into `elements`(name_id, type_id) values(1, 1); /*Will be good*/
insert ignore into `elements`(name_id, type_id) values(2, 2); /*Will be error*/


create schema if not exists exam;
use exam;
DROP TABLE IF EXISTS cat;
CREATE TABLE cat(
id serial primary key,
name VARCHAR(255)
);

insert into cat(name) values
('1234'),
('asfd'),
('asfd');


UPDATE cat
SET name = (SELECT name
FROM shop.catalogs
WHERE cat.id = catalogs.id) 
where id;


/*
use shop;
update users set created_at = DATE_FORMAT(now(), '%d%m%Y%H%i'), 
updated_at = DATE_FORMAT(now(), '%d%m%Y%H%i') where id;
*/
    


use shop;
insert into `storehouses_products`(storehouse_id, product_id, value) values
(1, 1, 3),
(2, 2, 0),
(3, 3, 2),
(4, 4, 0),
(5, 5, 23),
(6, 6, 11),
(7, 7, 8),
(8, 8, 4);

select * from  `storehouses_products` order by value != 0 desc, value;

SELECT * FROM catalogs where id in (5, 1, 2) order by FIELD( id, 5, 1, 2);


select round(avg(year(now()) - year(birthday_at))) as AVG_Year_of_Users from users;
 

select dayname(birthday_at) as Name_of_Day, count(*) from users group by Name_of_Day;


DROP TABLE IF EXISTS `table`;
CREATE TABLE `table`(mult INT);
insert into `table` values 
(1),(2),(3),(4),(5);

select round(exp(SUM(log(mult)))) as multiply from `table` ;

insert into orders(user_id) values 
(1),(2);
select users.name from users where users.id in (select user_id from orders);

INSERT INTO `shop`.`products` (`name`, `desription`, `price`, `catalog_id`) VALUES ('pr1', 'desc', '1200', '1');
INSERT INTO `shop`.`products` (`name`, `desription`, `price`, `catalog_id`) VALUES ('pr2', 'desc', '3454', '2');
INSERT INTO `shop`.`products` (`name`, `desription`, `price`, `catalog_id`) VALUES ('pr3', 'desc', '4542', '4');
INSERT INTO `shop`.`products` (`name`, `desription`, `price`, `catalog_id`) VALUES ('pr4', 'desc', '56464', '2');
INSERT INTO `shop`.`products` (`name`, `desription`, `price`, `catalog_id`) VALUES ('pr5', 'desc', '4453', '3');

select products.name, products.price, catalogs.name from products 
inner join catalogs on catalogs.id = products.catalog_id;


start transaction;

insert into example.users set name = (select name from shop.users where id = 1);

commit;

create or replace view pr_cat(pr_name, cat_name) as 
select products.name, catalogs.name from products 
inner join catalogs on catalogs.id = catalog_id;

select * from pr_cat;

-- SELECT *, id as f_id,
-- if((select DATE_FORMAT(created_at, '%Y-%m-%d') from products where f_id = id) in (select date_aug from table_name) , 1, 0 ) 
-- as num FROM products;  
-- На счет этого - f_id, оно играет роль id для столбца num чтобы даты выдавались по одной, а не списком ( where f_id = id ). 
-- date_aug, table_name таких столбца и таблицы у меня нет, не хотелось создавать, но по-плану все работает, у кого есть может попробовать.


DROP TABLE IF EXISTS acc;
create table acc(
id serial primary key,
name VARCHAR(255),
pass VARCHAR(25)
);

create or replace view v_acc(id, name) as select id, name from acc;

DELIMITER //
drop function if exists hello//
create function hello()
returns text deterministic
begin
	if(CURRENT_TIME() >= '06:00:00' and CURRENT_TIME() <= '12:00:00') then return 'Good morning';
    elseif(CURRENT_TIME() >= '12:00:00' and CURRENT_TIME() <= '18:00:00')then return 'Good afternoon';
    elseif(CURRENT_TIME() >= '18:00:00' and CURRENT_TIME() <= '00:00:00')then return 'Good evening';
    else return 'Good night';
    end if;
end//

select hello() as ': )';
 

DELIMITER //
drop trigger if exists not_null//
create trigger not_null before insert on products
for each row 
begin 
	if new.name is null and new.desription is null then 
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ERROR';
    end if;
end//

DELIMITER ;

-- insert into products(price, catalog_id) value( 1234, 2);

drop table if exists fab;
create table fab(
id serial primary key,
val INT
);
insert into fab(val) values (1), (1); -- Для того что бы можно было начать вычислять значения

DELIMITER //

drop function if exists fab_f//
create function fab_f(i int)
returns int deterministic
begin
 return (select val from fab where id = i - 1) + (select val from fab where id = i - 2) ;
end// -- Пришлось создать функцию поскольку такой селект(как возвращает эта функция) вызывает ошибку при вставке значения в строке 295.
-- Функция же уже посчитала значение и просто возвращает число. Буду рад другим вариантам, сам не смог придумать что то лучше.

drop procedure if exists fab_n//
CREATE PROCEDURE fab_n (in n int)
BEGIN
	DECLARE i INT DEFAULT 3;
    
	if n > 0 then
	  WHILE i <= n DO
		insert into fab(val) value (fab_f(i));
        SET i = i + 1;
	  END WHILE;
	end if;
END//

DELIMITER ;
call fab_n(27);

-- PAST HW





-- Task 1
drop table if exists logs;
create table logs(
id_pk int not null,
value_of_name char(250) not null,
table_name char(250) not null,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP not null
)
ENGINE = ARCHIVE;

DELIMITER //
drop trigger if exists tr_for_users//
create trigger tr_for_users after insert on users
for each row
begin
	insert into logs(id_pk, value_of_name, table_name) value (new.id, new.name, 'users');
end//

drop trigger if exists tr_for_catalogs//
create trigger tr_for_catalogs after insert on catalogs
for each row
begin
	insert into logs(id_pk, value_of_name, table_name) value (new.id, new.name, 'catalogs');
end//

drop trigger if exists tr_for_products//
create trigger tr_for_products after insert on products
for each row
begin
	insert into logs(id_pk, value_of_name, table_name) value (new.id, new.name, 'products');
end//
DELIMITER ;

insert into users(name, birthday_at) value('Ivan', '1994-12-05');
insert into products(name, desription, price, catalog_id) value('pr7', 'desc', 35354, 6);
insert into catalogs(name) value('PC');

-- Task 2

drop procedure if exists million_users;

DELIMITER //
create procedure million_users()
begin
	declare i int default 1000000;
	REPEAT  
		insert into users(name, birthday_at) value (1000000 - i, null);
		set i = i - 1;
	UNTIL i < 0 end repeat;  
end//
DELIMITER ;
-- По плану должно работать, но почему-то максиму заполняется 1000 строк и больше нет, дальше только ошибка.
call million_users();