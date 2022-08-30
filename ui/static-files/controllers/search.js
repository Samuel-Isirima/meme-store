
title = ''
tags = []
filterMediaTypes = []

titleInput = `.ti0`
removeTagButton = `.rtag`
tagSearchSuggestionContainer = `.ts-sc-0`
tagsContainer = `.tags-c0`
tagsInput = `.tai0`
addTagButton = `.atb0`
tagSearchSuggestion = `.tss013`
resultContainer = `.rco0`
searchButton = `.sb`
filterMediaType = `.fmt`

$(searchButton).prop('disabled', true)
$(addTagButton).prop('disabled', true)

$(document).on('input', titleInput, function (e)
{
title = $(this).val()
if(!validateText(title))
    {
        $(searchButton).prop('disabled', true)
    }
else
    {
        //showSearchSuggestions(title)
        $(searchButton).prop('disabled', false)
    }
})



$(document).on('input', tagsInput, function (e)
{
    runAfterEvent_noDuplicateRequests(() => {
        query = $(this).val()
        /*
        Check if value is upto at least 2 characters, 
        then wait 1.0 second before making backend request to make sure user finished typing
        */
        if (query.length > 1) {
            searchTags(query)
        }
    }, 1000)

    //Prevent the use of non alphanumeric characters in tags, space included

    if ($(this).val().length >= 1
        && $(this).val().match(/^[0-9a-zA-Z]+$/)) 
    {
        $(addTagButton).prop('disabled', false)
    }
    else {
        $(addTagButton).prop('disabled', true)
    }
})


$(document).on('click', tagSearchSuggestion, function (e) {
    tag = $(this).attr('tag')
    //Clear the search suggestions result tag
    $(tagSearchSuggestionContainer).empty()
    addTag(tag.trim())
})


$(document).on('click', removeTagButton, function (e) {
    tag_ = $(this).attr('tag')
    removeTag(tag_.trim())
})



$(document).on('click', addTagButton, function (e) {
    addTag($(tagsInput).val())
    $(tagsInput).val('')
})



function removeTag(tag) {
    index = tags.indexOf(tag.trim())
    tags.splice(index, 1)
    renderTags()
}


function addTag(tag) {

    if (tags.length == 10) {
        $(tag_search_suggestion_container)
        .append('<p style="color: red; text-align: center;" class="tqty-err">You can only add 10 tags</p>')
        
        setTimeout(function () 
        {
            $('.tqty-err').remove()
        }, 2000)
        return
    }

    duplicate = false
    //check if the tag already exists and prevent addition if yes to avoid duplicates
    for (i = 0; i < tags.length; i++) {
        if (tags[i].toLowerCase() == tag.trim().toLowerCase()) {
            removeTag(tag.trim())
        }
    }
    tags.push(tag.trim())
    renderTags()
    $(addTagButton).prop('disabled', true)
}


function renderTags() 
{
    $(tagsContainer).empty()
    tags_UI = ''
    for (i = 0; i < tags.length; i++) 
    {
        tags_UI += selectedTag_UI(tags[i].trim())
    }

    $(tagsContainer).append(tags_UI)
}


function searchTags(query) 
{
    if (query.length < 1) 
    {
        return
    }

    fetch('http://localhost:7073/api/meme/tags/search', 
    {
        method: 'POST',
        headers:{
                'Content-Type': 'application/json'
                },
        body: JSON.stringify({
                query: query,
                }),
        cache: 'default'
    })
    .then((response)=>
    {
    if(response.status != 200)
        return null
    return response.json()
    })
    .then((data)=>
    {
    if(data == null)
        return
    renderTagSuggestions(data)
    })
}



function renderTagSuggestions(tags) 
{

    $(tagSearchSuggestionContainer).empty()
    tagSuggestionsUI = ''
    
    Object.keys(tags).forEach((key) => 
    {
        tagSuggestionsUI += tagSearchSuggestionUI(tags[key].tag)
    })
    $(tagSearchSuggestionContainer).append(tagSuggestionsUI)

}




$(document).on('change', filterMediaType, (event) =>
{

    if ($(this).is(':checked')) 
    {
        if(mediaTypes.contains($(this).attr('mt')))
            //Don't do shit
            return
        else
            {
            mediaTypes.push($(this).attr('mt'))
            }
    }
    else
    {
        index = mediaTypes.indexOf($(this).attr('mt').trim())
        mediaTypes.splice(index, 1)
    }
    
})



$(document).on('click', searchButton, (event) => {
    search()
})

const search = () => {
    /*
    Avoid multiple requests
    Do this by creating a processing lock
    */
    if (searchProcessing)
        return

    searchProcessing = true
    $(searchButton).prop('disabled', true)

const fetchOptions = {
        method: 'POST',
        headers: {
                    "Content-Type": "application/json",
                    "Authorization": getCookie("authAccessToken")
                 },
        body: {}
        }
}



function process_response(response) {
    try {
        responseJSON = JSON.parse(reponse.responseText)
    }
    catch (error) {
        $(result_container).empty()
        $(result_container).append(`<p style="color:red;">An unexpected error has occured. Please try again later.</p>`)
        $(searchButton).prop('disabled', false)
        create_meme_processing = false

        return
    }

    if (response.status != 200) {
        $(result_container).empty()
        $(result_container).append(`<p style="color:red;">${responseJSON.message}</p>`)
        $(searchButton).prop('disabled', false)
        create_meme_processing = false

        return
    }

    //If the code gets to this point, it means the request was successful
    $(result_container).empty()
    $(result_container).append(`<p style="color:green;">${responseJSON.message}</p>`)
    //Now redirect to the newly created meme's page
    setTimeout(() => {
        window.location = `./meme/${responseJSON.data.link}/${responseJSON.data.uuid}`
    }, 1500);


}


const validateText = (text) =>
{
    if(text == '' || text == undefined || text == null || text == ' ')
	{return false}
	else
	{return true}
}

let timeout;

function runAfterEvent_noDuplicateRequests(callback, wait) 
{
    /*
    This function helps to regulate backend requests sent for suggestion. A regular setTimeout call will 
    do multiple calls at once if the criteria are met. This guy would only send one request after user input
    */
      clearTimeout(timeout);
      timeout = setTimeout(function () { callback.apply(this) }, wait);
}


