fetch('https://raw.githubusercontent.com/abdojarmi/my-gis-app/f8b1a32f86ee1ca8bce61003d9e6723adde2a74c/Attaouia_GeoData.geojson')
  .then(response => {
      if (!response.ok) {
          throw new Error("لم يتم تحميل الملف بنجاح: " + response.status);
      }
      return response.json();
  })
  .then(data => {
      const map = L.map('map').setView([31.83, -7.32], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const geojsonLayer = L.geoJSON(data, {
          style: feature => {
              return { color: 'blue', weight: 2, fillColor: 'lightblue', fillOpacity: 0.3 };
          },
          onEachFeature: (feature, layer) => {
              if (feature.properties && feature.properties.name) {
                  layer.bindPopup("<b>" + feature.properties.name + "</b><br>" + (feature.properties.description || ""));
              } else if (feature.properties && Object.keys(feature.properties).length > 0) {
                  let popupContent = "<b>خصائص:</b><br/>";
                  for (const key in feature.properties) {
                      popupContent += `${key}: ${feature.properties[key]}<br/>`;
                  }
                  layer.bindPopup(popupContent);
              }
          }
      }).addTo(map);

      if (geojsonLayer.getBounds().isValid()) {
          map.fitBounds(geojsonLayer.getBounds());
      }

      const layers = {
          "حدود العطاوية": geojsonLayer
      };

      L.control.layers(null, layers, { collapsed: false }).addTo(map);

      const layerList = document.getElementById('layerList');
      layerList.innerHTML = '';
      for (let layerName in layers) {
          let listItem = document.createElement('li');
          listItem.textContent = layerName;
          layerList.appendChild(listItem);
      }

      document.getElementById('exportBtn').addEventListener('click', () => {
          const geojsonStr = JSON.stringify(data);
          const blob = new Blob([geojsonStr], { type: "application/json;charset=utf-8" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "Attaouia_GeoData.geojson";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(a.href);
      });
  })
  .catch(error => {
      console.error('خطأ في تحميل GeoJSON:', error);
      const mapDiv = document.getElementById('map');
      if (mapDiv) {
          mapDiv.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">حدث خطأ أثناء تحميل البيانات: ${error.message}</p>`;
      }
  });
