
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

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/deviceOrientation")
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build()
    ;

connection.on("MotionUpdated", function (alpha, beta, gamma) {
    alert("MotionUpdated");
    logo.style.webkitTransform = 'rotate(' + gamma + 'deg) rotate3d(1,0,0, ' + beta * -1 + 'deg)';
    logo.style.MozTransform = 'rotate(' + gamma + 'deg)';
    logo.style.transform = 'rotate(' + gamma + 'deg) rotate3d(1,0,0, ' + beta * -1 + 'deg)';
});

function establishSignalR() {
    signalRConnection = createSignalConnection('/deviceOrientation');

    signalRConnection.on("motionUpdated", function (data) {
        console.log(data);
        console.log("freezeMyself" + freezeMyself);
        if (!freezeMyself) {
            turnLogo(data.beta, data.gamma);
        }
    });

    signalRConnection.start().then(function () {
        console.log('connected');
        console.log(signalRConnection.state);
    }).catch(function (err) {
        return console.error(err.toString());
    });
}

function createSignalConnection(url) {
    return new signalR.HubConnectionBuilder()
        .withUrl("/deviceOrientation")
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect()
        .build()
        ;
}


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

function deviceOrientationListener(eventData) {

    var alpha = eventData.alpha;
    var beta = eventData.beta;
    var gamma = eventData.gamma;

    connection.invoke("MySuperDuperAction", alpha, beta, gamma);
    //if (connection.state === signalR.HubConnectionState.Connected) {
    //    alert(connection.state);
    //    connection.invoke("MySuperDuperAction", event.alpha, event.beta, event.gamma)
    //        .catch(function (err) {
    //            alert(err.toString());
    //            return console.error(err.toString());
    //        });
    //} else {
    //    alert("connection.state != 1");
    //}

    setTextOnElement('alpha', Math.round(alpha));
    setTextOnElement('beta', Math.round(beta));
    setTextOnElement('gamma', Math.round(gamma));
}

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", deviceOrientationListener, false);
} else {
    alert("Sorry, your browser doesn't support Device Orientation");
}