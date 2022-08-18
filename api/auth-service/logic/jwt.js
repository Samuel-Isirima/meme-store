require("dotenv").config()

const jwt = require("jsonwebtoken")

const generateAccessToken = (userObject) =>
{
    const accessToken = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "20m"
    })
} 

const authenticateAccessToken = (req, res, next) =>
{
/*
Setting up the authorization process with a serverside cookie read/write operation would actually
be faster and more encapsulating, but I will let the client handle that.
This is so that the authorization tokens can be sent in headers both from a front end client, and
a CLI client, or request sending/API testing software like postman
*/    
const authorizationHeader = req.headers["authorization"]
//Now check if there actually is an authorization header in the request
if(!authorizationHeader)
    {
       return res.status(401).json({message: "No authorization header sent in request. Refere to documenation for help."})
    }
else
    {
        /*
        The authorization header as defined by this API [ Which is basically me :) ] has the format
        TokenBearer Token
        */
        const accessToken = authorizationHeader.split(' ')[1]

        //Now verify the token
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if(error)
                {
                   return res.status(403).json({message: "Invalid access token sent"})
                }
            else
                {
                    req.user = user
                    next()
                }
        })
    }
}

module.exports = {generateAccessToken, authenticateAccessToken}