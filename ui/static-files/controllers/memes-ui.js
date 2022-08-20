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
    
}


const videoMemeUI = (memeObject) =>
{
    
}