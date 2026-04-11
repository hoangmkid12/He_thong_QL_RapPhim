const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cinepass',
  charset: 'utf8mb4',
  timezone: '+07:00',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

/**
 * Execute a SQL query (SELECT) - returns array of rows
 */
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/**
 * Execute a SQL query - returns first row only
 */
async function queryOne(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows[0] || null;
}

/**
 * Execute INSERT/UPDATE/DELETE - returns result info
 */
async function execute(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}

/**
 * Execute INSERT - returns inserted ID
 */
async function insert(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result.insertId;
}

/**
 * Execute query in a transaction
 */
async function transaction(callback) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { pool, query, queryOne, execute, insert, transaction };
