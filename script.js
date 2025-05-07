fetch('https://github.com/abdojarmi/my-gis-app/blob/main/Attaouia_GeoData.geojson')
  .then(response => {
      if (!response.ok) {
          throw new Error("لم يتم تحميل الملف بنجاح: " + response.status);
      }
      return response.json();
  })
  .then(data => {
      const map = L.map('map').setView([31.8, -8.3], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      
      const geojsonLayer = L.geoJSON(data, {
          style: { color: 'blue', weight: 2 }
      }).addTo(map);
      
      const layers = {
          "حدود العطاوية": geojsonLayer
      };
      
      L.control.layers(null, layers, { collapsed: false }).addTo(map);
      
      // تحديث القائمة الجانبية للطبقات
      const layerList = document.getElementById('layerList');
      for (let layerName in layers) {
          let listItem = document.createElement('li');
          listItem.textContent = layerName;
          layerList.appendChild(listItem);
      }
      
      // زر الإخراج
      document.getElementById('exportBtn').addEventListener('click', () => {
          const geojsonStr = JSON.stringify(data);
          const blob = new Blob([geojsonStr], { type: "application/json" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "Attaouia_GeoData.geojson";
          a.click();
      });
  })
  .catch(error => console.error('خطأ في تحميل GeoJSON:', error));
