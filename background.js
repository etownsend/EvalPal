// Tracks whether the extension is turned on or off
var enabled = true;
// Information for the tab containing the registration page
var duckwebTab = {};

// Injects the registration page with javascript and css
function setupRegistration(){
	chrome.tabs.executeScript({ file: "utils/jquery.js" }, function() {
		chrome.tabs.executeScript({ file: "utils/jquery-ui.js" }, function() {
			chrome.tabs.executeScript({ file: "data.js" }, function() {
				chrome.tabs.executeScript({ file: "injectRegistration.js" });
			});
		});
	});
	chrome.tabs.insertCSS({ file: 'utils/jquery-ui.css' }, function() {
		chrome.tabs.insertCSS({ file: 'utils/tooltip.css' });
	});
}

// Initializes an iframe to scrape the eval information from
function setupEval() {
	// Reset everything when the registration tab updates
	chrome.tabs.onUpdated.addListener(function(id, changeInfo, tab) {
		if(id == duckwebTab.id) {
			console.log("Registration page Updated");
			//Close Eval Frame
			iframe.src = "about:blank";
			// Reload Extension
			chrome.runtime.reload();
		}
	});

	// Start the eval frame
	var urlVar = "https://duckweb.uoregon.edu/pls/prod/hwskwbis.P_CourseEvaluations";
	var iframe = document.getElementById("eval");
	iframe.src = urlVar;
}

// Sets up message passing between the registration and eval pages
function setupMessaging() {
	// Copies of the ports for the reg and eval pages
	var regPort = null;
	var evalPort = null;
	chrome.runtime.onConnect.addListener(function(port) {
		if (port.name == "reg") {
			// Connection to registration page
			regPort = port;
			console.log("Reg Connected");
			port.onDisconnect.addListener(function(info) {
				regPort = null;
			});
			port.onMessage.addListener(function(message) {
				console.log("reg->eval: ", message);
				if(evalPort) evalPort.postMessage(message);
				else console.log("     Error: bad port");
			});
		} else if (port.name == "eval") {
			// Connection to eval page
			evalPort = port;
			console.log("eval connected");
			port.onDisconnect.addListener(function(info) {
				evalPort = null;
			})
			port.onMessage.addListener(function(message) {
				console.log("eval->reg, ", message);
				if(regPort) regPort.postMessage(message);
				else console.log("     Error: bad port");
			});
			
		} else {
			console.log("Error, port name: ", port.name);
		}
	});
}

// Verifies that we're on the right page, then starts the pageAction and initializes
// the extension.
function checkPage(tabId, changeInfo, tab) {
	if(
		(changeInfo.status == "complete") && 
		(tab.url.indexOf("duckweb.uoregon.edu") != -1) &&
		(tab.title === "Look-Up Classes to Add:")
	) {
		chrome.tabs.onUpdated.removeListener(checkPage);
		chrome.pageAction.show(tabId);

		// Remembering info for current active tab
		chrome.tabs.query({currentWindow: true, active: true}, function(tabsArray) {
			// Guaranteed to be only 1 active tab
			duckwebTab = tabsArray[0];
		});

		// Starting the extension
		setupMessaging();
		setupEval();
		setupRegistration();
		return true;
	} else {
		return false;
	}
}

// Sets the extension to initialize if the correct page is navigated to.
chrome.tabs.query( {currentWindow: true, active: true}, function(tabs) {
	// Checks the current Page
	var a = checkPage(tabs[0].id, {status: "complete"}, tabs[0]);
	// Otherwise, sets an event listener;
	if (!a && enabled) {
		chrome.tabs.onUpdated.addListener(checkPage);
	}
});