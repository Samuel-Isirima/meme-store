const { response } = require("express")

const memesContainer = `.mc0`
var memesIDsHolder = {}
var viewPorts = {}

const fetchMemes = async (pageIndex, dataSet) =>
{
$(`${pageButton}-${currentPageIndex}`).prop('disabled', true)
fetchOptions = {
                method: "POST",
                headers: {
                         "Content-Type": "application/json",
                         "authorization": getCookie("authAccessToken")
                         },
                body: JSON.stringify(dataSet)
               }
response = await fetch("https://localhost:7073/memes")
data = await response.json()

removeLoader(memesContainer)
fetchingMemes = false
if(response.status != 200)
{
    $(memesContainer).append(`<p style="color: red;">${data.message}</p>`)
    $(`${pageButton}-${currentPageIndex}`).prop('disabled', false)
    return
}

renderMemes(data.memes)
}


const renderMemes = (memes) =>
{
thisPageMemes = []
memesUI = ''

Object.keys(memes).forEach((entry) => 
    {
    thisPageMemes.push(entry.__ID)
    memesUI += renderMeme(entry)
    })
thisPageViewPort = viewPortUI(memesUI)

memesIDsHolder.currentPageIndex = null
memesIDsHolder.currentPageIndex = thisPageMemes

viewPorts.currentPageIndex = null
viewPorts.currentPageIndex = viewPortUI

renderViewPort()
}

const renderMeme = (meme) =>
{
    switch(meme.file_type)
        {
        case "IMAGE": 
            {
                return imageMemeUI(meme)
            }

        case "AUDIO": 
            {
                return audioMemeUI(meme)
            }
        
        case "VIDEO": 
            {
                return videoMemeUI(meme)
            }
        default:
            {
                return errorMemeUI()
            }
        }
}


$(document).on('click', pageButton, (event) =>
{
    event.preventDefault()  //Prevent page reload
    pageIndex = $(this).prop('page-index')
    //First check if the page already has an entry in the view port object
    var viewPortIndex = viewPorts.findIndex(viewPortEntry => 
        {
        return viewPortEntry.index === pageIndex
        })
    if(viewPortIndex === -1)
    {
        
    }
})
/*
Pagination implementation:

0. Get the total number of memes 
1. Divide the number total number by the number of one-page-showable memes to get number of pages
2. Generate number of buttons to match number of pages [1-5 displayed, then ... nth page] with angle bracket buttons
3. Load the amount of one-page-showable IDs of memes into an object and put into the IDs holder JSON object as an array entry 
   with key => 1
4. Fetch the data of these memes
5. Create a new view port and render these memes on this viewPort
6. Save this view port into a JSON object with identifier = currentPageNumber


---------------------------------------------------------------------------------------------------------------------------------

On click of next page

0. First check if view ports holding object already holds index of the next page
1. If requested page view port exists, make it visible, and make current page view port invisible
   If view port does not exist,

0. Send fetch request with IDs object, so get amount-of-one-page-showable fetch IDs not in the holder JSON object
1. Add the IDs into another entry of the global holder JSON object as an array entry with key => currentPageNumber + 1
2. Fetch the data of these IDs
3. Create a new view port and render these memes on this viewPort
4. Save this view port into a JSON object with identifier = currentPageNumber + 1

----------------------------------------------------------------------------------------------------------------------------------

On click of page number
0. First check if view ports holding object already holds index of the next page
1. If requested page view port exists, make it visible, and make current page view port invisible
   If view port does not exist,

0. Send fetch request with IDs holder JSON object, so get amount-of-one-page-showable fetch IDs not in the current object
1. Add these IDs into another entry of the global holder JSON object with key => currentPageNumber
2. The get the data of these memes
3. Create a new view port and render these memes on this viewPort
4. Save this view port into a JSON object with identifier = currentPageNumber + 1

----------------------------------------------------------------------------------------------------------------------------------

Capture back (go back) browser event

---------------------------------------------------------------------------------------------------------------------------------

Variables: 

IDsHolderObject = [
                    [1,2,3,4,5,6,7],
                    [8,9,10,11,12,13],
                    [14,15,16,17,18,19]
                  ]
pageNumber
*/

