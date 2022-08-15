create_meme_processing = false

const create_meme = () =>
{
/*
Avoid multiple requests
Do this by creating a processing lock
*/
if(create_meme_processing)
    return

create_meme_processing = true
$(create_meme_button).prop('disabled', true)	

var form = $('#upload-meme-data')[0]
var formdata = new FormData(form)
var ajax = new XMLHttpRequest()
/*
Add event listeners to watch the data upload process
*/
ajax.upload.addEventListener("progress", progressHandler, false)
ajax.addEventListener("load", completeHandler, false)
ajax.addEventListener("error", errorHandler, false)
ajax.addEventListener("abort", abortHandler, false)
ajax.open(`POST`, `http://localhost:7070/api/meme-service/create-meme`)
/*
Now set the request header
This is because the nodejs library being used to handle file uploads in this project
requires that data sent in should have the header content type multipart/form-data
to be processed.

The setRequestHeader method is used just before the send method as required by the 
xmlhttprequest class/documentation 
*/
ajax.setRequestHeader("content-type","multipart/form-data")
ajax.send(formdata)


}



const progressHandler = (event)=>
{
const percent = (event.loaded / event.total) * 100;
$(result_container).empty()
$(result_container).append(`<p>Uploading data | ${Math.round(percent)}%</p>`)
$(progress_bar).val(Math.round(percent))
}

function completeHandler(event)
{
//Remove the progress bar and update the result container
$(progress_bar).val(0)
$(progress_bar).hide(100)
process_response(event.target)
}

function errorHandler(event)
{
$(result_container).empty()
$(result_container).append(`<p>Data upload failed</p>`)
//Enable the button again and remove processing lock so user can try again
$(create_meme_button).prop('disabled', false)
create_meme_processing = false
}

function abortHandler(event)
{
$(result_container).empty()
$(result_container).append(`<p>Data upload failed</p>`)
//Enable the button again and remove processing lock so user can try again
$(create_meme_button).prop('disabled', false)
create_meme_processing = false
}


function process_response(response) 
{
    try
    {
    responseJSON = JSON.parse(reponse.responseText)
    }
    catch(error)
    {
    $(result_container).empty()
    $(result_container).append(`<p style="color:red;">An unexpected error has occured. Please try again later.</p>`)
    $(create_meme_button).prop('disabled', false)
    create_meme_processing = false

    return
    }   

    if(response.status != 200)
    {
    $(result_container).empty()
    $(result_container).append(`<p style="color:red;">${responseJSON.message}</p>`)
    $(create_meme_button).prop('disabled', false)
    create_meme_processing = false

    return
    }

    //If the code gets to this point, it means the request was successful
    $(result_container).empty()
    $(result_container).append(`<p style="color:green;">${responseJSON.message}</p>`)
    //Now redirect to the newly created meme's page
    setTimeout(() => 
    {
    window.location = `./meme/${responseJSON.data.link}/${responseJSON.data.uuid}`
    }, 1500);


}