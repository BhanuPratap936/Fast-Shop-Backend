const {place_order, get_customer_dashboard_data, get_orders, get_order_details} = require('../../controllers/order/orderController')
const router = require('express').Router()

router.post('/home/order/place-order', place_order)
router.get('/home/customer/get-dashboard-data/:userId',get_customer_dashboard_data)
router.get('/home/customer/get-orders/:customerId/:status', get_orders)
router.get('/home/customer/get-order-details/:orderId', get_order_details)

module.exports = router