const express = require('express')
const app = express()
const path = require('path')

app.use(express.static('./ui/static-files'))

/*Routing for all UI pages*/

app.get('/home', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/index.html'))
})


app.get('/', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/index.html'))
})

app.get('/head', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/head.html'))
})

app.get('/top-navbar', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/top-navbar.html'))
})

app.get('/side-navbar', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/side-navbar.html'))
})

app.get('/contests', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/contests.html'))
})


app.get('/upload', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/upload.html'))
})


app.get('/sign-in', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/sign-in.html'))
})


app.get('/memes', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/memes.html'))
})


app.get('/search', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/search.html'))
})


app.get('/categories', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/categories.html'))
})


app.get('/contest-details', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './ui/contest-details.html'))
})







app.listen(7070, ()=>
{
console.log('Main app root, listening on 7070')    
})