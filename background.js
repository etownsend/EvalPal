// Injects javascript into the tab and then closes the popup
var dwp = {
  evalTab:{},
  duckwebTab:{},

  navigateEval: function(tab) {
    evalTab = tab;
    setTimeout(function () {
      chrome.tabs.executeScript(tab.id, {file: 'injectEvalStage1.js'});
      setTimeout(function () {
        chrome.tabs.executeScript(tab.id, {file: 'injectEvalStage2.js'});
        setTimeout(function () {
          chrome.tabs.executeScript(tab.id, {file: 'injectEvalStage3.js'});
        }, 3000);   // end 3rd timeout
      }, 3000);   // end 2nd timeout
    }, 3000);   // End 1st timeout
  },

  initializePages: function () {
    // Remembering info for current active tab
    chrome.tabs.query({currentWindow: true, active: true}, function(tabsArray) {
      // Guaranteed to be only 1 active tab
      duckwebTab = tabsArray[0];
    });

    // Open the eval tab
    var urlVar = "https://duckweb.uoregon.edu/pls/prod/hwskwbis.P_CourseEvaluations";
    chrome.tabs.create({url: urlVar, active: false}, dwp.navigateEval);

    // Setting up message handling
    chrome.runtime.onMessage.addListener(
      function(message, sender, sendResponse) {
        if(message.name != null) {
          // Request: Forward request to eval page and prompt a response
          chrome.tabs.sendMessage(evalTab.id, {name: message.name});
          setTimeout(function() {
            chrome.tabs.executeScript(evalTab.id, {file: 'injectEvalStage3.js'});
          }, 4000);
        } else if (message.response != null) {
          // Response: Foreward response to duckweb page
          chrome.tabs.sendMessage(duckwebTab.id, {response: message.response});
        } else {alert(message.toSource())};
    });
    
    //this was added by sarah
    chrome.tabs.executeScript({ file: "jquery.js" }, function() {
      chrome.tabs.executeScript({ file: "jquery-ui.js" }, function() {
        chrome.tabs.executeScript({ file: "injectRegistration.js" });
      });
    });
    chrome.tabs.insertCSS({ file: 'jquery-ui.css' }, function() {
      chrome.tabs.insertCSS({ file: 'tooltip.css' });
    });
    
    //window.close();
  }
};
