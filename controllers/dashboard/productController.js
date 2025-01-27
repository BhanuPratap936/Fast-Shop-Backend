const formidable = require('formidable')
const cloudinary = require('cloudinary').v2
const Product = require('../../models/productModel')



const add_product = async(req, res) => {

    const {id} = req
    const form = formidable({multiples: true})

    form.parse(req, async(err, field, files) => {
        // console.log(files.images[0]);
        // console.log(field);
        let {name, category, description, stock, price, discount,
            shopName, brand
        } = field

        let {images} = files
        
        name = name.trim()
        const slug = name.split(' ').join('-')

        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME, 
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
            secure: true
        })
        
        try {
            let allImageUrl = []
            if (!Array.isArray(images)) {
                images = [images]
            }

            for(let i = 0; i < images.length; i++) {
                const result = await cloudinary.uploader.upload(images[i].filepath, 
                    {folder: 'products'}
                )

                allImageUrl.push(result.url)
            }

            await Product.create({
                sellerId: id,
                name,
                slug,
                shopName,
                category: category.trim(),
                description: description.trim(),
                stock: parseInt(stock),
                price: parseInt(price),
                discount: parseInt(discount),
                images: allImageUrl,
                brand: brand.trim()
            })

            res.status(201).json({msg: 'Product Added Successfully'})
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    })

   
}

const get_products = async (req, res) => {
    const {page, searchValue, perPage} = req.query
    const {id} = req

    const skipPage = parseInt(perPage) * (parseInt(page) - 1)

    try {
        if (searchValue) {
            const products = await Product.find({
                $text: {$search: searchValue},
                sellerId: id
            }).skip(skipPage).limit(perPage).sort({createdAt: -1})
            const totalProducts = await Product.find({
                $text: {$search: searchValue},
                sellerId: id
            }).countDocuments()
            res.status(200).json({products, totalProducts})
        } else {
            const products = await Product.find({
                sellerId: id
            }).skip(skipPage).limit(perPage).sort({createdAt: -1})
            const totalProducts = await Product.find({
                sellerId: id
            }).countDocuments()
            res.status(200).json({products, totalProducts})
        }
    } catch (error) {
        console.log(error.message);
        
    }
}

const get_product = async(req, res) => {
    const {productId} = req.params
    try {
        const product = await Product.findById(productId)
        res.status(200).json({product})
    } catch (error) {
        console.log(error.message);
        
    }
}

const update_product = async (req, res) => {
    let {name, description, stock, price, category, discount, brand, productId} = req.body
    name = name.trim()
    const slug = name.split(' ').join('-')

    try {
        const product = await Product.findByIdAndUpdate(productId, {
            name, description, stock, price, category, discount, brand, productId, slug
        }, {new: true})
        res.status(200).json({product, msg: 'Product Updated Successfully!!'})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const product_image_update = async (req, res) => {
    const form = formidable({multiples: true})

    form.parse(req, async (err, field, files) => {
        // console.log(field);
        // console.log(files);

        const {oldImage, productId} = field
        const {newImage} = files

        if (err) {
            res.status(400).json({error: err.message})
        } else {
            try {
                cloudinary.config({
                    cloud_name: process.env.CLOUD_NAME, 
                    api_key: process.env.API_KEY,
                    api_secret: process.env.API_SECRET,
                    secure: true
                })

                const result = await cloudinary.uploader.upload(newImage.filepath, {
                        folder: 'products'
                })

                if (result) {
                    let {images} = await Product.findById(productId)
                    const index = images.findIndex(img => img === oldImage)
                    images[index] = result.url;
                    const product = await Product.findByIdAndUpdate(productId, {images}, {
                        new: true
                    })
                    res.status(200).json({product, msg: 'Product Image Updated Successfully!!'})
                } else {
                    res.status(500).json({error: 'Image Upload failed'})
                }
            } catch (error) {
                res.status(500).json({error : error.nessage })
            }
        }
        
    })
}

module.exports = {
    add_product,
    get_products,
    get_product,
    update_product,
    product_image_update
}