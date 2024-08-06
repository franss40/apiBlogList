const express = require("express")
const app = express()
const cors = require("cors")
const router = require("./controllers/blogs")
const userRouter = require("./controllers/users")
const loginRouter = require('./controllers/login')
const middleware = require("./utils/middleware")

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', router)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unKnowEndPoint)
app.use(middleware.errorHandler)
module.exports = app