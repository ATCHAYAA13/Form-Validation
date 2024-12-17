const express = require("express");
const db = require("./db/db.js")
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Atc@mysql13",
//     database: "employee_management"
// });

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "password",
//     database: "employee",
//     port: 3307,
//     connectTimeout: 10000 
  
// });



app.post("/add-employee", (req, res) => {
    const { name, employee_id, email, phone_number, department, date_of_joining, role } = req.body;
    const sql = "INSERT INTO employees (name, employee_id, email, phone_number, department, date_of_joining, role) VALUES (?, ?, ?, ?, ?, ?, ?)";

    console.log("SQL Query:", db.format(sql, [name, employee_id, email, phone_number, department, date_of_joining, role]));


    db.query(sql, [name, employee_id, email, phone_number, department, date_of_joining, role], (err, result) => {
        if (err) {
            console.error("Database Error:", err.message);
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).send("Duplicate entry for Employee ID or Email.");
            } else {
                res.status(500).send("Error saving employee details.");
            }
        } else {
            res.status(200).send("Employee added successfully!");
        }
    });
});

app.get("/get-employees", (req, res) => {
    const sql = "SELECT * FROM employees";
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ 
                error: "Error fetching employees",
                details: err.message 
            });
        }

        res.status(200).json(results);
    });
});

app.put("/update-employee/:employee_id", (req, res) => {
    const { employee_id } = req.params;
    const { name, email, phone_number, department, date_of_joining, role } = req.body;

    const sql = `
        UPDATE employees 
        SET name = ?, email = ?, phone_number = ?, department = ?, date_of_joining = ?, role = ?
        WHERE employee_id = ?
    `;

    const formattedDate = new Date(date_of_joining).toISOString().split('T')[0];

    db.query(
        sql, 
        [name, email, phone_number, department, formattedDate, role, employee_id], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ 
                    error: "Error updating employee",
                    details: err.message 
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Employee not found" });
            }

            res.status(200).json({ 
                message: "Employee updated successfully",
                employeeId: employee_id 
            });
        }
    );
});

app.delete("/delete-employee/:employee_id",(req,res)=>{
    const { employee_id } = req.params;
    const sql = 'DELETE FROM employees WHERE employee_id=?';
    db.query(sql,[employee_id],(err,result)=>{
        if (err){
            return res.status(500).json({ 
                error: "Error deleting employee",
                details: err.message 
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.status(200).json({ 
            message: "Employee deleted successfully",
            employeeId: employee_id 
        });

    })
})

app.listen(5000, () => {
    console.log("Server started on port 5000");
});