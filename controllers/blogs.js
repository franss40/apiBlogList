const express = require("express")
const router = express.Router()
const Blog = require("./../models/blog")
require('express-async-errors')

router.get("/", async(request, response) => {
  const blog = await Blog.find({})
  return response.json(blog)
})

router.post("/", (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = router