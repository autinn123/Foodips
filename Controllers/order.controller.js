const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Order = require('../models/order.model');

const getOrder = function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  res.render('order', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
};

const checkout = (req, res) => {
  const { fname, email, adr, phone } =
    req.body;
  let errors = [];
  if(!fname || !email || !adr || !phone){
    errors.push({ msg: 'Please enter all fields' });
  }

  /*if (errors.length > 0) {  
    res.render('order', {
      errors,
      fname,
      email,
      adr,
      phone,
    });
  }*/ else {
    const stripe = Stripe("process.env.PUBLIC_KEY")

    fetch('/payment', {
      headers: {"Content-Type": "application/json"},
      method: "POST",
      body: JSON.stringify({
        "product": {
          "name": "iPhone 12",
          "image": "",
          "amount": 100,
          "quantity": 1
          }
        })
      }).then (function (response) {
        return response.json();
      }).then (function (session) {
        return stripe.redirectToCheckout ({sessionId: session.id})
      }).then (function (result) {
        if (result.error) {
          alert(result.error.message)
        }
      }).catch (function (error) {
        console.log("Error",error)
      })
    }
}

module.exports = {
  getOrder,
  checkout
};