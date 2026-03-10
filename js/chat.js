const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

const token = localStorage.getItem("token");

/* GET CHATROOM ID FROM URL */
/* example: chatroom.html?id=123 */

const urlParams = new URLSearchParams(window.location.search);
const chatroomId = urlParams.get("id");

/* CHECK REQUIRED DATA */

if (!chatroomId) {
  console.error("Chatroom ID missing in URL");
}

if (!token) {
  console.warn("User not logged in");
}

/* SEND MESSAGE EVENTS */

if (sendBtn) {
  sendBtn.addEventListener("click", sendMessage);
}

if (chatInput) {
  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
}

/* SEND MESSAGE FUNCTION */

async function sendMessage() {

  const text = chatInput.value.trim();

  if (text === "") return;

  /* SHOW MESSAGE IN CHAT BOX */

  const messageDiv = document.createElement("div");

  messageDiv.classList.add("chat-message", "sent");

  messageDiv.innerHTML = `
    <strong>You</strong>
    ${text}
  `;

  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;

  chatInput.value = "";

  /* SEND MESSAGE TO BACKEND */

  try {

    await fetch("http://localhost:5000/api/chatrooms/message", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },

      body: JSON.stringify({
        chatroomId: chatroomId,
        message: text
      })

    });

  } catch (error) {

    console.error("Message send error:", error);

  }

}

/* LOAD CHAT HISTORY */

async function loadMessages() {

  try {

    const response = await fetch(
      `http://localhost:5000/api/chatrooms/${chatroomId}/messages`
    );

    const messages = await response.json();

    chatBox.innerHTML = "";

    messages.forEach(msg => {

      const messageDiv = document.createElement("div");

      messageDiv.classList.add("chat-message");

      if (msg.isSelf) {
        messageDiv.classList.add("sent");
      } else {
        messageDiv.classList.add("received");
      }

      messageDiv.innerHTML = `
        <strong>${msg.senderName}</strong>
        ${msg.message}
      `;

      chatBox.appendChild(messageDiv);

    });

    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    console.error("Load messages error:", error);
  }

}

/* AUTO LOAD MESSAGES */

if (chatroomId) {
  loadMessages();
}

/* AUTO REFRESH EVERY 3 SECONDS */

setInterval(() => {
  if (chatroomId) {
    loadMessages();
  }
}, 3000);