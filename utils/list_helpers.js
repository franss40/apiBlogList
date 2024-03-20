const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(item => item.likes)
  return likes.reduce((a, b) => a + b, 0)
}

module.exports = { dummy, totalLikes }