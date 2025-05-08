// ====================================================================================
// GIS SCRIPT FOR ATTAOUIA - MODULAR SYMBOLS & STYLING
// ====================================================================================

// 1. تهيئة الخريطة
var map = L.map('map').setView([31.785, -7.285], 13); // مركز تقريبي للعطاوية

// 2. إضافة طبقة أساس (TileLayer)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// --- بداية مكتبة الرموز والأنماط ---

// 1.1. مكتبة الرموز (SVG definitions)
const symbolLibrary = {
    'pin': {
        type: 'svg',
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        viewBox: '0 0 24 24',
        defaultColor: '#FF0000',
        defaultSize: 24
    },
    'circle': {
        type: 'svg',
        path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', // دائرة بسيطة
        viewBox: '0 0 24 24',
        defaultColor: '#007bff',
        defaultSize: 16
    },
    'square': {
        type: 'svg',
        path: 'M3 3h18v18H3z', // مربع بسيط
        viewBox: '0 0 24 24',
        defaultColor: '#28a745',
        defaultSize: 16
    },
    'building': {
        type: 'svg',
        path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
        viewBox: '0 0 24 24',
        defaultColor: '#6c757d',
        defaultSize: 20
    },
    'plusSign': {
        type: 'svg',
        path: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
        viewBox: '0 0 24 24',
        defaultColor: '#DC143C',
        defaultSize: 22
    },
    'waterDrop': {
        type: 'svg',
        path: 'M12 0c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z', // مسار مبسط لقطرة
        viewBox: '0 0 24 24',
        defaultColor: '#00BFFF',
        defaultSize: 20
    },
    'mosqueDome': { // مسار SVG لقبة مبسطة. ابحث عن مسار أفضل إذا لزم الأمر
        type: 'svg',
        path: 'M12 2C8.69 2 6 4.69 6 8c0 1.81.72 3.44 1.88 4.62L12 22l4.12-9.38C17.28 11.44 18 9.81 18 8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z',
        viewBox: '0 0 24 24',
        defaultColor: '#B8860B',
        defaultSize: 26
    },
    'lightningBolt': { // رمز صاعقة لمحولات الكهرباء
        type: 'svg',
        path: 'M7 2v11h3v9l7-12h-4l4-8z',
        viewBox: '0 0 24 24',
        defaultColor: '#FFFF00', // أصفر
        defaultSize: 18
    }
    // أضف المزيد من الرموز هنا (تأكد من صحة مسارات SVG و viewBox)
};

// 1.2. دالة مساعدة لإنشاء أيقونة SVG كـ L.DivIcon
function createSvgDivIcon(symbolKey, customOptions = {}) {
    const symbol = symbolLibrary[symbolKey];
    if (!symbol || symbol.type !== 'svg') {
        console.warn(`Symbol with key '${symbolKey}' not found or not an SVG type. Using default Leaflet marker.`);
        return L.marker([0,0]).options.icon; // Fallback to default Leaflet icon
    }

    const color = customOptions.color || symbol.defaultColor;
    const size = customOptions.size || symbol.defaultSize;
    const path = customOptions.path || symbol.path; // Allow overriding path
    const viewBox = customOptions.viewBox || symbol.viewBox; // Allow overriding viewBox

    const svgHtml = `
        <svg width="${size}" height="${size}" viewBox="${viewBox}" fill="${color}" xmlns="http://www.w3.org/2000/svg">
            <path d="${path}"/>
        </svg>
    `;

    return L.divIcon({
        html: svgHtml,
        className: 'custom-svg-div-icon',
        iconSize: [size, size],
        iconAnchor: customOptions.anchor || [size / 2, size] // Anchor bottom-center by default
    });
}

// 1.3. تعيينات الأنماط للطبقات والأنواع الفرعية
// *** هذا الجزء يحتاج إلى تخصيص دقيق ليناسب بياناتك ورموزك المطلوبة ***
const featureTypeStyles = {
    "الصحة والمجال الاجتماعي": {
        "مستشفى": { symbol: 'plusSign', color: '#DC143C', size: 28 },
        "صيدلية": { symbol: 'pin', color: '#28a745', size: 22 }, // لون أخضر
        "_default": { symbol: 'pin', color: '#FF69B4' } // وردي
    },
    "توزيع الماء والكهرباء": {
        "محطة معالجة المياه": { symbol: 'waterDrop', color: '#4682B4', size: 24 },
        "خزان مياه": { symbol: 'waterDrop', color: '#1E90FF', size: 20 },
        "مكتب توزيع الماء والكهرباء": { symbol: 'building', color: '#ADD8E6', size: 20 },
        "محول كهرباء": { symbol: 'lightningBolt', color: '#FFD700', size: 20 }, // أصفر ذهبي للصاعقة
        "محطة معالجة المياه العادمة": { symbol: 'circle', color: '#A0522D', size: 20 }, // بني
        "_default": { symbol: 'circle', color: '#87CEEB' }
    },
    "محطات الوقود": {
        "_default": { symbol: 'pin', color: '#000000', size: 20 } // أسود لمحطات الوقود
    },
    "التعليم والتكوين وتشغيل الكفاءات": {
        "مدرسة ابتدائية": { symbol: 'square', color: '#32CD32', size: 18 }, // أخضر ليموني
        "إعدادية": { symbol: 'square', color: '#008000', size: 18 }, // أخضر
        "ثانوية": { symbol: 'square', color: '#2E8B57', size: 18 }, // أخضر بحري
        "_default": { symbol: 'square', color: '#90EE90' }
    },
    "التشوير الطرقي": { // قد تحتاج إلى رموز نصية أو صور هنا لمزيد من التفاصيل
        "علامة توقف": { type: 'text', content: '🛑', size: 18, color: 'red', backgroundColor: 'white', borderColor: 'red' },
        "أضواء مرور": { type: 'text', content: '🚦', size: 18, color: 'black' },
        "علامة تحذير": { type: 'text', content: '⚠️', size: 18, color: 'orange' },
        "_default": { symbol: 'pin', color: '#6495ED', size: 16 }
    },
    "الخدمات الدينية": {
        "مسجد": { symbol: 'mosqueDome', color: '#B8860B', size: 28 },
        "زاوية": { symbol: 'pin', color: '#FFD700', size: 22 },
        "مقبرة": { symbol: 'square', color: '#708090', size: 18 }, // رمادي
        "مصلى": { symbol: 'square', color: '#F0E68C', size: 18 }, // كاكي فاتح
        "_default": { symbol: 'pin', color: '#DAA520' }
    },
    "المرافق التجارية": {
        "سوق تقليدي": { symbol: 'building', color: '#FFA500', size: 20 },
        "مركز تجاري": { symbol: 'building', color: '#E6E6FA', size: 22 },
        "_default": { symbol: 'building', color: '#D2B48C' } // أسمر فاتح
    },
    // --- أنماط للطبقات الخطية والمساحية ---
    "طبقة المباني": {
        "_default_style": { color: "#A9A9A9", weight: 1, fillColor: "#D3D3D3", fillOpacity: 0.6 }
    },
    "شبكة الطرق": {
        "_default_style": { color: "#333333", weight: 3 } // رمادي داكن جداً للطرق
    },
    "المناطق الخضراء والزراعة": {
        "_default_style": { color: "#228B22", weight: 1, fillColor: "#90EE90", fillOpacity: 0.5 }
    },
    "أحياء": {
        "_default_style": { color: "#FF8C00", weight: 2, dashArray: '5, 5', fill: false } // برتقالي داكن متقطع
    },
    "حدود إدارية العطاوية": {
        "_default_style": { color: "#0000FF", weight: 3.5, opacity: 0.9, fillOpacity: 0.1, fillColor: "#ADD8E6" }
    },
    "طبقة غير مصنفة": { // للمعالم التي لم يتم تحديد طبقتها أو نوعها
        "_default": { symbol: 'pin', color: '#FF00FF', size: 18 }, // بنفسجي للنقاط
        "_default_style": { color: "#FF00FF", weight: 2 } // بنفسجي للخطوط/المساحات
    }
    // أضف أنماط لباقي الطبقات الرئيسية (النقل، الأمن، المالية، إلخ)
};

// --- نهاية مكتبة الرموز والأنماط ---


// 3. دوال مساعدة
function getLayerNameFromPath(pathString) {
    if (!pathString || typeof pathString !== 'string' || pathString.trim() === "") {
        return "طبقة غير مصنفة";
    }
    const parts = pathString.split(/[\\\/]/); // يعمل مع \ و /
    // ابحث عن "Jarmi" وحاول أخذ المجلد التالي له كاسم طبقة
    const jarmiIndex = parts.findIndex(part => part.toLowerCase() === 'jarmi');
    if (jarmiIndex !== -1 && parts.length > jarmiIndex + 1) {
        return parts[jarmiIndex + 1];
    }
    // إذا لم يتم العثور على Jarmi، حاول أخذ المجلد قبل الأخير (بافتراض أن الأخير هو اسم الملف)
    if (parts.length >= 2) {
        return parts[parts.length - 2];
    }
    return "طبقة غير مصنفة";
}

