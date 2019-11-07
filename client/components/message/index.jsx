import React from 'react'
import PropTypes from 'prop-types'

const isMyMessage = ID => ID === localStorage.getItem('ID')

class Message extends React.PureComponent {
  componentDidMount() {
    this.props.messageDidRender()
  }

  handleImageLoaded = () => {
    this.props.messageDidRender()
  }

  render() {
    const { userId, message, imageUrl, timestamp } = this.props

    let msgclass = 'message'
    let msgContClass = 'messageContainer'

    if (isMyMessage(userId)) {
      msgContClass += ' drag-right'
      msgclass += ' outText'
    } else {
      msgclass += ' inText'
    }

    const date = new Date(timestamp)

    const time = `${date.getHours()}:${date.getMinutes()}`

    return (
      <div className={msgContClass}>
        <div className={msgclass}>
          <div className="name">{userId}</div>
          {imageUrl ? (
            <img
              alt="Message dggd"
              onLoad={this.handleImageLoaded}
              className="imgSize"
              src={`http://localhost:3001${imageUrl}`}
            />
          ) : null}
          <span>{message}</span>
          <span className="time">{time}</span>
        </div>
      </div>
    )
  }
}

Message.propTypes = {
  message: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  imageUrl: PropTypes.string,
  messageDidRender: PropTypes.func.isRequired,
}

Message.defaultProps = {
  imageUrl: null,
}

export default Message
