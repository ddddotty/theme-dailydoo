/* 主題日報 — features: 七大主題分類 | 比賽情報＋Logo挑戰 · 全年分佈帶. → window.NewsFeatures */
(function () {
  const e = React.createElement;
  const PC = window.PC, UI = window.UI, Icon = UI.Icon;
  const K = () => window.NewsKit;

  const linkBtn = { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700,
    color: "var(--btn-pink-text)", background: "var(--btn-pink)", border: "1px solid var(--btn-pink-line)", borderLeft: "5px solid var(--btn-pink-bar)", padding: "9px 16px", borderRadius: 2, textDecoration: "none" };

  window.NewsFeatures = function NewsFeatures({ counts, viewMonth, showMonth, openDay }) {
    const { Mark, Ph, FeatureHead, CAT_BLURB } = K();
    const [rolling, setRolling] = React.useState(false);
    const rollRandom = () => {
      if (rolling) return;
      setRolling(true);
      let n = 0;
      const iv = setInterval(() => {
        n++;
        if (n >= 8) {
          clearInterval(iv);
          setRolling(false);
          openDay && openDay(PC.DATA[Math.floor(Math.random() * PC.DATA.length)]);
        }
      }, 70);
    };

    return e("section", null,
      // ── band: 七大主題分類 | 比賽情報 + Logo 挑戰 ──
      e("div", { className: "np-band2", style: { display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 0, alignItems: "stretch" } },
        // 左：七大主題分類
        e("div", { style: { padding: "26px 26px 26px 0", borderRight: "1px solid var(--rule-soft)" } },
          e(FeatureHead, { kicker: "主題分類 · CATEGORIES" }, e("span", null, "七大主題", e(Mark, { color: PC.CAT.c.soft }, "分類"))),
          e("p", { className: "np-body", style: { margin: "0 0 16px" } }, "全年 365 個主題，依屬性分為七大類，以色塊系統標示。從節氣到社會議題，每一種顏色都是一種創作切角。"),
          e("div", null,
            PC.CAT_ORDER.map((k) => {
              const c = PC.CAT[k];
              return e("div", { key: k, style: { display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderTop: "1px solid var(--rule-soft)" } },
                e("span", { style: { width: 16, height: 16, background: c.color, flexShrink: 0 } }),
                e("span", { className: "np-serif", style: { fontSize: 16, fontWeight: 700, width: 92, flexShrink: 0 } }, c.label),
                e("span", { style: { flex: 1, fontSize: 12.5, color: "var(--ink-soft)" } }, CAT_BLURB[k]),
                e("span", { className: "np-mono", style: { fontSize: 12, color: "var(--ink-faint)", flexShrink: 0 } }, `${counts[k]} 天`));
            })),
          // 隨機抽主題骰子
          e("div", { style: { display: "flex", alignItems: "center", gap: 14, marginTop: 22 } },
            e("button", { onClick: rollRandom, title: "隨機抽一個主題練習",
              style: { width: 56, height: 56, borderRadius: 14, border: "none", background: "transparent",
                cursor: rolling ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0 } },
              e("svg", { width: 44, height: 44, viewBox: "0 0 24 24", fill: "none",
                stroke: "var(--btn-pink-bar)", strokeWidth: 1.5, strokeLinejoin: "round",
                style: rolling ? { animation: "pc-spin 0.6s linear infinite" } : null,
                dangerouslySetInnerHTML: { __html: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.3" fill="var(--btn-pink-bar)" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="var(--btn-pink-bar)" stroke="none"/><circle cx="15.5" cy="15.5" r="1.3" fill="var(--btn-pink-bar)" stroke="none"/>' } })),
            e("div", null,
              e("div", { className: "np-serif", style: { fontSize: 15, fontWeight: 700, color: "var(--ink)" } }, "隨機抽主題"),
              e("div", { style: { fontSize: 12, color: "var(--ink-faint)", marginTop: 2 } }, "擲骰子，隨機抽一天的主題來練習")))),
        // 右：比賽情報 + Logo 挑戰
        e("div", { style: { padding: "26px 0 26px 26px" } },
          e(FeatureHead, { kicker: "比賽情報 · COMPETITIONS" }, e("span", null, "國際設計", e(Mark, { color: PC.CAT.i.soft }, "比賽"), "情報")),
          e("div", { style: { display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: 16, alignItems: "start" } },
            e(Ph, { tag: "IMG", label: "比賽海報示意", height: 150, src: "images/competitions.jpg" }),
            e("div", null,
              e("p", { className: "np-body", style: { margin: "0 0 12px" } }, "彙整 28 個國際與台灣的海報及設計比賽——紅點、iF、華沙海報雙年展、金點、TIGDA⋯⋯掌握報名時程與截止日，可依狀態、費用、地區篩選並收藏。"),
              e("a", { href: "Competitions.html", style: linkBtn }, e(Icon, { name: "trophy", size: 14 }), "前往比賽情報 →"))),
          e("div", { style: { position: "relative", margin: "30px 0", height: 1 } },
            e("hr", { className: "np-rule", style: { margin: 0 } }),
            e("div", { className: "np-burst", style: { position: "absolute", left: "92%", top: "50%", transform: "translate(-50%, -50%) rotate(-9deg)", zIndex: 2 } },
              React.createElement("span", null, "你敢", e("br"), e("b", null, "挑戰"), "嗎？"))),
          e(FeatureHead, { kicker: "設計挑戰 · LOGO CHALLENGE" }, e("span", null, "Logo 設計", e(Mark, { color: PC.CAT.l.soft }, "挑戰"))),
          e("div", { style: { display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 16, alignItems: "start" } },
            e("div", null,
              e("p", { className: "np-body", style: { margin: "0 0 12px" } }, "隨機產生品牌名稱、類別、形象氛圍與業主需求，模擬真實委託情境練習 Logo 設計。每次出題都不重複，附建議色彩與關鍵字。"),
              e("a", { href: "Logo Challenge.html", style: linkBtn }, e(Icon, { name: "hexagon", size: 14 }), "開始 Logo 挑戰 →")),
            e(Ph, { tag: "IMG", label: "品牌出題示意", height: 150, src: "images/logo.jpg" }))),
      ),
      e("hr", { className: "np-rule-thick" }),

      // ── year distribution band ──
      e("div", { style: { padding: "24px 0 26px" } },
        e("div", { style: { display: "flex", alignItems: "baseline", gap: 14, marginBottom: 16 } },
          e("h3", { className: "np-serif", style: { fontSize: 26, fontWeight: 800, margin: 0, flexShrink: 0, whiteSpace: "nowrap" } }, "全年 ", e("span", { style: { color: "var(--indigo)", fontStyle: "italic" } }, "365"), " 天"),
          e("span", { className: "np-kicker" }, "THE WHOLE YEAR · 點選月份查看全部主題"),
          e("div", { style: { flex: 1 } }),
          e("span", { className: "np-kicker" }, "主題分佈")),
        // distribution bar
        e("div", { style: { display: "flex", height: 14, border: "1px solid var(--ink)", marginBottom: 18 } },
          PC.CAT_ORDER.map((k) => e("div", { key: k, title: `${PC.CAT[k].label} ${counts[k]}`, style: { width: `${(counts[k] / 365) * 100}%`, background: PC.CAT[k].color } }))),
        // 12 month chips
        e("div", { className: "np-monthgrid", style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 } },
          PC.MONTHS.map((nm, i) => {
            const m = i + 1, cur = m === PC.TODAY.month, active = m === viewMonth;
            return e("button", { key: m, onClick: () => showMonth(m),
              style: { position: "relative", display: "flex", alignItems: "center", gap: 9, padding: "11px 12px", cursor: "pointer", textAlign: "left",
                border: `1px solid ${active ? "var(--indigo)" : "var(--rule-soft)"}`, background: active ? "var(--indigo)" : "transparent", color: active ? "#fff" : "var(--ink)" } },
              e("span", { className: "np-serif", style: { fontSize: 18, fontWeight: 800, lineHeight: 1 } }, PC.MONTHS_EN[i][0] + PC.MONTHS_EN[i].slice(1).toLowerCase()),
              e("div", null,
                e("div", { style: { fontSize: 12.5, fontWeight: 600 } }, nm),
                e("div", { style: { fontSize: 10, color: active ? "rgba(255,255,255,0.7)" : "var(--ink-faint)" } }, `${PC.countByMonth(m)} 天`)),
              cur && e("span", { title: "今日", style: { position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#e0a92e" } }));
          }))),
      e("hr", { className: "np-rule-thick" }),
    );
  };
})();
