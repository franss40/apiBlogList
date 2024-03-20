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

module.exports = { dummy, totalLikes, favoriteBlog }