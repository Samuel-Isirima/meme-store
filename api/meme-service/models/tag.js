const mongoose = require('mongoose')

const tagSchema = mongoose.Schema({
    tag:{
            type: String, 
            required: true,
            index: true,
            unique: true
        }
})

const tagModel = mongoose.model('tags', tagSchema)

module.exports = tagModel