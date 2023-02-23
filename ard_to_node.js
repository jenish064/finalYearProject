const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const app = express()
const port = 4001
const httpServer = http.createServer(app)

const server = new socketio.Server(httpServer, {
    cors: {
        origin: '*',
    }
})

let timeChange
server.on("connection", (socket) => {
    console.log("connected socket.io")
    if (timeChange) clearInterval(timeChange)
    setInterval(() => {
        socket.emit("mesaage", new Date())
    }, 1000)
})


httpServer.listen(port)
