const express = require('express');
const router = express.Router();

const controller = require('../Controllers/user.controller');
const cartController = require('../Controllers/cart.controller');
const Authenticated = require('../middleware/auth').checkAuthenticated;
const notAuthenticated = require('../middleware/auth').checkNotAuthenticated;

router.get('/', Authenticated, controller.loadProfile);

router.post('/sign-up', controller.signup);
router.post('/sign-in', notAuthenticated, controller.signIn);
router.get('/signout', Authenticated, controller.signOut);
router.patch('/:id', controller.updateInfo);
router.patch('/update_password/:id', controller.updatePassword);

module.exports = router;
