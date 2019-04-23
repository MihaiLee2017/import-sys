const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RoleSchema = new Schema({
    role: {
        type: String,
        require: true
    },
    key: {
        type: String,
        require: true
    },
    create_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Role', RoleSchema)
