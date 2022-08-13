const express = require('express')
const app = express()
const path = require('path')

app.use(express.static('./static-files'))

/*Routing for all UI pages*/

app.get('/home', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './index.html'))
})

app.get('/contests', (req, res) => 
{
res.status(200).sendFile(path.resolve(__dirname, './contests.html'))
})







app.listen(1200)