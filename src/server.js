import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import { Server as SocketIOServer } from "socket.io"
import { createServer } from "http" // CORE MODULE
import { newConnectionHandler } from "./socket/index.js"

const expressServer = express()
const port = process.env.PORT || 3001

// **************************** SOCKETIO ******************
const httpServer = createServer(expressServer)
const io = new SocketIOServer(httpServer) // this constructor is expecting to receive an HTTP-SERVER not an EXPRESS SERVER!!

io.on("connection", newConnectionHandler) // "connection" it is NOT a custom event! this is a socket.io event that is triggered any time a new client connects!

// *********************** MIDDLEWARES ********************

// ************************* ENDPOINTS ********************

// *********************** ERROR HANDLERS *****************

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () =>
  httpServer.listen(port, () => {
    // DO NOT FORGET TO LISTEN WITH HTTPSERVER HERE NOT EXPRESS SERVER!!
    console.table(listEndpoints(expressServer))
    console.log(`Server is running on port ${port}`)
  })
)
