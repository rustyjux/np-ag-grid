const loadingSpinner = document.getElementById('loading-spinner');
loadingSpinner.style.display = 'block';

const imageUrl = 'https://np-screenshot.s3.us-west-2.amazonaws.com/screenshot.png';

// Fetch the image to get both the image and the Last-Modified header
fetch(imageUrl, { method: 'GET', mode: 'cors', cache: 'no-store' })
  .then(response => {
    const lastModified = response.headers.get('Last-Modified');

    if (lastModified) {
      const localLastModified = convertToLocaleTimeString(lastModified);
      // Create an info box element
      const infoBox = document.createElement('div');
      infoBox.className = 'last-modified info-box';
      infoBox.innerHTML = `Last updated: ${localLastModified}`;
      const mapDiv = document.getElementById('map');
      mapDiv.appendChild(infoBox);
    }

    // Convert the response to a blob
    return response.blob();
  })
  .then(blob => {
    // Create an object URL for the blob
    const imageUrlObjectURL = URL.createObjectURL(blob);
    const image = document.createElement('img');
    image.onload = function () {
      loadingSpinner.style.display = 'none';
      image.width = 1070;
      // Append the loaded image to the div
      const mapDiv = document.getElementById('map');
      mapDiv.classList.add("hidden");
      mapDiv.appendChild(image);
      URL.revokeObjectURL(imageUrlObjectURL);
    };
    image.src = imageUrlObjectURL;
  })
  .catch(error => console.error('Error fetching image and Last-Modified header:', error));

function convertToLocaleTimeString(utcTimeString) {
  const utcDate = new Date(utcTimeString);

  // Convert to local time (GMT-8)
  const localTimeOffset = -8 * 60; // GMT-8 in minutes
  const localDate = new Date(utcDate.getTime() + localTimeOffset * 60 * 1000);

  // Format the local date as a string
  const options = { timeZone: "America/Los_Angeles", month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  const localTimeString = localDate.toLocaleString('en-US', options);
  return localTimeString;
}
