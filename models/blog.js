const { MONGODB_URI } = require('./../utils/config')
const logger = require('./../utils/loggers')

const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
const Blog = mongoose.model("Blog", blogSchema)

mongoose.set("strictQuery", false)
mongoose
  .connect(MONGODB_URI)
  .then(() => logger.info("Conexión exitosa a la base de datos"))
  .catch((error) =>
    logger.error("Error al conectar a la base de datos:", error)
  )

module.exports = Blog