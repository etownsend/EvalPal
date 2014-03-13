function redirect() {
	var theFrame = document.getElementById("contentFrame");
	window.location.replace(theFrame.src);
};


// Triggering redirect if page already has been loaded
if(document.readyState == "complete" || document.readyState == "loaded") {
	redirect();
} else {
	// Triggering redirect for when the page loads
	document.addEventListener('DOMContentLoaded', redirect);
}