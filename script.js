const apiKey = 'J8ztErbgdHmIoZOkw9EKZhhY1l37bG6stZELCGV1A6k';
const appId = 'FRHCUCkNYsMeITA3dc5b';
let map;
let marker;

function getPostcode(latitude, longitude) {
    const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&lang=en-US&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const postcode = data.items[0].address.postalCode;
            document.getElementById('postcode').innerText = `Your postcode is: ${postcode}`;
        })
        .catch(error => {
            document.getElementById('status').innerText = 'Unable to retrieve postcode.';
            console.error('Error:', error);
        });
}

function initializeMap() {
    const platform = new H.service.Platform({
        apikey: apiKey,
        app_id: appId
    });
    const defaultLayers = platform.createDefaultLayers();
    map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
        zoom: 14,
        pixelRatio: window.devicePixelRatio || 1
    });
    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    H.ui.UI.createDefault(map, defaultLayers);
}

function updateMap(latitude, longitude) {
    if (!map) {
        initializeMap();
    }

    if (marker) {
        marker.setPosition({ lat: latitude, lng: longitude });
    } else {
        marker = new H.map.Marker({ lat: latitude, lng: longitude });
        map.addObject(marker);
    }

    map.setCenter({ lat: latitude, lng: longitude });
}

function handleLocationUpdate(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    getPostcode(latitude, longitude);
    updateMap(latitude, longitude);
}

function handleLocationError(error) {
    switch (error.code) {
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

function startLocationTracking() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(handleLocationUpdate, handleLocationError, {
            enableHighAccuracy: true,
            timeout: 5000,   // 5 seconds timeout
            maximumAge: 1000 // Cache location for 1 second
        });
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

startLocationTracking();
