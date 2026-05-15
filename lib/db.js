import mysql from 'mysql2/promise'

let pool

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.DB_HOST     || '127.0.0.1',
      port:     parseInt(process.env.DB_PORT || '3306'),
      user:     process.env.DB_USER     || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      connectTimeout: 10000,
    })
  }
  return pool
}

export async function query(sql, params) {
  try {
    const pool = getPool()
    const [rows] = await pool.execute(sql, params)
    return rows
  } catch (err) {
    console.error('[DB ERROR]', err.message, '| SQL:', sql)
    throw err
  }
}
