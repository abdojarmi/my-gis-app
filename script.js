// ====================================================================================
// GIS SCRIPT FOR ATTAOUIA - V5.4 (Layout Reorganization)
// ====================================================================================

// انتظر حتى يتم تحميل DOM بالكامل
document.addEventListener('DOMContentLoaded', function() {

        // --- الحصول على عناصر DOM الرئيسية ---
    var mapElement = document.getElementById('map'); // مثال إذا كنت تستخدمه لاحقًا
    var contactModal = document.getElementById("contactModal");
    var btnContact = document.getElementById("contactBtnHeader");
    var spanClose = document.getElementsByClassName("close-button")[0]; // يفترض أنه الأول، وقد يكون هذا غير دقيق إذا كان لديك عدة أزرار إغلاق بنفس الكلاس

    // --- الحصول على عناصر DOM الخاصة بالتعليقات ---
    var showCommentsBtn = document.getElementById('showCommentsBtn');
    var commentsModal = document.getElementById('commentsModal');
    // انتبه: زر الإغلاق الخاص بنافذة التعليقات لديه ID فريد أعطيناه إياه
    var closeCommentsModalBtn = document.getElementById('closeCommentsModalBtn'); // وليس getElementsByClassName
    var commentForm = document.getElementById('commentForm');
    var commentsListDiv = document.getElementById('comments-list');

    // 1. تهيئة الخريطة
    var map = L.map('map', {
        zoomControl: false // تعطيل عنصر التحكم بالتكبير الافتراضي، سنضيفه يدويًا
    }).setView([31.785, -7.285], 13);

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
// --- داخل دالة createFeatureIcon، داخل if (styleSettings.type === 'text') ---

const divHtml = `<div style="font-size:${styleSettings.size || 16}px; color:${styleSettings.color || 'black'}; background-color:transparent; border:none; padding:0px; text-align:center; white-space: nowrap;">${styleSettings.content || '?'}</div>`;            let iconWidth = (styleSettings.size || 16) * (String(styleSettings.content || '?').length * 0.6) + 8;
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

            const exportButton = document.getElementById('export-data-btn');
            if (exportButton) {
                exportButton.addEventListener('click', () => {
                    alert('سيتم تنفيذ وظيفة إخراج البيانات هنا!');
                });
            }
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
            if (containerElement) {
                containerElement.appendChild(legendDiv);
            } else {
                console.warn("Legend container not provided, legend may not be displayed correctly.");
                document.body.appendChild(legendDiv);
            }
        }
        legendDiv.innerHTML = '<h4>وسيلة الإيضاح</h4>';

        const orderedLayerNames = Object.keys(detailedStyles);

        orderedLayerNames.forEach(mainLayerName => {
            if (detailedStyles.hasOwnProperty(mainLayerName) && mainLayerName !== "طبقة غير مصنفة") {
                const layerConfig = detailedStyles[mainLayerName];

                const mainLayerDiv = document.createElement('div');
                mainLayerDiv.innerHTML = `<strong>${layerConfig.displayName || mainLayerName}</strong>`;
                legendDiv.appendChild(mainLayerDiv);

                if (layerConfig.subcategories && Object.keys(layerConfig.subcategories).length > 0) {
                    Object.keys(layerConfig.subcategories).forEach(subcatName => {
                        if (subcatName.startsWith("_default")) return;

                        const subcatConfig = layerConfig.subcategories[subcatName];
                        if (!subcatConfig) return;

                        const itemDiv = document.createElement('div');
                        itemDiv.style.cssText = "margin-left:10px; display:flex; align-items:center; margin-bottom:3px;";
                        let iconHtml = '';

                        if (subcatConfig.style) {
                            iconHtml = createFeatureIcon(subcatConfig.style).options.html;
                        } else if (subcatConfig.styleConfig) {
                            const sc = subcatConfig.styleConfig;
                            const isLine = mainLayerName === "شبكة الطرق" ||
                                           (sc.hasOwnProperty('weight') && (!sc.hasOwnProperty('fillColor') || sc.fillColor === 'transparent' || sc.fillOpacity === 0));

                            if (isLine) {
                                if (sc.dashArray) {
                                    iconHtml = `<svg width="20" height="10" style="margin-right:5px; vertical-align:middle;"><line x1="0" y1="5" x2="20" y2="5" style="stroke:${sc.color || '#000'}; stroke-width:${Math.max(1, sc.weight || 2)}; stroke-dasharray:${sc.dashArray.replace(/,/g, ' ')};" /></svg>`;
                                } else {
                                    iconHtml = `<span style="display:inline-block; width:16px; height:${Math.max(2, sc.weight || 2)}px; background-color:${sc.color || '#000'}; margin-right:5px; vertical-align:middle;"></span>`;
                                }
                            } else { // Polygon
                                iconHtml = `<span style="background-color:${sc.fillColor || 'transparent'}; border: ${sc.weight || 1}px solid ${sc.color || '#000'}; width:16px; height:10px; display:inline-block; margin-right:5px; vertical-align:middle; opacity:${sc.fillOpacity || 1};"></span>`;
                            }
                        }
                        itemDiv.innerHTML = `<span style="display:inline-block; width:22px; height:22px; line-height:22px; text-align:center; margin-right:5px; flex-shrink:0;">${iconHtml || '?'}</span> <span>${subcatConfig.displayName || subcatName}</span>`;
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
                         const isLine = mainLayerName === "شبكة الطرق" ||
                                       (sc.hasOwnProperty('weight') && (!sc.hasOwnProperty('fillColor') || sc.fillColor === 'transparent' || sc.fillOpacity === 0));
                        if (isLine) {
                             if (sc.dashArray) {
                                iconHtml = `<svg width="20" height="10" style="margin-right:5px; vertical-align:middle;"><line x1="0" y1="5" x2="20" y2="5" style="stroke:${sc.color || '#000'}; stroke-width:${Math.max(1, sc.weight || 2)}; stroke-dasharray:${sc.dashArray.replace(/,/g, ' ')};" /></svg>`;
                            } else {
                                 iconHtml = `<span style="display:inline-block; width:16px; height:${Math.max(2, sc.weight || 2)}px; background-color:${sc.color || '#000'}; margin-right:5px; vertical-align:middle;"></span>`;
                            }
                        } else { // Polygon
                             iconHtml = `<span style="background-color:${sc.fillColor || 'transparent'}; border: ${sc.weight || 1}px solid ${sc.color || '#000'}; width:16px; height:10px; display:inline-block; margin-right:5px; vertical-align:middle; opacity:${sc.fillOpacity || 1};"></span>`;
                        }
                    }
                    itemDiv.innerHTML = `<span style="display:inline-block; width:22px; height:22px; line-height:22px; text-align:center; margin-right:5px; flex-shrink:0;">${iconHtml || '?'}</span> <span><small>(نمط افتراضي للطبقة)</small></span>`;
                    legendDiv.appendChild(itemDiv);
                }
            }
        });
    }

    function styleLayerControl() {
        const layerControlElement = document.querySelector('#layers-control-container .leaflet-control-layers');
        if (layerControlElement) {
            const layersListContainer = layerControlElement.querySelector('.leaflet-control-layers-list');
            if (layersListContainer && !layerControlElement.querySelector('.leaflet-control-layers-title')) {
                const titleElement = document.createElement('div');
                titleElement.className = 'leaflet-control-layers-title';
                titleElement.innerHTML = '<strong>الطبقات الرئيسية</strong>';
                layerControlElement.insertBefore(titleElement, layersListContainer);
            }
        }
    }
document.addEventListener('DOMContentLoaded', function () {
    const exportButton = document.getElementById('exportPdfButton');
    const mapElement = document.getElementById('map'); // <-- تأكد أن هذا هو الـ ID الصحيح لـ div الخريطة
    const legendElement = document.getElementById('custom-legend'); // <-- تأكد أن هذا هو الـ ID الصحيح لـ div المفتاح

    if (exportButton && mapElement && legendElement) {
        exportButton.addEventListener('click', function () {
            // رسالة للمستخدم (اختياري)
            exportButton.disabled = true;
            exportButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                جارٍ الإعداد...
            `;

            // إخفاء عناصر التحكم في الخريطة مؤقتًا إذا أردت (مثل أزرار التكبير/التصغير)
            // مثال: const zoomControl = document.querySelector('.leaflet-control-zoom');
            // if (zoomControl) zoomControl.style.display = 'none';


            // مهلة صغيرة للسماح لأي تحديثات في الواجهة بالحدوث
            setTimeout(() => {
                // الخيارات لـ html2canvas (يمكنك تعديلها)
                const canvasOptions = {
                    useCORS: true, // مهم إذا كانت لديك صور من نطاقات أخرى (مثل مربعات الخرائط)
                    allowTaint: true,
                    logging: false, // تعطيل تسجيلات html2canvas في الكونسول
                    scale: window.devicePixelRatio > 1 ? 2 : 1, // تحسين الجودة على شاشات Retina
                    onclone: (document) => {
                        // يمكنك إجراء تعديلات على الـ DOM المستنسخ قبل التقاط الصورة
                        // مثلاً، إخفاء عناصر معينة فقط أثناء الالتقاط
                        // const clonedExportButton = document.getElementById('exportPdfButton');
                        // if (clonedExportButton) clonedExportButton.style.display = 'none';
                    }
                };

                Promise.all([
                    html2canvas(mapElement, canvasOptions),
                    html2canvas(legendElement, canvasOptions)
                ]).then(function ([mapCanvas, legendCanvas]) {
                    // إعادة إظهار عناصر التحكم في الخريطة إذا تم إخفاؤها
                    // if (zoomControl) zoomControl.style.display = 'block';

                    const mapImgData = mapCanvas.toDataURL('image/png');
                    const legendImgData = legendCanvas.toDataURL('image/png');

                    // استخدام jsPDF (تأكد أن window.jspdf.jsPDF موجود)
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF({
                        orientation: 'landscape', // أو 'portrait'
                        unit: 'mm',
                        format: 'a4' // أو أبعاد مخصصة
                    });

                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    const margin = 10; // هامش 10 مم

                    // أبعاد الخريطة في الـ PDF
                    // حاول الحفاظ على نسبة العرض إلى الارتفاع الأصلية للخريطة
                    const mapAspectRatio = mapCanvas.width / mapCanvas.height;
                    let mapPdfWidth = pdfWidth - (2 * margin);
                    let mapPdfHeight = mapPdfWidth / mapAspectRatio;

                    if (mapPdfHeight > pdfHeight * 0.7) { // إذا كانت الخريطة طويلة جدًا
                        mapPdfHeight = pdfHeight * 0.7;
                        mapPdfWidth = mapPdfHeight * mapAspectRatio;
                    }

                    // إضافة صورة الخريطة
                    pdf.addImage(mapImgData, 'PNG', margin, margin, mapPdfWidth, mapPdfHeight);

                    // أبعاد المفتاح في الـ PDF
                    const legendAspectRatio = legendCanvas.width / legendCanvas.height;
                    let legendPdfHeight = pdfHeight - mapPdfHeight - (3 * margin); // مساحة متبقية للمفتاح
                    if (legendPdfHeight > 50) legendPdfHeight = 50; // حد أقصى لارتفاع المفتاح
                    let legendPdfWidth = legendPdfHeight * legendAspectRatio;
                    if (legendPdfWidth > pdfWidth - (2 * margin)) { // إذا كان المفتاح عريضًا جدًا
                        legendPdfWidth = pdfWidth - (2 * margin);
                        legendPdfHeight = legendPdfWidth / legendAspectRatio;
                    }


                    // إضافة صورة المفتاح أسفل الخريطة
                    pdf.addImage(legendImgData, 'PNG', margin, margin + mapPdfHeight + margin, legendPdfWidth, legendPdfHeight);

                    // إضافة عنوان أو تاريخ (اختياري)
                    pdf.setFontSize(10);
                    pdf.text('خريطة مُصدَّرة', margin, margin - 3);
                    pdf.text(new Date().toLocaleDateString('ar-EG'), pdfWidth - margin, margin - 3, { align: 'right' });


                    pdf.save('خريطتي.pdf');

                    // إعادة الزر إلى حالته الطبيعية
                    exportButton.disabled = false;
                    exportButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        PDF
                    `;

                }).catch(function(error) {
                    console.error('خطأ أثناء إنشاء PDF:', error);
                    alert('حدث خطأ أثناء محاولة إخراج الخريطة. يرجى مراجعة الكونسول.');
                    // إعادة الزر إلى حالته الطبيعية
                    exportButton.disabled = false;
                    exportButton.innerHTML = `
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                         PDF
                    `;
                });
            }, 100); // مهلة للسماح بالتحديث
        });
    } else {
        if (!exportButton) console.error('لم يتم العثور على زر الإخراج exportPdfButton');
        if (!mapElement) console.error('لم يتم العثور على عنصر الخريطة map');
        if (!legendElement) console.error('لم يتم العثور على عنصر المفتاح custom-legend');
    }
});
// ========== كود تصدير الخريطة إلى PDF مع الطبقات المفعلة والمفتاح المتعلق بها ==========
document.addEventListener('DOMContentLoaded', function () {
    const exportButton = document.getElementById('exportPdfButton');
    const mapElement = document.getElementById('map');
    const legendContainer = document.getElementById('left-controls-area');

    // دالة لتحديث وسيلة الإيضاح للطبقات المفعلة فقط
    function updateCustomLegendForVisibleLayers(containerElement) {
        const legendContainerId = 'custom-legend';
        let legendDiv = document.getElementById(legendContainerId);
        if (!legendDiv) {
            legendDiv = document.createElement('div');
            legendDiv.id = legendContainerId;
            containerElement.appendChild(legendDiv);
        }

        legendDiv.innerHTML = '<h4>وسيلة الإيضاح</h4>';

        const visibleLayerNames = Object.keys(createdLayers).filter(name => map.hasLayer(createdLayers[name]));

        visibleLayerNames.forEach(mainLayerName => {
            const layerConfig = detailedStyles[mainLayerName];
            if (!layerConfig) return;

            const mainLayerDiv = document.createElement('div');
            mainLayerDiv.innerHTML = `<strong>${layerConfig.displayName || mainLayerName}</strong>`;
            legendDiv.appendChild(mainLayerDiv);

            if (layerConfig.subcategories && Object.keys(layerConfig.subcategories).length > 0) {
                Object.keys(layerConfig.subcategories).forEach(subcatName => {
                    if (subcatName.startsWith("_default")) return;

                    const subcatConfig = layerConfig.subcategories[subcatName];
                    if (!subcatConfig) return;

                    const itemDiv = document.createElement('div');
                    itemDiv.style.cssText = "margin-left:10px; display:flex; align-items:center; margin-bottom:3px;";
                    let iconHtml = '';

                    if (subcatConfig.style) {
                        iconHtml = createFeatureIcon(subcatConfig.style).options.html;
                    } else if (subcatConfig.styleConfig) {
                        const sc = subcatConfig.styleConfig;
                        if (sc.dashArray) {
                            iconHtml = `<svg width="20" height="10"><line x1="0" y1="5" x2="20" y2="5" style="stroke:${sc.color}; stroke-width:${sc.weight}; stroke-dasharray:${sc.dashArray.replace(/,/g, ' ')}"/></svg>`;
                        } else {
                            iconHtml = `<span style="display:inline-block; width:16px; height:${sc.weight}px; background-color:${sc.color}; margin-right:5px;"></span>`;
                        }
                    }
                    itemDiv.innerHTML = `<span style="width:22px; height:22px; line-height:22px; text-align:center; margin-right:5px;">${iconHtml}</span> <span>${subcatConfig.displayName || subcatName}</span>`;
                    legendDiv.appendChild(itemDiv);
                });
            }
        });
    }

    if (exportButton && mapElement && legendContainer) {
        exportButton.addEventListener('click', function () {
            exportButton.disabled = true;
            exportButton.innerHTML = 'جارٍ التحميل...';

            updateCustomLegendForVisibleLayers(legendContainer);
            const legendElement = document.getElementById('custom-legend');

            setTimeout(() => {
                const canvasOptions = {
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    scale: window.devicePixelRatio > 1 ? 2 : 1
                };

                Promise.all([
                    html2canvas(mapElement, canvasOptions),
                    html2canvas(legendElement, canvasOptions)
                ]).then(function ([mapCanvas, legendCanvas]) {
                    const mapImgData = mapCanvas.toDataURL('image/png');
                    const legendImgData = legendCanvas.toDataURL('image/png');

                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    const margin = 10;

                    const mapAspectRatio = mapCanvas.width / mapCanvas.height;
                    let mapPdfWidth = pdfWidth - (2 * margin);
                    let mapPdfHeight = mapPdfWidth / mapAspectRatio;
                    if (mapPdfHeight > pdfHeight * 0.7) {
                        mapPdfHeight = pdfHeight * 0.7;
                        mapPdfWidth = mapPdfHeight * mapAspectRatio;
                    }

                    pdf.addImage(mapImgData, 'PNG', margin, margin, mapPdfWidth, mapPdfHeight);

                    const legendAspectRatio = legendCanvas.width / legendCanvas.height;
                    let legendPdfHeight = pdfHeight - mapPdfHeight - (3 * margin);
                    if (legendPdfHeight > 50) legendPdfHeight = 50;
                    let legendPdfWidth = legendPdfHeight * legendAspectRatio;
                    if (legendPdfWidth > pdfWidth - (2 * margin)) {
                        legendPdfWidth = pdfWidth - (2 * margin);
                        legendPdfHeight = legendPdfWidth / legendAspectRatio;
                    }

                    pdf.addImage(legendImgData, 'PNG', margin, margin + mapPdfHeight + margin, legendPdfWidth, legendPdfHeight);
                    pdf.setFontSize(10);
                    pdf.text('خريطة مُصدَّرة', margin, margin - 3);
                    pdf.text(new Date().toLocaleDateString('ar-EG'), pdfWidth - margin, margin - 3, { align: 'right' });

                    pdf.save('خريطة العطاوية.pdf');

                    exportButton.disabled = false;
                    exportButton.innerHTML = '📄 PDF';
                }).catch(function (error) {
                    console.error('خطأ أثناء إنشاء PDF:', error);
                    alert('حدث خطأ أثناء الإخراج.');
                    exportButton.disabled = false;
                    exportButton.innerHTML = '📄 PDF';
                });
            }, 200);
        });
    } else {
        console.error('لم يتم العثور على أحد العناصر التالية: الزر، الخريطة أو مفتاح الخريطة');
    }
});

    // =============================================================
    // == كود النافذة المنبثقة لـ "اتصل بنا" (Contact Us Modal) ==
    // =============================================================
    var modal = document.getElementById("contactModal");
    var btnContact = document.getElementById("contactBtnHeader"); // تأكد أن هذا الـ ID يطابق زر "اتصل بنا" في HTML
    var spanClose = document.getElementsByClassName("close-button")[0]; // يفترض وجود زر إغلاق واحد بهذا الكلاس

    // التحقق من وجود العناصر قبل إضافة المستمعين
    if (btnContact && modal) {
        // عندما يضغط المستخدم على الزر "اتصل بنا"، افتح النافذة
        btnContact.onclick = function() {
            modal.style.display = "block";
        }
    }

    if (spanClose && modal) {
        // عندما يضغط المستخدم على <span> (x)، أغلق النافذة
        spanClose.onclick = function() {
            modal.style.display = "none";
        }
    }
    // عندما يضغط المستخدم في أي مكان خارج محتوى النافذة، أغلقها
    window.onclick = function(event) {
        if (modal && event.target == modal) { // إذا كان الهدف هو الخلفية الرمادية للنافذة
            modal.style.display = "none";
        }
    }
    // --- وظيفة النافذة المنبثقة للتعليقات ---
