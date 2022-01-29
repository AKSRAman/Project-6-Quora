const jwt = require('jsonwebtoken')

const middleware = async (req, res, next) => {
    try {
        let token1 = req.headers['authorization']
        if (!token1) {
            return res.status(400).send({ status: false, message: 'You are not logged in, Please login to proceed your request' })
        }
        let token2 = token1.split(" ")
        let token = token2[1]
        if (!token2) {
            return res.status(400).send({ status: false, message: 'You are not logged in, Please login to proceed your request' })
        }
        let decodedToken = jwt.verify(token, "Quora")
        if (decodedToken) {
            req.userId = decodedToken.userId
            next();
        } else {
            return res.status(400).send({ status: false, message: 'Token is invalid' })
        }
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { middleware }