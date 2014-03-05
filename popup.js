// Injects javascript into the tab and then closes the popup
var dwp = {
  navigateEval: function(tab) {
    var evalTab = tab;
    setTimeout(function () {
      chrome.tabs.executeScript(tab.id, {file: 'injectEvalStage1.js'});
      setTimeout(function () {
        chrome.tabs.executeScript(tab.id, {file: 'injectEvalStage2.js'});
        setTimeout(function () {
          chrome.tabs.executeScript(tab.id, {file: 'injectEvalStage3.js'});
          setTimeout(function() {
            chrome.tabs.sendMessage(tab.id, {name: "154874"});
              setTimeout(function() {
              chrome.tabs.executeScript(tab.id, {file: 'injectEvalStage3.js'});
            }, 4000);
          }, 3000);
        }, 3000);   // end 3rd timeout
      }, 3000);   // end 2nd timeout
    }, 3000);   // End 1st timeout
  },

  initializePages: function () {
  
    /*chrome.runtime.onMessage.addListener(
      function(message, sender, sendResponse) {
        //document.getElementById('test').innerHTML = message.response;
        //chrome.tabs.executeScript({string: message.response});
    });*/

    var urlVar = "https://duckweb.uoregon.edu/pls/prod/hwskwbis.P_CourseEvaluations";
    chrome.tabs.create({url: urlVar, active: false}, dwp.navigateEval);
    
    //this was added by sarah
    chrome.tabs.executeScript({ file: "jquery.js" }, function() {
      chrome.tabs.executeScript({ file: "jquery-ui.js" }, function() {
      	chrome.tabs.executeScript({ file: "fuse.min.js" }, function() {
			chrome.runtime.onConnect.addListener(function(port) {
  				console.assert(port.name == "knockknock");
  				port.onMessage.addListener(function(msg) {
    				if (msg.profs != "") {
    					chrome.tabs.executeScript({ code: 'var profList = ' + JSON.stringify(msg.profs) }, function() {
    						chrome.tabs.executeScript({ file: "injectRegistration.js" });
    					});
    				}
  				});
			});
    	});
      });
    });
    chrome.tabs.insertCSS({ file: 'jquery-ui.css' }, function() {
      chrome.tabs.insertCSS({ file: 'tooltip.css' });
    });
    
    //window.close();
    
    
  }
};

// Registers event listeners to buttons on page load
document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById("lookupButton");
  button.addEventListener('click', dwp.initializePages, false);
}, false);