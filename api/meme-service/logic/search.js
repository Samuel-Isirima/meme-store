const memeModel = require('../models/meme')

const getSearchResults = async (title, tagsArray, fileTypeArray, sentIDsArray, numberOfItemsToFetch) => {
    var memes = null
    //If all the parameters are provided
    try {
        titleRegex = new RegExp(`.*${title}.*`)
        fileTypeFilter = ''
        tagsFilter = ''

        if (!tagsArray) 
        {
            tagsFilter = {}
        }
        else 
        {
            tagsFilter = { tags: tagsArray }
            tagsFilter.tags = 
            {
                $in: tagsFilter.tags.map(
                    tag => new RegExp(`.*${tag}*.`)
                )
            }
        }

        if(fileTypeArray)
        {

            if (fileTypeArray.length < 1) 
            {
            fileTypeFilter = {}
            }
            else 
            {
                fileTypeFilter = { fileType: {$in: fileTypeArray }}
            }
        
        }


        memes = await memeModel.find({
            $and: [
                { title: { $regex: titleRegex, $options: "i" } },
                tagsFilter,
                fileTypeFilter,
                { _id: { $nin: sentIDsArray } }
            ],
        }).limit(numberOfItemsToFetch)


 
        memesCount = await memeModel.find({
            $and: [
                {title: {$regex: titleRegex, $options: "i"}}, 
                tagsFilter,
                fileTypeFilter,
                {_id : {$nin : sentIDsArray}}

            ]
                }).count()
        
        return { memesCount, memes }


    }
    catch (error) {
        console.log(error)
        throw Error("An unexpected error has occured. Please try again later.")
    }

}

module.exports = getSearchResults