const formidable = require('formidable')
const cloudinary = require('cloudinary').v2
const Seller = require('../../models/Seller')

const get_seller_request = async (req, res) => {

    const {page, searchValue, perPage} = req.query
    const skipPage = parseInt(perPage) * (parseInt(page) - 1)

    try {
        if (searchValue) {

        } else {
            const sellers = await Seller.find({
                status: 'pending'
            }).skip(skipPage).limit(perPage).sort({createdAt: -1})

            const totalSeller = await Seller.find({
                status: 'pending'
            }).countDocuments()

            res.status(200).json({sellers, totalSeller})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const get_seller = async (req, res) => {
    const {sellerId} = req.params
    try {
        const seller = await Seller.findById(sellerId)
        res.status(200).json({seller})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const seller_status_update = async (req, res) => {
    const {sellerId, status} = req.body
    try {
        const seller = await Seller.findByIdAndUpdate(sellerId, {status},
            {new: true}
        )
        res.status(200).json({seller, msg: 'Seller Status Updated'})
    } catch (error) {
        res.status(500).json({error: error.message})        
    }
}

module.exports = {
    get_seller_request,
    get_seller,
    seller_status_update
}