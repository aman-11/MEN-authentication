const { Router } = require('express');

const authControllers = require('../controllers/authControllers');

const router = Router();

router.get('/signup', authControllers.signup_get); //go to sign up page
router.post('/signup', authControllers.signup_post); //add new user
router.get('/login', authControllers.login_get); //gto to the ;ogin page
router.post('/login', authControllers.login_post); //fetch the user and authenticate
router.get('/logout', authControllers.logout_get);

module.exports = router;