const app = require('./app')
const { PORT } = require("./utils/config")
const logger = require(".//utils/loggers")

const PORT_LISTEN = PORT || 3001
app.listen(PORT_LISTEN, () => {
  logger.info(`Server running on port ${PORT_LISTEN}`)
})
