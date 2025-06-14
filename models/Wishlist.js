const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('wishlists', wishlistSchema)