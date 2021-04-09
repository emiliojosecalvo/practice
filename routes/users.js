const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

//Create a new User
router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to Yelpcamp ${username}`);
            res.redirect('campgrounds');
        });

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }

}))

//log In an User
router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome to Yelpcamp');
    //Makes to an user to go back to the page were he was before log In.
    const redirectURL = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectURL);
})

//Logout an user
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
})

module.exports = router;
