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
            chrome.tabs.sendMessage(tab.id, {name: "154874"})

            //tabPort = chrome.tabs.connect(tab.id);
            //tabPort.onMessage.addListener( function(msg) {alert(msg.hello);});
          }, 3000);
        }, 3000);   // end 3rd timeout
      }, 3000);   // end 2nd timeout
    }, 3000);   // End 1st timeout
  },

  initializePages: function () {
    chrome.runtime.onMessage.addListener(
      function(message, sender, sendResponse) {
        alert(message);
    });
    //chrome.tabs.executeScript({file: 'injectRegistration.js'});
    var urlVar = "https://duckweb.uoregon.edu/pls/prod/hwskwbis.P_CourseEvaluations";
    chrome.tabs.create({url: urlVar, active: false}, dwp.navigateEval);
    //window.close();
  }
};

// Registers event listeners to buttons on page load
document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById("lookupButton");
  button.addEventListener('click', dwp.initializePages, false);
}, false);