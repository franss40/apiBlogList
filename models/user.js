const { MONGODB_URI } = require("./../utils/config")
const logger = require("./../utils/loggers")
const uniqueValidator = require('mongoose-unique-validator')
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: [3, "minimum required 3 characters"],
  },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
})

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})
const User = mongoose.model("User", userSchema)

mongoose.set("strictQuery", false)
mongoose
  .connect(MONGODB_URI)
  .then(() => logger.info("Conexión exitosa a la base de datos"))
  .catch((error) =>
    logger.error("Error al conectar a la base de datos:", error)
  )

userSchema.plugin(uniqueValidator)
module.exports = User
