let onlineUsers = []

export const newConnectionHandler = newClient => {
  // 1. Emit a welcome event to the connected client
  newClient.emit("welcome", { message: `Hellooooooooooooooooooo ${newClient.id}` })

  // 2. Listen to an event emitted by FE called "setUsername"
  newClient.on("setUsername", payload => {
    // 2.1 whenever we receive the username, we keep track of that username (together with socket.id)
    onlineUsers.push({ username: payload.username, socketId: newClient.id })

    // 2.2 then we have to send the list of connect users to the current user that just logged in
    newClient.emit("loggedIn", onlineUsers) // This emits to just the current socket connection

    // 2.3 we have also to inform everybody (but not the sender) of the new user joined
    newClient.broadcast.emit("newConnection", onlineUsers)
  })

  // 3. Listen to "sendMessage" event sent when an user sends a new message
  newClient.on("sendMessage", message => {
    // whenever we receive the new message we have to propagate that message to everybody but not the sender
    console.log(message)
    newClient.broadcast.emit("newMessage", message)
  })

  // 4. Listen to the event "disconnect" which is NOT a custom event!! This event happens when a user closes browser/tab
  newClient.on("disconnect", () => {
    // 4.1 Server shall update the list of onlineUsers by removing the one that has disconnected
    onlineUsers = onlineUsers.filter(user => user.socketId !== newClient.id)

    // 4.2 Let's communicate the updated list to FE
    newClient.broadcast.emit("newConnection", onlineUsers)
  })
}
