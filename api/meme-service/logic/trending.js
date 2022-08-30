const memeImpressionModel = require('../models/meme-impression')
const memeModel = require('../models/meme')

const getTrending = () =>
{

    /*
    The trending memes logic is like so:

    The memes with the most impressions in the past 12 hours, the top 5

    */
    try
    {
    memesIDs = memeImpressionModel.aggregate([
                                        /* 
                                        First Stage -- 
                                        Filter to only within 12 hours
                                        */
                                        {
                                            $match : { "date": { 
                                                                $gte: new Date(new Date().getTime() - (12*60*60*1000)), 
                                                                $lt: new Date(Date.now()) 
                                                                }
                                                        }
                                        },
                                        /*
                                        Second stage
                                        Get the IDs and the number of occurences
                                        */
                                        {
                                            $group: {
                                                    _id: "$meme_id",
                                                    numberOfOccurences: {
                                                                        $count: {}
                                                                        }
                                                    }
                                        },
                                        {
                                            $sort : { 
                                                    numberOfOccurences: -1 
                                                    }
                                        }
                                    ]).limit(15)
    
    //The DB operation above returns the meme IDs and numbers of occurences
    memeObjects = memeModel.find({_id: 
                                    {
                                        $in: trendingMemesIDs
                                    }
                                })
                                
                                
    }
    catch(error)
    {
        throw Error("An unexpected error has occured. Please try again later.")
    }

}

module.exports = getTrending