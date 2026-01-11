import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

//MySQL Database Connection Pool
//Configuration is loaded from .env file for security.

const pool = mysql.createPool({
  host: process.env.DB_HOST,       // Database server (localhost)
  port: Number(process.env.DB_PORT) || 3306, // Database port (default 3306)
  user: process.env.DB_USER,       // MySQL username (root)
  password: process.env.DB_PASSWORD, // MySQL password
  database: process.env.DB_NAME,   // Database name (documents_management)
  waitForConnections: true,        
  connectionLimit: 10,          
  queueLimit: 0                
});

const promisePool = pool.promise();

//Test database connection on startup

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    console.error('Full Error:', err);
    return;
  }
  console.log('✅ Database connected successfully');
  connection.release(); // Return connection to pool
});

export default promisePool;
