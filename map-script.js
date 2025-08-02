// 1. تهيئة الخريطة وتحديد مركزها على المغرب
const map = L.map('map').setView([31.7917, -7.0926], 6);

// 2. إضافة طبقة الخريطة الأساسية (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 3. تحديد ألوان لكل جهة ممولة
const funderColors = {
    "NED": "#e41a1c",
    "HAF": "#377eb8",
    "L'oreal": "#4daf4a",
    "Credit agricole": "#984ea3",
    "FRE SKIN CARE": "#ff7f00",
    "MEPI": "#ffff33",
    "UNDP": "#a65628",
    "PUR Project (Carbon)": "#f781bf",
    "F2F": "#999999",
    "University of Virginia": "#66c2a5",
    "US Embassy AEIF project": "#fc8d62",
    "Personal funding": "#8da0cb",
    "German Watch/F2F": "#e78ac3",
    "Dakira": "#a6d854",
    "European Union": "#ffd92f",
    "Princeton": "#e5c494",
    "Project HOPE": "#b3b3b3",
    "YCC": "#fb8072",
    "SAMS": "#80b1d3",
    "George Fischer Foundation": "#fdb462",
    "Muslim AID": "#bc80bd",
    "Taalim Delegation &JDC": "#ccebc5",
    "Default": "#808080" // لون افتراضي لأي جهة غير مدرجة
};

// دالة مساعدة للحصول على اللون بناءً على اسم الممول
function getColor(funder) {
    return funderColors[funder] || funderColors["Default"];
}

// 4. جلب بيانات GeoJSON وإضافتها إلى الخريطة
fetch('CombinedDataIMAGINEPsycho2025.geojson') // تأكد من أن اسم الملف صحيح
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
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
                    // بناء محتوى النافذة المنبثقة بالمعلومات المهمة
                    let popupContent = `
                        <strong>Name:</strong> ${props.Name || 'N/A'}<br>
                        <strong>Funded By:</strong> ${props.Funded_by_whom_ || 'N/A'}<br>
                        <strong>Region:</strong> ${props.Region || 'N/A'}<br>
                        <strong>Province:</strong> ${props.Province || 'N/A'}<br>
                        <strong>Host Type:</strong> ${props.Host_Type_Cooperative_Associations__Group_of_women_Students || 'N/A'}<br>
                        <strong>Personal Impact:</strong> ${props.Personal_Impact || 'No details provided'}
                    `;
                    layer.bindPopup(popupContent);
                }
            }
        }).addTo(map);
    })
    .catch(error => console.error('خطأ في تحميل ملف GeoJSON:', error));


// 5. إنشاء مفتاح الخريطة
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend');
    const funders = Object.keys(funderColors);
    
    div.innerHTML += '<h4>Funded By</h4>'; // عنوان المفتاح بالإنجليزية

    // حلقة لتوليد سطر لكل ممول مع مربع لوني
    for (let i = 0; i < funders.length; i++) {
        if (funders[i] !== "Default") {
             div.innerHTML +=
            '<i style="background:' + funderColors[funders[i]] + '"></i> ' +
            funders[i] + '<br>';
        }
    }
    // إضافة الفئة الافتراضية في النهاية
    div.innerHTML += '<i style="background:' + funderColors["Default"] + '"></i> Other/N/A<br>';

    return div;
};

legend.addTo(map);
