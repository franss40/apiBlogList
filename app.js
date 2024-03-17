const express = require("express")
const app = express()
const cors = require("cors")
const middleware = require("./utils/middleware")

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

const router = require('./controllers/blogs')
app.use('/api/blogs', router)

app.use(middleware.unKnowEndPoint)
app.use(middleware.errorHandler)
module.exports = app