function createPopupContent(properties, layerName) {
    let content = `<b>${properties.الاسم || properties.name || properties.Nom || 'معلم'}</b> (${layerName})`;
    for (const key in properties) {
        if (properties.hasOwnProperty(key) &&
            !['Path', 'derived_layer_name', 'OBJECTID', 'X', 'Y', 'Z', 'id', 'Shape_Length', 'Shape_Area'].includes(key) && // تجاهل خصائص معينة
            properties[key] !== null && String(properties[key]).trim() !== "" && String(properties[key]).trim() !== " ") {
            let displayKey = key.replace(/_/g, ' '); // استبدال الشرطات السفلية بمسافات
            displayKey = displayKey.charAt(0).toUpperCase() + displayKey.slice(1); // جعل أول حرف كبيرًا
            content += `<br><b>${displayKey}:</b> ${properties[key]}`;
        }
    }
    return content;
}

// 4. تحميل ومعالجة بيانات GeoJSON
const createdGeoJsonLayers = {}; // لتخزين طبقات Leaflet
const overlayMapsControl = {}; // لكائن متحكم الطبقات

fetch('Attaouia_GeoData.geojson') // تأكد أن اسم الملف صحيح وموجود في نفس المجلد
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (!data.features || !Array.isArray(data.features)) {
            throw new Error("GeoJSON format error: 'features' array not found or not an array.");
        }

        // أ. استخلاص اسم الطبقة لكل معلم
        data.features.forEach(feature => {
            if (!feature.properties) feature.properties = {};
            feature.properties.derived_layer_name = getLayerNameFromPath(feature.properties.Path);
        });

        // ب. تجميع المعالم حسب derived_layer_name
        const featuresByDerivedLayer = {};
        data.features.forEach(feature => {
            const derivedName = feature.properties.derived_layer_name || "طبقة غير مصنفة";
            if (!featuresByDerivedLayer[derivedName]) {
                featuresByDerivedLayer[derivedName] = [];
            }
            featuresByDerivedLayer[derivedName].push(feature);
        });

        // ج. إنشاء طبقات GeoJSON
        for (const derivedName in featuresByDerivedLayer) {
            if (featuresByDerivedLayer.hasOwnProperty(derivedName)) {
                const layerData = {
                    type: "FeatureCollection",
                    features: featuresByDerivedLayer[derivedName]
                };

                let layerMainStyleConfig = featureTypeStyles[derivedName] || featureTypeStyles["طبقة غير مصنفة"];

                createdGeoJsonLayers[derivedName] = L.geoJSON(layerData, {
                    pointToLayer: (feature, latlng) => {
                        // محاولة إيجاد اسم النوع من عدة خصائص محتملة
                        const featureType = feature.properties.النوع || feature.properties.type || feature.properties.نوع_المرفق || "_default";
                        let styleSettings = (layerMainStyleConfig && layerMainStyleConfig[featureType]) || layerMainStyleConfig["_default"] || featureTypeStyles["طبقة غير مصنفة"]["_default"];

                        if (styleSettings.type === 'text') {
                            const divHtml = `<div style="font-size:${styleSettings.size || 16}px; color:${styleSettings.color || 'black'}; background-color:${styleSettings.backgroundColor || 'transparent'}; border:1px solid ${styleSettings.borderColor || 'transparent'}; border-radius:3px; padding:1px; text-align:center; white-space: nowrap;">${styleSettings.content}</div>`;
                            let iconWidth = (styleSettings.size || 16) * (String(styleSettings.content).length * 0.7) + 8; // تقدير عرض النص
                            let iconHeight = (styleSettings.size || 16) + 8;
                            return L.marker(latlng, {
                                icon: L.divIcon({
                                    html: divHtml,
                                    className: 'custom-text-div-icon',
                                    iconSize: [iconWidth, iconHeight],
                                    iconAnchor: [iconWidth / 2, iconHeight]
                                })
                            });
                        }

                        // استخدام مكتبة الرموز SVG
                        const symbolKey = styleSettings.symbol;
                        return L.marker(latlng, {
                            icon: createSvgDivIcon(symbolKey, styleSettings)
                        });
                    },
                    style: (feature) => { // للخطوط والمساحات
                        return layerMainStyleConfig["_default_style"] || featureTypeStyles["طبقة غير مصنفة"]["_default_style"];
                    },
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup(createPopupContent(feature.properties, derivedName));
                    }
                });

                overlayMapsControl[derivedName] = createdGeoJsonLayers[derivedName];
                // إضافة طبقات معينة افتراضيًا إلى الخريطة
                if (["حدود إدارية العطاوية", "شبكة الطرق", "طبقة المباني"].includes(derivedName)) {
                    createdGeoJsonLayers[derivedName].addTo(map);
                }
            }
        }

        // 5. إضافة متحكم الطبقات (Layer Control)
        L.control.layers(null, overlayMapsControl, { collapsed: false, position: 'topright' }).addTo(map);

        // 6. تعديل مظهر متحكم الطبقات
        const layerControlElement = document.querySelector('.leaflet-control-layers');
        if (layerControlElement) {
            layerControlElement.style.width = '280px'; // زيادة العرض قليلاً
            layerControlElement.style.maxHeight = 'calc(100vh - 100px)'; // ارتفاع يترك مساحة للهيدر/الفوتر
            layerControlElement.style.overflowY = 'auto';
            layerControlElement.style.backgroundColor = 'white';
            layerControlElement.style.padding = '10px';
            layerControlElement.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
            layerControlElement.style.fontSize = '13px'; // حجم خط أصغر قليلاً للعناصر
        }
        const layersControlContainer = document.querySelector('.leaflet-control-layers-list');
        if (layersControlContainer) {
            const titleElement = document.createElement('div');
            titleElement.innerHTML = '<strong>الطبقات المتاحة</strong>'; // عنوان متحكم الطبقات
            titleElement.style.textAlign = 'center';
            titleElement.style.padding = '5px 0 10px 0';
            titleElement.style.borderBottom = '1px solid #ccc';
            titleElement.style.marginBottom = '5px';
            layersControlContainer.insertBefore(titleElement, layersControlContainer.firstChild);
        }
    })
    .catch(error => {
        console.error('خطأ في تحميل أو معالجة GeoJSON:', error);
        const mapDiv = document.getElementById('map');
        if (mapDiv) {
            mapDiv.innerHTML = `<div style="padding: 20px; text-align: center; color: red;">
                                   <h3>حدث خطأ أثناء تحميل البيانات الجغرافية!</h3>
                                   <p>يرجى التحقق من وحدة التحكم (Console) لمزيد من التفاصيل.</p>
                                   <p><em>${error.message}</em></p>
                               </div>`;
        }
    });

