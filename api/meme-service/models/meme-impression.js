const mongoose = require('mongoose')

const meme_impressions_schema = mongoose.Schema({
    meme_id: {
            type: String, 
            required: true
           },
    person: {
            category:{
                     type: String,
                     required: true
                     },
            id:{
               type: String,
               required: true
               },
            required: true
          },
    impression_type: 
                {
                type: String, 
                required: true
                },
    date: {
            type: Number, 
            default: Date.now()
          },
    device: {
            category: String,   //Desktop or mobile
            brand: String,
            }
})

const memeImpressionModel = mongoose.model('meme-impression', meme_impressions_schema)

module.exports = memeImpressionModel