import { Schema, model, Types } from 'mongoose'

const financialSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    income: { type: Number, default: 0 },
    expenses: { type: Array, default: [] },
    goals: { type: Array, default: [] },
    assets: { type: Array, default: [] },
    wishlist: { type: Array, default: [] },
    modelName: { type: String, default: 'llama-3.3-70b-versatile' },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    strict: "throw",
    versionKey: false
})

export const FinancialData = model('finance', financialSchema)