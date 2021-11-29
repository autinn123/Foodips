if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');


const indexRouter = require('./routes/index');
const productRouter = require('./routes/products');


var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }).then(function () {
        console.log("Successfully connected to the database");
    }).catch(function (err) {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));


app.use('/', indexRouter);
app.use('/products', productRouter);

app.listen(process.env.PORT || 3000);