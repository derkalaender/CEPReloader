// Loading CS Interface and express via npm
const cs = new CSInterface();

const loc = window.location.pathname;
const dir = decodeURI(loc.substring(1, loc.lastIndexOf('/')));
const extensions = require(dir + "/../reloadable.json");

const http = new XMLHttpRequest();

function createButtons() {
    Object.keys(extensions).forEach(function(key) {
        const displayName = extensions[key]["displayName"];
        const port = extensions[key]["port"];
        const path = extensions[key]["path"];

        const btn = document.createElement('button');
        const text = document.createTextNode(displayName);
        btn.appendChild(text);

        btn.addEventListener('click', function () {
            reloadExtension(key, port, path);
        });

        document.getElementById("extensions").appendChild(btn);
    })
}

function reloadExtension(id, port, path) {
    const url = "http://localhost:" + port + path;

    console.log('Reloading Extension');

    http.open("GET", url);
    http.send();


    http.onload = function () {
        console.log("Extension successfully killed");
        requestExtension(id);
    };

    http.onerror = function () {
        console.log("Extensions seems to be killed already. Calling it nevertheless.");
        requestExtension(id);
    }
}

function requestExtension(id) {
    //Wait half a second before launching again, otherwise Premiere just doesn't care
    setTimeout(function() {
        cs.requestOpenExtension(id, "");
    }, 500);
}