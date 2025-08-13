-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS hotel_reservas;
USE hotel_reservas;

-- Tabla de tipos de habitación (catálogo)
CREATE TABLE IF NOT EXISTS room_types (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(100) NOT NULL UNIQUE,
  capacity        INT          NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL
);

-- Tabla de habitaciones
CREATE TABLE IF NOT EXISTS rooms (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  room_type_id  INT          NOT NULL,
  status        ENUM('Disponible','Ocupada','Mantenimiento') NOT NULL DEFAULT 'Disponible',
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_type_id) REFERENCES room_types(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  INDEX (status)
) ENGINE=InnoDB;

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservations (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  first_name    VARCHAR(100),
  last_name     VARCHAR(100),
  email         VARCHAR(100),
  phone         VARCHAR(30),
  country       VARCHAR(100),
  city          VARCHAR(100),
  checkin_date  DATE,
  checkout_date DATE,
  guests        INT,
  room_type     VARCHAR(100),
  comments      TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mensajes de contacto
CREATE TABLE IF NOT EXISTS contact_messages (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  full_name    VARCHAR(100),
  email        VARCHAR(100),
  message      TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ubicaciones favoritas (para formulario personalizado/API propia)
CREATE TABLE IF NOT EXISTS favorite_locations (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(100) NOT NULL,
  description  TEXT,
  image_url    VARCHAR(300),
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

