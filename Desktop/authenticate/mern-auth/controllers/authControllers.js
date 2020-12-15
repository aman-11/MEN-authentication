const User = require('../models/user');
const jwt = require('jsonwebtoken');

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    //incorct email
    if (err.message === 'Incorrect email') {
        errors.email = 'That email is not registrered';
    }
    if (err.message === 'Incorrect password') {
        errors.password = 'The password is incorrect';
    }
    //duplicate error
    if (err.code === 11000) {
        errors.email = 'Email already registered';
        return errors;
    }

    //validation error
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

//token jwt
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'aayush aman', {
        expiresIn: maxAge
    });
}


module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async(req, res) => {
    //creaet the user
    const { email, password } = req.body; //destructuring
    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({user:user._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.login_post = async (req, res) => {
    //autenticate the user
    //console.log(req.body);
    const { email,password} = req.body; //destructuring

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({errors});
        
    }
}

module.exports.logout_get = (req,res)=> {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}