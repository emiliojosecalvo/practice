const User = require('../models/user');

//Create a new User
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
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

}

//log In an User
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

//Logout an user
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
}

