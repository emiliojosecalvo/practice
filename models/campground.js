const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;


const imagesSchema = new Schema({
    url: String,
    filename: String
})

imagesSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };


const campgroundSchema = new Schema({
    title: String,
    images: [imagesSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

//create a virtual to send info to the cluster map
campgroundSchema.virtual('properties').get(function () {
    return {
        id: this._id,
        title: this.title
    }
});


campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);