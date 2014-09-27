/*
 * Eval Pal - injectRegistration.js
 * CIS 422 Winter 2014
 * Written by: Sarah Yablok & Evan Townsend
 * This file contains the code that gets injected into the body of 
 * the DuckWeb page. Including tooltips the associated highlight links
 * It also sends messages to injectEvalStage3.js to share information.
 */

// Keeps track of the most recently opened tooltip so it can be closed later
var toolTipQueue = [];

// Keep track of the state of the messaging system
var messageQueue = [];
var firstMessage = true;
var messageOut = false;

// Flag to gather a sample of the data in order to generate benchmarks for
// ranking instructors and courses by percentiles.
// true - generates a report
// false - normal operation
var scraping = false;
var scrapeData = [[],[],[],[],[],[],[]];
numAttempts = 0;
numSamples = 0;

/* Returns the x-button html for the tooltip id provided. */
function xButton (id) {
	return "<a href='javascript:void(0);' id ='x " + id + "' class='x'></a>";
}


/* Set the background image of the x-button */
function xButtonBG () {
	$('.ui-tooltip a.x').css("background", "url(" + chrome.extension.getURL('images/x.jpg') + ") no-repeat top center");
	$(".ui-tooltip a.x").hover(function(){
		$(this).css("background-position","bottom center");
    	},function(){
    		$(this).css("background", "url(" + chrome.extension.getURL('images/x.jpg') + ") no-repeat top center");
  		});
}

/* This function formats the data into HTML for the tooltips */
function formatAverages(av) {
	console.log("format avs");
	if (av == "No Data Available") // Error handling for no professor found
		return "No Data Available";
	
	// Title
	var str = "<h3>Course Evaluations For " + av[av.length-1] + "</h3><br /><table>";
	// Evaluates Each question
	for(var i = 0; i < 7; i ++) {
		// Correlates  each score with benchmarks for ranking each instructor on a scale from 1-10
		var realScore = 1;
		for(var j = 0; j <= 8 && av[i] >= questionBenchmarks[i][j]; j ++) {
			realScore = j + 2; // j's range is 0-8. Need 2-10
		}
		
		// Generating html for the UI
		str += "<tr><td class='right'><b>" + questions[i] + ":</b></td><td><span class='gray-bar'>" + 
				"<span class='rating' style='width:" + realScore*10 + "%;'></span>" +
				"</span>" + realScore + " out of 10</td></tr>";
	}
	return str;
}

/* Get the appropriate highlighted link HTML for professors */
function getProfLink(name, idx) {
	var res = name.split("("); // Split at "(" in case of (P) at the end.
	var prof = res[0].trim();
	if (prof == "TBA" || prof == "STAFF" || prof == "")
		return name;
	return "<a class='eval' id='" + idx + "' href='javascript:void(0)'>" + name + "</a>";
}

/* Smoothly uses the messaging system to send a message to the eval page */
function sendMessage(message) {
	// If the messaging system is busy
	if (messageOut || firstMessage) {
		// Cache message to be sent later
		messageQueue.push(message)
	} else {
		// Otherwise send message
		messageOut = true;
		port.postMessage(message);
	}
}

// Generates a report for ranking professors and courses by percentiles
function generateReport() {
	for(var i = 0; i < 7; i ++) {
		// Sorts the results for each of the questions in ascending order
		scrapeData[i] = scrapeData[i].sort(function(a,b){return a-b});
		// Outputs to console benchmark values for the 10%,20%,...,90% percentiles
		console.log("Percentile Benchmarks for Question, ", i+1);
		for(var j = 1; j <=9; j ++) {
			var step = scrapeData[i].length / 10;
			console.log("     ", scrapeData[i][step * j]);
		}
	}
}

/* Recieves Messages, manages message queues, and prompts page updates when the
user clicks any of the highlighted links. */
var port = chrome.runtime.connect({name: "reg"});
port.onMessage.addListener( function(message, sender, sendResponse) {
	messageOut = false;

	if(firstMessage) {
		// Discard first message. Signifies setup went ok.
		firstMessage = false;
		console.log("Setup conplete:");
	} else if(message.response == "ack") {
		// Ack: Do nothing
	} else if(scraping) {
		if(message.response == "No Data Available") {
			numAttempts += 1;
			if(numAttempts >= 5) {
				// End of the list
				generateReport();
			} else {
				// Hickup. Keep trying and hope it doesn't happen again.
				sendMessage({scrape: scraping});
			}
		} else {
			// Append data to scrapeData and initiate another round
			numSamples += 1;
			numAttempts = 0;
			console.log("Scrape: Got sample #", numSamples);
			for(var i = 0; i < 7; i ++) {
				scrapeData[i].push(message.response[i]);
			}
			if(numSamples >= 100) {
				generateReport();
			} else {
				sendMessage({scrape: scraping});
			}
		}
	} else {
		// Response: Update Tooltip with contents from message
		var lastToolTipId = toolTipQueue.shift();
		$("#" + lastToolTipId).tooltip('close'); //close and reopen the tooltip to update content

		var attr = $("#" + lastToolTipId).attr('title');
		if (typeof attr == 'undefined' || attr == false)
			$("#" + lastToolTipId).tooltip({content: xButton(lastToolTipId) + formatAverages(message.response)});
		else 
			$("#" + lastToolTipId).tooltip({content: xButton(lastToolTipId) + formatAverages(message.response)});
			
		$("#" + lastToolTipId).tooltip('open'); //reopen tooltip
		xButtonBG();
	}
	// Send next queued message
	if(messageQueue.length > 0) {
		messageOut = true;
		port.postMessage(messageQueue.shift());
	}
});

