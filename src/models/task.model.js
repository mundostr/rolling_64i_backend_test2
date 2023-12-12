import mongoose from 'mongoose'

mongoose.pluralize(null)

const collection = 'tasks'

const schema = new mongoose.Schema({
    description: { type: 'String', required: true },
    target_date: { type: Date, required: true },
    priority: { type: 'String', enum: ['high', 'medium', 'low'], default: 'medium' },
    status: { type: 'String', enum: ['pending', 'finished'], default: 'pending' }
})

export default mongoose.model(collection, schema)