// انتظر حتى يتم تحميل DOM بالكامل
document.addEventListener('DOMContentLoaded', function() { // <<< هذا هو المستمع الأول والرئيسي والوحيد الذي يجب أن يلف كل شيء

    // --- الحصول على عناصر DOM الرئيسية ---
    // var mapElement = document.getElementById('map'); // لا حاجة لتعريفه هنا إذا تم تعريفه لاحقًا عند الحاجة
    var contactModal = document.getElementById("contactModal");
    var btnContact = document.getElementById("contactBtnHeader");
    var spanCloseContact = document.querySelector("#contactModal .close-button"); // استخدام querySelector لـ ID

    // --- الحصول على عناصر DOM الخاصة بالتعليقات ---
    var showCommentsBtn = document.getElementById('showCommentsBtn');
    var commentsModal = document.getElementById('commentsModal');
    var closeCommentsModalBtn = document.getElementById('closeCommentsModalBtn');
    var commentForm = document.getElementById('commentForm');
    var commentsListDiv = document.getElementById('comments-list');

    // 1. تهيئة الخريطة
    var map = L.map('map', {
        zoomControl: false
    }).setView([31.785, -7.285], 13);

    // 2. إضافة طبقة أساس (TileLayer)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // --- (كل دوالك: symbolLibrary, createFeatureIcon, detailedStyles, getLayerName, createPopupContent, updateCustomLegend, styleLayerControl) ---
    // ... (ضع كل هذه الدوال هنا كما هي) ...

    const createdLayers = {};
    const layerControlEntries = {};

    fetch('Attaouia_GeoData.geojson')
        .then(response => response.json())
        .then(data => {
            // ... (كل كود معالجة GeoJSON وإضافة الطبقات وإنشاء المفتاح هنا كما هو) ...
            // بما في ذلك استدعاء updateCustomLegend(leftControlsArea);

            // --- الآن، بعد تحميل البيانات وإنشاء المفتاح، يمكننا إضافة مستمع زر PDF ---
            console.log('PDF Export Setup: Attempting to set up after GeoJSON loaded.');
            const exportButton = document.getElementById('exportPdfButton');
            const mapElementForPdf = document.getElementById('map'); // اسم مختلف لتجنب التضارب مع var map
            const legendElementForPdf = document.getElementById('custom-legend');

            console.log('PDF Export Setup (after GeoJSON): exportButton:', exportButton);
            console.log('PDF Export Setup (after GeoJSON): mapElementForPdf:', mapElementForPdf);
            console.log('PDF Export Setup (after GeoJSON): legendElementForPdf:', legendElementForPdf);

            if (exportButton && mapElementForPdf && legendElementForPdf) {
                console.log('PDF Export Setup (after GeoJSON): All elements found. Adding click listener.');
                exportButton.addEventListener('click', function () {
                    console.log('PDF Export Action: Button CLICKED!');
                    // --- الكود الكامل لـ html2canvas و jsPDF هنا ---
                    // (استخدم mapElementForPdf و legendElementForPdf)
                    // ... (الكود الذي يبدأ بـ exportButton.disabled = true; ...) ...
                });
            } else {
                console.error('PDF Export Setup (after GeoJSON): One or more required elements not found!');
                if (!exportButton) console.error('PDF Export Setup: exportPdfButton not found.');
                if (!mapElementForPdf) console.error('PDF Export Setup: mapElement (#map) not found.');
                if (!legendElementForPdf) console.error('PDF Export Setup: legendElement (#custom-legend) not found.');
            }
        })
        .catch(error => {
            console.error('Error loading/processing GeoJSON:', error);
            // ...
        });


    // =============================================================
    // == كود النافذة المنبثقة لـ "اتصل بنا" (Contact Us Modal) ==
    // =============================================================
    if (btnContact && contactModal && spanCloseContact) {
        btnContact.onclick = function() {
            contactModal.style.display = "block";
        }
        spanCloseContact.onclick = function() { // استخدم spanCloseContact المعرف بـ querySelector
            contactModal.style.display = "none";
        }
    }
    // عندما يضغط المستخدم في أي مكان خارج محتوى النافذة، أغلقها (اتصل بنا)
    window.addEventListener('click', function(event) { // استخدم addEventListener
        if (contactModal && event.target == contactModal) {
            contactModal.style.display = "none";
        }
    });


    // --- وظيفة النافذة المنبثقة للتعليقات ---
    if (showCommentsBtn && commentsModal && closeCommentsModalBtn) {
        showCommentsBtn.onclick = function() {
            commentsModal.style.display = 'block';
        }
        closeCommentsModalBtn.onclick = function() {
            commentsModal.style.display = 'none';
        }
        // إغلاق نافذة التعليقات عند النقر خارج محتواها
        window.addEventListener('click', function(event) { // لاحظ: هذا سيكتب فوق window.onclick السابق إذا لم يتم دمجهما
            if (commentsModal && event.target == commentsModal) {
                commentsModal.style.display = 'none';
            }
        }); // من الأفضل دمج مستمعات window.onclick
    } else {
        // ... (رسائل الخطأ للتعليقات) ...
    }

    // (اختياري) التعامل مع إرسال نموذج التعليق
    if (commentForm && commentsListDiv) {
        commentForm.onsubmit = function(event) {
            // ... (كود إرسال التعليق) ...
        };
    }
    // =============================================================
    // == نهاية كود النوافذ المنبثقة ==
    // =============================================================

}); // <<<<<<<<<<<<<<<<<<<<<<< نهاية مستمع DOMContentLoaded الرئيسي والوحيد
