/* 每日海報週報 — newspaper / zine front page. → window.HomeNews
   Reuses PC (data), UI, TearCard, DayModal. Keeps tear ritual + detail modal + month index. */
(function () {
  const { useState, useRef, useCallback, useEffect } = React;
  const e = React.createElement;
  const PC = window.PC, UI = window.UI, Icon = UI.Icon;
  const isToday = (en) => en.month === PC.TODAY.month && en.day === PC.TODAY.day;

  // ── shared bits ──
  const Mark = ({ children, color }) =>
    e("span", { className: "np-mark", style: { backgroundImage: `linear-gradient(${color}, ${color})` } }, children);

  const Ph = ({ tag, label, height, style, src }) =>
    src
      ? e("div", { className: "np-ph np-ph-photo", "data-tag": tag, title: label, style: { height, ...style } },
          e("img", { src, alt: label, loading: "lazy" }))
      : e("div", { className: "np-ph", "data-tag": tag, style: { height, ...style } },
          e("div", { className: "np-ph-label" }, label));

  // newspaper-style section header: ■ LABEL ─────── + serif headline (no running numbers)
  const FeatureHead = ({ kicker, children, mb }) =>
    e("div", { style: { marginBottom: mb || 14 } },
      kicker && e("div", { className: "np-kicker", style: { display: "flex", alignItems: "center", gap: 9, marginBottom: 9 } },
        e("span", { style: { width: 8, height: 8, background: "var(--ink)", flexShrink: 0 } }),
        e("span", { style: { flexShrink: 0 } }, kicker),
        e("span", { style: { flex: 1, height: 1, background: "var(--rule-soft)" } })),
      e("h3", { className: "np-serif", style: { fontSize: 24, fontWeight: 800, lineHeight: 1.15, margin: 0 } }, children));

  // CSS barcode (newspaper convention)
  const Barcode = ({ height = 40, label }) => {
    const ws = [2,1,3,1,1,2,1,3,2,1,1,2,3,1,2,1,1,3,1,2,2,1,3,1,1,2,1,2,3,1,1,2,1,3,2,1,2,1];
    return e("div", null,
      e("div", { style: { display: "flex", alignItems: "stretch", gap: 1, height } },
        ws.map((w, i) => e("div", { key: i, style: { width: w, background: i % 2 ? "transparent" : "var(--ink)" } }))),
      label && e("div", { className: "np-mono", style: { fontSize: 9, letterSpacing: "0.24em", color: "var(--ink-soft)", marginTop: 4 } }, label));
  };

  const CAT_BLURB = {
    h: "節慶與紀念的日子", i: "世界共同關注的紀念日", n: "二十四節氣與自然時序",
    p: "勵志、成長與自我對話", c: "藝術、設計與文化", l: "生活風格與日常美學", d: "值得發聲的社會議題",
  };

  // 創作者欄 (sits in the front-page left column, beneath 今日主題)
  const IG = "https://www.instagram.com/dddotty/", SPONSOR = "https://portaly.cc/dotty/support";

  // simple mailbox illustration (envelope in a stamped frame)
  function Mailbox() {
    return e("div", { style: { position: "relative", width: 54, height: 54, border: "1.5px solid var(--ink)", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-2)" } },
      e(Icon, { name: "mail", size: 28, stroke: 1.6 }));
  }
  function CreatorBox() {
    return e("div", { style: { position: "relative", marginTop: 26, paddingTop: 20, borderTop: "1px solid var(--rule)" } },
      e(FeatureHead, { kicker: "創作者 · ABOUT THE MAKER", mb: 14 },
        "Dotty", e("span", { className: "np-script", style: { fontSize: 18, color: "var(--indigo)", whiteSpace: "nowrap", marginLeft: 10 } }, "設計師 · 維護者")),
      e("div", { style: { display: "flex", gap: 16, alignItems: "flex-start" } },
        e(Ph, { tag: "PHOTO", label: "創作者照片", height: 116, src: "images/creator.jpg", style: { width: 116, flexShrink: 0 } }),
        e("p", { className: "np-body", style: { margin: 0, flex: 1 } },
          "「主題日報」的創作者與維護者。每天為設計師整理一個值得創作的主題——從節氣、節日到社會議題，把 365 天化作 365 個練習的理由。")),
      e("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 16 } },
        e("a", { href: IG, target: "_blank", rel: "noopener noreferrer", style: linkBtn("ghost") }, e(Icon, { name: "instagram", size: 14 }), "Instagram"),
        e("a", { href: SPONSOR, target: "_blank", rel: "noopener noreferrer", style: linkBtn("solid") }, e(Icon, { name: "heart", size: 14 }), "贊助支持")),
      // 問題回報 / 意見回饋
      e("a", { href: "mailto:zfc2115i@gmail.com?subject=主題日報 意見回饋", style: { display: "block", marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--rule)", textDecoration: "none", color: "inherit" } },
        e("div", { className: "np-kicker", style: { display: "flex", alignItems: "center", gap: 9, marginBottom: 12 } },
          e("span", { style: { width: 8, height: 8, background: "var(--ink)", flexShrink: 0 } }),
          e("span", { style: { flexShrink: 0 } }, "讀者來信 · FEEDBACK"),
          e("span", { style: { flex: 1, height: 1, background: "var(--rule-soft)" } })),
        e("div", { className: "np-feedback", style: { display: "flex", alignItems: "center", gap: 16, border: "1px solid var(--ink)", padding: "14px 16px" } },
          e(Mailbox, null),
          e("div", { style: { minWidth: 0 } },
            e("div", { className: "np-serif", style: { fontSize: 18, fontWeight: 800, color: "var(--ink)" } }, "問題回報 / 意見回饋"),
            e("div", { style: { fontSize: 12, color: "var(--ink-soft)", marginTop: 3, lineHeight: 1.5 } }, "發現錯誤或有任何想法？寫信告訴我們："),
            e("div", { className: "np-mono", style: { fontSize: 13, fontWeight: 600, color: "var(--ink)", marginTop: 4, userSelect: "all", wordBreak: "break-all" } }, "zfc2115i@gmail.com")))));
  }
  function linkBtn(kind) {
    const solid = kind === "solid";
    return { display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 2, fontSize: 12.5, fontWeight: 700,
      textDecoration: "none", cursor: "pointer",
      background: solid ? "var(--btn-pink)" : "transparent", color: solid ? "var(--btn-pink-text)" : "var(--ink)",
      border: solid ? "1px solid var(--btn-pink-line)" : "1px solid var(--ink)",
      borderLeft: solid ? "5px solid var(--btn-pink-bar)" : "1px solid var(--ink)" };
  }

  // footer for 主題日報 — black bg, white text, no logo
  function NewsFooter() {
    const linkD = { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 500, textDecoration: "none", color: "rgba(245,242,236,0.6)" };
    return e("footer", { style: { background: "#2a1a11", color: "var(--bg)" } },
      e("div", { style: { maxWidth: 1200, margin: "0 auto", padding: "28px clamp(16px,4vw,40px) 26px" } },
        e("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 } },
          e("a", { href: "index.html", title: "回到首頁", style: { textDecoration: "none", color: "inherit", display: "flex", alignItems: "baseline", gap: 10 } },
            e("span", { className: "np-serif", style: { fontSize: 20, fontWeight: 800, lineHeight: 1 } }, "主題日報"),
            e("span", { className: "np-mono", style: { fontSize: 8.5, letterSpacing: "0.26em", color: "rgba(245,242,236,0.45)" } }, "THE THEME DAILY")),
          e("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 } },
            e("a", { href: "mailto:zfc2115i@gmail.com?subject=主題日報 意見回饋", style: linkD }, e(Icon, { name: "mail", size: 13 }), "問題回報 / 意見回饋"),
            e("a", { href: "Competitions.html", style: linkD }, e(Icon, { name: "trophy", size: 13 }), "設計比賽"),
            e("a", { href: "Logo Challenge.html", style: linkD }, e(Icon, { name: "hexagon", size: 13 }), "Logo 挑戰"),
            e("a", { href: IG, target: "_blank", rel: "noopener noreferrer", style: linkD }, e(Icon, { name: "instagram", size: 13 }), "Instagram"),
            e("a", { href: SPONSOR, target: "_blank", rel: "noopener noreferrer",
              style: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, textDecoration: "none", color: "var(--btn-pink-text)", background: "var(--btn-pink)", border: "1px solid var(--btn-pink-line)", borderLeft: "5px solid var(--btn-pink-bar)", padding: "6px 13px", borderRadius: 2 } },
              e(Icon, { name: "heart", size: 13 }), "贊助支持"))),
        e("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(245,242,236,0.14)" } },
          e("span", { className: "np-mono", style: { fontSize: 9, color: "rgba(245,242,236,0.38)", letterSpacing: "0.06em" } }, "© 2026 主題日報 · PRODUCED BY DOTTY · 每日更新，全年 365 期"),
          e("span", { className: "np-mono", style: { fontSize: 9, color: "rgba(245,242,236,0.38)", letterSpacing: "0.06em" } }, "本刊主題僅供創作參考 · 比賽資訊以各官方公告為準"))));
  }

  window.HomeNews = function HomeNews() {
    const [selected, setSelected] = useState(null);
    const [soundOn, setSoundOn] = useState(true);
    const [tearInfo, setTearInfo] = useState({ entry: PC.find(PC.TODAY.month, PC.TODAY.day), count: 0, isToday: true });
    const [viewMonth, setViewMonth] = useState(PC.TODAY.month);
    const tearRef = useRef(null);
    const idxRef = useRef(null);
    const [showTop, setShowTop] = useState(false);
    useEffect(() => {
      const h = () => setShowTop(window.scrollY > 600);
      window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
    }, []);
    const scrollTop = () => {
      const startY = window.scrollY, t0 = performance.now(), ease = (p) => 1 - Math.pow(1 - p, 3);
      (function tick(now) { const p = Math.min(1, (now - t0) / 460); window.scrollTo(0, startY * (1 - ease(p))); if (p < 1) requestAnimationFrame(tick); })(performance.now());
    };

    const today = PC.find(PC.TODAY.month, PC.TODAY.day);
    const tc = PC.CAT[today.category];

    // counts per category
    const counts = {}; PC.CAT_ORDER.forEach((k) => (counts[k] = 0));
    PC.DATA.forEach((d) => counts[d.category]++);

    // month picks: notable entries (holidays/international/design first), up to 6
    const monthEntries = PC.DATA.filter((d) => d.month === viewMonth);
    const picks = monthEntries.slice(0, 6);

    const modalNav = (dir) => {
      if (!selected) return;
      const i = PC.indexOf(selected.month, selected.day);
      const n = PC.DATA[Math.max(0, Math.min(PC.DATA.length - 1, i + dir))];
      setSelected(n);
    };
    const showMonth = (m) => { setViewMonth(m); setTimeout(() => { const el = idxRef.current; if (el) window.scrollTo({ top: el.offsetTop - 20, behavior: "smooth" }); }, 50); };

    return e("div", { className: "np", style: { minHeight: "100vh" } },
      e("div", { className: "np-paper" },
        e(window.NewsMasthead, { today, tc, tearRef, soundOn, setSoundOn, tearInfo, setTearInfo, openDay: setSelected }),
        e(window.NewsFeatures, { counts, viewMonth, showMonth, openDay: setSelected }),
        e("div", { ref: idxRef }, e(window.NewsIndex, { viewMonth, setViewMonth, openDay: setSelected })),
      ),
      e(NewsFooter),
      showTop && e("button", { onClick: scrollTop, title: "回到最上方", className: "pc-fade",
        style: { position: "fixed", right: 24, bottom: 24, zIndex: 120, width: 46, height: 46, borderRadius: "50%", border: "none",
          background: "var(--indigo)", color: "#fff", cursor: "pointer", boxShadow: "0 8px 22px oklch(0.40 0.22 275 / 0.3)", display: "flex", alignItems: "center", justifyContent: "center" } },
        e(Icon, { name: "arrowUp", size: 18 })),
      selected && e(window.DayModal, { entry: selected, isToday: isToday(selected),
        onClose: () => setSelected(null), onPrev: () => modalNav(-1), onNext: () => modalNav(1) }),
    );
  };

  // expose helpers for the split files
  window.NewsKit = { Mark, Ph, FeatureHead, CreatorBox, CAT_BLURB };
})();
