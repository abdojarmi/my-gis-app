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
        displayName: "توزيع الماء والكهرباء",
        subcategories: {
            "مكتب توزيع الماء والكهرباء": { displayName: "مكتب توزيع", style: { symbol: 'building', color: '#ADD8E6', size: 20 } },
            "محطة معالجة المياه": { displayName: "محطة معالجة مياه", style: { symbol: 'circle', color: '#1E90FF', size: 20 } },
            "خزان مياه": { displayName: "خزان مياه", style: { symbol: 'square', color: '#87CEFA', size: 18 } },
            "محول كهرباء": { displayName: "محول كهرباء", style: { symbol: 'lightningBolt', color: '#FFD700', size: 20 } }
        },
        defaultPointStyle: { symbol: 'pin', color: '#B0E0E6', size: 18 }
    },
    "طبقة المباني": { // الآن نقطية حسب وصفك
        displayName: "طبقة المباني",
        subcategories: {
            "خدماتي": { displayName: "خدماتي", style: { symbol: 'building', color: "#BDB76B", size: 18 } }, // أصفر داكن
            "سكني": { displayName: "سكني", style: { symbol: 'building', color: "#A9A9A9", size: 18 } }    // رمادي
        },
        defaultPointStyle: { symbol: 'building', color: '#C0C0C0', size: 16 }
    },
    "محطات الوقود": { // نقطية، لا فئات فرعية
        displayName: "محطات الوقود",
        defaultPointStyle: { symbol: 'pin', color: '#FF0000', size: 20 } // أحمر
    },
    "التعليم والتكوين وتشغيل الكفاءات": {
        displayName: "التعليم والتكوين",
        subcategories: {
            "إدارة تربوية": { displayName: "إدارة تربوية", style: { symbol: 'building', color: '#483D8B', size: 20 } }, // بنفسجي داكن
            "تعليم أولي": { displayName: "تعليم أولي", style: { symbol: 'circle', color: '#FFD700', size: 16 } }, // أصفر
            "تعليم ابتدائي": { displayName: "تعليم ابتدائي", style: { symbol: 'circle', color: '#90EE90', size: 18 } }, // أخضر فاتح
            "تعليم متوسط": { displayName: "تعليم متوسط", style: { symbol: 'circle', color: '#32CD32', size: 18 } }, // أخضر ليموني
            "تعليم تأهيلي": { displayName: "تعليم تأهيلي", style: { symbol: 'circle', color: '#008000', size: 20 } }, // أخضر
            "تعليم خصوصي": { displayName: "تعليم خصوصي", style: { symbol: 'square', color: '#8A2BE2', size: 18 } }, // بنفسجي
            "معهد تقني": { displayName: "معهد تقني", style: { symbol: 'square', color: '#A52A2A', size: 20 } },    // بني
            "دعم تشغيل الشباب": { displayName: "دعم تشغيل الشباب", style: { symbol: 'pin', color: '#00CED1', size: 18 } } // تركواز
        },
        defaultPointStyle: { symbol: 'pin', color: '#DDA0DD', size: 16 } // بنفسجي فاتح
    },
    "التشوير الطرقي": {
        displayName: "التشوير الطرقي",
        subcategories: {
            "أضواء مرور": { displayName: "أضواء مرور", style: { type: 'text', content: '🚦', size: 18 } },
            "علامة توقف": { displayName: "علامة توقف", style: { type: 'text', content: '🛑', size: 18, color: 'red', backgroundColor: 'white', borderColor: 'red' } },
            "علامة إلزامية": { displayName: "علامة إلزامية", style: { type: 'text', content: '➡️', size: 18, color: 'white', backgroundColor: 'blue', borderColor: 'blue' } }, // سهم أزرق
            "علامة تحديد السرعة": { displayName: "علامة تحديد السرعة", style: { type: 'text', content: '⁶⁰', size: 18, color: 'black', backgroundColor: 'white', borderColor: 'red', borderRadius: '50%'} }, // مثال لـ 60
            "علامة تحذير": { displayName: "علامة تحذير", style: { type: 'text', content: '⚠️', size: 18, color: 'black', backgroundColor: 'yellow', borderColor: 'black' } }, // مثلث أصفر
            "علامة منع": { displayName: "علامة منع", style: { type: 'text', content: '⛔', size: 18, color: 'white', backgroundColor: 'red', borderRadius: '50%' } }, // دائرة حمراء
            "لوحة تشوير مركبة": { displayName: "لوحة تشوير مركبة", style: { symbol: 'square', color: '#4682B4', size: 16 } } // أزرق فولاذي
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
            "نقطة توقف الحافلات": { displayName: "نقطة توقف الحافلات", style: { symbol: 'pin', color: '#0000FF', size: 20 } }, // أزرق
            "محطة الطاكسيات": { displayName: "محطة الطاكسيات", style: { symbol: 'pin', color: '#FFFF00', size: 20, path:'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM3 6h10v6H3V6z', viewBox:'0 0 24 24'} }, // أيقونة سيارة أجرة
            "موقف مؤدى عنه": { displayName: "موقف مؤدى عنه", style: { type: 'text', content: '🅿️', size: 18 } } // رمز P
        },
        defaultPointStyle: { symbol: 'pin', color: '#FFA500', size: 18 }
    },
    "الامن والوقاية المدنية": {
        displayName: "الأمن والوقاية المدنية",
        subcategories: {
            "مركز شرطة": { displayName: "مركز شرطة", style: { symbol: 'building', color: '#00008B', size: 20 } }, // أزرق داكن
            "مركز أمني": { displayName: "مركز أمني", style: { symbol: 'building', color: '#4169E1', size: 20 } }, // أزرق ملكي
            "مركز خدمة الطوارئ": { displayName: "مركز طوارئ", style: { symbol: 'plusSign', color: '#FF4500', size: 22 } }, // برتقالي أحمر
            "مصلحة الوثائق الوطنية": { displayName: "مصلحة وثائق", style: { symbol: 'building', color: '#2E8B57', size: 18 } } // أخضر بحري
        },
        defaultPointStyle: { symbol: 'pin', color: '#B22222', size: 18 } // أحمر ناري
    },
    "المالية والجبايات": {
        displayName: "المالية والجبايات",
        subcategories: {
            "بنك/مؤسسة بريدية": { displayName: "بنك/بريد", style: { symbol: 'building', color: '#FFD700', size: 20 } }, // أصفر
            "إدارة ضمان اجتماعي": { displayName: "ضمان اجتماعي", style: { symbol: 'building', color: '#DA70D6', size: 18 } }, // أوركيد
            "إدارة مالية": { displayName: "إدارة مالية", style: { symbol: 'building', color: '#008080', size: 20 } }, // أخضر مزرق
            "بنك": { displayName: "بنك", style: { symbol: 'building', color: '#CD853F', size: 20 } } // بيرو (بني فاتح)
        },
        defaultPointStyle: { symbol: 'pin', color: '#20B2AA', size: 18 } // تركواز فاتح
    },
    "المرافق التجارية": { // نقطية، لا فئات فرعية
        displayName: "المرافق التجارية",
        defaultPointStyle: { symbol: 'circle', color: '#8B4513', size: 18 } // بني سادلي
    },
    "الادارات الترابية": { // نقطية، لا فئات فرعية
        displayName: "الإدارات الترابية",
        defaultPointStyle: { symbol: 'building', color: '#778899', size: 22 } // رمادي فاتح مزرق
    },
    "المرافق الرياضية والترفيهية": {
        displayName: "المرافق الرياضية والترفيهية",
        subcategories: {
            "ثقافي وترفيهي": { displayName: "ثقافي وترفيهي", style: { symbol: 'square', color: '#FF69B4', size: 18 } }, // وردي فاقع
            "رياضي/ترفيهي": { displayName: "رياضي/ترفيهي", style: { symbol: 'square', color: '#3CB371', size: 18 } }, // أخضر متوسط
            "ثقافي": { displayName: "ثقافي", style: { symbol: 'pin', color: '#BA55D3', size: 18 } },          // أوركيد متوسط
            "رياضي": { displayName: "رياضي", style: { symbol: 'pin', color: '#4682B4', size: 18 } }           // أزرق فولاذي
        },
        defaultPointStyle: { symbol: 'pin', color: '#6A5ACD', size: 16 } // أزرق بنفسجي
    },
    "شبكة الطرق": { // خطية
        displayName: "شبكة الطرق",
        subcategories: { // **تأكد من أن خاصية الفئة الفرعية للطرق موجودة في بياناتك**
            "طريق رئيسية": { displayName: "طريق رئيسية", styleConfig: { color: "#000000", weight: 5 } },
            "طريق ثانوية": { displayName: "طريق ثانوية", styleConfig: { color: "#444444", weight: 4 } },
            "طريق ثلاثية": { displayName: "طريق ثلاثية", styleConfig: { color: "#777777", weight: 3 } },
            "طريق ريفية": { displayName: "طريق ريفية", styleConfig: { color: "#999999", weight: 2.5, dashArray: '5, 5' } },
            "ممر": { displayName: "ممر", styleConfig: { color: "#BBBBBB", weight: 2 } },
            "ممر مسدود": { displayName: "ممر مسدود", styleConfig: { color: "#FF0000", weight: 1.5, dashArray: '2, 4' } },
            "ممر الالتفاف": { displayName: "ممر الالتفاف", styleConfig: { color: "#008000", weight: 2 } }, // أخضر
            "جسر": { displayName: "جسر", styleConfig: { color: "#0000CD", weight: 3, lineCap: "butt" } }, // أزرق متوسط
            "مفترق دوار": { displayName: "مفترق دوار", styleConfig: { color: "#FFA500", weight: 2.5 } }, // برتقالي
            "وصلة الخروج من المدارة": { displayName: "وصلة خروج مدارة", styleConfig: { color: "#DC143C", weight: 2 } }, // قرمزي
            "وصلة الدخول إلى المدارة": { displayName: "وصلة دخول مدارة", styleConfig: { color: "#228B22", weight: 2 } } // أخضر غابي
        },
        defaultLinePolyStyle: { color: "#666666", weight: 3 }
    },
    "المناطق الخضراء والزراعة": { // مساحية
        displayName: "المناطق الخضراء والزراعة",
        subcategories: { // **تأكد من أن خاصية الفئة الفرعية للمناطق الخضراء موجودة**
            "المغروسات": { displayName: "المغروسات", styleConfig: { fillColor: "#228B22", color: "#006400", weight: 1, fillOpacity: 0.6 } }, // أخضر غابي
            "المزروعات": { displayName: "المزروعات", styleConfig: { fillColor: "#9ACD32", color: "#6B8E23", weight: 1, fillOpacity: 0.6 } }, // أخضر مصفر
            "حديقة عامة": { displayName: "حديقة عامة", styleConfig: { fillColor: "#3CB371", color: "#2E8B57", weight: 1, fillOpacity: 0.7 } }, // أخضر متوسط
            "شريط أخضر": { displayName: "شريط أخضر", styleConfig: { fillColor: "#98FB98", color: "#00FA9A", weight: 1, fillOpacity: 0.7 } }, // أخضر باهت
            "منتزه": { displayName: "منتزه", styleConfig: { fillColor: "#00FF7F", color: "#3CB371", weight: 1, fillOpacity: 0.6 } }    // أخضر ربيعي
        },
        defaultLinePolyStyle: { fillColor: "#ADFF2F", color: "#556B2F", weight: 1, fillOpacity: 0.5 } // أخضر ليموني
    },
    "أحياء": { // مساحية، حسب الكثافة
        displayName: "أحياء (الكثافة السكانية)",
        subcategories: { // **ستحتاج إلى خاصية في بيانات الأحياء تحتوي على هذه النطاقات أو قيمة الكثافة الفعلية**
            "0- 1168": { displayName: "0-1168 فرد/كم²", styleConfig: { fillColor: "#FFFFCC", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } }, // أصفر فاتح جداً
            "1168- 5947": { displayName: "1168-5947 فرد/كم²", styleConfig: { fillColor: "#A1DAB4", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } }, // أخضر فاتح
            "5947- 8851": { displayName: "5947-8851 فرد/كم²", styleConfig: { fillColor: "#66C2A5", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } }, // أخضر
            "8851- 11179": { displayName: "8851-11179 فرد/كم²", styleConfig: { fillColor: "#2CA25F", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } }, // أخضر أغمق
            "11179- 14469": { displayName: "11179-14469 فرد/كم²", styleConfig: { fillColor: "#006D2C", color: "#BDBDBD", weight: 1, fillOpacity: 0.7 } } // أخضر داكن جداً
        },
        defaultLinePolyStyle: { fillColor: "#F0F0F0", color: "#888888", weight: 1, fillOpacity: 0.6 }
    },
    "حدود إدارية العطاوية": { // خطية
        displayName: "حدود إدارية العطاوية",
        defaultLinePolyStyle: { color: "#FF00FF", weight: 3.5, opacity: 0.9, fillOpacity: 0 } // بنفسجي، بدون تعبئة إذا كانت خطوط فقط
    },
    "طبقة غير مصنفة": { // طبقة احتياطية
        displayName: "طبقة غير مصنفة",
        defaultPointStyle: { symbol: 'pin', color: '#999999', size: 16 },
        defaultLinePolyStyle: { color: "#AAAAAA", weight: 2, dashArray: '4,4' }
    }
};
