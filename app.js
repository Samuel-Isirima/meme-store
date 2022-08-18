const express = require('express')
const app = express()
const path = require('path')

app.use(express.static('./ui/static-files'))

/*Routing for all UI pages*/

app.get('/home', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/index.html'))
})

app.get('/contests', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/contests.html'))
})


app.get('/upload', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/upload-meme.html'))
})







app.listen(7070, ()=>
{
console.log('Main app root, listening on 7070')    
})