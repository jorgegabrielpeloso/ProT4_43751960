-- script/libros.sql

CREATE DATABASE IF NOT EXISTS `rest-api`;
USE `rest-api`;

DROP TABLE IF EXISTS `libros`;

CREATE TABLE `libros` (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(30) NOT NULL,
  autor VARCHAR(30) NOT NULL,
  categoria VARCHAR(30) NOT NULL,
  `año-publicacion` DATE NOT NULL,
  isbn VARCHAR(13) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (isbn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Lote de prueba con libros de Marvel

INSERT INTO `libros` (nombre, autor, categoria, `año-publicacion`, isbn) VALUES
('Spider-Man', 'Stan Lee', 'Superhéroes', '1962-08-01', '9788490167307'),
('Iron Man', 'Stan Lee', 'Superhéroes', '1963-03-01', '9788490167890'),
('Thor', 'Stan Lee', 'Superhéroes', '1962-09-01', '9788490167335'),
('Capitán América', 'Joe Simon', 'Superhéroes', '1941-03-01', '9788490167314'),
('Hulk', 'Stan Lee', 'Superhéroes', '1962-05-01', '9788490167999'),
('Doctor Strange', 'Steve Ditko', 'Superhéroes', '1963-07-01', '9788498859595'),
('Black Panther', 'Stan Lee', 'Superhéroes', '1966-07-01', '9788402420005'),
('Guardianes Galaxia', 'Brian M. Bendis', 'Superhéroes', '2008-05-01', '9788416986254');
