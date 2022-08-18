signInProcessing = false
signInButton = `.si0`
emailInput = `.ei0`
passwordInput = `.pi0`
resultContainer = `.rc0`

validationErrors = [{tag: "email", error: ""}, {tag: "password", error: ""}]


let email
let emailApprove = false

$(document).on('input', emailInput, function(e)
{
    emailParseFunction($(this).val())
})


function emailParseFunction(value)
{
emailApprove = validateText(value)

if (emailApprove) 
    emailApprove = validateEmail(value)
else
    validationErrors.push({tag: "email", error: "Please enter a valid email"})

email = value
verifyInputs()
}



let password = ''
let passwordApprove = false

$(document).on('input', passwordInput, function(e)
{
    passwordParseFunction($(this).val())
})


function passwordParseFunction(value)
{
passwordApprove = validateText(value)

if (!passwordApprove) 
    validationErrors.push({tag: "password", error: "Please enter a valid password"})

password = value
verifyInputs()
}





verifyInputs()


const verifyInputs = () =>
{


    $(resultContainer).empty()
    //Check for errors
    if(validationErrors.length > 0)
    {
        $(resultContainer).append(`<p style="color: red;">${validationErrors[0].error}</p>`)
        $(signInButton).prop('disabled', true)
    }
    else
    {
        $(signInButton).prop('disabled', false)
    }
}


$(document).on('click', signInButton, function (event) 
{
sign_in()
})


const sign_in = () => 
{
    /*
    Avoid multiple requests
    Do this by creating a processing lock
    */
    if (signInProcessing)
        return
signInProcessing = true
$(signInButton).prop('disabled', true)
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

fetch("http://localhost:7030/sign-in", fetchOptions)
.then()
.then()
}




const validateText = (text) =>
{
    if(text == '' || text == undefined || text == null || text == ' ')
	{return false}
	else
	{return true}
}