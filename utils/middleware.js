const logger = require('./loggers')
const User = require("./../models/user")
const jwt = require("jsonwebtoken")

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization")
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "")
  } else {
    req.token = null
  }
  next()
}

const userExtractor = async (req, res, next) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  req.user = user
  next()
}

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info("Path", req.path)
  logger.info("Body", req.body)
  logger.info("---------------------")
  next()
}

const unKnowEndPoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' })
  next()
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  }
  if (error.name === "ValidationError") {
    return res.status(404).json({ error: error.message })
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' })
  }
  return next(error)
}

module.exports = {requestLogger, unKnowEndPoint, errorHandler, tokenExtractor, userExtractor}