/* Shared UI: stroke icons, RGB logo, tear sound (WebAudio), helpers → window.UI */
(function () {
  const e = React.createElement;

  const PATHS = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>',
    dice: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="8" cy="8" r="1.2"/><circle cx="16" cy="16" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="16" cy="8" r="1.2"/><circle cx="8" cy="16" r="1.2"/>',
    sparkles: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M19 14l.7 1.8L21.5 16.5l-1.8.7L19 19l-.7-1.8L16.5 16.5l1.8-.7z"/>',
    tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8 8a2 2 0 0 0 2.8 0l5.2-5.2a2 2 0 0 0 0-2.8z"/><circle cx="7.5" cy="7.5" r="1"/>',
    hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
    grid: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M6 4h12v6a6 6 0 0 1-12 0zM12 16v5M8 21h8M9 16h6"/>',
    heart: '<path d="M19 14c1.5-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z"/>',
    volume: '<path d="M11 4.7 6.3 9H3v6h3.3l4.7 4.3z"/><path d="M16 9a5 5 0 0 1 0 6M19.5 7a8 8 0 0 1 0 10"/>',
    volumeX: '<path d="M11 4.7 6.3 9H3v6h3.3l4.7 4.3z"/><path d="m22 9-6 6M16 9l6 6"/>',
    arrowUp: '<path d="m5 12 7-7 7 7M12 19V5"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16V4a2 2 0 0 1 2-2h10"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/>',
    hexagon: '<path d="M21 16.05V7.95a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4a2 2 0 0 0-1 1.73v8.1a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73Z"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    bookOpen: '<path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
    type: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14zM11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    messageCircle: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
    wand: '<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M15 9h0M17.8 6.2 19 5M3 21l9-9M12.2 6.2 11 5"/>',
    externalLink: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    arrowLeft: '<path d="m12 19-7-7 7-7M19 12H5"/>',
    mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    dollar: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    bookmarkCheck: '<path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/><path d="m9 10 2 2 4-4"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    sort: '<path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.6 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.8-10-8.8z"/>',
    lightbulb: '<path d="M9 18h6M10 22h4M15.1 14a5 5 0 1 0-6.2 0c.7.5 1.1 1.3 1.1 2h4c0-.7.4-1.5 1.1-2Z"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    coffee: '<path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>',
    coffeeHot: '<path d="M17 9h1.5a3.5 3.5 0 0 1 0 7H17"/><path d="M4 9h13v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"/><path d="M2 21h17"/>',
    cake: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3M12 8v3M17 8v3"/><path d="M7 4h.01M12 4h.01M17 4h.01"/>',
  };

  function Icon({ name, size = 16, stroke = 2, style, color }) {
    return e("svg", {
      width: size, height: size, viewBox: "0 0 24 24", fill: "none",
      stroke: color || "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round",
      style: { display: "block", flexShrink: 0, ...style },
      dangerouslySetInnerHTML: { __html: PATHS[name] || "" },
    });
  }

  // Overprint logo. Light bg (default): CMY translucent circles, multiply (classic print overprint).
  // Dark bg (footer): bright RGB squares, screen (additive — overlaps go white).
  function Logo({ size = 40, dark = false }) {
    const [hover, setHover] = React.useState(false);
    let b, rad, blend, plates, extra;
    if (dark) {
      b = size * 0.55; const off = b * 0.32; rad = b * 0.5; blend = "screen"; extra = null;
      plates = [["#ff4d4d", -off, -off * 0.7], ["#3df07a", off, -off * 0.5], ["#4d8cff", 0, off]];
    } else {
      b = size * 0.5; const off = b * 0.30; rad = b * 0.5; blend = "multiply"; extra = { opacity: 0.9 };
      plates = [["#22d3ee", -off, -off * 0.6], ["#e64ba6", off, -off * 0.6], ["#f5c518", 0, off * 0.8]];
    }
    return e("div", {
      style: { position: "relative", width: size, height: size, cursor: "pointer" },
      onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    }, plates.map(([col, x, y], i) =>
      e("div", { key: i, style: {
        position: "absolute", left: "50%", top: "50%", width: b, height: b,
        marginLeft: -b / 2 + (hover ? x * 1.6 : x), marginTop: -b / 2 + (hover ? y * 1.6 : y),
        background: col, borderRadius: rad, mixBlendMode: blend,
        transition: "margin 0.4s cubic-bezier(.34,1.56,.64,1)", ...(extra || {}),
      } })
    ));
  }

  // ── tear sound (synth, no asset) ──
  let actx = null;
  function playTear(enabled) {
    if (!enabled) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const dur = 0.26, sr = actx.sampleRate, len = Math.floor(sr * dur);
      const buf = actx.createBuffer(1, len, sr);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        // crackle: bursts of noise that thin out toward the end
        const density = 1 - t * 0.6;
        ch[i] = (Math.random() * 2 - 1) * (Math.random() < density ? 1 : 0.2) * Math.pow(1 - t, 1.6);
      }
      const src = actx.createBufferSource(); src.buffer = buf;
      const bp = actx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 0.8;
      bp.frequency.setValueAtTime(1800, actx.currentTime);
      bp.frequency.exponentialRampToValueAtTime(3600, actx.currentTime + dur);
      const hp = actx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 700;
      const g = actx.createGain();
      g.gain.setValueAtTime(0.0001, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.16, actx.currentTime + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
      src.connect(hp); hp.connect(bp); bp.connect(g); g.connect(actx.destination);
      src.start();
    } catch (err) { /* no-op */ }
  }

  const weekday = (m, d) => window.PC.WEEKDAYS[new Date(2026, m - 1, d).getDay()];
  const dayOfYear = (m, d) => window.PC.indexOf(m, d) + 1;

  window.UI = { Icon, Logo, playTear, weekday, dayOfYear };
})();
