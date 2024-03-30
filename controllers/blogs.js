const express = require("express")
const router = express.Router()
const Blog = require("./../models/blog")
require('express-async-errors')

router.get("/", async(request, response) => {
  const blog = await Blog.find({})
  return response.json(blog)
})

router.post("/", async(request, response) => {
  let newBody = {...request.body}
  if (request.body.likes === undefined) {
    newBody = { ...newBody, likes: 0 }
  }
  if (newBody.title === undefined || newBody.title === '') {
    return response.status(400).end()
  }
  if (newBody.url === undefined || newBody.url === "") {
    return response.status(400).end()
  }
  const newBlog = new Blog(newBody)

  const blog = await newBlog.save()
  return response.status(201).json(blog)
})

module.exports = router