const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');

const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

router.get('/new', isLoggedIn, campgrounds.newFormCampground)

router.route('/')
    .get(catchAsync(campgrounds.showCampgrounds))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

router.route('/:id')
    .get(catchAsync(campgrounds.shoAllCampgrounds))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editFormCampground))

module.exports = router;