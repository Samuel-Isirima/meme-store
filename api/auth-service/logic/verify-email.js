const user_model = require("../models/user")


const verify_email = async (data_object) => 
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