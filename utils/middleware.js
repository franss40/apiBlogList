const logger = require('./loggers')

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
  return next(error)
}

module.exports = {requestLogger, unKnowEndPoint, errorHandler}