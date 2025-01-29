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


module.exports = {
    get_seller_request
}