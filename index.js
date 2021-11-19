var express = require('express'),
    cors = require('cors'),
    secure = require('ssl-express-www');
const PORT = process.env.PORT || 8080 || 5000 || 3000
var app = express()
const apiii = require("./api/api")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(secure)
app.use(cors())
app.use("/", apiii);
app.listen(PORT, async () => {
	console.log(`Server berjalan dengan port: ${PORT}\n`)
})