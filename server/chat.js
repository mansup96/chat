require('dotenv').config();

const socket = require("socket.io");
const express = require("express");
const http = require("http");
const middleware = require("socketio-wildcard")();
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const chalk = require("chalk");
const fs = require('fs');

const staticFilesRoute = "/static";
const staticFilesDir = __dirname + "/uploads";

const expressPort = process.env.EXPRESS_PORT;

if (!fs.existsSync(staticFilesDir)){
    fs.mkdirSync(staticFilesDir);
}

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, staticFilesDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  }
});

var upload = multer({ storage: storageConfig, });

const app = express();
const server = http.Server(app);
const io = socket(server);

io.use(middleware);
app.use(cors());
app.use(staticFilesRoute, express.static(staticFilesDir));

app.use("/", express.static(path.join(__dirname, "..", "client")));

server.listen(expressPort, () => console.log(chalk.blue.bold(`Express is active on ${expressPort}`)));

function getImageUrl(imageName) {
  return `${staticFilesRoute}/${imageName}`;
}

app.post(
  "/photos/upload",
  upload.fields([{ name: "image", maxCount: "1" }]),
  function(req, res, next) {
    if (req.files && req.files.image && req.files.image[0]) {
      const imageUrl = getImageUrl(req.files.image[0].filename);
      res.send({ imageUrl });

      console.log(imageUrl);
    } else {
      res.sendStatus(403);
    }
    // req.body will contain the text fields, if there were any
  }
);

const clientCommands = {
  setName: "set-name",
  sendMessage: "send-message",
  sendHandshake: "send-handshake"
};

const serverCommands = {
  userSetName: "user-set-name",
  sendSystemMessage: "send-system-message",
  sendClientMessage: "send-client-message",
  error: "server-error",
  sendMessagesHistory: "send-messages-history",
  setHandshake: "set-handshake"
};

const errors = {
  NO_HANDSHAKE: "NO_HANDSHAKE"
};

const messages = [];

let users = {};

io.on("connect", handleConnection);

function addMessage(userId, { text, imageUrl }) {
  const timestamp = Date.now();

  const message = {
    userId,
    message: text,
    imageUrl,
    timestamp
  };

  messages.push(message);

  return message;
}

function createUser(name) {
  return {
    name
  };
}

function addUser(id) {
  users = { ...users, [id]: createUser(`name_${id}`) };
}

function setName(id, name) {
  if (users[id]) {
    users[id].name = name;
  }
}

function handleHandshake(handshake) {
  if (!handshake) {
    addUser(this.id);

    this.emit(serverCommands.setHandshake, this.id);

    this.handshakeid = this.id;
  } else {
    this.handshakeid = handshake;
    if (!users[handshake]) {
      addUser(handshake);
    }
  }

  this.emit(serverCommands.sendMessagesHistory, messages);
  io.emit(
    serverCommands.sendSystemMessage,
    `${users[this.handshakeid].name} has connected`
  );
}

function handleSetName(name) {
  const { handshakeid } = this;

  if (!this.handshakeid) {
    this.emit(errors.NO_HANDSHAKE);

    return;
  }

  const prevName = users[handshakeid].name;

  setName(handshakeid);
  io.emit(serverCommands.userSetName, (handshakeid, name));
  io.emit(
    serverCommands.sendSystemMessage,
    `User ${prevName} has set name to ${name}`
  );
}

function handleSendMessage({ text, imageUrl }) {
  const { handshakeid } = this;

  if (!this.handshakeid) {
    this.emit(serverCommands.error, errors.NO_HANDSHAKE);

    return;
  }

  const message = addMessage(handshakeid, { text, imageUrl });

  io.emit(serverCommands.sendClientMessage, message);
}

function handleConnection(connection) {
  const onHandshake = handleHandshake.bind(connection);
  const onSetName = handleSetName.bind(connection);
  const onSendMessage = handleSendMessage.bind(connection);

  connection.on(clientCommands.sendHandshake, onHandshake);

  connection.on("*", console.log);

  connection.on(clientCommands.setName, onSetName);

  connection.on(clientCommands.sendMessage, onSendMessage);
}

