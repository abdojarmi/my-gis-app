// ====================================================================================
// GIS SCRIPT FOR ATTAOUIA - V5.1 (Road Network Styling Update)
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
    if (styleSettings.type === 'text') {
        const divHtml = `<div style="font-size:${styleSettings.size || 16}px; color:${styleSettings.color || 'black'}; background-color:${styleSettings.backgroundColor || 'transparent'}; border:1px solid ${styleSettings.borderColor || 'transparent'}; border-radius:${styleSettings.borderRadius || '3px'}; padding:1px; text-align:center; white-space: nowrap;">${styleSettings.content}</div>`;
        let iconWidth = (styleSettings.size || 16) * (String(styleSettings.content).length * 0.6) + 8;
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
    "الصحة والمجال الاجتماعي": { /* ... (كما كان) ... */ },
    "توزيع الماء والكهرباء": { /* ... (كما كان) ... */ },
    "طبقة المباني": { /* ... (كما كان) ... */ },
    "محطات الوقود": { /* ... (كما كان) ... */ },
    "التعليم والتكوين وتشغيل الكفاءات": { /* ... (كما كان) ... */ },
    "التشوير الطرقي": { /* ... (كما كان) ... */ },
    "الخدمات الدينية": { /* ... (كما كان) ... */ },
    "النقل": { /* ... (كما كان) ... */ },
    "الامن والوقاية المدنية": { /* ... (كما كان) ... */ },
    "المالية والجبايات": { /* ... (كما كان) ... */ },
    "المرافق التجارية": { /* ... (كما كان) ... */ },
    "الادارات الترابية": { /* ... (كما كان) ... */ },
    "المرافق الرياضية والترفيهية": { /* ... (كما كان) ... */ },
    // --- تعديل هنا ---
    "شبكة الطرق": {
        displayName: "شبكة الطرق",
        subcategories: {
            "طريق رئيسية": { displayName: "طريق رئيسية", styleConfig: { color: "#000000", weight: 5, opacity: 0.9 } },
            "طريق ثانوية": { displayName: "طريق ثانوية", styleConfig: { color: "#444444", weight: 4, opacity: 0.85 } },
            "طريق ثلاثية": { displayName: "طريق ثلاثية", styleConfig: { color: "#777777", weight: 3, opacity: 0.8 } },
            "طريق ريفية": { displayName: "طريق ريفية", styleConfig: { color: "#999999", weight: 2.5, dashArray: '5, 5', opacity: 0.75 } },
            "ممر": { displayName: "ممر", styleConfig: { color: "#BBBBBB", weight: 2, opacity: 0.7 } },
            "ممر مسدود": { displayName: "ممر مسدود", styleConfig: { color: "#FF0000", weight: 1.5, dashArray: '2, 4', opacity: 0.9 } },
            "ممر الالتفاف": { displayName: "ممر الالتفاف", styleConfig: { color: "#008000", weight: 2, opacity: 0.8 } },
            "جسر": { displayName: "جسر", styleConfig: { color: "#0000CD", weight: 3.5, lineCap: "butt", opacity: 0.9 } }, // زدت weight قليلاً للجسر
            "مفترق دوار": { displayName: "مفترق دوار", styleConfig: { color: "#FFA500", weight: 2.5, opacity: 0.8 } },
            "وصلة الخروج من المدارة": { displayName: "وصلة خروج مدارة", styleConfig: { color: "#DC143C", weight: 2, opacity: 0.8 } },
            "وصلة الدخول إلى المدارة": { displayName: "وصلة دخول مدارة", styleConfig: { color: "#228B22", weight: 2, opacity: 0.8 } },
            // هذا النمط سيستخدم إذا كان نوع الطريق موجودًا في البيانات ولكنه غير مدرج أعلاه
            "_default_sub_style": { displayName: "طريق (نوع غير محدد)", styleConfig: { color: "#E0E0E0", weight: 1.5, dashArray: '3,3', opacity: 0.6 } }
        },
        defaultLinePolyStyle: { color: "#BEBEBE", weight: 2, opacity: 0.7 } // هذا النمط سيُستخدم إذا لم يُعثر على خاصية نوع الطريق أبدًا
    },
    "المناطق الخضراء والزراعة": { /* ... (كما كان) ... */ },
    "أحياء": { /* ... (كما كان) ... */ },
    "حدود إدارية العطاوية": { /* ... (كما كان) ... */ },
    "طبقة غير مصنفة": { /* ... (كما كان) ... */ }
};
Object.entries(detailedStyles).forEach(([key, value]) => { // املأ الأقسام الناقصة
    if(key !== "الصحة والمجال الاجتماعي") value.subcategories = value.subcategories || {};
    if(key !== "الصحة والمجال الاجتماعي") value.defaultPointStyle = value.defaultPointStyle || { symbol: 'pin', color: '#999999', size: 16 };
    if(key !== "الصحة والمجال الاجتماعي") value.defaultLinePolyStyle = value.defaultLinePolyStyle || { color: "#AAAAAA", weight: 2, dashArray: '4,4' };
});


