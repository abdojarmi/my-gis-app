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
                // ... (rest of traffic sign subcategories)
                "لوحة تشوير مركبة": { displayName: "لوحة تشوير مركبة", style: { symbol: 'square', color: '#4682B4', size: 16 } },
                "_default_sub_style": { displayName: "(غير محدد)", style: { symbol: 'pin', color: '#6495ED', size: 16 } }
            },
            defaultPointStyle: { symbol: 'pin', color: '#6495ED', size: 16 }
        },
        "الخدمات الدينية": { /* ... */ },
        "النقل": { /* ... */ },
        "الامن والوقاية المدنية": { /* ... */ },
        "المالية والجبايات": { /* ... */ },
        "المرافق التجارية": { /* ... */ },
        "الادارات الترابية": { /* ... */ },
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
        "شبكة الطرق": { /* ... */ },
        "المناطق الخضراء والزراعة": { 
            displayName: "المناطق الخضراء والزراعة",
            subcategories: {
                "المغروسات": { displayName: "المغروسات", styleConfig: { fillColor: "#228B22", color: "#006400", weight: 1, fillOpacity: 0.6 } },
                "المزروعات": { displayName: "المزروعات", styleConfig: { fillColor: "#9ACD32", color: "#6B8E23", weight: 1, fillOpacity: 0.6 } },
                 "حديقة عامة": { displayName: "حديقة عامة", styleConfig: { fillColor: "#3CB371", color: "#2E8B57", weight: 1, fillOpacity: 0.7 } },
                "شريط أخضر": { displayName: "شريط أخضر", styleConfig: { fillColor: "#98FB98", color: "#00FA9A", weight: 1, fillOpacity: 0.7 } },
                "منتزه": { displayName: "منتزه", styleConfig: { fillColor: "#00FF7F", color: "#3CB371", weight: 1, fillOpacity: 0.6 } },
                "_default_sub_style": { displayName: "(غير محدد)", styleConfig: { fillColor: "#ADFF2F", color: "#556B2F", weight: 1, fillOpacity: 0.5 } }
            },
            defaultLinePolyStyle: { fillColor: "#ADFF2F", color: "#556B2F", weight: 1, fillOpacity: 0.5 }
        },
        "أحياء": { /* ... */ },
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
    // (The rest of detailedStyles and Object.keys(detailedStyles).forEach loop remains the same)
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

        const layerChecks = [
            { name: "حدود إدارية العطاوية", keys: directMatchPropKeys, keywords: { 
                'type': ["administrative", "boundary"], 'TYPE': ["administrative", "boundary"], 'fclass': ["administrative", "boundary"], 'الوصف': ["حدود إدارية", "حدود"], 'Name': ["حدود"], 'LAYER': ["حدود"], 'layer_name': ["حدود"], 'categorie': ["limite", "boundary", "حدود الجماعة"]
            }, geomCheck: ["LineString", "Polygon", "MultiPolygon"]}, // Added MultiPolygon
            
            // **NEW/MODIFIED: طبقة المباني based on Console**
            { name: "طبقة المباني", keys: directMatchPropKeys, keywords: {
                 'fclass': ["building", "construction"], 'type': ["building", "construction"], 'النوع': ["مبنى", "بناية"], 'نوع_الحي': ["سكني", "خدماتي"] // Added نوع_الحي
            }, geomCheck: ["Polygon", "MultiPolygon"]}, // Geometry check

            { name: "المناطق الخضراء والزراعة", keys: directMatchPropKeys, keywords: {
                'type': ["green_area", "park", "farmland", "agriculture", "garden", "vegetation"], 'fclass': ["park", "farmland", "forest", "grass", "meadow", "scrub", "heath", "orchard"], 'landuse': ["farmland", "forest", "grass", "meadow", "orchard", "vineyard", "greenfield", "recreation_ground", "cemetery", "village_green", "plant_nursery"], 'النوع': ["زراعة", "خضراء", "حديقة", "منتزه", "مغروسات", "مزروعات", "بستان"], 'natural': ['wood', 'tree_row', 'grassland', 'scrub', 'heath', 'tree']
            }, geomCheck: ["Polygon", "MultiPolygon"]},
            
            { name: "محطات الوقود", keys: directMatchPropKeys, keywords: {
                'amenity': ["fuel", "filling_station"], 'shop': ["fuel"], 'النوع': ["وقود", "محطة بنزين", "بنزين"], 'name': ["وقود", "بنزين", "غاز", "station", "fuel"], 'building':["fuel_station"]
            }},
            { name: "المرافق الرياضية والترفيهية", keys: directMatchPropKeys, keywords: {
                'leisure': ["pitch", "stadium", "sports_centre", "playground", "park", "garden", "track", "fitness_centre", "swimming_pool", "sports_hall", "miniature_golf", "golf_course", "ice_rink", "water_park", "dog_park", "nature_reserve", "bandstand", "amusement_arcade"], 
                'sport': ["soccer", "basketball", "tennis", "swimming", "athletics", "football", "golf", "equestrian", "multi", "gymnastics", "volleyball", "handball", "table_tennis", "shooting"], 
                'amenity': ["theatre", "cinema", "community_centre", "arts_centre", "nightclub", "social_club", "conference_centre", "events_venue", "planetarium"], 
                'tourism': ["theme_park", "zoo", "picnic_site", "attraction", "artwork", "gallery", "museum"],
                'النوع': ["رياضة", "ترفيه", "ملعب", "مسبح", "ثقافي", "مسرح", "نادي", "حديقة ترفيهية", "منتزه", "قاعة", "فضاء"]
            }},
            { name: "شبكة الطرق", keys: directMatchPropKeys, keywords: { 
                'highway': ['residential', 'primary', 'secondary', 'tertiary', 'unclassified', 'service', 'track', 'path', 'road', 'living_street', 'pedestrian', 'footway', 'cycleway', 'motorway', 'trunk', 'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link', 'steps', 'corridor', 'bus_stop', 'platform'], 
                'fclass': ['primary', 'secondary', 'tertiary', 'residential', 'service', 'track', 'path', 'unclassified_road', 'motorway', 'trunk', 'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link', 'footway', 'cycleway', 'steps', 'pedestrian', 'living_street'],
                'النوع': ['طريق', 'مسلك', 'ممر', 'زنقة', 'شارع', 'جسر', 'محور دوراني']
            }, geomCheck: ["LineString", "MultiLineString"]},
            // ... (Other layer checks from previous good version) ...
            { name: "أحياء", keys: directMatchPropKeys, keywords: {'landuse': ['residential'], 'place': ['neighbourhood', 'suburb', 'quarter', 'locality', 'hamlet', 'isolated_dwelling', 'village'], 'النوع': ['حي سكني', 'حي', 'تجمع سكني', 'دوار'], 'نوع_الحي':['سكني']} } // Also check نوع_الحي for أحياء
        ];

        for (const check of layerChecks) {
            result = checkLayer(check.name, check.keys, check.keywords, true, check.geomCheck);
            if (result) {
                console.log(`[CLASSIFICATION_FINAL] Feature ID ${featureId}: Classified as '${result}' by specific layer check for '${check.name}'.`);
                return result;
            }
        }
        
        // Specific fallbacks:
        // 1. 'طبقة المباني' if 'ارتفاع_البناء' exists or 'building' property has a "truthy" value (and it's a polygon)
        if (properties.hasOwnProperty('ارتفاع_البناء') && String(properties['ارتفاع_البناء']).trim() !== "" && String(properties['ارتفاع_البناء']).trim() !== "0") {
            if (properties.geometry && (properties.geometry.type.includes("Polygon") || properties.geometry.type.includes("MultiPolygon"))) {
                 console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched 'طبقة المباني' via existing 'ارتفاع_البناء' property and geometry.`);
                 return "طبقة المباني";
            }
        }
        if (properties.hasOwnProperty('building') && properties.building && !['no', 'none', 'false', '0'].includes(String(properties.building).trim().toLowerCase())) {
            if (properties.geometry && (properties.geometry.type.includes("Polygon") || properties.geometry.type.includes("MultiPolygon"))) {
                console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched 'طبقة المباني' via generic 'building' property ('${properties.building}') and geometry.`);
                return "طبقة المباني";
            }
        }
        if (properties.fclass && String(properties.fclass).toLowerCase().trim() === "building") {
             if (properties.geometry && (properties.geometry.type.includes("Polygon") || properties.geometry.type.includes("MultiPolygon"))) {
                console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched 'طبقة المباني' via fclass='building' and geometry.`);
                return "طبقة المباني";
            }
        }
        
        // Fallback for 'شبكة الطرق' if not caught by specific keywords but has a known OSM road fclass/highway value
        const commonRoadTags = { ...properties.fclass && {'fclass': [properties.fclass]}, ...properties.highway && {'highway': [properties.highway]} };
        if (Object.keys(commonRoadTags).length > 0) {
            const roadKeyWordsForFallback = {'fclass': ['primary', 'secondary', 'tertiary', 'residential', 'service', 'track', 'path', 'unclassified_road', 'motorway', 'trunk', 'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link', 'footway', 'cycleway', 'steps', 'pedestrian', 'living_street'], 'highway':['residential', 'primary', 'secondary', 'tertiary', 'unclassified', 'service', 'track', 'path', 'road', 'living_street', 'pedestrian', 'footway', 'cycleway', 'motorway', 'trunk', 'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link', 'steps', 'corridor', 'bus_stop', 'platform']};
            const roadCheckResult = checkLayer("شبكة الطرق", [], roadKeyWordsForFallback, false, ["LineString", "MultiLineString"]);
            if (roadCheckResult) {
                 console.log(`[CLASSIFICATION_FINAL] Feature ID ${featureId}: Classified as 'شبكة الطرق' by fallback OSM road tag check.`);
                return roadCheckResult;
            }
        }
        
        // Typo corrections in Path as a very final generic check
        if (properties.Path && typeof properties.Path === 'string') { /* ... */ }

        console.warn(`[UNCLASSIFIED_FINAL] Feature ID ${featureId} fell into 'طبقة غير مصنفة'. Properties:`, JSON.parse(JSON.stringify(properties)));
        return "طبقة غير مصنفة";
    }

    // ... (createPopupContent, fetch, and the rest of the script remains largely the same as the previous version)
    // Make sure to include the makeLayerControlScrollable function and call it.
    // Also, the PDF export and modal logic should be retained from the previous good version.

    function createPopupContent(properties, mainLayerName) {
        const mainLayerDisplayName = (detailedStyles[mainLayerName] && detailedStyles[mainLayerName].displayName) || mainLayerName;
        let content = `<b>${properties.الاسم || properties.name || properties.Nom || properties.NAME || 'معلم'}</b>`;
        content += `<br><small><i>(${mainLayerDisplayName})</i></small>`;
        if (mainLayerName === "طبقة غير مصنفة") { 
            content += `<br><small style="color:orange;"><i>(يرجى مراجعة خصائص هذا المعلم في الكونسول للمساعدة في تصنيفه بشكل صحيح)</i></small>`;
        }

        const mainLayerConfig = detailedStyles[mainLayerName];
        let subCategoryDisplayName = "";
        if (mainLayerConfig && mainLayerConfig.subcategories) {
            const subCategoryPropertyCandidates = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'fclass', 'TYPE_VOIE', 'road_type', 'classification', 'amenity', 'shop', 'leisure', 'building', 'landuse', 'power', 'man_made', 'highway', 'traffic_sign', 'religion', 'public_transport', 'office', 'place', 'emergency', 'sport', 'tourism', 'natural', 'utility', 'railway', 'نوع_الحي']; // Added نوع_الحي
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
            'public_transport', 'office', 'landuse', 'place', 'emergency', 'sport', 'tourism', 'natural', 'utility', 'railway', 'categorie', 'الوصف', 'layer_name', 'نوع_الحي', 'ارتفاع_البناء'
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
                            const subCategoryPropertyCandidates = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'classification', 'amenity', 'shop', 'leisure', 'building', 'نوع_الحي'];
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
                            const subCategoryPropertyCandidates = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'classification', 'fclass', 'amenity', 'shop', 'leisure', 'building', 'landuse', 'power', 'man_made', 'highway', 'traffic_sign', 'religion', 'public_transport', 'office', 'place', 'emergency', 'sport', 'tourism', 'natural', 'utility', 'railway', 'نوع_الحي'];
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
                makeLayerControlScrollable();
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

    const exportButton = document.getElementById('exportPdfButton');
    const legendElementForPdf = document.getElementById('custom-legend'); 
    if (exportButton && mapElement && legendElementForPdf) {
        exportButton.addEventListener('click', function () {
            if (typeof html2canvas === 'undefined') { alert('خطأ: مكتبة html2canvas غير محملة.'); return; }
            if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') { alert('خطأ: مكتبة jsPDF غير محملة.'); return; }
            exportButton.disabled = true; 
            const originalButtonHtml = exportButton.innerHTML;
            exportButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> جارٍ الإعداد...`;
            
            const zoomCtrl = map.getContainer().querySelector('.leaflet-control-zoom');
            const layersCtrlContainer = document.querySelector('#layers-control-container .leaflet-control-layers');
            const directLayersCtrl = map.getContainer().querySelector('.leaflet-control-layers:not(#layers-control-container .leaflet-control-layers)');

            if(zoomCtrl) zoomCtrl.style.visibility = 'hidden';
            if(layersCtrlContainer) layersCtrlContainer.style.visibility = 'hidden';
            if(directLayersCtrl) directLayersCtrl.style.visibility = 'hidden';

            setTimeout(() => {
                const canvasOptions = { useCORS: true, allowTaint: true, logging: false, scale: window.devicePixelRatio > 1 ? 1.5 : 1,
                    onclone: (clonedDoc) => {
                        const clZoom = clonedDoc.querySelector('.leaflet-control-zoom');
                        const clLayersCont = clonedDoc.querySelector('#layers-control-container .leaflet-control-layers');
                        const clDirectLayers = clonedDoc.querySelector('.leaflet-control-layers:not(#layers-control-container .leaflet-control-layers)');
                        if(clZoom) clZoom.style.visibility = 'hidden';
                        if(clLayersCont) clLayersCont.style.visibility = 'hidden';
                        if(clDirectLayers) clDirectLayers.style.visibility = 'hidden';
                    }
                };
                Promise.all([
                    html2canvas(mapElement, canvasOptions),
                    html2canvas(legendElementForPdf, { ...canvasOptions, scale: 1 })
                ]).then(function ([mapCanvas, legendCanvas]) {
                    if(zoomCtrl) zoomCtrl.style.visibility = 'visible';
                    if(layersCtrlContainer) layersCtrlContainer.style.visibility = 'visible';
                    if(directLayersCtrl) directLayersCtrl.style.visibility = 'visible';

                    const mapImgData = mapCanvas.toDataURL('image/png');
                    const legendImgData = legendCanvas.toDataURL('image/png');
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
                    const pdfW = pdf.internal.pageSize.getWidth(); const pdfH = pdf.internal.pageSize.getHeight(); const m = 10;
                    let mapPdfW = pdfW - (2*m); let mapPdfH = mapPdfW / (mapCanvas.width/mapCanvas.height);
                    if (mapPdfH > pdfH*0.75) { mapPdfH = pdfH*0.75; mapPdfW = mapPdfH * (mapCanvas.width/mapCanvas.height); }
                    if (mapPdfW > pdfW - (2*m)) { mapPdfW = pdfW-(2*m); mapPdfH = mapPdfW / (mapCanvas.width/mapCanvas.height); }
                    let legPdfH = Math.min(pdfH - mapPdfH - (3*m), 60); let legPdfW = legPdfH * (legendCanvas.width/legendCanvas.height);
                    if (legPdfW > pdfW-(2*m)) { legPdfW = pdfW-(2*m); legPdfH = legPdfW / (legendCanvas.width/legendCanvas.height); if(legPdfH > (pdfH - mapPdfH - (3*m))) { legPdfH = pdfH - mapPdfH - (3*m); legPdfW = legPdfH * (legendCanvas.width/legendCanvas.height);}}
                    let legX = m; let legY = m + mapPdfH + m;
                    if(legY + legPdfH > pdfH - m) { legPdfH = Math.max(5, pdfH - legY - m); legPdfW = legPdfH * (legendCanvas.width/legendCanvas.height); if(legPdfW > pdfW-(2*m)){ legPdfW = pdfW-(2*m);}}
                    pdf.addImage(mapImgData, 'PNG', m, m, mapPdfW, mapPdfH);
                    pdf.addImage(legendImgData, 'PNG', legX, legY, legPdfW, legPdfH);
                    pdf.setFontSize(10); pdf.setTextColor(100);
                    pdf.text('خريطة جماعة العطاوية - نظام المعلومات الجغرافي', m, m - 4);
                    try { pdf.text(new Date().toLocaleDateString('ar-EG-u-nu-latn',{year:'numeric',month:'long',day:'numeric'}), pdfW-m, m-4, {align:'right'});} catch(e){pdf.text(new Date().toLocaleDateString(), pdfW-m, m-4, {align:'right'});}
                    pdf.save('خريطة_العطاوية.pdf');
                    exportButton.disabled = false; exportButton.innerHTML = originalButtonHtml;
                }).catch(function(error) {
                    console.error('PDF Export Error:', error); alert('حدث خطأ أثناء محاولة إخراج الخريطة.');
                    if(zoomCtrl) zoomCtrl.style.visibility = 'visible';
                    if(layersCtrlContainer) layersCtrlContainer.style.visibility = 'visible';
                    if(directLayersCtrl) directLayersCtrl.style.visibility = 'visible';
                    exportButton.disabled = false; exportButton.innerHTML = originalButtonHtml;
                });
            }, 150);
        });
    } else { console.error('PDF Export Setup Error: Missing elements.'); }

    const exportDataBtn = document.getElementById('export-data-btn'); 
    if (exportDataBtn) { exportDataBtn.addEventListener('click', () => alert('سيتم تنفيذ وظيفة إخراج البيانات هنا!'));}
    })
    .catch(error => { 
        console.error('Error loading/processing GeoJSON:', error);
        const mapDiv = document.getElementById('map');
        if (mapDiv) {
            mapDiv.innerHTML = `<div style="padding:20px;color:red;text-align:center;"><h3>خطأ في تحميل البيانات: ${error.message}</h3><p>يرجى التحقق من وحدة التحكم للمزيد من التفاصيل.</p></div>`;
        }
     });

    function updateCustomLegend(containerElement) { 
        const legendContainerId = 'custom-legend'; 
        let legendDiv = document.getElementById(legendContainerId);
        if (!legendDiv) { 
            legendDiv = document.createElement('div');
            legendDiv.id = legendContainerId;
            containerElement ? containerElement.appendChild(legendDiv) : document.body.appendChild(legendDiv);
        }
        legendDiv.innerHTML = '<h4>وسيلة الإيضاح</h4>';
        const orderedLayerNames = Object.keys(detailedStyles);
        orderedLayerNames.forEach(mainLayerName => {
            if (detailedStyles.hasOwnProperty(mainLayerName) && mainLayerName !== "طبقة غير مصنفة") {
                const layerConfig = detailedStyles[mainLayerName];
                const mainLayerDiv = document.createElement('div');
                mainLayerDiv.innerHTML = `<strong>${layerConfig.displayName || mainLayerName}</strong>`;
                legendDiv.appendChild(mainLayerDiv);
                const subcategoriesToShow = layerConfig.subcategories ? Object.keys(layerConfig.subcategories).filter(k => !k.startsWith("_default")) : [];
                if (subcategoriesToShow.length > 0) {
                    subcategoriesToShow.forEach(subcatName => {
                        const subcatConfig = layerConfig.subcategories[subcatName];
                        if (!subcatConfig) return;
                        const itemDiv = document.createElement('div');
                        itemDiv.style.cssText = "margin-left:10px; display:flex; align-items:center; margin-bottom:3px;";
                        let iconHtml = '';
                        if (subcatConfig.style) {
                            iconHtml = createFeatureIcon(subcatConfig.style).options.html;
                        } else if (subcatConfig.styleConfig) {
                            const sc = subcatConfig.styleConfig;
                            const isLine = mainLayerName === "شبكة الطرق" || (sc.weight && (!sc.fillColor || sc.fillColor === 'transparent' || sc.fillColor === 'none' || sc.fillOpacity === 0));
                            iconHtml = isLine ? 
                                (sc.dashArray ? `<svg width="20" height="10" style="margin-right:5px; vertical-align:middle;"><line x1="0" y1="5" x2="20" y2="5" style="stroke:${sc.color||'#000'}; stroke-width:${Math.max(1,(sc.weight||2))}px; stroke-dasharray:${String(sc.dashArray).replace(/,/g,' ')};" /></svg>` : `<span style="display:inline-block; width:16px; height:${Math.max(2,(sc.weight||2))}px; background-color:${sc.color||'#000'}; margin-right:5px; vertical-align:middle;"></span>`)
                                : `<span style="background-color:${sc.fillColor||'transparent'}; border:${(sc.weight||1)}px solid ${sc.color||'#000'}; width:16px; height:10px; display:inline-block; margin-right:5px; vertical-align:middle; opacity:${(typeof sc.fillOpacity!=='undefined'?sc.fillOpacity:1)};"></span>`;
                        }
                        itemDiv.innerHTML = `<span style="display:inline-block; width:22px; height:22px; line-height:22px; text-align:center; margin-right:5px; flex-shrink:0;">${iconHtml||'?'}</span> <span>${subcatConfig.displayName||subcatName}</span>`;
                        legendDiv.appendChild(itemDiv);
                    });
                } else if (layerConfig.defaultPointStyle || layerConfig.defaultLinePolyStyle) {
                    const itemDiv = document.createElement('div');
                    itemDiv.style.cssText = "margin-left:10px; display:flex; align-items:center; margin-bottom:3px;";
                    let iconHtml = '';
                    if (layerConfig.defaultPointStyle) {
                         iconHtml = createFeatureIcon(layerConfig.defaultPointStyle).options.html;
                    } else if (layerConfig.defaultLinePolyStyle) {
                        const sc = layerConfig.defaultLinePolyStyle;
                        const isLine = mainLayerName === "شبكة الطرق" || mainLayerName === "حدود إدارية العطاوية" || (sc.weight && (!sc.fillColor || sc.fillColor === 'transparent' || sc.fillColor === 'none' || sc.fillOpacity === 0));
                        iconHtml = isLine ? 
                            (sc.dashArray ? `<svg width="20" height="10" style="margin-right:5px; vertical-align:middle;"><line x1="0" y1="5" x2="20" y2="5" style="stroke:${sc.color||'#000'}; stroke-width:${Math.max(1,(sc.weight||2))}px; stroke-dasharray:${String(sc.dashArray).replace(/,/g,' ')};" /></svg>` : `<span style="display:inline-block; width:16px; height:${Math.max(2,(sc.weight||2))}px; background-color:${sc.color||'#000'}; margin-right:5px; vertical-align:middle;"></span>`)
                            : `<span style="background-color:${sc.fillColor||'transparent'}; border:${(sc.weight||1)}px solid ${sc.color||'#000'}; width:16px; height:10px; display:inline-block; margin-right:5px; vertical-align:middle; opacity:${(typeof sc.fillOpacity!=='undefined'?sc.fillOpacity:1)};"></span>`;
                    }
                    const defaultStyleText = (mainLayerName === "حدود إدارية العطاوية" && !subcategoriesToShow.length) ? `<span>${layerConfig.displayName}</span>` : "<small>(نمط افتراضي للطبقة)</small>";
                    if (iconHtml) {
                       itemDiv.innerHTML = `<span style="display:inline-block; width:22px; height:22px; line-height:22px; text-align:center; margin-right:5px; flex-shrink:0;">${iconHtml}</span> ${defaultStyleText}`;
                       legendDiv.appendChild(itemDiv);
                    }
                }
            }
        });
    }

    function styleLayerControl() { 
        const lc = document.querySelector('#layers-control-container .leaflet-control-layers');
        if(lc){
            const list = lc.querySelector('.leaflet-control-layers-list');
            if(list && !lc.querySelector('.leaflet-control-layers-title')){
                const title = document.createElement('div');
                title.className = 'leaflet-control-layers-title';
                title.innerHTML = '<strong>الطبقات الرئيسية</strong>';
                lc.insertBefore(title, list);
            }
        }
    }
    
    function makeLayerControlScrollable() {
        const lcEl = document.querySelector('#layers-control-container .leaflet-control-layers .leaflet-control-layers-list');
        if (lcEl) {
            lcEl.style.maxHeight = '70vh'; 
            lcEl.style.overflowY = 'auto';
            console.log("Applied scrollable style to layer control list.");
        } else {
            console.warn("Layer control list not found for scrolling.");
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

    if (commentForm && commentsListDiv) { 
        commentForm.onsubmit = function(event) {
            event.preventDefault();
            var commenterName = document.getElementById('commenterName').value.trim();
            var commentText = document.getElementById('commentText').value.trim();
            if (commentText === "") { alert("الرجاء كتابة تعليق."); return; }
            var newComment = document.createElement('div');
            newComment.style.cssText = "border-bottom:1px solid #eee; padding-bottom:10px; margin-bottom:10px;";
            newComment.innerHTML = `<strong>${commenterName || "مجهول"}</strong><p style="margin:5px 0 0 0;">${commentText}</p>`;
            const noCommentsMsg = commentsListDiv.querySelector('p > em');
            if (noCommentsMsg && noCommentsMsg.textContent.includes("لا توجد تعليقات حاليًا")) {
                noCommentsMsg.parentElement.remove();
            }
            commentsListDiv.appendChild(newComment);
            commentForm.reset();
            alert("شكراً على تعليقك!");
        };
     }
});
