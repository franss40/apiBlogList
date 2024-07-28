const express = require("express")
const router = express.Router()
const Blog = require("./../models/blog")
const Comment = require("./../models/comment")
require('express-async-errors')
const middleware = require("../utils/middleware")

router.get("/", async(request, response) => {
  const blog = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return response.json(blog)
})

router.post("/", middleware.userExtractor, async(request, response) => {
  let newBody = {...request.body}
  const user = request.user

  if (request.body.likes === undefined) {
    newBody = { ...newBody, likes: 0 }
  }
  if (newBody.title === undefined || newBody.title === '') {
    return response.status(400).end()
  }
  if (newBody.url === undefined || newBody.url === "") {
    return response.status(400).end()
  }

  const newBlog = new Blog({...newBody, user: user.id})
  const blog = await newBlog.save()
  
  user.blogs = user.blogs.concat(blog._id)

  await user.save()
  return response.status(201).json(blog)
})

router.get('/:id/comments', async (request, response) => {
  const id = request.params.id
  const comments = await Comment.find({blog: id}).populate('blog', { url: 1, title: 1, author: 1 })
  return response.json(comments)
})

router.post("/:id/comments", async (request, response) => {
  let {comment} = { ...request.body }
  const id = request.params.id

  if (id === undefined || id === '') {
    return response.status(400).end()
  }

  if (comment === undefined || comment === '') {
    return response.status(400).end()
  }

  const newComment = new Comment({ comment, blog: id })
  const blog = await newComment.save()

  return response.status(201).json(blog)
})

router.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  })
  if (!blog) {
    return response.status(404).end()
  }
  return response.json(blog)
})

router.delete("/:id", middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() !== user.id) {
    return response.status(401).json({ error: "Unauthorized" })
  }  

  user.blogs = user.blogs.filter((blog) => blog.id !== request.params.id)
  await user.save()

  const blogToDelete = await Blog.findByIdAndDelete(request.params.id)
  if (!blogToDelete) {
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