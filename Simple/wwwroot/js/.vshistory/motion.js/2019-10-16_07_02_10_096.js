
//var signalRConnection = null;
//var logoId = 'imgLogo';
//var freezeMyself = false;

//var logo = document.getElementById(logoId);

//document.getElementById("imgLogo").addEventListener("click", function (event) {
//    event.preventDefault();
//    logo.src = '/imgs/77DD8CHD-8A1C-44AV-AAC9-CFBD5460.gif';
//});

//function setTextOnElement(elementId, textToSet) {
//    document.getElementById(elementId).innerHTML = textToSet;
//}

//function deviceOrientationHandler(eventData) {
//    //var absolute = eventData.absolute;
//    var gamma = eventData.gamma;
//    var beta = eventData.beta;
//    var alpha = eventData.alpha;

//    console.log(signalrConnectionExists());

//    if (signalrConnectionExists()) {
//        console.log("MySuperDuperAction");
//        signalRConnection
//            .invoke('MySuperDuperAction', { alpha, beta, gamma })
//            .catch(err => console.error(err.toString()));
//    }
//    else {
//        console.log("MySuperDuperAction else");
//        signalRConnection
//            .invoke('MySuperDuperAction', { alpha, beta, gamma })
//            .catch(err => console.error(err.toString()));
//    }

//    //setTextOnElement('absolute', Math.round(absolute));
//    setTextOnElement('gamma', Math.round(gamma));
//    setTextOnElement('beta', Math.round(beta));
//    setTextOnElement('alpha', Math.round(alpha));
//}

//function turnLogo(beta, gamma) {
//    console.log(beta);
//    console.log(gamma);
//    console.log(beta + gamma);
//    logo.style.webkitTransform = 'rotate(' + gamma + 'deg) rotate3d(1,0,0, ' + beta * -1 + 'deg)';
//    logo.style.MozTransform = 'rotate(' + gamma + 'deg)';
//    logo.style.transform = 'rotate(' + gamma + 'deg) rotate3d(1,0,0, ' + beta * -1 + 'deg)';
//}

//function establishSignalR() {
//    signalRConnection = createSignalConnection('/deviceOrientation');

//    signalRConnection.on("motionUpdated", function (data) {
//        console.log(data);
//        console.log("freezeMyself" + freezeMyself);
//        if (!freezeMyself) {
//            turnLogo(data.beta, data.gamma);
//        }
//    });

//    signalRConnection.start().then(function () {
//        console.log('connected');
//        console.log(signalRConnection.state);
//    }).catch(function (err) {
//        return console.error(err.toString());
//    });
//}

//function createSignalConnection(url) {
//    return new signalR.HubConnectionBuilder()
//        .withUrl(url)
//        .configureLogging(signalR.LogLevel.Information)
//        .build();
//}

//function signalrConnectionExists() {
//    return signalRConnection.state === 1;
//}

//function toggleFreeze() {
//    var checkBox = document.getElementById('freeze');
//    var text = document.getElementById('text');

//    freezeMyself = checkBox.checked;

//    if (checkBox.checked === true) {
//        text.style.display = 'block';
//        logo.src = '/imgs/67DD8CDD-8A1C-44A1-AAC9-CFBAEB60.gif';
//    } else {
//        text.style.display = 'none';
//        logo.src = '/imgs/78576473-BE7D-442D-940C-F7CBB55C.gif';
//    }
//}

//if ('DeviceOrientationEvent' in window) {
//    window.addEventListener('deviceorientation', deviceOrientationHandler, true);
//    establishSignalR();
//}
//else {
//    alert("دستگاه شما از این قابلیت پشتیبانی نمیکند ..");
//    //document.getElementById('logoContainer').innerText = 'دستگاه شما از این قابلیت پشتیبانی نمیکند ..';
//}

































"use strict";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/deviceOrientation")
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    //.withAutomaticReconnect([0, 0, 10000])
    // .withAutomaticReconnect([0, 2000, 10000, 30000]) yields the default behavior
    //.withAutomaticReconnect({
    //    nextRetryDelayInMilliseconds: retryContext => {
    //        if (retryContext.elapsedMilliseconds < 60000) {
    //            // If we've been reconnecting for less than 60 seconds so far,
    //            // wait between 0 and 10 seconds before the next reconnect attempt.
    //            return Math.random() * 10000;
    //        } else {
    //            // If we've been reconnecting for more than 60 seconds so far, stop reconnecting.
    //            return null;
    //        }
    //    })
    .build()
;

connection.on("MotionUpdated", function (alpha, beta, gamma) {
    alert("MotionUpdated");
    alert(alpha, beta, gamma);

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#FF7777";
    ctx.font = "14px Verdana";
    ctx.fillText("Alpha: " + Math.Round(alpha), 10, 20);
    ctx.beginPath();
    ctx.moveTo(180, 75);
    ctx.lineTo(210, 75);
    ctx.arc(180, 75, 60, 0, alpha * Math.PI / 180);
    ctx.fill();

    ctx.fillStyle = "#FF6600";
    ctx.fillText("Beta: " + Math.round(beta), 10, 140);
    ctx.beginPath();
    ctx.fillRect(180, 150, beta, 90);

    ctx.fillStyle = "#FF0000";
    ctx.fillText("Gamma: " + Math.round(gamma), 10, 270);
    ctx.beginPath();
    ctx.fillRect(90, 340, 180, gamma);
});

connection.onreconnecting((error) => {
    console.assert(connection.state === signalR.HubConnectionState.Reconnecting);
    console.assert(connection.state === signalR.HubConnectionState.Connected);

    document.getElementById("messageInput").disabled = true;

    const li = document.createElement("li");
    li.textContent = `Connection lost due to error "${error}". Reconnecting.`;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function () {
    alert("Start");
}).catch(function (err) {
    return console.error(err.toString());
});

connection.onclose((error) => {
    console.assert(connection.state === signalR.HubConnectionState.Disconnected);

    document.getElementById("messageInput").disabled = true;

    const li = document.createElement("li");
    li.textContent = `Connection closed due to error "${error}". Try refreshing this page to restart the connection.`;
    document.getElementById("messagesList").appendChild(li);
});

//async function start() {
//    try {
//        await connection.start();
//        console.assert(connection.state === signalR.HubConnectionState.Connected);
//        console.log("connected");
//    } catch (err) {
//        console.assert(connection.state === signalR.HubConnectionState.Disconnected);
//        console.log(err);
//        setTimeout(() => start(), 5000);
//    }
//};

function deviceOrientationListener(event) {
    alert("deviceOrientationListener");
    alert(connection.state);
    if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke("MySuperDuperAction", event.alpha, event.beta, event.gamma)
            .catch(function (err) {
                alert("MySuperDuperAction");
                return console.error(err.toString());
            });
    } else {
        alert("connection.state != 1");
    }
}

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", deviceOrientationListener);
} else {
    alert("Sorry, your browser doesn't support Device Orientation");
}