const dir = decodeURI(loc.substring(1, loc.lastIndexOf('/')));
const chokidar = require(dir + "/node_modules/chokidar/index.js");
const extensions = require(dir + "/reloadable.json");

let watcher;

module.exports = {
    fileWatcher: function () {
        fileWatcher();
    }
};

function fileWatcher() {
    watcher = chokidar.watch(null, {
        ignored: /(^|[\/\\])\../,
        ignoreInitial: true,
        persistent: true
    });

    watcher
        .on('add', path => watcherCallback(path))
        .on('addDir', path => watcherCallback(path))
        .on('unlink', path => watcherCallback(path))
        .on('unlinkDir', path => watcherCallback(path))
        .on('change', path => watcherCallback(path));

    Object.keys(extensions).forEach(function(key) {
        const enabled = extensions[key]["automatic_reload"];

        if(enabled === true) {
            const extension_of_interest = cs.getExtensions([key]);
            const path_to_extension = extension_of_interest[0]['basePath'];

            watcher.add(path_to_extension);
        }
    })
}

function watcherCallback(path) {
    Object.keys(extensions).forEach(function (key) {
        const extension_of_interest = cs.getExtensions([key]);
        const path_to_extension = extension_of_interest[0]['basePath'];

        console.log(path_to_extension);
        console.log(path);

        if(path.includes(path_to_extension)) {
            const port = extensions[key]["port"];
            const path = extensions[key]["path"];

            reloadExtension(key, port, path);
        }
    })
}
