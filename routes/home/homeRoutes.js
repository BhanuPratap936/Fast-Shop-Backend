const {get_categories, get_products, price_range_product, query_products, product_details} = require('../../controllers/home/homeController')

const router = require('express').Router()

router.get('/home/get-categories', get_categories)
router.get('/home/get-products', get_products)
router.get('/home/price-range-latest-product', price_range_product)
router.get('/home/query-products', query_products)
router.get('/home/product-details/:slug', product_details)

module.exports = router