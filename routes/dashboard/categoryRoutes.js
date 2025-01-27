const router = require('express').Router()

const {add_category, get_category, update_category, deleteCategory} = require('../../controllers/dashboard/categoryController')
const authMiddleware = require('../../middlewares/authMiddleware')

router.post('/add-category', authMiddleware, add_category)
router.get('/get-category', authMiddleware, get_category)
router.put('/update-category/:id', authMiddleware, update_category)
router.delete(`/category/:id`, deleteCategory)

module.exports = router
