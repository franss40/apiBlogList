const { PORT } = require("./utils/config")
const express = require("express")
const app = express()
const cors = require("cors")
const Blog = require("./models/blog")

app.use(cors())
app.use(express.json())

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    return response.json(blogs)
  })
})

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT_LISTEN = PORT || 3003
app.listen(PORT_LISTEN, () => {
  console.log(`Server running on port ${PORT_LISTEN}`)
})
