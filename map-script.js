// 1. Initialize map and set its view to Morocco
const map = L.map('map').setView([31.7917, -7.0926], 6);

// 2. Add base map layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Global variables
let geojsonLayer;
let originalData;

// 3. Define colors for each funder
const funderColors = {
    "NED": "#e41a1c", "HAF": "#377eb8", "L'oreal": "#4daf4a", "Credit agricole": "#984ea3",
    "FRE SKIN CARE": "#ff7f00", "MEPI": "#ffff33", "UNDP": "#a65628", "PUR Project (Carbon)": "#f781bf",
    "F2F": "#999999", "University of Virginia": "#66c2a5", "US Embassy AEIF project": "#fc8d62",
    "Personal funding": "#8da0cb", "German Watch/F2F": "#e78ac3", "Dakira": "#a6d854",
    "European Union": "#ffd92f", "Princeton": "#e5c494", "Project HOPE": "#b3b3b3",
    "YCC": "#fb8072", "SAMS": "#80b1d3", "George Fischer Foundation": "#fdb462",
    "Muslim AID": "#bc80bd", "Taalim Delegation &JDC": "#ccebc5", "Other/N/A": "#808080"
};

// Helper functions
function getColor(funder) { return funderColors[funder] || funderColors["Other/N/A"]; }
function formatKey(key) { return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).trim(); }

// Function to create and style GeoJSON points and popups
function createGeoJsonLayer(data) {
    // === SAFETY FILTER ADDED ===
    // This removes features with no geometry to prevent errors
    const validData = {
        ...data,
        features: data.features.filter(feature => feature.geometry && feature.geometry.coordinates && feature.geometry.coordinates.length > 0)
    };

    return L.geoJSON(validData, {
        pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
            radius: 7, 
            // === CHANGE #1 ===
            // Corrected field name access for coloring
            fillColor: getColor(feature.properties["Funded by whom?"]), 
            color: "#000",
            weight: 1, opacity: 1, fillOpacity: 0.85
        }),
        onEachFeature: (feature, layer) => {
            const props = feature.properties;
            let popupContent = '<table>';
            for (const key in props) {
                const value = props[key];
                let displayValue = (typeof value === 'string' && (value.toLowerCase().startsWith('http') || value.toLowerCase().startsWith('https:')))
                    ? `<a href="${value}" target="_blank" rel="noopener noreferrer">Open Link</a>`
                    : (value || 'N/A');
                popupContent += `<tr><td><strong>${formatKey(key)}:</strong></td><td>${displayValue}</td></tr>`;
            }
            popupContent += '</table>';
            layer.bindPopup(popupContent, { maxHeight: 300, minWidth: 320, className: 'custom-popup' });
        }
    });
}

// Function to update the map based on filter selection
function updateMap(selectElement) {
    const selectedFunder = selectElement.value;
    if (geojsonLayer) { map.removeLayer(geojsonLayer); }
    const filteredData = (selectedFunder === 'All Funders')
        ? originalData
        : { ...originalData, features: originalData.features.filter(f => 
            // === CHANGE #2 ===
            // Corrected field name access for filtering
            f.properties["Funded by whom?"] === selectedFunder
        ) };
    geojsonLayer = createGeoJsonLayer(filteredData).addTo(map);
}

// =======================================================
// === CREATE AND ADD ALL CONTROLS (Logo, Legend, Filter) ===
// =======================================================

// 1. Create Filter Control
const FilterControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-control-filter');
        // === CHANGE #3 ===
        // Corrected field name access for creating the filter list
        const funders = ['All Funders', ...new Set(originalData.features.map(f => f.properties["Funded by whom?"]).filter(f => f))];
        
        container.innerHTML = `
            <label for="funder-filter">Filter by Funder:</label>
            <select id="funder-filter">
                ${funders.map(f => `<option value="${f}">${f}</option>`).join('')}
            </select>
        `;
        
        L.DomEvent.disableClickPropagation(container);
        container.querySelector('select').onchange = (e) => updateMap(e.target);
        
        return container;
    }
});

// 2. Create Logo Control
const LogoControl = L.Control.extend({
    options: { position: 'topright' },
    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-control-logo');
        container.innerHTML = `<a href="https://highatlasfoundation.org/" target="_blank" rel="noopener noreferrer"><img src="haf-logo.png.png" alt="High Atlas Foundation Logo"></a>`;
        return container;
    }
});

// 3. Create Legend Control
const LegendControl = L.Control.extend({
    options: { position: 'topright' },
    onAdd: function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        const funders = Object.keys(funderColors).filter(f => f !== 'Other/N/A');
        let content = '<h4>Funded By</h4>';
        for (let i = 0; i < funders.length; i++) {
            content += `<i style="background:${getColor(funders[i])}"></i> ${funders[i]}<br>`;
        }
        content += `<i style="background:${getColor('Other/N/A')}"></i> Other/N/A<br>`;
        div.innerHTML = content;
        return div;
    }
});


// Main data fetching and map initialization
fetch('CombinedDataIMAGINEPsycho2025.geojson')
    .then(response => {
        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
        return response.json();
    })
    .then(data => {
        originalData = data;
        geojsonLayer = createGeoJsonLayer(originalData).addTo(map);
        
        // Add all controls to the map *after* data is loaded
        map.addControl(new FilterControl());
        map.addControl(new LogoControl());
        map.addControl(new LegendControl());
    })
    .catch(error => console.error('Error loading or processing GeoJSON file:', error));
