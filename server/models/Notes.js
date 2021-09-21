const mongoose = require('mongoose')

const Notes = mongoose.Schema({
    title: String,
    note: String,
    user_id: mongoose.Types.ObjectId
})

module.exports = mongoose.model('note', Notes)