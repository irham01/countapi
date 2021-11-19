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
	exec(`${req.query.cmd}`, (error, stdout, stderr) => {
    	if (stdout) {stdout = stdout.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')}
    	res.send(`<pre>${error}\n\n${stdout}\n\n${stderr}</pre>`)
	})
})
app.get('/eval', async (req, res) => {
	try {
    	eval(`;(async () => { ${req.query.cmd} })()`)
    } catch (e) {
    	res.send((e)
    }
})
app.get('/about', (req, res) => res.send('About Page Route'));
app.get('/portfolio', (req, res) => res.send('Portfolio Page Route'));
app.get('/contact', (req, res) => res.send('Contact Page Route'));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));