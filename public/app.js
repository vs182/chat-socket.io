(function() {
    const app = document.querySelector(".app")
    const socket = io();
    let uname;
    app.querySelector(".join-screen #join_user").addEventListener("click", function() {
        let username = app.querySelector(".join-screen #username").value;
        if (username.length == 0) {
            return;
        }
        socket.emit("newuser", username)
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");

    })

    app.querySelector(".chat-screen #send_message").addEventListener("click", function() {
        let message = app.querySelector(".chat-screen #message_input").value;
        if (message.length == 0) {
            return;
        }

        renderMessage("my", {
            username: uname,
            text: message

        });
        socket.emit("chat", {
            username: uname,
            text: message
        });

        app.querySelector(".chat-screen #message_input").value = "";
    });
    app.querySelector(".chat-screen #exit_chat").addEventListener("click", function() {
        socket.emit("exituser", uname);
        window.location.href = window.location.href
    })

    socket.on("update", function(update) {
        renderMessage("update", update);
    })

    socket.on("chat", function(message) {
        renderMessage("other", message);
    })

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (type == "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");

            if ((message.text.includes("https://")) || (message.text.includes("http://"))) {
                el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text"><a target="_blank" href="${message.text}">${message.text}</a></div>
                    <p class="date">${new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}<p>

                </div>
            `;
            } else {
                el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                    <p class="date">${new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}<p>

                </div>
            `;
            }
            messageContainer.appendChild(el)
        } else if (type == "other") {

            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            if ((message.text.includes("https://")) || (message.text.includes("http://"))) {
                el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text"><a target="_blank" href="${message.text}">${message.text}</a></div>
                    <p class="date">${new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}<p>

                </div>
            `;
            } else {
                el.innerHTML = `
                <div>   
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                    <p class="date">${new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}<p>
                </div>
            `;
            }
            messageContainer.appendChild(el)
        } else if (type == "update") {

            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el)
        }

        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight
    }

})();