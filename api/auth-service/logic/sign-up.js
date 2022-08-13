const user_model = require("../models/user")


const sign_up = async (data_object, DBconnection) => 
{
    //First check if user exists
    if( user_model.exists({email: data_object.email}) )
    {
    console.log('This user exists')
    return "nice";    
    }

const response = await user_model.create(data_object)
return response
}

module.exports = sign_up