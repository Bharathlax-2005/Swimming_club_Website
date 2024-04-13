const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/applicationForms', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Employee Schema
const employeeSchema = new mongoose.Schema({
    name: String,
    fatherName: String,
    dob: Date,
    address: String,
    contact: String,
    email: String,
    medicalRecord: [String],
    applyDate: Date
});

const Employee = mongoose.model('Employee', employeeSchema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/create', (req, res) => {
    res.sendFile(__dirname + '/public/create.html');
});

app.post('/create', (req, res) => {
    const { name, fatherName, dob, address, contact, email, medicalRecord, applyDate } = req.body;
    const newEmployee = new Employee({
        name,
        fatherName,
        dob,
        address,
        contact,
        email,
        medicalRecord,
        applyDate
    });
    newEmployee.save()
        .then(() => {
            res.send('Application saved successfully');
        })
        .catch(err => {
            console.error(err);
            res.send('Error saving Application try later');
        });
});

// Read route
app.get('/read', (req, res) => {
    Employee.find({})
        .then(employees => {
            res.json(employees);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error reading Application');
        });
});


app.get('/update', (req, res) => {
    // You can send an HTML file for update form here
    res.sendFile(__dirname + '/public/update.html');
});

// Update route
app.post('/update', (req, res) => {
    const { empid, salary } = req.body;
    Employee.findOneAndUpdate({ empid: empid }, { $set: { salary: salary } }, { new: true })
        .then(updatedEmployee => {
            if (!updatedEmployee) {
                res.status(404).send('Employee not found');
            } else {
                res.send('Employee updated successfully');
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error updating employee');
        });
});


// Update route



// Delete route
app.get('/delete', (req, res) => {
    // You can send an HTML file for delete form here
    res.sendFile(__dirname + '/public/delete.html');
});

// Delete route
app.post('/delete', (req, res) => {
    const { empid } = req.body;
    Employee.findOneAndDelete({ empid: empid })
        .then(deletedEmployee => {
            if (!deletedEmployee) {
                res.status(404).send('Employee not found');
            } else {
                res.send('Employee deleted successfully');
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error deleting employee');
        });
});

app.post('/login', async (req, res) => {
    const { email, dob } = req.body;

    try {
        // Query MongoDB to find user based on email and dob
        const user = await Employee.findOne({ email, dob });

        if (!user) {
            // If no user found with provided credentials
            res.status(401).send('Invalid email or date of birth');
            return;
        }

        // If user found, render the profile view
        res.send(`
            <html>
            <head>
                <style>
                    body {  
                        font-family: Arial, sans-serif;
                        background-color: #95C8D8;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 80%;
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #caf0f8;
                        border: 2px dashed #00b4d8;
                        padding: 20px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    h2 {
                        color: #000;
                        text-align: center;
                        margin-top: 30px;
                    }
                    h3 {
                        color: #000;
                        margin-top: 10px;
                    }
                    p {
                        color: #000;
                        margin-top: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>User Profile</h2>
                    <h3>Name: ${user.name}</h3>
                    <p>Father's Name: ${user.fatherName}</p>
                    <p>Date of Birth: ${user.dob}</p>
                    <p>Address: ${user.address}</p>
                    <p>Contact Number: ${user.contact}</p>
                    <p>Email Address: ${user.email}</p>
                    <p>Medical Record: ${user.medicalRecord.join(', ')}</p>
                    <p>Apply Date: ${user.applyDate}</p>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error querying MongoDB for user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === 'elite@gmail.com' && password === 'elite') {
        try {
            // Query MongoDB to find all users
            const users = await Employee.find();

            // If users found, render the profile view in table format
            if (users.length > 0) {
                let userListHTML = `
                    <html>
                    <head>
                        <style>
                            body {  
                                font-family: Arial, sans-serif;
                                background-color: #95C8D8;
                                margin: 0;
                                padding: 0;
                            }
                            table {
                                width: 80%;
                                margin: 20px auto;
                                border-collapse: collapse;
                            }
                            th, td {
                                padding: 8px;
                                text-align: left;
                                border-bottom: 1px solid #ddd;
                            }
                            th {
                                background-color: #007bff;
                                color: white;
                            }
                        </style>
                    </head>
                    <body>
                        <h2>User Profiles</h2>
                        <table>
                            <tr>
                                <th>Name</th>
                                <th>Contact Number</th>
                                <th>Email Address</th>
                                <th>Application Date</th>
                            </tr>
                `;
                
                users.forEach(user => {
                    userListHTML += `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.contact}</td>
                            <td>${user.email}</td>
                            <td>${user.applyDate}</td>
                        </tr>
                    `;
                });

                userListHTML += `
                        </table>
                    </body>
                    </html>
                `;

                res.send(userListHTML);
            } else {
                res.status(404).send('No users found');
            }
        } catch (error) {
            console.error('Error querying MongoDB for users:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(401).send('Invalid email or password');
    }
});


const PORT = process.env.PORT || 4030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});