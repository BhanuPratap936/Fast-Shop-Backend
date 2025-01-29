const router = require('express').Router()
const {adminLogin, getUser, sellerRegister, sellerLogin, profile_image_upload, profile_info_add} = require('../controllers/authControllers')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/admin-login', adminLogin)
router.get('/get-user', authMiddleware, getUser)
router.post('/seller-register', sellerRegister)
router.post('/seller-login', sellerLogin)
router.post('/profile-image-upload', authMiddleware, profile_image_upload)
router.post('/profile-info-add', authMiddleware, profile_info_add)
module.exports = router