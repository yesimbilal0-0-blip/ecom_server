const express = require('express');
const dotenv = require('dotenv').config();
const dbconnection = require('./config/dbConfig');

const Admin = require('./models/adminModel');
const Seller = require('./models/sellerModel.js');
const Customer = require('./models/customerModel');

const Product = require('./models/productModel');

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/user', require('./routes/userRoutes.js'));
app.use('/product', require('./routes/productRoutes.js'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})