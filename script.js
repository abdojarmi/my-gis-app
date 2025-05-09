// ====================================================================================
// GIS SCRIPT FOR ATTAOUIA - V5 (Comprehensive detailedStyles & Diagnostics)
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
    // ... يمكنك إضافة المزيد من الرموز هنا ...
};

function createFeatureIcon(styleSettings = {}) { /* ... (نفس دالة createFeatureIcon من الرد السابق) ... */
    if (styleSettings.type === 'text') {
        const divHtml = `<div style="font-size:${styleSettings.size || 16}px; color:${styleSettings.color || 'black'}; background-color:${styleSettings.backgroundColor || 'transparent'}; border:1px solid ${styleSettings.borderColor || 'transparent'}; border-radius:${styleSettings.borderRadius || '3px'}; padding:1px; text-align:center; white-space: nowrap;">${styleSettings.content}</div>`;
        let iconWidth = (styleSettings.size || 16) * (String(styleSettings.content).length * 0.6) + 8; // تقدير عرض النص
        if (String(styleSettings.content).includes('🚦') || String(styleSettings.content).includes('🛑') || String(styleSettings.content).includes('⚠️') || String(styleSettings.content).includes('⛔') || String(styleSettings.content).includes('🅿️')) iconWidth = (styleSettings.size || 16) + 8; // عرض ثابت للإيموجي
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
        subcategories: {
            "خدماتي": { displayName: "خدماتي", style: { symbol: 'building', color: "#BDB76B", size: 18 } },
            "سكني": { displayName: "سكني", style: { symbol: 'building', color: "#A9A9A9", size: 18 } }
        },
        defaultPointStyle: { symbol: 'building', color: '#C0C0C0', size: 16 }
    },
    "محطات الوقود": {
        displayName: "محطات الوقود",
        defaultPointStyle: { symbol: 'pin', color: '#FF0000', size: 20 }
    },
    "التعليم والتكوين وتشغيل الكفاءات": {
        displayName: "التعليم والتكوين",
        subcategories: {
            "إدارة تربوية": { displayName: "إدارة تربوية", style: { symbol: 'building', color: '#483D8B', size: 20 } },
            "تعليم أولي": { displayName: "تعليم أولي", style: { symbol: 'circle', color: '#FFD700', size: 16 } },
            "تعليم ابتدائي": { displayName: "تعليم ابتدائي", style: { symbol: 'circle', color: '#90EE90', size: 18 } },
            "تعليم متوسط": { displayName: "تعليم متوسط", style: { symbol: 'circle', color: '#32CD32', size: 18 } },
            "تعليم تأهيلي": { displayName: "تعليم تأهيلي", style: { symbol: 'circle', color: '#008000', size: 20 } },
            "تعليم خصوصي": { displayName: "تعليم خصوصي", style: { symbol: 'square', color: '#8A2BE2', size: 18 } },
            "معهد تقني": { displayName: "معهد تقني", style: { symbol: 'square', color: '#A52A2A', size: 20 } },
            "دعم تشغيل الشباب": { displayName: "دعم تشغيل الشباب", style: { symbol: 'pin', color: '#00CED1', size: 18 } }
        },
        defaultPointStyle: { symbol: 'pin', color: '#DDA0DD', size: 16 }
    },
    "التشوير الطرقي": {
        displayName: "التشوير الطرقي",
        subcategories: {
            "أضواء مرور": { displayName: "أضواء مرور", style: { type: 'text', content: '🚦', size: 18 } },
            "علامة توقف": { displayName: "علامة توقف", style: { type: 'text', content: '🛑', size: 18, color: 'red', backgroundColor: 'white', borderColor: 'red' } },
            "علامة إلزامية": { displayName: "علامة إلزامية", style: { type: 'text', content: '➡️', size: 18, color: 'white', backgroundColor: 'blue', borderColor: 'blue' } },
            "علامة تحديد السرعة": { displayName: "علامة تحديد السرعة", style: { type: 'text', content: '⁶⁰', size: 18, color: 'black', backgroundColor: 'white', borderColor: 'red', borderRadius: '50%'} },
            "علامة تحذير": { displayName: "علامة تحذير", style: { type: 'text', content: '⚠️', size: 18, color: 'black', backgroundColor: 'yellow', borderColor: 'black' } },
            "علامة منع": { displayName: "علامة منع", style: { type: 'text', content: '⛔', size: 18, color: 'white', backgroundColor: 'red', borderRadius: '50%' } },
            "لوحة تشوير مركبة": { displayName: "لوحة تشوير مركبة", style: { symbol: 'square', color: '#4682B4', size: 16 } }
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
        subcategories: {
            "نقطة توقف الحافلات": { displayName: "نقطة توقف الحافلات", style: { symbol: 'pin', color: '#0000FF', size: 20 } },
            "محطة الطاكسيات": { displayName: "محطة الطاكسيات", style: { symbol: 'car', color: '#FFD700', size: 20 } }, // استخدام أيقونة السيارة
            "موقف مؤدى عنه": { displayName: "موقف مؤدى عنه", style: { type: 'text', content: '🅿️', size: 18 } }
        },
        defaultPointStyle: { symbol: 'pin', color: '#FFA500', size: 18 }
    },
    "الامن والوقاية المدنية": {
        displayName: "الأمن والوقاية المدنية",
        subcategories: {
            "مركز شرطة": { displayName: "مركز شرطة", style: { symbol: 'building', color: '#00008B', size: 20 } },
            "مركز أمني": { displayName: "مركز أمني", style: { symbol: 'building', color: '#4169E1', size: 20 } },
            "مركز خدمة الطوارئ": { displayName: "مركز طوارئ", style: { symbol: 'plusSign', color: '#FF4500', size: 22 } },
            "مصلحة الوثائق الوطنية": { displayName: "مصلحة وثائق", style: { symbol: 'building', color: '#2E8B57', size: 18 } }
        },
        defaultPointStyle: { symbol: 'pin', color: '#B22222', size: 18 }
    },
    "المالية والجبايات": {
        displayName: "المالية والجبايات",
        subcategories: {
            "بنك/مؤسسة بريدية": { displayName: "بنك/بريد", style: { symbol: 'building', color: '#FFD700', size: 20 } },
            "إدارة ضمان اجتماعي": { displayName: "ضمان اجتماعي", style: { symbol: 'building', color: '#DA70D6', size: 18 } },
            "إدارة مالية": { displayName: "إدارة مالية", style: { symbol: 'building', color: '#008080', size: 20 } },
            "بنك": { displayName: "بنك", style: { symbol: 'building', color: '#CD853F', size: 20 } }
        },
        defaultPointStyle: { symbol: 'pin', color: '#20B2AA', size: 18 }
    },
    "المرافق التجارية": {
        displayName: "المرافق التجارية",
        defaultPointStyle: { symbol: 'circle', color: '#8B4513', size: 18 }
    },
    "الادارات الترابية": {
        displayName: "الإدارات الترابية",
        defaultPointStyle: { symbol: 'building', color: '#778899', size: 22 }
    },
    "المرافق الرياضية والترفيهية": {
        displayName: "المرافق الرياضية والترفيهية",
        subcategories: {
            "ثقافي وترفيهي": { displayName: "ثقافي وترفيهي", style: { symbol: 'square', color: '#FF69B4', size: 18 } },
            "رياضي/ترفيهي": { displayName: "رياضي/ترفيهي", style: { symbol: 'square', color: '#3CB371', size: 18 } },
            "ثقافي": { displayName: "ثقافي", style: { symbol: 'pin', color: '#BA55D3', size: 18 } },
            "رياضي": { displayName: "رياضي", style: { symbol: 'pin', color: '#4682B4', size: 18 } }
        },
        defaultPointStyle: { symbol: 'pin', color: '#6A5ACD', size: 16 }
    },
    "شبكة الطرق": {
        displayName: "شبكة الطرق",
        subcategories: {
            "طريق رئيسية": { displayName: "طريق رئيسية", styleConfig: { color: "#000000", weight: 5 } },
            "طريق ثانوية": { displayName: "طريق ثانوية", styleConfig: { color: "#444444", weight: 4 } },
            "طريق ثلاثية": { displayName: "طريق ثلاثية", styleConfig: { color: "#777777", weight: 3 } },
            "طريق ريفية": { displayName: "طريق ريفية", styleConfig: { color: "#999999", weight: 2.5, dashArray: '5, 5' } },
            "ممر": { displayName: "ممر", styleConfig: { color: "#BBBBBB", weight: 2 } },
            "ممر مسدود": { displayName: "ممر مسدود", styleConfig: { color: "#FF0000", weight: 1.5, dashArray: '2, 4' } },
            "ممر الالتفاف": { displayName: "ممر الالتفاف", styleConfig: { color: "#008000", weight: 2 } },
            "جسر": { displayName: "جسر", styleConfig: { color: "#0000CD", weight: 3, lineCap: "butt" } },
            "مفترق دوار": { displayName: "مفترق دوار", styleConfig: { color: "#FFA500", weight: 2.5 } },
            "وصلة الخروج من المدارة": { displayName: "وصلة خروج مدارة", styleConfig: { color: "#DC143C", weight: 2 } },
            "وصلة الدخول إلى المدارة": { displayName: "وصلة دخول مدارة", styleConfig: { color: "#228B22", weight: 2 } }
        },
        defaultLinePolyStyle: { color: "#666666", weight: 3 }
    },
    "المناطق الخضراء والزراعة": {
        displayName: "المناطق الخضراء والزراعة",
        subcategories: {
            "المغروسات": { displayName: "المغروسات", styleConfig: { fillColor: "#228B22", color: "#006400", weight: 1, fillOpacity: 0.6 } },
            "المزروعات": { displayName: "المزروعات", styleConfig: { fillColor: "#9ACD32", color: "#6B8E23", weight: 1, fillOpacity: 0.6 } },
            "حديقة عامة": { displayName: "حديقة عامة", styleConfig: { fillColor: "#3CB371", color: "#2E8B57", weight: 1, fillOpacity: 0.7 } },
            "شريط أخضر": { displayName: "شريط أخضر", styleConfig: { fillColor: "#98FB98", color: "#00FA9A", weight: 1, fillOpacity: 0.7 } },
            "منتزه": { displayName: "منتزه", styleConfig: { fillColor: "#00FF7F", color: "#3CB371", weight: 1, fillOpacity: 0.6 } }
        },
        defaultLinePolyStyle: { fillColor: "#ADFF2F", color: "#556B2F", weight: 1, fillOpacity: 0.5 }
    },
    "أحياء": {
        displayName: "أحياء (الكثافة السكانية)",
        subcategories: { // **ستحتاج إلى خاصية في بيانات الأحياء تحتوي على هذه النطاقات أو قيمة الكثافة الفعلية**
            "0- 1168": { displayName: "0-1168 فرد/كم²", styleConfig: { fillColor: "#FFFFCC", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } },
            "1168- 5947": { displayName: "1168-5947 فرد/كم²", styleConfig: { fillColor: "#A1DAB4", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } },
            "5947- 8851": { displayName: "5947-8851 فرد/كم²", styleConfig: { fillColor: "#66C2A5", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } },
            "8851- 11179": { displayName: "8851-11179 فرد/كم²", styleConfig: { fillColor: "#2CA25F", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } },
            "11179- 14469": { displayName: "11179-14469 فرد/كم²", styleConfig: { fillColor: "#006D2C", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } }
        },
        defaultLinePolyStyle: { fillColor: "#F0F0F0", color: "#888888", weight: 1, fillOpacity: 0.6 }
    },
    "حدود إدارية العطاوية": {
        displayName: "حدود إدارية العطاوية",
        defaultLinePolyStyle: { color: "#FF00FF", weight: 3.5, opacity: 0.9, fillOpacity: 0 }
    },
    "طبقة غير مصنفة": {
        displayName: "طبقة غير مصنفة",
        defaultPointStyle: { symbol: 'pin', color: '#999999', size: 16 },
        defaultLinePolyStyle: { color: "#AAAAAA", weight: 2, dashArray: '4,4' }
    }
};

// 3. دوال مساعدة
function getLayerNameFromProperties(properties) { /* ... (نفس دالة getLayerNameFromProperties من الرد السابق، تأكد أنها موجودة) ... */
    const knownMainLayers = Object.keys(detailedStyles).filter(k => k !== "طبقة غير مصنفة");
    const directPropsToCheck = ['MainCategory', 'LayerGroup', 'اسم_الطبقة_الرئيسي', 'layer_name_principal', 'layer', 'LAYER'];

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
    return "طبقة غير مصنفة";
}

function createPopupContent(properties, mainLayerName) { /* ... (نفس دالة createPopupContent من الرد السابق، تأكد أنها موجودة) ... */
    let displayName = (detailedStyles[mainLayerName] && detailedStyles[mainLayerName].displayName) || mainLayerName;
    let content = `<b>${properties.الاسم || properties.name || properties.Nom || 'معلم'}</b>`;
    content += `<br><small><i>(${displayName})</i></small>`;
    for (const key in properties) {
        if (properties.hasOwnProperty(key) &&
            !['Path', 'derived_main_layer', 'MainCategory', 'LayerGroup', 'OBJECTID', 'X', 'Y', 'Z', 'id', 'Shape_Length', 'Shape_Area', 'OBJECTID_1', 'layer_name_principal', 'LAYER'].includes(key) &&
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
                // >>>>> السطر المهم للتشخيص <<<<<
                console.log("خصائص معلم غير مصنف:", feature.properties);
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
                        const subCategoryName = feature.properties.النوع || feature.properties.SubCategory || feature.properties.type || "_default";
                        let styleInfo = (mainLayerConfig.subcategories && mainLayerConfig.subcategories[subCategoryName]?.style) ||
                                        mainLayerConfig.defaultPointStyle ||
                                        detailedStyles["طبقة غير مصنفة"].defaultPointStyle;
                        return L.marker(latlng, { icon: createFeatureIcon(styleInfo) });
                    },
                    style: (feature) => {
                        const subCategoryName = feature.properties.النوع || feature.properties.SubCategory || feature.properties.type || "_default_style";
                        if (mainLayerName === "أحياء" && mainLayerConfig.subcategories) {
                            const densityRangeKey = feature.properties. نطاق_الكثافة || feature.properties.density_range; // افترض أن هذه الخاصية موجودة
                            if (densityRangeKey && mainLayerConfig.subcategories[densityRangeKey]) {
                                return mainLayerConfig.subcategories[densityRangeKey].styleConfig;
                            }
                        }
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
                const displayNameForControl = mainLayerConfig.displayName || mainLayerName;
                layerControlEntries[displayNameForControl] = geoJsonLayerGroup;

                if (["حدود إدارية العطاوية", "شبكة الطرق", "طبقة المباني"].includes(mainLayerConfig.displayName || mainLayerName) ||
                    ["حدود إدارية العطاوية", "شبكة الطرق", "طبقة المباني"].includes(mainLayerName) ) { // تحقق من الاسم الأصلي أيضًا
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
function updateCustomLegend() { /* ... (نفس دالة updateCustomLegend من الرد السابق، تأكد أنها موجودة) ... */
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
    legendDiv.style.cssText = "background-color:white; padding:10px; border:1px solid #ccc; max-height:350px; overflow-y:auto; font-size:12px; width: 260px;";
    const orderedLayerNames = Object.keys(detailedStyles);

    orderedLayerNames.forEach(mainLayerName => {
        if (detailedStyles.hasOwnProperty(mainLayerName) && mainLayerName !== "طبقة غير مصنفة") {
            const layerConfig = detailedStyles[mainLayerName];
            if (!createdLayers[mainLayerName] || createdLayers[mainLayerName].getLayers().length === 0) return;

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
                        if (subcatConfig.style) iconHtml = createFeatureIcon(subcatConfig.style).options.html;
                        else if (subcatConfig.styleConfig) {
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
function styleLayerControl() { /* ... (نفس دالة styleLayerControl من الرد السابق، تأكد أنها موجودة) ... */
    const layerControlElement = document.querySelector('.leaflet-control-layers');
    if (layerControlElement) {
        layerControlElement.style.width = '280px';
        layerControlElement.style.maxHeight = 'calc(100vh - 100px - 370px)';
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
styleSheet.innerText = ` /* ... (نفس CSS من الرد السابق، تأكد أنه موجود) ... */
    .custom-svg-div-icon, .custom-text-div-icon { background: transparent !important; border: none !important; display: flex; align-items: center; justify-content: center; line-height: 1; }
    .leaflet-control-layers-list label { display: flex; align-items: center; margin-bottom: 4px; }
    .leaflet-control-layers-list label input[type="checkbox"] { margin-right: 0; margin-left: 6px; }
    .leaflet-control-layers-list label span { vertical-align: middle; }
    .leaflet-control-layers-expanded { padding: 6px 10px !important; }
    #custom-legend h4 { margin-top:0; margin-bottom:10px; text-align:center; border-bottom: 1px solid #ddd; padding-bottom: 5px;}
    #custom-legend strong { display: block; border-bottom: 1px solid #eee; margin-bottom: 5px; padding-bottom: 3px; }
`;
document.head.appendChild(styleSheet);
