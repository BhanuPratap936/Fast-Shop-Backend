const {get_seller_request, get_seller, seller_status_update} = require('../../controllers/dashboard/sellerController')
const authMiddleware = require('../../middlewares/authMiddleware')
const router = require('express').Router()

router.get('/get-seller-request', authMiddleware, get_seller_request)
router.get('/get-seller/:sellerId', authMiddleware, get_seller)
router.post('/seller-status-update', authMiddleware, seller_status_update)
module.exports = router