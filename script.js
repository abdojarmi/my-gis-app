// ====================================================================================
// GIS SCRIPT FOR ATTAOUIA - V5.5 (PDF Export Integration)
// ====================================================================================

// انتظر حتى يتم تحميل DOM بالكامل
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main DOMContentLoaded Fired - Script Start'); // تتبع بداية السكريبت

    // --- الحصول على عناصر DOM الرئيسية ---
    // سيتم الحصول على بعض هذه العناصر لاحقًا عند الحاجة الفعلية إليها
    // var mapDomElement = document.getElementById('map'); // متغير جديد للخريطة كعنصر DOM

    // 1. تهيئة الخريطة
    var map = L.map('map', { // 'map' هو ID عنصر الـ div للخريطة
        zoomControl: false // تعطيل عنصر التحكم بالتكبير الافتراضي، سنضيفه يدويًا
    }).setView([31.785, -7.285], 13);
    console.log('Map initialized');

    // 2. إضافة طبقة أساس (TileLayer)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    console.log('Base tile layer added');

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

    const detailedStyles = { // ... (كل كائن detailedStyles الخاص بك يبقى كما هو هنا) ...
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
        "محطات الوقود": { displayName: "محطات الوقود", defaultPointStyle: { symbol: 'pin', color: '#FF0000', size: 20 } },
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
                "علامة إلزامية": { displayName: "علامة إلزامية", style: { type: 'text', content: '➡️', size: 10, color: 'blue' } }, // غيرت اللون ليكون مرئيًا
                "علامة تحديد السرعة": { displayName: "علامة تحديد السرعة", style: { type: 'text', content: '⁶⁰', size: 14, color: 'black'} }, // أزلت الخلفية
                "علامة تحذير": { displayName: "علامة تحذير", style: { type: 'text', content: '⚠️', size: 14, color: 'black' } }, // أزلت الخلفية
                "علامة منع": { displayName: "علامة منع", style: { type: 'text', content: '⛔', size: 14, color: 'red' } }, // أزلت الخلفية (الرمز أحمر)
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
        "المرافق التجارية": { displayName: "المرافق التجارية", defaultPointStyle: { symbol: 'circle', color: '#8B4513', size: 18 } },
        "الادارات الترابية": { displayName: "الإدارات الترابية", defaultPointStyle: { symbol: 'building', color: '#778899', size: 22 } },
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
                "طريق ثلاثية": { displayName: "طريق ثلاثية", styleConfig: { color: "#7570b3", weight: 2, opacity: 0.8 } },
                "طريق ريفية": { displayName: "طريق ريفية", styleConfig: { color: "#66a61e", weight: 1.5, dashArray: '4, 4', opacity: 0.75 } },
                "ممر": { displayName: "ممر", styleConfig: { color: "#A9A9A9", weight: 1, opacity: 0.7 } },
                "ممر مسدود": { displayName: "ممر مسدود", styleConfig: { color: "#FF0000", weight: 1, dashArray: '2, 3', opacity: 0.9 } },
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
                "حديقة عامة": { displayName: "حديقة عامة", styleConfig: { fillColor: "#3CB371", color: "#2E8B57", weight: 1, fillOpacity: 0.7 } },
                "شريط أخضر": { displayName: "شريط أخضر", styleConfig: { fillColor: "#98FB98", color: "#00FA9A", weight: 1, fillOpacity: 0.7 } },
                "منتزه": { displayName: "منتزه", styleConfig: { fillColor: "#00FF7F", color: "#3CB371", weight: 1, fillOpacity: 0.6 } },
                "_default_sub_style": { displayName: "(غير محدد)", styleConfig: { fillColor: "#ADFF2F", color: "#556B2F", weight: 1, fillOpacity: 0.5 } }
            },
            defaultLinePolyStyle: { fillColor: "#ADFF2F", color: "#556B2F", weight: 1, fillOpacity: 0.5 }
        },
        "أحياء": {
            displayName: "أحياء (الكثافة السكانية)",
            subcategories: {
                "0- 1168": { displayName: "0-1168 فرد/كم²", styleConfig: { fillColor: "#FFFFCC", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } },
                "1168- 5947": { displayName: "1168-5947 فرد/كم²", styleConfig: { fillColor: "#A1DAB4", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } },
                "5947- 8851": { displayName: "5947-8851 فرد/كم²", styleConfig: { fillColor: "#66C2A5", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } },
                "8851- 11179": { displayName: "8851-11179 فرد/كم²", styleConfig: { fillColor: "#2CA25F", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } },
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
            defaultLinePolyStyle: { color: "#999999", weight: 1.5, dashArray: '3,3', opacity: 0.6 }
        }
    }; // --- نهاية detailedStyles ---

    // --- (باقي الدوال: Object.keys(detailedStyles).forEach, getLayerNameFromProperties, createPopupContent) ---
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
        const directPropsToCheck = ['MainCategory', 'LayerGroup', 'اسم_الطبقة_الرئيسي', 'layer_name_principal', 'layer', 'LAYER', 'nom_couche'];

        if (properties.fclass && typeof properties.fclass === 'string' && properties.fclass.trim() !== "") {
            return "شبكة الطرق";
        }
        const roadLayerNames = ['RESEAU_ROUTIER', 'شبكة الطرق', 'Roads', 'Voirie', 'ROUTES'];
        if (properties.LAYER && roadLayerNames.includes(String(properties.LAYER).trim().toUpperCase())) {
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
        return "طبقة غير مصنفة";
    }

    function createPopupContent(properties, mainLayerName) {
        const mainLayerDisplayName = (detailedStyles[mainLayerName] && detailedStyles[mainLayerName].displayName) || mainLayerName;
        let content = `<b>${properties.الاسم || properties.name || properties.Nom || properties.NAME || 'معلم'}</b>`;
        content += `<br><small><i>(${mainLayerDisplayName})</i></small>`;

        const mainLayerConfig = detailedStyles[mainLayerName];
        let subCategoryDisplayName = "";
        if (mainLayerConfig && mainLayerConfig.subcategories) {
            const subCategoryPropertyCandidates = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'fclass', 'TYPE_VOIE', 'road_type', 'classification'];
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
                 'الاسم', 'name', 'Nom', 'NAME',
                 'النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'TYPE_VOIE', 'road_type', 'classification'
                ].includes(key) &&
                properties[key] !== null && String(properties[key]).trim() !== "" && String(properties[key]).trim() !== " ") {
                let displayKey = key.replace(/_/g, ' ');
                displayKey = displayKey.charAt(0).toUpperCase() + displayKey.slice(1);
                content += `<br><b>${displayKey}:</b> ${properties[key]}`;
            }
        }
        return content;
    } // --- نهاية createPopupContent ---

    const createdLayers = {};
    const layerControlEntries = {};

    // --- تحميل ومعالجة GeoJSON ---
    fetch('Attaouia_GeoData.geojson')
        .then(response => {
            if (!response.ok) throw new Error(`Network error: ${response.status} ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            console.log('GeoJSON data loaded successfully');
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
                            const subCategoryPropertyCandidates = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'classification'];
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
                                 return L.marker(latlng, { icon: createFeatureIcon(mainLayerConfig.defaultPointStyle || detailedStyles["طبقة غير مصنفة"].defaultPointStyle) });
                            }

                            let styleInfo = (mainLayerConfig.subcategories && mainLayerConfig.subcategories[subCategoryName]?.style) ||
                                            mainLayerConfig.defaultPointStyle ||
                                            detailedStyles["طبقة غير مصنفة"].defaultPointStyle;
                            return L.marker(latlng, { icon: createFeatureIcon(styleInfo) });
                        },
                        style: (feature) => {
                            const currentMainLayerName = feature.properties.derived_main_layer;
                            const currentMainLayerConfig = detailedStyles[currentMainLayerName] || detailedStyles["طبقة غير مصنفة"];

                            if (currentMainLayerName === "شبكة الطرق") {
                                const roadTypePropertyKeys = ['النوع', 'نوع_الطريق', 'road_type', 'fclass', 'TYPE_VOIE', 'classification'];
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

                            const subCategoryPropertyCandidates = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'classification'];
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

                    if (["حدود إدارية العطاوية", "شبكة الطرق", "طبقة المباني"].includes(mainLayerName) ||
                        ["حدود إدارية العطاوية", "شبكة الطرق", "طبقة المباني"].includes(displayNameForControl) ) {
                        geoJsonLayerGroup.addTo(map);
                    }
                }
            } // نهاية حلقة for (const mainLayerName in featuresByMainLayer)

            // --- إضافة عناصر التحكم إلى الواجهة ---
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
                styleLayerControl(); // لتطبيق الأنماط على متحكم الطبقات المضاف
                console.log('Layers control added to sidebar');
            }

            if (leftControlsArea) {
                const zoomControl = L.control.zoom({ position: 'topleft' }); // الموضع هنا مجرد إعداد افتراضي، سيتم نقله
                zoomControl.addTo(map); // يجب إضافته للخريطة أولاً
                const zoomElement = zoomControl.getContainer();
                if (zoomElement) {
                    if (leftControlsArea.firstChild) {
                        leftControlsArea.insertBefore(zoomElement, leftControlsArea.firstChild);
                    } else {
                        leftControlsArea.appendChild(zoomElement);
                    }
                    console.log('Zoom control moved to leftControlsArea');
                }
                updateCustomLegend(leftControlsArea); // استدعاء لإنشاء/تحديث المفتاح
            }

            // زر إخراج البيانات (مثال، يمكنك تعديله أو إزالته إذا لم يكن مستخدمًا)
            // const exportDataButton = document.getElementById('export-data-btn');
            // if (exportDataButton) {
            //     exportDataButton.addEventListener('click', () => {
            //         alert('سيتم تنفيذ وظيفة إخراج البيانات هنا!');
            //     });
            // }

            // =============================================================
            // == كود إعداد زر إخراج الخريطة إلى PDF ==
            // =============================================================
            console.log('PDF Export Setup: Attempting to set up *after* GeoJSON loaded and UI elements *should be* created.');
            const exportPdfBtn = document.getElementById('exportPdfButton'); // استخدام exportPdfBtn لتجنب التضارب
            const mapDomElementForPdf = document.getElementById('map'); // عنصر الخريطة
            const legendDomElementForPdf = document.getElementById('custom-legend'); // عنصر المفتاح

            console.log('PDF Export Setup (after GeoJSON & UI creation attempt):');
            console.log('exportPdfBtn:', exportPdfBtn);
            console.log('mapDomElementForPdf:', mapDomElementForPdf);
            console.log('legendDomElementForPdf:', legendDomElementForPdf);

            if (exportPdfBtn && mapDomElementForPdf && legendDomElementForPdf) {
                console.log('PDF Export Setup: All elements found. Adding click listener to exportPdfBtn.');
                exportPdfBtn.addEventListener('click', function () {
                    console.log('PDF Export Action: exportPdfBtn CLICKED!');

                    exportPdfBtn.disabled = true;
                    exportPdfBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                        جارٍ الإعداد...
                    `;
                    console.log('PDF Export Action: Button disabled, innerHTML changed.');

                    setTimeout(() => {
                        console.log('PDF Export Action: Inside setTimeout for canvas capture.');

                        const canvasOptions = {
                            useCORS: true,
                            allowTaint: true,
                            logging: false,
                            scale: window.devicePixelRatio > 1 ? 2 : 1,
                            onclone: (clonedDocument) => {
                                const clonedExportButton = clonedDocument.getElementById('exportPdfButton');
                                if (clonedExportButton) clonedExportButton.style.display = 'none';
                                // يمكنك إخفاء عناصر التحكم في Leaflet هنا أيضًا إذا أردت من النسخة المستنسخة
                                const leafletControls = clonedDocument.querySelectorAll('.leaflet-control-container .leaflet-control');
                                leafletControls.forEach(control => control.style.display = 'none');
                            }
                        };

                        console.log('PDF Export Action: Checking window.jspdf and html2canvas before Promise.all:');
                        console.log('PDF Export Action: typeof html2canvas:', typeof html2canvas);
                        console.log('PDF Export Action: window.jspdf object:', window.jspdf);
                        if (window.jspdf) {
                            console.log('PDF Export Action: typeof window.jspdf.jsPDF:', typeof window.jspdf.jsPDF);
                        }

                        if (typeof html2canvas !== 'function' || !window.jspdf || typeof window.jspdf.jsPDF !== 'function') {
                            console.error('PDF Export Action: html2canvas or jsPDF is not loaded correctly!');
                            alert('خطأ: لم يتم تحميل مكتبات PDF بشكل صحيح. يرجى التحقق من الكونسول.');
                            exportPdfBtn.disabled = false;
                            exportPdfBtn.innerHTML = `... PDF ...`; // استعادة الزر
                            return;
                        }


                        Promise.all([
                            html2canvas(mapDomElementForPdf, canvasOptions),
                            html2canvas(legendDomElementForPdf, canvasOptions)
                        ]).then(function ([mapCanvas, legendCanvas]) {
                            console.log('PDF Export Action: html2canvas promises resolved successfully.');
                            
                            const mapImgData = mapCanvas.toDataURL('image/png');
                            const legendImgData = legendCanvas.toDataURL('image/png');

                            const { jsPDF } = window.jspdf;
                            const pdf = new jsPDF({
                                orientation: 'landscape',
                                unit: 'mm',
                                format: 'a4'
                            });

                            const pdfWidth = pdf.internal.pageSize.getWidth();
                            const pdfHeight = pdf.internal.pageSize.getHeight();
                            const marginVal = 10; // استخدام marginVal لتجنب التضارب مع margin كخاصية CSS

                            const mapAspectRatio = mapCanvas.width / mapCanvas.height;
                            let mapPdfWidth = pdfWidth - (2 * marginVal);
                            let mapPdfHeight = mapPdfWidth / mapAspectRatio;

                            if (mapPdfHeight > pdfHeight * 0.75) { // مساحة أكبر قليلاً للخريطة
                                mapPdfHeight = pdfHeight * 0.75;
                                mapPdfWidth = mapPdfHeight * mapAspectRatio;
                            }
                            pdf.addImage(mapImgData, 'PNG', marginVal, marginVal, mapPdfWidth, mapPdfHeight);

                            const legendAspectRatio = legendCanvas.width / legendCanvas.height;
                            let legendPdfHeight = pdfHeight - mapPdfHeight - (3 * marginVal);
                            if (legendPdfHeight > 60) legendPdfHeight = 60; // يمكن زيادة ارتفاع المفتاح قليلاً
                            if (legendPdfHeight < 10 && legendCanvas.height > 0) legendPdfHeight = 10;
                            
                            let legendPdfWidth = legendPdfHeight * legendAspectRatio;
                            if (legendPdfWidth > pdfWidth - (2 * marginVal)) {
                                legendPdfWidth = pdfWidth - (2 * marginVal);
                                legendPdfHeight = legendPdfWidth / legendAspectRatio;
                                if (legendPdfHeight < 10 && legendCanvas.height > 0) legendPdfHeight = 10; // إعادة التحقق
                            }

                            pdf.addImage(legendImgData, 'PNG', marginVal, marginVal + mapPdfHeight + marginVal, legendPdfWidth, legendPdfHeight);

                            pdf.setFontSize(10);
                            pdf.text('خريطة مُصدَّرة', marginVal, marginVal - 3);
                            pdf.text(new Date().toLocaleDateString('ar-EG'), pdfWidth - marginVal, marginVal - 3, { align: 'right' });

                            pdf.save('خريطتي.pdf');
                            console.log('PDF Export Action: PDF saved.');

                            exportPdfBtn.disabled = false;
                            exportPdfBtn.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                PDF
                            `;
                            console.log('PDF Export Action: Button re-enabled.');

                        }).catch(function(error) {
                            console.error('PDF Export Action: Error in Promise.all or .then block:', error);
                            alert('حدث خطأ أثناء إنشاء PDF. يرجى مراجعة الكونسول.');
                            exportPdfBtn.disabled = false;
                            exportPdfBtn.innerHTML = `
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                 PDF
                            `;
                        });
                    }, 100);
                });
            } else {
                console.error('PDF Export Setup (after GeoJSON): One or more required elements not found for PDF export functionality!');
                if (!exportPdfBtn) console.error('PDF Export Setup: exportPdfButton (#exportPdfButton) not found.');
                if (!mapDomElementForPdf) console.error('PDF Export Setup: mapDomElementForPdf (#map) not found.');
                if (!legendDomElementForPdf) console.error('PDF Export Setup: legendDomElementForPdf (#custom-legend) not found. Check if updateCustomLegend was called and succeeded, and if the ID is correct.');
            }
            // --- نهاية كود إعداد زر إخراج PDF ---

        }) // نهاية .then(data => { ... })
        .catch(error => {
            console.error('Main Fetch Error: Error loading/processing GeoJSON:', error);
            const mapDiv = document.getElementById('map');
            if (mapDiv) {
                mapDiv.innerHTML = `<div style="padding:20px;color:red;text-align:center;"><h3>خطأ في تحميل البيانات: ${error.message}</h3><p>يرجى التحقق من وحدة التحكم للمزيد من التفاصيل.</p></div>`;
            }
        }); // نهاية .catch() الخاصة بـ fetch

    // =============================================================
    // == كود النافذة المنبثقة لـ "اتصل بنا" (Contact Us Modal) ==
    // =============================================================
    var contactModal = document.getElementById("contactModal"); // إعادة تعريف للتأكيد
    var btnContact = document.getElementById("contactBtnHeader");
    var spanCloseContact = contactModal ? contactModal.querySelector(".close-button") : null; // استهداف زر الإغلاق داخل نافذة اتصل بنا

    if (btnContact && contactModal) {
        btnContact.onclick = function() {
            console.log('Contact Us button clicked');
            contactModal.style.display = "block";
        }
    } else {
        if(!btnContact) console.error("Contact button 'contactBtnHeader' not found");
        if(!contactModal) console.error("Contact modal 'contactModal' not found");
    }

    if (spanCloseContact && contactModal) {
        spanCloseContact.onclick = function() {
            console.log('Contact Us modal close button clicked');
            contactModal.style.display = "none";
        }
    } else {
        if(!spanCloseContact) console.error("Close button for contact modal not found");
    }

    // =============================================================
    // == كود النافذة المنبثقة للتعليقات (Comments Modal) ==
    // =============================================================
    var showCommentsBtn = document.getElementById('showCommentsBtn');
    var commentsModal = document.getElementById('commentsModal');
    var closeCommentsModalBtn = document.getElementById('closeCommentsModalBtn');
    var commentForm = document.getElementById('commentForm');
    var commentsListDiv = document.getElementById('comments-list');

    if (showCommentsBtn && commentsModal && closeCommentsModalBtn) {
        showCommentsBtn.onclick = function() {
            console.log('Show Comments button clicked');
            commentsModal.style.display = 'block';
        }
        closeCommentsModalBtn.onclick = function() {
            console.log('Close Comments modal button clicked');
            commentsModal.style.display = 'none';
        }
    } else {
        if (!showCommentsBtn) console.error("Button 'showCommentsBtn' not found.");
        if (!commentsModal) console.error("Modal 'commentsModal' not found.");
        if (!closeCommentsModalBtn) console.error("Button 'closeCommentsModalBtn' not found.");
    }

    // إغلاق النوافذ عند النقر خارج محتواها (دمج المستمع)
    window.addEventListener('click', function(event) {
        if (contactModal && event.target == contactModal) {
            console.log('Clicked outside Contact Us modal');
            contactModal.style.display = "none";
        }
        if (commentsModal && event.target == commentsModal) {
            console.log('Clicked outside Comments modal');
            commentsModal.style.display = 'none';
        }
    });

    // التعامل مع إرسال نموذج التعليق
    if (commentForm && commentsListDiv) {
        commentForm.onsubmit = function(event) {
            event.preventDefault();
            console.log('Comment form submitted');
            // ... (باقي كود إرسال التعليق) ...
             var commenterName = document.getElementById('commenterName').value.trim();
            var commentText = document.getElementById('commentText').value.trim();

            if (commentText === "") {
                alert("الرجاء كتابة تعليق.");
                return;
            }
            var newComment = document.createElement('div');
            newComment.style.borderBottom = "1px solid #eee";
            newComment.style.paddingBottom = "10px";
            newComment.style.marginBottom = "10px";
            var nameStrong = document.createElement('strong');
            nameStrong.textContent = commenterName ? commenterName : "مجهول";
            newComment.appendChild(nameStrong);
            var textP = document.createElement('p');
            textP.textContent = commentText;
            textP.style.margin = "5px 0 0 0";
            newComment.appendChild(textP);
            var paragraphsInList = commentsListDiv.getElementsByTagName('p');
            for (var i = 0; i < paragraphsInList.length; i++) {
                var pElement = paragraphsInList[i];
                var textContent = pElement.textContent || pElement.innerText;
                if (textContent.includes("لا توجد تعليقات حاليًا")) {
                    if (pElement.parentNode === commentsListDiv) {
                        commentsListDiv.removeChild(pElement);
                        console.log("'No comments' paragraph containing the specific text removed.");
                        break; 
                    }
                }
            }
            commentsListDiv.appendChild(newComment);
            document.getElementById('commenterName').value = "";
            document.getElementById('commentText').value = "";
            alert("شكراً على تعليقك!");
        };
    } else {
         if (!commentForm) console.error("Comment form 'commentForm' not found.");
         if (!commentsListDiv) console.error("Comments list div 'comments-list' not found.");
    }
    // =============================================================
    // == نهاية كود النوافذ المنبثقة ==
    // =============================================================

    console.log('Main DOMContentLoaded Fired - Script End');
}); // نهاية مستمع DOMContentLoaded الرئيسي
