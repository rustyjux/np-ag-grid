var contentElements = document.getElementsByClassName("content");
var currentIndex = 0;
setInterval(function() {
  var currentElement = contentElements[currentIndex];
  currentElement.classList.add("hidden");
  currentIndex = (currentIndex + 1) % contentElements.length;
  var nextElement = contentElements[currentIndex];
  nextElement.classList.remove("hidden");
}, 5000); // time to hold each view - 6000=6 seconds - change to 30000 for 30 seconds

function timedRefresh(timeoutPeriod) {
    setTimeout("location.reload(true);",timeoutPeriod);
}

window.onload = timedRefresh(900000); /* reload page every 15 minutes */