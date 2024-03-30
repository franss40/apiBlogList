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

test("blogs has a property named id", async () => {
  const response = await api.get('/api/blogs')
  for (const blog of response.body) {
    expect(blog.id).toBeDefined()
  }
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "github",
    author: "Chris Wanstrath",
    url: "https://github.com/",
    likes: 50,
  }

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlog.length + 1)
  const contents = response.body.map(r => r.title)
  expect(contents).toContain('github')
})

test("if 'likes' does not exist, it shall have a default value of 0", async() => {
  const newBlog = {
    title: "mongodb",
    author: "someone",
    url: "www.mongodb.com",
  }

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const response = await api.get("/api/blogs")
  expect(response.body).toHaveLength(initialBlog.length + 1)
  const contents = response.body.map((r) => r.likes)
  expect(contents).toContain(0)
})

afterAll(() => {
  mongoose.connection.close()
})
