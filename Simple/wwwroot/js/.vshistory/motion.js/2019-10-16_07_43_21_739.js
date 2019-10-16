
"use strict";

var connection = null;
var freezeMyself = false;
var logo = document.getElementById("imgLogo");

logo.addEventListener("click", function (event) {
    event.preventDefault();
    logo.src = '/imgs/77DD8CHD-8A1C-44AV-AAC9-CFBD5460.gif';
});

function setTextOnElement(elementId, textToSet) {
    document.getElementById(elementId).innerHTML = textToSet;
}

function turnLogo(beta, gamma) {
    logo.style.webkitTransform = 'rotate(' + gamma + 'deg) rotate3d(1,0,0, ' + beta * -1 + 'deg)';
    logo.style.MozTransform = 'rotate(' + gamma + 'deg)';
    logo.style.transform = 'rotate(' + gamma + 'deg) rotate3d(1,0,0, ' + beta * -1 + 'deg)';
}

function toggleFreeze() {
    var checkBox = document.getElementById('freeze');
    var text = document.getElementById('text');

    freezeMyself = checkBox.checked;

    if (checkBox.checked === true) {
        text.style.display = 'block';
        logo.src = '/imgs/67DD8CDD-8A1C-44A1-AAC9-CFBAEB60.gif';
    } else {
        text.style.display = 'none';
        logo.src = '/imgs/78576473-BE7D-442D-940C-F7CBB55C.gif';
    }
}

function createSignalConnection(url) {
    return new signalR.HubConnectionBuilder()
        .withUrl(url)
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect()
        .build()
        ;
}

function establishSignalR() {
    connection = createSignalConnection('/deviceOrientation');

    connection.on("MotionUpdated", function (alpha, beta, gamma) {
        alert("MotionUpdated");
        if (!freezeMyself) {
            toggleFreeze(beta, gamma);
        }
    });

    connection.start().then(function () {
        alert("Start");
    }).catch(function (err) {
        return console.error(err.toString());
    });

    connection.onreconnecting((error) => {
        console.assert(connection.state === signalR.HubConnectionState.Reconnecting);
        console.assert(connection.state === signalR.HubConnectionState.Connected);
    });

    connection.onclose((error) => {
        console.assert(connection.state === signalR.HubConnectionState.Disconnected);
    });
}

function signalrConnectionExists() {
    return connection.state === signalR.HubConnectionState.Connected;
}

function deviceOrientationListener(eventData) {

    var alpha = eventData.alpha;
    var beta = eventData.beta;
    var gamma = eventData.gamma;

    setTextOnElement('alpha', Math.round(alpha));
    setTextOnElement('beta', Math.round(beta));
    setTextOnElement('gamma', Math.round(gamma));

    if (signalrConnectionExists()) {
        connection.invoke("MySuperDuperAction", alpha, beta, gamma)
            .catch(function (err) {
                alert(err.toString());
                return console.error(err.toString());
            });
    }
}

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", deviceOrientationListener, true);
    establishSignalR();
} else {
    alert("متاسفانه مرورگر شما از این API پشتیبانی نمیکند ..");
}
