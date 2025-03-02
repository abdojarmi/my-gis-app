fetch('https://raw.githubusercontent.com/abdojarmi/my-gis-app/main/Attaouia_GeoData.geojson')
  .then(response => {
      if (!response.ok) {
          throw new Error("لم يتم تحميل الملف بنجاح: " + response.status);
      }
      return response.json();
  })
  .then(data => {
      L.geoJSON(data).addTo(map);
  })
  .catch(error => console.error('خطأ في تحميل GeoJSON:', error));
