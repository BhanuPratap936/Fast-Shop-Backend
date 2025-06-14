require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./utils/db')
const authRoutes = require('./routes/authRoutes')
const categoryRoutes = require('./routes/dashboard/categoryRoutes')
const productRoutes = require('./routes/dashboard/productRoutes')
const sellerRoutes = require('./routes/dashboard/sellerRoutes')
const homeRoutes = require('./routes/home/homeRoutes')
const customerAuthRoutes = require('./routes/home/customerAuthRoutes')
const cartRoutes = require('./routes/home/cartRoutes')
const orderRoutes = require('./routes/order/orderRoutes')

const {createAdmin} = require('./controllers/authControllers')

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use('/api/v1', homeRoutes)
app.use('/api/v1', authRoutes)
app.use('/api/v1', categoryRoutes)
app.use('/api/v1', productRoutes)
app.use('/api/v1', sellerRoutes)
app.use('/api/v1', customerAuthRoutes)
app.use('/api/v1', cartRoutes)
app.use('/api/v1', orderRoutes)

app.get('/', (req, res) => {
    res.send("Welcome to Ecommerce by Dark")
})

app.post('/api/admin', createAdmin)

const port = process.env.port

app.listen(port, () => {
    connectDB()
    console.log(`Server is running on port ${port}`);
})