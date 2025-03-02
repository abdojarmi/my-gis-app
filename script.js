// إنشاء الخريطة وضبط الإحداثيات الأولية
var map = L.map('map').setView([31.83, -7.36], 12);

// إضافة طبقة OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// جلب بيانات GeoJSON من GitHub
fetch('https://raw.githubusercontent.com/abdojarmi/my-gis-app/main/Attaouia_GeoData.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error("فشل تحميل الملف: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("بيانات GeoJSON:", data);

        // التأكد من أن البيانات تم تحميلها بشكل صحيح
        if (!data || typeof data !== "object" || !data.features) {
            throw new Error("بيانات GeoJSON غير صحيحة!");
        }

        // إضافة الطبقة للخريطة
        var geojsonLayer = L.geoJSON(data, {
            style: function (feature) {
                return { color: "#3388ff", weight: 2, opacity: 0.8 };
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    layer.bindPopup("<b>المنطقة:</b> " + (feature.properties.name || "غير معروف"));
                }
            }
        }).addTo(map);

        // ضبط الخريطة لاحتواء جميع المعالم
        map.fitBounds(geojsonLayer.getBounds());
    })
    .catch(error => console.error('خطأ في تحميل GeoJSON:', error));
