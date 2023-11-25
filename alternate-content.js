var contentElements = document.getElementsByClassName("content");
var currentIndex = 0;
setInterval(function() {
  var currentElement = contentElements[currentIndex];
  currentElement.classList.add("hidden");
  currentIndex = (currentIndex + 1) % contentElements.length;
  var nextElement = contentElements[currentIndex];
  nextElement.classList.remove("hidden");
}, 20000); // time to hold each view

function timedRefresh(timeoutPeriod) {
    setTimeout("location.reload(true);",timeoutPeriod);
}

window.onload = function() {
  timedRefresh(30000); // reload after 20 sec for testing
  // timedRefresh(600000); // reload page every 10 minutes
};

function timedRefresh(timeout) {
  setTimeout(function() {
      location.reload(true);
  }, timeout);
}
