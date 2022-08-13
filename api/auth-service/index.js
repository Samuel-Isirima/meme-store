const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 7070;
const mongoose = require("mongoose");
const user = require("./models/user")
const sign_up = require("./logic/sign-up")

app.use(express.json())

mongoose.connect("mongodb://localhost/auth-service", {
    useNewUrlParser: true,
    useUnifiedTopology: true},
    () => {
        console.log("Auth-Service DB connected");
    }
)


app.post("/auth/sign-up", async (req, res) => {

    console.log('New sign up request')
    const new_user = req.body
    console.log(new_user.email)
    console.log(sign_up(new_user, mongoose))

})

app.post("/auth/sign-in", async (req, res) => {
    
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

