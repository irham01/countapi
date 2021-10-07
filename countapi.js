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
	var gethtml = await axios.get("https://frmdeveloper.github.io/countapi"+req.url)
	res.set("content-type",gethtml.headers['content-type']).send(gethtml.data)
})

app.get('/getdatabase/:namespace', async (req, res) => {
	const { namespace } = req.params
	if (!namespace) return res.json({error:'tidak ditemukan'})
	res.json(catatan[namespace])
})
app.get('/getalldata', async (req, res) => {
	const { pw } = req.query
	if (pw != "p@ssw0rd") return res.json({error:'katasandi salah'})
	res.json(catatan)
})

app.get('/:namespace/:desk', async (req, res) => {
	const { namespace, desk } = req.params
	const { amount, value } = req.query
	const getamount = Number(amount)
	if (!namespace || !desk) return res.json({error: `Silahkan lihat cara menggunakan`})
	if (namespace.length != namespace.match(/[-a-zA-Z0-9._]/gi).length) return res.json({error: 'Karakter tidak diizinkan'})
	if (!(namespace in catatan)) {
		catatan[namespace] = {
		  [desk]: value?value: 1
		}
		await fs.writeFileSync('./database.json', JSON.stringify(catatan, null, 2))
		res.json({name: namespace, desk:desk, value: catatan[namespace][desk] })
	} else if ((namespace in catatan) && !(desk in catatan[namespace])) {
		catatan[namespace][desk] = value?value: 1
		await fs.writeFileSync('./database.json', JSON.stringify(catatan, null, 2))
		res.json({name: namespace, desk:desk, value: catatan[namespace][desk] })
	} else {
		if (value) {
			if (isNaN(value)) return res.json({error: `value harus berupa angka`})
			catatan[namespace][desk] = value
		} else if (getamount) {
			catatan[namespace][desk] += getamount
		} else {
			catatan[namespace][desk]++
		}
		await fs.writeFileSync('./database.json', JSON.stringify(catatan, null, 2))
		res.json({name: namespace, desk:desk, value: catatan[namespace][desk] })
	}
	console.log({name: namespace, desk:desk, value: catatan[namespace][desk] })
})

app.get('/restart', async (req, res) => {
	fs.createReadStream('uh')
	res.json('sudah')
})

app.get('*', async (req, res) => {
  try {
	var gethtml = await axios.get("https://frmdeveloper.github.io"+req.url)
	res.set("content-type",gethtml.headers['content-type']).send(gethtml.data)
  } catch (e) {
	res.send(e)
  }
})
