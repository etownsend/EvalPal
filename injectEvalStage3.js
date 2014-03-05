var list = "blah";

function doStuff() {
  var results = document.getElementsByTagName("table");
  var resultsTest  = results[3].getElementsByTagName("tr");
  if (resultsTest.length > 0) {
    chrome.runtime.sendMessage({response: results[3].innerHTML})
  }
}


function getInstructorsList() {
	var res = [];
	var sel = document.getElementsByName("instructorSelect")[0];
	for (var i = 0; i< sel.length; i++) {
		res.push(sel.options[i].text);
	}
	return res;
}


var port = chrome.runtime.connect({name: "knockknock"});
port.postMessage({profs: getInstructorsList()});
port.onMessage.addListener(function(msg) {
});

// Setting up message passing
/*chrome.runtime.onMessage.addListener(
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
});*/

// Triggering stuff if page already has been loaded
if(document.readyState == "complete" || document.readyState == "loaded") {
  doStuff();
} else {
  // Triggering stuff for when the page loads
  document.addEventListener('DOMContentLoaded', doStuff);
}