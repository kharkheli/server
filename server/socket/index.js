const messageSchema = require('../models/message')
const mongoose = require('mongoose')

module.exports = (http) => {
  const io = require('socket.io')(http, {
    cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
  })

  io.use((socket, next) => {
    const user = socket.handshake.auth.username
    socket.user = user
    next()
  })

  io.on('connection', (socket) => {
    socket.join(socket.user)

    socket.on('message sent', async (data) => {
      const chatName = [data.to, data.from].sort().join('+')
      const chat = mongoose.model(chatName, messageSchema)
      const message = await chat.create({
        msg: data.content,
        sender: data.from,
        time: new Date().getTime(),
      })
      socket.to(data.to).emit('message sent', { message })
    })
    socket.on('typing', async (data) => {
      socket.to(data.to).emit('typing', data.from)
    })
    socket.on('stop typing', async (data) => {
      socket.to(data.to).emit('stop typing', data.from)
    })
    socket.on('seen', async (data) => {
      const chatName = [data.to, data.from].sort().join('+')
      const chat = mongoose.model(chatName, messageSchema)
      await chat.updateMany({ _id: { $in: data.ids } }, { seen: true })
    })
  })
}
