/* 每日海報週報 — 全月主題索引 (newspaper classifieds-style month list). → window.NewsIndex */
(function () {
  const e = React.createElement;
  const PC = window.PC, UI = window.UI, Icon = UI.Icon;

  window.NewsIndex = function NewsIndex({ viewMonth, setViewMonth, openDay }) {
    const entries = PC.DATA.filter((d) => d.month === viewMonth);
    const step = (d) => setViewMonth((m) => Math.max(1, Math.min(12, m + d)));
    const arrow = (dis) => ({ width: 34, height: 34, border: "1px solid var(--ink)", background: "var(--bg)",
      color: dis ? "var(--rule-soft)" : "var(--ink)", cursor: dis ? "default" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 });

    return e("section", { style: { padding: "26px 0 40px" } },
      // header
      e("div", { style: { display: "flex", alignItems: "center", gap: 16, marginBottom: 4 } },
        e("div", { style: { flex: 1 } },
          e("div", { className: "np-kicker", style: { display: "flex", alignItems: "center", gap: 9, marginBottom: 8 } },
            e("span", { style: { width: 8, height: 8, background: "var(--ink)", flexShrink: 0 } }),
            e("span", { style: { flexShrink: 0 } }, "全月索引 · THE MONTH IN FULL"),
            e("span", { style: { flex: 1, height: 1, background: "var(--rule-soft)" } })),
          e("h3", { className: "np-serif", style: { fontSize: 30, fontWeight: 800, margin: 0, display: "flex", alignItems: "baseline", gap: 10 } },
            e("span", { style: { color: "var(--indigo)" } }, PC.MONTHS_EN[viewMonth - 1][0] + PC.MONTHS_EN[viewMonth - 1].slice(1).toLowerCase()),
            PC.MONTHS[viewMonth - 1],
            e("span", { className: "np-mono", style: { fontSize: 13, fontWeight: 400, color: "var(--ink-faint)" } }, `${entries.length} 個主題`))),
        e("div", { style: { display: "flex", gap: 6 } },
          e("button", { onClick: () => step(-1), disabled: viewMonth === 1, style: arrow(viewMonth === 1), title: "上個月" }, e(Icon, { name: "chevronLeft", size: 16 })),
          e("button", { onClick: () => step(1), disabled: viewMonth === 12, style: arrow(viewMonth === 12), title: "下個月" }, e(Icon, { name: "chevronRight", size: 16 })))),
      e("hr", { className: "np-rule" }),

      // multi-column index
      e("div", { className: "np-idxcols", style: { columnCount: 3, columnGap: 26, columnRule: "1px solid var(--rule-soft)", marginTop: 8 } },
        entries.map((en) => {
          const c = PC.CAT[en.category], today = PC.TODAY.month === en.month && PC.TODAY.day === en.day;
          return e("div", { key: en.day, onClick: () => openDay(en), className: "np-idx-row",
            style: { breakInside: "avoid", display: "flex", alignItems: "baseline", gap: 11, padding: "8px 6px", borderBottom: "1px solid var(--rule-soft)",
              background: today ? "#fdf6e6" : undefined } },
            e("span", { className: "np-serif", style: { fontSize: 18, fontWeight: 800, fontStyle: "italic", color: today ? "#c99320" : "var(--ink)", width: 26, flexShrink: 0, fontVariantNumeric: "tabular-nums" } }, String(en.day).padStart(2, "0")),
            e("span", { style: { width: 8, height: 8, background: c.color, flexShrink: 0, marginTop: 6 } }),
            e("div", { style: { flex: 1, minWidth: 0 } },
              e("div", { style: { fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, color: "var(--ink)" } }, en.theme,
                today && e("span", { style: { marginLeft: 6, fontSize: 9, fontWeight: 700, color: "#fff", background: "#e0a92e", padding: "1px 5px", verticalAlign: "middle" } }, "今日")),
              e("div", { style: { fontSize: 11, color: "var(--ink-faint)", marginTop: 1 } }, PC.CAT[en.category].label)));
        })),
    );
  };
})();
