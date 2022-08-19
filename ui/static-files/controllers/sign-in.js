signInProcessing = false
signInButton = `.si0`
emailInput = `.ei0`
passwordInput = `.pi0`
resultContainer = `.rc0`

const validationErrors = [{tag: "email", error: ""}, {tag: "password", error: ""}]


const removeValidationError = (tag) =>
{
    const errorIndex = validationErrors.findIndex(errorEntry => 
        {
        return errorEntry.tag === String(tag)
        })
    if(errorIndex === -1)
    {
        return false
    }
    
    return !!validationErrors.splice(errorIndex, 1);
}


let email
let emailApprove = false

$(document).on('input', emailInput, function(e)
{
    emailParseFunction($(this).val())
})


const emailParseFunction = (value) =>
{
    removeValidationError("email")
    emailApprove = validateText(value)
    if (emailApprove) 
    {
        
        emailApprove = validateEmail(value)
        if(!emailApprove)
            validationErrors.push({tag: "email", error: "Please enter a valid email"})
    }
    else
    {
        validationErrors.push({tag: "email", error: "Please enter a valid email"})
    }   

email = value
verifyInputs()
}



let password = ''
let passwordApprove = false

$(document).on('input', passwordInput, function(e)
{
    passwordParseFunction($(this).val())
})


const passwordParseFunction = (value) =>
{
    removeValidationError("password")
    passwordApprove = validateText(value)

if (!passwordApprove) 
    validationErrors.push({tag: "password", error: "Please enter a valid password"})

password = value
verifyInputs()
}




const verifyInputs = () =>
{


    $(resultContainer).empty()
    //Check for errors
    if(validationErrors.length > 0)
    {
        $(resultContainer).append(`<p style="color: red;">${validationErrors[validationErrors.length - 1].error}</p>`)
        $(signInButton).prop('disabled', true)
    }
    else
    {
        $(signInButton).prop('disabled', false)
    }
}

verifyInputs()

$(document).on('click', signInButton, function (event) 
{
sign_in()
})


const sign_in = async () => 
{
    /*
    Avoid multiple requests
    Do this by creating a processing lock
    */
    if (signInProcessing)
        return
signInProcessing = true
$(signInButton).hide()
$(resultContainer).empty()
showLoader(resultContainer)

const body = {email: email, password: password}
const fetchOptions = 
    {
        method: "POST",
        headers: 
                {
                    "Content-Type": "application/json"
                },
        body: JSON.stringify(body)
    }

response = await fetch("http://localhost:7072/auth/sign-in", fetchOptions)
data = await response.json()
removeLoader(resultContainer)
signInProcessing = false
if(response.status != 200)
{
    $(resultContainer).append(`<p style="color: red;">${data.message}</p>`)
    $(signInButton).show()
    return
}

$(resultContainer).append(`<p style="color: green;">${data.message}</p>`)
const accessToken = data.accessToken
//Write token to cookie
setCookie("authAccessToken", accessToken, 30)

}





function validateText(text)
{
    if(text == '' || text == undefined || text == null || text == ' ')
	{return false}
	else
	{return true}
}


function validateEmail(email) 
{
const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
return re.test(email);
}



