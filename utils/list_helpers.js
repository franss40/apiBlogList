// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(item => item.likes)
  return likes.reduce((a, b) => a + b, 0)
}

const favoriteBlog = (blogs) => {
  const blog = blogs.reduce((a,b) => {
    if (a.likes > b.likes) {
      return a
    } else {
      return b
    }
  }, 0)
  return {title: blog.title, author: blog.author, likes: blog.likes}
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) { return {} }
  let repeated = {}
  blogs.forEach(blog => {
    const author = blog.author
    if (author in repeated) {
      repeated[author] = repeated[author] + 1
    } else {
      repeated[author] = 1
    }
  })

  let keys = Object.keys(repeated)
  let maximus = {}
  for (let index = 0; index < keys.length; index++) {
    if (Object.keys(maximus).length === 0) {
      maximus = { author: keys[index], blogs: repeated[keys[index]] }
    } else {
      if (maximus.blogs < repeated[keys[index]]) {
        maximus = { author: keys[index], blogs: repeated[keys[index]] }
      }
    }
  }
  return maximus
}

const mostLikes = (blogs) => {
  let mostLike = {}
  let maximus = 0

  blogs.forEach(blog => {
    if (blog.likes > maximus) {
      maximus = blog.likes
      mostLike = { author: blog.author, likes: blog.likes }
    }
  })

  return mostLike
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }