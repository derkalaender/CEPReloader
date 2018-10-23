const cs = new CSInterface();

const loc = window.location.pathname;
const dir = decodeURI(loc.substring(1, loc.lastIndexOf('/')));
const extensions_file = require(dir + "/reloadable.json");

let extensions = [];

const WIP = false;

function setup() {
    getExtensions();

    createButtons();

    if(WIP) {
        const filewatcher = require(dir + "/watcher.js");
        filewatcher.fileWatcher();
    }
}

function getExtensions() {
    let installed_extensions = cs.getExtensions();

    Object.keys(extensions_file).forEach(function(key) {
        let extension = {};
        extension.id = key;
        extension.restPath = extensions_file[key]["path"];
        extension.restPort = extensions_file[key]["port"];

        extension.autoReload = extensions_file[key]["automatic_reload"];

        //get more information about extensions
        installed_extensions.forEach(function(entry) {
            if(entry.id === key) {
                extension.basePath = entry["basePath"];
                extension.mainPath = entry["mainPath"];
                extension.displayName = entry["name"];
            }
        });

        extensions.push(extension);
    });
}

function createButtons() {
    extensions.forEach(function(entry) {
        const btn = document.createElement('button');
        const text = document.createTextNode(entry.displayName);
        btn.appendChild(text);

        btn.addEventListener('click', function () {
            reloadExtension(entry);
        });

        document.getElementById("extensions").appendChild(btn);
    });
}

function reloadExtension(extension) {
    const http = new XMLHttpRequest();
    const url = "http://localhost:" + extension.port + extension.path;

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
    }, 1000);
}