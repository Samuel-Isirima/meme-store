const mongoose = require('mongoose')

const meme_schema = mongoose.Schema({
    title: {
            type: String, 
            required: true
           },
    description: {
                 type: String, 
                required: true
                 },
    file_type: {
                type: String, 
                required: true
               },
    date_uploaded: {
                    type: Number, 
                    default: Date.now()
                   },
    origin: {
            creator: {  
                        social_media: String,
                        handle: String,
                        handle_link: String,
                     },
            explanation: String,
            },
    tags: [{type: String}],                  
    uploader: {
              user_uuid: {
                         type: String, 
                         required: true
                         }
                
              },
    file_location: {
                        type: String,
                        required: true
                   }

})

const meme_model = mongoose.model('memes', meme_schema)

module.exports = meme_model