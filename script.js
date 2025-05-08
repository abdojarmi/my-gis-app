// ====================================================================================
// GIS SCRIPT FOR ATTAOUIA - V3 (Improved Classification & Custom Legend)
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
    'pin': { type: 'svg', path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z', viewBox: '0 0 24 24', defaultColor: '#FF0000', defaultSize: 24 },
    'circle': { type: 'svg', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', viewBox: '0 0 24 24', defaultColor: '#007bff', defaultSize: 16 },
    'square': { type: 'svg', path: 'M3 3h18v18H3z', viewBox: '0 0 24 24', defaultColor: '#28a745', defaultSize: 16 },
    'building': { type: 'svg', path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', viewBox: '0 0 24 24', defaultColor: '#6c757d', defaultSize: 20 },
    'plusSign': { type: 'svg', path: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z', viewBox: '0 0 24 24', defaultColor: '#DC143C', defaultSize: 22 },
    'mosqueDome': { type: 'svg', path: 'M12 2C8.69 2 6 4.69 6 8c0 1.81.72 3.44 1.88 4.62L12 22l4.12-9.38C17.28 11.44 18 9.81 18 8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z', viewBox: '0 0 24 24', defaultColor: '#B8860B', defaultSize: 26 },
    'lightningBolt': { type: 'svg', path: 'M7 2v11h3v9l7-12h-4l4-8z', viewBox: '0 0 24 24', defaultColor: '#FFFF00', defaultSize: 18 }
    // *** أضف المزيد من تعريفات SVG للرموز هنا ***
};

// 1.2. دالة مساعدة لإنشاء أيقونة SVG أو نصية
function createFeatureIcon(styleSettings = {}) {
    if (styleSettings.type === 'text') {
        const divHtml = `<div style="font-size:${styleSettings.size || 16}px; color:${styleSettings.color || 'black'}; background-color:${styleSettings.backgroundColor || 'transparent'}; border:1px solid ${styleSettings.borderColor || 'transparent'}; border-radius:3px; padding:1px; text-align:center; white-space: nowrap;">${styleSettings.content}</div>`;
        let iconWidth = (styleSettings.size || 16) * (String(styleSettings.content).length * 0.6) + 8;
        let iconHeight = (styleSettings.size || 16) + 8;
        return L.divIcon({
            html: divHtml,
            className: 'custom-text-div-icon',
            iconSize: [iconWidth, iconHeight],
            iconAnchor: [iconWidth / 2, iconHeight]
        });
    }

    const symbolKey = styleSettings.symbol;
    const symbol = symbolLibrary[symbolKey];
    if (!symbol || symbol.type !== 'svg') {
        console.warn(`SVG Symbol '${symbolKey}' not found for style:`, styleSettings, `. Using default pin.`);
        return createFeatureIcon({ symbol: 'pin', color: styleSettings.color || '#CCCCCC', size: styleSettings.size || 18 });
    }

    const color = styleSettings.color || symbol.defaultColor;
    const size = styleSettings.size || symbol.defaultSize;
    const path = styleSettings.path || symbol.path;
    const viewBox = styleSettings.viewBox || symbol.viewBox;

    const svgHtml = `<svg width="${size}" height="${size}" viewBox="${viewBox}" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="${path}"/></svg>`;
    return L.divIcon({
        html: svgHtml,
        className: 'custom-svg-div-icon',
        iconSize: [size, size],
        iconAnchor: styleSettings.anchor || [size / 2, size]
    });
}

// 1.3. هيكل الأنماط المفصل (يعكس قائمة ArcGIS)
// *** يجب تعبئة هذا الكائن بالكامل لجميع طبقاتك وفئاتك الفرعية ***
const detailedStyles = {
    "الصحة والمجال الاجتماعي": {
        displayName: "الصحة والمجال الاجتماعي",
        subcategories: {
            "اجتماعية": { displayName: "اجتماعية", style: { symbol: 'pin', color: '#FF6347', size: 20 } },
            "صحية": { displayName: "صحية", style: { symbol: 'plusSign', color: '#4682B4', size: 22 } }
        },
        defaultPointStyle: { symbol: 'pin', color: '#FFC0CB', size: 18 }
    },
    "توزيع الماء والكهرباء": {
        displayName: "توزيع الماء والكهرباء", // تم تصحيح الإملاء
        subcategories: {
            "مكتب توزيع الماء والكهرباء": { displayName: "مكتب توزيع", style: { symbol: 'building', color: '#ADD8E6', size: 20 } },
            "محطة معالجة المياه": { displayName: "محطة معالجة مياه", style: { symbol: 'circle', color: '#1E90FF', size: 20 } },
            "خزان مياه": { displayName: "خزان مياه", style: { symbol: 'square', color: '#87CEFA', size: 18 } },
            "محول كهرباء": { displayName: "محول كهرباء", style: { symbol: 'lightningBolt', color: '#FFD700', size: 20 } }
        },
        defaultPointStyle: { symbol: 'pin', color: '#B0E0E6', size: 18 }
    },
    "طبقة المباني": {
        displayName: "طبقة المباني",
        subcategories: {
            "خدماتي": { displayName: "خدماتي", styleConfig: { fillColor: "#FFFFE0", color: "#BDB76B", weight: 1, fillOpacity: 0.7 } },
            "سكني": { displayName: "سكني", styleConfig: { fillColor: "#D3D3D3", color: "#A9A9A9", weight: 1, fillOpacity: 0.7 } }
        },
        defaultLinePolyStyle: { color: "#808080", weight: 1, fillColor: "#C0C0C0", fillOpacity: 0.6 }
    },
    "محطات الوقود": {
        displayName: "محطات الوقود",
        defaultPointStyle: { symbol: 'pin', color: '#333333', size: 20 } // أسود داكن
    },
    "التعليم والتكوين وتشغيل الكفاءات": {
        displayName: "التعليم والتكوين",
        // ... أضف فئات فرعية هنا
        defaultPointStyle: { symbol: 'square', color: '#90EE90', size: 18 }
    },
    "التشوير الطرقي": { // الاسم المصحح
        displayName: "التشوير الطرقي",
        subcategories: {
            "أضواء مرور": { displayName: "أضواء مرور", style: { type: 'text', content: '🚦', size: 18 } },
            "علامة توقف": { displayName: "علامة توقف", style: { type: 'text', content: '🛑', size: 18, color: 'red', backgroundColor: 'white', borderColor: 'red' } },
            // ... أضف باقي أنواع التشوير الطرقي
        },
        defaultPointStyle: { symbol: 'pin', color: '#6495ED', size: 16 }
    },
    "الخدمات الدينية": {
        displayName: "الخدمات الدينية",
        subcategories: {
            "مسجد": { displayName: "مسجد", style: {symbol: 'mosqueDome', color: '#B8860B', size: 28 } },
            "مصلى": { displayName: "مصلى", style: {symbol: 'square', color: '#F0E68C', size: 18 } },
            "مقبرة": { displayName: "مقبرة", style: {symbol: 'square', color: '#708090', size: 18 } },
            "زاوية": { displayName: "زاوية", style: {symbol: 'pin', color: '#FFD700', size: 22 } }
        },
        defaultPointStyle: { symbol: 'pin', color: '#DAA520', size: 18 }
    },
    "النقل": {
        displayName: "النقل",
        // ... أضف فئات فرعية هنا
        defaultPointStyle: { symbol: 'pin', color: '#FFA500', size: 20 } // برتقالي
    },
    // ... أكمل تعريف جميع الطبقات الرئيسية بنفس الطريقة
    // مثل: الامن والوقاية المدنية, المالية والجبايات, المرافق التجارية, الادارات الترابية, الخ.

    "شبكة الطرق": { // طبقة خطية
        displayName: "شبكة الطرق",
        defaultLinePolyStyle: { color: "#333333", weight: 3 }
    },
    "حدود إدارية العطاوية": { // طبقة مساحية
        displayName: "حدود إدارية العطاوية",
        defaultLinePolyStyle: { color: "#FF00FF", weight: 3.5, opacity: 0.9, fillOpacity: 0.15, fillColor: "#FFC0CB" }
    },
    "طبقة غير مصنفة": { // طبقة احتياطية
        displayName: "طبقة غير مصنفة",
        defaultPointStyle: { symbol: 'pin', color: '#999999', size: 16 },
        defaultLinePolyStyle: { color: "#AAAAAA", weight: 2, dashArray: '4,4' }
    }
};

// 3. دوال مساعدة
function getLayerNameFromProperties(properties) {
    const knownMainLayers = Object.keys(detailedStyles).filter(k => k !== "طبقة غير مصنفة");

    // **عدّل هذه القائمة لتشمل أسماء الخصائص الفعلية في بياناتك التي قد تحتوي على اسم الطبقة الرئيسي**
    const directPropsToCheck = ['MainCategory', 'LayerGroup', 'اسم_الطبقة_الرئيسي', 'layer_name_principal', 'layer'];

    for (const prop of directPropsToCheck) {
        if (properties[prop]) {
            let propValue = properties[prop];
            // تصحيحات شائعة للاسم
            if (propValue === "توزيع الماء والكهرباءة") propValue = "توزيع الماء والكهرباء";
            if (propValue === "التشويرالطرقي") propValue = "التشوير الطرقي";

            if (knownMainLayers.includes(propValue)) {
                return propValue;
            }
        }
    }

    const pathString = properties.Path;
    if (pathString && typeof pathString === 'string' && pathString.trim() !== "") {
        const parts = pathString.split(/[\\\/]/);
        const jarmiIndex = parts.findIndex(part => part.toLowerCase() === 'jarmi');
        if (jarmiIndex !== -1 && parts.length > jarmiIndex + 1) {
            let potentialName = parts[jarmiIndex + 1];
            if (potentialName === "توزيع الماء والكهرباءة") potentialName = "توزيع الماء والكهرباء";
            if (potentialName === "التشويرالطرقي") potentialName = "التشوير الطرقي";

            if (knownMainLayers.includes(potentialName)) {
                return potentialName;
            }
            // console.log(`Path-derived name "${potentialName}" not in detailedStyles. Feature props:`, properties);
        }
    }
    return "طبقة غير مصنفة";
}

function createPopupContent(properties, mainLayerName) {
    let displayName = (detailedStyles[mainLayerName] && detailedStyles[mainLayerName].displayName) || mainLayerName;
    let content = `<b>${properties.الاسم || properties.name || properties.Nom || 'معلم'}</b>`;
    content += `<br><small><i>(${displayName})</i></small>`;

    for (const key in properties) {
        if (properties.hasOwnProperty(key) &&
            !['Path', 'derived_main_layer', 'MainCategory', 'LayerGroup', 'OBJECTID', 'X', 'Y', 'Z', 'id', 'Shape_Length', 'Shape_Area', 'OBJECTID_1', 'layer_name_principal'].includes(key) && // تجاهل المزيد من الخصائص
            properties[key] !== null && String(properties[key]).trim() !== "" && String(properties[key]).trim() !== " ") {
            let displayKey = key.replace(/_/g, ' ');
            displayKey = displayKey.charAt(0).toUpperCase() + displayKey.slice(1);
            content += `<br><b>${displayKey}:</b> ${properties[key]}`;
        }
    }
    return content;
}

// 4. تحميل ومعالجة بيانات GeoJSON
const createdLayers = {};
const layerControlEntries = {};

fetch('Attaouia_GeoData.geojson')
    .then(response => {
        if (!response.ok) throw new Error(`Network error: ${response.status} ${response.statusText}`);
        return response.json();
    })
    .then(data => {
        if (!data.features || !Array.isArray(data.features)) throw new Error("Invalid GeoJSON format.");

        let unclassifiedCount = 0;
        const classifiedNamesFound = new Set();

        const featuresByMainLayer = {};
        data.features.forEach(feature => {
            if (!feature.properties) feature.properties = {};
            const mainLayerName = getLayerNameFromProperties(feature.properties);
            feature.properties.derived_main_layer = mainLayerName;

            if (mainLayerName === "طبقة غير مصنفة") {
                unclassifiedCount++;
                // console.log("Unclassified feature props:", feature.properties); // لإظهار خصائص المعالم غير المصنفة
            } else {
                classifiedNamesFound.add(mainLayerName);
            }

            if (!featuresByMainLayer[mainLayerName]) featuresByMainLayer[mainLayerName] = [];
            featuresByMainLayer[mainLayerName].push(feature);
        });

        console.log(`Total features: ${data.features.length}`);
        console.log(`Number of unclassified features: ${unclassifiedCount}`);
        console.log("Classified layer names found in data:", Array.from(classifiedNamesFound));
        // console.log("Layer names defined in detailedStyles:", Object.keys(detailedStyles));


        for (const mainLayerName in featuresByMainLayer) {
            if (featuresByMainLayer.hasOwnProperty(mainLayerName)) {
                const layerFeatures = featuresByMainLayer[mainLayerName];
                const mainLayerConfig = detailedStyles[mainLayerName] || detailedStyles["طبقة غير مصنفة"];

                const geoJsonLayerGroup = L.geoJSON(null, {
                    pointToLayer: (feature, latlng) => {
                        // **عدّل أسماء هذه الخصائص لتطابق بياناتك للفئات الفرعية**
                        const subCategoryName = feature.properties.SubCategory || feature.properties.النوع || feature.properties.type || "_default";
                        let styleInfo = (mainLayerConfig.subcategories && mainLayerConfig.subcategories[subCategoryName]?.style) ||
                                        mainLayerConfig.defaultPointStyle ||
                                        detailedStyles["طبقة غير مصنفة"].defaultPointStyle;
                        return L.marker(latlng, { icon: createFeatureIcon(styleInfo) });
                    },
                    style: (feature) => {
                        const subCategoryName = feature.properties.SubCategory || feature.properties.النوع || feature.properties.type || "_default_style";
                        return (mainLayerConfig.subcategories && mainLayerConfig.subcategories[subCategoryName]?.styleConfig) ||
                               mainLayerConfig.defaultLinePolyStyle ||
                               detailedStyles["طبقة غير مصنفة"].defaultLinePolyStyle;
                    },
                    onEachFeature: (feature, layer) => {
                        layer.bindPopup(createPopupContent(feature.properties, mainLayerName));
                    }
                });

                geoJsonLayerGroup.addData({ type: "FeatureCollection", features: layerFeatures });
                createdLayers[mainLayerName] = geoJsonLayerGroup;
                if (mainLayerConfig.displayName) { // استخدم displayName إذا كان موجودًا
                     layerControlEntries[mainLayerConfig.displayName] = geoJsonLayerGroup;
                } else {
                     layerControlEntries[mainLayerName] = geoJsonLayerGroup; // استخدم الاسم الأصلي إذا لم يكن هناك displayName
                }


                if (["حدود إدارية العطاوية", "شبكة الطرق", "طبقة المباني"].includes(mainLayerName)) { // طبقات تظهر افتراضيًا
                    geoJsonLayerGroup.addTo(map);
                }
            }
        }

        L.control.layers(null, layerControlEntries, { collapsed: false, position: 'topright' }).addTo(map);
        updateCustomLegend();
        styleLayerControl();
    })
    .catch(error => {
        console.error('Error loading/processing GeoJSON:', error);
        document.getElementById('map').innerHTML = `<div style="padding:20px;color:red;text-align:center;"><h3>Error: ${error.message}</h3><p>Please check the console for details.</p></div>`;
    });


// 5. وسيلة إيضاح مخصصة (Custom Legend)
function updateCustomLegend() {
    const legendContainerId = 'custom-legend';
    let legendDiv = document.getElementById(legendContainerId);
    if (!legendDiv) {
        legendDiv = document.createElement('div');
        legendDiv.id = legendContainerId;
        const legendControl = L.control({ position: 'bottomright' });
        legendControl.onAdd = function () {
            L.DomEvent.disableClickPropagation(legendDiv);
            return legendDiv;
        };
        legendControl.addTo(map);
    }
    legendDiv.innerHTML = '<h4>وسيلة الإيضاح</h4>';
    legendDiv.style.cssText = "background-color:white; padding:10px; border:1px solid #ccc; max-height:350px; overflow-y:auto; font-size:12px; width: 260px;";

    // ترتيب الطبقات في وسيلة الإيضاح كما هي في detailedStyles
    const orderedLayerNames = Object.keys(detailedStyles);

    orderedLayerNames.forEach(mainLayerName => {
        if (detailedStyles.hasOwnProperty(mainLayerName) && mainLayerName !== "طبقة غير مصنفة") {
            const layerConfig = detailedStyles[mainLayerName];
            // تأكد من أن الطبقة تم إنشاؤها (أي تحتوي على معالم) قبل إضافتها لوسيلة الإيضاح
            if (!createdLayers[mainLayerName] || createdLayers[mainLayerName].getLayers().length === 0) {
                return; // تخطي الطبقات الفارغة
            }

            const mainLayerDiv = document.createElement('div');
            mainLayerDiv.innerHTML = `<strong>${layerConfig.displayName || mainLayerName}</strong>`;
            mainLayerDiv.style.marginTop = '8px';
            legendDiv.appendChild(mainLayerDiv);

            if (layerConfig.subcategories) {
                for (const subcatName in layerConfig.subcategories) {
                    if (layerConfig.subcategories.hasOwnProperty(subcatName)) {
                        const subcatConfig = layerConfig.subcategories[subcatName];
                        const itemDiv = document.createElement('div');
                        itemDiv.style.cssText = "margin-left:10px; display:flex; align-items:center; margin-bottom:3px;";

                        let iconHtml = '';
                        if (subcatConfig.style) {
                            const icon = createFeatureIcon(subcatConfig.style);
                            iconHtml = icon.options.html;
                        } else if (subcatConfig.styleConfig) {
                            const sc = subcatConfig.styleConfig;
                            iconHtml = `<span style="background-color:${sc.fillColor || 'transparent'}; border: ${sc.weight || 1}px solid ${sc.color || '#000'}; width:16px; height:10px; display:inline-block; margin-right:5px; vertical-align:middle;"></span>`;
                        }
                        itemDiv.innerHTML = `<span style="display:inline-block; width:22px; height:22px; line-height:22px; text-align:center; margin-right:5px; flex-shrink:0;">${iconHtml || '?'}</span> <span>${subcatConfig.displayName || subcatName}</span>`;
                        legendDiv.appendChild(itemDiv);
                    }
                }
            } else if (layerConfig.defaultPointStyle || layerConfig.defaultLinePolyStyle) {
                const itemDiv = document.createElement('div');
                itemDiv.style.cssText = "margin-left:10px; display:flex; align-items:center; margin-bottom:3px;";
                let iconHtml = '';
                if (layerConfig.defaultPointStyle) iconHtml = createFeatureIcon(layerConfig.defaultPointStyle).options.html;
                else if (layerConfig.defaultLinePolyStyle) {
                    const sc = layerConfig.defaultLinePolyStyle;
                    iconHtml = `<span style="background-color:${sc.fillColor || 'transparent'}; border: ${sc.weight || 1}px solid ${sc.color || '#000'}; width:16px; height:10px; display:inline-block; margin-right:5px; vertical-align:middle;"></span>`;
                }
                itemDiv.innerHTML = `<span style="display:inline-block; width:22px; height:22px; line-height:22px; text-align:center; margin-right:5px; flex-shrink:0;">${iconHtml || '?'}</span> <span><small>(نمط افتراضي)</small></span>`;
                legendDiv.appendChild(itemDiv);
            }
        }
    });
}

// 6. تعديل مظهر متحكم الطبقات Leaflet Control
function styleLayerControl() {
    const layerControlElement = document.querySelector('.leaflet-control-layers');
    if (layerControlElement) {
        layerControlElement.style.width = '280px';
        layerControlElement.style.maxHeight = 'calc(100vh - 100px - 370px)'; // (ارتفاع الشاشة - هيدر - وسيلة الايضاح التقريبي)
        layerControlElement.style.overflowY = 'auto';
        layerControlElement.style.backgroundColor = 'white';
        layerControlElement.style.padding = '10px';
        layerControlElement.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
        layerControlElement.style.fontSize = '13px';
    }
    const layersControlContainer = document.querySelector('.leaflet-control-layers-list');
    if (layersControlContainer) {
        const titleElement = document.createElement('div');
        titleElement.innerHTML = '<strong>الطبقات الرئيسية</strong>';
        titleElement.style.cssText = "text-align:center; padding:5px 0 10px 0; border-bottom:1px solid #ccc; margin-bottom:5px;";
        layersControlContainer.insertBefore(titleElement, layersControlContainer.firstChild);
    }
}

// 7. CSS إضافي
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
    .custom-svg-div-icon, .custom-text-div-icon { background: transparent !important; border: none !important; display: flex; align-items: center; justify-content: center; line-height: 1; }
    .leaflet-control-layers-list label { display: flex; align-items: center; margin-bottom: 4px; }
    .leaflet-control-layers-list label input[type="checkbox"] { margin-right: 0; margin-left: 6px; }
    .leaflet-control-layers-list label span { vertical-align: middle; }
    .leaflet-control-layers-expanded { padding: 6px 10px !important; }
    #custom-legend h4 { margin-top:0; margin-bottom:10px; text-align:center; border-bottom: 1px solid #ddd; padding-bottom: 5px;}
    #custom-legend strong { display: block; border-bottom: 1px solid #eee; margin-bottom: 5px; padding-bottom: 3px; }
`;
document.head.appendChild(styleSheet);
