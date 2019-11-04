import React, { PureComponent } from "react";
import Message from './components/message';
import MessageSendBar from './components/messageSendBar';
import ModalWindow from './components/modalWindow';
import SystemMsg from './components/systemMsg';
import connection from './network/connection'


class Application extends PureComponent {
	state = {
		messages: []
	}

	addMessage = (data) => {
		// Создаём новую копию массива, обязательно для того чтоб стэйт обновился
		const messages = Array.from(this.state.messages)
		messages.push(data);

		this.setState({ messages });
	}

	addClientMessage = (data) => {
		data.isMyMsg = isMyMessage(data.userId)
		this.addMessage(data);
		debugger
	}

	addSystemMessage = (message) => {
		this.addMessage({message, isSystem: true})
	}

	getHistory = (messages) => {
		this.setState({ messages })
	}

	setHandshake = (handshakeId) => {
		localStorage.setItem("ID", handshakeId);
	}

	componentDidMount() {
		connection.on("connect", () => {
			connection.emit("send-handshake", localStorage.getItem("ID"));
		})

		connection.on("set-handshake", this.setHandshake);
		connection.on("send-client-message", this.addClientMessage);
		connection.on("send-system-message", this.addSystemMessage);
		connection.on("send-messages-history", this.getHistory);
	}

	render() {
		return (
			<React.Fragment>
				<div className="container">
					<button onClick={this.send}>dwqdqw</button>
					<ModalWindow />
					<div className="chat">
						{this.state.messages.map((message, key) => {
							if (message.isSystem) {
								return <SystemMsg key={key} {...message} />
							}
							return <Message key={key} {...message} />
						})}
					</div>
					<MessageSendBar />
				</div>
			</React.Fragment >
		)
	}
}

export default Application