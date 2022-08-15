const mongoose = require('mongoose')

const user_schema = mongoose.Schema({
    name: {
            type: String, 
            required: true
           },
    email: {
                 type: String, 
                required: true
                 },
    password: {
                type: String, 
                required: true
               },
    date_registered: {
                    type: Number, 
                    default: Date.now()
                   },
    verified: {
                type: Boolean,
                default: false
              }
    })

const user_model = mongoose.model('users', user_schema)

module.exports = user_model