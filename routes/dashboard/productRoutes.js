const { add_product, get_products, get_product, update_product, product_image_update } = require('../../controllers/dashboard/productController')
const authMiddleware = require('../../middlewares/authMiddleware')
const router = require('express').Router()

router.post('/add-product', authMiddleware, add_product)
router.get('/get-products', authMiddleware, get_products)
router.get('/get-product/:productId', authMiddleware, get_product)
router.put('/update-product', authMiddleware, update_product)
router.put('/product-image-update', authMiddleware, product_image_update)

module.exports = router