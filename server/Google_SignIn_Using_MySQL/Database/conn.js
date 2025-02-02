const mysql = require('mysql2/promise');  

const conn = mysql.createPool({
    host: '127.0.0.1',
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: 3306
});

conn.getConnection()
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

module.exports = conn;
