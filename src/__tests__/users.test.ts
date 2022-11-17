import supertest from "supertest"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { expressServer } from "../server"
import UsersModel from "../api/users/model"

dotenv.config() // This command forces .env variables to be loaded into precess.env. This is the way to go when you can't use -r dotenv/config

// supertest is capable of executing server.listen if we pass the Express server to it, it will give us back a client to be used to run http requests on that server
const client = supertest(expressServer)

const validUser = {
  firstName: "john",
  lastName: "rambo",
  email: "john@rambo.com",
  password: "1234",
}

beforeAll(async () => {
  // beforeAll hook could be used to connect to Mongo and doing some initial setup before running tests ( like inserting mock data into collections)
  if (process.env.MONGO_TEST_CONNECTION) {
    await mongoose.connect(process.env.MONGO_TEST_CONNECTION)
    const product = new UsersModel(validUser)
    await product.save()
  } else {
    throw new Error("Mongo URL missing!")
  }
})

afterAll(async () => {
  // afterAll hook could be used to close the connection to Mongo gently and clean up db/collections
  await UsersModel.deleteMany()
  await mongoose.connection.close()
})

let accessToken: string

describe("Test users' endpoints", () => {
  it("Should test that POST /users returns a valid _id and 201", async () => {
    const response = await client.post("/users").send(validUser).expect(201)
    expect(response.body._id).toBeDefined()
  })

  it("Should test that POST /users/login with right credentials gives us back an access token", async () => {
    const response = await client.post("/users/login").send(validUser)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("accessToken")
    accessToken = response.body.accessToken
  })

  it("Should check that GET /users returns 401 if you don't providea valid token", async () => {
    const response = await client.get("/users")
    expect(response.status).toBe(401)
  })

  it("Should check that GET /users returns users only if you have a valid token", async () => {
    const response = await client.get("/users").set("Authorization", `Bearer ${accessToken}`)
    expect(response.status).toBe(200)
  })
})
