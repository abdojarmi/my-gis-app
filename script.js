// ====================================================================================
// GIS SCRIPT FOR ATTAOUIA - V5.2 (Styling Refinements & Legend Update)
// ====================================================================================

// 1. تهيئة الخريطة
var map = L.map('map').setView([31.785, -7.285], 13);

// 2. إضافة طبقة أساس (TileLayer)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// --- بداية مكتبة الرموز والأنماط ---
const symbolLibrary = {
    'pin': { type: 'svg', path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z', viewBox: '0 0 24 24', defaultColor: '#FF0000', defaultSize: 24 },
    'circle': { type: 'svg', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', viewBox: '0 0 24 24', defaultColor: '#007bff', defaultSize: 16 },
    'square': { type: 'svg', path: 'M3 3h18v18H3z', viewBox: '0 0 24 24', defaultColor: '#28a745', defaultSize: 16 },
    'building': { type: 'svg', path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', viewBox: '0 0 24 24', defaultColor: '#6c757d', defaultSize: 20 },
    'plusSign': { type: 'svg', path: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z', viewBox: '0 0 24 24', defaultColor: '#DC143C', defaultSize: 22 },
    'mosqueDome': { type: 'svg', path: 'M12 2C8.69 2 6 4.69 6 8c0 1.81.72 3.44 1.88 4.62L12 22l4.12-9.38C17.28 11.44 18 9.81 18 8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z', viewBox: '0 0 24 24', defaultColor: '#B8860B', defaultSize: 26 },
    'lightningBolt': { type: 'svg', path: 'M7 2v11h3v9l7-12h-4l4-8z', viewBox: '0 0 24 24', defaultColor: '#FFFF00', defaultSize: 18 },
    'car': { type: 'svg', path: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5S18.33 16 17.5 16zM5 11l1.5-4.5h11L19 11H5z', viewBox: '0 0 24 24', defaultColor: '#FFFF00', defaultSize: 22 },
};

function createFeatureIcon(styleSettings = {}) {
    if (!styleSettings) {
        console.warn("createFeatureIcon called with null or undefined styleSettings. Using default pin.");
        styleSettings = { symbol: 'pin', color: '#CCCCCC', size: 18 };
    }
    if (styleSettings.type === 'text') {
        const divHtml = `<div style="font-size:${styleSettings.size || 16}px; color:${styleSettings.color || 'black'}; background-color:${styleSettings.backgroundColor || 'transparent'}; border:1px solid ${styleSettings.borderColor || 'transparent'}; border-radius:${styleSettings.borderRadius || '3px'}; padding:1px; text-align:center; white-space: nowrap;">${styleSettings.content || '?'}</div>`;
        let iconWidth = (styleSettings.size || 16) * (String(styleSettings.content || '?').length * 0.6) + 8;
        if (String(styleSettings.content).includes('🚦') || String(styleSettings.content).includes('🛑') || String(styleSettings.content).includes('⚠️') || String(styleSettings.content).includes('⛔') || String(styleSettings.content).includes('🅿️')) iconWidth = (styleSettings.size || 16) + 8;
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
        console.warn(`SVG Symbol '${symbolKey || 'undefined'}' not found for style:`, styleSettings, `. Using default pin.`);
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


const detailedStyles = {
    "الصحة والمجال الاجتماعي": {
        displayName: "الصحة والمجال الاجتماعي",
        subcategories: {
            "اجتماعية": { displayName: "اجتماعية", style: { symbol: 'pin', color: '#FF6347', size: 20 } },
            "صحية": { displayName: "صحية", style: { symbol: 'plusSign', color: '#4682B4', size: 22 } },
            "_default_sub_style": { displayName: "(غير محدد)", style: { symbol: 'pin', color: '#FFC0CB', size: 18 } }
        },
        defaultPointStyle: { symbol: 'pin', color: '#FFC0CB', size: 18 }
    },
    "توزيع الماء والكهرباء": {
        displayName: "توزيع الماء والكهرباء",
        subcategories: {
            "مكتب توزيع الماء والكهرباء": { displayName: "مكتب توزيع", style: { symbol: 'building', color: '#ADD8E6', size: 20 } },
            "محطة معالجة المياه": { displayName: "محطة معالجة مياه", style: { symbol: 'circle', color: '#1E90FF', size: 20 } },
            "خزان مياه": { displayName: "خزان مياه", style: { symbol: 'square', color: '#87CEFA', size: 18 } },
            "محول كهرباء": { displayName: "محول كهرباء", style: { symbol: 'lightningBolt', color: '#FFD700', size: 20 } },
            "_default_sub_style": { displayName: "(غير محدد)", style: { symbol: 'pin', color: '#B0E0E6', size: 18 } }
        },
        defaultPointStyle: { symbol: 'pin', color: '#B0E0E6', size: 18 }
    },
    "طبقة المباني": { // تفترض أن هذه مضلعات
        displayName: "طبقة المباني",
        subcategories: {
            "خدماتي": { displayName: "خدماتي", styleConfig: { fillColor: "#BDB76B", color: "#8F8F8C", weight:1, fillOpacity: 0.6 } },
            "سكني": { displayName: "سكني", styleConfig: { fillColor: "#A9A9A9", color: "#7E7E7E", weight:1, fillOpacity: 0.6 } },
            "_default_sub_style": { displayName: "(غير محدد)", styleConfig: { fillColor: '#C0C0C0', color: '#959595', weight:1, fillOpacity: 0.5 } }
        },
        defaultLinePolyStyle: { fillColor: '#C0C0C0', color: '#959595', weight: 1, fillOpacity: 0.5 }
    },
    "محطات الوقود": { /* ... (كما كان, افترض أنها نقاط بسيطة) ... */ displayName: "محطات الوقود", defaultPointStyle: { symbol: 'pin', color: '#FF0000', size: 20 } },
    "التعليم والتكوين وتشغيل الكفاءات": { /* ... (كما كان مع إضافة _default_sub_style) ... */ },
    "التشوير الطرقي": { /* ... (كما كان مع إضافة _default_sub_style) ... */ },
    "الخدمات الدينية": { /* ... (كما كان مع إضافة _default_sub_style) ... */ },
    "النقل": { /* ... (كما كان مع إضافة _default_sub_style) ... */ },
    "الامن والوقاية المدنية": { /* ... (كما كان مع إضافة _default_sub_style) ... */ },
    "المالية والجبايات": { /* ... (كما كان مع إضافة _default_sub_style) ... */ },
    "المرافق التجارية": { /* ... (كما كان, افترض أنها نقاط بسيطة) ... */ displayName: "المرافق التجارية", defaultPointStyle: { symbol: 'circle', color: '#8B4513', size: 18 } },
    "الادارات الترابية": { /* ... (كما كان, افترض أنها نقاط بناء) ... */ displayName: "الإدارات الترابية", defaultPointStyle: { symbol: 'building', color: '#778899', size: 22 } },
    "المرافق الرياضية والترفيهية": { /* ... (كما كان مع إضافة _default_sub_style) ... */ },
    "شبكة الطرق": {
        displayName: "شبكة الطرق",
        subcategories: {
            "طريق رئيسية": { displayName: "طريق رئيسية", styleConfig: { color: "#d95f02", weight: 3.5, opacity: 0.9 } }, // برتقالي داكن
            "طريق ثانوية": { displayName: "طريق ثانوية", styleConfig: { color: "#fdae61", weight: 2.5, opacity: 0.85 } }, // برتقالي فاتح
            "طريق ثلاثية": { displayName: "طريق ثلاثية", styleConfig: { color: "#7570b3", weight: 2, opacity: 0.8 } },    // بنفسجي
            "طريق ريفية": { displayName: "طريق ريفية", styleConfig: { color: "#66a61e", weight: 1.5, dashArray: '4, 4', opacity: 0.75 } }, // أخضر
            "ممر": { displayName: "ممر", styleConfig: { color: "#A9A9A9", weight: 1, opacity: 0.7 } },                 // رمادي داكن
            "ممر مسدود": { displayName: "ممر مسدود", styleConfig: { color: "#FF0000", weight: 1, dashArray: '2, 3', opacity: 0.9 } },
            "ممر الالتفاف": { displayName: "ممر الالتفاف", styleConfig: { color: "#1f78b4", weight: 1.5, opacity: 0.8 } }, // أزرق
            "جسر": { displayName: "جسر", styleConfig: { color: "#333333", weight: 3, lineCap: "butt", opacity: 0.9, dashArray: '1, 5', lineDashOffset: '0' } }, // أسود، مع خطوط قصيرة لإظهار أنه جسر
            "مفترق دوار": { displayName: "مفترق دوار", styleConfig: { color: "#e7298a", weight: 2, opacity: 0.8 } },    // وردي
            "وصلة الخروج من المدارة": { displayName: "وصلة خروج مدارة", styleConfig: { color: "#e6ab02", weight: 1.5, opacity: 0.8 } }, // أصفر داكن/ذهبي
            "وصلة الدخول إلى المدارة": { displayName: "وصلة دخول مدارة", styleConfig: { color: "#e6ab02", weight: 1.5, opacity: 0.8 } },
            "_default_sub_style": { displayName: "طريق (نوع غير محدد)", styleConfig: { color: "#CCCCCC", weight: 1, dashArray: '2,2', opacity: 0.6 } }
        },
        defaultLinePolyStyle: { color: "#BEBEBE", weight: 1.5, opacity: 0.7 }
    },
    "المناطق الخضراء والزراعة": { /* ... (كما كان مع إضافة _default_sub_style للمضلعات) ... */ },
    "أحياء": { /* ... (كما كان) ... */ },
    "حدود إدارية العطاوية": { /* ... (كما كان) ... */ },
    "طبقة غير مصنفة": {
        displayName: "طبقة غير مصنفة",
        defaultPointStyle: { symbol: 'pin', color: '#7f7f7f', size: 16 }, // رمادي
        defaultLinePolyStyle: { color: "#999999", weight: 1.5, dashArray: '3,3', opacity: 0.6 } // رمادي متقطع
    }
};
// التأكد من أن كل طبقة لها أنماط افتراضية إذا لم يتم تعريفها بشكل كامل
Object.keys(detailedStyles).forEach(mainLayerKey => {
    const layerConf = detailedStyles[mainLayerKey];
    if (!layerConf.subcategories) layerConf.subcategories = {};
    if (!layerConf.subcategories["_default_sub_style"]) {
        if (mainLayerKey === "شبكة الطرق" || mainLayerKey === "طبقة المباني" || mainLayerKey === "المناطق الخضراء والزراعة" || mainLayerKey === "أحياء" || mainLayerKey === "حدود إدارية العطاوية") {
            layerConf.subcategories["_default_sub_style"] = { displayName: "(نمط فرعي افتراضي)", styleConfig: { color: "#C0C0C0", weight: 1, opacity: 0.5, fillColor: "#D9D9D9", fillOpacity: 0.4 } };
        } else {
            layerConf.subcategories["_default_sub_style"] = { displayName: "(نمط فرعي افتراضي)", style: { symbol: 'circle', color: '#C0C0C0', size: 12 } };
        }
    }
    if (!layerConf.defaultPointStyle && mainLayerKey !== "شبكة الطرق" && mainLayerKey !== "طبقة المباني" && mainLayerKey !== "المناطق الخضراء والزراعة" && mainLayerKey !== "أحياء" && mainLayerKey !== "حدود إدارية العطاوية") {
        layerConf.defaultPointStyle = { symbol: 'pin', color: '#AAAAAA', size: 14 };
    }
    if (!layerConf.defaultLinePolyStyle && (mainLayerKey === "شبكة الطرق" || mainLayerKey === "طبقة المباني" || mainLayerKey === "المناطق الخضراء والزراعة" || mainLayerKey === "أحياء" || mainLayerKey === "حدود إدارية العطاوية")) {
        layerConf.defaultLinePolyStyle = { color: "#BBBBBB", weight: 1, opacity: 0.6, fillColor: "#E0E0E0", fillOpacity: 0.3 };
    }
});


// 3. دوال مساعدة
function getLayerNameFromProperties(properties) {
    const knownMainLayers = Object.keys(detailedStyles).filter(k => k !== "طبقة غير مصنفة");
    const directPropsToCheck = ['MainCategory', 'LayerGroup', 'اسم_الطبقة_الرئيسي', 'layer_name_principal', 'layer', 'LAYER', 'nom_couche']; // إضافة nom_couche

    if (properties.fclass && typeof properties.fclass === 'string' && properties.fclass.trim() !== "") {
        return "شبكة الطرق";
    }
    const roadLayerNames = ['RESEAU_ROUTIER', 'شبكة الطرق', 'Roads', 'Voirie', 'ROUTES']; // إضافة ROUTES
    if (properties.LAYER && roadLayerNames.includes(String(properties.LAYER).trim().toUpperCase())) { // .toUpperCase() لجعله غير حساس لحالة الأحرف
        return "شبكة الطرق";
    }
    if (properties.layer && roadLayerNames.includes(String(properties.layer).trim().toUpperCase())) {
        return "شبكة الطرق";
    }
     if (properties.اسم_الطبقة && roadLayerNames.includes(String(properties.اسم_الطبقة).trim())) {
        return "شبكة الطرق";
    }


    for (const prop of directPropsToCheck) {
        if (properties[prop]) {
            let propValue = String(properties[prop]).trim();
            if (propValue === "توزيع الماء والكهرباءة") propValue = "توزيع الماء والكهرباء";
            if (propValue === "التشويرالطرقي") propValue = "التشوير الطرقي";
            if (knownMainLayers.includes(propValue)) return propValue;
        }
    }

    const pathString = properties.Path;
    if (pathString && typeof pathString === 'string' && pathString.trim() !== "") {
        const parts = pathString.split(/[\\\/]/);
        const jarmiIndex = parts.findIndex(part => String(part).toLowerCase() === 'jarmi');
        if (jarmiIndex !== -1 && parts.length > jarmiIndex + 1) {
            let potentialName = String(parts[jarmiIndex + 1]).trim();
            if (potentialName === "توزيع الماء والكهرباءة") potentialName = "توزيع الماء والكهرباء";
            if (potentialName === "التشويرالطرقي") potentialName = "التشوير الطرقي";
            if (knownMainLayers.includes(potentialName)) return potentialName;
        }
    }
    // console.log("خصائص معلم غير مصنف (getLayerNameFromProperties):", properties);
    return "طبقة غير مصنفة";
}

function createPopupContent(properties, mainLayerName) {
    const mainLayerDisplayName = (detailedStyles[mainLayerName] && detailedStyles[mainLayerName].displayName) || mainLayerName;
    let content = `<b>${properties.الاسم || properties.name || properties.Nom || properties.NAME || 'معلم'}</b>`;
    content += `<br><small><i>(${mainLayerDisplayName})</i></small>`;

    // محاولة الحصول على اسم الفئة الفرعية من النمط المطبق إذا أمكن (للعرض في ال Popup)
    const mainLayerConfig = detailedStyles[mainLayerName];
    let subCategoryDisplayName = "";
    if (mainLayerConfig && mainLayerConfig.subcategories) {
        const subCategoryPropertyCandidates = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'fclass', 'TYPE_VOIE', 'road_type', 'classification']; // إضافة مرشحين
        for (const propKey of subCategoryPropertyCandidates) {
            if (properties[propKey]) {
                const propValue = String(properties[propKey]).trim();
                if (mainLayerConfig.subcategories[propValue] && mainLayerConfig.subcategories[propValue].displayName) {
                    subCategoryDisplayName = mainLayerConfig.subcategories[propValue].displayName;
                    break;
                }
            }
        }
    }
    if (subCategoryDisplayName) {
        content += `<br><small><i>النوع: ${subCategoryDisplayName}</i></small>`;
    }

    for (const key in properties) {
        if (properties.hasOwnProperty(key) &&
            !['Path', 'derived_main_layer', 'MainCategory', 'LayerGroup', 'OBJECTID', 'X', 'Y', 'Z', 'id',
             'Shape_Length', 'Shape_Area', 'OBJECTID_1', 'layer_name_principal', 'LAYER', 'fclass',
             'الاسم', 'name', 'Nom', 'NAME', // تم تضمينها في العنوان
             'النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'TYPE_VOIE', 'road_type', 'classification' // تم تضمينها في النوع الفرعي
            ].includes(key) &&
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
                console.log("خصائص معلم غير مصنف (بعد getLayerNameFromProperties):", feature.properties);
            } else {
                classifiedNamesFound.add(mainLayerName);
            }

            if (!featuresByMainLayer[mainLayerName]) featuresByMainLayer[mainLayerName] = [];
            featuresByMainLayer[mainLayerName].push(feature);
        });

        console.log(`Total features: ${data.features.length}`);
        console.log(`Number of unclassified features: ${unclassifiedCount}`);
        console.log("Classified layer names found in data:", Array.from(classifiedNamesFound));

        for (const mainLayerName in featuresByMainLayer) {
            if (featuresByMainLayer.hasOwnProperty(mainLayerName)) {
                const layerFeatures = featuresByMainLayer[mainLayerName];
                const mainLayerConfig = detailedStyles[mainLayerName] || detailedStyles["طبقة غير مصنفة"];

                const geoJsonLayerGroup = L.geoJSON(null, {
                    pointToLayer: (feature, latlng) => {
                        const subCategoryPropertyCandidates = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'classification']; // ** عدّل هذه لتناسب بياناتك **
                        let subCategoryName = "_default_sub_style";

                        for (const propKey of subCategoryPropertyCandidates) {
                            if (feature.properties[propKey]) {
                                const propValue = String(feature.properties[propKey]).trim();
                                if (mainLayerConfig.subcategories && mainLayerConfig.subcategories[propValue]?.style) {
                                    subCategoryName = propValue;
                                    break;
                                }
                            }
                        }
                        if (subCategoryName === "_default_sub_style" && !(mainLayerConfig.subcategories && mainLayerConfig.subcategories["_default_sub_style"]?.style)) {
                             const foundPropValue = subCategoryPropertyCandidates.map(k => feature.properties[k]).find(v => v);
                             if (foundPropValue) {
                                console.warn(`Point feature in layer "${mainLayerName}" with sub-category value "${foundPropValue}" (from keys: ${subCategoryPropertyCandidates.join(', ')}) does not have a matching subcategory point style. Using default layer style. Feature properties:`, feature.properties);
                             }
                             // Fallback to layer's default if no _default_sub_style or match
                             return L.marker(latlng, { icon: createFeatureIcon(mainLayerConfig.defaultPointStyle || detailedStyles["طبقة غير مصنفة"].defaultPointStyle) });
                        }

                        let styleInfo = (mainLayerConfig.subcategories && mainLayerConfig.subcategories[subCategoryName]?.style) ||
                                        mainLayerConfig.defaultPointStyle || // Fallback to main layer default
                                        detailedStyles["طبقة غير مصنفة"].defaultPointStyle; // Absolute fallback
                        return L.marker(latlng, { icon: createFeatureIcon(styleInfo) });
                    },
                    style: (feature) => {
                        const currentMainLayerName = feature.properties.derived_main_layer; // Use derived name
                        const currentMainLayerConfig = detailedStyles[currentMainLayerName] || detailedStyles["طبقة غير مصنفة"];

                        if (currentMainLayerName === "شبكة الطرق") {
                            const roadTypePropertyKeys = ['النوع', 'نوع_الطريق', 'road_type', 'fclass', 'TYPE_VOIE', 'classification']; // ** عدّل هذه **
                            let subCategoryName = "_default_sub_style";

                            for (const key of roadTypePropertyKeys) {
                                if (feature.properties[key]) {
                                    const typeValue = String(feature.properties[key]).trim();
                                    if (currentMainLayerConfig.subcategories && currentMainLayerConfig.subcategories[typeValue]?.styleConfig) {
                                        subCategoryName = typeValue;
                                        break;
                                    }
                                }
                            }
                            if (subCategoryName === "_default_sub_style" && !(currentMainLayerConfig.subcategories && currentMainLayerConfig.subcategories["_default_sub_style"]?.styleConfig)) {
                                const foundPropValue = roadTypePropertyKeys.map(k => feature.properties[k]).find(v => v);
                                if (foundPropValue) {
                                   console.warn(`Road type value '${foundPropValue}' (from keys: ${roadTypePropertyKeys.join(', ')}) for feature in "شبكة الطرق" does not have a matching subcategory styleConfig. Using default layer style. Feature properties:`, feature.properties);
                                }
                                return currentMainLayerConfig.defaultLinePolyStyle || detailedStyles["طبقة غير مصنفة"].defaultLinePolyStyle;
                            }
                            return (currentMainLayerConfig.subcategories && currentMainLayerConfig.subcategories[subCategoryName]?.styleConfig) ||
                                   currentMainLayerConfig.defaultLinePolyStyle ||
                                   detailedStyles["طبقة غير مصنفة"].defaultLinePolyStyle;
                        }

                        // For other Line/Polygon layers
                        const subCategoryPropertyCandidates = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'classification']; // ** عدّل هذه **
                        let subCategoryName = "_default_sub_style";

                        for (const propKey of subCategoryPropertyCandidates) {
                            if (feature.properties[propKey]) {
                                const propValue = String(feature.properties[propKey]).trim();
                                 if (currentMainLayerConfig.subcategories && currentMainLayerConfig.subcategories[propValue]?.styleConfig) {
                                    subCategoryName = propValue;
                                    break;
                                }
                            }
                        }
                        if (subCategoryName === "_default_sub_style" && !(currentMainLayerConfig.subcategories && currentMainLayerConfig.subcategories["_default_sub_style"]?.styleConfig)) {
                            const foundPropValue = subCategoryPropertyCandidates.map(k => feature.properties[k]).find(v => v);
                             if (foundPropValue) {
                                console.warn(`Line/Polygon feature in layer "${currentMainLayerName}" with sub-category value "${foundPropValue}" (from keys: ${subCategoryPropertyCandidates.join(', ')}) does not have a matching subcategory line/poly styleConfig. Using default layer style. Feature properties:`, feature.properties);
                             }
                            return currentMainLayerConfig.defaultLinePolyStyle || detailedStyles["طبقة غير مصنفة"].defaultLinePolyStyle;
                        }

                        if (currentMainLayerName === "أحياء" && currentMainLayerConfig.subcategories) {
                            const densityRangeKey = feature.properties. نطاق_الكثافة || feature.properties.density_range;
                            if (densityRangeKey && currentMainLayerConfig.subcategories[densityRangeKey]?.styleConfig) {
                                return currentMainLayerConfig.subcategories[densityRangeKey].styleConfig;
                            }
                        }
                        return (currentMainLayerConfig.subcategories && currentMainLayerConfig.subcategories[subCategoryName]?.styleConfig) ||
                               currentMainLayerConfig.defaultLinePolyStyle ||
                               detailedStyles["طبقة غير مصنفة"].defaultLinePolyStyle;
                    },
                    onEachFeature: (feature, layer) => {
                        layer.bindPopup(createPopupContent(feature.properties, feature.properties.derived_main_layer));
                    }
                });

                geoJsonLayerGroup.addData({ type: "FeatureCollection", features: layerFeatures });
                createdLayers[mainLayerName] = geoJsonLayerGroup;
                const displayNameForControl = mainLayerConfig.displayName || mainLayerName;
                layerControlEntries[displayNameForControl] = geoJsonLayerGroup;

                if (["حدود إدارية العطاوية", "شبكة الطرق", "طبقة المباني"].includes(displayNameForControl)) {
                    geoJsonLayerGroup.addTo(map);
                }
            }
        }

        if (Object.keys(layerControlEntries).length > 0) {
            L.control.layers(null, layerControlEntries, { collapsed: false, position: 'topright' }).addTo(map);
        }
        updateCustomLegend();
        styleLayerControl();
    })
    .catch(error => {
        console.error('Error loading/processing GeoJSON:', error);
        const mapDiv = document.getElementById('map');
        if (mapDiv) {
            mapDiv.innerHTML = `<div style="padding:20px;color:red;text-align:center;"><h3>Error: ${error.message}</h3><p>Please check the console for details.</p></div>`;
        }
    });

// 5. وسيلة إيضاح مخصصة (Custom Legend)
function updateCustomLegend() {
    const legendContainerId = 'custom-legend';
    let legendDiv = document.getElementById(legendContainerId);
    if (!legendDiv) {
        legendDiv = document.createElement('div');
        legendDiv.id = legendContainerId;
        const legendControl = L.control({ position: 'bottomright' });
        legendControl.onAdd = function () { L.DomEvent.disableClickPropagation(legendDiv); return legendDiv; };
        legendControl.addTo(map);
    }
    legendDiv.innerHTML = '<h4>وسيلة الإيضاح</h4>';
    legendDiv.style.cssText = "background-color:white; padding:10px; border:1px solid #ccc; max-height:calc(100vh - 120px); overflow-y:auto; font-size:12px; width: 260px;"; // زدت الارتفاع
    const orderedLayerNames = Object.keys(detailedStyles);

    orderedLayerNames.forEach(mainLayerName => {
        if (detailedStyles.hasOwnProperty(mainLayerName) && mainLayerName !== "طبقة غير مصنفة") {
            const layerConfig = detailedStyles[mainLayerName];
            if (!createdLayers[mainLayerName] || Object.keys(createdLayers[mainLayerName].getLayers()).length === 0) {
                return;
            }

            const mainLayerDiv = document.createElement('div');
            mainLayerDiv.innerHTML = `<strong>${layerConfig.displayName || mainLayerName}</strong>`;
            mainLayerDiv.style.marginTop = '8px';
            legendDiv.appendChild(mainLayerDiv);

            const subcategoriesToShow = [];
            if (layerConfig.subcategories) {
                 Object.keys(layerConfig.subcategories).forEach(subcatKey => {
                    if (subcatKey.startsWith("_default")) return; // لا تعرض الأنماط الافتراضية الداخلية مباشرة

                    let subcategoryHasFeatures = false;
                    if(createdLayers[mainLayerName]) {
                        createdLayers[mainLayerName].eachLayer(l => {
                            const props = l.feature.properties;
                            const subCatPropKeys = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'fclass', 'TYPE_VOIE', 'road_type', 'classification', 'nطاق_الكثافة', 'density_range'];
                            for(const pKey of subCatPropKeys){
                                if(props[pKey] && String(props[pKey]).trim() === subcatKey){
                                    subcategoryHasFeatures = true;
                                    break;
                                }
                            }
                            if(subcategoryHasFeatures) return; // للخروج من eachLayer مبكرا
                        });
                    }
                    if(subcategoryHasFeatures) {
                        subcategoriesToShow.push(subcatKey);
                    }
                });
            }


            if (subcategoriesToShow.length > 0) {
                subcategoriesToShow.forEach(subcatName => {
                    const subcatConfig = layerConfig.subcategories[subcatName];
                    if (!subcatConfig) return;

                    const itemDiv = document.createElement('div');
                    itemDiv.style.cssText = "margin-left:10px; display:flex; align-items:center; margin-bottom:3px;";
                    let iconHtml = '';

                    if (subcatConfig.style) { // للنقاط
                        iconHtml = createFeatureIcon(subcatConfig.style).options.html;
                    } else if (subcatConfig.styleConfig) { // للخطوط والمضلعات
                        const sc = subcatConfig.styleConfig;
                        const isLine = mainLayerName === "شبكة الطرق" || (sc.weight && !sc.fillColor && sc.fillOpacity !== 0); // اعتبرها خط إذا كانت شبكة طرق أو لها وزن وبدون لون تعبئة صريح
                        if (isLine) {
                            if (sc.dashArray) {
                                iconHtml = `<svg width="20" height="10" style="margin-right:5px; vertical-align:middle;"><line x1="0" y1="5" x2="20" y2="5" style="stroke:${sc.color || '#000'}; stroke-width:${sc.weight || 2}; stroke-dasharray:${sc.dashArray.replace(/,/g, ' ')};" /></svg>`;
                            } else {
                                iconHtml = `<span style="display:inline-block; width:16px; height:${Math.max(2, sc.weight || 2)}px; background-color:${sc.color || '#000'}; margin-right:5px; vertical-align:middle;"></span>`;
                            }
                        } else { // للمضلعات
                            iconHtml = `<span style="background-color:${sc.fillColor || 'transparent'}; border: ${sc.weight || 1}px solid ${sc.color || '#000'}; width:16px; height:10px; display:inline-block; margin-right:5px; vertical-align:middle;"></span>`;
                        }
                    }
                    itemDiv.innerHTML = `<span style="display:inline-block; width:22px; height:22px; line-height:22px; text-align:center; margin-right:5px; flex-shrink:0;">${iconHtml || '?'}</span> <span>${subcatConfig.displayName || subcatName}</span>`;
                    legendDiv.appendChild(itemDiv);
                });
            } else if (layerConfig.defaultPointStyle || layerConfig.defaultLinePolyStyle) { // إذا لم تكن هناك فئات فرعية ذات معالم، اعرض النمط الافتراضي للطبقة
                const itemDiv = document.createElement('div');
                itemDiv.style.cssText = "margin-left:10px; display:flex; align-items:center; margin-bottom:3px;";
                let iconHtml = '';
                if (layerConfig.defaultPointStyle) {
                     iconHtml = createFeatureIcon(layerConfig.defaultPointStyle).options.html;
                } else if (layerConfig.defaultLinePolyStyle) {
                    const sc = layerConfig.defaultLinePolyStyle;
                    const isLine = mainLayerName === "شبكة الطرق" || (sc.weight && !sc.fillColor && sc.fillOpacity !== 0);
                    if (isLine) {
                         if (sc.dashArray) {
                            iconHtml = `<svg width="20" height="10" style="margin-right:5px; vertical-align:middle;"><line x1="0" y1="5" x2="20" y2="5" style="stroke:${sc.color || '#000'}; stroke-width:${sc.weight || 2}; stroke-dasharray:${sc.dashArray.replace(/,/g, ' ')};" /></svg>`;
                        } else {
                             iconHtml = `<span style="display:inline-block; width:16px; height:${Math.max(2, sc.weight || 2)}px; background-color:${sc.color || '#000'}; margin-right:5px; vertical-align:middle;"></span>`;
                        }
                    } else {
                         iconHtml = `<span style="background-color:${sc.fillColor || 'transparent'}; border: ${sc.weight || 1}px solid ${sc.color || '#000'}; width:16px; height:10px; display:inline-block; margin-right:5px; vertical-align:middle;"></span>`;
                    }
                }
                itemDiv.innerHTML = `<span style="display:inline-block; width:22px; height:22px; line-height:22px; text-align:center; margin-right:5px; flex-shrink:0;">${iconHtml || '?'}</span> <span><small>(نمط افتراضي للطبقة)</small></span>`;
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
        layerControlElement.style.maxHeight = 'calc(100vh - 40px - 370px)'; // مساحة أقل إذا كانت وسيلة الإيضاح كبيرة
        if (document.getElementById('custom-legend')) { // إذا كانت وسيلة الإيضاح موجودة، قلل ارتفاع متحكم الطبقات
             layerControlElement.style.maxHeight = 'calc(100vh - 40px - ' + (document.getElementById('custom-legend').offsetHeight + 20) + 'px)';
        } else {
            layerControlElement.style.maxHeight = 'calc(100vh - 60px)';
        }

        layerControlElement.style.overflowY = 'auto';
        layerControlElement.style.backgroundColor = 'rgba(255,255,255,0.95)'; // خلفية شبه شفافة
        layerControlElement.style.padding = '10px';
        layerControlElement.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
        layerControlElement.style.fontSize = '13px';
        layerControlElement.style.borderRadius = '5px'; // حواف دائرية
    }
    const layersControlContainer = document.querySelector('.leaflet-control-layers-list');
    if (layersControlContainer) {
        if (!layersControlContainer.querySelector('.leaflet-control-layers-title')) {
            const titleElement = document.createElement('div');
            titleElement.className = 'leaflet-control-layers-title';
            titleElement.innerHTML = '<strong>الطبقات الرئيسية</strong>';
            titleElement.style.cssText = "text-align:center; padding:5px 0 10px 0; border-bottom:1px solid #ccc; margin-bottom:5px; font-weight:bold;";
            layersControlContainer.insertBefore(titleElement, layersControlContainer.firstChild);
        }
    }
}

// 7. CSS إضافي
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
    .custom-svg-div-icon, .custom-text-div-icon {
        background: transparent !important;
        border: none !important;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
    }
    .leaflet-control-layers-list label {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        cursor: pointer;
    }
    .leaflet-control-layers-list label input[type="checkbox"] {
        margin-right: 0;
        margin-left: 8px; /* مسافة أكبر قليلاً */
    }
    .leaflet-control-layers-list label span {
        vertical-align: middle;
    }
    .leaflet-control-layers-expanded {
        padding: 8px 12px !important; /* زيادة padding */
        border-radius: 5px;
    }
    #custom-legend {
        border-radius: 5px;
        box-shadow: 0 1px 5px rgba(0,0,0,0.4);
        background-color: rgba(255,255,255,0.95) !important;
    }
    #custom-legend h4 {
        margin-top:0;
        margin-bottom:10px;
        text-align:center;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
        font-weight: bold;
    }
    #custom-legend strong { /* اسم الطبقة الرئيسية في وسيلة الإيضاح */
        display: block;
        /* border-bottom: 1px solid #eee; */ /* إزالة الخط السفلي من اسم الطبقة */
        margin-bottom: 5px;
        padding-bottom: 3px;
        font-weight: bold; /* تمييز اسم الطبقة */
        color: #333;
    }
    /* Styling scrollbars for webkit browsers */
    .leaflet-control-layers-scrollbar::-webkit-scrollbar, #custom-legend::-webkit-scrollbar {
      width: 8px;
    }
    .leaflet-control-layers-scrollbar::-webkit-scrollbar-track, #custom-legend::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .leaflet-control-layers-scrollbar::-webkit-scrollbar-thumb, #custom-legend::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }
    .leaflet-control-layers-scrollbar::-webkit-scrollbar-thumb:hover, #custom-legend::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
`;
document.head.appendChild(styleSheet);
