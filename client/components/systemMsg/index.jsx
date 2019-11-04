import React from 'react'

function SystemMsg({message}) {
	return (
		<div className="messageContainer">
			<div className="systemMsg">{message}</div>
		</div>
	)
}

export default SystemMsg;