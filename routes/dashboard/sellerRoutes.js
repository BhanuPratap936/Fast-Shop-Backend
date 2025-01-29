const {get_seller_request} = require('../../controllers/dashboard/sellerController')
const authMiddleware = require('../../middlewares/authMiddleware')
const router = require('express').Router()

router.get('/get-seller-request', authMiddleware, get_seller_request)

module.exports = router