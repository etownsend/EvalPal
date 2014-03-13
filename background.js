// Injects javascript into the tab and then closes the popup
var dwp = {
  evalTab:{},
  duckwebTab:{},

  setupRegistration: function() {
    console.log("setting up registration");
    chrome.tabs.executeScript({ file: "jquery.js" }, function() {
      chrome.tabs.executeScript({ file: "jquery-ui.js" }, function() {
        chrome.tabs.executeScript({ file: "injectRegistration.js" });
      });
    });
    chrome.tabs.insertCSS({ file: 'jquery-ui.css' }, function() {
      chrome.tabs.insertCSS({ file: 'tooltip.css' });
    });
  },

  setupEval: function(tab) {
    evalTab = tab;
    evalProgress = 1;
    chrome.tabs.onUpdated.addListener(function(id, changeInfo, tab) {
      // Handling Eval Tab Updates
      console.log("status: "+ changeInfo.status);
      if (id == evalTab.id && changeInfo.status === "complete") {
        console.log("EvalProgress " + evalProgress)
        if (evalProgress == 1) {
          chrome.tabs.executeScript(tab.id, {file: 'injectEvalStage1.js'});
          console.log("First Stage");
        }
        if (evalProgress == 2) {
          chrome.tabs.executeScript(tab.id, {file: 'injectEvalStage2.js'});
          console.log("Second Stage");
        }
        if (evalProgress == 3) {
          chrome.tabs.executeScript(tab.id, {file: 'injectEvalStage3.js'});
          dwp.setupRegistration();
          console.log("Third Stage");
        }
        if (evalProgress >= 4) {
          chrome.tabs.executeScript(tab.id, {file: 'injectEvalStage3.js'});
          console.log("Eval page Updated");
        }
        evalProgress ++;
      }
      // Clean up extension if Duckweb Page changes
      else if(id == duckwebTab.id) {
        console.log("Registration page Updated");
        //Close Eval Tab
        chrome.tabs.remove(evalTab.id);
        // Reload Extension
        chrome.runtime.reload();
      }
    });
  },


  // Does
  initializePages: function () {
    // Remembering info for current active tab
    chrome.tabs.query({currentWindow: true, active: true}, function(tabsArray) {
      // Guaranteed to be only 1 active tab
      duckwebTab = tabsArray[0];
    });

    // Open the eval tab
    var urlVar = "https://duckweb.uoregon.edu/pls/prod/hwskwbis.P_CourseEvaluations";
    chrome.tabs.create({url: urlVar, active: false}, dwp.setupEval);

    // Setting up message handling
    chrome.runtime.onMessage.addListener(
      function(message, sender, sendResponse) {
        if(message.name != null) {
          // Request: Forward request to eval page and prompt a response
          chrome.tabs.sendMessage(evalTab.id, {name: message.name});
        } else if (message.response != null) {
          // Response: Foreward response to duckweb page
          chrome.tabs.sendMessage(duckwebTab.id, {response: message.response});
        } else {alert(message.toSource())};
    });
  }
};
