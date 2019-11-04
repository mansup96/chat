// eslint-disable-next-line no-undef
let connection = new io();

connection.on("server-error", data => {
	console.log(data);
});
connection.emit("send-handshake", localStorage.getItem("ID"));
connection.on("set-handshake", data => {
	localStorage.setItem("ID", data);
});
connection.on("send-messages-history", getHistory);

if (localStorage.key("ID") === null) {
	modalEl.classList.remove("displayNone");
}

// function modalClose() {
// 	if (loginInput.value.length <= 1) {
// 		loginInput.removeAttribute("placeholder");
// 		loginInput.setAttribute("placeholder", "ИМЯ, СУКА!");
// 	} else if (loginInput.value.length > 0) {
// 		modalEl.classList.add("displayNone");
// 	}
// 	localStorage.setItem("ID", loginInput.value);
// }

function getHistory(array) {
	array.forEach(item => {
		createOneMessage(item);
	});
}

function createOneMessage(replica) {
	createMessage(
		replica.userId,
		replica.message,
		replica.timestamp,
		isMyMessage(replica.userId),
		replica.imageUrl
	);
	ScrollChatDown()
	});
}




function isMyMessage(ID) {
	let isMyMessage = false;
	if (ID === localStorage.getItem("ID")) {
		isMyMessage = true;
	}
	return isMyMessage;
}

connection.on("send-client-message", createOneMessage);

// function sendMessage(image) {
// 	const trimmed = messageInputEl.value.trim();
// 	messageInputEl.value = trimmed;
// 	if (trimmed || image) {
// 		connection.emit("send-message", { text: messageInputEl.value, imageUrl: image });
// 		messageInputEl.value = "";
// 	}
// 	hideBadge()
// }

// buttonEl.addEventListener("click", () => {
// 	if (fileInputEl.files[0]) {
// 		postImg()
// 	}
// 	else {
// 		sendMessage();
// 	}
// });


function postImg() {
	const xhr = new XMLHttpRequest();
	let formData = new FormData;
	formData.append('image', fileInputEl.files[0])
	xhr.open('POST', `/photos/upload`)
	xhr.send(formData)
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			const result = JSON.parse(xhr.response);
			const imageUrl = result.imageUrl;
			sendMessage(imageUrl)
		}
	}
}

messageInputEl.addEventListener("keydown", event => {
	if (event.key === "Enter") {
		if (fileInputEl.files[0]) {
			postImg()
			hideBadge()
		}
		else
			sendMessage();
	}
});

connection.on("send-system-message", createSysMsg);



// дальше идет все. что каcается отправки картинки



