const jwt = require('jsonwebtoken');
const JWT_SECRET = "GouravBi$wa$"

const fetchUser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }
    try {
        const string = jwt.verify(token, JWT_SECRET);
        req.user = string.user;
        next()
    } catch (error) {
        res.status(401).json({ msg: 'No token, authorization denied' })
    }
}





module.exports = fetchUser;