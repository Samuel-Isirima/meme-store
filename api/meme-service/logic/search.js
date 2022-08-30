const memeModel = require('../models/meme')

const getSearchResults = (title, tags, fileType, description, featuring) =>
{

    //If all the parameters are provided
    try
    {
    memesIDs = memeModel.find({$where: {"title": 

                                        }})
    

                                
    }
    catch(error)
    {
        throw Error("An unexpected error has occured. Please try again later.")
    }

}

module.exports = getSearchResults