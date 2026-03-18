import express from 'express'
import { FinancialData } from '../models/FinancialData.js'
import authMiddleware from '../middleware/auth.js'

export const dataRouter = express.Router()

dataRouter.use(authMiddleware)

// GET — load user's financial data
dataRouter.get('/', async (req, res, next) => {
    try {
        const data = await FinancialData.findOne({ userId: req.userId })
        res.json(data || {})
    } catch (err) {
        next(err)
    }
})

// POST — save / update user's financial data
dataRouter.post('/', async (req, res, next) => {
    try {
        // Strip mongoose system fields before saving
        const { _id, __v, createdAt, ...cleanBody } = req.body

        const data = await FinancialData.findOneAndUpdate(
            { userId: req.userId },
            { ...cleanBody, userId: req.userId, updatedAt: new Date() },
            { upsert: true, new: true }
        )
        res.json(data)
    } catch (err) {
        next(err)
    }
})