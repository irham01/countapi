yoururl = 'https://countapi.frm.rf.gd'
var express = require('express'),
    cors = require('cors'),
    secure = require('ssl-express-www');
const PORT = process.env.PORT || 8080 || 5000 || 3000
var app = express()
const fs = require('fs')
const bodyParser = require('body-parser')
const axios = require('axios')
const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
app.enable('trust proxy')
app.set("json spaces",2)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(secure)
app.use(express.static("public"))
app.listen(PORT, async () => {
	console.log(`Server berjalan dengan port: ${PORT}\n`)
	await sleep(10000)
	if (yoururl) { axios.get(yoururl+'/autorefresh') }
})

var catatan = JSON.parse(fs.readFileSync('./database.json'))
app.get('/autorefresh', async (req, res) => {
	res.json('refreshed')
	console.log({result:'refreshed'})
	await sleep(5000)
	axios.get(`${req.protocol}://${req.hostname}${req.url}`)
})

app.get('/', async (req, res) => {
	res.redirect("https://github.com/frmdeveloper/countapi")
})

app.get('/:namespace/:key', async (req, res) => {
	const { namespace, key } = req.params
	const { amount, value } = req.query
	if (!namespace || !key) return res.json({error: `Silahkan lihat cara menggunakan`})
	if (namespace.length != namespace.match(/[-a-zA-Z0-9._]/gi).length) return res.json({error: 'Karakter tidak diizinkan'})
	if (!(namespace in catatan)) {
		catatan[namespace] = {
		  [key]: value?value: 1
		}
		await fs.writeFileSync('./database.json', JSON.stringify(catatan, null, 2))
		res.json({name: namespace, key:key, value: catatan[namespace][key] })
	} else if ((namespace in catatan) && !(key in catatan[namespace])) {
		catatan[namespace][key] = value?value: 1
		await fs.writeFileSync('./database.json', JSON.stringify(catatan, null, 2))
		res.json({name: namespace, key:key, value: catatan[namespace][key] })
	} else {
		if (value) {
			if (isNaN(value)) return res.json({error: `value harus berupa angka`})
			catatan[namespace][key] = value
		} else if (amount && (amount === '-') ) {
			catatan[namespace][key] += -1
		} else {
			catatan[namespace][key]++
		}
		await fs.writeFileSync('./database.json', JSON.stringify(catatan, null, 2))
		res.json({name: namespace, key:key, value: catatan[namespace][key] })
	}
	console.log({name: namespace, key:key, value: catatan[namespace][key] })
})

app.get('/getdatabase/:namespace', async (req, res) => {
	const { namespace } = req.params
	if (!namespace) return res.json({error:'tidak ditemukan'})
	res.json(catatan[namespace])
})

app.get('/restart', async (req, res) => {
	fs.createReadStream('uh')
	res.json('sudah')
})
