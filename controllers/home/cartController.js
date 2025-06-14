const Cart = require("../../models/Cart")
const {mongo: {ObjectId}} = require('mongoose')
const Wishlist = require("../../models/Wishlist")

const add_to_cart = async(req, res) => {
    // console.log(req.body);
    const {userId, productId, quantity} = req.body
    try {
        const product = await Cart.findOne({
            $and: [{
                productId: {
                    $eq: productId
                }
            },
            {
                userId: {
                    $eq: userId
                }
            }]
        })

        if (product) {
            res.status(409).json({error: "Product Already Added to Cart"})
        } else {
            const product = await Cart.create({
                userId,
                productId,
                quantity
            })

            res.status(201).json({message: 'Added To Cart Successfully!!', product})
        }
    } catch (error) {
        console.log(error.message);
        
    }
    
}


const get_cart_products = async(req, res) => {
    const co = 5
    const {userId} = req.params
    try {
        const cart_products = await Cart.aggregate([{
            $match: {
                userId: {
                    $eq: new ObjectId(userId)
                }
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: "_id",
                as: 'products'
            }
        }
    ])

        let buy_product_item = 0
        let calculatePrice = 0
        let cart_product_count = 0

        const outOfStockProduct = cart_products.filter(p => p.products[0].stock < p.quantity)

        for (let i = 0; i < outOfStockProduct.length; i++) {
            cart_product_count = cart_product_count + outOfStockProduct[i].quantity
        }

        const stockProduct = cart_products.filter(p => p.products[0].stock >= p.quantity)
        // console.log(stockProduct);
        

        for(let i = 0; i < stockProduct.length; i++) {
            const {quantity} = stockProduct[i]
            cart_product_count = buy_product_item + quantity

            buy_product_item = buy_product_item + quantity

            const {price, discount} = stockProduct[i].products[0]

            if (discount !== 0) {
                calculatePrice = calculatePrice + quantity * (price - Math.floor((price * discount) / 100))
            } else {
                calculatePrice = calculatePrice + quantity * price
            }
        }

        let p = []
        let unique = [...new Set(stockProduct.map(p => p.products[0].sellerId.toString()))]
        for (let i = 0; i < unique.length; i++) {
            let price = 0;
            for (let j = 0; j < stockProduct.length; j++) {
                const tempProduct = stockProduct[j].products[0]
                // console.log(tempProduct);
                
                if (unique[i] === tempProduct.sellerId.toString()) {
                    let rate = 0;
                    if (tempProduct.discount !== 0) {
                        rate = tempProduct.price - Math.floor((tempProduct.price * tempProduct.discount) / 100)
                    } else {
                        rate = tempProduct.price
                    }

                    rate = rate - Math.floor((rate * co) / 100)

                    price = price + rate * stockProduct[j].quantity

                    p[i] = {
                        sellerId: unique[i],
                        shopName: tempProduct.shopName,
                        price,
                        products: p[i] ? [
                            ...p[i].products,

                            {
                                _id: stockProduct[j]._id,
                                quantity: stockProduct[j].quantity,
                                productInfo: tempProduct
                            }
                        ]: [{
                            _id: stockProduct[j]._id,
                            quantity: stockProduct[j].quantity,
                            productInfo: tempProduct
                        }
                        ]
                    }
                }
            }
        }

    
        // console.log(p);

        res.status(200).json({
            cart_products: p,
            price: calculatePrice,
            cart_product_count,
            shipping_fee: 20 * p.length,
            outOfStockProduct,
            buy_product_item
        })
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const delete_cart_products = async(req, res) => {
    const {cart_id} = req.params
    try {
        await Cart.findByIdAndDelete(cart_id)
        res.status(200).json({message: "Product Removed Successfully!!"})
    } catch (error) {
        console.log(error);
        
    }
}

const quantity_inc = async (req, res) => {
    const {cart_id} = req.params
    try {
        const product = await Cart.findById(cart_id)
        const {quantity} = product
        await Cart.findByIdAndUpdate(cart_id, {quantity: quantity + 1})
        res.status(200).json({message: "Qunatity Updated!!"})
    } catch (error) {
        console.log(error.message);
           
    }
}

const quantity_dec = async (req, res) => {
    const {cart_id} = req.params
    try {
        const product = await Cart.findById(cart_id)
        const {quantity} = product
        await Cart.findByIdAndUpdate(cart_id, {quantity: quantity - 1})
        res.status(200).json({message: "Quantity Updated!!"})
    } catch (error) {
        console.log(error.message);
           
    }
}

const add_wishlist = async(req, res) => {
    const {slug} = req.body
    try {
        const product = await Wishlist.findOne({slug})
        if (product) {
            res.status(404).json({error: "Product is Already In Wishlist"})
        } else {
            await Wishlist.create(req.body)
            res.status(201).json({message: "Product added to wishlist successfully"})
        }
    } catch (error) {
        console.log(error.message);
        
    }
}

const get_wishlist = async (req, res) => {

    const {userId} = req.params
    try {
        const wishlists = await Wishlist.find({
            userId
        })
        res.status(200).json({
            wishlistCount: wishlists.length,
            wishlists
        })
    } catch (error) {
        console.log(error.message);
        
    }
}

const remove_wishlist = async (req, res) => {
    const {wishlistId} = req.params
    try {
        const wishlist = await Wishlist.findByIdAndDelete(wishlistId)
        res.status(200).json({
            message: 'Wishlist Product Removed',
            wishlistId
        })
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports = {
    add_to_cart,
    get_cart_products,
    delete_cart_products,
    quantity_inc,
    quantity_dec,
    add_wishlist,
    get_wishlist,
    remove_wishlist
}