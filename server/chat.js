const socket = require("socket.io");
const middleware = require("socketio-wildcard")();

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

function addMessage(userId, text) {
  const timestamp = Date.now();

  const message = {
    userId,
    message: text,
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

function handleSendMessage(messageText) {
  const { handshakeid } = this;

  if (!this.handshakeid) {
    this.emit(serverCommands.error, errors.NO_HANDSHAKE);

    return;
  }

  const message = addMessage(handshakeid, messageText);

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