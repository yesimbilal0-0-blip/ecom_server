const express = require('express');
const dotenv = require('dotenv').config();
const connection = require('./config/dbConfig');

const User = require('./models/userModel');
const Product = require('./models/productModel');

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})