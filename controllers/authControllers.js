const Admin = require('../models/Admin')
const Seller = require('../models/Seller')
const sellerCustomerModel = require('../models/chat/sellerCustomerModel')
const bcrypt = require('bcrypt')
const createToken = require('../utils/tokenCreate')
const cloudinary = require('cloudinary').v2
const formidable = require('formidable')

const createAdmin = async (req, res) => {
    const admin = await Admin.create(req.body)
    res.status(201).json({ admin })
}

const adminLogin = async (req, res) => {
    const {email, password} = req.body

    try { 
        const admin = await Admin.findOne({email}).select("+password")
        if (admin) {
            const bcrypty = await bcrypt.compare(password, admin.password)

            if (bcrypty) {
                const token = await createToken({
                    id: admin.id,
                    role: admin.role
                })
                res.cookie("accessToken", token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })
                res.status(200).json({token, msg: "Login Successfully"})
            } else {
                res.status(401).json({error: "Password not match"})
            }
        } else {
            res.status(404).json({error: "Email not found"})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const sellerLogin = async (req, res) => {
    const {email, password} = req.body
    console.log(password);
    
    try {
        const seller = await Seller.findOne({email}).select("+password")
        if (seller) {
            const bcrypty = await bcrypt.compare(password, seller.password)

            if (bcrypty) {
                const token = await createToken({
                    id: seller.id,
                    role: seller.role
                })
                res.cookie("accessToken", token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })
                res.status(200).json({token, msg: "Login Successfully"})
            } else {
                res.status(401).json({error: "Password not match"})
            }
        } else {
            res.status(404).json({error: "Email not found"})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const sellerRegister = async (req, res) => {
    const {email, name, password} = req.body
    try {
        const getUser = await Seller.findOne({email})
        if (getUser) {
            res.status(409).json({error: "Email Already Exist!!"})
        } else {
            const seller = await Seller.create({
                name,
                email,
                password: await bcrypt.hash(password, 10),
                method: "manually",
                shopInfo: {}
            })
            await sellerCustomerModel.create({
                myId: seller.id
            })

            const token = await createToken({
                id: seller.id,
                role: seller.role
            })
            res.cookie('accessToken', token, {
                expires: new Date(Date.now() + 7*24*60*60*1000)
            })
            
            res.status(201).json({token, msg: "Register Success!!"})
            
        }
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error"
        })
        
    }
    
}

const getUser = async (req, res) => {
    const {role, id} = req
    try {
        if (role === 'admin') {
            const user = await Admin.findById({_id: id})
            res.status(200).json({userInfo: user})
        } else {
            const user = await Seller.findById({_id: id})
            res.status(200).json({userInfo: user})
            
        }
    } catch(error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const profile_image_upload = async (req, res) => {
    const {id} = req
    const form = formidable({multiples: true})
    form.parse(req, async(errorMonitor, _, files) => {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME, 
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
            secure: true
        })

        const {image} = files

        try {
            const result = await cloudinary.uploader.upload(image.filepath, {
                folder: 'profile'
            })

            if (result) {
                const userInfo = await Seller.findByIdAndUpdate(id, {
                    image: result.url
                }, {new: true})
                res.status(201).json({msg: 'Profile Image Upload Successfully!!', userInfo})
            } else {
                res.status(404).json({error: 'Image upload failed'})
            }
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    })
}


module.exports = {
    createAdmin,
    adminLogin,
    getUser,
    sellerRegister,
    sellerLogin,
    profile_image_upload
}