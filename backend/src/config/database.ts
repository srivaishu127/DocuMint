// MySQL Database Connection Pool
// Uses connection pooling for better performance and resource management
// Configuration loaded from .env for security

import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // Max 10 concurrent connections
  queueLimit: 0         // Unlimited queue                
});

const promisePool = pool.promise();

// Test database connection on startup and log result

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    console.error('Full Error:', err);
    return;
  }
  console.log('✅ Database connected successfully');
  connection.release();
});

export default promisePool;
