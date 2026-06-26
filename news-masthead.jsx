/* 每日海報週報 — masthead nameplate + front-page hero. → window.NewsMasthead */
(function () {
  const e = React.createElement;
  const PC = window.PC, UI = window.UI, Icon = UI.Icon;
  const K = () => window.NewsKit;

  const NAV = { COMP: "Competitions.html", LOGO: "Logo Challenge.html" };

  // 截止倒數 — surfaces the nearest open competition; sensational black box when ≤ 7 days
  function DeadlineCountdown() {
    const C = window.COMPS;
    if (!C) return null;
    const open = C.competitions
      .filter((x) => C.status(x) === "open" && C.daysLeft(x.deadline) != null && C.daysLeft(x.deadline) >= 0)
      .sort((a, b) => C.daysLeft(a.deadline) - C.daysLeft(b.deadline));
    const next = open[0];
    if (!next) return null;
    const dl = C.daysLeft(next.deadline);
    const urgent = dl <= 7;
    const accent = urgent ? "#ff6a6a" : "#fff";
    return e("div", { style: { marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--rule)" } },
      e("div", { className: "np-kicker", style: { display: "flex", alignItems: "center", gap: 9, marginBottom: 12 } },
        e("span", { style: { width: 8, height: 8, background: urgent ? "#e0556a" : "var(--ink)", flexShrink: 0 } }),
        e("span", { style: { flexShrink: 0, color: urgent ? "#c2344a" : undefined } }, "截止倒數 · DEADLINE"),
        e("span", { style: { flex: 1, height: 1, background: "var(--rule-soft)" } })),
      // black-box sensational countdown headline
      e("a", { href: "Competitions.html", style: { display: "block", background: "var(--ink-deep)", color: "#fff", textDecoration: "none", padding: "15px 18px" } },
        urgent && e("div", { style: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", color: "#fff", background: "#e0556a", padding: "3px 9px", marginBottom: 10 } },
          e(Icon, { name: "trophy", size: 11 }), "即將截止 · CLOSING SOON"),
        e("div", { style: { display: "flex", alignItems: "baseline", gap: 8 } },
          e("span", { className: "np-mono", style: { fontSize: 12, letterSpacing: "0.2em", color: "rgba(255,255,255,0.65)" } }, "倒數"),
          e("span", { className: "np-serif", style: { fontSize: 58, fontWeight: 800, fontStyle: "italic", lineHeight: 0.85, color: accent } }, dl),
          e("span", { className: "np-serif", style: { fontSize: 24, fontWeight: 700, color: "#fff" } }, "天")),
        e("div", { className: "np-mono", style: { fontSize: 9.5, letterSpacing: "0.16em", color: "rgba(255,255,255,0.55)", marginTop: 6 } }, `DEADLINE · ${C.fmtDate(next.deadline)}`)),
      // 比賽單位資訊 (white, below)
      e("div", { style: { border: "1px solid var(--ink)", borderTop: "none", padding: "12px 16px 14px" } },
        e("div", { className: "np-serif", style: { fontSize: 16, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3, marginBottom: 6 } }, next.name),
        e("div", { style: { fontSize: 11.5, color: "var(--ink-soft)", lineHeight: 1.6 } }, `${next.organizer}（${next.country}）`),
        e("div", { style: { fontSize: 11.5, color: "var(--ink-faint)", marginTop: 2 } }, `參賽費用 · ${next.entryFee}`),
        e("a", { href: "Competitions.html", style: { display: "inline-flex", alignItems: "center", gap: 5, marginTop: 10, fontSize: 12, fontWeight: 700, color: "var(--indigo)", textDecoration: "none" } }, "查看比賽詳情 →")));
  }

  window.NewsMasthead = function NewsMasthead({ today, tc, tearRef, soundOn, setSoundOn, tearInfo, setTearInfo, openDay }) {
    const wd = UI.weekday(today.month, today.day);
    const Mark = K().Mark;

    return e("header", null,
      e("div", { style: { height: 16 } }),
      e("hr", { className: "np-rule-thick" }),
      // dateline row
      e("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0" } },
        e("span", { className: "np-kicker" }, `${PC.TODAY.month} 月號 · 第 ${String(PC.TODAY.month).padStart(2, "0")} 期`),
        e("span", { className: "np-kicker" }, "PRODUCED BY DOTTY"),
        e("span", { className: "np-kicker" }, "繁體中文版 · NT$0")),
      e("hr", { className: "np-rule" }),

      // nameplate
      e("div", { style: { position: "relative", textAlign: "center", padding: "28px 0 18px" } },
        e("div", { className: "np-script", style: { fontSize: 26, color: "var(--indigo)", marginBottom: 2 } }, "Inspiration Daily"),
        e("a", { href: "index.html", title: "回到首頁", style: { textDecoration: "none", display: "block" } },
          e("h1", { className: "np-serif", style: { fontSize: "clamp(48px, 10vw, 120px)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "0.04em", margin: 0, cursor: "pointer" } },
            e("span", { style: { color: "var(--ink)" } }, "主題"),
            e("span", { style: { color: "var(--indigo)" } }, "日報"))),
        e("div", { className: "np-mono", style: { fontSize: "clamp(11px, 1.6vw, 15px)", letterSpacing: "0.42em", color: "var(--ink-soft)", marginTop: 12, paddingLeft: "0.42em" } }, "THE THEME DAILY"),
        e("button", { onClick: () => setSoundOn((s) => !s), title: soundOn ? "音效開" : "音效關",
          style: { position: "absolute", right: "2%", bottom: 18, display: "inline-flex", alignItems: "center", gap: 6,
            background: soundOn ? "var(--indigo)" : "var(--bg)", border: `1px solid ${soundOn ? "var(--indigo)" : "var(--rule)"}`,
            borderRadius: 999, padding: "8px 14px", cursor: "pointer", color: soundOn ? "#fff" : "var(--ink-faint)" } },
          e(Icon, { name: soundOn ? "volume" : "volumeX", size: 14 }),
          e("span", { className: "np-mono", style: { fontSize: 10, letterSpacing: "0.1em" } }, soundOn ? "音效" : "靜音"))),
      e("hr", { className: "np-rule-double" }),
      e("div", { className: "np-kicker np-tagline", style: { textAlign: "center", padding: "8px 0" } }, "365 天的海報設計主題靈感 · 每天撕下一張，揭開新的創作"),
      e("hr", { className: "np-rule-thick" }),

      // hero band: ① today | tear card | ② how-to
      e("div", { className: "np-hero3", style: { display: "grid", gridTemplateColumns: "1.05fr 1.25fr 0.95fr", gap: 0, alignItems: "stretch" } },
        // ── ① today ──
        e("div", { style: { position: "relative", padding: "22px 22px 22px 0", borderRight: "1px solid var(--rule-soft)" } },
          e("div", { className: "np-kicker", style: { display: "flex", alignItems: "center", gap: 9, color: tc.text, marginBottom: 12 } },
            e("span", { style: { width: 8, height: 8, background: tc.color, flexShrink: 0 } }),
            e("span", { style: { flexShrink: 0 } }, `今日主題 · TODAY · ${PC.TODAY.month}/${PC.TODAY.day}（星期${wd}）`),
            e("span", { style: { flex: 1, height: 1, background: "var(--rule-soft)" } })),
          e("h2", { className: "np-serif", style: { fontSize: 40, fontWeight: 800, lineHeight: 1.1, margin: "0 0 14px" } },
            e(Mark, { color: tc.soft }, today.theme)),
          e("p", { className: "np-body np-dropcap", style: { margin: "0 0 14px" } },
            `${today.subtitle}。今天是${today.month}月${today.day}日，${PC.CAT[today.category].label}。翻開桌上的日曆，以「${today.theme}」為題，為今天設計一張海報——靈感，就從這裡開始。`),
          e("div", { style: { display: "inline-flex", alignItems: "center", gap: 7 } },
            e("span", { style: { width: 9, height: 9, borderRadius: "50%", background: tc.color } }),
            e("span", { style: { fontSize: 12, fontWeight: 600, color: tc.text } }, PC.CAT[today.category].label),
            e("button", { onClick: () => openDay(today), style: { marginLeft: 10, background: "none", border: "none", color: "var(--indigo)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 } }, "閱讀全文 →")),
          K().CreatorBox()),

        // ── center: the tear card hero ──
        e("div", { className: "np-tearcol", style: { padding: "22px 24px", borderRight: "1px solid var(--rule-soft)", display: "flex", flexDirection: "column", alignItems: "center" } },
          e("div", { className: "np-tearscale", style: { transform: "scale(0.92)", transformOrigin: "top center", marginBottom: -34 } },
            e(window.TearCard, { ref: tearRef, soundOn, onOpenDay: openDay, onChange: setTearInfo })),
          e("div", { className: "np-kicker", style: { textAlign: "center", marginTop: 18, borderTop: "1px solid var(--rule-soft)", paddingTop: 10, width: "100%" } },
            "▲ 今日海報主題 · 抓住右下角往左上撕，揭開明日"),
          e("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 14, flexWrap: "wrap" } },
            e("button", { onClick: () => tearRef.current && tearRef.current.tear(),
              style: { display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 2, border: "1px solid var(--btn-pink-line)", borderLeft: "5px solid var(--btn-pink-bar)", background: "var(--btn-pink)", color: "var(--btn-pink-text)", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em" } },
              "撕下這一頁 ↖"),
            e("span", { className: "np-mono", style: { fontSize: 12, color: "var(--ink-faint)" } }, "已撕 ",
              e("b", { style: { color: "var(--indigo)", fontSize: 15 } }, String(tearInfo.count).padStart(3, "0"))),
            !tearInfo.isToday && e("button", { onClick: () => tearRef.current && tearRef.current.goToday(),
              style: { display: "inline-flex", alignItems: "center", gap: 5, padding: "9px 14px", borderRadius: 2, border: "1px solid var(--indigo)", background: "transparent", color: "var(--indigo)", fontSize: 12, fontWeight: 600, cursor: "pointer" } },
              e(Icon, { name: "calendar", size: 12 }), "回到今日"))),

        // ── ② 日報導覽 ──
        e("div", { style: { padding: "22px 0 22px 22px" } },
          K().FeatureHead({ kicker: "日報導覽 · GUIDE", children: e("span", null, "如何閱讀", e(Mark, { color: PC.CAT.p.soft }, "這份日報")) }),
          e("p", { className: "np-body", style: { margin: "0 0 14px" } }, "「主題日報」每天為設計師發布一個值得創作的海報主題。以下是各欄目導覽："),
          e("div", null,
            [["七大主題", "節日、國際、自然、勵志、藝術、生活、設計議題。", null], ["國際比賽情報", "28 個國際與台灣的海報及設計比賽。", "Competitions.html"], ["Logo 設計挑戰", "隨機品牌出題，模擬委託情境練習。", "Logo Challenge.html"]].map(([label, desc, href], i) =>
              e(href ? "a" : "div", { key: i, href: href || undefined,
                style: { display: "flex", gap: 12, padding: "11px 0", borderTop: "1px solid var(--rule-soft)", textDecoration: "none", color: "inherit", cursor: href ? "pointer" : "default" } },
                e("span", { className: "np-serif", style: { fontSize: 18, fontWeight: 800, color: "var(--indigo)", width: 22, flexShrink: 0, textAlign: "center" } }, ["㊀", "㊁", "㊂", "㊃"][i]),
                e("div", null,
                  e("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 } }, label, href && e("span", { style: { fontSize: 12, color: "var(--indigo)" } }, "→")),
                  e("div", { style: { fontSize: 12, color: "var(--ink-faint)", marginTop: 2, lineHeight: 1.5 } }, desc))))),
          e(DeadlineCountdown)),
      ),
      e("hr", { className: "np-rule-thick", style: { marginTop: 4 } }),
    );
  };
})();
