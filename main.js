const translations = {
    ar: {
      title: "مرحباً بك في Se7en Eyes",
      desc: "مجموعة هاكتفست دولية تستخدم الذكاء الاصطناعي لاستكشاف الأمن السيبراني والخصوصية وحرية المعلومات.",
      learn: "ادخل إلى الدردشة",
      'Translate to Arabic': "الترجمة إلى الإنجليزية",
      'الترجمة إلى الإنجليزية': "Translate to Arabic"
    },
    en: {
      title: "Welcome to Se7en Eyes",
      desc: "An international hacktivist group using AI to explore cybersecurity, privacy, and information freedom.",
      learn: "ENTER CHAT"
    }
  };
  
  let currentLang = 'en';
  
  document.getElementById("langToggle").addEventListener("click", () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      el.textContent = translations[currentLang][key];
    });
  
    // تبديل نص الزر نفسه
    const btn = document.getElementById("langToggle");
    const currentText = btn.textContent;
    btn.textContent = translations.ar[currentText] || translations.en[currentText];
  });