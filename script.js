// إنشاء الخريطة وتحديد المركز ونسبة التكبير
var map = L.map('map').setView([31.83, -7.36], 12);

// إضافة طبقة OpenStreetMap إلى الخريطة
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// جلب بيانات GeoJSON من GitHub
fetch('https://raw.githubusercontent.com/abdojarmi/my-gis-app/main/Attaouia_GeoData.geojson')
    .then(response => {
        console.log("استجابة الطلب:", response);
        if (!response.ok) {
            throw new Error("فشل تحميل الملف: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("بيانات GeoJSON:", data);
        
        // إضافة البيانات إلى الخريطة مع تنسيق الطبقة
        var geojsonLayer = L.geoJSON(data, {
            style: {
                color: "#3388ff", 
                weight: 2,
                opacity: 0.8
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    layer.bindPopup("<b>اسم المنطقة:</b> " + feature.properties.name);
                }
            }
        }).addTo(map);

        // ضبط العرض لاحتواء جميع المعالم
        map.fitBounds(geojsonLayer.getBounds());
    })
    .catch(error => console.error('خطأ في تحميل GeoJSON:', error));
