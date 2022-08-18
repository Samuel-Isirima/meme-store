const user_model = require("../models/user")


const sign_up = async (data_object) => 
{
    //First check if user exists
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
    
 

    //Write user to database
    try
    {
    const response = await user_model.create(data_object)
        if(response)
        {
        return { code:200, message:`Account created successfully` }
        }
        else
        {
        return { code:500, message:`An error occured while trying to create your account. Please try again later.` }
        }
    }
    catch(error)
    {
    return { code:500, message:`An unexpected error has occured. Please try again later.` }
    }
    

    //Automatically sign user in
    
}

module.exports = sign_up