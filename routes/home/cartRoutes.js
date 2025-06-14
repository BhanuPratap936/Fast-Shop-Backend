const { add_to_cart, get_cart_products, delete_cart_products, quantity_inc, quantity_dec, add_wishlist, get_wishlist, remove_wishlist } = require('../../controllers/home/cartController')
const router = require('express').Router()

router.post('/home/product/add-to-cart', add_to_cart)
router.get('/home/product/get-cart-product/:userId', get_cart_products)
router.delete('/home/product/delete-cart-product/:cart_id', delete_cart_products)
router.patch('/home/product/quantity-inc/:cart_id', quantity_inc)
router.patch('/home/product/quantity-dec/:cart_id', quantity_dec)
router.post('/home/product/add-to-wishlist', add_wishlist)
router.get('/home/product/get-wishlist-products/:userId', get_wishlist)
router.delete('/home/product/remove-wishlist-product/:wishlistId', remove_wishlist)


module.exports = router
