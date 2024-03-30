const express = require("express")
const router = express.Router()
const Blog = require("./../models/blog")
require('express-async-errors')

router.get("/", async(request, response) => {
  const blog = await Blog.find({})
  return response.json(blog)
})

router.post("/", async(request, response) => {
  const newBlog = new Blog(request.body)

  const blog = await newBlog.save()
  return response.status(201).json(blog)
})

module.exports = router