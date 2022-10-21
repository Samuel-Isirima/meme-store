const memesContainer = `.mc0`
var memesIDsHolder = {}
var viewPorts = []
currentPageIndex = 1
const pageButton = `.pn-sb0`
const pageButtonsContainer = `.page-buttons-container`
const allowedNumberOfMemesPerPage = 1
const paginationContainer = `.pcon0`
const videoMemeElement = `.vidMeme`
const viewPortContainer = `.vpC0`
const textResultContainer = `.trc0`
var totalNumberOfMemes
const numberOfTrendingMemes = 15



const renderViewPort = (pageIndex) =>
{
    var viewPortIndex = viewPorts.findIndex(viewPortEntry => 
        {
        return viewPortEntry.pageIndex === pageIndex
        })
    if(viewPortIndex === -1)
    {
        //Viewport doesn't exist
        return false
    }

    $('.view-port').hide(0)    //Update: add a fade out animation
    $(viewPortContainer).prepend(viewPorts[viewPortIndex].markup)
    renderPageButtons(totalNumberOfMemes, pageIndex)

}

const renderMeme = (meme) =>
{
    console.log(meme)
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



const renderMemes = (memes, pageNumber) =>
{
console.log('Render memes called')
thisPageMemes = []
memesUI = ''

Object.keys(memes).forEach((key) => 
    {
    thisPageMemes.push(memes[key]._id)
    memesUI += renderMeme(memes[key])
    })

if(thisPageMemes.length < 1 && pageNumber == 1)
    {
    $(textResultContainer).empty()
    $(textResultContainer).append(`<p>There are currently no memes to show</p>`)
    return
    }

thisPageViewPort = viewPortUI(memesUI)

memesIDsHolder[currentPageIndex] = null
memesIDsHolder[currentPageIndex] = thisPageMemes

viewPorts.push({pageIndex: pageNumber, markup: thisPageViewPort})
renderViewPort(pageNumber)
}


const fetchMemes = async (pageIndex, dataSet) =>
{
showLoader(textResultContainer)
/*
Flatten out the dataset holding the ids

It is in this format
{
    1: [2,4,5,6],
    2: [1,4,6,7],
    ...
}
but needs to be in one array like so

[1,2,4,5,6,7]
*/
var flatDataSet = []
Object.keys(dataSet).forEach((key) => 
{
flatDataSet = flatDataSet.concat(dataSet[key])
})

currentPageIndex = pageIndex
$(`${pageButton}-${currentPageIndex}`).prop('disabled', true)
fetchOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": getCookie("authAccessToken")
                },
                body: JSON.stringify({numberOfItemsToFetch: allowedNumberOfMemesPerPage, alreadyFetchedMemes: flatDataSet})
            }
            response = await fetch("http://localhost:7073/api/memes", fetchOptions)
            data = await response.json()
            console.log('fetchmemes')
            
removeLoader(textResultContainer)
fetchingMemes = false
if(response.status != 200)
{
    $(textResultContainer).append(`<p style="color: red;">${data.message}</p>`)
    $(`${pageButton}-${currentPageIndex}`).prop('disabled', false)
    return
}

totalNumberOfMemes = data.totalNumberOfMemes
renderMemes(JSON.parse(data.memes), currentPageIndex)
}





