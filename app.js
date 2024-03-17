const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors())
app.use(express.json())

const router = require('./controllers/blogs')
app.use('/api/blogs', router)

module.exports = app