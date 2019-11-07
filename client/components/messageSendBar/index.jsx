import React from 'react'
import connection from '../../network/connection';

class MessageSendBar extends React.PureComponent {
	state = {
		messageInput: "",
		showBadge: false,
		imgName: "",
		imgValue: "",
		imageUrl: "",
		imgFile: null,
		focus: false
	}

	componentDidMount() {
		this.nameInput.focus(); 
	}

	sendMessage = (imageUrl) => {
		const trimmed = this.state.messageInput.trim();
		this.setState({ messageInput: trimmed })
		if (trimmed || imageUrl) {
			connection.emit("send-message", { text: this.state.messageInput, imageUrl: imageUrl });
			this.setState({ messageInput: "" })
		}
	}

	handleChangeMsg = (event) => {
		let messageInput = event.target.value
		this.setState({ messageInput })
	}

	addImg = (event) => {
		let name = event.target.files[0].name
		let file = event.target.files[0]

		this.setState({ showBadge: true })
		this.setState({ imgName: name })
		this.setState({ imgFile: file })
		this.nameInput.focus(); 
	}

	removeImg = () => {
		this.setState({ showBadge: false })
		this.setState({ imgValue: "" })
	}

	postImg = () => {
		const xhr = new XMLHttpRequest();
		let formData = new FormData;
		formData.append('image', this.state.imgFile)
		xhr.open('POST', `http://localhost:3001/photos/upload`)
		xhr.send(formData)
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				const result = JSON.parse(xhr.response);
				const imageUrl = result.imageUrl;
				this.sendMessage(imageUrl)
				this.setState({ imgFile: null })
			}
		}
	}

	handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			this.handleSendMsg()
		}
	}

	handleSendMsg = () => {
		if (this.state.imgFile) {
			this.postImg()
			this.setState({ showBadge: false })
		}
		else {
			this.sendMessage()
		}
	}

	handleButtonClick = () => {
		this.handleSendMsg()
	}

	render() {
		return (
			<div className="messageSend">

				<input type="text"
					className="messageInput sentText"
					onChange={this.handleChangeMsg}
					onKeyPress={this.handleKeyPress}
					name="messageInput"
					placeholder="Введите сообщение"
					value={this.state.messageInput}
					ref={(input) => { this.nameInput = input; }} />

				{this.state.showBadge ? <div className="badge"
					onClick={this.removeImg}>
					<span className="imgInfo">{this.state.imgName}</span>
					<span className="imgClose"> x </span>
				</div> : null}

				<div className="FormFile"
					method="post"
					encType="multipart/form-data">
					<div className="form-group">
						<label className="label">
							<i className="material-icons">attach_file</i>
							<input className="fileInput"
								type="file"
								accept=".jpg, .jpeg, .png"
								onChange={this.addImg}
								value={this.state.imgValue} />
						</label>
					</div>

					<input className="buttonSend sendMessage"
						onClick={this.handleButtonClick}
						name="button"
						type="button"
						value="Send" />

				</div>
			</div>
		)
	}
}

export default MessageSendBar;