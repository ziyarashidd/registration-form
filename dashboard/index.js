const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "company",
    password: "ziyarashid@786",
});


//create route
app.get("/", (req, res) => {
    let q = `SELECT count(*) from employee`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in the database")
    }
})

// Show route (display all employees)
app.get("/user", (req, res) => {
    let q = `SELECT * FROM employee`;
    try {
        connection.query(q, (err, employees) => {
            if (err) throw err;
            res.render("showemployee.ejs", { employees });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in the database")
    }
});

// Edit route (fetch employee details)
app.get("/user/:id/edit", (req, res) => {
    const { id } = req.params;
    const q = `SELECT * FROM employee WHERE id = ?`;

    try {
        connection.query(q, [id], (err, result) => {
            if (err) throw err;

            // Check if the result is empty
            if (result.length === 0) {
                return res.status(404).send("Employee not found");
            }

            const employee = result[0];

            // Ensure course is always an array
            // employee.course = (employee.course && Array.isArray(employee.course)) 
            //                           ? employee.course 
            //                           : (employee.course ? employee.course.split(',') : []);

            // Render the edit page with employee data
            res.render("edit.ejs", { employee });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in the database");
    }
});

// Update route (update employee details)
app.patch("/user/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, phone, gender, course } = req.body;  // Collecting form data

    // Check if any required field is missing
    if (!name || !email || !phone || !gender) {
        return res.status(400).send("Missing required fields.");
    }

    const courseList = course ? course.join(', ') : ''; // Store course as a comma-separated string

    const q = `UPDATE employee SET name = ?, email = ?, phone = ?, gender = ?, course = ? WHERE id = ?`;
    try {
        connection.query(q, [name, email, phone, gender, courseList, id], (err, result) => {
            if (err) throw err;
            res.redirect("/user");  // Redirect to the user list after updating
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in the database")
    }
});


// Route to show the add form
app.get("/user/new", (req, res) => {
    res.render("add.ejs");  // Render the add form page
});
// Route to handle the form submission (creating a new employee)
app.post("/user", (req, res) => {
    const { name, email, phone, gender, course, designation } = req.body;  // Get the designation from the form data

    // Check if all required fields are provided
    if (!name || !email || !phone || !gender || !designation) {
        return res.status(400).send("Missing required fields.");
    }

    // Ensure `course` is an array before calling `.join()`
    const courseList = Array.isArray(course) ? course.join(', ') : (course ? course : ''); // If it's not an array, treat it as a single value or empty string

    // Set a default or current date if the `date` column is required
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');  // Format as YYYY-MM-DD HH:MM:SS

    // Adjust the INSERT query to include all the fields
    const q = `INSERT INTO employee (name, email, phone, gender, course, designation, date) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    try {
        connection.query(q, [name, email, phone, gender, courseList, designation, date], (err, result) => {
            if (err) throw err;
            res.redirect("/user");  // Redirect to the list of employees
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in the database");
    }
});


// Delete route to show the confirmation page
app.get("/user/:id/delete", (req, res) => {
    const { id } = req.params;
    const q = `SELECT * FROM employee WHERE id = ?`;

    try {
        connection.query(q, [id], (err, result) => {
            if (err) throw err;

            // If the employee is not found, return a 404 error
            if (result.length === 0) {
                return res.status(404).send("Employee not found");
            }

            // Render the delete confirmation page with employee data
            res.render("delete.ejs", { employee: result[0] });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in the database");
    }
});

// Delete route to handle the actual deletion from the database
app.delete("/user/:id", (req, res) => {
    const { id } = req.params;
    const q = `DELETE FROM employee WHERE id = ?`;

    try {
        connection.query(q, [id], (err, result) => {
            if (err) throw err;

            // Redirect back to the list of users after deletion
            res.redirect("/user");
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in the database");
    }
});


// Delete route to show the confirmation page
app.get("/user/:id/delete", (req, res) => {
    const { id } = req.params;
    const q = `SELECT * FROM employee WHERE id = ?`;

    try {
        connection.query(q, [id], (err, result) => {
            if (err) throw err;

            // If the employee is not found, return a 404 error
            if (result.length === 0) {
                return res.status(404).send("Employee not found");
            }

            // Render the delete confirmation page with employee data
            res.render("delete.ejs", { employee: result[0] });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in the database");
    }
});

// Delete route to handle the actual deletion from the database
app.delete("/user/:id", (req, res) => {
    const { id } = req.params;
    const q = `DELETE FROM employee WHERE id = ?`;

    try {
        connection.query(q, [id], (err, result) => {
            if (err) throw err;

            // Redirect back to the list of users after deletion
            res.redirect("/user");
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in the database");
    }
});


// Start the server
app.listen("8080", () => {
    console.log("Server is listening on port 8080");
});
