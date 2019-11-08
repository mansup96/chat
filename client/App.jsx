import React, { PureComponent } from 'react'
import Message from './components/message'
import MessageSendBar from './components/messageSendBar'
import WelcomePage from './components/welcomePage'
import SystemMsg from './components/systemMsg'

import connection from './network/connection'

class Application extends PureComponent {
  myRef = React.createRef()

  state = {
    messages: [],
  }

  componentDidMount() {
    connection.on('connect', () => {
      connection.emit('send-handshake', localStorage.getItem('ID'))
    })

    connection.on('set-handshake', this.setHandshake)
    connection.on('send-client-message', this.addClientMessage)
    connection.on('send-system-message', this.addSystemMessage)
    connection.on('send-messages-history', this.getHistory)
  }

  addMessage = data => {
    // Создаём новую копию массива, обязательно для того чтоб стэйт обновился
    const messages = Array.from(this.state.messages)
    messages.push(data)

    this.setState({ messages }, () => {})
  }

  addClientMessage = data => {
    this.addMessage(data)
  }

  scrollToBottom = () => {
    if (this.myRef.current) {
      this.myRef.current.scroll({
        top: this.myRef.current.scrollHeight + 500,
        behavior: 'instant',
      })
    }
  }

  messageDidRender = () => {
    this.scrollToBottom()
  }

  addSystemMessage = message => {
    this.addMessage({ message, isSystem: true })
  }

  getHistory = messages => {
    this.setState({ messages })
  }

  setHandshake = handshakeId => {
    localStorage.setItem('ID', handshakeId)
  }

  render() {
    return (
      <div className="container">
        <WelcomePage />
        <div className="chat" ref={this.myRef}>
          {this.state.messages.map(message => {
            if (message.isSystem) {
              return (
                <SystemMsg
                  key={`${message.timestamp}`}
                  message={message.message}
                />
              )
            }
            return (
              <Message
                key={message.timestamp}
                message={message.message}
                imageUrl={message.imageUrl}
                user={message.user}
                timestamp={message.timestamp}
                messageDidRender={this.messageDidRender}
              />
            )
          })}
        </div>
        <MessageSendBar />
      </div>
    )
  }
}

export default Application
