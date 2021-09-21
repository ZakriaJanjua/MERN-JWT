const mongoose = require('mongoose')

const Users = mongoose.Schema({
    username: String,
    password: String,
    role: String,
    active: Boolean,
})

module.exports = mongoose.model('user', Users)
