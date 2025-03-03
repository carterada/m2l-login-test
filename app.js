const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({path: './.env'});

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

const publicDirectory = path.join(__dirname, './public');

app.use(express.static(publicDirectory));

//parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}));
//parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set('view engine', 'hbs')

db.connect( (error) => {
    if(error) {
        console.log(error);
    }
    else {
        console.log('MySQL connected');
    }
});

//define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});