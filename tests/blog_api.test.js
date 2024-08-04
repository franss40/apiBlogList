const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const { Blog, User, initialBlog, Comment } = require("./test_helpers")

const api = supertest(app)

let user = null
let token = null

beforeAll(async () => {
  // Borramos la BBDD y creamos un usuario nuevo. Nos logueamos con él y recuperamos el token
  await User.deleteMany({})

  const newUser = {
    username: "matt",
    name: "Matti Luukkainen",
    password: "matt",
  }
  const response = await api.post("/api/users").send(newUser)
  user = response.body
  const login = await api.post("/api/login").send({username: newUser.username, password: newUser.password})
  token = login.body.token
})

beforeEach(async() => {
  await Blog.deleteMany({})
  
  for (const blog of initialBlog) {
    const newBlog = {...blog, user: user.id}
    let blogObject = new Blog(newBlog)
    await blogObject.save()
  }
})

describe('when there is initially some notes saved', () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs")

    expect(response.body).toHaveLength(initialBlog.length)
  })

  test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs")

    const titles = response.body.map((r) => r.title)

    expect(titles).toContain("twitter")
  })

  test("blogs has a property named id", async () => {
    const response = await api.get("/api/blogs")
    for (const blog of response.body) {
      expect(blog.id).toBeDefined()
    }
  })
})

describe('addition of a new blog', () => {
  test("a valid blog can not be added with token", async () => {
    const newBlog = {
      title: "github",
      author: "Chris Wanstrath",
      url: "https://github.com/",
      likes: 50,
    }
    await api
      .post("/api/blogs")
      .set({ Authorization: "Bearer jjj" })
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/)

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/)
  })

  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "github",
      author: "Chris Wanstrath",
      url: "https://github.com/",
      likes: 50,
    }
    const responseBlog = await api
      .post("/api/blogs")
      .set({'Authorization': 'Bearer ' + token})
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    expect(responseBlog.body.user).toBe(user.id)
    const response = await api.get("/api/blogs")
    expect(response.body).toHaveLength(initialBlog.length + 1)
    const contents = response.body.map((r) => r.title)
    expect(contents).toContain("github")
  })

  test("if 'likes' does not exist, it shall have a default value of 0", async () => {
    const newBlog = {
      title: "mongodb",
      author: "someone",
      url: "www.mongodb.com",
    }

    await api
      .post("/api/blogs")
      .set({ Authorization: "Bearer " + token })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const response = await api.get("/api/blogs")
    expect(response.body).toHaveLength(initialBlog.length + 1)
    const contents = response.body.map((r) => r.likes)
    expect(contents).toContain(0)
  })

  test("if 'title' does not exist, return 400 Bad Request", async () => {
    const newBlog = {
      title: "",
      author: "someone",
      url: "www.mongodb.com",
    }

    await api
      .post("/api/blogs")
      .set({ Authorization: "Bearer " + token })
      .send(newBlog)
      .expect(400)
  })

  test("if 'url' does not exist, return 400 Bad Request", async () => {
    const newBlog = {
      title: "mongodb",
      author: "someone",
    }

    await api
      .post("/api/blogs")
      .set({ Authorization: "Bearer " + token })
      .send(newBlog)
      .expect(400)
  })
})

describe("viewing a specific blog", () => {
  test("with a valid id", async () => {
    const allNotes = await api.get('/api/blogs')
    
    const noteToView = allNotes.body[0]

    const resultNote = await api
      .get(`/api/blogs/${noteToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(resultNote.body).toEqual(noteToView)
  })

  test("fails with statuscode 404 if note does not exist", async () => {
    const notexistId = "55f6b518adb1f83ee8cbc016"
    await api
      .get(`/api/blogs/${notexistId}`)
      .expect(404)
  })

  test("fails with statuscode 400 if id is invalid", async () => {
    const malformattedId = '3f'

    await api.get(`/api/blogs/${malformattedId}`).expect(400)
  })
})

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const allBlogs = await api.get("/api/blogs")
    const blogToDelete = allBlogs.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: "Bearer " + token })
      .expect(204)

    const blogAtEnd = await api.get("/api/blogs")

    expect(blogAtEnd.body).toHaveLength(initialBlog.length - 1)

    const contents = blogAtEnd.body.map((r) => r.title)

    expect(contents).not.toContain(blogToDelete.title)
  })

  test("succeeds with status code 404 or 400 if id not exist", async () => {
    await api
      .delete("/api/blogs/65f6b518adb1f83ee8cbc014")
      .set({ Authorization: "Bearer " + token })
      .expect(404)
    await api
      .delete("/api/blogs/fg")
      .set({ Authorization: "Bearer " + token })
      .expect(400)
  })
})

describe('update of a blog', () => {
  test('update a blog with id valid', async () => {
    const allBlogs = await api.get("/api/blogs")
    const blogToUpdate = allBlogs.body[0]

    const newBlog = {...blogToUpdate, likes: blogToUpdate.likes + 1}

    const blogUpdate = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({...blogToUpdate, user: user.id})
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(blogUpdate.body.likes).toBe(newBlog.likes)
    const allBlogsAfter = await api.get("/api/blogs")

    expect(allBlogs.body.length).toBe(allBlogsAfter.body.length)
    expect(allBlogsAfter.body[0].likes).toBe(allBlogs.body[0].likes + 1)
  })
})

describe('comments', () => {
  test.only('added comment and get comment', async() => {
    const response = await api.get('/api/blogs')
    const blogOne = response.body[0]

    const newComment = { comment: 'One comment', blog: blogOne.id }
    let commentObject = new Comment(newComment)
    await commentObject.save()

    const url = `/api/blogs/${blogOne.id}/comments`
    await api
      .get(url)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const responseComment = await api.get(url)
    expect(responseComment.body).toHaveLength(1)
    const comment = responseComment.body.map((r) => r.comment)

    expect(comment).toContain('One comment')
  })

})

afterAll(() => {
  mongoose.connection.close()
})
