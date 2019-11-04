let chat = document.querySelector('.chat');
let fileInputEl = document.querySelector('.fileInput')
let imgInfoEl = document.querySelector('.imgInfo')
let badgeEl = document.querySelector('.badge')
let modalEl = document.querySelector(".modal");
let loginInput = document.querySelector(".login");
let okButton = document.querySelector(".ok");
let buttonEl = document.querySelector(".sendMessage");
let messageInputEl = document.querySelector(".sentText");

function modalClose() {
	if (loginInput.value.length <= 1) {
		loginInput.removeAttribute("placeholder");
		loginInput.setAttribute("placeholder", "ИМЯ, СУКА!");
	} else if (loginInput.value.length > 0) {
		modalEl.classList.add("displayNone");
	}
}

okButton.addEventListener("click", () => {
	modalClose();
});

loginInput.addEventListener("keydown", event => {
	if (event.key === "Enter") {
		modalClose();
	}
});

function ScrollChatDown() {
	chat.scrollTo({
		top: chat.scrollHeight + 500,
		behavior: "instant"
	});
}

function createMessage(userId, message, timestamp, isMyMessage, imageUrl) {
	let containerEl = createMessageContainer();

	let messageEl = document.createElement("div");
	messageEl.classList.add("message");


	if (isMyMessage === true) {
		messageEl.classList.add("outText");
		containerEl.classList.add("drag-right");
	} else {
		messageEl.classList.add("inText");
	}
	let name = document.createElement("div");
	name.classList.add("name");
	name.innerText = userId;


	let textEl = document.createElement("span");
	textEl.innerText = message;

	let timeEl = document.createElement("span");
	timeEl.classList.add("time");

	const date = new Date(timestamp);

	timeEl.innerText = `${date.getHours()}:${date.getMinutes()}`;

	chat.append(containerEl);
	containerEl.append(messageEl);
	messageEl.append(name, textEl, timeEl);

	if (imageUrl) {
		let divImg = document.createElement("div")
		const image = document.createElement("img");
		image.classList.add('imgSize')
		image.src = imageUrl;
		messageEl.append(divImg);
		divImg.append(image)
	}
	messageEl.append(timeEl);
}

function hideBadge() {
	fileInputEl.value = ''
	badgeEl.classList.add('badge_opacity_0')
}

function createMessageContainer() {
	let containerEl = document.createElement("div");
	containerEl.classList.add("messageContainer");
	return containerEl;
}

function createSysMsg(text) {
	let containerEl = createMessageContainer();
	let sysMsgEl = document.createElement("div");
	sysMsgEl.classList.add("systemMsg");
	containerEl.append(sysMsgEl);
	chat.append(containerEl);
	sysMsgEl.innerText = text;
}

fileInputEl.addEventListener("change", () => {
	if (fileInputEl.value !== "") {
		messageInputEl.focus()
		imgInfoEl.innerText = fileInputEl.files[0].name
		badgeEl.classList.remove('badge_opacity_0')
	}
});

badgeEl.addEventListener('click', () => {
	hideBadge()
})