$(document).on('click', pageButton, (event) =>
{
    element = event.target
    console.log(element)
    pageIndex = $(element).attr('page-index')

    //First check if the page already has an entry in the view port object
    var viewPortIndex = viewPorts.findIndex(viewPortEntry => 
        {
        return viewPortEntry.pageIndex === pageIndex
        })
    if(viewPortIndex === -1)
    {
        //Viewport doesn't exist
        fetchMemes(pageIndex, memesIDsHolder)
        return
    }
    else
    {
        //Viewport has already been rendered before, so it already exists
        renderViewPort(pageIndex)
        return
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

//Define long click event for previewing videos

$.fn.longClick = function(callback, timeout) {
    var timer;
    timeout = timeout || 500
    $(this).mousedown(function() {
        timer = setTimeout(function() { callback() }, timeout)
        return false
    });
    $(document).mouseup(function() {
        clearTimeout(timer)
        return false
    });
}



$(videoMemeElement).longClick(function()
{
thisMeme = $(this).prop('m-id0')
initMediaPlayer(thisMeme)    
})


//Initialize media player for video and audio preview

const initMediaPlayer = (memeSelector) =>
{
const plyrr = new Plyr(memeSelector, 
    {
        autoplay: true,
        volume: 1,
        disableContextMenu: true,
        resetOnEn: true,
        duration: 10,
    })
plyrr.play()
}




const renderPageButtons = (numberOfItems, pageIndex) =>
{
/* 
If the number of pages is less than 5, show 1,2,3 or 4 buttons as the case may be

Show five buttons
3 for the previous pages
1 for the current page
1 for the next page

If there are less than 5, show 1 for the current page and [1,2,3] for the previous page(s), no next page
If there are less than 5 and current page is page 1, show 1 for current page and [1,2,3] for the next page, no previous page
If there are more than 5 and the current page is 1, show 1 for the current page and [4] for the next pages
If there are more than 5 and the current page is 4, show 3 for previous pages, 1 for current page and 1 for next page 
*/
numberOfPages = numberOfItems/allowedNumberOfMemesPerPage
addOne = numberOfItems%allowedNumberOfMemesPerPage == 0? 0 : 1  //Get and account for possbile remainder
numberOfPages += addOne

pageButtons = []
anyNextPage = numberOfPages > pageIndex
numberOfNextPages = numberOfPages - pageIndex
console.log('NN ',numberOfPages)
anyPreviousPage = pageIndex > 1
var numberOfPreviousPages = 0

numberOfPageButtonsAllowed = 5


if(pageIndex < numberOfPageButtonsAllowed)
{
    if(numberOfPages > 4)
        numberOfNextPages = numberOfPageButtonsAllowed - pageIndex
    else
        numberOfNextPages = numberOfPages - numberOfPageButtonsAllowed

    numberOfPreviousPages = numberOfPageButtonsAllowed - numberOfNextPages - 1

     //Generate previous pages buttons
     for(i = 1; i <= pageIndex-1; i++)
         pageButtons.push(pageButtonUI(i, false))
     
     //Generate the current page button
     pageButtons.push(pageButtonUI(pageIndex, true))
 
     //Generate next pages buttons
     for(i = 1; i < numberOfNextPages+1; i++)
         pageButtons.push(pageButtonUI( parseInt(pageIndex) + parseInt(i), false))
     
}
else
{
    if(numberOfNextPages > 1)
        numberOfNextPages = 1
    
    numberOfPreviousPages = numberOfPageButtonsAllowed - numberOfNextPages - 1
    
    //Generate previous pages buttons
    for(i = pageIndex-1, a = numberOfPreviousPages; a > 0; i--, a--)
    {
        pageButtons.push(pageButtonUI(i, false))
        pageButtons.reverse()
    }
    
    //Generate the current page button
    pageButtons.push(pageButtonUI(pageIndex, true))

    //Generate next pages buttons
    for(i = 1; i <= numberOfNextPages; i++)
        pageButtons.push(pageButtonUI( parseInt(pageIndex) + parseInt(i), false))

}


$(paginationContainer).empty()
$(paginationContainer).prepend(leftShiftPageButtonUI(--pageIndex))  //Add left/less button
$(paginationContainer).append(pageButtons)
$(paginationContainer).append(rightShiftPageButtonUI(++pageIndex+1))  //Add right/greater button

if(numberOfPreviousPages > 0) //Enable left/less button
    $(`.left-shift`).prop(`disabled`, false)

if(pageIndex < numberOfPages) //Enable right/greater button
    $(`.right-shift`).prop(`disabled`, false)
}


fetchMemes("1", memesIDsHolder)


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        //This Part is for trending memes
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const renderTrendingMemes = (memes) =>
{
Object.entries(memes).forEach((entry) =>
{
memeElement = trendingMemeUI(meme)
$(trendingMemesCarousel).owlCarousel('add', memeElement).owlCarousel('update')
})
}



const fetchTrendingMemes = async () =>
{
showLoader(trendingMemesContainer)
fetchOptions = {
                method: "POST",
                headers: {
                         "Content-Type": "application/json",
                         "authorization": getCookie("authAccessToken")
                         },
                body: JSON.stringify({numberOfItemsToFetch: numberOfTrendingMemes})
               }
response = await fetch("http://localhost:7073/api/memes/trending", fetchOptions)
data = await response.json()

removeLoader(trendingMemesContainer)
if(response.status != 200)
{
    $(trendingMemesContainer).append(`<p style="color: red;">${data.message}</p>`)
}

renderTrendingMemes(JSON.parse(data.memes))
}

