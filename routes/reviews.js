const express = require('express');
const router = express.Router({ mergeParams: true });

const { reviewSchema } = require('../schemas.js');

const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');

const Review = require('../models/review');
const Campground = require('../models/campground');


//Validate with Joi if all data coming from the form (Review)
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}

//Add a review to an specific campground
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Your Review has been added');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//DELETE a review to an specific campground
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findOneAndDelete(reviewId);
    req.flash('success', ' review has been Successfully deleted');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;