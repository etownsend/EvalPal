// This file contains the code that gets injected into the 
// body of the duckweb class registration page

// Edit contents of main table on duckweb class lookup page

// Keeps track of the most recently opened tooltip so it can
// be edited
var messageOut = false;
var toolTipQueue = [];
var messageQueue = [];

// Hash table of the University's various departments and their
// Abbreviations
var dept = {};
dept['AA'] = "Allied Arts";
dept['AAA'] = "Architecture & Allied Arts";
dept['AAAP'] = "Historic Preservation";
dept['AAD'] = "Arts & Administration";
dept['ACTG'] = "Accounting";
dept['AEIS'] = "Acad Eng for Intl Stu";
dept['AFR'] = "African Studies";
dept['AIM'] = "Applied Information Management";
dept['ANTH'] = "Anthropology";
dept['ARB'] = "Arabic";
dept['ARCH'] = "Architecture";
dept['ARH'] = "Art History";
dept['ART'] = "Art";
dept['ARTC'] = "Ceramics";
dept['ARTD'] = "Digital Arts";
dept['ARTF'] = "Fibers";
dept['ARTM'] = "Metalsmithing & Jewelry";
dept['ARTO'] = "Photography";
dept['ARTP'] = "Painting";
dept['ARTR'] = "Printmaking";
dept['ARTS'] = "Sculpture";
dept['ASIA'] = "Asian Studies";
dept['ASL'] = "American Sign Language";
dept['ASTR'] = "Astronomy";
dept['BA'] = "Business Administration";
dept['BE'] = "Business Environment";
dept['BI'] = "Biology";
dept['CARC'] = "Career Center";
dept['CAS'] = "College of Arts & Sciences";
dept['CDS'] = "Communication Disorders & Sci";
dept['CFT'] = "Couples & Family Therapy";
dept['CH'] = "Chemistry";
dept['CHN'] = "Chinese";
dept['CHNF'] = "Chinese Flagship";
dept['CINE'] = "Cinema Studies";
dept['CIS'] = "Computer & Information Science";
dept['CIT'] = "Computer Information Tech";
dept['CLAS'] = "Classics";
dept['COLT'] = "Comparative Literature";
dept['CPSY'] = "Counseling Psychology";
dept['CRES'] = "Conflict & Dispute Resolution";
dept['CRWR'] = "Creative Writing";
dept['CSCH'] = "College Scholars";
dept['DAN'] = "Dance Professional";
dept['DANC'] = "Dance Activity";
dept['DANE'] = "Danish";
dept['DIST'] = "Distance Education";
dept['DSC'] = "Decision Sciences";
dept['EALL'] = "East Asian Lang & Literature";
dept['EC'] = "Economics";
dept['EDLD'] = "Educational Leadership";
dept['EDST'] = "Education Studies";
dept['EDUC'] = "Education";
dept['ENG'] = "English";
dept['ENVS'] = "Environmental Studies";
dept['ES'] = "Ethnic Studies";
dept['ESC'] = "Community Internship Program";
dept['EURO'] = "European Studies";
dept['FHS'] = "Family & Human Services";
dept['FIN'] = "Finance";
dept['FINN'] = "Finnish";
dept['FLR'] = "Folklore";
dept['FR'] = "French";
dept['FSEM'] = "Freshman Seminar";
dept['GEOG'] = "Geography";
dept['GEOL'] = "Geology";
dept['GER'] = "German";
dept['GRK'] = "Greek";
dept['GSS'] = "General Social Science";
dept['HBRW'] = "Hebrew";
dept['HC'] = "Honors College";
dept['HIST'] = "History";
dept['HPHY'] = "Human Physiology";
dept['HUM'] = "Humanities";
dept['IARC'] = "Interior Architecture";
dept['INTL'] = "International Studies";
dept['IST'] = "Interdisciplinary Studies";
dept['ITAL'] = "Italian";
dept['J'] = "Journalism";
dept['JDST'] = "Judaic Studies";
dept['JGS'] = "Japanese Global Scholars";
dept['JPN'] = "Japanese";
dept['KRN'] = "Korean";
dept['LA'] = "Landscape Architecture";
dept['LAS'] = "Latin American Studies";
dept['LAT'] = "Latin";
dept['LAW'] = "Law";
dept['LEAD'] = "Leadership Development";
dept['LERC'] = "Labor Educ & Research Center";
dept['LIB'] = "Library";
dept['LING'] = "Linguistics";
dept['LT'] = "Language Teaching";
dept['MATH'] = "Mathematics";
dept['MDVL'] = "Medieval Studies";
dept['MGMT'] = "Management";
dept['MIL'] = "Military Science";
dept['MKTG'] = "Marketing";
dept['MUE'] = "Music Education";
dept['MUJ'] = "Music Jazz Studies";
dept['MUP'] = "Music Performance";
dept['MUS'] = "Music";
dept['NAS'] = "Native American Studies";
dept['NORW'] = "Norwegian";
dept['OIMB'] = "Oregon Inst of Marine Biology";
dept['OLIS'] = "Oregon Ldrship Sustainability";
dept['PD'] = "Product Design";
dept['PDX'] = "UO Portland Programs";
dept['PEAE'] = "PE Aerobics";
dept['PEAQ'] = "PE Aquatics";
dept['PEAS'] = "PE SCUBA";
dept['PEC'] = "PE Certification";
dept['PEF'] = "PE Fitness";
dept['PEI'] = "PE Individual Activities";
dept['PEIA'] = "PE Intercollegiate Athletics";
dept['PEL'] = "PE Leadership";
dept['PEMA'] = "PE Martial Arts";
dept['PEMB'] = "PE Mind-Body";
dept['PEO'] = "PE Outdoor Pursuits";
dept['PEOL'] = "PE Outdoor Pursuits - Land";
dept['PEOW'] = "PE Outdoor Pursuits - Water";
dept['PERS'] = "PE Racquet Sports";
dept['PERU'] = "PE Running";
dept['PETS'] = "PE Team Sports";
dept['PEW'] = "PE Weight Training";
dept['PHIL'] = "Philosophy";
dept['PHYS'] = "Physics";
dept['PORT'] = "Portuguese";
dept['PPPM'] = "Planning Public Policy Mgmt";
dept['PS'] = "Political Science";
dept['PSY'] = "Psychology";
dept['REES'] = "Russ, E Euro & Eurasia Studies";
dept['REL'] = "Religious Studies";
dept['RL'] = "Romance Languages";
dept['RUSS'] = "Russian";
dept['SAPP'] = "Substance Abuse Prev Prog";
dept['SBUS'] = "Sports Business";
dept['SCAN'] = "Scandinavian";
dept['SCYP'] = "Sustainable City Year Program";
dept['SERV'] = "Service Learning";
dept['SOC'] = "Sociology";
dept['SPAN'] = "Spanish";
dept['SPED'] = "Special Education";
dept['SPSY'] = "School Psychology";
dept['SWAH'] = "Swahili";
dept['SWED'] = "Swedish";
dept['TA'] = "Theater Arts";
dept['TLC'] = "Univ Teaching & Learning Ctr";
dept['WGS'] = "Women's & Gender Studies";
dept['WR'] = "Writing";


