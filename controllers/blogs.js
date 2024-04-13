const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')
const Blog = require("./../models/blog")
const User = require("./../models/user")
require('express-async-errors')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

router.get("/", async(request, response) => {
  const blog = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return response.json(blog)
})

router.post("/", async(request, response) => {
  let newBody = {...request.body}

  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

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