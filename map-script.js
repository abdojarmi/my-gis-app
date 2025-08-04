// 1. تهيئة الخريطة وتحديد مركزها على المغرب
const map = L.map('map').setView([31.7917, -7.0926], 6);

// 2. إضافة طبقة الخريطة الأساسية (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// متغيرات للاحتفاظ بطبقة البيانات والبيانات الأصلية
let geojsonLayer;
let originalData;

// 3. تحديد ألوان لكل جهة ممولة
const funderColors = {
    "NED": "#e41a1c", "HAF": "#377eb8", "L'oreal": "#4daf4a", "Credit agricole": "#984ea3",
    "FRE SKIN CARE": "#ff7f00", "MEPI": "#ffff33", "UNDP": "#a65628", "PUR Project (Carbon)": "#f781bf",
    "F2F": "#999999", "University of Virginia": "#66c2a5", "US Embassy AEIF project": "#fc8d62",
    "Personal funding": "#8da0cb", "German Watch/F2F": "#e78ac3", "Dakira": "#a6d854",
    "European Union": "#ffd92f", "Princeton": "#e5c494", "Project HOPE": "#b3b3b3",
    "YCC": "#fb8072", "SAMS": "#80b1d3", "George Fischer Foundation": "#fdb462",
    "Muslim AID": "#bc80bd", "Taalim Delegation &JDC": "#ccebc5", "Other/N/A": "#808080"
};

// دالة مساعدة للحصول على اللون بناءً على اسم الممول
function getColor(funder) {
    return funderColors[funder] || funderColors["Other/N/A"];
}

// دالة لإنشاء طبقة GeoJSON مع التنسيق والنوافذ المنبثقة
function createGeoJsonLayer(data) {
    return L.geoJSON(data, {
        // أ. تنسيق كل نقطة (تلوينها)
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
        // ب. إضافة نافذة منبثقة لكل نقطة
        onEachFeature: function(feature, layer) {
            const props = feature.properties;
            if (props) {
                // تعديل: بناء محتوى النافذة بشكل ديناميكي لعرض كل البيانات
                let popupContent = '<table>';
                for (const key in props) {
                    const formattedKey = key.replace(/_/g, ' '); // تحسين شكل المفاتيح
                    popupContent += `<tr><td><strong>${formattedKey}:</strong></td><td>${props[key] || 'N/A'}</td></tr>`;
                }
                popupContent += '</table>';
                layer.bindPopup(popupContent, { maxHeight: 300 }); // تحديد أقصى ارتفاع للنافذة
            }
        }
    });
}

// 4. جلب بيانات GeoJSON وإضافتها إلى الخريطة
fetch('CombinedDataIMAGINEPsycho2025.geojson')
    .then(response => response.json())
    .then(data => {
        originalData = data; // تخزين البيانات الأصلية كاملة
        
        // عرض جميع النقاط في البداية
        geojsonLayer = createGeoJsonLayer(originalData).addTo(map);

        // جديد: إنشاء قائمة الفرز بناءً على الممولين
        createFunderFilter(originalData);
    })
    .catch(error => console.error('خطأ في تحميل ملف GeoJSON:', error));

// 5. جديد: دالة لإنشاء قائمة الفرز (الفلتر)
function createFunderFilter(data) {
    const filterContainer = document.getElementById('filter-container');
    // استخراج أسماء الممولين الفريدة من البيانات وإضافة خيار "جميع الممولين"
    const funders = ['جميع الممولين', ...new Set(data.features.map(f => f.properties.Funded_by_whom_).filter(f => f))];

    const label = document.createElement('label');
    label.htmlFor = 'funder-filter';
    label.innerText = 'الفرز حسب الممول:';

    const select = document.createElement('select');
    select.id = 'funder-filter';
    // عند تغيير القيمة، يتم تحديث الخريطة
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

// 6. جديد: دالة لتحديث الخريطة بناءً على اختيار الفلتر
function updateMap() {
    const selectedFunder = document.getElementById('funder-filter').value;

    // إزالة الطبقة القديمة من الخريطة
    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
    }

    let filteredData;
    if (selectedFunder === 'جميع الممولين') {
        filteredData = originalData;
    } else {
        // فرز البيانات لعرض الممول المختار فقط
        filteredData = {
            ...originalData,
            features: originalData.features.filter(f => f.properties.Funded_by_whom_ === selectedFunder)
        };
    }

    // إنشاء طبقة جديدة بالبيانات المفرزة وإضافتها إلى الخريطة
    geojsonLayer = createGeoJsonLayer(filteredData).addTo(map);
}

// 7. إنشاء مفتاح الخريطة
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend');
    const funders = Object.keys(funderColors).filter(f => f !== 'Other/N/A');
    
    div.innerHTML += '<h4>الجهات الممولة</h4>';

    for (let i = 0; i < funders.length; i++) {
        div.innerHTML += `<i style="background:${getColor(funders[i])}"></i> ${funders[i]}<br>`;
    }
    div.innerHTML += `<i style="background:${getColor('Other/N/A')}"></i> أخرى/غير محدد<br>`;

    return div;
};
legend.addTo(map);
