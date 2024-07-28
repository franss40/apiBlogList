const loginRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
require("express-async-errors")
const jwt = require('jsonwebtoken')

loginRouter.post("/", async (request, response) => {
  const {username, password } = request.body
  const user = await User.findOne({ username })
  const passwordCorrect = user === null ?
    false :
    await bcrypt.compare(password, user.passwordHash)
  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: 'invalid user or password'})
  }
  const userForToken = { username: user.username, id: user._id }
  // eslint-disable-next-line no-undef
  const token = jwt.sign (userForToken, process.env.SECRET, {expiresIn: 60*60})
  response.status(200).send({ token, id: user._id, username: user.username, name: user.name })
})

module.exports = loginRouter
