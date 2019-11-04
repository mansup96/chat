import React from 'react'

function isMyMessage(ID) {
	let isMyMessage = false;
	if (ID === localStorage.getItem("ID")) {
		isMyMessage = true;
	}
	return isMyMessage;
}

function Message({ userId, message, imgUrl, timestamp }) {
	let msgclass = 'message';
	let msgContClass = 'messageContainer' 

	if (isMyMessage(userId)) {
		msgContClass = msgContClass + ' drag-right';
		msgclass = msgclass + ' outText';
	}
	else {
		msgclass = msgclass + ' inText';
	}

	return (
		<div className={msgContClass}>
			<div className={msgclass}>
				<div className="name">{userId}</div>
				<img className="imgSize" src={imgUrl}></img>
				<span>{message}</span>
				<span className="time">{timestamp}</span>
			</div>
		</div>
	)
}

export default Message;