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

router.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  return response.json(blog)
})

router.delete("/:id", async (request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  return response.status(204).end()
})

router.put("/:id", async (request, response) => {
  const body = request.body

  const newBlog = {...body, likes: body.likes + 1}

  const blog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
  if (!blog) {
    return response.status(404).end()
  }
  return response.json(newBlog)

})

module.exports = router