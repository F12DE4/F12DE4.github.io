const apiKey = 'J8ztErbgdHmIoZOkw9EKZhhY1l37bG6stZELCGV1A6k';
const appId = 'FRHCUCkNYsMeITA3dc5b';

function getPostcode(latitude, longitude) {
    const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&lang=en-US&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const postcode = data.items[0].address.postalCode;
            document.getElementById('postcode').innerText = `Your postcode is: ${postcode}`;
            document.getElementById('status').innerText = '';
        })
        .catch(error => {
            document.getElementById('status').innerText = 'Unable to retrieve postcode.';
            console.error('Error:', error);
        });
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getPostcode(latitude, longitude);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('status').innerText = 'User denied the request for Geolocation.';
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('status').innerText = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            document.getElementById('status').innerText = 'The request to get user location timed out.';
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('status').innerText = 'An unknown error occurred.';
            break;
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('status').innerText = 'Geolocation is not supported by this browser.';
    }
}

getLocation();
