/* Logo 設計挑戰頁 — random brand brief generator. → window.LogoPage */
(function () {
  const { useState, useCallback, useEffect } = React;
  const e = React.createElement;
  const UI = window.UI, Icon = UI.Icon, BRAND = window.BRAND;

  function smoothTop() {
    const startY = window.scrollY, t0 = performance.now();
    const ease = (p) => 1 - Math.pow(1 - p, 3);
    (function tick(now) { const p = Math.min(1, (now - t0) / 420); window.scrollTo(0, startY * (1 - ease(p))); if (p < 1) requestAnimationFrame(tick); })(performance.now());
  }

  function Panel() {
    const [ch, setCh] = useState(null);
    const [gen, setGen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [flip, setFlip] = useState(0);

    const generate = useCallback(() => {
      setGen(true);
      let n = 0;
      const iv = setInterval(() => {
        setCh(BRAND.generate()); n++;
        if (n >= 6) { clearInterval(iv); setCh(BRAND.generate()); setGen(false); setFlip((k) => k + 1); }
      }, 95);
    }, []);

    const copyBrief = useCallback(() => {
      if (!ch) return;
      const t = `【Logo 設計挑戰】\n品牌名稱：${ch.brandName}\n品牌類別：${ch.category.label}\n品牌氛圍：${ch.mood.label} — ${ch.mood.description}\n色彩建議：${ch.mood.colorHint}\n關鍵字：${ch.mood.keywords.join("、")}\n目標受眾：${ch.targetAudience}\n業主需求：${ch.clientRequest}\n額外條件：${ch.extraConstraint}`;
      navigator.clipboard.writeText(t); setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [ch]);

    if (!ch) {
      return e("button", { onClick: generate,
        style: { width: "100%", padding: "64px 20px", border: "2px dashed var(--ink)", borderRadius: 0, background: "transparent", cursor: "pointer" } },
        e("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16 } },
          e("div", { style: { width: 80, height: 80, borderRadius: 0, border: "1px solid var(--ink)", background: "var(--bg-2)", display: "flex", alignItems: "center", justifyContent: "center" } },
            e(Icon, { name: "hexagon", size: 34, color: "var(--ink)" })),
          e("span", { className: "pc-display", style: { fontSize: 19, fontWeight: 700, color: "var(--ink)" } }, "點擊開始出題"),
          e("span", { style: { fontSize: 14, color: "var(--ink-faint)" } }, "隨機產生一個 Logo 設計挑戰")));
    }

    const c = ch.category, m = ch.mood;
    return e("div", { key: flip, className: "pc-flip-in", style: { display: "flex", flexDirection: "column", gap: 16 } },
      // main dark card
      e("div", { style: { background: "var(--ink-deep)", borderRadius: 0, overflow: "hidden" } },
        e("div", { style: { padding: "24px 26px 20px" } },
          e("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16 } },
            e(Icon, { name: "hexagon", size: 15, color: "rgba(255,255,255,0.5)" }),
            e("span", { style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" } }, "業主品牌"),
            e("div", { style: { flex: 1, height: 1, background: "rgba(255,255,255,0.1)" } })),
          e("h2", { className: "pc-display", style: { fontSize: "clamp(30px,5vw,40px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, margin: "0 0 14px" } }, ch.brandName),
          e("span", { style: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, padding: "6px 13px", borderRadius: 0, background: "var(--indigo)", color: "#fff" } },
            e("span", null, c.icon), c.label)),
        e("div", { style: { padding: "16px 26px", background: "rgba(255,255,255,0.05)", borderTop: "1px solid rgba(255,255,255,0.1)" } },
          e("div", { style: { display: "flex", alignItems: "flex-start", gap: 12 } },
            e(Icon, { name: "target", size: 16, color: "#fff", style: { marginTop: 2, flexShrink: 0 } }),
            e("div", null,
              e("span", { style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" } }, "業主需求"),
              e("p", { style: { fontSize: 14, color: "rgba(255,255,255,0.82)", margin: "5px 0 0", lineHeight: 1.65 } }, ch.clientRequest))))),
      // mood card
      e("div", { style: { background: "var(--card)", border: "1px solid var(--ink)", borderRadius: 0, padding: 20 } },
        e("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 } },
          e(Icon, { name: "palette", size: 16, color: "var(--ink)" }),
          e("span", { style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)" } }, "品牌形象氛圍")),
        e("div", { style: { marginBottom: 14 } },
          e("span", { className: "pc-display", style: { fontSize: 21, fontWeight: 700, color: "var(--ink)" } }, m.label),
          e("p", { style: { fontSize: 14, color: "var(--ink-soft)", margin: "4px 0 0" } }, m.description)),
        e("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } },
          e("div", { style: { padding: 13, background: "var(--bg-2)", borderRadius: 0 } },
            e("span", { style: { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)" } }, "建議色彩"),
            e("p", { style: { fontSize: 13.5, fontWeight: 500, margin: "5px 0 0", color: "var(--ink)" } }, m.colorHint)),
          e("div", { style: { padding: 13, background: "var(--bg-2)", borderRadius: 0 } },
            e("span", { style: { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)" } }, "關鍵字"),
            e("div", { style: { display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 } },
              m.keywords.map((kw) => e("span", { key: kw, style: { fontSize: 11.5, padding: "2px 7px", background: "var(--card)", border: "1px solid var(--ink)", borderRadius: 0, color: "var(--ink-soft)" } }, kw)))))),
      // audience + constraint
      e("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 } },
        e("div", { style: { background: "var(--card)", border: "1px solid var(--ink)", borderRadius: 0, padding: 16 } },
          e("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 8 } },
            e(Icon, { name: "users", size: 15, color: "var(--ink)" }),
            e("span", { style: { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)" } }, "目標受眾")),
          e("p", { style: { fontSize: 14, fontWeight: 500, margin: 0, color: "var(--ink)", lineHeight: 1.5 } }, ch.targetAudience)),
        e("div", { style: { background: "var(--card)", border: "1px solid var(--ink)", borderRadius: 0, padding: 16 } },
          e("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 8 } },
            e(Icon, { name: "lightbulb", size: 15, color: "var(--ink)" }),
            e("span", { style: { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)" } }, "額外條件")),
          e("p", { style: { fontSize: 14, fontWeight: 500, margin: 0, color: "var(--ink)", lineHeight: 1.5 } }, ch.extraConstraint))),
      // design hint
      e("div", { style: { padding: 16, background: "var(--indigo-2)", borderRadius: 0 } },
        e("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 8 } },
          e(Icon, { name: "sparkles", size: 15, color: "var(--ink)" }),
          e("span", { style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink)" } }, "設計提示")),
        e("p", { style: { fontSize: 14, color: "var(--ink)", lineHeight: 1.7, margin: 0 } },
          `為「${ch.brandName}」設計一個${m.label}風格的品牌 Logo。運用${m.keywords.slice(0, 3).join("、")}等視覺語彙，以${m.colorHint.split("、")[0]}為主色調，針對${ch.targetAudience}建立品牌識別。`)),
      // actions
      e("div", { style: { display: "flex", gap: 12 } },
        e("button", { onClick: generate, disabled: gen,
          style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", border: "1px solid var(--btn-pink-line)", borderLeft: "5px solid var(--btn-pink-bar)", borderRadius: 0,
            background: "var(--btn-pink)", color: "var(--btn-pink-text)", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: gen ? 0.6 : 1 } },
          e(Icon, { name: "refresh", size: 16, style: gen ? { animation: "pc-spin 0.8s linear infinite" } : null }), "重新出題"),
        e("button", { onClick: copyBrief,
          style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 22px", border: "1px solid var(--ink)", borderRadius: 0,
            background: "var(--card)", color: "var(--ink)", fontSize: 14, fontWeight: 700, cursor: "pointer" } },
          e(Icon, { name: copied ? "check" : "copy", size: 16 }), copied ? "已複製" : "複製題目")));
  }

  window.LogoPage = function LogoPage() {
    const [showTop, setShowTop] = useState(false);
    useEffect(() => {
      const h = () => setShowTop(window.scrollY > 300);
      window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
    }, []);
    return e("div", { className: "pc-root pc-grid-bg", style: { minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" } },
      e(window.PageHeader, {
        eyebrow: "Brand Logo Design Challenge",
        title: "Logo 設計挑戰",
        subtitle: "隨機產生品牌條件，模擬真實委託情境來練習 Logo 設計。",
        right: e("div", { style: { width: 56, height: 56, border: "1px solid var(--ink)", borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--card)" } },
          e(Icon, { name: "hexagon", size: 26, color: "var(--ink)" })),
      }),
      e("main", { style: { flex: 1, width: "100%", maxWidth: 720, margin: "0 auto", padding: "44px 5vw 60px", display: "flex", flexDirection: "column", justifyContent: "center" } }, e(Panel)),
      e(window.PageFooter),
      showTop && e("button", { onClick: smoothTop, className: "pc-fade",
        style: { position: "fixed", right: 24, bottom: 24, zIndex: 50, width: 46, height: 46, borderRadius: "50%", border: "none",
          background: "var(--indigo)", color: "#fff", cursor: "pointer", boxShadow: "0 8px 22px oklch(0.40 0.22 275 / 0.3)", display: "flex", alignItems: "center", justifyContent: "center" } },
        e(Icon, { name: "arrowUp", size: 18 })));
  };
})();
