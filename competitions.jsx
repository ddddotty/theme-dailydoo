/* 國際設計比賽頁 — filter/sort/search/favorites + expandable cards. → window.CompetitionsPage */
(function () {
  const { useState, useMemo, useCallback, useEffect } = React;
  const e = React.createElement;
  const UI = window.UI, Icon = UI.Icon, C = window.COMPS;

  const FAV_KEY = "poster-comp-favorites";
  function useFavorites() {
    const [favs, setFavs] = useState(() => { try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; } });
    const save = (arr) => { setFavs(arr); try { localStorage.setItem(FAV_KEY, JSON.stringify(arr)); } catch {} };
    return {
      favs,
      isFav: (id) => favs.includes(id),
      toggle: (id) => save(favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id]),
      count: favs.length,
    };
  }

  const sortLabels = {
    "status": "狀態優先", "deadline-asc": "截止日期（近→遠）", "deadline-desc": "截止日期（遠→近）",
    "name-asc": "名稱 A→Z", "name-desc": "名稱 Z→A", "fee-asc": "費用（低→高）", "fee-desc": "費用（高→低）",
  };
  const regionGroups = [
    { label: "台灣", flag: "🇹🇼", countries: ["台灣"] },
    { label: "東亞", flag: "🌏", countries: ["日本", "韓國"] },
    { label: "歐洲", flag: "🌍", countries: ["波蘭", "德國", "英國", "西班牙", "義大利", "捷克"] },
    { label: "美洲", flag: "🌎", countries: ["美國", "墨西哥"] },
    { label: "國際", flag: "🌐", countries: ["國際"] },
  ];

  function smoothTop() {
    const startY = window.scrollY, t0 = performance.now(), ease = (p) => 1 - Math.pow(1 - p, 3);
    (function tick(now) { const p = Math.min(1, (now - t0) / 420); window.scrollTo(0, startY * (1 - ease(p))); if (p < 1) requestAnimationFrame(tick); })(performance.now());
  }

  function InfoCell({ icon, label, value }) {
    return e("div", { style: { display: "flex", alignItems: "flex-start", gap: 8, padding: 10, background: "var(--bg)", borderRadius: 5 } },
      e(Icon, { name: icon, size: 14, color: "var(--ink-faint)", style: { marginTop: 2, flexShrink: 0 } }),
      e("div", { style: { minWidth: 0 } },
        e("p", { style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-faint)", margin: 0 } }, label),
        e("p", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--ink)", margin: "3px 0 0", lineHeight: 1.4 } }, value)));
  }

  function Card({ comp, isFav, onToggle }) {
    const [exp, setExp] = useState(false);
    const st = C.status(comp), sc = C.statusColors[st], dl = C.daysLeft(comp.deadline);
    const urgent = st === "open" && dl !== null && dl >= 0 && dl <= 7;
    return e("div", { style: { position: "relative", background: "var(--card)", border: `1px solid ${urgent ? "#e8c878" : "var(--line-soft)"}`,
      borderRadius: 8, overflow: "hidden", boxShadow: urgent ? "0 4px 18px rgba(224,169,46,0.12)" : "none" } },
      urgent && e("span", { style: { position: "absolute", top: -7, right: -7, zIndex: 2, padding: "2px 7px", borderRadius: 999,
        background: "#e0a92e", color: "#fff", fontSize: 9, fontWeight: 700 } }, `${dl}d`),
      e("div", { style: { height: 4, background: urgent ? "#fbbf24" : sc.dot } }),
      e("div", { style: { padding: "20px 22px" } },
        e("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 } },
          e("div", { style: { flex: 1, minWidth: 0 } },
            e("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 7 } },
              e("span", { style: { display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 4, background: sc.bg, color: sc.text, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" } },
                e("span", { style: { width: 6, height: 6, borderRadius: "50%", background: sc.dot } }), C.statusLabels[st]),
              e("span", { style: { display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10.5, color: "var(--ink-faint)" } },
                e(Icon, { name: "mapPin", size: 12 }), comp.country)),
            e("h3", { className: "pc-display", style: { fontSize: 18, fontWeight: 700, lineHeight: 1.25, color: "var(--ink)", margin: 0 } }, comp.name),
            e("p", { className: "pc-mono", style: { fontSize: 11, color: "var(--ink-faint)", margin: "3px 0 0" } }, comp.nameEn)),
          st === "open" && dl !== null && dl > 0 && e("div", { style: { flexShrink: 0, textAlign: "center", padding: "8px 12px", borderRadius: 6,
            background: urgent || dl <= 30 ? "#fdf2dc" : "#e2f7ee", border: `1px solid ${urgent || dl <= 30 ? "#e8c878" : "#bfe9d4"}` } },
            e("span", { className: "pc-display", style: { fontSize: 24, fontWeight: 800, lineHeight: 1, color: urgent || dl <= 30 ? "#b9831a" : "#1fa877" } }, dl),
            e("p", { style: { fontSize: 9, fontWeight: 700, margin: "2px 0 0", color: urgent || dl <= 30 ? "#c99320" : "#34b483" } }, "天"))),
        e("p", { style: { fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65, margin: "0 0 14px" } }, comp.description),
        e("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 14 } },
          e(InfoCell, { icon: "calendar", label: "截止日期", value: C.fmtDate(comp.deadline) }),
          e(InfoCell, { icon: "dollar", label: "參賽費用", value: comp.entryFee }),
          e(InfoCell, { icon: "users", label: "參賽資格", value: comp.eligibility }),
          e(InfoCell, { icon: "briefcase", label: "主辦單位", value: comp.organizer })),
        exp && e("div", { className: "pc-expand", style: { borderTop: "1px solid var(--line-soft)", paddingTop: 14, marginBottom: 14 } },
          e("div", { style: { display: "flex", flexDirection: "column", gap: 11 } },
            comp.theme && detail("target", "#e0556a", "主題", comp.theme),
            comp.maxEntries && detail("sliders", "#3d82e6", "投稿限制", comp.maxEntries),
            comp.format && detail("tag", "#8266e6", "投稿格式", comp.format),
            comp.prizes && detail("trophy", "#d99713", "獎項", comp.prizes),
            comp.registrationOpen && detail("calendar", "#1fa877", "報名開始", C.fmtDate(comp.registrationOpen)),
            comp.resultsDate && detail("trophy", "#2c9fd4", "結果公布", C.fmtDate(comp.resultsDate)))),
        e("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 } },
          comp.tags.map((t) => e("span", { key: t, style: { fontSize: 10.5, fontWeight: 500, padding: "2px 8px", borderRadius: 4, background: "var(--bg)", color: "var(--ink-faint)" } }, t))),
        e("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
          e("a", { href: comp.website, target: "_blank", rel: "noopener noreferrer",
            style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 5,
              background: "var(--indigo)", color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textDecoration: "none" } },
            e(Icon, { name: "externalLink", size: 14 }), "前往官網"),
          e("button", { onClick: () => onToggle(comp.id),
            style: { display: "flex", alignItems: "center", gap: 5, padding: "10px 12px", borderRadius: 5, cursor: "pointer", fontSize: 12, fontWeight: 600,
              border: `1px solid ${isFav ? "#e8c878" : "var(--line)"}`, background: isFav ? "#fdf2dc" : "var(--card)", color: isFav ? "#b9831a" : "var(--ink-soft)" } },
            e(Icon, { name: isFav ? "bookmarkCheck" : "bookmark", size: 14 }), isFav ? "已收藏" : "收藏"),
          e("button", { onClick: () => setExp(!exp),
            style: { display: "flex", alignItems: "center", gap: 5, padding: "10px 12px", borderRadius: 5, cursor: "pointer", fontSize: 12, fontWeight: 600,
              border: "1px solid var(--line)", background: "var(--card)", color: "var(--ink-soft)" } },
            e(Icon, { name: "chevronDown", size: 14, style: { transform: exp ? "rotate(180deg)" : "none", transition: "transform 0.2s" } }), exp ? "收起" : "詳情"))));
  }
  function detail(icon, color, label, value) {
    return e("div", { style: { display: "flex", alignItems: "flex-start", gap: 8 } },
      e(Icon, { name: icon, size: 14, color, style: { marginTop: 2, flexShrink: 0 } }),
      e("div", null,
        e("p", { style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-faint)", margin: 0 } }, label),
        e("p", { style: { fontSize: 12.5, color: "var(--ink)", margin: "2px 0 0", lineHeight: 1.5 } }, value)));
  }

  function pill(active) {
    return { padding: "6px 12px", fontSize: 12, fontWeight: 500, borderRadius: 5, cursor: "pointer", border: "none",
      background: active ? "var(--ink)" : "var(--bg-2)", color: active ? "var(--bg)" : "var(--ink-soft)", transition: "all 0.18s" };
  }

  window.CompetitionsPage = function CompetitionsPage() {
    const [q, setQ] = useState("");
    const [statusF, setStatusF] = useState("all");
    const [feeF, setFeeF] = useState("all");
    const [regionF, setRegionF] = useState("all");
    const [sortBy, setSortBy] = useState("status");
    const [adv, setAdv] = useState(false);
    const [sortDD, setSortDD] = useState(false);
    const [favOnly, setFavOnly] = useState(false);
    const [showTop, setShowTop] = useState(false);
    const fav = useFavorites();

    useEffect(() => { const h = () => setShowTop(window.scrollY > 300); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

    const activeCount = [statusF !== "all", feeF !== "all", regionF !== "all", q.trim() !== "", favOnly].filter(Boolean).length;
    const clearAll = () => { setQ(""); setStatusF("all"); setFeeF("all"); setRegionF("all"); setSortBy("status"); setFavOnly(false); };
    const regionCountries = (lbl) => (regionGroups.find((g) => g.label === lbl) || {}).countries || [];

    const regionStats = useMemo(() => { const m = {}; C.competitions.forEach((c) => { m[c.country] = (m[c.country] || 0) + 1; }); return m; }, []);

    const filtered = useMemo(() => C.competitions.filter((c) => {
      if (favOnly && !fav.isFav(c.id)) return false;
      if (statusF !== "all" && C.status(c) !== statusF) return false;
      const free = c.entryFee.includes("免費") || c.entryFee.toLowerCase().includes("free");
      if (feeF === "free" && !free) return false;
      if (feeF === "paid" && free) return false;
      if (regionF !== "all") { const rc = regionCountries(regionF); if (rc.length ? !rc.includes(c.country) : c.country !== regionF) return false; }
      if (q.trim()) { const s = q.toLowerCase(); return [c.name, c.nameEn, c.organizer, c.country, c.description].some((x) => x.toLowerCase().includes(s)) || c.tags.some((t) => t.toLowerCase().includes(s)); }
      return true;
    }), [q, statusF, feeF, regionF, favOnly, fav.favs]);

    const sorted = useMemo(() => [...filtered].sort((a, b) => {
      const t = (d) => (d === "ongoing" ? Infinity : new Date(d).getTime());
      switch (sortBy) {
        case "deadline-asc": return t(a.deadline) - t(b.deadline);
        case "deadline-desc": return t(b.deadline) - t(a.deadline);
        case "name-asc": return a.name.localeCompare(b.name, "zh-TW");
        case "name-desc": return b.name.localeCompare(a.name, "zh-TW");
        case "fee-asc": return C.feeValue(a.entryFee) - C.feeValue(b.entryFee);
        case "fee-desc": return C.feeValue(b.entryFee) - C.feeValue(a.entryFee);
        default: { const o = { open: 0, upcoming: 1, ongoing: 2, closed: 3 }; const d = o[C.status(a)] - o[C.status(b)]; return d !== 0 ? d : t(a.deadline) - t(b.deadline); }
      }
    }), [filtered, sortBy]);

    const openCount = C.competitions.filter((c) => C.status(c) === "open").length;
    const freeCount = C.competitions.filter((c) => c.entryFee.includes("免費") || c.entryFee.toLowerCase().includes("free")).length;

    const stat = (n, label, color) => e("div", { style: { textAlign: "center" } },
      e("div", { className: "pc-display", style: { fontSize: 34, fontWeight: 800, lineHeight: 1, color } }, n),
      e("p", { style: { fontSize: 10, color: "var(--ink-faint)", margin: "4px 0 0" } }, label));

    return e("div", { className: "pc-root pc-grid-bg", style: { minHeight: "100vh", background: "var(--bg)" } },
      e(window.PageHeader, {
        eyebrow: "International Design Competitions",
        title: "國際設計比賽",
        subtitle: "全球海報與設計比賽資訊一覽，掌握報名時程與截止日期。",
        right: e("div", { style: { display: "flex", alignItems: "center", gap: 18 } },
          stat(openCount, "徵件中", "#1fa877"),
          e("div", { style: { width: 1, height: 38, background: "var(--line)" } }),
          stat(C.competitions.length, "總比賽數", "var(--ink)"),
          e("div", { style: { width: 1, height: 38, background: "var(--line)" } }),
          stat(freeCount, "免費參賽", "#3d82e6"),
          e("div", { style: { width: 1, height: 38, background: "var(--line)" } }),
          stat(fav.count, "我的收藏", "#e0a92e")),
      }),

      // sticky filter bar
      e("div", { style: { position: "sticky", top: 0, zIndex: 40, background: "color-mix(in oklch, var(--bg) 92%, transparent)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)" } },
        e("div", { style: { maxWidth: 1280, margin: "0 auto", padding: "12px 5vw" } },
          e("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } },
            e("div", { style: { position: "relative", flex: 1, minWidth: 200 } },
              e("div", { style: { position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--ink-faint)" } }, e(Icon, { name: "search", size: 16 })),
              e("input", { value: q, onChange: (ev) => setQ(ev.target.value), placeholder: "搜尋比賽名稱、國家、標籤...",
                style: { width: "100%", padding: "10px 34px", fontSize: 13.5, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 5, outline: "none", color: "var(--ink)", fontFamily: "inherit" } }),
              q && e("button", { onClick: () => setQ(""), style: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--ink-faint)", cursor: "pointer" } }, e(Icon, { name: "x", size: 14 }))),
            e("div", { style: { position: "relative" } },
              e("button", { onClick: () => setSortDD(!sortDD), style: { display: "flex", alignItems: "center", gap: 6, padding: "10px 13px", fontSize: 12.5, fontWeight: 500, border: "1px solid var(--line)", borderRadius: 5, cursor: "pointer", background: "var(--card)", color: "var(--ink)" } },
                e(Icon, { name: "sort", size: 14 }), e("span", null, sortLabels[sortBy]), e(Icon, { name: "chevronDown", size: 13, style: { transform: sortDD ? "rotate(180deg)" : "none", transition: "transform 0.2s" } })),
              sortDD && e("div", { className: "pc-fade-up", style: { position: "absolute", right: 0, top: "calc(100% + 6px)", width: 220, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, boxShadow: "0 14px 36px oklch(0.40 0.22 275 / 0.12)", overflow: "hidden", zIndex: 50 } },
                Object.keys(sortLabels).map((k) => e("button", { key: k, onClick: () => { setSortBy(k); setSortDD(false); },
                  style: { display: "block", width: "100%", textAlign: "left", padding: "10px 14px", fontSize: 12.5, border: "none", cursor: "pointer", background: sortBy === k ? "var(--ink)" : "transparent", color: sortBy === k ? "var(--bg)" : "var(--ink)", fontWeight: sortBy === k ? 700 : 400 } }, sortLabels[k])))),
            e("button", { onClick: () => setFavOnly(!favOnly), style: { display: "flex", alignItems: "center", gap: 6, padding: "10px 13px", fontSize: 12.5, fontWeight: 600, borderRadius: 5, cursor: "pointer", border: `1px solid ${favOnly ? "#e0a92e" : "var(--line)"}`, background: favOnly ? "#e0a92e" : "var(--card)", color: favOnly ? "#fff" : "var(--ink-soft)" } },
              e(Icon, { name: favOnly ? "bookmarkCheck" : "bookmark", size: 14 }), "收藏", fav.count > 0 && e("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 16, height: 16, padding: "0 4px", borderRadius: 999, fontSize: 9, fontWeight: 700, background: favOnly ? "#fff" : "#fdf2dc", color: "#b9831a" } }, fav.count)),
            e("button", { onClick: () => setAdv(!adv), style: { display: "flex", alignItems: "center", gap: 6, padding: "10px 13px", fontSize: 12.5, fontWeight: 600, borderRadius: 5, cursor: "pointer", border: "1px solid var(--line)", background: adv || activeCount > 0 ? "var(--ink)" : "var(--card)", color: adv || activeCount > 0 ? "var(--bg)" : "var(--ink-soft)" } },
              e(Icon, { name: "sliders", size: 14 }), "篩選", activeCount > 0 && e("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 16, height: 16, padding: "0 4px", borderRadius: 999, fontSize: 9, fontWeight: 700, background: "var(--bg)", color: "var(--ink)" } }, activeCount))),
          adv && e("div", { className: "pc-expand", style: { borderTop: "1px solid var(--line-soft)", marginTop: 12, paddingTop: 12, display: "flex", flexDirection: "column", gap: 11 } },
            filterRow("狀態", ["all", "open", "upcoming", "closed"].map((s) => ({ k: s, label: s === "all" ? "全部" : C.statusLabels[s], on: statusF === s, set: () => setStatusF(s) }))),
            filterRow("費用", ["all", "free", "paid"].map((f) => ({ k: f, label: f === "all" ? "費用不限" : f === "free" ? "免費" : "付費", on: feeF === f, set: () => setFeeF(f) }))),
            filterRow("地區", [{ k: "all", label: "全部地區", on: regionF === "all", set: () => setRegionF("all") }].concat(
              regionGroups.map((g) => { const cnt = g.countries.reduce((s, c) => s + (regionStats[c] || 0), 0); return { k: g.label, label: `${g.flag} ${g.label} (${cnt})`, on: regionF === g.label, set: () => setRegionF(g.label), hide: cnt === 0 }; }))),
            activeCount > 0 && e("button", { onClick: clearAll, style: { alignSelf: "flex-start", fontSize: 11.5, color: "var(--indigo)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2 } }, "清除全部篩選")))),

      // content
      e("main", { style: { maxWidth: 1280, margin: "0 auto", padding: "28px 5vw 20px" } },
        e("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 } },
          e("p", { style: { fontSize: 13.5, color: "var(--ink-soft)", margin: 0 } }, "顯示 ", e("b", { style: { color: "var(--ink)" } }, sorted.length), " 個比賽",
            regionF !== "all" && e("span", null, " · 地區：", e("b", { style: { color: "var(--ink)" } }, regionF))),
          e("p", { className: "pc-mono", style: { fontSize: 11, color: "var(--ink-faint)", margin: 0 } }, "排序：", sortLabels[sortBy])),
        sorted.length === 0
          ? e("div", { style: { textAlign: "center", padding: "70px 0" } },
              e("div", { style: { width: 56, height: 56, borderRadius: 8, background: "var(--bg-2)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" } }, e(Icon, { name: "search", size: 22, color: "var(--ink-faint)" })),
              e("h3", { className: "pc-display", style: { fontSize: 19, fontWeight: 700, margin: "0 0 8px" } }, "找不到符合的比賽"),
              e("p", { style: { fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 16px" } }, "嘗試調整搜尋條件或篩選器"),
              e("button", { onClick: clearAll, style: { padding: "9px 18px", fontSize: 12.5, fontWeight: 700, background: "var(--indigo)", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" } }, "清除所有篩選"))
          : e("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 400px), 1fr))", gap: 18 } },
              sorted.map((c) => e(Card, { key: c.id, comp: c, isFav: fav.isFav(c.id), onToggle: fav.toggle }))),
        e("div", { style: { marginTop: 36, padding: 16, border: "1px solid var(--line-soft)", borderRadius: 8, background: "var(--bg-2)" } },
          e("p", { style: { fontSize: 12, color: "var(--ink-faint)", lineHeight: 1.7, margin: 0 } },
            e("b", { style: { color: "var(--ink-soft)" } }, "免責聲明："), "以上比賽資訊僅供參考，實際報名時間、費用及規則請以各比賽官方網站公告為準。建議在報名前仔細閱讀各比賽的完整規章與條款。資訊更新日期：2026 年 3 月。"))),

      e(window.PageFooter),
      showTop && e("button", { onClick: smoothTop, className: "pc-fade",
        style: { position: "fixed", right: 24, bottom: 24, zIndex: 50, width: 46, height: 46, borderRadius: "50%", border: "none", background: "var(--indigo)", color: "#fff", cursor: "pointer", boxShadow: "0 8px 22px oklch(0.40 0.22 275 / 0.3)", display: "flex", alignItems: "center", justifyContent: "center" } },
        e(Icon, { name: "arrowUp", size: 18 })),
      sortDD && e("div", { onClick: () => setSortDD(false), style: { position: "fixed", inset: 0, zIndex: 35 } }));
  };

  function filterRow(label, opts) {
    return e("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" } },
      e("span", { style: { fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-faint)", width: 40, flexShrink: 0 } }, label),
      e("div", { style: { display: "flex", gap: 7, flexWrap: "wrap" } },
        opts.filter((o) => !o.hide).map((o) => e("button", { key: o.k, onClick: o.set, style: pill(o.on) }, o.label))));
  }
})();
