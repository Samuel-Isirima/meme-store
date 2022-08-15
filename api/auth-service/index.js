const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 7070;
const mongoose = require("mongoose");
const user = require("./models/user")
const sign_up = require("./logic/sign-up")

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

    const new_user = req.body
    result = await sign_up(new_user)
    res.status(result.code).json(result)

})

app.post("/auth/sign-in", async (req, res) => 
{

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

