const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const port = 3000;
const app = express();

//Set the path to the database
mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

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


app.get('/', (req, res) => {
    res.render('home');
})

//Create a new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds`);
})

//Edit an specific campground
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
})

//delete an specific campground
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

//Show all campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

//Show an specific campground
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/details', { campground });
})

//test the connection to database
// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({ title: 'mi casa', description: 'barato' });
//     await camp.save();
//     res.send(camp)
// })

app.listen(port, () => {
    console.log(`listening to port http://localhost:${port}/`);
})