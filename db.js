const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const promisePool = pool.promise();

async function executeQuery(query, params) {
    try {
        const [results] = await promisePool.query(query, params);
        return results;
    } catch (err) {
        console.error('Errore durante l\'esecuzione della query:', err);
        throw err;
    }
}

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Errore di connessione al database:', err);
        return;
    }
    console.log('Connesso al database MySQL/MariaDB!');
    connection.release(); 
});

module.exports = { executeQuery, promisePool };
