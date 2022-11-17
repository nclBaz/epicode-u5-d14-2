import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import { expressServer, httpServer } from "./server"

const port = process.env.PORT || 3001

mongoose.connect(process.env.MONGO_CONNECTION!)

mongoose.connection.on("connected", () =>
  httpServer.listen(port, () => {
    // DO NOT FORGET TO LISTEN WITH HTTPSERVER HERE NOT EXPRESS SERVER!!
    console.table(listEndpoints(expressServer))
    console.log(`Server is running on port ${port}`)
  })
)