/* This is the main function which sets up all of the tooltips and injects
 all of the highlighted links on the document's load. This also sets up event
 handling for clicks on links, the x-button, and rearranging tabs.*/
$(document).ready(function() {
	// Sort through the duckweb table to get the right columns to highlight
	var table = document.getElementsByTagName("tbody"); 
	var rows = table[5].getElementsByTagName("tr"); 
	var count;
	var idx = 0;
	var course, number, prof;

	// Loop through rows
	for (var i = 3; i < rows.length; i++) {
		count = 0;
		var cells = rows[i].getElementsByTagName("td");
		// Loop through columns
		for(var j = 0; j<cells.length; j++) {
			count += cells[j].colSpan;
			if (count == 3) {
				course = cells[j].innerHTML;
			// Highlight the course #
			} else if (count == 4) {
				number = cells[j].innerHTML;
				if (cells[j].innerText.trim() != "")
					cells[j].innerHTML = "<a class='eval' title='" + course + " " + number + "' id='" + idx + "' href='javascript:void(0)'>" + number + "</a>";
				idx++;
			// Highlight the Professor Name
			} else if (count == 11) {
				prof = cells[j].innerText; 
				cells[j].innerHTML = getProfLink(prof, idx);
				idx++;
			}
		}
	}

	// Set the background color to yellow on all Eval Pal links
	$('a.eval').css({"background-color": "#f4f199"});
		
	// Create the tooltip upon clicking
	$(document).on('click', '.eval', function () {
		// Detecting if is class number or professor name
		// Note: slicing string removes things like ' (P)' from the end of the name
		var msg = $(this).context.innerText;
		if(isNaN(msg)){
			// Message is a Professor's Name
			var profMsg = {name: msg.slice(0,-4)};
			sendMessage(profMsg);
		}	else {
			// Message is a class number

			var classMsg1 = {subject: dept[$(this).attr("title").split(" ")[0]]};
			var classMsg2 = {number: msg};
			sendMessage(classMsg1);
			sendMessage(classMsg2);
		}

		// Constructing tooltip
		$(this).addClass("on");
		$(this).tooltip({
			items: '.eval.on',
			content: function() {
				// Set the content to default to the loading image.
				return xButton($(this).attr("id")) + '<img src="' + chrome.extension.getURL('images/loading2.gif') + '" alt="loading..." />';
			},
			position: {
				// Set the positioning of the tooltip relative to the link
				my: "center bottom-20",
				at: "center top",
				using: function( position, feedback ) {
				$( this ).css( position );
				$( "<div>" )
					.addClass( "arrow" )
					.addClass( feedback.vertical )
					.addClass( feedback.horizontal )
					.appendTo( this );
				}
			}
		});

		$(this).tooltip('open'); // Open the tooltip!
		
		xButtonBG(); // Update the tooltip image
		
		// Add tooltip to queue so it can be edited when message returns
		toolTipQueue.push($(this).attr("id"));
	});

	// This sets the tooltip which is clicked on to be brought to the front
	// via the z-index css property
	$(document).on('click', '.ui-tooltip', function () {
		$('.ui-tooltip').each(function () {
			$('#' + $(this).attr("id")).css("z-index", "0");
		});
		//$('#' + $(this).attr("id")).css("position", "relative");
		$('#' + $(this).attr("id")).css("z-index", "1");
	}); 

	// Hide tooltip when the x-button is clicked.
	$(document).on('click', '.x', function () {
		res = $(this).attr("id").split(" ");
		var id = res[1];
		$("#" + id).tooltip("close");
		$("#" + id).removeClass("on");
	}); 
		
	// Prevent mouseout and other related events from firing their handlers.
	$(".eval").on('mouseout', function (e) {
		e.stopImmediatePropagation();
	});
	$(".eval").on('mouseenter', function (e) {
		e.stopImmediatePropagation();
	});
});

// Sends initial message to start scraping.
if(scraping) {
	sendMessage({scrape: scraping});
}