import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    // reads from cookie instead of Authorization header
    const token = req.cookies?.token

    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}

export default authMiddleware