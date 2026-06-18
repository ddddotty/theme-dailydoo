/* 撕曆卡 — window.TearCard (forwardRef)
   props: { soundOn, onOpenDay, onChange }
   ref methods: tear(), goToday()。onChange 回報 {entry, count, isToday}。
   拖曳右下角往左上撕，1:1 即時跟手（translate3d），放開撕走、揭開明日，撕痕計數。 */
(function () {
  const { useState, useRef, useCallback, useEffect, useImperativeHandle, forwardRef } = React;
  const e = React.createElement;
  const PC = window.PC, UI = window.UI, Icon = UI.Icon;
  const PEEL_RANGE = 150, TEAR_THRESHOLD = 0.4;

  function Sheet({ entry }) {
    const c = PC.CAT[entry.category];
    const wd = UI.weekday(entry.month, entry.day);
    return e("div", { style: { position: "absolute", inset: 0 } },
      e("div", { style: { height: 14, background: c.color } }),
      e("div", { style: { display: "flex", justifyContent: "center", gap: 38, padding: "12px 0", background: "oklch(0.975 0.005 60)" } },
        [0, 1, 2].map((i) => e("div", { key: i, style: { width: 15, height: 15, borderRadius: "50%", border: "2px solid var(--line)" } }))),
      e("div", { style: { textAlign: "center", paddingTop: 22 } },
        e("span", { className: "pc-display pc-mono", style: { fontSize: 13, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: c.color } }, PC.MONTHS_EN[entry.month - 1])),
      e("div", { className: "pc-display pc-tnum", style: { textAlign: "center", fontSize: 150, fontWeight: 800, fontStyle: "italic",
        lineHeight: 0.86, letterSpacing: "-0.04em", color: "var(--indigo)", padding: "2px 0 6px" } }, String(entry.day).padStart(2, "0")),
      e("div", { style: { textAlign: "center", fontSize: 15, fontWeight: 500, letterSpacing: "0.18em", color: "var(--ink-faint)", paddingBottom: 20 } }, `星期${wd}`),
      e("div", { style: { height: 1, background: "var(--line)", margin: "0 52px" } }),
      e("div", { style: { padding: "26px 44px 38px", textAlign: "center" } },
        e("div", { style: { fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: c.text, marginBottom: 10 } }, c.label),
        e("h3", { className: "pc-display", style: { fontSize: 27, fontWeight: 600, color: "var(--ink)", margin: "0 0 10px", lineHeight: 1.2 } }, entry.theme),
        e("p", { style: { fontSize: 14, color: "var(--ink-soft)", margin: 0, lineHeight: 1.6 } }, entry.subtitle)));
  }

  function Scrap({ entry, onDone }) {
    const c = PC.CAT[entry.category];
    useEffect(() => { const t = setTimeout(onDone, 1150); return () => clearTimeout(t); }, [onDone]);
    const drift = (Math.random() - 0.5) * 130, rot = (Math.random() - 0.5) * 90;
    return e("div", { style: { position: "absolute", left: "50%", top: 70, width: 120, height: 150, marginLeft: -60,
      background: "var(--card)", borderRadius: 3, overflow: "hidden", pointerEvents: "none", zIndex: 1,
      boxShadow: "0 6px 18px rgba(42,26,17,0.14)", animation: "pc-scrap-fall 1.1s cubic-bezier(.4,.1,.6,1) forwards",
      "--drift": `${drift}px`, "--rot": `${rot}deg` } },
      e("div", { style: { height: 6, background: c.color } }),
      e("div", { className: "pc-display pc-tnum", style: { textAlign: "center", fontSize: 64, fontStyle: "italic", fontWeight: 800, color: "var(--indigo)", lineHeight: 1.2, paddingTop: 14 } }, String(entry.day).padStart(2, "0")),
      e("div", { style: { textAlign: "center", fontSize: 10, color: "var(--ink-soft)", padding: "4px 8px" } }, entry.theme));
  }

  window.TearCard = forwardRef(function TearCard({ soundOn, onOpenDay, onChange }, ref) {
    const startIdx = Math.max(0, PC.indexOf(PC.TODAY.month, PC.TODAY.day));
    const [idx, setIdx] = useState(startIdx);
    const [tearing, setTearing] = useState(false);
    const [count, setCount] = useState(0);
    const [scraps, setScraps] = useState([]);
    const [hint, setHint] = useState(true);
    const topRef = useRef(null), curlRef = useRef(null), drag = useRef(null), peelRef = useRef(0), justDragged = useRef(false);

    const entry = PC.DATA[idx % PC.DATA.length];
    const nextEntry = PC.DATA[(idx + 1) % PC.DATA.length];
    const onToday = idx === startIdx;

    useEffect(() => { onChange && onChange({ entry, count, isToday: onToday }); }, [idx, count]); // eslint-disable-line

    const paint = useCallback((p) => {
      const top = topRef.current, curl = curlRef.current;
      if (!top) return;
      const e2 = p * (2 - p);
      top.style.transform = `translate3d(${-e2 * 22}px, ${-e2 * 16}px, ${e2 * 40}px) rotate(${-e2 * 9}deg) rotateY(${e2 * 7}deg) scale(${1 - p * 0.01})`;
      top.style.boxShadow = `0 ${10 + e2 * 32}px ${30 + e2 * 55}px rgba(42,26,17,${0.10 + e2 * 0.13})`;
      if (curl) {
        const s = e2 * (PEEL_RANGE + 28);
        if (p > 0.004) { curl.style.display = "block"; curl.style.width = s + "px"; curl.style.height = s + "px"; curl.style.borderTopLeftRadius = s * 0.55 + "px"; }
        else curl.style.display = "none";
      }
    }, []);

    const setEase = useCallback((mode) => {
      const top = topRef.current, curl = curlRef.current;
      const t = mode === "snap" ? "transform 0.5s cubic-bezier(.22,1,.36,1), box-shadow 0.5s ease" : "none";
      if (top) top.style.transition = t;
      if (curl) curl.style.transition = mode === "snap" ? "width 0.4s cubic-bezier(.22,1,.36,1), height 0.4s cubic-bezier(.22,1,.36,1)" : "none";
    }, []);

    const doTear = useCallback(() => {
      if (tearing) return;
      UI.playTear(soundOn);
      const top = topRef.current, curl = curlRef.current;
      if (curl) curl.style.display = "none";
      if (top) {
        top.style.transition = "transform 0.82s cubic-bezier(.33,0,.18,1), opacity 0.72s ease-in";
        top.style.transform = "translate3d(-26%, -64%, 70px) rotate(-20deg) rotateY(30deg) scale(0.86)";
        top.style.opacity = "0";
      }
      setTearing(true);
      const id = Date.now();
      setScraps((arr) => [...arr, { id, entry: PC.DATA[idx % PC.DATA.length] }]);
      setTimeout(() => {
        setIdx((i) => i + 1); setCount((c) => c + 1); setTearing(false); peelRef.current = 0;
        if (top) { top.style.transition = "none"; top.style.transform = "none"; top.style.opacity = "1"; top.style.boxShadow = "none"; }
        if (curl) curl.style.display = "none";
        setHint(true);
      }, 780);
    }, [idx, tearing, soundOn]);

    const advance = useCallback((targetIdx) => {
      const top = topRef.current, curl = curlRef.current;
      if (top) { top.style.transition = "none"; top.style.transform = "none"; top.style.opacity = "1"; top.style.boxShadow = "none"; }
      if (curl) curl.style.display = "none";
      peelRef.current = 0; setIdx(targetIdx); setHint(true);
    }, []);

    useImperativeHandle(ref, () => ({ tear: doTear, goToday: () => { if (!tearing) advance(startIdx); } }), [doTear, advance, tearing, startIdx]);

    const onDown = useCallback((ev) => {
      if (tearing) return;
      ev.stopPropagation();
      ev.currentTarget.setPointerCapture && ev.currentTarget.setPointerCapture(ev.pointerId);
      drag.current = { x: ev.clientX, y: ev.clientY, moved: false };
      setHint(false); setEase("none"); peelRef.current = 0; paint(0);
    }, [tearing, setEase, paint]);
    const onMove = useCallback((ev) => {
      if (!drag.current) return;
      const pt = (ev.getCoalescedEvents && ev.getCoalescedEvents().slice(-1)[0]) || ev;
      const dx = drag.current.x - pt.clientX, dy = drag.current.y - pt.clientY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) drag.current.moved = true;
      const p = Math.min(1, Math.max(0, (dx + dy) / 2) / PEEL_RANGE);
      peelRef.current = p; paint(p);
    }, [paint]);
    const onUp = useCallback(() => {
      if (!drag.current) return;
      const moved = drag.current.moved; drag.current = null;
      if (moved) { justDragged.current = true; setTimeout(() => { justDragged.current = false; }, 220); }
      if (peelRef.current > TEAR_THRESHOLD) doTear();
      else { setEase("snap"); peelRef.current = 0; paint(0); setHint(true); }
    }, [doTear, setEase, paint]);

    const jump = (dir) => { if (tearing) return; advance(Math.max(0, Math.min(PC.DATA.length - 1, idx + dir))); };

    return e("div", { style: { position: "relative", width: 380, height: 560, margin: "0 auto", perspective: 1400 } },
      scraps.map((sc) => e(Scrap, { key: sc.id, entry: sc.entry, onDone: () => setScraps((a) => a.filter((x) => x.id !== sc.id)) })),
      e("div", { style: { position: "absolute", inset: 0, transform: "translate(8px, 10px) rotate(1.4deg)", background: "var(--card)", borderRadius: 4, boxShadow: "0 4px 16px rgba(42,26,17,0.06)" } }),
      e("div", { style: { position: "absolute", inset: 0, transform: "translate(4px, 5px) rotate(-0.8deg)", background: "var(--card)", borderRadius: 4, boxShadow: "0 4px 14px rgba(42,26,17,0.06)" } }),
      e("div", { style: { position: "absolute", inset: 0, background: "var(--card)", borderRadius: 4, overflow: "hidden" } }, e(Sheet, { entry: nextEntry })),
      e("div", { ref: topRef, onClick: () => { if (peelRef.current < 0.05 && !tearing && !justDragged.current) onOpenDay && onOpenDay(entry); },
        style: { position: "absolute", inset: 0, background: "var(--card)", borderRadius: 4, overflow: "hidden", cursor: "pointer",
          transformOrigin: "top left", willChange: "transform", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" } },
        e(Sheet, { entry }),
        e("div", { ref: curlRef, style: { position: "absolute", right: 0, bottom: 0, width: 0, height: 0, display: "none",
          background: "linear-gradient(135deg, oklch(0.88 0.01 60) 0%, oklch(0.97 0.006 60) 55%, #fff 100%)",
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)", transformOrigin: "bottom right",
          boxShadow: "-6px -6px 14px rgba(42,26,17,0.10)", pointerEvents: "none" } })),
      e("button", { onClick: () => jump(-1), style: navBtn("left"), title: "前一天" }, e(Icon, { name: "chevronLeft", size: 20 })),
      e("button", { onClick: () => jump(1), style: navBtn("right"), title: "後一天" }, e(Icon, { name: "chevronRight", size: 20 })),
      e("div", { onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp,
        style: { position: "absolute", right: 0, bottom: 0, width: 132, height: 132, cursor: "grab", zIndex: 5, touchAction: "none" }, title: "拖曳撕下" },
        hint && !tearing && e("div", { style: { position: "absolute", right: 16, bottom: 14, fontSize: 11, color: "var(--ink-faint)", display: "flex", alignItems: "center", gap: 4, pointerEvents: "none" } },
          e(Icon, { name: "chevronLeft", size: 13, style: { transform: "rotate(45deg)" } }), "撕")));
  });

  function navBtn(side) {
    return { position: "absolute", [side]: -54, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%",
      border: "1px solid var(--line)", background: "var(--card)", color: "var(--indigo)", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 6, boxShadow: "0 2px 10px rgba(42,26,17,0.08)" };
  }
})();
