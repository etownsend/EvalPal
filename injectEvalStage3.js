function doStuff() {
  var extensionId = "baciglmlekelhaffmcdhfdkhfpkddagm";
  var results = document.getElementsByTagName("table");
  if (results[3] != null) {
    chrome.runtime.sendMessage(extensionId, {response: results[3].innerHTML})
  }
}

// Setting up message passing
chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    // Setting Instructor
    var instructorSelect = document.getElementsByName("instructorSelect")[0];
    instructorSelect.value = message.name;
    if ("createEvent" in document) {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      instructorSelect.dispatchEvent(evt);
    }
    else instructorSelect.fireEvent("onchange");
});

// Triggering stuff if page already has been loaded
if(document.readyState == "complete" || document.readyState == "loaded") {
  doStuff();
} else {
  // Triggering stuff for when the page loads
  document.addEventListener('DOMContentLoaded', doStuff);
}