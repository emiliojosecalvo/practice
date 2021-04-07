const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressError = require('./utils/expressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');



const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

const port = 3000;
const app = express();

//Set the path to the database
mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });

//connect to the database 
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database Connected');
});

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

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

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