const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'b3mcndyz0sd1qv7c2dtg-mysql.services.clever-cloud.com',
    user: 'ufrul2lrzklsgaf6',
    password: '2o70JrV1ve9BabMAVR0L',
    database: 'b3mcndyz0sd1qv7c2dtg',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('MySQL Connected...');
});

module.exports = db;