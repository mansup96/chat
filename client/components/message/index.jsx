/* eslint-disable no-underscore-dangle */
import React from 'react'
import PropTypes from 'prop-types'
import style from './style.css'

const isMyMessage = ID => ID === localStorage.getItem('ID')

class Message extends React.PureComponent {
  componentDidMount() {
    this.props.messageDidRender()
  }

  handleImageLoaded = () => {
    this.props.messageDidRender()
  }

  render() {
    const { user, message, imageUrl, timestamp } = this.props

    let msgclass = 'message'
    let msgContClass = 'messageContainer'

    if (user && isMyMessage(user._id)) {
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
          <div className="name">{user._id}</div>
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
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }),
  timestamp: PropTypes.number.isRequired,
  imageUrl: PropTypes.string,
  messageDidRender: PropTypes.func.isRequired,
}

Message.defaultProps = {
  imageUrl: null,
  user: {
    _id: null,
  },
}

export default Message
