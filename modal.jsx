/* 每日詳情彈窗 — window.DayModal
   props: { entry, isToday, onClose, onPrev, onNext }
   實心分類色標題列、海報靈感提示、文案產生器、前後日導覽、Esc/方向鍵。 */
(function () {
  const { useEffect } = React;
  const e = React.createElement;
  const PC = window.PC, UI = window.UI, Icon = UI.Icon;

  const PROMPT = {
    h: "節慶元素與歡樂色調", i: "象徵符號與全球視角", n: "自然紋理與有機形態",
    p: "文字排版與勵志語錄", c: "藝術手法與文化符號", d: "社會關懷與議題思辨", l: "生活場景與溫暖質感",
  };

  window.DayModal = function DayModal({ entry, onClose, onPrev, onNext, isToday }) {
    const c = PC.CAT[entry.category];
    useEffect(() => {
      const h = (ev) => { if (ev.key === "Escape") onClose(); if (ev.key === "ArrowLeft") onPrev(); if (ev.key === "ArrowRight") onNext(); };
      window.addEventListener("keydown", h);
      return () => window.removeEventListener("keydown", h);
    }, [onClose, onPrev, onNext]);

    const navBtn = { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13.5, color: "var(--ink-soft)",
      background: "none", border: "none", cursor: "pointer", padding: "4px 2px" };

    return e("div", { className: "pc-fade", onClick: onClose,
      style: { position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 } },
      e("div", { style: { position: "absolute", inset: 0, background: "rgba(42,26,17,0.55)" } }),
      e("div", { className: "pc-modal-pop pc-noscroll", onClick: (ev) => ev.stopPropagation(),
        style: { position: "relative", width: "100%", maxWidth: 460, background: "var(--card)", borderRadius: 8,
          boxShadow: "0 30px 80px rgba(42,26,17,0.4)", overflow: "hidden", maxHeight: "90vh", overflowY: "auto" } },
        // header — solid category colour
        e("div", { style: { background: c.color, padding: "30px 26px 44px", position: "relative" } },
          e("button", { onClick: onClose, style: { position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 5,
            border: "none", background: "rgba(255,255,255,0.25)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } },
            e(Icon, { name: "x", size: 16 })),
          e("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 } },
            e("span", { className: "pc-mono", style: { fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)" } },
              `${entry.month}月${entry.day}日 · 星期${UI.weekday(entry.month, entry.day)}`),
            isToday && e("span", { style: { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              background: "rgba(255,255,255,0.3)", color: "#fff", padding: "2px 8px", borderRadius: 4 } }, "TODAY")),
          e("h2", { className: "pc-display", style: { fontSize: 34, fontWeight: 600, color: "#fff", lineHeight: 1.15, margin: 0,
            textShadow: "0 2px 12px rgba(0,0,0,0.12)" } }, entry.theme)),
        // body
        e("div", { style: { padding: "22px 26px 26px", marginTop: -16, background: "var(--card)", borderRadius: "14px 14px 0 0", position: "relative" } },
          e("p", { style: { fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.75, margin: "0 0 18px" } }, entry.subtitle),
          e("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } },
            e("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500,
              padding: "5px 11px", borderRadius: 5, background: c.soft, color: c.text } }, e(Icon, { name: "tag", size: 12 }), c.label),
            e("span", { style: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--ink-faint)" } },
              e(Icon, { name: "hash", size: 12 }), `第 ${UI.dayOfYear(entry.month, entry.day)} 天`)),
          // poster idea prompt
          e("div", { style: { marginTop: 18, padding: 15, background: "var(--bg)", borderRadius: 6, border: "1px solid var(--line-soft)" } },
            e("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 8 } },
              e(Icon, { name: "sparkles", size: 15, color: "var(--ink-soft)" }),
              e("span", { style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-soft)" } }, "海報靈感提示")),
            e("p", { style: { fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: 0 } },
              `以「${entry.theme}」為主題，嘗試用${PROMPT[entry.category]}來創作今天的海報。`)),
          // copy generator
          e(window.CopyGen, { theme: entry.theme, subtitle: entry.subtitle, category: entry.category, month: entry.month, day: entry.day }),
          // nav
          e("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22, paddingTop: 16, borderTop: "1px solid var(--line-soft)" } },
            e("button", { onClick: onPrev, style: navBtn }, e(Icon, { name: "chevronLeft", size: 16 }), "前一天"),
            e("button", { onClick: onNext, style: { ...navBtn, flexDirection: "row-reverse" } }, e(Icon, { name: "chevronRight", size: 16 }), "後一天"))),
      ));
  };
})();
