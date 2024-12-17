const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "b4oy5b3is5h6dec1htr6-mysql.services.clever-cloud.com",
    user: "uno7rxvxj0nqpecb",
    password: "9WpgCnTLvsEA71yBsfTm",
    database: "b4oy5b3is5h6dec1htr6",
    port: 3306
});

db.connect(err => {
    if (err) {console.error("MySQL connection error:", err.message);
        process.exit(1);}//throw err;
    console.log("MySQL Connected...");
});

module.exports = db;