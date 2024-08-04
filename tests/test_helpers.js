const Blog = require("../models/blog")
const User = require('../models/user')
const Comment = require('../models/comment')

const initialBlog = [
  {
    title: "facebook",
    author: "mark zuckerberg",
    url: "http://www.facebook.com",
    likes: 23,
  },
  {
    title: "twitter",
    author: "Jack Dorsey",
    url: "http://www.twitter.com",
    likes: 10,
  },
]

const initialUser = [
  {
    username: "hellas",
    name: "Arto Hellas",
    password: "hellas",
  },
  {
    username: "mluukkai",
    name: "Matti Luukkainen",
    password: "matti",
  },
]

module.exports = {Blog, initialBlog, User, initialUser, Comment}