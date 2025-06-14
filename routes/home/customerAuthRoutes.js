const {customer_register, customer_login} = require('../../controllers/home/customerAuthController')
const router = require('express').Router()

router.post('/customer/customer-register', customer_register)
router.post('/customer/customer-login', customer_login)

module.exports = router