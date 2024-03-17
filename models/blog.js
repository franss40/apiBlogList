require("dotenv").config()
const logger = require('./../utils/loggers')

// eslint-disable-next-line no-undef
const mongoUrl = process.env.MONGODB_URI

const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, required: true },
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
  .connect(mongoUrl)
  .then(() => logger.info("Conexión exitosa a la base de datos"))
  .catch((error) =>
    logger.error("Error al conectar a la base de datos:", error)
  )

module.exports = Blog