// Recieves Messages, manages message queues, and prompts page updates.
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		messageOut = false;
		console.log(message);
		// Distinguish ack from response
		if(message.response == "ack") {
			// Do nothing
			console.log("got ack");
		} else {
			// Update Tooltip with contents from message
			var lastToolTipId = toolTipQueue.shift();
			$("#" + lastToolTipId).tooltip('close');
			var x = "<a href='javascript:void(0);' id ='x " + lastToolTipId + "' class='x'></a>";
			var attr = $("#" + lastToolTipId).attr('title');
			if (typeof attr == 'undefined' || attr == false)
				$("#" + lastToolTipId).tooltip({content: x + formatAverages(message.response)});
			else 
				$("#" + lastToolTipId).tooltip({content: x + formatAveragesCourses(message.response, $("#" + lastToolTipId).attr("title"))});
			$("#" + lastToolTipId).tooltip('open');
			
		$('.ui-tooltip a.x').css("background", "url(" + chrome.extension.getURL('images/x.jpg') + ") no-repeat top center");
		$(".ui-tooltip a.x").hover(function(){
   			$(this).css("background-position","bottom center");
    	},function(){
    		$(this).css("background", "url(" + chrome.extension.getURL('images/x.jpg') + ") no-repeat top center");
  		});
  		
  		
		}
		// Send next queued message
		if(messageQueue.length > 0) {
			messageOut = true;
			console.log("Sending Queued Message");
			chrome.runtime.sendMessage(messageQueue.shift());
		}
});


