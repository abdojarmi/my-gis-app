<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تطبيق GIS - العطاوية</title>

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>

    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        #map-container { display: flex; height: 100vh; }
        #map { flex-grow: 1; height: 100%; }
        #sidebar {
            width: 250px; /* أو أي عرض مناسب */
            padding: 15px;
            background-color: #f4f4f4;
            border-left: 1px solid #ccc;
            box-sizing: border-box;
            overflow-y: auto;
        }
        #sidebar h2 { margin-top: 0; }
        #layerList { list-style: none; padding: 0; }
        #layerList li {
            padding: 8px 0;
            cursor: default; /* أو pointer إذا أضفت تفاعلية */
        }
        #exportBtn {
            display: block;
            width: 100%;
            padding: 10px;
            margin-top: 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 4px;
            text-align: center;
        }
        #exportBtn:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>

    <div id="map-container">
        <div id="sidebar">
            <h2>الطبقات</h2>
            <ul id="layerList">
                <!-- سيتم ملء الطبقات هنا بواسطة جافاسكريبت -->
            </ul>
            <button id="exportBtn">تصدير GeoJSON</button>
        </div>
        <div id="map"></div>
    </div>

    <!-- Leaflet JS (يجب أن يكون بعد عنصر الخريطة) -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>

    <!-- السكريبت الخاص بك -->
    <script>
        // ضع الكود الذي أرسلته هنا
        fetch('https://raw.githubusercontent.com/abdojarmi/my-gis-app/f8b1a32f86ee1ca8bce61003d9e6723adde2a74c/Attaouia_GeoData.geojson')
          .then(response => {
              if (!response.ok) {
                  throw new Error("لم يتم تحميل الملف بنجاح: " + response.status);
              }
              return response.json();
          })
          .then(data => {
              const map = L.map('map').setView([31.83, -7.32], 10); // تم تعديل الإحداثيات والزوم قليلاً لتناسب بيانات العطاوية بشكل أفضل
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(map);

              const geojsonLayer = L.geoJSON(data, {
                  style: feature => {
                      // يمكنك تخصيص النمط بناءً على خصائص المعلم
                      // مثال: إذا كان هناك حقل 'type' في خصائص المعلم
                      // if (feature.properties && feature.properties.type === 'boundary') {
                      //     return { color: 'red', weight: 3 };
                      // }
                      return { color: 'blue', weight: 2, fillColor: 'lightblue', fillOpacity: 0.3 }; // نمط افتراضي
                  },
                  onEachFeature: (feature, layer) => {
                      // إضافة نافذة منبثقة (popup) تظهر عند النقر على المعلم
                      if (feature.properties && feature.properties.name) { // افترض أن هناك خاصية 'name'
                          layer.bindPopup("<b>" + feature.properties.name + "</b><br>" + (feature.properties.description || ""));
                      } else if (feature.properties && Object.keys(feature.properties).length > 0) {
                          // إذا لم يكن هناك اسم، اعرض كل الخصائص
                          let popupContent = "<b>خصائص:</b><br/>";
                          for (const key in feature.properties) {
                              popupContent += `${key}: ${feature.properties[key]}<br/>`;
                          }
                          layer.bindPopup(popupContent);
                      }
                  }
              }).addTo(map);

              // توسيط الخريطة لتناسب حدود طبقة GeoJSON
              if (geojsonLayer.getBounds().isValid()) {
                  map.fitBounds(geojsonLayer.getBounds());
              }


              const layers = {
                  "حدود العطاوية": geojsonLayer
              };

              L.control.layers(null, layers, { collapsed: false }).addTo(map);

              // تحديث القائمة الجانبية للطبقات
              const layerList = document.getElementById('layerList');
              layerList.innerHTML = ''; // مسح القائمة القديمة أولاً (إذا وجدت)
              for (let layerName in layers) {
                  let listItem = document.createElement('li');
                  listItem.textContent = layerName;
                  layerList.appendChild(listItem);
              }

              // زر الإخراج
              document.getElementById('exportBtn').addEventListener('click', () => {
                  // تأكد من أن بيانات GeoJSON الأصلية هي التي يتم تصديرها
                  const geojsonStr = JSON.stringify(data);
                  const blob = new Blob([geojsonStr], { type: "application/json;charset=utf-8" }); // تحديد الترميز utf-8
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = "Attaouia_GeoData.geojson";
                  document.body.appendChild(a); // ضروري لـ Firefox
                  a.click();
                  document.body.removeChild(a); // تنظيف
                  URL.revokeObjectURL(a.href); // تحرير الذاكرة
              });
          })
          .catch(error => {
              console.error('خطأ في تحميل GeoJSON:', error);
              // عرض رسالة خطأ للمستخدم في الواجهة إذا لزم الأمر
              const mapDiv = document.getElementById('map');
              if (mapDiv) {
                  mapDiv.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">حدث خطأ أثناء تحميل البيانات: ${error.message}</p>`;
              }
          });
    </script>

</body>
</html>
