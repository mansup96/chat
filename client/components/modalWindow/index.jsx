import React from 'react'

function ModalWindow() {

	return (
		<div className="modal displayNone">
			<div className="modalContent">
				<div className="modalHeader">
					<span>Введите имя</span>
				</div>
				<div className="loginSend">
					<input type="text" className="login" placeholder="Имя" />
					<input type="button" className="buttonSend ok" value="OK" />
				</div>
			</div>
		</div>
	)
}

export default ModalWindow;