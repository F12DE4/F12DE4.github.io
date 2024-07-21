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

function showMap(latitude, longitude) {
    const platform = new H.service.Platform({
        apikey: apiKey,
        app_id: appId
    });
    const defaultLayers = platform.createDefaultLayers();
    const map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
        center: { lat: latitude, lng: longitude },
        zoom: 14,
        pixelRatio: window.devicePixelRatio || 1
    });
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const ui = H.ui.UI.createDefault(map, defaultLayers);
    const marker = new H.map.Marker({ lat: latitude, lng: longitude });
    map.addObject(marker);
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getPostcode(latitude, longitude);
    showMap(latitude, longitude);
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
        navigator.geolocation.getCurrentPosition(showPosition, showError, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
    } else {
        document.getElementById('status').innerText = 'Geolocation is not supported by this browser.';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (document.body.classList.contains('dark-mode')) {
        themeToggleBtn.innerText = 'Toggle Light Mode';
    } else {
        themeToggleBtn.innerText = 'Toggle Dark Mode';
    }
}

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

getLocation();
