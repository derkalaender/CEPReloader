// Loading CS Interface and express via npm
const csInterface = new CSInterface();

const http = new XMLHttpRequest();
const url = "http://localhost:8081/kill";

function reloadExtension() {
    console.log('Reloading Extension');

    http.open("GET", url);
    http.send();


    http.onload = function () {
        console.log("Extension successfully killed");
        requestExtension();
    };

    http.onerror = function () {
        console.log("Extensions seems to be killed already. Calling it nevertheless.");
        requestExtension();
    }
}

function requestExtension() {
    //Wait half a second before launching again, otherwise Premiere just doesn't care

    setTimeout(function() {
        csInterface.requestOpenExtension("de.sebinside.premiereahk.panel", "");
    }, 500);
}