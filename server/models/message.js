const mongoose = require('mongoose')

const messageSchema = mongoose.Schema(
  {
    msg: {
      type: String,
      required: [true, 'message is required'],
    },
    time: {
      type: Number,
      required: [true, 'sent time is required'],
    },
    type: {
      type: String,
      default: 'text',
    },
    sender: {
      type: String,
      required: [true, 'sender is required'],
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

module.exports = messageSchema
