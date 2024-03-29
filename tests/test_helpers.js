const Blog = require("../models/blog")
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

module.exports = {Blog, initialBlog}