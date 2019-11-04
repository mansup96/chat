import React from 'react'
import connection from '../../network/connection';

class MessageSendBar extends React.PureComponent {
	state = {
		messageInput: "",
		file: null
	}
	componentDidMount() {
	}

	sendMessage = () => {
		const trimmed = this.state.messageInput.trim();
		this.setState({ messageInput: trimmed })
		if (trimmed) {
			connection.emit("send-message", { text: this.state.messageInput });
			this.setState({ messageInput: "" })
		}
	}

	handleChangeMsg = (event) => {
		let messageInput = event.target.value
		this.setState({ messageInput })
	}
	render() {
		return (
			<div className="messageSend">
				<input type="text"
					className="messageInput sentText"
					onChange={this.handleChangeMsg}
					name="messageInput"
					placeholder="Введите сообщение"
					value={this.state.messageInput} />

				<div className="badge badge_opacity_0">
					<span className="imgInfo"></span>
					<span className="imgClose"> x </span>
				</div>
				<div className="FormFile" method="post" enctype="multipart/form-data">
					<div className="form-group">
						<label className="label">
							<i className="material-icons">attach_file</i>
							<input className="fileInput" type="file" accept=".jpg, .jpeg, .png" />
						</label>
					</div>
					<input className="buttonSend sendMessage" onClick={this.sendMessage} name="button" type="button" value="Send" />
				</div>
			</div>
		)
	}
}

export default MessageSendBar;