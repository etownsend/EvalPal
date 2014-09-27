/*
 * Eval Pal - inject.js
 * CIS 422 Winter 2014
 * Written by: Sarah Yablok & Evan Townsend
 * This is the content script that gets injected into the applyweb frame.
 * It determines the current state and navigates to the proper request form.
 * It then returns any information and sends back a hook for further
 * communication. When another message is received, it does a best effort
 * match to available records, and loads the page with those records where
 * the process is started all over again.
 */

// Sets up the messaging between is page and the background page
function setupMessaging() {
	var port = chrome.runtime.connect({name: "eval"});
	port.onMessage.addListener(recvMessage);
	port.postMessage(getResults());
}

// Dispatches a 'change' event on the given element to cause a page update
function fireEvent(element) {
	var evt = document.createEvent("HTMLEvents");
	evt.initEvent("change", false, true);
	element.dispatchEvent(evt);
}

// Navigates the page based on any message from the background page
function recvMessage(message) {
	console.log("eval recv: ", message);
	// Setting Instructor
	if(message.name != null) {
		var instructorSelect = document.getElementsByName("instructorSelect")[0];
		instructorSelect.value = getInstructorId(instructorSelect, message.name);
		fireEvent(instructorSelect);
	}

	// Setting Subject
	if(message.subject != null) {
		var subjectSelect = document.getElementsByName("subjectSelect")[0];
		subjectSelect.value = message.subject;
		fireEvent(subjectSelect);
	}

	// Setting Course Number
	if(message.number != null) {
		var numberSelect = document.getElementsByName("numberSelect")[0];
		numberSelect.value = message.number;
		fireEvent(numberSelect);
	}

	// Scraping a sample for generating percentiles
	// Advances the instructor selector by 50 until there are no more instructors
	// Advance by 50 so we get >100 samples out of 6400 instructors
	if(message.scrape != null) {
		var instructorSelect = document.getElementsByName("instructorSelect")[0];
		instructorSelect.selectedIndex += 50;
		fireEvent(instructorSelect);
	}
}

// Returns any results if present
function getResults() {
	var subjectSelect = document.getElementsByName("subjectSelect")[0];
	var numberSelect = document.getElementsByName("numberSelect")[0];
	if( (subjectSelect.value != "select subject") &&
		(numberSelect.value == "select course #")) {
		// Acknowledge Half completed course request
		return {response: "ack"};
	} else {
		// Send back results
		var results = document.getElementsByTagName("table");
		var resultsTestProf  = results[3].getElementsByTagName("tr");
		var resultsTestClass = results[2].getElementsByTagName("tr");
		
		if (resultsTestProf.length > 0) {
			// Rating for professor
			return {response: getAverages(resultsTestProf, true)};
		} else if (resultsTestClass.length > 0) {
			// rating for class
			return {response: getAverages(resultsTestClass, false)};
		} else {
			return {response: "No Data Available"};
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

/*
*  Navigation - We navigate the pages manually because we land on stage1 automatically,
*  and we need to grab a dynamic url from stage2.
*  TODO: We dont want to do anything unless the EvalPal page action is active.
*/
function navigate() {
	if(document.title == "Online Course Evaluations Instructor Home") {
		console.log("Stage3");
		setupMessaging();
	} else if (document.getElementById("contentFrame") != null) {
		console.log("Stage2");
		window.location.replace(document.getElementById("contentFrame").src);
	} else {
		console.log("Stage1", document.title);
		window.location.replace("https://www.applyweb.com/eval/new/coursesearch");
	}
};

// Triggering navigation if page already has been loaded
if(document.readyState == "complete" || document.readyState == "loaded") {
	navigate();
} else {
	// Triggering redirect for when the page loads
	document.addEventListener('DOMContentLoaded', navigate);
}