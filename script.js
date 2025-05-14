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
        'car': { type: 'svg', path: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5S18.33 16 17.5 16zM5 11l1.5-4.5h11L19 11H5z', viewBox: '0 0 24 24', defaultColor: '#FFFF00', defaultSize: 22 }
       };
  
    // ===================================================================
    // ==  الآن يجب أن يأتي تعريف دالة createFeatureIcon هنا  ==
    // ===================================================================
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
            console.warn(`Symbol '${symbolKey}' not found or not SVG in symbolLibrary. Using default pin.`);
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
    // ===================================================================
    // == نهاية تعريف دالة createFeatureIcon ==
    // ===================================================================     
             
const detailedStyles = {
    "الصحة والمجال الاجتماعي": {
        displayName: "الصحة والمجال الاجتماعي",
        subcategories: {
            "اجتماعية": { displayName: "اجتماعية", style: { symbol: 'pin', color: '#FF6347', size: 20 } }, // Tomato Red pin
            "صحية": { displayName: "صحية", style: { symbol: 'plusSign', color: '#4682B4', size: 22 } } // Steel Blue plus
        },
        defaultPointStyle: { symbol: 'pin', color: '#FFC0CB', size: 18 } // Pink pin
    },
    "توزيع الماء والكهرباء": {
        displayName: "توزيع الماء والكهرباء",
        subcategories: {
            "مكتب توزيع الماء والكهرباء": { displayName: "مكتب توزيع الماء والكهرباء", style: { symbol: 'building', color: '#A0522D', size: 20 } }, // Sienna building (placeholder)
            "محطة معالجة المياه": { displayName: "محطة معالجة المياه", style: { symbol: 'circle', color: '#1E90FF', size: 18 } }, // DodgerBlue circle
            "خزان مياه": { displayName: "خزان مياه", style: { symbol: 'square', color: '#87CEEB', size: 18 } }, // SkyBlue square
            "محول كهرباء": { displayName: "محول كهرباء", style: { symbol: 'lightningBolt', color: '#FFD700', size: 20 } } // Gold lightning
        },
        defaultPointStyle: { symbol: 'pin', color: '#B0E0E6', size: 18 } // PowderBlue pin
    },
      "طبقة المباني": { 
        displayName: "طبقة المباني",
        subcategories: {
            "خدماتي": { 
                displayName: "تجاري/خدماتي", // ليتناسب مع اللون الأصفر
                style: { symbol: 'circle', color: '#FFD700', size: 8 } // دائرة صفراء أصغر حجمًا
            },
            "سكني": { 
                displayName: "سكني", 
                style: { symbol: 'circle', color: '#007bff', size: 8 } // دائرة زرقاء أصغر حجمًا
            },
            "مبنى": { //  فئة فرعية إضافية إذا كانت بعض المعالم لها النوع "مبني" فقط
                displayName: "مبنى (عام)",
                style: { symbol: 'square', color: '#6c757d', size: 8 } // مربع رمادي
            },
            "قيد البناء": { // فئة فرعية للمباني قيد الإنشاء
                displayName: "قيد البناء",
                style: { symbol: 'pin', color: '#FFA500', size: 10, opacity: 0.7 } // دبوس برتقالي شفاف قليلاً
            },
            "_default_sub_style": { 
                displayName: "(مبنى غير محدد)", 
                style: { symbol: 'pin', color: '#AAAAAA', size: 10 } 
            }
        },
        defaultPointStyle: { symbol: 'pin', color: '#C0C0C0', size: 8 } // نمط افتراضي عام للطبقة
    },
    "محطات الوقود": {
        displayName: "محطات الوقود",
        // افترض أن الرمز في الصورة هو الرمز الافتراضي لهذه الطبقة
        defaultPointStyle: { symbol: 'pin', color: '#DC143C', size: 20 } // Crimson pin (placeholder for fuel pump icon)
    },
    "التعليم والتكوين وتشغيل الكفاءات": {
        displayName: "التعليم والتكوين وتشغيل الكفاءات",
        subcategories: {
            "إدارة تربوية": { displayName: "إدارة تربوية", style: { symbol: 'building', color: '#8A2BE2', size: 20 } }, // BlueViolet building (placeholder)
            "تعليم أولي": { displayName: "تعليم أولي", style: { symbol: 'circle', color: '#FFD700', size: 16 } },    // Gold circle
            "تعليم ابتدائي": { displayName: "تعليم ابتدائي", style: { symbol: 'circle', color: '#32CD32', size: 18 } }, // LimeGreen circle
            "تعليم متوسط": { displayName: "تعليم متوسط", style: { symbol: 'circle', color: '#0000CD', size: 18 } },  // MediumBlue circle
            "تعليم تأهيلي": { displayName: "تعليم تأهيلي", style: { symbol: 'building', color: '#4682B4', size: 20 } },// SteelBlue building (placeholder)
            "تعليم خصوصي": { displayName: "تعليم خصوصي", style: { symbol: 'square', color: '#9370DB', size: 18 } }, // MediumPurple square (placeholder)
            "معهد تقني": { displayName: "معهد تقني", style: { symbol: 'circle', color: '#808080', size: 18,  path:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-10h2v2h-2zm0 4h2v2h-2z' } }, // Gray circle with gear-like (SVG path placeholder)
            "دعم تشغيل الشباب": { displayName: "دعم تشغيل الشباب", style: { symbol: 'pin', color: '#FF4500', size: 18 } } // OrangeRed pin (placeholder for people icon)
        },
        defaultPointStyle: { symbol: 'pin', color: '#DDA0DD', size: 16 } // Plum pin
    },
    "التشوير الطرقي": {
        displayName: "التشوير الطرقي",
        subcategories: {
            "أضواء مرور": { displayName: "أضواء مرور", style: { type: 'text', content: '🚦', size: 18 } },
            "علامة إلزامية": { displayName: "علامة إلزامية", style: { type: 'text', content: '➡️', size: 14, color: 'white', backgroundColor: '#007bff', borderRadius: '50%', padding:'2px'} }, // Blue circle with arrow
            "علامة تحديد السرعة": { displayName: "علامة تحديد السرعة", style: { type: 'text', content: '⁶⁰', size: 14, color: 'black', backgroundColor: 'white', borderColor: 'red', borderWidth: '2px', borderRadius: '50%', padding:'2px'} },
            "علامة تحذير": { displayName: "علامة تحذير", style: { type: 'text', content: '⚠️', size: 16, color: 'black' } }, // Yellow triangle warning
            "علامة توقف": { displayName: "علامة توقف", style: { type: 'text', content: '🛑', size: 16 } },
            "علامة منع": { displayName: "علامة منع", style: { type: 'text', content: '⛔', size: 16 } },
            "لوحة تشوير مركبة": { displayName: "لوحة تشوير مركبة", style: { symbol: 'square', color: '#4682B4', size: 16 } } // SteelBlue square
        },
        defaultPointStyle: { symbol: 'pin', color: '#6495ED', size: 16 } // CornflowerBlue pin
    },
    "الخدمات الدينية": {
        displayName: "الخدمات الدينية",
        subcategories: {
            "مسجد": { displayName: "مسجد", style: {symbol: 'mosqueDome', color: '#B8860B', size: 28 } }, // DarkGoldenRod mosque dome
            "مصلى": { displayName: "مصلى", style: {symbol: 'square', color: '#FF7F50', size: 18 } },    // Coral square (placeholder)
            "مقبرة": { displayName: "مقبرة", style: {symbol: 'square', color: '#708090', size: 18 } }, // SlateGray square (placeholder)
            "زاوية": { displayName: "زاوية", style: {symbol: 'pin', color: '#FFD700', size: 22 } }      // Gold pin
        },
        defaultPointStyle: { symbol: 'pin', color: '#DAA520', size: 18 } // GoldenRod pin
    },
    "النقل": {
        displayName: "النقل",
        subcategories: {
            "نقطة توقف الحافلات": { displayName: "نقطة توقف الحافلات", style: { symbol: 'pin', color: '#808080', size: 20 } }, // Gray pin (placeholder for bus icon)
            "محطة الطاكسيات": { displayName: "محطة الطاكسيات", style: { symbol: 'car', color: '#32CD32', size: 20 } },      // LimeGreen car
            "موقف مؤدى عنه": { displayName: "موقف مؤدى عنه", style: { type: 'text', content: '🅿️', size: 18 } }
        },
        defaultPointStyle: { symbol: 'pin', color: '#FFA500', size: 18 } // Orange pin
    },
    "الامن والوقاية المدنية": {
        displayName: "الامن والوقاية المدنية",
        subcategories: {
            "مركز شرطة": { displayName: "مركز شرطة", style: { symbol: 'building', color: '#0000CD', size: 20 } },  // MediumBlue building (placeholder)
            "مركز أمني": { displayName: "مركز أمني", style: { symbol: 'building', color: '#4169E1', size: 20 } },  // RoyalBlue building (placeholder with P)
            "مركز خدمة الطوارئ": { displayName: "مركز خدمة الطوارئ", style: { symbol: 'plusSign', color: '#FF4500', size: 22 } }, // OrangeRed plus (placeholder for emergency icon)
            "مصلحة الوثائق الوطنية": { displayName: "مصلحة الوثائق الوطنية", style: { symbol: 'building', color: '#2E8B57', size: 18 } } // SeaGreen building (placeholder for document icon)
        },
        defaultPointStyle: { symbol: 'pin', color: '#B22222', size: 18 } // Firebrick pin
    },
    "المالية والجبايات": {
        displayName: "المالية والجبايات",
        subcategories: {
            "بنك/مؤسسة بريدية": { displayName: "بنك/مؤسسة بريدية", style: { symbol: 'building', color: '#4A4A4A', size: 20 } }, // Dark Gray building (placeholder for envelope icon)
            "إدارة ضمان اجتماعي": { displayName: "إدارة ضمان اجتماعي", style: { symbol: 'pin', color: '#DC143C', size: 20 } }, // Crimson pin (placeholder for star icon)
            "إدارة مالية": { displayName: "إدارة مالية", style: { symbol: 'building', color: '#3CB371', size: 20 } }, // MediumSeaGreen building (placeholder for chart icon)
            "بنك": { displayName: "بنك", style: { symbol: 'building', color: '#008080', size: 20 } }          // Teal building (placeholder for bank building icon)
        },
        defaultPointStyle: { symbol: 'pin', color: '#20B2AA', size: 18 } // LightSeaGreen pin
    },
    "المرافق التجارية": {
        displayName: "المرافق التجارية",
        defaultPointStyle: { symbol: 'circle', color: '#20B2AA', size: 18 } // LightSeaGreen circle (placeholder for cart icon)
    },
    "الادارات الترابية": {
        displayName: "الادارات الترابية",
        defaultPointStyle: { symbol: 'building', color: '#778899', size: 22 } // LightSlateGray building (placeholder for specific admin building icon)
    },
    "المرافق الرياضية والترفيهية": {
        displayName: "المرافق الرياضية والترفيهية",
        subcategories: {
            "ثقافي وترفيهي": { displayName: "ثقافي وترفيهي", style: { symbol: 'pin', color: '#FF69B4', size: 18 } }, // HotPink pin (placeholder for theater masks)
            "رياضي/ترفيهي": { displayName: "رياضي/ترفيهي", style: { symbol: 'pin', color: '#DC143C', size: 18 } }, // Crimson pin (placeholder for running person)
            "ثقافي": { displayName: "ثقافي", style: { symbol: 'pin', color: '#BA55D3', size: 18 } },          // MediumOrchid pin (placeholder for book/palette)
            "رياضي": { displayName: "رياضي", style: { symbol: 'pin', color: '#4682B4', size: 18 } }           // SteelBlue pin (placeholder for ball/runner)
        },
        defaultPointStyle: { symbol: 'pin', color: '#6A5ACD', size: 16 } // SlateBlue pin
    },
    "شبكة الطرق": {
        displayName: "شبكة الطرق",
        subcategories: {
            "طريق رئيسية": { displayName: "طريق رئيسية", styleConfig: { color: "#FFC0CB", weight: 3 } }, // Pink
            "طريق ثانوية": { displayName: "طريق ثانوية", styleConfig: { color: "#ADD8E6", weight: 2.5 } }, // LightBlue
            "طريق ثلاثية": { displayName: "طريق ثلاثية", styleConfig: { color: "#E6E6FA", weight: 2 } }, // Lavender
            "طريق ريفية": { displayName: "طريق ريفية", styleConfig: { color: "#90EE90", weight: 1.5, dashArray: '4, 4' } }, // LightGreen
            "ممر": { displayName: "ممر", styleConfig: { color: "#D3D3D3", weight: 1 } }, // LightGray
            "ممر مسدود": { displayName: "ممر مسدود", styleConfig: { color: "#FFA07A", weight: 1, dashArray: '2, 3' } }, // LightSalmon
            "ممر الالتفاف": { displayName: "ممر الالتفاف", styleConfig: { color: "#B0C4DE", weight: 1.5 } }, // LightSteelBlue
            "جسر": { displayName: "جسر", styleConfig: { color: "#A9A9A9", weight: 3, dashArray: '1, 5' } }, // DarkGray
            "مفترق دوار": { displayName: "مفترق دوار", styleConfig: { color: "#DA70D6", weight: 2 } }, // Orchid
            "وصلة الخروج من المدارة": { displayName: "وصلة الخروج من المدارة", styleConfig: { color: "#DB7093", weight: 1.5 } }, // PaleVioletRed
            "وصلة الدخول إلى المدارة": { displayName: "وصلة الدخول إلى المدارة", styleConfig: { color: "#DB7093", weight: 1.5, dashArray: '5,2' } } // PaleVioletRed dashed
        },
        defaultLinePolyStyle: { color: "#BEBEBE", weight: 1.5, opacity: 0.7 }
    },
    "المناطق الخضراء والزراعة": {
        displayName: "المناطق الخضراء والزراعة",
        subcategories: {
            "المغروسات": { displayName: "المغروسات", styleConfig: { fillColor: "#228B22", color: "#006400", weight: 1, fillOpacity: 0.6 } }, // ForestGreen fill
            "المزروعات": { displayName: "المزروعات", styleConfig: { fillColor: "#9ACD32", color: "#6B8E23", weight: 1, fillOpacity: 0.6 } }, // YellowGreen fill
            "حديقة عامة": { displayName: "حديقة عامة", styleConfig: { fillColor: "#3CB371", color: "#2E8B57", weight: 1, fillOpacity: 0.7 } }, // MediumSeaGreen fill
            "شريط أخضر": { displayName: "شريط أخضر", styleConfig: { fillColor: "#98FB98", color: "#00FA9A", weight: 1, fillOpacity: 0.7 } }, // PaleGreen fill
            "منتزه": { displayName: "منتزه", styleConfig: { fillColor: "#F5DEB3", color: "#D2B48C", weight: 1, fillOpacity: 0.6 } }    // Wheat fill (placeholder for park icon)
        },
        defaultLinePolyStyle: { fillColor: "#ADFF2F", color: "#556B2F", weight: 1, fillOpacity: 0.5 } // GreenYellow fill
    },
    "أحياء": {
        displayName: "أحياء", // أبقيت على الاسم بدون "الكثافة السكانية" ليتطابق مع الصورة
        subcategories: {
            // سأستخدم ألوانًا متدرجة للـ fillColor بناءً على الصورة
            "0- 1168":    { displayName: "0- 1168",    styleConfig: { fillColor: "#F1EEF6", color: "#737373", weight: 1, fillOpacity: 0.7 } },
            "1168- 5947": { displayName: "1168- 5947", styleConfig: { fillColor: "#BDC9E1", color: "#737373", weight: 1, fillOpacity: 0.7 } },
            "5947- 8851": { displayName: "5947- 8851", styleConfig: { fillColor: "#74A9CF", color: "#737373", weight: 1, fillOpacity: 0.7 } },
            "8851- 11179":{ displayName: "8851- 11179",styleConfig: { fillColor: "#2B8CBE", color: "#737373", weight: 1, fillOpacity: 0.7 } },
            "11179- 14469":{ displayName: "11179- 14469",styleConfig: { fillColor: "#045A8D", color: "#737373", weight: 1, fillOpacity: 0.7 } }
        },
        defaultLinePolyStyle: { fillColor: "#F0F0F0", color: "#888888", weight: 1, fillOpacity: 0.6 }
    },
    "حدود إدارية العطاوية": {
        displayName: "حدود إدارية العطاوية",
        defaultLinePolyStyle: { color: "#000000", weight: 2.5, opacity: 1, fillOpacity: 0, dashArray: '5, 5' } // Black dashed line
    },
    "طبقة غير مصنفة": {
        displayName: "طبقة غير مصنفة", // لن تظهر في المفتاح عادةً
        defaultPointStyle: { symbol: 'pin', color: '#7f7f7f', size: 16 },
        defaultLinePolyStyle: { color: "#999999", weight: 1.5, dashArray: '3,3', opacity: 0.6, fillOpacity: 0.2 }
    }
};
    function getLayerNameFromProperties(properties) {
        const knownMainLayers = Object.keys(detailedStyles).filter(k => k !== "طبقة غير مصنفة");
        const featureId = properties.OBJECTID || properties.id || properties.ID || 'UnknownID'; // For logging

        // Helper function to check for a layer name in various common properties or path
        const checkLayer = (targetLayerName, propKeysForExactMatch, keywordMap = {}, pathCheck = true) => {
            // 1. Check direct property exact matches
            for (const key of propKeysForExactMatch) {
                if (properties[key] && String(properties[key]).trim() === targetLayerName) {
                    console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched '${targetLayerName}' via exact property '${key}'='${properties[key]}'`);
                    return targetLayerName;
                }
            }

            // 2. Check Path for the exact layer name as a segment or in jarmi/LayerName structure
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
            
            // 3. Check for keywords in specified properties
            // keywordMap = { 'propertyName': ['keyword1', 'keyword2'], ... }
            for (const propName in keywordMap) {
                if (properties[propName]) {
                    const propValue = String(properties[propName]).toLowerCase().trim();
                    for (const keyword of keywordMap[propName]) {
                        if (propValue.includes(keyword.toLowerCase())) {
                            // Special condition for boundaries (must be line/poly)
                            if (targetLayerName === "حدود إدارية العطاوية") {
                                if (properties.geometry && (properties.geometry.type.includes("LineString") || properties.geometry.type.includes("Polygon"))) {
                                     console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched '${targetLayerName}' via keyword '${keyword}' in property '${propName}' (Geometry check passed).`);
                                    return targetLayerName;
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
        // =================== هذا هو المكان الذي تضع فيه مصفوفة layerChecks الجديدة والشروط الاحتياطية ===================
        const layerChecks = [ // <--- بداية المصفوفة (قوس مربع مفتوح)
            // 1. طبقة المباني و أحياء (بناءً على Console)
            { 
                name: "طبقة المباني", 
                keys: [], 
                keywords: { 
                    'نوع_الحي': ["سكني", "خدماتي"], 
                    'fclass': ["building", "construction"], 
                    'type': ["building", "construction"], 
                    'النوع': ["مبنى", "بناية"]
                }, 
                geomCheck: ["Polygon", "MultiPolygon"]
            }, // <--- فاصلة هنا لأن هناك عنصر آخر يليه

            { 
                name: "أحياء", 
                keys: [], 
                keywords: {
                    'اسم_الحي': ['*'], 
                    'نوع_الحي': ['سكني'], 
                    'place': ['neighbourhood', 'suburb', 'quarter', 'locality', 'village'],
                    'landuse': ['residential']
                },
                geomCheck: ["Polygon", "MultiPolygon"]
            }, // <--- فاصلة هنا

            // 2. حدود إدارية العطاوية (تعريف واحد فقط)
            { 
                name: "حدود إدارية العطاوية", 
                keys: directMatchPropKeys, // directMatchPropKeys يبحث عن تطابق تام في خصائص مثل 'layer', 'LAYER', 'Name'
                keywords: { 
                    // سنضيف كلمات مفتاحية للبحث في خصائص عامة، ولكن بحذر
                    // 'type': ["administrative", "boundary"], // إذا كانت هذه الخصائص موجودة في معالم أخرى ولكن بقيم مختلفة، قد لا تكون مفيدة هنا
                    // 'fclass': ["administrative", "boundary_administrative"],
                    // 'الوصف': ["حدود ادارية", "حدود الجماعة"],
                    // 'categorie': ["limite", "boundary", "حدود"]
                    // بما أن الجدول الوصفي لا يحتوي على هذه، قد لا تكون فعالة إلا إذا كانت هذه الخصائص تُضاف أثناء التصدير إلى GeoJSON
                },
                // الأهم هنا هو الاعتماد على Path أو اسم الطبقة المباشر
                // دالة checkLayer تقوم بفحص Path إذا كان pathCheck = true (وهو الافتراضي)
                // لذلك، إذا كانت خاصية 'Path' في GeoJSON تحتوي على "حدود_إدارية_العطاوية" كجزء منها،
                // أو إذا كانت إحدى الخصائص في directMatchPropKeys (مثل 'layer' أو 'Name') تساوي "حدود إدارية العطاوية"
                // فسيتم تصنيفها بشكل صحيح.
                geomCheck: ["Polygon", "MultiPolygon"] // نتأكد أنها مضلع
            },

            // 3. المناطق الخضراء والزراعة
            { 
                name: "المناطق الخضراء والزراعة", 
                keys: directMatchPropKeys, 
                keywords: {
                    'landuse': ["farmland", "forest", "grass", "meadow", "orchard", "vineyard", "greenfield", "recreation_ground", "cemetery", "village_green", "plant_nursery", "allotments", "flowerbed", "conservation", "greenery", "park", "garden"],
                    'natural': ['wood', 'tree_row', 'grassland', 'scrub', 'heath', 'tree', 'fell', 'wetland', 'bare_rock', 'scree', 'shingle', 'sand', 'beach', 'water', 'spring', 'vegetation'],
                    'fclass': ["park", "farmland", "forest", "grass", "meadow", "scrub", "heath", "orchard", "cemetery", "village_green", "greenfield", "wood", "garden", "nature_reserve"],
                    'النوع': ["زراعة", "خضراء", "حديقة", "منتزه", "مغروسات", "مزروعات", "بستان", "غابة", "منطقة خضراء", "فلاحي", "مساحة خضراء"]
                }, 
                geomCheck: ["Polygon", "MultiPolygon"]
            }, // <--- فاصلة هنا

            // 4. محطات الوقود
            { 
                name: "محطات الوقود", 
                keys: directMatchPropKeys, 
                keywords: {
                    'amenity': ["fuel", "filling_station"], 
                    'shop': ["fuel"], 
                    'النوع': ["وقود", "محطة بنزين", "بنزين", "محطة وقود"], 
                    'name': ["total", "shell", "afriquia", "محطة", "بترول"]
                }
            }, // <--- فاصلة هنا

            // 5. المرافق الرياضية والترفيهية
            { 
                name: "المرافق الرياضية والترفيهية", 
                keys: directMatchPropKeys, 
                keywords: {
                    'leisure': ["pitch", "stadium", "sports_centre", "playground", "track", "fitness_centre", "swimming_pool", "sports_hall", "miniature_golf", "golf_course", "ice_rink", "water_park", "dog_park", "nature_reserve", "bandstand", "amusement_arcade", "dance_hall", "club", "marina", "slipway", "adult_gaming_centre", "park", "garden"], 
                    'sport': ["soccer", "basketball", "tennis", "swimming", "athletics", "football", "golf", "equestrian", "multi", "gymnastics", "volleyball", "handball", "table_tennis", "shooting", "archery", "boules", "bowling", "skating", "climbing", "diving", "surfing", "yoga"], 
                    'amenity': ["theatre", "cinema", "community_centre", "arts_centre", "nightclub", "social_club", "conference_centre", "events_venue", "planetarium", "casino", "youth_centre", "library", "internet_cafe", "public_bath", "spa"], 
                    'tourism': ["theme_park", "zoo", "picnic_site", "attraction", "artwork", "gallery", "museum", "aquarium", "viewpoint", "information"],
                    'النوع': ["رياضة", "ترفيه", "ملعب", "مسبح", "ثقافي", "مسرح", "نادي", "حديقة ترفيهية", "منتزه", "قاعة", "فضاء", "مكتبة", "سينما", "مركز ثقافي", "نقطة جذب", "متحف", "ملعب رياضي", "قاعة رياضية"]
                }
            }, // <--- فاصلة هنا

            // 6. شبكة الطرق
            { 
                name: "شبكة الطرق", 
                keys: directMatchPropKeys, 
                keywords: { 
                    'highway': ['residential', 'primary', 'secondary', 'tertiary', 'unclassified', 'service', 'track', 'path', 'road', 'living_street', 'pedestrian', 'footway', 'cycleway', 'motorway', 'trunk', 'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link', 'steps', 'corridor', 'bus_stop', 'platform', 'street_lamp', 'crossing', 'traffic_signals', 'stop', 'give_way', 'turning_circle', 'roundabout'], 
                    'fclass': ['primary', 'secondary', 'tertiary', 'residential', 'service', 'track', 'path', 'unclassified_road', 'motorway', 'trunk', 'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link', 'footway', 'cycleway', 'steps', 'pedestrian', 'living_street', 'roundabout'],
                    'النوع': ['طريق', 'مسلك', 'ممر', 'زنقة', 'شارع', 'جسر', 'محور دوراني', 'مدارة']
                }, 
                geomCheck: ["LineString", "MultiLineString"]
            }, // <--- فاصلة هنا

            // --- أضف باقي تعريفات الطبقات هنا بنفس الطريقة ---
            // مثال:
            { 
                        name: "محطات الوقود", 
                keys: directMatchPropKeys, 
                keywords: {
                    'amenity': ["fuel", "filling_station"], 
                    'shop': ["fuel"], 
                    'النوع': ["وقود", "محطة بنزين", "بنزين", "محطة وقود", "محروقات"], 
                    'name': ["total", "shell", "afriquia", "محطة", "بترول", "غازوال", "station petrol"] // أضفت كلمات مفتاحية إضافية
                    // يمكنك إضافة 'building':["fuel_station"] إذا كانت بعض بياناتك تحتوي على ذلك
                }
                // لا يوجد geomCheck ضروري هنا لأنها عادةً نقاط، ولكن يمكن أن تكون مضلعات صغيرة
            }, // <--- فاصلة هنا لأن هناك طبقة أخرى بعدها

            { 
                name: "التعليم والتكوين وتشغيل الكفاءات", 
                keys: directMatchPropKeys, 
                keywords: {
                    'amenity': ["school", "college", "university", "kindergarten", "training", "research_institute", "language_school", "music_school", "driving_school", "library"], // Library قد تكون تابعة للتعليم
                    'building': ["school", "college", "university", "kindergarten", 'dormitory', 'classroom', 'library'], 
                    'office': ['education', 'research'], // مكاتب ذات صلة
                    'النوع': [
                        "تعليم", "مدرسة", "جامعة", "معهد", "تكوين", "روضة", 
                        "ثانوية", "اعدادية", "ابتدائي", "تأهيلي", "خصوصي", 
                        "فصل دراسي", "دعم مدرسي", "محو الامية", "ادارة تربوية", 
                        "معهد تقني", "دعم تشغيل الشباب", "مكتبة" // إضافة الكلمات من الفئات الفرعية
                    ], 
                    'categorie': ["education", "enseignement", "formation", "recherche", "library"]
                }
                // يمكن أن تكون نقاط (مثل موقع مدرسة) أو مضلعات (مبنى المدرسة)
            }, // <--- فاصلة هنا إذا كانت هناك طبقات أخرى بعدها

            // مثال لـ "توزيع الماء والكهرباء" (كما كان لديك)
            { 
                name: "توزيع الماء والكهرباء", 
                keys: directMatchPropKeys, 
                keywords: {
                    'power': ['substation', 'transformer', 'plant', 'generator', 'line', 'cable'], 
                    'man_made': ['water_tower', 'reservoir', 'pipeline', 'water_works', 'pump'], 
                    'utility':['water', 'power', 'electricity'], 
                    'النوع': ['ماء', 'كهرباء', 'توزيع', 'محول', 'خزان', 'مكتب توزيع', 'محطة تحويل']
                } 
                // لا توجد فاصلة هنا إذا كان هذا هو العنصر الأخير
            } 
            // ... إذا كانت هناك طبقات أخرى، أضف فاصلة واستمر ...
            
        ]; // <--- نهاية المصفوفة (قوس مربع مغلق)
        for (const check of layerChecks) {
            result = checkLayer(check.name, check.keys, check.keywords, true);
            if (result) return result;
        }
        
        // Specific check for fclass being "building" but not caught by keyword "building" for "طبقة المباني"
        if (properties.fclass && String(properties.fclass).toLowerCase().trim() === "building") {
            console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched 'طبقة المباني' via fclass='building'.`);
            return "طبقة المباني";
        }
        // Specific check for property "building" having any non-empty value for "طبقة المباني"
        if (properties.hasOwnProperty('building') && properties.building && String(properties.building).trim() !== "") {
            console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched 'طبقة المباني' via existing 'building' property.`);
            return "طبقة المباني";
        }


        // Fallback for 'شبكة الطرق' if not caught by keywords but has a known fclass (and not admin)
        if (properties.fclass && typeof properties.fclass === 'string') {
            const fclassLower = String(properties.fclass).trim().toLowerCase();
            const roadFclasses = ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'unclassified', 'residential', 'living_street', 'service', 'pedestrian', 'track', 'bus_guideway', 'escape', 'raceway', 'road', 'footway', 'cycleway', 'steps', 'path', 'bridleway', 'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link'];
            if (roadFclasses.includes(fclassLower) && !(fclassLower === 'administrative' || fclassLower.startsWith('boundary_administrative'))) {
                 console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched 'شبكة الطرق' via fclass='${fclassLower}'.`);
                return "شبكة الطرق";
            }
        }
        
        // Typo corrections in Path as a final generic check
        if (properties.Path && typeof properties.Path === 'string') {
            const parts = properties.Path.split(/[\\\/]/);
            const jarmiIndex = parts.findIndex(part => String(part).toLowerCase() === 'jarmi');
            if (jarmiIndex !== -1 && parts.length > jarmiIndex + 1) {
                let potentialName = String(parts[jarmiIndex + 1]).trim();
                if (potentialName === "توزيع الماء والكهرباءة") potentialName = "توزيع الماء والكهرباء";
                if (potentialName === "التشويرالطرقي") potentialName = "التشوير الطرقي";
                if (knownMainLayers.includes(potentialName)) {
                    console.log(`[CLASSIFICATION_DEBUG] Feature ID ${featureId}: Matched '${potentialName}' via jarmi/path (with typo correction if any).`);
                    return potentialName;
                }
            }
        }

        console.warn(`[UNCLASSIFIED_FEATURE_PROPS] Feature ID ${featureId} fell into 'طبقة غير مصنفة'. Properties:`, JSON.parse(JSON.stringify(properties)));
        return "طبقة غير مصنفة";
    }

    function createPopupContent(properties, mainLayerName) {
        const mainLayerDisplayName = (detailedStyles[mainLayerName] && detailedStyles[mainLayerName].displayName) || mainLayerName;
        let content = `<b>${properties.الاسم || properties.name || properties.Nom || properties.NAME || 'معلم'}</b>`;
        content += `<br><small><i>(${mainLayerDisplayName})</i></small>`;

        const mainLayerConfig = detailedStyles[mainLayerName];
        let subCategoryDisplayName = "";
        if (mainLayerConfig && mainLayerConfig.subcategories) {
            const subCategoryPropertyCandidates = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'fclass', 'TYPE_VOIE', 'road_type', 'classification', 'amenity', 'shop', 'leisure', 'building']; // Added more candidates
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
                !['Path', 'derived_main_layer', 'MainCategory', 'LayerGroup', 'OBJECTID', 'X', 'Y', 'Z', 'id', 'ID',
                 'Shape_Length', 'Shape_Area', 'OBJECTID_1', 'layer_name_principal', 'LAYER', 'fclass',
                 'الاسم', 'name', 'Nom', 'NAME', 'nom',
                 'النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'TYPE_VOIE', 'road_type', 'classification',
                 'amenity', 'shop', 'leisure', 'building', 'power', 'man_made', 'highway', 'traffic_sign', 'religion',
                 'public_transport', 'office', 'landuse', 'place', 'emergency', 'sport' // Exclude more common classification keys
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

            data.features.forEach((feature, index) => {
                if (!feature.properties) feature.properties = {};
                 // Ensure a unique ID for logging if common ones are missing
                if (!feature.properties.OBJECTID && !feature.properties.id && !feature.properties.ID) {
                    feature.properties.temp_id_for_debug = `feature_${index}`;
                }
                if (feature.geometry && !feature.properties.geometry) { // Make geometry type available in properties for classification
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

            console.log(`Total features: ${data.features.length}`);
            console.log(`Number of unclassified features: ${unclassifiedCount}`);
            console.log("Classified layer names found in data (these should have specific styles):", Array.from(classifiedNamesFound));
            
            const expectedLayers = Object.keys(detailedStyles).filter(k => k !== "طبقة غير مصنفة");
            expectedLayers.forEach(expLayer => {
                if (!classifiedNamesFound.has(expLayer) && featuresByMainLayer[expLayer] === undefined) {
                    // Check if any feature *should* have been this layer based on some common default property
                    // This is hard to do without knowing the data, but the logs from getLayerNameFromProperties are key.
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

                            for (const propKey of subCategoryPropertyCandidates) {
                                if (feature.properties[propKey]) {
                                    const propValue = String(feature.properties[propKey]).trim();
                                    if (mainLayerConfig.subcategories && mainLayerConfig.subcategories[propValue]?.style) {
                                        subCategoryName = propValue;
                                        break;
                                    }
                                }
                            }
                            
                            let styleInfo;
                            if (mainLayerConfig.subcategories && mainLayerConfig.subcategories[subCategoryName]?.style) {
                                styleInfo = mainLayerConfig.subcategories[subCategoryName].style;
                            } else {
                                styleInfo = mainLayerConfig.defaultPointStyle || detailedStyles["طبقة غير مصنفة"].defaultPointStyle;
                            }
                            return L.marker(latlng, { icon: createFeatureIcon(styleInfo) });
                        },
                        style: (feature) => {
                            const currentMainLayerName = feature.properties.derived_main_layer;
                            const currentMainLayerConfig = detailedStyles[currentMainLayerName] || detailedStyles["طبقة غير مصنفة"];

                            const subCategoryPropertyCandidates = ['النوع', 'SubCategory', 'type', 'Nature', 'طبيعة_المرفق', 'classification', 'fclass', 'amenity', 'shop', 'leisure', 'building', 'landuse'];
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
                            
                            let styleConfigToUse;
                            if (currentMainLayerConfig.subcategories && currentMainLayerConfig.subcategories[subCategoryName]?.styleConfig) {
                                styleConfigToUse = currentMainLayerConfig.subcategories[subCategoryName].styleConfig;
                            } else {
                                styleConfigToUse = currentMainLayerConfig.defaultLinePolyStyle || detailedStyles["طبقة غير مصنفة"].defaultLinePolyStyle;
                            }
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

                    // Layers to show by default
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
                layersControl.addTo(map); // Add to map first

                const layersControlElement = layersControl.getContainer();
                if (layersControlElement) {
                     // Move it to the custom container
                    layersControlContainer.appendChild(layersControlElement);
                }
                styleLayerControl(); // Style it after moving
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
// =============================================================
// == كود إخراج الخريطة إلى PDF (النسخة المنقحة والموحدة) ==
// =============================================================
    const exportButton = document.getElementById('exportPdfButton');
    const legendElementForPdf = document.getElementById('custom-legend'); // Ensure this ID is correct for the legend used in PDF   
if (exportButton && mapElement && legendElementForPdf) { // Use legendElementForPdf here
    console.log('PDF Export Setup: Elements found, adding listener.');
    exportButton.addEventListener('click', function () {
        console.log('PDF Export Action: Button CLICKED!');
        if (typeof html2canvas === 'undefined') {
            console.error('PDF Export Error: html2canvas library is not loaded!');
            alert('خطأ: مكتبة html2canvas غير محملة. لا يمكن تصدير PDF.');
            return;
        }
        if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
            console.error('PDF Export Error: jsPDF library is not loaded or not available under window.jspdf!');
            alert('خطأ: مكتبة jsPDF غير محملة. لا يمكن تصدير PDF.');
            return;
        }

        exportButton.disabled = true;
        const originalButtonHtml = exportButton.innerHTML;
        exportButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            جارٍ الإعداد...
        `;

        const zoomControlElement = map.getContainer().querySelector('.leaflet-control-zoom');
        const layersControlElementFromContainer = document.querySelector('#layers-control-container .leaflet-control-layers');
        const directLayersControlElement = map.getContainer().querySelector('.leaflet-control-layers:not(#layers-control-container .leaflet-control-layers)');

        if (zoomControlElement) zoomControlElement.style.visibility = 'hidden';
        if (layersControlElementFromContainer) layersControlElementFromContainer.style.visibility = 'hidden';
        if (directLayersControlElement) directLayersControlElement.style.visibility = 'hidden';


        setTimeout(() => {
            console.log('PDF Export Action: Starting html2canvas...');
            const canvasOptions = {
                useCORS: true, allowTaint: true, logging: false, scale: window.devicePixelRatio > 1 ? 1.5 : 1,
                onclone: (clonedDocument) => {
                    const clonedZoom = clonedDocument.querySelector('.leaflet-control-zoom');
                    const clonedLayersContainer = clonedDocument.querySelector('#layers-control-container .leaflet-control-layers');
                    const clonedDirectLayers = clonedDocument.querySelector('.leaflet-control-layers:not(#layers-control-container .leaflet-control-layers)'); // Check in cloned doc
                    if(clonedZoom) clonedZoom.style.visibility = 'hidden';
                    if(clonedLayersContainer) clonedLayersContainer.style.visibility = 'hidden';
                    if(clonedDirectLayers) clonedDirectLayers.style.visibility = 'hidden';
                }
            };

            Promise.all([
                html2canvas(mapElement, canvasOptions),
                html2canvas(legendElementForPdf, { ...canvasOptions, scale: 1 }) // Use legendElementForPdf
            ]).then(function ([mapCanvas, legendCanvas]) {
                console.log('PDF Export Action: html2canvas finished successfully.');

                if (zoomControlElement) zoomControlElement.style.visibility = 'visible';
                if (layersControlElementFromContainer) layersControlElementFromContainer.style.visibility = 'visible';
                if (directLayersControlElement) directLayersControlElement.style.visibility = 'visible';

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
                const maxMapHeight = pdfHeight * 0.75;
                if (mapPdfHeight > maxMapHeight) { mapPdfHeight = maxMapHeight; mapPdfWidth = mapPdfHeight * mapAspectRatio; }
                if (mapPdfWidth > pdfWidth - (2 * margin)) { mapPdfWidth = pdfWidth - (2 * margin); mapPdfHeight = mapPdfWidth / mapAspectRatio; }
                const legendAspectRatio = legendCanvas.width / legendCanvas.height;
                const availableHeightForLegend = pdfHeight - mapPdfHeight - (3 * margin);
                let legendPdfHeight = Math.min(availableHeightForLegend, 60);
                let legendPdfWidth = legendPdfHeight * legendAspectRatio;
                if (legendPdfWidth > pdfWidth - (2 * margin)) { legendPdfWidth = pdfWidth - (2 * margin); legendPdfHeight = legendPdfWidth / legendAspectRatio; if (legendPdfHeight > availableHeightForLegend) { legendPdfHeight = availableHeightForLegend; legendPdfWidth = legendPdfHeight * legendAspectRatio; }}
                let legendX = margin; let legendY = margin + mapPdfHeight + margin;
                if (legendY + legendPdfHeight > pdfHeight - margin) { legendPdfHeight = Math.max(5, pdfHeight - legendY - margin); legendPdfWidth = legendPdfHeight * legendAspectRatio; if (legendPdfWidth > pdfWidth - (2 * margin)) { legendPdfWidth = pdfWidth - (2 * margin); } legendX = margin; }
                pdf.addImage(mapImgData, 'PNG', margin, margin, mapPdfWidth, mapPdfHeight);
                pdf.addImage(legendImgData, 'PNG', legendX, legendY, legendPdfWidth, legendPdfHeight);
                pdf.setFontSize(10); pdf.setTextColor(100);
                pdf.text('خريطة جماعة العطاوية - نظام المعلومات الجغرافي', margin, margin - 4);
                try { pdf.text(new Date().toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' }), pdfWidth - margin, margin - 4, { align: 'right' }); } catch (e) { pdf.text(new Date().toLocaleDateString(), pdfWidth - margin, margin - 4, { align: 'right' }); }
                pdf.save('خريطة_العطاوية.pdf');
                exportButton.disabled = false; exportButton.innerHTML = originalButtonHtml;
                console.log('PDF Export Action: Process completed successfully.');
            }).catch(function(error) {
                console.error('PDF Export Error:', error);
                alert('حدث خطأ أثناء محاولة إخراج الخريطة. يرجى مراجعة الكونسول (F12).');
                if (zoomControlElement) zoomControlElement.style.visibility = 'visible';
                if (layersControlElementFromContainer) layersControlElementFromContainer.style.visibility = 'visible';
                if (directLayersControlElement) directLayersControlElement.style.visibility = 'visible';
                exportButton.disabled = false; exportButton.innerHTML = originalButtonHtml;
            });
        }, 150);
    });
} else {
    console.error('PDF Export Setup Error: Required elements missing.');
    if (!exportButton) console.error('- "exportPdfButton" not found.');
    if (!mapElement) console.error('- "map" not found.');
    if (!legendElementForPdf) console.error('- Legend element with ID "custom-legend" not found for PDF export.');
}
// --- نهاية كود إخراج PDF ---
            const exportDataBtn = document.getElementById('export-data-btn'); 
            if (exportDataBtn) { 
                exportDataBtn.addEventListener('click', () => { 
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
        const legendContainerId = 'custom-legend'; // This ID must match the one used for PDF export
        let legendDiv = document.getElementById(legendContainerId);

        if (!legendDiv) {
            legendDiv = document.createElement('div');
            legendDiv.id = legendContainerId;
            if (containerElement) {
                containerElement.appendChild(legendDiv);
            } else {
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
                            if (isLine) {
                                iconHtml = sc.dashArray ? `<svg width="20" height="10" style="margin-right:5px; vertical-align:middle;"><line x1="0" y1="5" x2="20" y2="5" style="stroke:${sc.color || '#000'}; stroke-width:${Math.max(1, (sc.weight || 2))}px; stroke-dasharray:${String(sc.dashArray).replace(/,/g, ' ')};" /></svg>` : `<span style="display:inline-block; width:16px; height:${Math.max(2, (sc.weight || 2))}px; background-color:${sc.color || '#000'}; margin-right:5px; vertical-align:middle;"></span>`;
                            } else {
                                iconHtml = `<span style="background-color:${sc.fillColor || 'transparent'}; border: ${(sc.weight || 1)}px solid ${sc.color || '#000'}; width:16px; height:10px; display:inline-block; margin-right:5px; vertical-align:middle; opacity:${(typeof sc.fillOpacity !== 'undefined' ? sc.fillOpacity : 1)};"></span>`;
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
                        const isLine = mainLayerName === "شبكة الطرق" || mainLayerName === "حدود إدارية العطاوية" || (sc.weight && (!sc.fillColor || sc.fillColor === 'transparent' || sc.fillColor === 'none' || sc.fillOpacity === 0));
                        if (isLine) {
                             iconHtml = sc.dashArray ? `<svg width="20" height="10" style="margin-right:5px; vertical-align:middle;"><line x1="0" y1="5" x2="20" y2="5" style="stroke:${sc.color || '#000'}; stroke-width:${Math.max(1, (sc.weight || 2))}px; stroke-dasharray:${String(sc.dashArray).replace(/,/g, ' ')};" /></svg>` : `<span style="display:inline-block; width:16px; height:${Math.max(2, (sc.weight || 2))}px; background-color:${sc.color || '#000'}; margin-right:5px; vertical-align:middle;"></span>`;
                        } else {
                             iconHtml = `<span style="background-color:${sc.fillColor || 'transparent'}; border: ${(sc.weight || 1)}px solid ${sc.color || '#000'}; width:16px; height:10px; display:inline-block; margin-right:5px; vertical-align:middle; opacity:${(typeof sc.fillOpacity !== 'undefined' ? sc.fillOpacity : 1)};"></span>`;
                        }
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

    if (btnContact && contactModal) { btnContact.onclick = () => contactModal.style.display = "block"; }
    if (spanClose && contactModal) { spanClose.onclick = () => contactModal.style.display = "none"; }

    if (showCommentsBtn && commentsModal && closeCommentsModalBtn) {
        showCommentsBtn.onclick = () => commentsModal.style.display = 'block';
        closeCommentsModalBtn.onclick = () => commentsModal.style.display = 'none';
    }

    window.addEventListener('click', function(event) {
        if (event.target == contactModal) contactModal.style.display = "none";
        if (event.target == commentsModal) commentsModal.style.display = 'none';
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
