const cs = new CSInterface();
const product = cs.getApplicationID();

const loc = window.location.pathname;
const dir = decodeURI(loc.substring(1, loc.lastIndexOf('/')));

const fs = require('fs');
const parser = require(dir + "/node_modules/xml2js/lib/xml2js.js");


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
            if(entry["id"] === extension.id) {
                extension.basePath = entry["basePath"];
                extension.mainPath = entry["mainPath"];
                extension.displayName = entry["name"];
            }
        });

        //get debug port if .debug file exists
        if(fs.existsSync(extension.basePath + "/.debug")) {
            const content = fs.readFileSync(extension.basePath + "/.debug").toString();

            //extract debugPort by converting xml to js object
            parser.parseString(content, function(err, result) {
                result["ExtensionList"]["Extension"].forEach(function(extensionXML) {
                    if(extensionXML['$']["Id"] === extension.id) {
                        extensionXML["HostList"]["0"]["Host"].forEach(function(host) {
                            if(host['$']["Name"] === product) {
                                extension.debugPort = host['$']["Port"];
                            }
                        })
                    }
                })
            });
        }

        extensions.push(extension);
    });
}

function createButtons() {
    extensions.forEach(function(entry) {
        const btnMain = document.createElement('button');
        btnMain.className = 'btnMain';
        const text_btnMain = document.createTextNode(entry.displayName);
        btnMain.appendChild(text_btnMain);
        btnMain.addEventListener('click', function() {
            reloadExtension(entry);
        });

        const btnFolder = document.createElement('button');
        btnFolder.className = 'btnFolder';
        btnFolder.innerHTML = '<img src="folder.png"/>';
        btnFolder.addEventListener('click', function() {
            openExtensionFolder(entry);
        });

        document.getElementById("extensions").appendChild(btnMain);
        document.getElementById("extensions").appendChild(btnFolder);
    });
}

function openExtensionFolder(extension) {
    const path = extension.basePath;
    require('child_process').exec('start "" "' + path + '"');
}

function reloadExtension(extension) {
    const http = new XMLHttpRequest();
    const url = "http://localhost:" + extension.restPort + extension.restPath;

    console.log('Reloading Extension');

    http.open("GET", url);
    http.send();


    http.onload = function () {
        console.log("Extension successfully killed");
        requestExtension(extension.id);
    };

    http.onerror = function () {
        console.log("Extensions seems to be killed already. Calling it nevertheless.");
        requestExtension(extension.id);
    }
}

function requestExtension(id) {
    //Wait half a second before launching again, otherwise Premiere just doesn't care
    setTimeout(function() {
        cs.requestOpenExtension(id, "");
    }, 500);
}