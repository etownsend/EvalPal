function redirect() {
  window.location.replace("https://www.applyweb.com/eval/new/coursesearch");
};


// Triggering redirect if page already has been loaded
if(document.readyState == "complete" || document.readyState == "loaded") {
  redirect();
} else {
  // Triggering redirect for when the page loads
  document.addEventListener('DOMContentLoaded', redirect);
}