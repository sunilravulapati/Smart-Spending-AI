import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import authMiddleware from '../middleware/auth.js'

export const authRouter = express.Router()

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
}

// REGISTER — creates account only, no token generated
authRouter.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' })
        }

        const existing = await User.findOne({ email })
        if (existing) return res.status(400).json({ message: 'Email already in use' })

        const hashed = await bcrypt.hash(password, 12)
        await User.create({ email, password: hashed })

        res.status(201).json({ message: 'Account created. Please log in.' })
    } catch (err) {
        next(err)
    }
})

// LOGIN — generates token, sets HTTP-only cookie
authRouter.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Invalid credentials' })

        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(400).json({ message: 'Invalid credentials' })

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.cookie('token', token, cookieOptions)
        res.status(200).json({ message: 'Login successful', email: user.email, userId: user._id })
    } catch (err) {
        next(err)
    }
})

// LOGOUT — clears cookie
authRouter.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    })
    res.json({ message: 'Logged out successfully' })
})

// ME — returns logged-in user info from cookie
authRouter.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json({ email: user.email, userId: user._id })
    } catch (err) {
        next(err)
    }
})