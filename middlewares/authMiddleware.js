const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {

    const {accessToken} = req.cookies

    if (!accessToken) {
        res.status(400).json({error: "Please Login First"})
    } else {
        try {
            const deCodeToken = await jwt.verify(accessToken, process.env.SECRET)
            req.role = deCodeToken.role
            req.id = deCodeToken.id
            next()
        } catch (error) {
            res.status(400).json({error: 'Please Login'})
        }
    }
}

module.exports = authMiddleware