// 3. دوال مساعدة
// --- تعديل هنا ---
function getLayerNameFromProperties(properties) {
    const knownMainLayers = Object.keys(detailedStyles).filter(k => k !== "طبقة غير مصنفة");
    const directPropsToCheck = ['MainCategory', 'LayerGroup', 'اسم_الطبقة_الرئيسي', 'layer_name_principal', 'layer', 'LAYER'];

    // 1. التحقق من معالم الطرق أولاً
    if (properties.fclass && typeof properties.fclass === 'string' && properties.fclass.trim() !== "") {
        // أي معلم له خاصية fclass يعتبر جزءًا من شبكة الطرق
        // التلوين الدقيق حسب نوع الطريق سيتم لاحقًا في دالة style
        return "شبكة الطرق";
    }
    // تحقق من أسماء طبقات محتملة للطرق (عدّل هذه إذا لزم الأمر)
    const roadLayerNames = ['RESEAU_ROUTIER', 'شبكة الطرق', 'Roads', 'Voirie'];
    if (properties.LAYER && roadLayerNames.includes(String(properties.LAYER).trim())) {
        return "شبكة الطرق";
    }
    if (properties.layer && roadLayerNames.includes(String(properties.layer).trim())) {
        return "شبكة الطرق";
    }
    // يمكنك إضافة المزيد من الشروط الخاصة لتحديد طبقة الطرق هنا
    // مثال: if (properties.OBJECTID_1 && String(properties.OBJECTID_1).startsWith("ROUTE_")) return "شبكة الطرق";


    // 2. التحقق من الطبقات الرئيسية الأخرى
    for (const prop of directPropsToCheck) {
        if (properties[prop]) {
            let propValue = String(properties[prop]).trim();
            // تصحيحات لأسماء طبقات شائعة
            if (propValue === "توزيع الماء والكهرباءة") propValue = "توزيع الماء والكهرباء";
            if (propValue === "التشويرالطرقي") propValue = "التشوير الطرقي";

            if (knownMainLayers.includes(propValue)) return propValue;
        }
    }

    // 3. التحقق من خلال خاصية Path
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

    // 4. إذا لم يتم التصنيف
    // console.log("خصائص معلم غير مصنف (getLayerNameFromProperties):", properties); // أبقِ هذا إذا كنت لا تزال ترى معالم غير مصنفة
    return "طبقة غير مصنفة";
}

