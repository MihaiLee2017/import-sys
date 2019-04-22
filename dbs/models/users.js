const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        // require: true
    },
    codeId: {
        type: String,
        require: true,
        unique: true,
    },
    create_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)
