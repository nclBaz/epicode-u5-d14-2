import express from "express"
import { Server as SocketIOServer } from "socket.io"
import { createServer } from "http" // CORE MODULE
import { newConnectionHandler } from "./socket/index"
import productsRouter from "./api/products"
import usersRouter from "./api/users"
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
  forbiddenErrorHandler,
  genericErroHandler,
} from "./errorHandlers"

const expressServer = express()

// **************************** SOCKETIO ******************
const httpServer = createServer(expressServer)
const io = new SocketIOServer(httpServer) // this constructor is expecting to receive an HTTP-SERVER not an EXPRESS SERVER!!

io.on("connection", newConnectionHandler) // "connection" it is NOT a custom event! this is a socket.io event that is triggered any time a new client connects!

// *********************** MIDDLEWARES ********************
expressServer.use(express.json())

// ************************* ENDPOINTS ********************
expressServer.use("/products", productsRouter)
expressServer.use("/users", usersRouter)

// *********************** ERROR HANDLERS *****************
expressServer.use(badRequestErrorHandler)
expressServer.use(unauthorizedErrorHandler)
expressServer.use(forbiddenErrorHandler)
expressServer.use(notFoundErrorHandler)
expressServer.use(genericErroHandler)

/* if (process.env.MONGO_CONNECTION) {
  mongoose.connect(process.env.MONGO_CONNECTION)
} else {
  throw new Error("Mongo URL is missing!")
} */

export { httpServer, expressServer }
