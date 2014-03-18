/*
 * Eval Pal - injectEvalStage3.js
 * CIS 422 Winter 2014
 * Written by: Sarah Yablok & Evan Townsend
 * This file contains the code that gets injected into the applyweb
 * course evaluations page. It receives messages from injectRegistration,
 * and looks up the content accordingly, formats it, and delivers it back via
 * message passing.
 */


// Checks for results data. If present, returns it to the extension.
function returnResults() {
	// Acknowledge Half completed course request
	var subjectSelect = document.getElementsByName("subjectSelect")[0];
	var numberSelect = document.getElementsByName("numberSelect")[0];
	if(
			(subjectSelect.value != "select subject") &&
			(numberSelect.value == "select course #")) {
		chrome.runtime.sendMessage({request: false, response: "ack"})
	} else {
		// Return results from Query
		var results = document.getElementsByTagName("table");
		var resultsTestProf  = results[3].getElementsByTagName("tr");
		var resultsTestClass = results[2].getElementsByTagName("tr");
		if (resultsTestProf.length > 0) {
			chrome.runtime.sendMessage({request: false, response: getAverages(resultsTestProf, true)})
		} else if (resultsTestClass.length > 0) {
			chrome.runtime.sendMessage({request: false, response: getAverages(resultsTestClass, false)})
		} else {
			chrome.runtime.sendMessage({request: false, response: "No results found"})
		}
	}
};


/* This function collects the data from the table on applyweb.
 It formats this data by averaging each column, and placing the results
 in an array which houses seven float average values and the name of the
 course or instructor based off the results of the fuzzy search. */
function getAverages(rows, prof) {
	var table = document.getElementsByTagName("table");	
	var av = new Array(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, ""); // Important output of this function
	var count;
	
	// Loop through rows
	for (var i = 1; i < rows.length-8; i++) {
		count = 0;
		var cells = rows[i].getElementsByTagName("td");	
		
		// Loop through cells
		for(var j = 0; j<cells.length; j++) {
			count += cells[j].colSpan;
			// Addition of all the column data - professors
			if(prof) {
				if (count == 5) {
					av[0] += parseFloat(cells[j].innerHTML); // Q1
				} else if (count == 6) {
					av[1] += parseFloat(cells[j].innerHTML); // Q2
				} else if (count == 7) {
					av[2] += parseFloat(cells[j].innerHTML); // Q3
				} else if (count == 8) {
					av[3] += parseFloat(cells[j].innerHTML); // Q4
				} else if (count == 9) {
					av[4] += parseFloat(cells[j].innerHTML); // Q5
				} else if (count == 10) {
					av[5] += parseFloat(cells[j].innerHTML); // Q6
				} else if (count == 11) {
					av[6] += parseFloat(cells[j].innerHTML); // Q7
				}
			// Addition of all the column data - courses
			} else {
				if (count == 4) {
					av[0] += parseFloat(cells[j].innerHTML); // Q1
				} else if (count == 5) {
					av[1] += parseFloat(cells[j].innerHTML); // Q2
				} else if (count == 6) {
					av[2] += parseFloat(cells[j].innerHTML); // Q3
				} else if (count == 7) {
					av[3] += parseFloat(cells[j].innerHTML); // Q4
				} else if (count == 8) {
					av[4] += parseFloat(cells[j].innerHTML); // Q5
				} else if (count == 9) {
					av[5] += parseFloat(cells[j].innerHTML); // Q6
				} else if (count == 10) {
					av[6] += parseFloat(cells[j].innerHTML); // Q7
				}
			}
		}
		count++;
	}
	// Divide by the total number of entries.
	for (var i = 0; i < av.length; i++) {
		av[i] /= parseFloat(rows.length - 9);
		av[i] = av[i].toFixed(2);
	}
	// Set the name of the professor or course #
	if(prof) {
		var instructorSelect = document.getElementsByName("instructorSelect")[0];
		av[7] = instructorSelect.options[instructorSelect.selectedIndex].text;
	} else {
		var numberSelect = document.getElementsByName("numberSelect")[0];
		av[7] = numberSelect.options[numberSelect.selectedIndex].text;
	}
	return av;
}

/* Generates an integer which indicates a subjective degree of matching
 between two strings. Optimized for matching names with tokens
 truncated or out of order or both. */
function getMatchValue(first, second) {
	var splitFirst = first.split(/[ ,]+/);
	var splitSecond = second.split(/[ ,]+/);
	var totalMatch = 0;
	// Compare each token to each of the others. For each token, add
	// the value of its highest match to totalMatch
	for (var i = 0; i < splitFirst.length; i ++) {
		var maxTokenMatch = 0;
		for (var j = 0; j < splitSecond.length; j ++) {
			var tokenMatch = 0;
			for (var k = 0; k < Math.min(splitFirst[i].length, splitSecond[j].length); k ++) {
				if (splitFirst[i].charAt(k) == splitSecond[j].charAt(k)) {
					tokenMatch ++;
				} else {
					tokenMatch = 0;
					break;
				};
			}
			if(tokenMatch > maxTokenMatch) {maxTokenMatch = tokenMatch};
		}
		totalMatch = totalMatch + maxTokenMatch;
	}
	return totalMatch;
}

// Uses a fuzzy search to match instructor with its id.
function getInstructorId(instructorSelect, name) {
	var maxMatchVal = 0;
	var maxItem = 0;
	// For each professor in the select table
	for (var i = 1; i < instructorSelect.length; i++) {
		// Calculate the extent of the match
		var matchVal = getMatchValue(instructorSelect[i].text, name);
		// Record the greatest match value
		if (matchVal > maxMatchVal) {
			maxItem = i;
			maxMatchVal = matchVal;
		}
	}
	return instructorSelect[maxItem].value;
};

// Setting up message passing
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {

		// Setting Instructor
		if(message.name != null) {
			var instructorSelect = document.getElementsByName("instructorSelect")[0];
			instructorSelect.value = getInstructorId(instructorSelect, message.name);
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent("change", false, true);
			instructorSelect.dispatchEvent(evt);
		}

		// Setting Subject
		if(message.subject != null) {
			var subjectSelect = document.getElementsByName("subjectSelect")[0];
			subjectSelect.value = message.subject;
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent("change", false, true);
			subjectSelect.dispatchEvent(evt);
		}

		// Setting Course Number
		if(message.number != null) {
			var numberSelect = document.getElementsByName("numberSelect")[0];
			numberSelect.value = message.number;
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent("change", false, true);
			numberSelect.dispatchEvent(evt);
		}
});

// Triggering stuff if page already has been loaded
if(document.readyState == "complete" || document.readyState == "loaded") {
	returnResults();
} else {
	// Triggering stuff for when the page loads
	document.addEventListener('DOMContentLoaded', returnResults);
}