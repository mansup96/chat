import React, { PureComponent } from "react";
import Message from './components/message';
import MessageSendBar from './components/messageSendBar';
import ModalWindow from './components/modalWindow';
import SystemMsg from './components/systemMsg';
// import TestComponent from './components/testComponent';

import connection from './network/connection'

class Application extends PureComponent {
	mounted = false
	myRef = React.createRef();

	state = {
		messages: []
	}

	addMessage = (data) => {
		// Создаём новую копию массива, обязательно для того чтоб стэйт обновился
		const messages = Array.from(this.state.messages)
		messages.push(data);

		this.setState({ messages }, () => {
		});
	}

	addClientMessage = (data) => {
		this.addMessage(data);
	}

	scrollToBottom = () => {
		if (this.myRef.current) {
			this.myRef.current.scroll({
				top: this.myRef.current.scrollHeight + 500,
				behavior: "instant"
			})
		}
	}

	messageDidRender = () => {
		this.scrollToBottom()
	}

	addSystemMessage = (message) => {
		this.addMessage({ message, isSystem: true })
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
					<ModalWindow />
					<div className="chat"
						ref={this.myRef}>
						{this.state.messages.map((message, key) => {
							if (message.isSystem) {
								return <SystemMsg key={key} {...message} />
							}

							return <Message key={key} {...message} messageDidRender={this.messageDidRender} />
						})}
					</div>
					<MessageSendBar />
				</div>
			</React.Fragment >
		)
	}
}

export default Application