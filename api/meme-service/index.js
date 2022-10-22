const express = require("express")
const app = express();
const PORT = process.env.PORT_ONE || 7073
const mongoose = require("mongoose")
const memeModel = require("./models/meme")
const tagModel = require("./models/tag")
const multer = require("multer")
const cors = require('cors');
const authorization = require('../auth-service/logic/jwt');
const getSearchResults = require("./logic/search");
/*
Cors for allowing cross site requests
*/
app.use(cors({ origin: '*' }));

app.use(express.json())


try {

	mongoose.connect("mongodb://127.0.0.1:27017/meme-service",
		() => {
			console.log("Meme-Service DB connected");
		})
}
catch (error) {
	console.log(error)
}

/*
For meme uploading
*/
//File filtering
const multerFilter = (request, file, callback) => {
	console.log('File type', file.mimetype.split("/")[1])
	allowedFileTypes = ["mp3", "mp4", "m4a", "gif", "png", "wmv", "3gp", "m3u8", "mov", "flv", "wav", "jpg", "tiff", "jpeg"]
	if (allowedFileTypes.includes(file.mimetype.split("/")[1].toLowerCase())) {
		callback(null, true)
	}
	else {
		callback(new Error("Unsupported file type"), false)
	}
}

//Storage configuration
const multerStorage = multer.diskStorage(
	{
		destination: (request, file, callback) => {
			callback(null, "./temp-file-store")
		},

		filename: (request, file, callback) => {
			const ext = file.mimetype.split("/")[1];
			callback(null, `${request.body.title}-${Date.now()}.${ext}`)
		},
	})



uploadMiddleWare = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
})

audioFileExtensions = ["mp3", "wma", "flv", "wav"]
videoFileExtensions = ["mp4", "wmv", "3gp", "m4a"]
imageFileExtensions = ["jpg", "gif", "jpeg", "png", "tiff"]

app.post("/api/meme/add", uploadMiddleWare.single("meme-file"), async (req, res) => {
	/*
	Because of the multer middleware above, the file would 
	*/
	file_extension = req.file.mimetype.split("/")[1];
	if (audioFileExtensions.includes(file_extension)) {
		file_type = 'AUDIO'
	}
	else if (videoFileExtensions.includes(file_extension)) {
		file_type = 'VIDEO'
	}
	else if (imageFileExtensions.includes(file_extension)) {
		file_type = 'IMAGE'
	}

	title = req.body.title
	description = req.body.description
	tags = req.body.tags

	try {
		//Create a meme entry in the database
		result = await memeModel.create({
			title: title,
			description: description,
			file_type: file_type,
			tags: tags,
			mime: file_extension,
			uploader: { user_uuid: "9poaincjkalskdjha8w3aseukh97w3pasfhush8awoeahr" }
		})

		/*
		Add the tags to the database
		*/
		tags = tags.split(`,`)
		tags.forEach(entry => {
			try {
				tagModel.create({ tag: entry })
			}
			catch (error /*Most likely a duplicate key error */) {
				console.log('Cannot add tag : ', entry, '. Why? error => ', error)
				/*
				A meme tag not being recorded in the database is no cause for alarm
				Just catch the error, and possibly log it, but no effect on program flow
				*/
			}
		})
	}
	catch (error) {
		res.status(500).json({ message: "An unexpected error ocurred while uploading the meme. Please try again later." })
	}

})




app.post("/api/meme/tags/search", async (req, res) => {
	data = req.body
	try {
		result = await tagModel.find({ tag: { '$regex': data.query, '$options': 'i' } }).lean()
		res.status(200).json(result)
	}
	catch (error) {
		res.status(500).json(null)
	}
})



app.post("/api/memes", async (req, res) => {
	/*
	the authorization.authenticateAccessToken middleware wouldn't be used for this route because
	while I want to keep track of who views the various pages by their id/accessToken, this route
	is also public, and does not require authentication.
	Hence, just get the access token from the header if it exists
	*/

	accessToken = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null
	data = req.body
	alreadySentMemes = data.alreadyFetchedMemes
	numberOfItemsToFetch = data.numberOfItemsToFetch
	console.log('Already sent memes', alreadySentMemes)
	try {
		result = await memeModel.find({ _id: { $nin: alreadySentMemes } }).limit(numberOfItemsToFetch)
		numberOfMemesInDB = await memeModel.countDocuments() 	//For pagination purposes. Update: this is redundant: Fix this

		res.status(200).json({ memes: JSON.stringify(result), message: "Memes fetched successfully", totalNumberOfMemes: numberOfMemesInDB })
	}
	catch (error) {
		res.status(500).json({ message: "An unexpected error has occured. Please try again later." })
	}
})





app.post("/api/memes/trending", async (req, res) => {
	/*
	the authorization.authenticateAccessToken middleware wouldn't be used for this route because
	while I want to keep track of who views the various pages by their id/accessToken, this route
	is also public, and does not require authentication.
	Hence, just get the access token from the header if it exists
	*/

	accessToken = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null
	try {
		trendingMemes = require('./logic/trending').getTrending()
		res.status(200).json({ memes: JSON.stringify(result), message: "Memes fetched successfully" })
	}
	catch (error) {
		res.status(500).json({ message: "An unexpected error has occured. Please try again later." })
	}
})





app.post("/api/memes/search", async (req, res) => {
	/*
	the authorization.authenticateAccessToken middleware wouldn't be used for this route because
	while I want to keep track of who views the various pages by their id/accessToken, this route
	is also public, and does not require authentication.
	Hence, just get the access token from the header if it exists
	*/

	/* 
	Parameters

	Title
	Filter options: file type, tags, description, featuring
	Search logic
	The filter options will be URL parameters but the title will be a route parameter
	*/
	//const { title, tags, fileType } = req.query
//	const { title, tags, fileTypes, sentIDs, numberOfItemsToFetch } = req.body
	data = req.body
	title = data.title? data.title : ''
	tags = data.tags? data.tags : ''
	fileTypes = data.fileTypes? data.tags : ''
	sentIDs = data.sentIDs? data.sentIDs : ''
	numberOfItemsToFetch = data.numberOfItemsToFetch
	/* 
	The tags and featuring parameters allow multiple values, and because they are 
	url parameters, these values (if present) will be separated by a concatenation
	character +
	So get the values from the query variables and turn them to an array
	*/

	tagsArray = tags ? tags.split(',') : null
	fileTypeArray = fileTypes ? fileTypes.split(',') : null
	console.log(`title ${title} tags: ${tags} filetype: ${fileTypes} sentIDs: ${sentIDs} number of Items to fetch: ${numberOfItemsToFetch}`)


	accessToken = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null
	try {
		const { memesCount, memes } = await getSearchResults(title, tagsArray, fileTypeArray, sentIDs, numberOfItemsToFetch)
		console.log(`Result: ${memes}, memesCount: ${memesCount}`)
		res.status(200).json({ memes: JSON.stringify(memes), memesCount: memesCount, message: "Memes fetched successfully" })
	}
	catch (error) {
		console.log(error)
		res.status(500).json({ message: "An unexpected error has occured. Please try again later." })
	}


})







app.listen(PORT, () => {
	console.log(`Meme service on port ${PORT}`);
});


