const Campground = require('../models/campground');

//Create a new campground
module.exports.newFormCampground = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    console.log(campground);
    await campground.save();
    req.flash('success', 'Successfully CREATE a new campground');
    res.redirect(`campgrounds/${campground._id}`);
}

//Show all campgrounds
module.exports.showCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

//Show an specific campground
module.exports.shoAllCampgrounds = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}

//Update an specific campground
module.exports.editFormCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully UPDATED a campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

//delete an specific campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully DELETED a campground');
    res.redirect('/campgrounds');
}

