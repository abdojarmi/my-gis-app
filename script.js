// ====================================================================================
// GIS SCRIPT FOR ATTAOUIA - V5.4 (Layout Reorganization)
// ====================================================================================

// انتظر حتى يتم تحميل DOM بالكامل
document.addEventListener('DOMContentLoaded', function() {

        // --- الحصول على عناصر DOM الرئيسية ---
    var mapElement = document.getElementById('map');
    var contactModal = document.getElementById("contactModal");
    var btnContact = document.getElementById("contactBtnHeader");
    var spanClose = document.getElementsByClassName("close-button")[0];

    // --- الحصول على عناصر DOM الخاصة بالتعليقات ---
    var showCommentsBtn = document.getElementById('showCommentsBtn');
    var commentsModal = document.getElementById('commentsModal');
    var closeCommentsModalBtn = document.getElementById('closeCommentsModalBtn');
    var commentForm = document.getElementById('commentForm');
    var commentsListDiv = document.getElementById('comments-list');

    // 1. تهيئة الخريطة
    var map = L.map('map', {
        zoomControl: false
    }).setView([31.83, -7.31], 11);

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
            styleSettings = { symbol: 'pin', color: '#CCCCCC', size: 18 };
        }
        if (styleSettings.type === 'text') {
            const divHtml = `<div style="font-size:${styleSettings.size || 16}px; color:${styleSettings.color || 'black'}; background-color:transparent; border:none; padding:0px; text-align:center; white-space: nowrap;">${styleSettings.content || '?'}</div>`;
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
        "طبقة المباني": { 
            displayName: "طبقة المباني",
            subcategories: {
                "خدماتي": { displayName: "خدماتي", styleConfig: { fillColor: "#BDB76B", color: "#8F8F8C", weight:1, fillOpacity: 0.6 } },
                "سكني": { displayName: "سكني", styleConfig: { fillColor: "#A9A9A9", color: "#7E7E7E", weight:1, fillOpacity: 0.6 } },
                "_default_sub_style": { displayName: "(غير محدد)", styleConfig: { fillColor: '#C0C0C0', color: '#959595', weight:1, fillOpacity: 0.5 } }
            },
            defaultLinePolyStyle: { fillColor: '#C0C0C0', color: '#959595', weight: 1, fillOpacity: 0.5 }
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
                "دعم تشغيل الشباب": { displayName: "دعم تشغيل الشباب", style: { symbol: 'pin', color: '#00CED1', size: 18 } },
                "_default_sub_style": { displayName: "(غير محدد)", style: { symbol: 'pin', color: '#DDA0DD', size: 16 } }
            },
            defaultPointStyle: { symbol: 'pin', color: '#DDA0DD', size: 16 }
        },
        "التشوير الطرقي": {
            displayName: "التشوير الطرقي",
            subcategories: {
                "أضواء مرور": { displayName: "أضواء مرور", style: { type: 'text', content: '🚦', size: 18 } },
                "علامة توقف": { displayName: "علامة توقف", style: { type: 'text', content: '🛑', size: 14, color: 'red' } },
                "علامة إلزامية": { displayName: "علامة إلزامية", style: { type: 'text', content: '➡️', size: 10, color: 'white' } },
                "علامة تحديد السرعة": { displayName: "علامة تحديد السرعة", style: { type: 'text', content: '⁶⁰', size: 14, color: 'black', backgroundColor: 'white', borderColor: 'red', borderRadius: '60%'} },
                "علامة تحذير": { displayName: "علامة تحذير", style: { type: 'text', content: '⚠️', size: 14, color: 'black' } },
                "علامة منع": { displayName: "علامة منع", style: { type: 'text', content: '⛔', size: 14, color: 'white' } },
                "لوحة تشوير مركبة": { displayName: "لوحة تشوير مركبة", style: { symbol: 'square', color: '#4682B4', size: 16 } },
                "_default_sub_style": { displayName: "(غير محدد)", style: { symbol: 'pin', color: '#6495ED', size: 16 } }
            },
            defaultPointStyle: { symbol: 'pin', color: '#6495ED', size: 16 }
        },
        "الخدمات الدينية": {
            displayName: "الخدمات الدينية",
            subcategories: {
                "مسجد": { displayName: "مسجد", style: {symbol: 'mosqueDome', color: '#B8860B', size: 28 } },
                "مصلى": { displayName: "مصلى", style: {symbol: 'square', color: '#F0E68C', size: 18 } },
                "مقبرة": { displayName: "مقبرة", style: {symbol: 'square', color: '#708090', size: 18 } },
                "زاوية": { displayName: "زاوية", style: {symbol: 'pin', color: '#FFD700', size: 22 } },
                "_default_sub_style": { displayName: "(غير محدد)", style: { symbol: 'pin', color: '#DAA520', size: 18 } }
            },
            defaultPointStyle: { symbol: 'pin', color: '#DAA520', size: 18 }
        },
        "النقل": {
            displayName: "النقل",
            subcategories: {
                "نقطة توقف الحافلات": { displayName: "نقطة توقف الحافلات", style: { symbol: 'pin', color: '#0000FF', size: 20 } },
                "محطة الطاكسيات": { displayName: "محطة الطاكسيات", style: { symbol: 'car', color: '#FFD700', size: 20 } },
                "موقف مؤدى عنه": { displayName: "موقف مؤدى عنه", style: { type: 'text', content: '🅿️', size: 18 } },
                "_default_sub_style": { displayName: "(غير محدد)", style: { symbol: 'circle', color: '#FFA500', size: 16 } }
            },
            defaultPointStyle: { symbol: 'pin', color: '#FFA500', size: 18 }
        },
        "الامن والوقاية المدنية": { 
            displayName: "الأمن والوقاية المدنية",
            subcategories: {
                "مركز شرطة": { displayName: "مركز شرطة", style: { symbol: 'building', color: '#00008B', size: 20 } },
                "مركز أمني": { displayName: "مركز أمني", style: { symbol: 'building', color: '#4169E1', size: 20 } },
                "مركز خدمة الطوارئ": { displayName: "مركز طوارئ", style: { symbol: 'plusSign', color: '#FF4500', size: 22 } },
                "مصلحة الوثائق الوطنية": { displayName: "مصلحة وثائق", style: { symbol: 'building', color: '#2E8B57', size: 18 } },
                "_default_sub_style": { displayName: "(غير محدد)", style: { symbol: 'pin', color: '#B22222', size: 18 } }
            },
            defaultPointStyle: { symbol: 'pin', color: '#B22222', size: 18 }
        },
        "المالية والجبايات": {
            displayName: "المالية والجبايات",
            subcategories: {
                "بنك/مؤسسة بريدية": { displayName: "بنك/بريد", style: { symbol: 'building', color: '#FFD700', size: 20 } },
                "إدارة ضمان اجتماعي": { displayName: "ضمان اجتماعي", style: { symbol: 'building', color: '#DA70D6', size: 18 } },
                "إدارة مالية": { displayName: "إدارة مالية", style: { symbol: 'building', color: '#008080', size: 20 } },
                "بنك": { displayName: "بنك", style: { symbol: 'building', color: '#CD853F', size: 20 } },
                "_default_sub_style": { displayName: "(غير محدد)", style: { symbol: 'pin', color: '#20B2AA', size: 18 } }
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
                "رياضي": { displayName: "رياضي", style: { symbol: 'pin', color: '#4682B4', size: 18 } },
                "_default_sub_style": { displayName: "(غير محدد)", style: { symbol: 'pin', color: '#6A5ACD', size: 16 } }
            },
            defaultPointStyle: { symbol: 'pin', color: '#6A5ACD', size: 16 }
        },
        "شبكة الطرق": {
            displayName: "شبكة الطرق",
            subcategories: {
                "طريق رئيسية": { displayName: "طريق رئيسية", styleConfig: { color: "#d95f02", weight: 3.5, opacity: 0.9 } },
                "طريق ثانوية": { displayName: "طريق ثانوية", styleConfig: { color: "#fdae61", weight: 2.5, opacity: 0.85 } },
                // ... (rest of road subcategories)
                "ممر الالتفاف": { displayName: "ممر الالتفاف", styleConfig: { color: "#1f78b4", weight: 1.5, opacity: 0.8 } },
                "جسر": { displayName: "جسر", styleConfig: { color: "#333333", weight: 3, lineCap: "butt", opacity: 0.9, dashArray: '1, 5', lineDashOffset: '0' } },
                "مفترق دوار": { displayName: "مفترق دوار", styleConfig: { color: "#e7298a", weight: 2, opacity: 0.8 } },
                "وصلة الخروج من المدارة": { displayName: "وصلة خروج مدارة", styleConfig: { color: "#e6ab02", weight: 1.5, opacity: 0.8 } },
                "وصلة الدخول إلى المدارة": { displayName: "وصلة دخول مدارة", styleConfig: { color: "#e6ab02", weight: 1.5, opacity: 0.8 } },
                "_default_sub_style": { displayName: "طريق (نوع غير محدد)", styleConfig: { color: "#CCCCCC", weight: 1, dashArray: '2,2', opacity: 0.6 } }
            },
            defaultLinePolyStyle: { color: "#BEBEBE", weight: 1.5, opacity: 0.7 }
        },
        "المناطق الخضراء والزراعة": { 
            displayName: "المناطق الخضراء والزراعة",
            subcategories: {
                "المغروسات": { displayName: "المغروسات", styleConfig: { fillColor: "#228B22", color: "#006400", weight: 1, fillOpacity: 0.6 } },
                "المزروعات": { displayName: "المزروعات", styleConfig: { fillColor: "#9ACD32", color: "#6B8E23", weight: 1, fillOpacity: 0.6 } },
                // ... (rest of green area subcategories)
                "منتزه": { displayName: "منتزه", styleConfig: { fillColor: "#00FF7F", color: "#3CB371", weight: 1, fillOpacity: 0.6 } },
                "_default_sub_style": { displayName: "(غير محدد)", styleConfig: { fillColor: "#ADFF2F", color: "#556B2F", weight: 1, fillOpacity: 0.5 } }
            },
            defaultLinePolyStyle: { fillColor: "#ADFF2F", color: "#556B2F", weight: 1, fillOpacity: 0.5 }
        },
        "أحياء": {
            displayName: "أحياء (الكثافة السكانية)",
            subcategories: {
                // ... (density subcategories)
                "11179- 14469": { displayName: "11179-14469 فرد/كم²", styleConfig: { fillColor: "#006D2C", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } },
                "_default_sub_style": { displayName: "(كثافة غير محددة)", styleConfig: { fillColor: "#F0F0F0", color: "#888888", weight: 1, fillOpacity: 0.6 } }
            },
            defaultLinePolyStyle: { fillColor: "#F0F0F0", color: "#888888", weight: 1, fillOpacity: 0.6 }
        },
        "حدود إدارية العطاوية": { 
            displayName: "حدود إدارية العطاوية",
            defaultLinePolyStyle: { color: "#FF00FF", weight: 3.5, opacity: 0.9, fillOpacity: 0 }
        },
        "طبقة غير مصنفة": {
            displayName: "طبقة غير مصنفة",
            defaultPointStyle: { symbol: 'pin', color: '#7f7f7f', size: 16 },
            defaultLinePolyStyle: { color: "#999999", weight: 1.5, dashArray: '3,3', opacity: 0.6, fillOpacity: 0.2 }
        }
    };
    Object.keys(detailedStyles).forEach(mainLayerKey => {
        const layerConf = detailedStyles[mainLayerKey];
        if (!layerConf.subcategories) layerConf.subcategories = {};
        if (!layerConf.subcategories["_default_sub_style"]) {
            if (["شبكة الطرق", "طبقة المباني", "المناطق الخضراء والزراعة", "أحياء", "حدود إدارية العطاوية"].includes(mainLayerKey)) {
                layerConf.subcategories["_default_sub_style"] = { displayName: "(نمط فرعي افتراضي)", styleConfig: { color: "#C0C0C0", weight: 1, opacity: 0.5, fillColor: "#D9D9D9", fillOpacity: 0.4 } };
            } else {
                layerConf.subcategories["_default_sub_style"] = { displayName: "(نمط فرعي افتراضي)", style: { symbol: 'circle', color: '#C0C0C0', size: 12 } };
            }
        }
        if (!layerConf.defaultPointStyle && !["شبكة الطرق", "طبقة المباني", "المناطق الخضراء والزراعة", "أحياء", "حدود إدارية العطاوية"].includes(mainLayerKey)) {
            layerConf.defaultPointStyle = { symbol: 'pin', color: '#AAAAAA', size: 14 };
        }
        if (!layerConf.defaultLinePolyStyle && ["شبكة الطرق", "طبقة المباني", "المناطق الخضراء والزراعة", "أحياء", "حدود إدارية العطاوية"].includes(mainLayerKey)) {
            layerConf.defaultLinePolyStyle = { color: "#BBBBBB", weight: 1, opacity: 0.6, fillColor: "#E0E0E0", fillOpacity: 0.3 };
        }
    });

    function getLayerNameFromProperties(properties) {
        const knownMainLayers = Object.keys(detailedStyles).filter(k => k !== "طبقة غير مصنفة");
        const featureId = properties.OBJECTID || properties.id || properties.ID || properties.temp_id_for_debug || 'UnknownID';

        console.log(`[CLASSIFYING FEATURE] ID: ${featureId}, Properties:`, JSON.parse(JSON.stringify(properties)));

        const checkLayer = (targetLayerName, propKeysForExactMatch, keywordMap = {}, pathCheck = true, geometryTypeCheck = null) => {
            for (const key of propKeysForExactMatch) {
                if (properties[key] && String(properties[key]).trim() === targetLayerName) {
                    console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched '${targetLayerName}' via exact property '${key}'='${properties[key]}'`);
                    return targetLayerName;
                }
            }
            if (pathCheck && properties.Path && typeof properties.Path === 'string') {
                const pathSegments = properties.Path.split(/[\\\/]/);
                if (pathSegments.some(segment => String(segment).trim() === targetLayerName)) {
                    console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched '${targetLayerName}' via path segment.`);
                    return targetLayerName;
                }
                const jarmiIndex = pathSegments.findIndex(part => String(part).toLowerCase() === 'jarmi');
                if (jarmiIndex !== -1 && pathSegments.length > jarmiIndex + 1) {
                    if (String(pathSegments[jarmiIndex + 1]).trim() === targetLayerName) {
                        console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched '${targetLayerName}' via jarmi/path structure.`);
                        return targetLayerName;
                    }
                }
            }
            for (const propName in keywordMap) {
                if (properties[propName]) {
                    const propValue = String(properties[propName]).toLowerCase().trim();
                    for (const keyword of keywordMap[propName]) {
                        if (propValue.includes(keyword.toLowerCase())) {
                            if (geometryTypeCheck) {
                                if (properties.geometry && geometryTypeCheck.some(type => properties.geometry.type.includes(type))) {
                                    console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched '${targetLayerName}' via keyword '${keyword}' in prop '${propName}' (Geom check: ${geometryTypeCheck.join('/')} passed).`);
                                    return targetLayerName;
                                } else {
                                     console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Keyword match for '${targetLayerName}' ('${keyword}' in '${propName}') but FAILED geometry check (expected ${geometryTypeCheck.join('/')}, got ${properties.geometry ? properties.geometry.type : 'N/A'}).`);
                                }
                            } else {
                                console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched '${targetLayerName}' via keyword '${keyword}' in property '${propName}'.`);
                                return targetLayerName;
                            }
                        }
                    }
                }
            }
            return null;
        };

        const directMatchPropKeys = ['MainCategory', 'LayerGroup', 'اسم_الطبقة_الرئيسي', 'layer_name_principal', 'layer', 'LAYER', 'nom_couche', 'Name', 'NAME', 'اسم_الطبقة'];
        let result;

        // PRIORITIZE PROBLEMATIC LAYERS MENTIONED BY USER
        const layerChecks = [
            // Problematic Layers First
            { name: "حدود إدارية العطاوية", keys: directMatchPropKeys, keywords: { 
                'type': ["administrative", "boundary"], 'TYPE': ["administrative", "boundary"], 'fclass': ["administrative", "boundary"], 'الوصف': ["حدود إدارية", "حدود"], 'Name': ["حدود"], 'LAYER': ["حدود"], 'layer_name': ["حدود"], 'categorie': ["limite", "boundary"]
            }, geomCheck: ["LineString", "Polygon"]},
            { name: "المناطق الخضراء والزراعة", keys: directMatchPropKeys, keywords: {
                'type': ["green_area", "park", "farmland", "agriculture", "garden", "vegetation"], 'fclass': ["park", "farmland", "forest", "grass", "meadow", "scrub", "heath"], 'landuse': ["farmland", "forest", "grass", "meadow", "orchard", "vineyard", "greenfield", "recreation_ground", "cemetery"], 'النوع': ["زراعة", "خضراء", "حديقة", "منتزه", "مغروسات", "مزروعات"], 'natural': ['wood', 'tree_row', 'grassland', 'scrub']
            }, geomCheck: ["Polygon", "MultiPolygon"]},
            { name: "طبقة المباني", keys: directMatchPropKeys, keywords: {
                 'fclass': ["building", "construction"], 'type': ["building", "construction"], 'النوع': ["مبنى", "بناية", "سكن", "خدمات"]
            }}, // building:true/yes check is separate below
            { name: "محطات الوقود", keys: directMatchPropKeys, keywords: {
                'amenity': ["fuel", "filling_station"], 'shop': ["fuel"], 'النوع': ["وقود", "محطة بنزين", "بنزين"], 'name': ["وقود", "بنزين", "غاز", "station", "fuel"], 'building':["fuel_station"]
            }},
            { name: "المرافق الرياضية والترفيهية", keys: directMatchPropKeys, keywords: {
                'leisure': ["pitch", "stadium", "sports_centre", "playground", "park", "garden", "track", "fitness_centre", "swimming_pool", "sports_hall", "miniature_golf", "golf_course", "ice_rink", "water_park", "dog_park", "nature_reserve"], 
                'sport': ["soccer", "basketball", "tennis", "swimming", "athletics", "football", "golf", "equestrian", "multi"], 
                'amenity': ["theatre", "cinema", "community_centre", "arts_centre", "nightclub", "social_club", "conference_centre"], 
                'tourism': ["theme_park", "zoo", "picnic_site", "attraction"],
                'النوع': ["رياضة", "ترفيه", "ملعب", "مسبح", "ثقافي", "مسرح", "نادي", "حديقة ترفيهية", "منتزه"]
            }},
             // شبكة الطرق - specific keywords first
            { name: "شبكة الطرق", keys: directMatchPropKeys, keywords: { 
                'highway': ['residential', 'primary', 'secondary', 'tertiary', 'unclassified', 'service', 'track', 'path', 'road', 'living_street', 'pedestrian', 'footway', 'cycleway', 'motorway', 'trunk', 'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link'], 
                'fclass': ['primary', 'secondary', 'tertiary', 'residential', 'service', 'track', 'path', 'unclassified_road', 'motorway', 'trunk', 'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link'],
                'النوع': ['طريق', 'مسلك', 'ممر', 'زنقة', 'شارع', 'جسر']
            }, geomCheck: ["LineString", "MultiLineString"]},


            // Other Layers
            { name: "التعليم والتكوين وتشغيل الكفاءات", keys: directMatchPropKeys, keywords: {
                'amenity': ["school", "college", "university", "kindergarten", "training", "research_institute", "language_school", "music_school"], 'building': ["school", "college", "university", "kindergarten"], 'النوع': ["تعليم", "مدرسة", "جامعة", "معهد", "تكوين", "روضة", "ثانوية", "اعدادية", "ابتدائي"], 'categorie': ["education", "enseignement"]
            }},
            { name: "الامن والوقاية المدنية", keys: directMatchPropKeys, keywords: {
                'amenity': ["police", "fire_station", "emergency_service", "rescue_station"], 'building': ["police", "fire_station"], 'النوع': ["امن", "شرطة", "وقاية مدنية", "اطفاء", "طوارئ", "درك"], 'emergency': ["yes", "designated", "assembly_point"]
            }},
            { name: "الادارات الترابية", keys: directMatchPropKeys, keywords: {
                'amenity': ["townhall", "public_building", "government", "courthouse", "community_centre"], 'office': ["government", "administrative", "ngo"], 'النوع': ["ادارة", "ترابية", "جماعة", "عمالة", "قيادة", "بلدية", "محكمة", "مصلحة"]
            }},
            { name: "الصحة والمجال الاجتماعي", keys: directMatchPropKeys, keywords: {'amenity': ['hospital', 'clinic', 'doctors', 'dentist', 'pharmacy', 'social_facility', 'nursing_home', 'veterinary', 'childcare'], 'النوع': ['صحة', 'مستشفى', 'اجتماعي', 'صيدلية', 'مستوصف']} },
            { name: "توزيع الماء والكهرباء", keys: directMatchPropKeys, keywords: {'power': ['substation', 'transformer', 'plant', 'generator', 'line', 'cable'], 'man_made': ['water_tower', 'reservoir', 'pipeline', 'water_works', 'pump'], 'utility':['water', 'power', 'electricity'], 'النوع': ['ماء', 'كهرباء', 'توزيع', 'محول', 'خزان']} },
            { name: "التشوير الطرقي", keys: directMatchPropKeys, keywords: {'highway': ['traffic_signals', 'stop', 'give_way', 'crossing', 'mini_roundabout', 'speed_camera'], 'traffic_sign': ['*'], 'النوع': ['تشوير', 'علامة', 'اضواء']} },
            { name: "الخدمات الدينية", keys: directMatchPropKeys, keywords: {'amenity': ['place_of_worship', 'crematorium', 'grave_yard'], 'religion': ['muslim', 'christian', 'jewish', 'buddhist', 'hindu', 'sikh', 'taoist'], 'building': ['mosque', 'church', 'synagogue', 'temple', 'chapel', 'cathedral'], 'landuse':['cemetery', 'religious'], 'النوع': ['ديني', 'مسجد', 'كنيسة', 'مصلى', 'مقبرة', 'زاوية']} },
            { name: "النقل", keys: directMatchPropKeys, keywords: {'amenity': ['bus_station', 'taxi_rank', 'parking', 'ferry_terminal', 'car_rental', 'bicycle_parking', 'bicycle_rental'], 'public_transport': ['station', 'stop_position', 'platform', 'stop_area'], 'railway':['station', 'halt', 'tram_stop'], 'building':['train_station', 'transportation'], 'النوع': ['نقل', 'محطة', 'موقف', 'طاكسي', 'حافلة']} },
            { name: "المالية والجبايات", keys: directMatchPropKeys, keywords: {'amenity': ['bank', 'atm', 'post_office', 'bureau_de_change', 'payment_terminal', 'money_transfer'], 'office': ['insurance', 'tax', 'accountant', 'financial_advisor'], 'النوع': ['مالية', 'بنك', 'بريد', 'ضرائب', 'جبايات', 'تامين']} },
            { name: "المرافق التجارية", keys: directMatchPropKeys, keywords: {'shop': ['*'], 'amenity':['marketplace', 'restaurant', 'cafe', 'fast_food', 'bar', 'pub', 'food_court', 'ice_cream', 'marketplace', 'vending_machine'], 'tourism':['hotel', 'motel', 'guest_house', 'hostel', 'camp_site', 'chalet', 'alpine_hut', 'apartment', 'information'], 'النوع': ['تجاري', 'سوق', 'متجر', 'مطعم', 'مقهى', 'فندق']} }, // '*' as wildcard
            { name: "أحياء", keys: directMatchPropKeys, keywords: {'landuse': ['residential'], 'place': ['neighbourhood', 'suburb', 'quarter', 'locality', 'hamlet', 'isolated_dwelling'], 'النوع': ['حي سكني', 'حي', 'تجمع سكني', 'دوار']} }
        ];

        for (const check of layerChecks) {
            result = checkLayer(check.name, check.keys, check.keywords, true, check.geomCheck);
            if (result) {
                console.log(`[CLASSIFICATION_FINAL] Feature ID ${featureId}: Classified as '${result}' by specific layer check for '${check.name}'.`);
                return result;
            }
        }
        
        // Specific fallbacks for building (if not caught by explicit "طبقة المباني" check)
        if (properties.hasOwnProperty('building') && properties.building && String(properties.building).trim() !== "" && String(properties.building).trim().toLowerCase() !== "no") {
             // Avoid classifying things like 'building:entrance' as the main building layer if a more specific rule exists
            if (!result) { // Only if not already classified
                console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched 'طبقة المباني' via generic 'building' property ('${properties.building}').`);
                return "طبقة المباني";
            }
        }
        if (properties.fclass && String(properties.fclass).toLowerCase().trim() === "building") {
            if (!result) {
                console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched 'طبقة المباني' via fclass='building'.`);
                return "طبقة المباني";
            }
        }
        
        // Fallback for 'شبكة الطرق' if not caught by specific keywords but has a known OSM road fclass/highway value
        // This should be one of the last checks before generic path and unclassified
        const commonRoadTags = { ...properties.fclass && {'fclass': [properties.fclass]}, ...properties.highway && {'highway': [properties.highway]} };
        if (Object.keys(commonRoadTags).length > 0) {
            const roadCheckResult = checkLayer("شبكة الطرق", [], commonRoadTags, false, ["LineString", "MultiLineString"]);
            if (roadCheckResult) {
                 console.log(`[CLASSIFICATION_FINAL] Feature ID ${featureId}: Classified as 'شبكة الطرق' by fallback OSM road tag check.`);
                return roadCheckResult;
            }
        }
        
        // Typo corrections in Path as a very final generic check
        if (properties.Path && typeof properties.Path === 'string') {
            const parts = properties.Path.split(/[\\\/]/);
            const jarmiIndex = parts.findIndex(part => String(part).toLowerCase() === 'jarmi');
            if (jarmiIndex !== -1 && parts.length > jarmiIndex + 1) {
                let potentialName = String(parts[jarmiIndex + 1]).trim();
                if (potentialName === "توزيع الماء والكهرباءة") potentialName = "توزيع الماء والكهرباء";
                if (potentialName === "التشويرالطرقي") potentialName = "التشوير الطرقي";
                if (knownMainLayers.includes(potentialName)) {
                    console.log(`[CLASSIFICATION_FINAL] Feature ID ${featureId}: Classified as '${potentialName}' via jarmi/path (with typo correction).`);
                    return potentialName;
                }
            }
        }

        console.warn(`[UNCLASSIFIED_FINAL] Feature ID ${featureId} fell into 'طبقة غير مصنفة'. Properties:`, JSON.parse(JSON.stringify(properties)));
        return "طبقة غير مصنفة";
    }

    function createPopupContent(properties, mainLayerName) {
        const mainLayerDisplayName = (detailedStyles[mainLayerName] && detailedStyles[mainLayerName].displayName) || mainLayerName;
        let content = `<b>${properties.الاسم || properties.name || properties.Nom || properties.NAME || 'معلم'}</b>`;
        content += `<br><small><i>(${mainLayerDisplayName})</i></small>`;
        if (mainLayerName === "طبقة غير مصنفة") { // Add a hint for unclassified features
            content += `<br><small style="color:orange;"><i>(يرجى مراجعة خصائص هذا المعلم في الكونسول للمساعدة في تصنيفه بشكل صحيح)</i></small>`;
        }


        const mainLayerConfig = detailedStyles[mainLayerName];
        let subCategoryDisplayName = "";
        if (mainLayerConfig && mainLayerConfig.subcategories) {
            const subCategoryPropertyCandidates = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'fclass', 'TYPE_VOIE', 'road_type', 'classification', 'amenity', 'shop', 'leisure', 'building', 'landuse', 'power', 'man_made', 'highway', 'traffic_sign', 'religion', 'public_transport', 'office', 'place', 'emergency', 'sport', 'tourism', 'natural', 'utility', 'railway'];
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
            content += `<br><small><i>النوع الفرعي: ${subCategoryDisplayName}</i></small>`;
        }

        const excludedKeys = ['Path', 'derived_main_layer', 'MainCategory', 'LayerGroup', 'OBJECTID', 'X', 'Y', 'Z', 'id', 'ID', 'temp_id_for_debug', 'geometry',
            'Shape_Length', 'Shape_Area', 'OBJECTID_1', 'layer_name_principal', 'LAYER', 'fclass',
            'الاسم', 'name', 'Nom', 'NAME', 'nom',
            'النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'TYPE_VOIE', 'road_type', 'classification',
            'amenity', 'shop', 'leisure', 'building', 'power', 'man_made', 'highway', 'traffic_sign', 'religion',
            'public_transport', 'office', 'landuse', 'place', 'emergency', 'sport', 'tourism', 'natural', 'utility', 'railway', 'categorie', 'الوصف', 'layer_name' // Exclude more common classification keys
        ];

        for (const key in properties) {
            if (properties.hasOwnProperty(key) && !excludedKeys.includes(key) &&
                properties[key] !== null && String(properties[key]).trim() !== "" && String(properties[key]).trim() !== " ") {
                let displayKey = key.replace(/_/g, ' ');
                displayKey = displayKey.charAt(0).toUpperCase() + displayKey.slice(1);
                content += `<br><b>${displayKey}:</b> ${properties[key]}`;
            }
        }
        return content;
    }

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

            data.features.forEach((feature, index) => {
                if (!feature.properties) feature.properties = {};
                if (!feature.properties.OBJECTID && !feature.properties.id && !feature.properties.ID) {
                    feature.properties.temp_id_for_debug = `feature_${index}`;
                }
                if (feature.geometry && !feature.properties.geometry) { 
                    feature.properties.geometry = { type: feature.geometry.type };
                }

                const mainLayerName = getLayerNameFromProperties(feature.properties);
                feature.properties.derived_main_layer = mainLayerName;

                if (mainLayerName === "طبقة غير مصنفة") {
                    unclassifiedCount++;
                } else {
                    classifiedNamesFound.add(mainLayerName);
                }

                if (!featuresByMainLayer[mainLayerName]) featuresByMainLayer[mainLayerName] = [];
                featuresByMainLayer[mainLayerName].push(feature);
            });

            console.log(`Total features processed: ${data.features.length}`);
            console.log(`Number of features classified as 'طبقة غير مصنفة': ${unclassifiedCount}`);
            console.log("Correctly classified layer names found in data:", Array.from(classifiedNamesFound));
            
            Object.keys(detailedStyles).filter(k => k !== "طبقة غير مصنفة").forEach(expectedLayer => {
                if (!classifiedNamesFound.has(expectedLayer)) {
                    console.warn(`Expected layer '${expectedLayer}' was NOT found among classified features. Please check 'getLayerNameFromProperties' and your GeoJSON data for features belonging to this layer.`);
                }
            });

            for (const mainLayerName in featuresByMainLayer) {
                if (featuresByMainLayer.hasOwnProperty(mainLayerName)) {
                    const layerFeatures = featuresByMainLayer[mainLayerName];
                    const mainLayerConfig = detailedStyles[mainLayerName] || detailedStyles["طبقة غير مصنفة"];

                    const geoJsonLayerGroup = L.geoJSON(null, {
                        pointToLayer: (feature, latlng) => {
                            const subCategoryPropertyCandidates = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'classification', 'amenity', 'shop', 'leisure', 'building'];
                            let subCategoryName = "_default_sub_style";
                            if (mainLayerConfig.subcategories) {
                                for (const propKey of subCategoryPropertyCandidates) {
                                    if (feature.properties[propKey]) {
                                        const propValue = String(feature.properties[propKey]).trim();
                                        if (mainLayerConfig.subcategories[propValue]?.style) {
                                            subCategoryName = propValue;
                                            break;
                                        }
                                    }
                                }
                            }
                            let styleInfo = (mainLayerConfig.subcategories && mainLayerConfig.subcategories[subCategoryName]?.style) || mainLayerConfig.defaultPointStyle || detailedStyles["طبقة غير مصنفة"].defaultPointStyle;
                            return L.marker(latlng, { icon: createFeatureIcon(styleInfo) });
                        },
                        style: (feature) => {
                            const currentMainLayerName = feature.properties.derived_main_layer;
                            const currentMainLayerConfig = detailedStyles[currentMainLayerName] || detailedStyles["طبقة غير مصنفة"];
                            const subCategoryPropertyCandidates = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'classification', 'fclass', 'amenity', 'shop', 'leisure', 'building', 'landuse', 'power', 'man_made', 'highway', 'traffic_sign', 'religion', 'public_transport', 'office', 'place', 'emergency', 'sport', 'tourism', 'natural', 'utility', 'railway'];
                            let subCategoryName = "_default_sub_style";

                            if (currentMainLayerConfig.subcategories) {
                                for (const propKey of subCategoryPropertyCandidates) {
                                    if (feature.properties[propKey]) {
                                        const propValue = String(feature.properties[propKey]).trim();
                                        if (currentMainLayerConfig.subcategories[propValue]?.styleConfig) {
                                            subCategoryName = propValue;
                                            break;
                                        }
                                    }
                                }
                            }
                            let styleConfigToUse = (currentMainLayerConfig.subcategories && currentMainLayerConfig.subcategories[subCategoryName]?.styleConfig) || currentMainLayerConfig.defaultLinePolyStyle || detailedStyles["طبقة غير مصنفة"].defaultLinePolyStyle;
                            return styleConfigToUse;
                        },
                        onEachFeature: (feature, layer) => {
                            layer.bindPopup(createPopupContent(feature.properties, feature.properties.derived_main_layer));
                        }
                    });

                    geoJsonLayerGroup.addData({ type: "FeatureCollection", features: layerFeatures });
                    createdLayers[mainLayerName] = geoJsonLayerGroup;
                    const displayNameForControl = mainLayerConfig.displayName || mainLayerName;
                    layerControlEntries[displayNameForControl] = geoJsonLayerGroup;

                    if (["حدود إدارية العطاوية", "شبكة الطرق", "طبقة المباني", "طبقة غير مصنفة"].includes(mainLayerName) ||
                        ["حدود إدارية العطاوية", "شبكة الطرق", "طبقة المباني", "طبقة غير مصنفة"].includes(displayNameForControl) ) {
                        geoJsonLayerGroup.addTo(map);
                    }
                }
            }

            const layersControlContainer = document.getElementById('layers-control-container');
            const leftControlsArea = document.getElementById('left-controls-area');

            if (Object.keys(layerControlEntries).length > 0 && layersControlContainer) {
                const layersControl = L.control.layers(null, layerControlEntries, {
                    collapsed: false,
                });
                layersControl.addTo(map); 
                const layersControlElement = layersControl.getContainer();
                if (layersControlElement) {
                    layersControlContainer.appendChild(layersControlElement);
                }
                styleLayerControl(); 
                makeLayerControlScrollable(); // Make it scrollable
            }

            if (leftControlsArea) {
                const zoomControl = L.control.zoom({ position: 'topleft' });
                zoomControl.addTo(map);
                const zoomElement = zoomControl.getContainer();
                if (zoomElement) {
                    if (leftControlsArea.firstChild) {
                        leftControlsArea.insertBefore(zoomElement, leftControlsArea.firstChild);
                    } else {
                        leftControlsArea.appendChild(zoomElement);
                    }
                }
                updateCustomLegend(leftControlsArea);
            }

    // PDF EXPORT and OTHER MODAL/FORM LOGIC (UNCHANGED FROM PREVIOUS GOOD VERSION)
    // ... (The rest of the script for PDF export, contact modal, comments modal remains the same)
    // =============================================================
    // == كود إخراج الخريطة إلى PDF (النسخة المنقحة والموحدة) ==
    // =============================================================
    const exportButton = document.getElementById('exportPdfButton');
    const legendElementForPdf = document.getElementById('custom-legend'); 
    if (exportButton && mapElement && legendElementForPdf) {
        exportButton.addEventListener('click', function () {
            if (typeof html2canvas === 'undefined') { /* ... */ return; }
            if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') { /* ... */ return; }
            exportButton.disabled = true; /* ... */
            const originalButtonHtml = exportButton.innerHTML;
            exportButton.innerHTML = `... جارٍ الإعداد ...`;
            const zoomControlElement = map.getContainer().querySelector('.leaflet-control-zoom');
            const layersControlElementFromContainer = document.querySelector('#layers-control-container .leaflet-control-layers');
            const directLayersControlElement = map.getContainer().querySelector('.leaflet-control-layers:not(#layers-control-container .leaflet-control-layers)');
            if (zoomControlElement) zoomControlElement.style.visibility = 'hidden';
            if (layersControlElementFromContainer) layersControlElementFromContainer.style.visibility = 'hidden';
            if (directLayersControlElement) directLayersControlElement.style.visibility = 'hidden';

            setTimeout(() => {
                const canvasOptions = { /* ... */ 
                    onclone: (clonedDocument) => { /* ... hide controls in clone ... */ }
                };
                Promise.all([
                    html2canvas(mapElement, canvasOptions),
                    html2canvas(legendElementForPdf, { ...canvasOptions, scale: 1 })
                ]).then(function ([mapCanvas, legendCanvas]) {
                    /* ... (rest of PDF generation logic) ... */
                    exportButton.disabled = false; exportButton.innerHTML = originalButtonHtml;
                }).catch(function(error) {
                    /* ... (error handling and restore controls visibility) ... */
                    exportButton.disabled = false; exportButton.innerHTML = originalButtonHtml;
                });
            }, 150);
        });
    } else { /* ... console.error for missing PDF elements ... */ }

    const exportDataBtn = document.getElementById('export-data-btn'); 
    if (exportDataBtn) { exportDataBtn.addEventListener('click', () => alert('سيتم تنفيذ وظيفة إخراج البيانات هنا!'));}
    })
    .catch(error => { /* ... console.error for GeoJSON loading ... */ });

    function updateCustomLegend(containerElement) { /* ... (unchanged) ... */ 
        const legendContainerId = 'custom-legend'; 
        let legendDiv = document.getElementById(legendContainerId);
        if (!legendDiv) { /* ... create legendDiv ... */ }
        legendDiv.innerHTML = '<h4>وسيلة الإيضاح</h4>';
        const orderedLayerNames = Object.keys(detailedStyles);
        orderedLayerNames.forEach(mainLayerName => {
            if (detailedStyles.hasOwnProperty(mainLayerName) && mainLayerName !== "طبقة غير مصنفة") {
                // ... (rest of legend generation logic from previous correct version) ...
            }
        });
    }

    function styleLayerControl() { /* ... (unchanged) ... */ }
    
    function makeLayerControlScrollable() {
        const layersControlElement = document.querySelector('#layers-control-container .leaflet-control-layers');
        if (layersControlElement) {
            const layersList = layersControlElement.querySelector('.leaflet-control-layers-list');
            if (layersList) {
                layersList.style.maxHeight = '75vh'; // Adjust as needed
                layersList.style.overflowY = 'auto';
                console.log("Applied scrollable style to layer control list.");
            } else {
                console.warn("Layer control list (.leaflet-control-layers-list) not found for scrolling.");
            }
        } else {
            console.warn("Layer control container (#layers-control-container .leaflet-control-layers) not found for scrolling.");
        }
    }


    if (btnContact && contactModal) { btnContact.onclick = () => contactModal.style.display = "block"; }
    if (spanClose && contactModal) { spanClose.onclick = () => contactModal.style.display = "none"; }

    if (showCommentsBtn && commentsModal && closeCommentsModalBtn) {
        showCommentsBtn.onclick = () => commentsModal.style.display = 'block';
        closeCommentsModalBtn.onclick = () => commentsModal.style.display = 'none';
    }

    window.addEventListener('click', function(event) {
        if (contactModal && event.target == contactModal) contactModal.style.display = "none";
        if (commentsModal && event.target == commentsModal) commentsModal.style.display = 'none';
    });

    if (commentForm && commentsListDiv) { /* ... (unchanged comment form submission) ... */ }
});
