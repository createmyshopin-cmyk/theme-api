require('dotenv').config({ path: '.env.local' })
const mysql = require('mysql2/promise')

async function init() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })

  console.log('Connected to MySQL')

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``)
  await conn.query(`USE \`${process.env.DB_NAME}\``)

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS licenses (
      id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      phone         VARCHAR(20)  NOT NULL UNIQUE,
      license_code  CHAR(6)      NOT NULL UNIQUE,
      shop_domain   VARCHAR(255) DEFAULT NULL,
      store_name    VARCHAR(255) DEFAULT NULL,
      activated_at  DATETIME     DEFAULT NULL,
      is_active     TINYINT(1)   NOT NULL DEFAULT 0,
      created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      notes         TEXT         DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)

  // Add store_name column to existing tables (safe — IF NOT EXISTS equivalent)
  await conn.execute(`
    ALTER TABLE licenses ADD COLUMN IF NOT EXISTS store_name VARCHAR(255) DEFAULT NULL AFTER shop_domain
  `).catch(() => {})
  console.log('Table `licenses` ready')

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS whatsapp_registrations (
      id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      whatsapp      VARCHAR(20)  NOT NULL,
      shop_domain   VARCHAR(255) NOT NULL,
      code          CHAR(6)      NOT NULL,
      activated     TINYINT(1)   NOT NULL DEFAULT 0,
      activated_at  DATETIME     DEFAULT NULL,
      created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_shop_wa (shop_domain, whatsapp)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
  // Safe migrations for existing table
  await conn.execute(`ALTER TABLE whatsapp_registrations ADD COLUMN IF NOT EXISTS activated TINYINT(1) NOT NULL DEFAULT 0`).catch(()=>{})
  await conn.execute(`ALTER TABLE whatsapp_registrations ADD COLUMN IF NOT EXISTS activated_at DATETIME DEFAULT NULL`).catch(()=>{})
  console.log('Table `whatsapp_registrations` ready')

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS theme_updates (
      id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title       VARCHAR(255) NOT NULL,
      message     TEXT         NOT NULL,
      is_active   TINYINT(1)   NOT NULL DEFAULT 1,
      created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
  console.log('Table `theme_updates` ready')

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS activation_log (
      id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      license_id    INT UNSIGNED NOT NULL,
      shop_domain   VARCHAR(255) NOT NULL,
      ip_address    VARCHAR(45)  DEFAULT NULL,
      action        ENUM('activate','deactivate','verify') NOT NULL,
      created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (license_id) REFERENCES licenses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
  console.log('Table `activation_log` ready')

  await conn.end()
  console.log('Database initialized successfully.')
}

init().catch(err => { console.error(err); process.exit(1) })
