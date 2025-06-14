const {
    categoryQuery,
    ratingQuery,
    priceQuery,
    sortByPrice,
    skip,
    limit,
    getProducts,
    searchQuery,
    countProducts
} = require('../../utils/queryProduct')
const Category = require('../../models/Category')
const Product = require('../../models/productModel')

const {queryProducts} = require('../../utils/queryProduct')


const formatProduct = (products) => {
    const productArray = []

    let i = 0
    while (i < products.length) {
        let temp = []
        let j = i

        while (j < i + 3) {
            if (products[j]) {
            temp.push(products[j])
            }

            j++;
        }

        productArray.push([...temp])
        i = j
    }

    return productArray
}

const get_categories = async (req, res) => {

    try {
        const categories = await Category.find({})
        res.status(200).json({categories})
    } catch (error) {
        console.log(error.message);
        
    }
}

const get_products = async(req, res) => {

    try {
        const products = await Product.find({}).limit(12).sort({
            createdAt: -1
        })

        const allProduct1 = await Product.find({}).limit(9).sort({
            createdAt: -1
        })

        const latest_product = formatProduct(allProduct1)

        const allProduct2 = await Product.find({}).limit(9).sort({
            rating: -1
        })

        const topRated_product = formatProduct(allProduct2)

        const allProduct3 = await Product.find({}).limit(9).sort({
            discount: -1
        })

        const discount_product = formatProduct(allProduct3)

        res.status(200).json({
            products,
            latest_product,
            topRated_product,
            discount_product
        })
    } catch (error) {
        console.log(error.message);
        
    }
}

const price_range_product = async (req, res) => {

    try {
        const priceRange = {
            low: 0,
            high: 0
        }

        const products = await Product.find({}).limit(9).sort({
            createdAt: -1 // 1 for asc -1 is for desc
        })

        const latest_product = formatProduct(products)
        const getForPrice = await Product.find({}).sort({
            'price': 1
        })

        if (getForPrice.length > 0) {
            priceRange.high = getForPrice[getForPrice.length - 1].price
            priceRange.low = getForPrice[0].price
        }

        res.status(200).json({
            latest_product,
            priceRange
        })
    } catch (error) {
        console.log(error.message);
        
    }

}

const query_products = async (req, res) => {

    // console.log(req.query);
    
    const perPage = 12
    req.query.perPage = perPage

    try {
        const products = await Product.find({}).sort({
            createdAt: -1
        })

        // Functional pipeline for total count (before pagination)
        const filteredProducts = [
            categoryQuery,
            ratingQuery,
            priceQuery,
            sortByPrice,
            searchQuery,
        ].reduce((acc, fn) => fn(acc, req.query), products)

        const totalProduct = countProducts(filteredProducts)

        // Functional pipeline for paginated result
        const paginatedProducts = [
            categoryQuery,
            ratingQuery,
            priceQuery,
            sortByPrice,
            skip,
            limit,
            searchQuery,
        ].reduce((acc, fn) => fn(acc, req.query), products)

        const result = getProducts(paginatedProducts)

        res.status(200).json({
            products: result,
            totalProduct,
            perPage
        })
    } catch (error) {
        console.log(error.message);
        
    }
    
}

const product_details = async (req, res) => {
    // console.log(req.params);

    const {slug} = req.params
    try {
        const product = await Product.findOne({slug})

        const relatedProducts = await Product.find({
            $and: [{
                _id: {
                    $ne: product.id
                }
            },
            {
                category: {
                    $eq: product.category
                }
            }]
        }).limit(12)

        const moreProducts = await Product.find({
            $and: [{
                _id: {
                    $ne: product.id
                }
            }, 
            {
                sellerId: {
                    $eq: product.sellerId
                }
            }]
        }).limit(3)

        res.status(200).json({
            product,
            relatedProducts,
            moreProducts
        })
    } catch (error) {
        console.log(error.message);
                
    }    
}

module.exports = {
    get_categories,
    get_products,
    price_range_product,
    query_products,
    product_details
}