const socket = io(); // Initialize Socket.IO on the client-side

let names;
let textArea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message_area");
let buttonClicked = document.querySelector("#buttonClicked");
let messageSound = document.querySelector("#messageSound");
let i=0;
do {
  names = prompt("please enter your name");
} while (!names);

// Send user's name to the server
socket.emit("userName", names);

// Function to send a message
function sendMessage() {
  let message = textArea.value.trim();
  if (message !== "") {
    let msg = {
      user: names,
      message: message,
    };
    // Append message to the message area
    appendMessage(msg, "outgoing");
    // Send message to the server
    socket.emit("message", msg);
    // Clear the textarea
    textArea.value = "";
  }
}

// Event listener for textarea keyup event
textArea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Event listener for button click event
buttonClicked.addEventListener("click", () => {
  sendMessage();
});

// Function to append message to the message area
function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");
  let newTime= new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  let markup = `
    <h4>${msg.user} ${ newTime}</h4>
    <p id=${++i}>${msg.message}</p>
  `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

// Receive message from the server
socket.on("message", (msg) => {
  // console.log(msg);
  appendMessage(msg, "incoming");
  
    messageSound.play();
  
});

// Receive connected users list from the server
socket.on("users", (users) => {
  document.getElementById("joinedUsersList").innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user.name +` joined the chat `; 
    document.getElementById("joinedUsersList").appendChild(li);
  });
});
