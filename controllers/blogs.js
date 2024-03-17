const express = require("express")
const router = express.Router()
const Blog = require("./../models/blog")

router.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    return response.json(blogs)
  })
})

router.post("/", (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = router