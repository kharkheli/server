const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is required'],
    minlenght: [4, 'username must be at least 4characters'],
  },
  img: {
    type: String,
  },
  friends: {
    type: Array,
    default: [],
  },
})

module.exports = mongoose.model('user', userSchema)
