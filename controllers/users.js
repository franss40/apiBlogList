const userRouter = require('express').Router()
const User = require("./../models/user")
const bcrypt = require('bcrypt')
require('express-async-errors')

userRouter.get("/", async (request, response) => {
  const user = await User.find({}).populate('blogs', { url: 1, titles: 1, author: 1 })
  return response.json(user)
})

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body  
  if (password === undefined || password.length < 3) {
    return response.status(404).json({ error: "password too short" })
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User ({
    username,
    name,
    passwordHash
  })
  const savedUser = await user.save()
  return response.status(201).json(savedUser)
})

// TODO: hacer la 4.20
module.exports = userRouter
