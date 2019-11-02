// eslint-disable-next-line no-undef
let connection = new io("http://localhost:3000");

connection.on("server-error", data => {
  console.log(data);
});

connection.emit("send-handshake", localStorage.getItem("ID"));

connection.on("set-handshake", data => {
  localStorage.setItem("ID", data);
});
connection.on("send-messages-history", getHistory);

let chat = document.querySelector(".chat");

// let iconEl = document.querySelector('svg')
// iconEl.addEventListener('mouseenter', () => {
// 	iconEl.classList.remove('fas');
// 	iconEl.classList.add('far');
// });
// iconEl.addEventListener('mouseout', () => {
// 	iconEl.classList.remove('far');
// 	iconEl.classList.add('fas');
// });
// iconEl.addEventListener('mousedown', () => {
// 	iconEl.classList.remove('far', 'fa-times-circle');
// 	iconEl.classList.add('fas', 'fa-times');
// });
// iconEl.addEventListener('click', () => {
// 	modalEl.classList.add('displayNone');
// 	console.log("hueta");
// });

let modalEl = document.querySelector(".modal");
let loginInput = document.querySelector(".login");
let okButton = document.querySelector(".ok");

if (localStorage.key("ID") === null) {
  console.log("krasava");
  modalEl.classList.remove("displayNone");
}

function modalClose() {
  if (loginInput.value.length <= 1) {
    loginInput.removeAttribute("placeholder");
    loginInput.setAttribute("placeholder", "ИМЯ, СУКА!");
  } else if (loginInput.value.length > 0) {
    modalEl.classList.add("displayNone");
  }
  localStorage.setItem("ID", loginInput.value);
}

okButton.addEventListener("click", () => {
  modalClose();
});

loginInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    modalClose();
  }
});

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
  chat.scrollTo({
    top: chat.scrollHeight + 500,
    behavior: "instant"
  });
}

function isMyMessage(ID) {
  let isMyMessage = false;
  if (ID === localStorage.getItem("ID")) {
    isMyMessage = true;
  }
  return isMyMessage;
}

function createMessage(userId, message, timestamp, isMyMessage, imageUrl) {
  let containerEl = createMessageContainer();

  let messageEl = document.createElement("div");
  messageEl.classList.add("message");

  if (imageUrl) {
    const image = document.createElement("img");
    image.src = imageUrl;
    containerEl.appendChild(image);
  }

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
}

connection.on("send-client-message", createOneMessage);

let buttonEl = document.querySelector(".sendMessage");
let messageInputEl = document.querySelector(".sentText");

function sendMessage() {
  connection.emit("send-message", { text: messageInputEl.value, image: "" });
  messageInputEl.value = "";
}

buttonEl.addEventListener("click", () => {
  sendMessage();
});

messageInputEl.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

connection.on("send-system-message", createSysMsg);

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