function createPopupContent(properties, mainLayerName) { /* ... (نفس دالة createPopupContent من الرد السابق، تأكد أنها موجودة) ... */
    let displayName = (detailedStyles[mainLayerName] && detailedStyles[mainLayerName].displayName) || mainLayerName;
    let content = `<b>${properties.الاسم || properties.name || properties.Nom || 'معلم'}</b>`;
    content += `<br><small><i>(${displayName})</i></small>`;
    for (const key in properties) {
        if (properties.hasOwnProperty(key) &&
            !['Path', 'derived_main_layer', 'MainCategory', 'LayerGroup', 'OBJECTID', 'X', 'Y', 'Z', 'id', 'Shape_Length', 'Shape_Area', 'OBJECTID_1', 'layer_name_principal', 'LAYER', 'fclass'].includes(key) && // أضفت fclass هنا إذا كنت لا تريد عرضه
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
            feature.properties.derived_main_layer = mainLayerName; // تخزين الاسم المشتق

            if (mainLayerName === "طبقة غير مصنفة") {
                unclassifiedCount++;
                console.log("خصائص معلم غير مصنف (بعد getLayerNameFromProperties):", feature.properties); // <<< هذا مهم للتشخيص
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
                        const subCategoryNameProp = feature.properties.النوع || feature.properties.SubCategory || feature.properties.type;
                        let subCategoryName = "_default"; // اسم النمط الافتراضي داخل الفئة الفرعية

                        if (mainLayerConfig.subcategories && subCategoryNameProp && mainLayerConfig.subcategories[subCategoryNameProp]) {
                            subCategoryName = subCategoryNameProp;
                        } else if (mainLayerConfig.subcategories && mainLayerConfig.subcategories["_default_sub_style"]){
                            subCategoryName = "_default_sub_style";
                        }

                        let styleInfo = (mainLayerConfig.subcategories && mainLayerConfig.subcategories[subCategoryName]?.style) ||
                                        mainLayerConfig.defaultPointStyle ||
                                        detailedStyles["طبقة غير مصنفة"].defaultPointStyle;
                        return L.marker(latlng, { icon: createFeatureIcon(styleInfo) });
                    },
                    style: (feature) => {
                        // --- تعديل هنا لتطبيق أنماط الطرق الفرعية ---
                        if (mainLayerName === "شبكة الطرق") {
                            // هذه هي أسماء الخصائص المحتملة التي تحتوي على نوع الطريق
                            // ** عدّل هذا إذا كان اسم عمود نوع الطريق في بياناتك مختلفًا **
                            const roadTypePropertyKeys = ['النوع', 'نوع_الطريق', 'road_type', 'fclass', 'TYPE_VOIE'];
                            let subCategoryName = "_default_sub_style"; // نمط افتراضي فرعي داخل شبكة الطرق

                            for (const key of roadTypePropertyKeys) {
                                if (feature.properties[key]) {
                                    const typeValue = String(feature.properties[key]).trim();
                                    if (mainLayerConfig.subcategories && mainLayerConfig.subcategories[typeValue]) {
                                        subCategoryName = typeValue;
                                        break;
                                    }
                                }
                            }

                            // إذا كان subCategoryName لا يزال هو الافتراضي، ولكن تم العثور على قيمة لنوع الطريق
                            // فهذا يعني أن القيمة غير معرفة في subcategories
                            if (subCategoryName === "_default_sub_style") {
                                for (const key of roadTypePropertyKeys) {
                                    if (feature.properties[key]) {
                                        const typeValue = String(feature.properties[key]).trim();
                                        if (!(mainLayerConfig.subcategories && mainLayerConfig.subcategories[typeValue])) {
                                            console.warn(`Road type value '${typeValue}' from property '${key}' (feature in "شبكة الطرق") does not have a matching subcategory style. Using default sub-style. Properties:`, feature.properties);
                                        }
                                        break; // يكفي التحقق من أول خاصية موجودة لنوع الطريق
                                    }
                                }
                            }
                            return (mainLayerConfig.subcategories && mainLayerConfig.subcategories[subCategoryName]?.styleConfig) ||
                                   mainLayerConfig.defaultLinePolyStyle || // احتياطي إذا لم يكن هناك _default_sub_style
                                   detailedStyles["طبقة غير مصنفة"].defaultLinePolyStyle;
                        }
                        // --- نهاية تعديل أنماط الطرق ---

                        // الكود الأصلي للطبقات الأخرى
                        let subCategoryName = "_default_style"; // اسم النمط الافتراضي العام للخطوط والمضلعات
                        const subCategoryNameProp = feature.properties.النوع || feature.properties.SubCategory || feature.properties.type;

                        if (mainLayerConfig.subcategories && subCategoryNameProp && mainLayerConfig.subcategories[subCategoryNameProp]?.styleConfig) {
                             subCategoryName = subCategoryNameProp;
                        } else if (mainLayerConfig.subcategories && mainLayerConfig.subcategories["_default_sub_style"]?.styleConfig) { // استخدام _default_sub_style إذا كان موجودًا
                             subCategoryName = "_default_sub_style";
                        }


                        if (mainLayerName === "أحياء" && mainLayerConfig.subcategories) {
                            const densityRangeKey = feature.properties. نطاق_الكثافة || feature.properties.density_range;
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

                // إضافة طبقات معينة افتراضيًا للخريطة
                if (["حدود إدارية العطاوية", "شبكة الطرق", "طبقة المباني"].includes(displayNameForControl) ||
                    ["حدود إدارية العطاوية", "شبكة الطرق", "طبقة المباني"].includes(mainLayerName)) {
                    geoJsonLayerGroup.addTo(map);
                }
            }
        }

        if (Object.keys(layerControlEntries).length > 0) {
            L.control.layers(null, layerControlEntries, { collapsed: false, position: 'topright' }).addTo(map);
        } else {
            console.warn("No layers were added to the layer control. Check classification logic.");
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
            // تحقق مما إذا كانت الطبقة موجودة بالفعل على الخريطة ولها معالم
            if (!createdLayers[mainLayerName] || Object.keys(createdLayers[mainLayerName].getLayers()).length === 0) {
                return; // تخطي إذا كانت الطبقة فارغة أو غير مضافة
            }

            const mainLayerDiv = document.createElement('div');
            mainLayerDiv.innerHTML = `<strong>${layerConfig.displayName || mainLayerName}</strong>`;
            mainLayerDiv.style.marginTop = '8px';
            legendDiv.appendChild(mainLayerDiv);

            const hasSubcategories = layerConfig.subcategories && Object.keys(layerConfig.subcategories).length > 0;
            const hasDefaultPoint = layerConfig.defaultPointStyle && !layerConfig.defaultPointStyle.symbol?.includes('pin'); // لتجنب عرض الدبوس الافتراضي جدًا
            const hasDefaultLinePoly = layerConfig.defaultLinePolyStyle;

            if (hasSubcategories) {
                for (const subcatName in layerConfig.subcategories) {
                    if (layerConfig.subcategories.hasOwnProperty(subcatName) && subcatName !== "_default_style" && subcatName !== "_default_sub_style") { // لا تعرض الأنماط الافتراضية الداخلية هنا
                        // تحقق مما إذا كان هناك أي معالم تستخدم هذه الفئة الفرعية
                        let subcategoryHasFeatures = false;
                        if (createdLayers[mainLayerName]) {
                            createdLayers[mainLayerName].eachLayer(layer => {
                                const props = layer.feature.properties;
                                const roadTypePropertyKeys = ['النوع', 'نوع_الطريق', 'road_type', 'fclass', 'TYPE_VOIE']; // نفس المفاتيح المستخدمة في style
                                let currentSubcat = "";
                                if (mainLayerName === "شبكة الطرق") {
                                    for (const rKey of roadTypePropertyKeys) {
                                        if (props[rKey] && String(props[rKey]).trim() === subcatName) {
                                            currentSubcat = subcatName;
                                            break;
                                        }
                                    }
                                } else {
                                     currentSubcat = props.النوع || props.SubCategory || props.type;
                                }

                                if (currentSubcat === subcatName) {
                                    subcategoryHasFeatures = true;
                                }
                            });
                        }
                        if (!subcategoryHasFeatures && subcatName !== "_default_style" && subcatName !== "_default_sub_style") continue;


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
            } else if (hasDefaultPoint || hasDefaultLinePoly) { // إذا لم يكن هناك subcategories، اعرض النمط الافتراضي للطبقة
                const itemDiv = document.createElement('div');
                itemDiv.style.cssText = "margin-left:10px; display:flex; align-items:center; margin-bottom:3px;";
                let iconHtml = '';
                if (hasDefaultPoint) iconHtml = createFeatureIcon(layerConfig.defaultPointStyle).options.html;
                else if (hasDefaultLinePoly) {
                    const sc = layerConfig.defaultLinePolyStyle;
                    iconHtml = `<span style="background-color:${sc.fillColor || 'transparent'}; border: ${sc.weight || 1}px solid ${sc.color || '#000'}; width:16px; height:10px; display:inline-block; margin-right:5px; vertical-align:middle;"></span>`;
                }
                itemDiv.innerHTML = `<span style="display:inline-block; width:22px; height:22px; line-height:22px; text-align:center; margin-right:5px; flex-shrink:0;">${iconHtml || '?'}</span> <span><small>(نمط افتراضي للطبقة)</small></span>`;
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
        layerControlElement.style.maxHeight = 'calc(100vh - 100px - 370px)'; // ضبط الارتفاع ليتناسب مع وسيلة الإيضاح
        layerControlElement.style.overflowY = 'auto';
        layerControlElement.style.backgroundColor = 'white';
        layerControlElement.style.padding = '10px';
        layerControlElement.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
        layerControlElement.style.fontSize = '13px';
    }
    const layersControlContainer = document.querySelector('.leaflet-control-layers-list');
    if (layersControlContainer) {
        if (!layersControlContainer.querySelector('.leaflet-control-layers-title')) { // إضافة العنوان مرة واحدة فقط
            const titleElement = document.createElement('div');
            titleElement.className = 'leaflet-control-layers-title'; // لإمكانية التحقق
            titleElement.innerHTML = '<strong>الطبقات الرئيسية</strong>';
            titleElement.style.cssText = "text-align:center; padding:5px 0 10px 0; border-bottom:1px solid #ccc; margin-bottom:5px;";
            layersControlContainer.insertBefore(titleElement, layersControlContainer.firstChild);
        }
    }
}

// 7. CSS إضافي
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = ` /* ... (نفس CSS من الرد السابق، تأكد أنه موجود) ... */
    .custom-svg-div-icon, .custom-text-div-icon { background: transparent !important; border: none !important; display: flex; align-items: center; justify-content: center; line-height: 1; }
    .leaflet-control-layers-list label { display: flex; align-items: center; margin-bottom: 4px; }
    .leaflet-control-layers-list label input[type="checkbox"] { margin-right: 0; margin-left: 6px; } /* تم تعديل margin هنا ليتناسب مع RTL */
    .leaflet-control-layers-list label span { vertical-align: middle; }
    .leaflet-control-layers-expanded { padding: 6px 10px !important; }
    #custom-legend h4 { margin-top:0; margin-bottom:10px; text-align:center; border-bottom: 1px solid #ddd; padding-bottom: 5px;}
    #custom-legend strong { display: block; border-bottom: 1px solid #eee; margin-bottom: 5px; padding-bottom: 3px; }
`;
document.head.appendChild(styleSheet);
