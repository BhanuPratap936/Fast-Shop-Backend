const formidable = require("formidable");
const cloudinary = require('cloudinary').v2
const Category = require('../../models/Category')

const add_category = async(req, res) => {

    const form = formidable()
    form.parse(req, async(err, fields, files) => {
        // console.log(fields);
        // console.log(files);
        if (err) {
            res.status(500).json({error: "Something went wrong!!"})
        } else {
            let {name} = fields
            let {image} = files
            name = name.trim()
            const slug = name.split(' ').join('-')

            cloudinary.config({
                cloud_name: process.env.CLOUD_NAME, 
                api_key: process.env.API_KEY,
                api_secret: process.env.API_SECRET,
                secure: true
            })

            try {
                const result = await cloudinary.uploader.upload(image.filepath, 
                    {
                        folder: 'categories'
                    }
                )

                if (result) {
                    const category = await Category.create({
                        name,
                        slug,
                        image: result.url
                    })
                    res.status(201).json({category, msg: "Category Added Successfully!!"})
                } else {
                    res.status(502).json({error: "Image File Upload Failed"})
                }
            } catch (error) {
                res.status(500).json({error: "Internal Server Error"})
            }
        }
        
        
    })
    
}

const get_category = async(req, res) => {

    // console.log(req.query);
    const {page, searchValue, perPage} = req.query

    try {
        let skipPage = ''
        if (perPage && page) {
            skipPage = parseInt(perPage) * (parseInt(page) - 1)

        }
        if (searchValue && page && perPage) {
            const categories = await Category.find({
                $text: { $search: searchValue}
            }).skip(skipPage).limit(perPage).sort({createdAt: -1})
            const totalCategory = await Category.find({
                $text: { $search: searchValue}
            }).countDocuments()
            res.status(200).json({categories, totalCategory})
        } else if(searchValue === '' && page && perPage) {
            const categories = await Category.find({}).skip(skipPage)
            .limit(perPage).sort({createdAt: -1})
            const totalCategory = await Category.find({}).countDocuments()
            res.status(200).json({categories, totalCategory})

        } else {
            const categories = await Category.find({}).sort({createdAt: -1})
            const totalCategory = await Category.find({}).countDocuments()
            res.status(200).json({categories, totalCategory})
        }
        
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"})
    }
    
}

const update_category = async (req, res) => {
    const form = formidable()
    form.parse(req, async(err, fields, files) => {
        // console.log(fields);
        // console.log(files);
        if (err) {
            res.status(500).json({error: "Something went wrong!!"})
        } else {
            let {name} = fields
            let {image} = files
            const {id} = req.params

            name = name.trim()
            const slug = name.split(' ').join('-')

            try {
                let result = null
                if (image) {
                    cloudinary.config({
                        cloud_name: process.env.CLOUD_NAME, 
                        api_key: process.env.API_KEY,
                        api_secret: process.env.API_SECRET,
                        secure: true
                    })

                    result = await cloudinary.uploader.upload(image.filepath, 
                        {
                            folder: 'categories'
                        }
                    )
                }

                const updateData = {
                    name,
                    slug
                }

                if (result) {
                    updateData.image = result.url
                }

                const category = await Category.findByIdAndUpdate(id, updateData, {
                    new: true
                })

                res.status(200).json({category, msg: 'Category updated successfully!!'})
            }


            catch (error) {
                res.status(500).json({error: "Internal Server Error"})
            }
        }
        
        
    })
    
}

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        const deleteCategory = await Category.findByIdAndDelete(categoryId)

        if (!deleteCategory) {
            console.log(`Category with id ${categoryId} not found `);
            return res.status(404).json({message: 'Category not found'})
            
        }
        res.status(200).json({message: 'Category Deleted Sucessfully!!'})
    } catch (error) {
        console.log(`Error delete category with id ${req.params.id}`, error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = {
    add_category,
    get_category,
    update_category,
    deleteCategory
}