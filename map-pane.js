// Show the loading spinner
const loadingSpinner = document.getElementById('loading-spinner');
loadingSpinner.style.display = 'block';

// Create an image element
const image = new Image();

// Set an event listener for when the image is loaded
image.onload = function() {
  // Hide the loading spinner
  loadingSpinner.style.display = 'none';

  image.width = 1070;

  // Append the loaded image to the div
  const mapDiv = document.getElementById('map');
  mapDiv.appendChild(image);
  // Add info box to show Last-Modified header
  showLastModified();
};

// Set the image source to your URL
image.src = 'https://np-screenshot.s3.us-west-2.amazonaws.com/screenshot.png';

function showLastModified() {
  // Fetch the image to get the Last-Modified header
  fetch(image.src, { method: 'HEAD', mode: 'cors', cache: 'no-store'})
    .then(response => {
      const lastModified = response.headers.get('Last-Modified');
      console.log(`Map last modified: ${lastModified}`);
    
      if (lastModified) {
        const localLastModified = convertToLocaleTimeString(lastModified);
        // Create an info box element
        const infoBox = document.createElement('div');
        infoBox.className = 'info-box';
        infoBox.innerHTML = `Last updated: ${localLastModified}`;

        // Append the info box to the body or any other container
        const mapDiv = document.getElementById('map');
        mapDiv.appendChild(infoBox);
      }
    })
    .catch(error => console.error('Error fetching Last-Modified header:', error));
}

function convertToLocaleTimeString(utcTimeString) {
  const utcDate = new Date(utcTimeString);
  
  // Convert to local time (GMT-8)
  const localTimeOffset = -8 * 60; // GMT-8 in minutes
  const localDate = new Date(utcDate.getTime() + localTimeOffset * 60 * 1000);

  // Format the local date as a string
  const options = { timeZone: "America/Los_Angeles", month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };  const localTimeString = utcDate.toLocaleString('en-US', options);
  return localTimeString;
}