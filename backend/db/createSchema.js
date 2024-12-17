const db = require('./db');

const createUsersTable = () => {
    const sql = `

        CREATE TABLE employees (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            employee_id VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            phone_number VARCHAR(20),
            department VARCHAR(100),
            date_of_joining DATE,
            role VARCHAR(100)
);
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Users table created successfully.',result);
        }
    });
};

// Call the function to create the table
createUsersTable();