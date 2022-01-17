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
const stripe = require('stripe')("process.env.PRIVATE_KEY")

require('./config/passport')(passport);

const indexRouter = require('./routes/index');
const productRouter = require('./routes/products');
const userRouter = require('./routes/user');
const apiProductRouter = require('./api/product');
const apiRouter = require('./api');

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
app.use('/api/product', apiProductRouter);
app.use('/api', apiRouter);

app.all('*', (req, res) => {
  res.status(404).send('<h1 >404! Page not found</h1>');
});

// middleware
app.use(express.json());
// route
app.post("/payment", async (req, res) => {
  const {product} = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image]
          },
          unit_amount: product.amount * 100,
        },
        quantity: product.quantity,
      }
    ],
    mode: "payment",
    success_url: '${YOUR_DOMAIN}',
    cancel_url: '${YOUR_DOMAIN}'
  })

  res.json({id: session.id})
})

app.listen(process.env.PORT || 3000);
