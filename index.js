var express = require('express')
const PORT = process.env.PORT || 4004 || 8080 || 5000 || 3000
var app = express()
const apiii = require("./api/api")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/", apiii);
app.listen(PORT, async () => {
	console.log(`Server berjalan dengan port: ${PORT}\n`)
})