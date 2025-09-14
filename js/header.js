// دالة تضع عنصر header كأول عنصر في الصفحة (كما في كودك الأصلي مع قليل تحسين)
function prependHeader(headerEl) {
  if (!headerEl) return;

  const doPrepend = () => {
    // تجنب إضافة الهيدر أكثر من مرة
    if (document.body.querySelector("header") === headerEl) return;

    if (document.body.prepend) {
      document.body.prepend(headerEl);
    } else {
      document.body.insertBefore(headerEl, document.body.firstChild);
    }
  };

  if (document.body) {
    doPrepend();
  } else {
    document.addEventListener("DOMContentLoaded", doPrepend, { once: true });
  }
}

// --- إنشاء الـ header بدون onClick وبدون attribute "clicked" ---
const header = document.createElement("header");
header.innerHTML = `
    <a href="#" class="logo">
      <img src="../image/logo.png" alt="failed to load logo"/>
    </a>
    <nav>
      <ul>
        <li class="nav-item" tabindex="0" id="new-page"><a href="#" class="nav-links">New</a></li>
        <li class="nav-item" tabindex="0" id="popular-page"><a href="#" class="nav-links">Popular</a></li>
      </ul>
    </nav>
  `;

// أضف الـ header إلى الصفحة
prependHeader(header);

// الآن نضيف المُستمعين للأحداث للعناصر داخل header (يمكن إضافتهم قبل الإدراج أيضاً)
const navItems = header.querySelectorAll(".nav-item");

navItems.forEach((item) => {
  // عند النقر نزيل الكلاس من الجميع ونضيفه للعُنصر المضغوط فقط
  item.addEventListener("click", function (e) {
    // منع التنقل الافتراضي عند الروابط التي تستخدم #
    const anchor = item.querySelector("a");
    if (anchor) {
      const href = anchor.getAttribute("href");
      if (href === "#" || href === "index.html") e.preventDefault();
    }

    // استدعاء معالجات الصفحات إذا كانت متوفرة
    // إذا لم نكن على صفحة index، خزّن الصفحة المطلوبة واذهب إلى index.html
    const isIndex =
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname === "/" ||
      window.location.pathname.endsWith("/move-wepsite") ||
      window.location.pathname.endsWith("/move-wepsite/");
    if (item.id === "new-page") {
      if (isIndex) {
        // remove cached moviesList so getCardData fetches fresh 'now playing' movies
        try {
          sessionStorage.removeItem("moviesList");
        } catch (e) {}
        if (typeof window.getCardData === "function") window.getCardData();
      } else {
        try {
          sessionStorage.setItem("openPage", "new");
        } catch (e) {}
        // navigate to index (index.html is in the same folder as details.html)
        window.location.href = "index.html";
      }
    }
    if (item.id === "popular-page") {
      if (isIndex) {
        if (typeof window.showPopularMovies === "function")
          window
            .showPopularMovies()
            .catch((err) =>
              console.error("Failed to show popular movies", err)
            );
      } else {
        try {
          sessionStorage.setItem("openPage", "popular");
        } catch (e) {}
        window.location.href = "index.html";
      }
    }
    // إذا كنت لا تريد أن يتبع الرابط (مثلاً #)، ألغِ السلوك الافتراضي
    // const anchor = item.querySelector('a');
    // if (anchor && anchor.getAttribute('href') === '#') e.preventDefault();

    navItems.forEach((i) => i.classList.remove("active-line"));
    item.classList.add("active-line");
    // persist which nav is active so details page can restore it
    try {
      if (item.id === "new-page") sessionStorage.setItem("activeNav", "new");
      else if (item.id === "popular-page")
        sessionStorage.setItem("activeNav", "popular");
      else sessionStorage.removeItem("activeNav");
    } catch (e) {}
  });

  // دعم لوحة المفاتيح (Enter أو Space)
  item.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // منع التمرير عند مسافة
      item.click();
    }
  });
});

// (اختياري) لو تريد تفعيل اختيار افتراضي عند التحميل:
// restore active nav from session if present
try {
  const persisted = sessionStorage.getItem("activeNav");
  if (persisted === "popular") {
    const p = header.querySelector("#popular-page");
    p?.classList.add("active-line");
  } else if (persisted === "new") {
    const n = header.querySelector("#new-page");
    n?.classList.add("active-line");
  } else {
    if (!header.querySelector(".active-line")) {
      const newItem = header.querySelector("#new-page");
      newItem?.classList.add("active-line");
    }
  }
} catch (e) {
  const newItem = header.querySelector("#new-page");
  newItem?.classList.add("active-line");
}
