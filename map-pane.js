// Show the loading spinner
const loadingSpinner = document.getElementById('loading-spinner');
loadingSpinner.style.display = 'block';

// Create an image element
const image = new Image();

// Set an event listener for when the image is loaded
image.onload = function() {
  console.log('image loaded');
  // Hide the loading spinner
  loadingSpinner.style.display = 'none';

  image.width = 1070;

  // Append the loaded image to the div
  const mapDiv = document.getElementById('map');
  mapDiv.appendChild(image);
};

// Set the image source to your URL
image.src = 'https://np-screenshot.s3.us-west-2.amazonaws.com/screenshot.png';
