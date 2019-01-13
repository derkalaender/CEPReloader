# CEPReloader
Completely reloads your Adobe CEP Extensions with just a click!
## Getting started
These instructions tell you how you can install the plugin to Adobe Premiere
### Prerequisites
1. Enable loading of unsigned extensions as described [here](https://github.com/Adobe-CEP/Samples/tree/master/PProPanel#2-enable-loading-of-unsigned-panels) (for a detailed tutorial click [here](https://youtu.be/-QOrJgykr-4))
2. Of course, you have to add another extension to test the plugin (click [here](https://premiereonscript.com/log-03/) for a tutorial) if you haven't already
3. You have to download npm from its site (follow the instructions [here](https://www.npmjs.com/get-npm)) If you don't already have the programm
### Installing
1. [Download the zip](https://github.com/derkalaender/CEPReloader/archive/master.zip) of the repository, unzip it and paste it into your extension folder whose location you can find out [here](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_8.x/Documentation/CEP%208.0%20HTML%20Extension%20Cookbook.md#extension-folders)
2. (Optional) rename the project folder to ``CEPReloader`` (that looks better but technically changes nothing)
3. To add your extension(s) that should be reloaded, you have to change the file ``client/reloadable.json`` as follows:
    ```JSON
    {
        "EXTENSION_ID": {
          "automatic_reload": false
        },
        "ANOTHER_EXTENSION_ID": {
          "automatic_reload": false
        }
    }
    ```
    Notes:
    - EXTENSION_ID has to be changed to your extension-id as you should have set it in ``MyExtension/CSXS/manifest.xml`` where MyExtension is the folder of your extension
    - If you have two or more extensions that you want to reload, add them as it was done with ``ANOTHER_EXTENSION_ID``
4. Open a terminal or console (depends on whether you are using Unix or Windows) and head with it to ``CEPReloader/client`` where CEPReloader is the folder where you've installed this extension (in my case ``C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\CEPReloader\client``) and run these commands:
    ```
    npm install chokidar --save
    npm install xml2js
    ```
    afterwards you can close the terminal/console
5. In your own extension you have to insert the following code somewhere after the ``cs (CSInterface)`` was initialized:
    ```HTML
    <script type="text/javascript">
       cs.addEventListener(cs.getExtensionID(), function(event) {
           let confirmEvent = new CSEvent(event.extensionId, event.scope, cs.getApplicationID(),                       cs.getExtensionID());
           confirmEvent.data = 'ok';
           cs.dispatchEvent(confirmEvent);
           cs.closeExtension();
       });
    </script>
    ```
6. (Re)start Premiere and head to ``Windows -> Extensions -> CEPReloader``
### Summary
If you took the example from [Prerequisites](readme.md#prerequisites), your ``MyProject/index.html``-file should look as follows:
```html
<!DOCTYPE html>
<!-- This document forms the dockable panel. The button is the <input> tag below. The <style> formats the button. 

		The extendscript is called through the <script type="text/javascript"> tag, which then routes it to use the adobe_cep_.evalScript to interpret that Javascript into Extendscript -->

<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>GIVE YOUR PANEL A TITLE</title>
		<script src="./lib/CSInterface.js"></script>
		<script type="text/javascript">
		const cs = new CSInterface;
		    function runAll() {
            	cs.evalScript('$.runScript.changeThisFunctionName()');
            }
        </script>	
		<style>
			body {
				background-color: #262626;
				color: #f5f5f5;
				text-align: center;
			}
			input {
				display: block;
				margin: auto;
				max-width: 100%;
			}
		</style>
	</head>
	<body>
		<button id="runButton" onclick="runAll()" type="run">CHANGE TEXT HERE!!</button>
	</body>
</html>
```
## Authors
- [derkalaender](https://github.com/derkalaender) - Initial work

See also the list of [contributors](https://github.com/derkalaender/CEPReloader/contributors) who participated in this project