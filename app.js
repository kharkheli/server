const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const http = require('http').Server(app)
require('./socket')(http)
require('express-async-errors')
const fileUpload = require('express-fileupload')

const db = require('./db/connect')

const userRoute = require('./controlers/user')

const uploadImage = require('./controlers/image')

app.use(express.json())
app.use(cors())
app.use(fileUpload({ useTempFiles: true }))

app.use(express.static('./public'))
app.use('/user', userRoute)
// every kind of request will be sent to upload image on this route
app.use('/uploads/img', uploadImage)
app.get('/', (req, res) => {
  res.status(201).json({ msg: 'success' })
})

const port = process.env.PORT || 3001

const start = async () => {
  try {
    await db(process.env.MONGO_URI)
    http.listen(port, () => {
      // // console.log('server is listening on port 3001')
    })
  } catch (error) {
    console.error(error)
  }
}

start()
