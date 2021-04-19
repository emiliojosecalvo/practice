const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressError = require('./utils/expressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

//Set the path to the database
mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });

//connect to the database 
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database Connected');
});

const port = 3000;
const app = express();

//Set ejsMate as an engine for ejs
app.engine('ejs', ejsMate);
//Set EJS as a view engine
app.set('view engine', 'ejs');
//Set a path to views folder
app.set('views', path.join(__dirname, '/views'));

//Middleware
// code the info coming from form
app.use(express.urlencoded({ extended: true }));
// override with ?_method=
app.use(methodOverride('_method'));
//Set up public directory
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'nosecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

//passport configs
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // if (!['/', '/login'].includes(originalUrl)) {
    //     req.session.returnTo = req.originalUrl;
    // }
    if (!['/login', '/register', '/', '/logout'].includes(req.originalUrl)) {
        // console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

//Validate the url
app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404));
})

//middleware to show errors and redirect to the error page
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) { err.message = 'Something went wrong' }
    res.status(statusCode).render('error', { err });
})

app.listen(port, () => {
    console.log(`listening to port http://localhost:${port}/`);
})