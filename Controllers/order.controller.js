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

const checkout = async (req, res) => {
  var cart = new Cart(req.session.cart);

  const { firstname, email, address, phone } =
    req.body;
  let errors = [];
  if(!firstname || !email || !address || !phone){
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {  
    
    res.render('order', {
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
      errors,
      firstname,
      email,
      address,
      phone,
    });
  } else {
    // create order
    const result = await Order.create({
        userId: req.user._id,
        name: firstname,
        email: email,
        address: address,
        phone: phone,
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
    });


    res.render('order/payment', {
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
    });
    /*const stripe = Stripe("pk_test_51KIBC6CVCcM9rdH2FnpvypVWXNbohFsIJNNIPWhnMB1lAihHbzDC4SEYKeo3DCJUtv5Ea965VYciUm9hGPzbGgEU00k7jjOfAq");

    fetch('/payment', {
      headers: {"Content-Type": "application/json"},
      method: "POST",
      body: JSON.stringify({
        "product": {
          "name": "iPhone 12",
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
      })*/
    }
}

module.exports = {
  getOrder,
  checkout
};