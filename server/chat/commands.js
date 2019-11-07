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

module.exports = { clientCommands, serverCommands, errors }
