"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    alert("ReceiveMessage");
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function () {
    alert("Start");
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    alert("sendButton");
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage2", user, message).catch(function (err) {
        alert("SendMessage");
        return console.error(err.toString());
    });
    connection.invoke("SendMessage", {user , message}).catch(function (err) {
        alert("SendMessageDto");
        return console.error(err.toString());
    });
    event.preventDefault();
});





function deviceOrientationListener(event) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#FF7777";
    ctx.font = "14px Verdana";
    ctx.fillText("Alpha: " + Math.Round(event.alpha), 10, 20);
    ctx.beginPath();
    ctx.moveTo(180, 75);
    ctx.lineTo(210, 75);
    ctx.arc(180, 75, 60, 0, event.alpha * Math.PI / 180);
    ctx.fill();

    ctx.fillStyle = "#FF6600";
    ctx.fillText("Beta: " + Math.round(event.beta), 10, 140);
    ctx.beginPath();
    ctx.fillRect(180, 150, event.beta, 90);

    ctx.fillStyle = "#FF0000";
    ctx.fillText("Gamma: " + Math.round(event.gamma), 10, 270);
    ctx.beginPath();
    ctx.fillRect(90, 340, 180, event.gamma);
}

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", deviceOrientationListener);
} else {
    alert("Sorry, your browser doesn't support Device Orientation");
}

