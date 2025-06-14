const mongoose = require('mongoose')

const sellerCustomerSchema = new mongoose.Schema({
    myId: {
        type: String,
        required: true
    },
    myCustomers: {
        type: Array,
        default: []
    },
    
}, {timestamps: true})

module.exports = mongoose.model('seller_customers', sellerCustomerSchema)