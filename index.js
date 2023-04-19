const express = require('express');
const index = express();
const bodyParser = require('body-parser');
require('dotenv').config();

let mysql = require('mysql2');
index.use(bodyParser.urlencoded({ extended: true }));

let mysqlOptions = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_USER_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

console.log(mysqlOptions);

let connection = mysql.createConnection(mysqlOptions);



// Use body-parser middleware to parse request bodies
index.use(bodyParser.json());

connection.connect(async function (err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});

// Define a POST route
index.post('/api/myendpoint', (req, res) => {
  // Get data from the request body
  const data = req.body;
  // Do something with the data
  console.log(data.name);
  const query = 'SELECT * FROM Persons';
  connection.query('INSERT INTO Persons SET ?',data ,(error, results) => {
    if (error) throw error;
    res.send(results);
  });
  
  // Return a response
  res.status(200).json({ message: 'Data received' });
});
index.get('/api/get_data', (req, res) => {
  const query = 'SELECT * FROM Persons';
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
index.get('/api/get', (req, res) => {
  res.status(200).json({ message: 'Data received' });
})


// Start the server
const port = 3000;
index.listen(port, () => {
  console.log(`Server running  port ${port}`);
});