if (showCommentsBtn && commentsModal && closeCommentsModalBtn) {
    showCommentsBtn.onclick = function() {
        commentsModal.style.display = 'block';
    }
    closeCommentsModalBtn.onclick = function() {
        commentsModal.style.display = 'none';
    }
    // إغلاق نافذة التعليقات عند النقر خارج محتواها
    window.addEventListener('click', function(event) { // استخدم addEventListener لتجنب الكتابة فوق window.onclick السابق
        if (event.target == commentsModal) {
            commentsModal.style.display = 'none';
        }
    });
} else {
    if (!showCommentsBtn) console.error("Button 'showCommentsBtn' not found.");
    if (!commentsModal) console.error("Modal 'commentsModal' not found.");
    if (!closeCommentsModalBtn) console.error("Button 'closeCommentsModalBtn' not found.");
}

// (اختياري) التعامل مع إرسال نموذج التعليق
if (commentForm && commentsListDiv) {
    commentForm.onsubmit = function(event) {
        event.preventDefault(); // منع الإرسال التقليدي للنموذج

        var commenterName = document.getElementById('commenterName').value.trim();
        var commentText = document.getElementById('commentText').value.trim();

        if (commentText === "") {
            alert("الرجاء كتابة تعليق.");
            return;
        }

        // إنشاء عنصر التعليق الجديد
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

           // إزالة رسالة "لا توجد تعليقات" إذا كانت موجودة
        // الطريقة الأولى: البحث عن الفقرة التي تحتوي على النص المحدد
        var paragraphsInList = commentsListDiv.getElementsByTagName('p');
        for (var i = 0; i < paragraphsInList.length; i++) {
            var pElement = paragraphsInList[i];
            // نتحقق مما إذا كان النص داخل الفقرة أو داخل عنصر <em> بداخلها
            var textContent = pElement.textContent || pElement.innerText;
            if (textContent.includes("لا توجد تعليقات حاليًا")) {
                if (pElement.parentNode === commentsListDiv) { // تأكد أنه ابن مباشر
                    commentsListDiv.removeChild(pElement);
                    console.log("'No comments' paragraph containing the specific text removed.");
                    break; // نخرج من الحلقة بعد إزالة العنصر
                }
            }
        }

        // الطريقة الثانية (إذا كنت متأكدًا من أن العنصر <p> هو الوحيد أو الأول):
        // هذا الكود سيعمل إذا كان <p><em>...</em></p> هو العنصر الوحيد أو الأول
        // var initialMessageParagraph = commentsListDiv.querySelector('#comments-list > p:first-child > em');
        // if (initialMessageParagraph && initialMessageParagraph.parentElement.parentNode === commentsListDiv) {
        //     commentsListDiv.removeChild(initialMessageParagraph.parentElement);
        //     console.log("Initial 'no comments' message (paragraph) removed.");
        // }
        commentsListDiv.appendChild(newComment);

        // مسح النموذج
        document.getElementById('commenterName').value = "";
        document.getElementById('commentText').value = "";

        alert("شكراً على تعليقك!");
        // يمكنك هنا إضافة كود لإرسال التعليق إلى خادم إذا أردت حفظه بشكل دائم
    };
}
    // =============================================================
    // == نهاية كود النافذة المنبثقة ==
    // =============================================================

}); // نهاية مستمع DOMContentLoaded
