//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let loaderObject

const getLoader = () => 
{
/*
I tried loading the loader gif the normal way with JS and inclusion
but it seemed like for every call to display the loader, 
a GET request was sent to the server to fetch the file again and that
was too slow.

Hence, I'm loading the loader gif as a blob and storing in a variable for use
*/

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200)
    {
        //this.response is what you're looking for
        console.log(this.response, typeof this.response);
        var url = window.URL || window.webkitURL;
        loaderObject = url.createObjectURL(this.response);
    }
}
xhr.open('GET', 'http://localhost:7070/assets/images/loader.gif');
xhr.responseType = 'blob';
xhr.send();  
}



function showLoader(UI_element) 
{
$(UI_element).append(`<div style="text-align: center; float: center;" class="loader-element"><img style="height: 30px; width: 30px;" src=${loaderObject}></div>`)
}


function removeLoader(UI_element) 
{
$(UI_element).find('.loader-element').remove()
}


getLoader()