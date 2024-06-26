const testingRouter = require('express').Router()
const Blog = require("./../models/blog")
const User = require("./../models/user")
require("express-async-errors")

testingRouter.post('/reset', async(require, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  response.status(204).end()
})

module.exports = testingRouter