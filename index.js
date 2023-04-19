const express = require('express');
const ejs = require('ejs');
const fs = require('fs').promises;
const index = express();
const bodyParser = require('body-parser');
require('dotenv').config();
index.use(bodyParser.json());
const mysql = require('mysql2');

const {Sequelize, DataTypes} = require('sequelize');

index.use(bodyParser.urlencoded({ extended: true }));

let dbprops = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_USER_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

const sequelize = new Sequelize(dbprops.database, dbprops.user, dbprops.password, {
  host: dbprops.host,
  dialect: 'mysql'
});


const Text = sequelize.define('Text', {
 content: {
    type: DataTypes.STRING,
    allowNull: false
  }

});

sequelize.sync().then(()=>console.log("sync!"));

console.log(dbprops);

// Use body-parser middleware to parse request bodies


index.post('/text/create', async (req, res) => {
  const data = req.body;
  console.log(data);
  const text = await Text.create(data);
  res.status(200).redirect('/text');
});


index.get('/text/read', async (req, res) => {
  const texts = await Text.findAll();
  const data = JSON.parse(JSON.stringify(texts));
  console.log(data);
  res.status(200).json(texts);
});

index.get('/text', async (req, res) => {
  let template = await fs.readFile("./template/frontend.ejs", "utf-8");
  const texts = await Text.findAll();
  const examples = JSON.parse(JSON.stringify(texts));
  let html = ejs.render(template, {examples});
  res.send(html).status(200);
});



// Start the server
const port = 3000;
index.listen(port, () => {
  console.log(`Server running  port ${port}`);
});
