import React from 'react'

function isMyMessage(ID) {
	let isMyMessage = false;
	if (ID === localStorage.getItem("ID")) {
		isMyMessage = true;
	}
	return isMyMessage;
}

class Message extends React.PureComponent {

	componentDidMount() {
		this.props.messageDidRender()
	}

	handleImageLoaded = () => {
		this.props.messageDidRender()
	}

	render() {
		const { userId, message, imageUrl, timestamp } = this.props
		let msgclass = 'message';
		let msgContClass = 'messageContainer'

		if (isMyMessage(userId)) {
			msgContClass = msgContClass + ' drag-right';
			msgclass = msgclass + ' outText';
		}
		else {
			msgclass = msgclass + ' inText';
		}

		const date = new Date(timestamp);

		const time = `${date.getHours()}:${date.getMinutes()}`;

		return (
			<div className={msgContClass}>
				<div className={msgclass}>
					<div className="name">{userId}</div>
					{imageUrl ? <img 
					onLoad={this.handleImageLoaded}
					className="imgSize"
						src={'http://localhost:3001' + imageUrl}></img> : null}
					<span>{message}</span>
					<span className="time">{time}</span>
				</div>
			</div>
		)
	}
}

export default Message;