function formatAverages(av) {
	if (av == "No results found")
		return "No results found";
	var str = "<h3>Instructor Evaluations For " + av[av.length-1] + "</h3><br /><table>";
	str += "<tr><td class='right'><b>Quality of Courses Taught by this Professor:</b></td>";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[0]/5.0)) + "%;'></span></span>" + av[0] + " out of 5</td></tr>";
	str += "<tr><td class='right'><b>Quality of Teaching:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[1]/5.0)) + "%;'></span></span>" + av[1] + " out of 5</td></tr>";

	str += "<tr><td class='right'><b>Professor's Organization:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[2]/5.0)) + "%;'></span></span>" + av[2] + " out of 5</td></tr>";


	str += "<tr><td class='right'><b>Use of Class Time:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[3]/5.0)) + "%;'></span></span>" + av[3] + " out of 5</td></tr>";

	str += "<tr><td class='right'><b>Availability Outside of Class:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[4]/5.0)) + "%;'></span></span>" + av[4] + " out of 5</td></tr>";

	str += "<tr><td class='right'><b>Clarity of Evaluation Guidelines:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[5]/5.0)) + "%;'></span></span>" + av[5] + " out of 5</td></tr>";

	str += "<tr><td style='border-bottom:none;' class='right'><b>Amount Learned in Courses Taught by this Professor:</b> ";
	str += "<td style='border-bottom:none;'><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[6]/5.0)) + "%;'></span></span>" + av[6] + " out of 5</td></tr>";

	return str;
}


function formatAveragesCourses(av, n) {
	if (av == "No results found")
		return "No results found";
	var str = "<h3>Course Evaluations For " + n + "</h3><br /><table>";
	str += "<tr><td class='right'><b>Quality of this course:</b></td>";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[0]/5.0)) + "%;'></span></span>" + av[0] + " out of 5</td></tr>";
	str += "<tr><td class='right'><b>Quality of Teaching:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[1]/5.0)) + "%;'></span></span>" + av[1] + " out of 5</td></tr>";

	str += "<tr><td class='right'><b>Course Oragnization:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[2]/5.0)) + "%;'></span></span>" + av[2] + " out of 5</td></tr>";


	str += "<tr><td class='right'><b>Clarity of Evaluation Guidelines:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[5]/5.0)) + "%;'></span></span>" + av[5] + " out of 5</td></tr>";

	str += "<tr><td style='border-bottom:none;' class='right'><b>Amount Learned in this course:</b> ";
	str += "<td style='border-bottom:none;'><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[6]/5.0)) + "%;'></span></span>" + av[6] + " out of 5</td></tr>";

	return str;
}


function getProfLink(name, idx) {
	var res = name.split("(");
	var prof = res[0].trim();
	if (prof == "TBA" || prof == "STAFF" || prof == "")
		return name;
	return "<a class='eval' id='" + idx + "' href='javascript:void(0)'>" + name + "</a>";
}

