const socket = require("socket.io");
const express = require("express");
const middleware = require("socketio-wildcard")();
var multer = require("multer");

const staticFilesRoute = "/static";
const staticFilesDir = __dirname + "/uploads";
const expressPort = 3001

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, staticFilesDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  }
});

var upload = multer({ storage: storageConfig });

const app = express();

app.use(staticFilesRoute, express.static(staticFilesDir));

function getImageUrl(hostname, imageName) {
 return `http://${hostname}:${expressPort}${staticFilesRoute}/${imageName}`;
}

app.post(
  "/photos/upload",
  upload.fields([{ name: "image", maxCount: "1" }]),
  function(req, res, next) {
    if(req.files && req.files.image && req.files.image[0]) {
      res.send({imageUrl: getImageUrl(req.hostname, req.files.image[0].filename)});
    }
    res.send(403)
    // req.body will contain the text fields, if there were any
  }
);

const io = socket.listen(3000);
io.use(middleware);

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

app.listen(expressPort, () => console.log("Express is active"));
