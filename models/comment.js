const { MONGODB_URI } = require('./../utils/config')
const logger = require('./../utils/loggers')
const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    minLength: [3, 'minimum required 3 characters'],
  },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
})

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
const Comment = mongoose.model('Comment', commentSchema)

mongoose.set('strictQuery', false)
mongoose
  .connect(MONGODB_URI)
  .then(() => logger.info('Conexión exitosa a la base de datos'))
  .catch((error) =>
    logger.error('Error al conectar a la base de datos:', error)
  )

module.exports = Comment