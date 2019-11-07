/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
require('dotenv').config()

const socket = require('socket.io')
const express = require('express')
const http = require('http')
const middleware = require('socketio-wildcard')()
const multer = require('multer')
const cors = require('cors')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs')
const mongoose = require('mongoose')

const { MessageSchema, UserSchema } = require('./schemas')

const { clientCommands, serverCommands, errors } = require('./commands')

const staticFilesRoute = '/static'
const staticFilesDir = path.join(__dirname, '..', 'uploads')

const expressPort = process.env.EXPRESS_PORT
const mongoPort = process.env.MONGO_PORT

if (!fs.existsSync(staticFilesDir)) {
  fs.mkdirSync(staticFilesDir)
}

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, staticFilesDir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`)
  },
})

const upload = multer({ storage: storageConfig })

const app = express()
const server = http.Server(app)
const io = socket(server)

console.log(chalk.gray('Connecting to db'))
mongoose
  .connect(`mongodb://localhost:${mongoPort}/chat`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 203,
  })
  .then(() => {
    console.log(chalk.green('Connected to db'))
  })
  .catch(error => {
    console.log(error)

    process.exit(-1)
  })

io.use(middleware)
app.use(cors())
app.use(staticFilesRoute, express.static(staticFilesDir))

app.use('/', express.static(path.join(__dirname, '..', 'client')))

server.listen(expressPort, () => console.log(chalk.blue.bold(`Express is active on ${expressPort}`)),)

function getImageUrl(imageName) {
  return `${staticFilesRoute}/${imageName}`
}

app.post(
  '/photos/upload',
  upload.fields([{ name: 'image', maxCount: '1' }]),
  (req, res) => {
    if (req.files && req.files.image && req.files.image[0]) {
      const imageUrl = getImageUrl(req.files.image[0].filename)
      res.send({ imageUrl })
    } else {
      res.sendStatus(403)
    }
  },
)

function createMessage({ userId, text, imageUrl, isSystem }) {
  const timestamp = Date.now()

  const message = new MessageSchema({
    _id: new mongoose.Types.ObjectId(),
    user: userId,
    message: text,
    isSystem,
    imageUrl,
    timestamp,
  })

  return message
}

function addMessage({ userId, text, imageUrl, isSystem = false }) {
  console.log('sdfsd')
  return new Promise((resolve, reject) => {
    createMessage({ userId, text, isSystem, imageUrl }).save(
      (err, document) => {
        if (err) reject(err)

        resolve(document)
      },
    )
  })
}

function addUser(_id) {
  const user = new UserSchema({ _id })
  user.save()
}

function setName(_id, name) {
  UserSchema.findOne({ _id }, (err, res) => {
    res.name = name

    res.save()
  })
}

async function sendSystemMessageToAll(text) {
  const message = createMessage({ text, isSystem: true })

  io.emit(serverCommands.sendClientMessage, message)
}

function handleSetName(name) {
  const { handshakeid } = this

  if (!this.handshakeid) {
    this.emit(errors.NO_HANDSHAKE)

    return
  }

  UserSchema.findOne({ _id: handshakeid }, (err, prevUser) => {
    setName(handshakeid, name)
    io.emit(serverCommands.userSetName, { id: handshakeid, name })
    sendSystemMessageToAll(
      `${prevUser.name || prevUser.id} changed name to ${name}`,
    )
  })
}

async function handleHandshake(handshake) {
  const userId = new mongoose.Types.ObjectId()

  if (!handshake) {
    addUser(userId)

    this.emit(serverCommands.setHandshake, userId)

    this.handshakeid = userId
  } else {
    this.handshakeid = handshake

    await UserSchema.findOne({ _id: handshake }, (err, user) => {
      if (!user) {
        addUser(userId)
        this.emit(serverCommands.setHandshake, userId)
      }
    })
  }

  MessageSchema.find()
    .populate('user')
    .exec((err, res) => {
      this.emit(serverCommands.sendMessagesHistory, res)
    })

  UserSchema.findOne({ _id: handshake }, (err, result) => {
    let name = handshake

    if (result) {
      name = result.name || result._id
    }

    sendSystemMessageToAll(`${name} has connected`)
  })
}

async function handleSendMessage({ text, imageUrl }) {
  const { handshakeid } = this

  if (!this.handshakeid) {
    this.emit(serverCommands.error, errors.NO_HANDSHAKE)

    return
  }

  if (!text && !imageUrl) return

  const message = await addMessage({ userId: handshakeid, text, imageUrl })

  MessageSchema.findById(message._id)
    .populate('user')
    .exec((err, result) => {
      io.emit(serverCommands.sendClientMessage, result)
    })
}

function handleConnection(connection) {
  const onHandshake = handleHandshake.bind(connection)
  const onSetName = handleSetName.bind(connection)
  const onSendMessage = handleSendMessage.bind(connection)

  connection.on(clientCommands.sendHandshake, onHandshake)

  connection.on('*', console.log)

  connection.on(clientCommands.setName, onSetName)

  connection.on(clientCommands.sendMessage, onSendMessage)
}

io.on('connect', handleConnection)
