const messageSchema = require('../models/message')
const User = require('../models/user')
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

    const notifyFriend = async () => {
      const user = await User.findOne({ username: socket.user }).select(
        'friends',
      )
      const friends = user.friends
      socket.to(friends).emit('user connected', { user: socket.user })
    }
    notifyFriend()
    socket.on('disconnecting', async (data) => {
      const user = await User.findOne({ username: socket.user }).select(
        'friends',
      )
      const friends = user.friends
      socket.to(friends).emit('user disconnected', { user: socket.user })
    })

    socket.on('active users', async (data) => {
      const { username } = data
      const user = await User.findOne({ username }).select('friends')
      const activeUsers = []
      for (let [id, socket] of io.of('/').sockets) {
        activeUsers.push(socket.user)
      }
      const friends = user.friends.filter((friend) => {
        if (activeUsers.includes(friend)) {
          return friend
        }
      })
      // // console.log(friends)
      socket.emit('active users', { activeFriends: friends })
    })

    socket.on('message sent', async (data) => {
      // // console.log(data.to)
      const chatName = [data.to, data.from].sort().join('+')
      const chat = mongoose.model(chatName, messageSchema)
      const message = await chat.create({
        msg: data.content,
        type: data.type || 'text',
        sender: data.from,
        time: new Date().getTime(),
      })
      socket.to(data.to).emit('message sent', { message })
      //whenever we get a message we shift the friend to the to the tom in the list of friends
      //because we dont need to gett all the friends of the frontend to sort them by newest
      //and we dont want to perform sorting every time we send data to frontend
      const to = await User.findOne({ username: data.to })

      const toFriends = to.friends.filter((friend) => friend !== data.from)
      toFriends.unshift(data.from)
      await User.findOneAndUpdate({ username: data.to }, { friends: toFriends })
      const from = await User.findOne({ username: data.from })
      const fromFriends = from.friends.filter((friend) => friend !== data.to)
      fromFriends.unshift(data.to)
      await User.findOneAndUpdate(
        { username: data.from },
        { friends: fromFriends },
      )
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
    socket.on('add friend', async (data) => {
      socket.to(data.to).emit('add friend', { user: data.theGuy })
    })
  })
}
