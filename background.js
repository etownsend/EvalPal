// Tracks whether the extension is turned on or off
var enabled = false;
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
			enabled = false;
			console.log("Registration page Updated");
			//Close Eval Frame
			iframe.src = "about:blank";
			// Reload Extension
			chrome.runtime.reload();
		}
	});

	// Start the eval frame	
var iframe = document.getElementById("eval");
	iframe.src = "https://duckweb.uoregon.edu/pls/prod/hwskwbis.P_CourseEvaluations";
}

// Sets up message passing between the registration and eval pages
function setupMessaging() {
	// Copies of the ports for the reg and eval pages
	var regPort = null;
	var evalPort = null;
	// Forwards messages back and forth between pages during operation
	chrome.runtime.onConnect.addListener(function(port) {
		if (port.name == "reg") {
			// Connection to registration page
			regPort = port;
			console.log("Registration Page Connected");
			port.onDisconnect.addListener(function(info) {
				regPort = null;
			});
			port.onMessage.addListener(function(message) {
				console.log("reg->eval:", message);
				if(evalPort) evalPort.postMessage(message);
				else console.log("     Error: bad port");
			});
		} else if (port.name == "eval") {
			// Connection to eval page
			evalPort = port;
			console.log("Eval Page Connected");
			port.onDisconnect.addListener(function(info) {
				evalPort = null;
			})
			port.onMessage.addListener(function(message) {
				console.log("eval->reg:", message);
				if(regPort) regPort.postMessage(message);
				else console.log("     Error: bad port");
			});
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
		enabled = true;
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

// Validates instances of applyweb (the site hosting the eval page) so that we
// only work with the ones we have opened just in case the user is browsing it
// on their own
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	// Only respond to queries of if the extension is enabled
	if(message.probe) {
		sendResponse(enabled && sender.tab==null);
	}
});

// Sets the extension to initialize if the correct page is navigated to.
chrome.tabs.query( {currentWindow: true, active: true}, function(tabs) {
	// Checks the current Page
	var a = checkPage(tabs[0].id, {status: "complete"}, tabs[0]);
	// Otherwise, sets an event listener;
	if (!a) {
		chrome.tabs.onUpdated.addListener(checkPage);
	}
});