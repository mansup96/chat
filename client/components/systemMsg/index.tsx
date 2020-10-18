import React from 'react'
import PropTypes from 'prop-types'

function SystemMsg({ message }) {
  return (
    <div className="messageContainer">
      <div className="systemMsg">{message}</div>
    </div>
  )
}

SystemMsg.propTypes = {
  message: PropTypes.string.isRequired,
}

export default SystemMsg