// 7. CSS إضافي (يمكن نقله إلى ملف CSS خارجي)
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
    .custom-svg-div-icon, .custom-text-div-icon {
        background: transparent !important;
        border: none !important;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1; /* يمنع تمدد الارتفاع بسبب النص */
    }
    .leaflet-control-layers-list label { /* كل عنصر في قائمة الطبقات */
        display: flex; /* لجعل الـ checkbox والنص على نفس السطر مع مسافة */
        align-items: center;
        margin-bottom: 4px; /* مسافة بين العناصر */
    }
    .leaflet-control-layers-list label input[type="checkbox"] { /* الـ checkbox */
        margin-right: 0; /* إزالة الهامش الافتراضي لليمين */
        margin-left: 6px; /* إضافة هامش لليسار (بجانب النص العربي) */
    }
    .leaflet-control-layers-list label span { /* النص بجانب الـ checkbox */
        vertical-align: middle;
    }
    .leaflet-control-layers-expanded {
        padding: 6px 10px !important; /* تعديل الحشو الداخلي */
    }
    .leaflet-control-layers-scrollbar { /* إذا كان هناك شريط تمرير */
        overflow-y: auto;
        padding-right: 5px;
    }
`;
document.head.appendChild(styleSheet);

// (اختياري) وظيفة زر "إخراج البيانات" إذا كان لديك زر بهذا الـ ID
const exportButton = document.getElementById('export-data-button');
if (exportButton) {
    exportButton.addEventListener('click', () => {
        alert('وظيفة إخراج البيانات لم تُنفذ بعد في هذا المثال.');
        // يمكنك هنا إضافة كود لحفظ الخريطة كصورة (باستخدام مكتبة مثل html2canvas أو leaflet-image)
        // أو لتنزيل بيانات GeoJSON المعروضة (يمكن تجميعها من createdGeoJsonLayers)
    });
}
