const imageMemeUI = (memeObject) =>
{
   return ` <div class="col-6 col-lg-3">
                <div class="popular-item" style="text-align: center;">
                    <div class="thumb">
                    <img src="${memeObject.imageURL}" alt="">
                    <span class="category">${memeObject.title}</span>
                    <span class="likes"><i class="fa fa-heart"></i> 256</span>
                    <span class="see-details"><a href="meme/${memeObject.title.replace(" ","-")}/${memeObject.id}">Details</a></span>  
                </div>
                </div>
            </div>` 
}


const audioMemeUI = (memeObject) =>
{
return ` <div class="col-6 col-lg-3">
        <div class="popular-item" uier=meme-${memeObject._id} style="text-align: center;">
            <div class="thumb" uier=meme-${memeObject._id}>
        <audio class="MS-audio-${memeObject._id}" controls>
        <source src="${memeObject.url}" type="${memeObject.mime}/>
        </audio>
            <span class="category">${memeObject.title}</span>
            <span class="likes"><i class="fa fa-heart"></i> 256</span>
            <span class="see-details"><a href="meme/${memeObject.title.replace(" ","-")}/${memeObject.id}">Details</a></span>  
        </div>
    </div>
</div>`    
}


const videoMemeUI = (memeObject) =>
{
    return ` <div class="col-6 col-lg-3">
                <div class="popular-item" uier=meme-${memeObject._id} style="text-align: center;">
                    <div class="thumb" uier=meme-${memeObject._id}>
                    <video class="MS-video-${memeObject._id}" playsinline uier=meme-${memeObject._id} controls data-poster="assets/images/guitar.jpeg">
                    <source src="${memeObject.url}" type="${memeObject.mime}" />
                    </video>
                    <span class="category">${memeObject.title}</span>
                    <span class="likes"><i class="fa fa-heart"></i> 256</span>
                    <span class="see-details"><a href="meme/${memeObject.title.replace(" ","-")}/${memeObject.id}">Details</a></span>  
                </div>
                </div>
            </div>`    
        
}



const errorMemeUI = (memeObject) =>
{
    return ` <div class="col-6 col-lg-3">
                <div class="popular-item" style="text-align: center;">
                    <div class="thumb">
                    An unexpected error has occured.
                    <span class="category"></span>
                    <span class="likes"><i class="fa fa-heart"></i> 256</span>
                    <span class="see-details"><a>Details</a></span>  
                </div>
                </div>
            </div>`    
        
}

const pageButtonUI = (index, currentPage) =>
{
    selectedPageButton = currentPage? 'selected-page-button' : ''
    return `<button class="pn-sb0 btn btn-primary ${selectedPageButton}" page-index=${index} value="${index}">${index}</button>`
}


const leftShiftPageButtonUI = (index) =>
{
    return `<button class="pn-sb0 btn btn-primary" page-index=${index} value="${index}"><</button>`
}



const rightShiftPageButtonUI = (index) =>
{
    return `<button class="pn-sb0 btn btn-primary" page-index=${index} value="${index}">></button>`
}




const viewPortUI = (memesUI) =>
{
    return `<div class = "row mc0 view-port">
            ${memesUI}
            </div>`
}