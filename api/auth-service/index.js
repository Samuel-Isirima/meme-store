const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 7072;
const mongoose = require("mongoose");
const user = require("./models/user")
const sign_up = require("./logic/sign-up");
const user_model = require("./models/user");
const jwt_operations = require("./logic/jwt");
const cors = require("cors")

app.use(cors({ origin: '*' }));

app.use(express.json())


try
{

mongoose.connect("mongodb://127.0.0.1:27017/auth-service",
    () => 
    {
        console.log("Auth-Service DB connected");
    })
}
catch(error)
{
console.log(error)  
}

app.post("/auth/sign-up", async (req, res) => 
{

   
const {username, email, password} = req.body
//Check if username already exists

var userAccount = await user_model.findOne({username: {"$regex": `^${username}$`, $options: "i"}}).lean()
if(userAccount)
{
    return res.status(400).json({message: "This username has already been taken"})
}

//Check if email has been used
userAccount = await user_model.findOne({email: {"$regex": `^${email}$`, $options: "i"}}).lean()
if(userAccount)
{
   return res.status(400).json({message: "This username has already been taken"})
}

const password_hash = password
    userAccountObject = await user_model.findOne({email: {"$regex": `^${email}$`, $options: "i"}, password: password_hash}).lean()
    if(!userAccountObject)
    {
        return res.status(403).json({message: "Incorrect password"})
    }

accessToken = jwt_operations.generateAccessToken(userAccountObject)
return res.status(200).json({"accessToken": accessToken, "message": "login successful"})

})

app.post("/auth/sign-in", async (req, res) => 
{
const {email, password} = req.body
//Confirm user account

    const userAccount = await user_model.findOne({email: {"$regex": `^${email}$`, $options: "i"}}).lean()
    if(!userAccount)
    {
       return res.status(400).json({message: "An account with this email does not exist"})
    }

const password_hash = password
    userAccountObject = await user_model.findOne({email: {"$regex": `^${email}$`, $options: "i"}, password: password_hash}).lean()
    if(!userAccountObject)
    {
        return res.status(403).json({message: "Incorrect password"})
    }

accessToken = jwt_operations.generateAccessToken(userAccountObject)
return res.status(200).json({"accessToken": accessToken, "message": "login successful"})

})

app.post("/auth/verify-email", async (req, res) => {

})

app.post("/auth/change-password", async (req, res) => {

})

app.post("/auth/reset-password", async (req, res) => {

})


app.use(express.json());

app.listen(PORT, () => {
    console.log(`Auth service on port ${PORT}`);
});

