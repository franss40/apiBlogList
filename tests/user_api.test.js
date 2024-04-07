const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const { User, initialUser } = require("./test_helpers")
const bcrypt = require("bcrypt")

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  for (const user of initialUser) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const newUser = { username: user.username, name: user.name, passwordHash: passwordHash}
    let userObject = new User(newUser)
    await userObject.save()
  }
})

describe("when there is initially some users saved", () => {
  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("all users are returned", async () => {
    const response = await api.get("/api/users")

    expect(response.body).toHaveLength(initialUser.length)
  })

  test("a specific user is within the returned blogs", async () => {
    const response = await api.get("/api/users")

    const usernames = response.body.map((r) => r.username)

    expect(usernames).toContain("hellas")
  })

  test("users has a property named name", async () => {
    const response = await api.get("/api/users")
    for (const user of response.body) {
      expect(user.id).toBeDefined()
    }
  })
})

describe("addition of a new user", () => {
  test("a valid user can be added", async () => {
    const newUser = {
      "username": "matt",
      "name": "Matti Luukkainen",
      "password": 'matt'
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const response = await api.get("/api/users")
    expect(response.body).toHaveLength(initialUser.length + 1)
    const contents = response.body.map((r) => r.username)
    expect(contents).toContain("matt")
  })

  test("if 'username' is duplicated return 404", async () => {
    const newUser = {
      username: "hellas",
      name: "Matti Luukkainen",
      password: "hell",
    }

    const responseAdd = await api
      .post("/api/users")
      .send(newUser)
      .expect(404)
      .expect("Content-Type", /application\/json/)

    expect(responseAdd.body.err).toBeDefined
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(initialUser.length)
  })

  test("if 'username' is less than 3 characters return 404", async () => {
    const newUser = {
      username: "ma",
      name: "Matti Luukkainen",
      password: 'mmat',
    }

    const responseAdd = await api
      .post("/api/users")
      .send(newUser)
      .expect(404)
      .expect("Content-Type", /application\/json/)

    expect(responseAdd.body.err).toBeDefined
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(initialUser.length)
  })

  test("if 'username' does not exist, return 404", async () => {
    const newUser = {
      name: "Matti Luukkainen",
      password: 'matt',
    }

    const responseAdd = await api
      .post("/api/users")
      .send(newUser)
      .expect(404)
      .expect("Content-Type", /application\/json/)

    expect(responseAdd.body.err).toBeDefined
    const response = await api.get("/api/users")
    expect(response.body).toHaveLength(initialUser.length)
  })

  test("if 'name' does not exist, return 404", async () => {
    const newUser = {
      username: "Matt",
      password: 'matt',
    }

    const responseAdd = await api
      .post("/api/users")
      .send(newUser)
      .expect(404)
      .expect("Content-Type", /application\/json/)

    expect(responseAdd.body.err).toBeDefined
    const response = await api.get("/api/users")
    expect(response.body).toHaveLength(initialUser.length)
  })

  test("if 'passwordHash' does not exist, return 404", async () => {
    const newUser = {
      username: "Matt",
      name: "Matt"
    }

    const responseAdd = await api
      .post("/api/users")
      .send(newUser)
      .expect(404)
      .expect("Content-Type", /application\/json/)

    expect(responseAdd.body.err).toBeDefined
    const response = await api.get("/api/users")
    expect(response.body).toHaveLength(initialUser.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})