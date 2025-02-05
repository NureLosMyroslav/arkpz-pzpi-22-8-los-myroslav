const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    options: {
        encrypt: false, // Установи true, если используешь Azure
        enableArithAbort: true,
        trustServerCertificate: true // Если есть проблемы с сертификатами
    }
};

// Подключение к базе данных
async function connectDB() {
    try {
        await sql.connect(config);
        console.log('✅ Успешное подключение к MSSQL');
    } catch (err) {
        console.error('❌ Ошибка подключения к MSSQL:', err.message);
    }
}

connectDB();
console.log('DB Config:', config);

module.exports = sql;
