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

const staticFilesRoute = '/static'
const staticFilesDir = __dirname + '/uploads'

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

var upload = multer({ storage: storageConfig })

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
  .then(ere => {
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

server.listen(expressPort, () =>
  console.log(chalk.blue.bold(`Express is active on ${expressPort}`))
)

function getImageUrl(imageName) {
  return `${staticFilesRoute}/${imageName}`
}

app.post(
  '/photos/upload',
  upload.fields([{ name: 'image', maxCount: '1' }]),
  function(req, res, next) {
    if (req.files && req.files.image && req.files.image[0]) {
      const imageUrl = getImageUrl(req.files.image[0].filename)
      res.send({ imageUrl })

      console.log(imageUrl)
    } else {
      res.sendStatus(403)
    }
    // req.body will contain the text fields, if there were any
  }
)

const clientCommands = {
  setName: 'set-name',
  sendMessage: 'send-message',
  sendHandshake: 'send-handshake',
}

const serverCommands = {
  userSetName: 'user-set-name',
  sendSystemMessage: 'send-system-message',
  sendClientMessage: 'send-client-message',
  error: 'server-error',
  sendMessagesHistory: 'send-messages-history',
  setHandshake: 'set-handshake',
}

const errors = {
  NO_HANDSHAKE: 'NO_HANDSHAKE',
}

const messages = []

let users = {}

io.on('connect', handleConnection)

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
  return new Promise((resolve, reject) => {
    createMessage({ userId, text, isSystem, imageUrl }).save(
      (err, document) => {
        if (err) reject(err)

        resolve(document)
      }
    )
  })
}

function createUser(name) {
  return {
    name,
  }
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

function handleHandshake(handshake) {
  if (!handshake) {
    addUser(this.id)

    this.emit(serverCommands.setHandshake, this.id)

    this.handshakeid = this.id
  } else {
    this.handshakeid = handshake
    if (!users[handshake]) {
      addUser(handshake)
    }
  }

  this.emit(serverCommands.sendMessagesHistory, messages)
  io.emit(
    serverCommands.sendSystemMessage,
    `${users[this.handshakeid].name} has connected`
  )
}

async function sendSystemMessageToAll(msg, save = false) {
  const message = createMessage(null, { text: 'fsds' }, true)

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
      `${prevUser.name || prevUser.id} changed name to ${name}`
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
      console.log(res)
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

  if (!text) return

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
