// initialize the map
var map = L.map('map').setView([32.4, -6.8], 10); // Set view to Attaouia's approximate coordinates

// load a tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Load GeoJSON data
fetch('https://raw.githubusercontent.com/abdojarmi/my-gis-app/main/Attaouia_GeoData.geojson')
    .then(response => response.json())
    .then(data => {
        // Add GeoJSON layer to the map
        L.geoJSON(data).addTo(map);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));