// Smoothly uses the messaging system to send a message to the eval page
function sendMessage(message) {
	// If the messaging system is busy
	if (messageOut) {
		// Cache message to be sent later
		messageQueue.push(message)
	} else {
		// Otherwise send message
		messageOut = true;
		chrome.runtime.sendMessage(message);
	}
}

$(document).ready(function() {
//console.log(chrome.extension.getURL('images/x.jpg'));
	var table = document.getElementsByTagName("tbody"); 
	var rows = table[5].getElementsByTagName("tr"); 
	var count;
	var idx = 0;
	var course, number, prof;

	for (var i = 3; i < rows.length; i++) {
		count = 0;
		var cells = rows[i].getElementsByTagName("td");
		
		for(var j = 0; j<cells.length; j++) {
			count += cells[j].colSpan;
			
			if (count == 3) {
				course = cells[j].innerHTML;
			} else if (count == 4) {
				number = cells[j].innerHTML;
				if (cells[j].innerText.trim() != "")
					cells[j].innerHTML = "<a class='eval' title='" + course + " " + number + "' id='" + idx + "' href='javascript:void(0)'>" + number + "</a>";
				idx++;
			} else if (count == 11) {
				prof = cells[j].innerText; 
				cells[j].innerHTML = getProfLink(prof, idx);
				idx++;
			}
		}
	}

	// Creates tooltip. Prompts actions for items on page when clicked
	$('a.eval').css({"background-color": "#f4f199"});
		
	// Create tooltip
	$(document).on('click', '.eval', function () {
		// Detecting if is class number or professor name

		// Note: slicing string removes things like ' (P)' from the end of the name
		var msg = $(this).context.innerText;
		if(isNaN(msg)){
			// Message is a Professor's Name
			var profMsg = {request: true, name: msg.slice(0,-4)};
			sendMessage(profMsg);
		}	else {
			// Message is a class number

			var classMsg1 = {request: true, subject: dept[$(this).attr("title").split(" ")[0]]};
			var classMsg2 = {request: true, number: msg};
			sendMessage(classMsg1);
			sendMessage(classMsg2);
		}

		// Constructing tooltip
		$(this).addClass("on");
		$(this).tooltip({
			items: '.eval.on',
			content: function() {
				var x = "<a href='javascript:void(0);' id ='x " + $(this).attr("id") + "' class='x'></a>";
				return x + '<img src="' + chrome.extension.getURL('images/loading2.gif') + '" alt="loading..." />';
			},
			position: {
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
		
		$(this).tooltip('open');
		$('.ui-tooltip a.x').css("background", "url(" + chrome.extension.getURL('images/x.jpg') + ") no-repeat top center");
		$(".ui-tooltip a.x").hover(function(){
   			$(this).css("background-position","bottom center");
    	},function(){
    		$(this).css("background", "url(" + chrome.extension.getURL('images/x.jpg') + ") no-repeat top center");
  		});
		
		// Add tooltip to queue so it can be edited when message returns
		toolTipQueue.push($(this).attr("id"));
	});
	
	

	$(document).on('click', '.ui-tooltip', function () {
		console.log($(this).attr("id"));
		$('.ui-tooltip').each(function () {
			$('#' + $(this).attr("id")).css("z-index", "0");
		});
		//$('#' + $(this).attr("id")).css("position", "relative");
		$('#' + $(this).attr("id")).css("z-index", "1");
	}); 

	// Hide tooltip
	$(document).on('click', '.x', function () {
		res = $(this).attr("id").split(" ");
		var id = res[1];
		$("#" + id).tooltip("close");
		$("#" + id).removeClass("on");
	}); 
		
	//prevent mouseout and other related events from firing their handlers
	$(".eval").on('mouseout', function (e) {
		e.stopImmediatePropagation();
	});
	$(".eval").on('mouseenter', function (e) {
		e.stopImmediatePropagation();
	});
});
