/* Newspaper-style page chrome for the Competitions & Logo Challenge subpages. → window.PageHeader, window.PageFooter */
(function () {
  const e = React.createElement;
  const UI = window.UI, Icon = UI.Icon;
  const HOME = "index.html", COMP = "Competitions.html", LOGO = "Logo Challenge.html";
  const SPONSOR = "https://portaly.cc/dotty/support", IG = "https://www.instagram.com/dddotty/";

  window.NAV = { HOME, COMP, LOGO, SPONSOR, IG };

  const thick = { border: 0, borderTop: "3px solid var(--ink)", margin: 0 };
  const thin = { border: 0, borderTop: "1px solid var(--ink)", margin: 0 };
  const kicker = { fontFamily: "'Space Grotesk', monospace", fontSize: 10.5, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--ink-faint)", whiteSpace: "nowrap" };

  window.PageHeader = function PageHeader({ eyebrow, title, subtitle, right }) {
    return e("header", null,
      e("div", { style: { maxWidth: 1280, margin: "0 auto", padding: "0 5vw" } },
        e("div", { style: { height: 16 } }),
        e("hr", { style: thick }),
        e("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, padding: "7px 0" } },
          e("a", { href: HOME, style: { ...kicker, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", color: "var(--ink-soft)" } },
            e(Icon, { name: "arrowLeft", size: 13 }), "返回主題日報"),
          e("span", { style: kicker }, "PRODUCED BY DOTTY"),
          e("span", { style: { ...kicker, display: "inline-flex", gap: 16 } },
            e("a", { href: COMP, style: { ...kicker, textDecoration: "none" } }, "設計比賽"),
            e("a", { href: LOGO, style: { ...kicker, textDecoration: "none" } }, "Logo 挑戰"))),
        e("hr", { style: thin }),
        e("div", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", padding: "24px 0 22px" } },
          e("div", { style: { flex: "1 1 340px", minWidth: 0 } },
            e("div", { style: { display: "flex", alignItems: "center", gap: 9, marginBottom: 12 } },
              e("span", { style: { width: 8, height: 8, background: "var(--ink)", flexShrink: 0 } }),
              e("span", { style: { ...kicker, flexShrink: 0 } }, eyebrow)),
            e("h1", { className: "pc-display", style: { fontSize: "clamp(38px, 5vw, 64px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "0.01em", margin: 0 } }, title),
            subtitle && e("p", { style: { fontSize: 14.5, color: "var(--ink-soft)", margin: "14px 0 0", maxWidth: 520, lineHeight: 1.6 } }, subtitle)),
          e("div", { style: { flexShrink: 0 } }, right)),
        e("hr", { style: thick })));
  };

  window.PageFooter = function PageFooter() {
    const linkD = { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 500, textDecoration: "none", color: "rgba(245,242,236,0.62)" };
    return e("footer", { style: { background: "#2a1a11", color: "var(--bg)", marginTop: 48 } },
      e("div", { style: { maxWidth: 1280, margin: "0 auto", padding: "30px 5vw 28px" } },
        e("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 18 } },
          e("a", { href: HOME, style: { textDecoration: "none", color: "inherit" }, title: "回到主題日報" },
            e("div", { className: "pc-display", style: { fontSize: 22, fontWeight: 800, lineHeight: 1 } }, "主題日報"),
            e("div", { style: { fontFamily: "'Space Grotesk', monospace", fontSize: 9, letterSpacing: "0.28em", color: "rgba(245,242,236,0.5)", marginTop: 4 } }, "THE THEME DAILY")),
          e("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 } },
            e("a", { href: "mailto:zfc2115i@gmail.com?subject=主題日報 意見回饋", style: linkD }, e(Icon, { name: "mail", size: 14 }), "問題回報 / 意見回饋"),
            e("a", { href: COMP, style: linkD }, e(Icon, { name: "trophy", size: 14 }), "設計比賽"),
            e("a", { href: LOGO, style: linkD }, e(Icon, { name: "hexagon", size: 14 }), "Logo 挑戰"),
            e("a", { href: IG, target: "_blank", rel: "noopener noreferrer", style: linkD }, e(Icon, { name: "instagram", size: 14 }), "Instagram"),
            e("a", { href: SPONSOR, target: "_blank", rel: "noopener noreferrer",
              style: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, textDecoration: "none", color: "#fff", background: "#e0556a", padding: "8px 15px", borderRadius: 3 } },
              e(Icon, { name: "heart", size: 14 }), "贊助支持"))),
        e("hr", { style: { border: 0, borderTop: "1px solid rgba(245,242,236,0.18)", margin: "20px 0 12px" } }),
        e("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10 } },
          e("span", { style: { fontFamily: "'Space Grotesk', monospace", fontSize: 9.5, color: "rgba(245,242,236,0.4)", letterSpacing: "0.06em" } }, "© 2026 主題日報 · PRODUCED BY DOTTY · 每日更新，全年 365 期"),
          e("span", { style: { fontFamily: "'Space Grotesk', monospace", fontSize: 9.5, color: "rgba(245,242,236,0.4)", letterSpacing: "0.06em" } }, "本刊主題僅供創作參考 · 比賽資訊以各官方公告為準"))));
  };
})();
