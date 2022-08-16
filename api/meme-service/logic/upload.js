const meme_model = require("../models/meme")
const express = require("express")
const multer = require("multer")

/*
Configure local temporary file storage location
*/
const uploadMiddleWare = multer({dest: "../temp-file-store/"})

const upload_meme = async (data_object) => 
{
    //First do input validation


    //Then move the file


    //Then upload file to AWS

    
    //Write details to DB
    try 
    {
    const user_exists = await user_model.exists({ email: data_object.email })     
        if(user_exists)
        {
        return { code:400, message:`An account with this email already exists` }
        }
    } 
    catch(error) 
    {
    return { code:400, message:`An unexpected error has occured. Please try again later.` }
    }    
    
 

    //Now try creating the user
    try
    {
    const response = await user_model.create(data_object)
        if(response)
        {
        return {code:200, message:`Account created successfully` }
        }
        else
        {
        return { code:400, message:`An error occured while trying to create your account. Please try again later.` }
        }
    }
    catch(error)
    {
    return { code:400, message:`An unexpected error has occured. Please try again later.` }
    }
    
    
}

module.exports = sign_up