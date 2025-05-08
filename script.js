// ====================================================================================
// GIS SCRIPT FOR ATTAOUIA - ADVANCED STYLING & CUSTOM LEGEND
// ====================================================================================

// 1. تهيئة الخريطة
var map = L.map('map').setView([31.785, -7.285], 13);

// 2. إضافة طبقة أساس (TileLayer)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// --- بداية مكتبة الرموز والأنماط ---

// 1.1. مكتبة الرموز (SVG definitions) - (نفس ما قدمته سابقًا، يمكنك توسيعها)
const symbolLibrary = {
    'pin': { type: 'svg', path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z', viewBox: '0 0 24 24', defaultColor: '#FF0000', defaultSize: 24 },
    'circle': { type: 'svg', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', viewBox: '0 0 24 24', defaultColor: '#007bff', defaultSize: 16 },
    'square': { type: 'svg', path: 'M3 3h18v18H3z', viewBox: '0 0 24 24', defaultColor: '#28a745', defaultSize: 16 },
    'building': { type: 'svg', path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', viewBox: '0 0 24 24', defaultColor: '#6c757d', defaultSize: 20 },
    'plusSign': { type: 'svg', path: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z', viewBox: '0 0 24 24', defaultColor: '#DC143C', defaultSize: 22 },
    'mosqueDome': { type: 'svg', path: 'M12 2C8.69 2 6 4.69 6 8c0 1.81.72 3.44 1.88 4.62L12 22l4.12-9.38C17.28 11.44 18 9.81 18 8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z', viewBox: '0 0 24 24', defaultColor: '#B8860B', defaultSize: 26 },
    'lightningBolt': { type: 'svg', path: 'M7 2v11h3v9l7-12h-4l4-8z', viewBox: '0 0 24 24', defaultColor: '#FFFF00', defaultSize: 18 }
    // ... أضف المزيد من الرموز
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

    // الافتراضي هو SVG
    const symbolKey = styleSettings.symbol;
    const symbol = symbolLibrary[symbolKey];
    if (!symbol || symbol.type !== 'svg') {
        console.warn(`SVG Symbol '${symbolKey}' not found. Using default pin.`);
        // استخدام رمز افتراضي إذا لم يتم العثور على رمز SVG
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
// المفتاح هو اسم الطبقة الرئيسي. القيمة تحتوي على `subcategories` و `defaultPointStyle` و `defaultLinePolyStyle`
// **ملاحظة هامة:** أسماء الفئات الفرعية (مثل "اجتماعية", "صحية") يجب أن تكون موجودة كقيمة في خاصية ما داخل `feature.properties` (مثلاً `feature.properties.الفئة_الفرعية` أو `feature.properties.SubCategory`)
const detailedStyles = {
    "الصحة والمجال الاجتماعي": {
        displayName: "الصحة والمجال الاجتماعي",
        subcategories: {
            "اجتماعية": { displayName: "اجتماعية", style: { symbol: 'pin', color: '#FF6347', size: 20 } }, // برتقالي أحمر
            "صحية": { displayName: "صحية", style: { symbol: 'plusSign', color: '#4682B4', size: 22 } } // أزرق فولاذي
        },
        defaultPointStyle: { symbol: 'pin', color: '#FFC0CB', size: 18 } // نمط افتراضي إذا لم تطابق الفئة الفرعية
    },
    "توزيع الماء والكهرباء": { // لاحظ أن الاسم في المثال "توزيع الماء والكهرباءة" فيه خطأ إملائي
        displayName: "توزيع الماء والكهرباء",
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
        subcategories: { // إذا كانت هناك فئات فرعية للمباني
            "خدماتي": { displayName: "خدماتي", styleConfig: { fillColor: "#FFFFE0", color: "#BDB76B" } }, // أصفر فاتح
            "سكني": { displayName: "سكني", styleConfig: { fillColor: "#D3D3D3", color: "#A9A9A9" } } // رمادي
        },
        defaultLinePolyStyle: { color: "#808080", weight: 1, fillColor: "#C0C0C0", fillOpacity: 0.6 }
    },
    "شبكة الطرق": {
        displayName: "شبكة الطرق",
        subcategories: {
            "طريق رئيسية": { displayName: "طريق رئيسية", styleConfig: { color: "#000000", weight: 4 } },
            "طريق ثانوية": { displayName: "طريق ثانوية", styleConfig: { color: "#555555", weight: 3 } },
            // ... المزيد من أنواع الطرق
        },
        defaultLinePolyStyle: { color: "#777777", weight: 2.5 }
    },
    "حدود إدارية العطاوية": {
        displayName: "حدود إدارية العطاوية",
        defaultLinePolyStyle: { color: "#FF00FF", weight: 3.5, opacity: 0.9, fillOpacity: 0.15, fillColor: "#FFC0CB" } // بنفسجي للحدود
    },
    "طبقة غير مصنفة": {
        displayName: "طبقة غير مصنفة",
        defaultPointStyle: { symbol: 'pin', color: '#777777', size: 16 },
        defaultLinePolyStyle: { color: "#999999", weight: 2, dashArray: '4,4' }
    }
    // *** أكمل هذا الهيكل لجميع الطبقات والفئات الفرعية المدرجة في مثال ArcGIS ***
    // استخدم `displayName` للعرض في وسيلة الإيضاح.
    // `style` للمعالم النقطية، `styleConfig` للمعالم الخطية/المساحية.
};


// 3. دوال مساعدة
function getLayerNameFromProperties(properties) {
    // **الأولوية لخاصية مباشرة إذا كانت تحدد اسم الطبقة الرئيسي بشكل موثوق**
    // مثال: if (properties.MainCategory) return properties.MainCategory;
    // مثال: if (properties.LayerGroup) return properties.LayerGroup;

    // إذا لم تكن هناك خاصية مباشرة، استخدم Path
    const pathString = properties.Path;
    if (!pathString || typeof pathString !== 'string' || pathString.trim() === "") {
        return "طبقة غير مصنفة"; // اسم احتياطي
    }
    const parts = pathString.split(/[\\\/]/);
    const jarmiIndex = parts.findIndex(part => part.toLowerCase() === 'jarmi');
    if (jarmiIndex !== -1 && parts.length > jarmiIndex + 1) {
        let potentialName = parts[jarmiIndex + 1];
        // تصحيح أسماء الطبقات الشائعة إذا لزم الأمر
        if (potentialName === "توزيع الماء والكهرباءة") potentialName = "توزيع الماء والكهرباء";
        if (potentialName === "التشويرالطرقي") potentialName = "التشوير الطرقي";
        // تحقق إذا كان الاسم المستخرج موجودًا في detailedStyles
        if (detailedStyles[potentialName]) return potentialName;
    }
    // إذا لم يتم العثور على تطابق دقيق، قد تحتاج إلى منطق إضافي أو إرجاع "طبقة غير مصنفة"
    return "طبقة غير مصنفة";
}

function createPopupContent(properties, mainLayerName) {
    let content = `<b>${properties.الاسم || properties.name || properties.Nom || 'معلم'}</b>`;
    content += `<br><small><i>(${mainLayerName_Display = detailedStyles[mainLayerName]?.displayName || mainLayerName})</i></small>`;

    for (const key in properties) {
        if (properties.hasOwnProperty(key) &&
            !['Path', 'derived_layer_name', 'MainCategory', 'LayerGroup', 'OBJECTID', 'X', 'Y', 'Z', 'id', 'Shape_Length', 'Shape_Area'].includes(key) &&
            properties[key] !== null && String(properties[key]).trim() !== "" && String(properties[key]).trim() !== " ") {
            let displayKey = key.replace(/_/g, ' ');
            displayKey = displayKey.charAt(0).toUpperCase() + displayKey.slice(1);
            content += `<br><b>${displayKey}:</b> ${properties[key]}`;
        }
    }
    return content;
}

// 4. تحميل ومعالجة بيانات GeoJSON
const createdLayers = {}; // يخزن مجموعات طبقات Leaflet
const layerControlEntries = {}; // لإدخالات L.control.layers (الطبقات الرئيسية فقط)

fetch('Attaouia_GeoData.geojson')
    .then(response => {
        if (!response.ok) throw new Error(`Network error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (!data.features || !Array.isArray(data.features)) throw new Error("Invalid GeoJSON format.");

        const featuresByMainLayer = {};
        data.features.forEach(feature => {
            if (!feature.properties) feature.properties = {};
            const mainLayerName = getLayerNameFromProperties(feature.properties);
            feature.properties.derived_main_layer = mainLayerName; // اسم الطبقة الرئيسي للمعلم

            if (!featuresByMainLayer[mainLayerName]) {
                featuresByMainLayer[mainLayerName] = [];
            }
            featuresByMainLayer[mainLayerName].push(feature);
        });

        for (const mainLayerName in featuresByMainLayer) {
            if (featuresByMainLayer.hasOwnProperty(mainLayerName)) {
                const layerFeatures = featuresByMainLayer[mainLayerName];
                const mainLayerConfig = detailedStyles[mainLayerName] || detailedStyles["طبقة غير مصنفة"];

                const geoJsonLayerGroup = L.geoJSON(null, { // ابدأ بمجموعة فارغة
                    pointToLayer: (feature, latlng) => {
                        // **ستحتاج إلى خاصية تحدد الفئة الفرعية، مثال: feature.properties.SubCategory أو feature.properties.النوع**
                        const subCategoryName = feature.properties.SubCategory || feature.properties.النوع || "_default";
                        let styleInfo = (mainLayerConfig.subcategories && mainLayerConfig.subcategories[subCategoryName]?.style) ||
                                        mainLayerConfig.defaultPointStyle ||
                                        detailedStyles["طبقة غير مصنفة"].defaultPointStyle;
                        return L.marker(latlng, { icon: createFeatureIcon(styleInfo) });
                    },
                    style: (feature) => {
                        const subCategoryName = feature.properties.SubCategory || feature.properties.النوع || "_default_style";
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
                layerControlEntries[mainLayerConfig.displayName || mainLayerName] = geoJsonLayerGroup;

                // إضافة بعض الطبقات افتراضيًا
                if (["حدود إدارية العطاوية", "شبكة الطرق"].includes(mainLayerName)) {
                    geoJsonLayerGroup.addTo(map);
                }
            }
        }

        L.control.layers(null, layerControlEntries, { collapsed: false, position: 'topright' }).addTo(map);
        updateCustomLegend(); // استدعاء دالة تحديث وسيلة الإيضاح المخصصة
        styleLayerControl(); // تعديل مظهر متحكم الطبقات
    })
    .catch(error => {
        console.error('Error loading/processing GeoJSON:', error);
        document.getElementById('map').innerHTML = `<div style="padding:20px;color:red;text-align:center;"><h3>Error: ${error.message}</h3><p>Please check the console for details.</p></div>`;
    });


// 5. وسيلة إيضاح مخصصة (Custom Legend)
function updateCustomLegend() {
    const legendContainerId = 'custom-legend'; // ID لعنصر div ستضيفه في HTML
    let legendDiv = document.getElementById(legendContainerId);
    if (!legendDiv) {
        legendDiv = document.createElement('div');
        legendDiv.id = legendContainerId;
        // إضافته إلى جانب متحكم الطبقات أو في مكان آخر مناسب
        // هذا مثال بسيط لإضافته كعنصر تحكم Leaflet
        const legendControl = L.control({ position: 'bottomright' }); // أو 'topright'
        legendControl.onAdd = function (map) {
            legendDiv.innerHTML = '<h4>وسيلة الإيضاح</h4>'; // عنوان مبدئي
            L.DomEvent.disableClickPropagation(legendDiv); // لمنع الخريطة من التفاعل عند النقر على وسيلة الإيضاح
            return legendDiv;
        };
        legendControl.addTo(map);
    } else {
        legendDiv.innerHTML = '<h4>وسيلة الإيضاح</h4>'; // مسح المحتوى القديم وإضافة العنوان
    }

    legendDiv.style.backgroundColor = 'white';
    legendDiv.style.padding = '10px';
    legendDiv.style.border = '1px solid #ccc';
    legendDiv.style.maxHeight = '300px';
    legendDiv.style.overflowY = 'auto';
    legendDiv.style.fontSize = '12px';


    for (const mainLayerName in detailedStyles) {
        if (detailedStyles.hasOwnProperty(mainLayerName) && mainLayerName !== "طبقة غير مصنفة") {
            const layerConfig = detailedStyles[mainLayerName];
            if (!createdLayers[mainLayerName]) continue; // تخطي إذا لم يتم إنشاء الطبقة (لا توجد معالم لها)

            const mainLayerDiv = document.createElement('div');
            mainLayerDiv.innerHTML = `<strong>${layerConfig.displayName || mainLayerName}</strong>`;
            mainLayerDiv.style.marginTop = '8px';
            legendDiv.appendChild(mainLayerDiv);

            if (layerConfig.subcategories) {
                for (const subcatName in layerConfig.subcategories) {
                    if (layerConfig.subcategories.hasOwnProperty(subcatName)) {
                        const subcatConfig = layerConfig.subcategories[subcatName];
                        const itemDiv = document.createElement('div');
                        itemDiv.style.marginLeft = '10px';
                        itemDiv.style.display = 'flex';
                        itemDiv.style.alignItems = 'center';
                        itemDiv.style.marginBottom = '3px';

                        // إنشاء أيقونة للوسيلة
                        let iconHtml = '';
                        if (subcatConfig.style) { // للمعالم النقطية
                            const icon = createFeatureIcon(subcatConfig.style);
                            iconHtml = icon.options.html; // الحصول على HTML للـ DivIcon
                        } else if (subcatConfig.styleConfig) { // للمعالم الخطية/المساحية
                            const sc = subcatConfig.styleConfig;
                            iconHtml = `<span style="background-color:${sc.fillColor || 'transparent'}; border: ${sc.weight || 1}px solid ${sc.color || '#000'}; width:16px; height:10px; display:inline-block; margin-right:5px; vertical-align:middle;"></span>`;
                        }

                        itemDiv.innerHTML = `<span style="display:inline-block; width:20px; height:20px; line-height:20px; text-align:center; margin-right:5px;">${iconHtml || '?'}</span> ${subcatConfig.displayName || subcatName}`;
                        legendDiv.appendChild(itemDiv);
                    }
                }
            } else if (layerConfig.defaultPointStyle || layerConfig.defaultLinePolyStyle) {
                // إذا لم تكن هناك فئات فرعية، اعرض الرمز/النمط الافتراضي للطبقة الرئيسية
                const itemDiv = document.createElement('div');
                itemDiv.style.marginLeft = '10px';
                itemDiv.style.display = 'flex';
                itemDiv.style.alignItems = 'center';
                itemDiv.style.marginBottom = '3px';
                let iconHtml = '';
                if (layerConfig.defaultPointStyle) {
                    iconHtml = createFeatureIcon(layerConfig.defaultPointStyle).options.html;
                } else if (layerConfig.defaultLinePolyStyle) {
                     const sc = layerConfig.defaultLinePolyStyle;
                     iconHtml = `<span style="background-color:${sc.fillColor || 'transparent'}; border: ${sc.weight || 1}px solid ${sc.color || '#000'}; width:16px; height:10px; display:inline-block; margin-right:5px; vertical-align:middle;"></span>`;
                }
                itemDiv.innerHTML = `<span style="display:inline-block; width:20px; height:20px; line-height:20px; text-align:center; margin-right:5px;">${iconHtml || '?'}</span> <small>(نمط افتراضي)</small>`;
                legendDiv.appendChild(itemDiv);
            }
        }
    }
}

// 6. تعديل مظهر متحكم الطبقات Leaflet Control
function styleLayerControl() {
    const layerControlElement = document.querySelector('.leaflet-control-layers');
    if (layerControlElement) {
        layerControlElement.style.width = '280px';
        layerControlElement.style.maxHeight = 'calc(100vh - 150px - 300px)'; // اترك مساحة للهيدر والوسيلة
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
        titleElement.style.textAlign = 'center';
        titleElement.style.padding = '5px 0 10px 0';
        titleElement.style.borderBottom = '1px solid #ccc';
        titleElement.style.marginBottom = '5px';
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
    #custom-legend strong { display: block; border-bottom: 1px solid #eee; margin-bottom: 5px; padding-bottom: 3px; }
`;
document.head.appendChild(styleSheet);

// (وظيفة زر الإخراج إذا كنت ستستخدمها)
