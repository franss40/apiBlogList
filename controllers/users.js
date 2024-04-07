const userRouter = require('express').Router()
const User = require("./../models/user")
const bcrypt = require('bcrypt')
require('express-async-errors')

userRouter.get("/", async (request, response) => {
  const user = await User.find({})
  return response.json(user)
})

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body  
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User ({
    username,
    name,
    passwordHash
  })
  const savedUser = await user.save()
  return response.status(201).json(savedUser)
})

module.exports = userRouter
