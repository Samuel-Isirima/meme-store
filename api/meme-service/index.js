const express = require("express")
const app = express();
const PORT = process.env.PORT_ONE || 7073
const mongoose = require("mongoose")
const memeModel = require("./models/meme")
const tagModel = require("./models/tag")
const multer = require("multer")
const cors = require('cors');

/*
Cors for allowing cross site requests
*/
app.use(cors({origin: '*'}));

app.use(express.json())


try
{

mongoose.connect("mongodb://127.0.0.1:27017/meme-service",
    () => 
    {
        console.log("Meme-Service DB connected");
    })
}
catch(error)
{
console.log(error)  
}

/*
For meme uploading
*/
//File filtering
const multerFilter = (request, file, callback) => 
{
console.log('File type', file.mimetype.split("/")[1])
allowedFileTypes = ["pdf","mp3","mp4","m4a","gif","png","wmv","3gp","m3u8","mov","flv","wav","jpg","tiff","jpeg"]
	if (allowedFileTypes.includes(file.mimetype.split("/")[1].toLowerCase())) 
	{
		callback(null, true)
	} 
	else 
	{
		callback(new Error("Unsupported file type"), false)
	}
}

//Storage configuration
const multerStorage = multer.diskStorage(
	{
		destination: (request, file, callback) => 
		{
		callback(null, "./temp-file-store")
		},
	
		filename: (request, file, callback) => 
		{
		const ext = file.mimetype.split("/")[1];
	  	callback(null, `${request.body.title}-${Date.now()}.${ext}`)
	},
  })

  

uploadMiddleWare =  multer({
					storage: multerStorage,
					fileFilter: multerFilter,
					})

app.post("/api/meme/add", uploadMiddleWare.single("meme-file"), async (req, res) => 
{
/*
Because of the multer middleware above, the file would 
*/
data = req.body
title = data.title
description = data.description

console.log(`Add service called: title = ${title}, description = ${description}`)
res.status(200).json({title:title, description: description})
})


app.post("/api/meme/tags/search", async (req, res) => 
{
data = req.body
try
{
result = await tagModel.find({tag: {'$regex': data.query, '$options': 'i'} }).lean()
res.status(200).json(result)
}
catch(error)
{
res.status(500).json(null)
}
})



app.use(express.json());

app.listen(PORT, () => {
    console.log(`Meme service on port ${PORT}`);
});


