// 1. Initialize map and set its view to Morocco
const map = L.map('map').setView([31.7917, -7.0926], 6);

// 2. Add base map layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Variables to hold the GeoJSON layer and the original data
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

// Helper function to get color based on funder name
function getColor(funder) {
    return funderColors[funder] || funderColors["Other/N/A"];
}

// Helper function to format property keys for display
function formatKey(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).trim();
}

// Function to create a GeoJSON layer with styling and popups
function createGeoJsonLayer(data) {
    return L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 7,
                fillColor: getColor(feature.properties.Funded_by_whom_),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.85
            });
        },
        onEachFeature: function(feature, layer) {
            const props = feature.properties;
            if (props) {
                let popupContent = '<table>';
                for (const key in props) {
                    const value = props[key];
                    let displayValue;

                    if (typeof value === 'string' && value.toLowerCase().startsWith('http')) {
                        displayValue = `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
                    } else {
                        displayValue = value || 'N/A';
                    }

                    popupContent += `<tr><td><strong>${formatKey(key)}:</strong></td><td>${displayValue}</td></tr>`;
                }
                popupContent += '</table>';
                
                // --- الجزء الذي تم تحديثه ---
                // أضفنا "minWidth" لمنع الجدول من أن يصبح ضيقًا جدًا
                layer.bindPopup(popupContent, { 
                    maxHeight: 300, 
                    minWidth: 320, // عرض أدنى للنافذة المنبثقة
                    className: 'custom-popup' // إضافة فئة مخصصة لتنسيق أفضل
                });
            }
        }
    });
}


// ... باقي الكود يبقى كما هو ...
// 4. Fetch GeoJSON data and add it to the map
fetch('CombinedDataIMAGINEPsycho2025.geojson')
    .then(response => response.json())
    .then(data => {
        originalData = data;
        geojsonLayer = createGeoJsonLayer(originalData).addTo(map);
        createFunderFilter(originalData);
    })
    .catch(error => console.error('Error loading GeoJSON file:', error));

// 5. Function to create the filter control
function createFunderFilter(data) {
    const filterContainer = document.getElementById('filter-container');
    const funders = ['All Funders', ...new Set(data.features.map(f => f.properties.Funded_by_whom_).filter(f => f))];

    const label = document.createElement('label');
    label.htmlFor = 'funder-filter';
    label.innerText = 'Filter by Funder:';

    const select = document.createElement('select');
    select.id = 'funder-filter';
    select.onchange = updateMap;

    funders.forEach(funder => {
        const option = document.createElement('option');
        option.value = funder;
        option.innerText = funder;
        select.appendChild(option);
    });

    filterContainer.appendChild(label);
    filterContainer.appendChild(select);
}

// 6. Function to update the map based on the filter selection
function updateMap() {
    const selectedFunder = document.getElementById('funder-filter').value;
    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
    }
    let filteredData;
    if (selectedFunder === 'All Funders') {
        filteredData = originalData;
    } else {
        filteredData = {
            ...originalData,
            features: originalData.features.filter(f => f.properties.Funded_by_whom_ === selectedFunder)
        };
    }
    geojsonLayer = createGeoJsonLayer(filteredData).addTo(map);
}

// 7. Create the map legend
const legend = L.control({ position: 'topright' });
legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend leaflet-control');
    const funders = Object.keys(funderColors).filter(f => f !== 'Other/N/A');
    
    div.innerHTML += '<h4>Funded By</h4>';

    for (let i = 0; i < funders.length; i++) {
        div.innerHTML += `<i style="background:${getColor(funders[i])}"></i> ${funders[i]}<br>`;
    }
    div.innerHTML += `<i style="background:${getColor('Other/N/A')}"></i> Other/N/A<br>`;

    return div;
};
legend.addTo(map);
