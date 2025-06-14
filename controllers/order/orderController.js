const Cart = require('../../models/Cart');
const CustomerOrder = require('../../models/CustomerOrder')
const AuthOrder = require('../../models/AuthOrder.js')
const Wishlist = require('../../models/Wishlist.js')
const moment = require("moment");
const {mongo: {ObjectId}} = require('mongoose')

const paymentCheck = async(id) => {
    try {
        const order = await CustomerOrder.findById(id)
        if (order.payment_status === 'unpaid') {
            await CustomerOrder.findByIdAndUpdate(id, {
                delivery_status: 'cancelled'
            })
            await AuthOrder.updateMany({
                orderId: id
            }, {
                delivery_status: 'cancelled'
            })
        }
        return true
    } catch (error) {
        console.log(error);
               
    }
}

const place_order = async (req, res) => {
    // console.log(req.body);
    const {price, products, shipping_fee, shippingInfo, userId} = req.body
    let authorOrderData = []
    let cartId = []
    const tempDate = moment(Date.now()).format('LLL')
    // console.log(tempDate);

    let customerOrderProduct = []

    for (let i = 0; i < products.length; i++) {
        const pro = products[i].products
        for (let j = 0; j < pro.length; j++) {
            const tempCusPro = pro[j].productInfo
            tempCusPro.quantity = pro[j].quantity
            customerOrderProduct.push(tempCusPro)
            if (pro[j]._id) {
                cartId.push(pro[j]._id)
            }
        }

    }

    // console.log(cartId);
    // console.log(customerOrderProduct);
    
    
    try {
        const order = await CustomerOrder.create({
            customerId: userId,
            shippingInfo,
            products: customerOrderProduct,
            price: price + shipping_fee,
            payment_status: 'unpaid',
            delivery_status: 'pending',
            date: tempDate
        })

        for (let i = 0; i < products.length; i++) {
            const pro = products[i].products
            const pri = products[i].price
            const sellerId = products[i].sellerId
            let storePro = []
            for (let j = 0; j < pro.length; j++) {
                const tempPro = pro[j].productInfo
                tempPro.quantity = pro[j].quantity
                storePro.push(tempPro)
            }

            authorOrderData.push({
                orderId: order.id,
                sellerId,
                products: storePro,
                price: pri,
                payment_status: 'unpaid',
                shippingInfo: 'Eutopia Main Warehouse',
                delivery_status: 'pending',
                date: tempDate
            })
        }

        await AuthOrder.insertMany(authorOrderData)
        for (let k = 0; k < cartId.length; k++) {
            await Cart.findByIdAndDelete(cartId[k])
        }

        setTimeout(() => {
            paymentCheck(order.id)
        }, 15000)

        res.status(200).json({message: "Order Placed Successfully!!", orderId: order.id})
        
    } catch (error) {
        console.log(error.message);
        
    }
    
}

const get_customer_dashboard_data = async (req, res) => {
    const {userId} = req.params

    try {
        const recentOrders = await CustomerOrder.find({
            customerId: new ObjectId(userId)
        }).limit(5)

        const pendingOrder = await CustomerOrder.find({
            customerId: new ObjectId(userId), delivery_status: 'pending'
        }).countDocuments()

        const totalOrder = await CustomerOrder.find({
            customerId: new ObjectId(userId)
        }).countDocuments()

        const cancelledOrder = await CustomerOrder.find({
            customerId: new ObjectId(userId), delivery_status: 'cancelled'
        }).countDocuments()

        res.status(200).json({
            recentOrders,
            pendingOrder,
            totalOrder,
            cancelledOrder
        })
    } catch (error) {
        console.log(error.message);
        
    }
}

const get_orders = async (req, res) => {
    // console.log(req.params);
    const {customerId, status} = req.params

    try {
        let orders = []
        if (status !== 'all') {
            orders = await CustomerOrder.find({
                customerId: new ObjectId(customerId),
                delivery_status: status
            })
        } else {
            orders = await CustomerOrder.find({
                customerId: new ObjectId(customerId)
            })
        }

        res.status(200).json({orders})
    } catch (error) {
        console.log(error.message);
        
    }
    
}

const get_order_details = async (req, res) => {
    // console.log(req.params);
    const {orderId} = req.params

    try {
        const order = await CustomerOrder.findById(orderId)
        res.status(200).json({order})
    } catch (error) {
        console.log(error.message);
        
    }
    
}




module.exports = {
    place_order,
    get_customer_dashboard_data,
    get_orders,
    get_order_details,
}