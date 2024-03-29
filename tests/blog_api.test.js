const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const { Blog, initialBlog } = require("./test_helpers")

const api = supertest(app)


beforeEach(async() => {
  await Blog.deleteMany({})

  for (const blog of initialBlog) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test("all blogs are returned", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)

  expect(response.body).toHaveLength(initialBlog.length)
})

afterAll(() => {
  mongoose.connection.close()
})
