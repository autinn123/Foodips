if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');

const app = express();
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const $ = require('jquery');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');

require('./config/passport')(passport);

const indexRouter = require('./routes/index');
const productRouter = require('./routes/products');
const userRouter = require('./routes/user');
const apiRouter = require('./api/product');

var mongoose = require('mongoose');
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function () {
    console.log('Successfully connected to the database');
  })
  .catch(function (err) {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
  });

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(methodOverride('_method'));

//fetch data from the request
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

//express session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);

// Passport middleware
app.use(passport.initialize()); //middleware is called at each request, check the session to get passport.user, if not, create empty.
app.use(passport.session()); //middleware use script passport, use session get user information and mount to req.user.

//connect flash
app.use(flash());

//global vars
app.use(function (req, res, next) {
  res.locals.user = req.user;
  res.locals.session = req.session;
  next();
});

//set the path of the jquery file to be used from the node_module jquery package
app.use(
  '/jquery',
  express.static(path.join(__dirname + '/node_modules/jquery/dist/'))
);

app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/user', userRouter);
app.use('/api/product', apiRouter);

app.all('*', (req, res) => {
  res.status(404).send('<h1 >404! Page not found</h1>');
});

app.listen(process.env.PORT || 3000);
