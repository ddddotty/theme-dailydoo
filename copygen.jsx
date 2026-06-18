/* 文案產生器 — window.CopyGen
   props: { theme, subtitle, category, month, day }
   6 種風格 × 分類專屬模板，Fisher-Yates 不重複輪播；灰粉按鈕、柔化主題色。 */
(function () {
  const { useState, useMemo, useRef } = React;
  const e = React.createElement;
  const Icon = window.UI.Icon;

  const STYLES = [
    { id: "poetic", label: "詩意文藝", icon: "bookOpen", color: "#9a93ba", soft: "#f1f0f6" },
    { id: "bold", label: "大膽有力", icon: "zap", color: "#c19099", soft: "#f5edee" },
    { id: "warm", label: "溫暖療癒", icon: "heart", color: "#c0aa7e", soft: "#f4efe4" },
    { id: "minimalist", label: "極簡留白", icon: "type", color: "#94a0a8", soft: "#eef1f2" },
    { id: "storytelling", label: "故事敘事", icon: "messageCircle", color: "#7faa97", soft: "#eaf1ed" },
    { id: "slogan", label: "標語口號", icon: "megaphone", color: "#8aa0b8", soft: "#edf1f5" },
  ];

  function getTemplates(theme, subtitle, style, category) {
    const t = theme, s = subtitle;
    if (style === "poetic") {
      const base = [
        { title: `${t}，歲月如歌`, body: `在${t}的光影裡，我們拾起記憶的碎片，拼湊出一幅溫暖的畫卷。${s}，讓每一刻都成為永恆。`, hashtags: ["#歲月如歌", "#光影記憶", `#${t}`] },
        { title: `當${t}降臨`, body: `時光在${t}的鐘聲裡停駐，我們在歡笑與祝福中，找到了生命最柔軟的角落。`, hashtags: ["#時光停駐", "#柔軟角落", `#${t}`] },
        { title: `${t}的溫度`, body: `${s}。在這個特別的日子裡，讓我們用心感受每一份溫暖，每一次相聚都是詩。`, hashtags: ["#詩意溫度", "#相聚如詩", `#${t}`] },
        { title: `致${t}的一封情書`, body: `親愛的${t}，你帶來的不只是一個主題，而是一整片星空。${s}，讓我們在星光下書寫。`, hashtags: ["#情書", "#星空下", `#${t}`] },
        { title: `${t}，如水般流淌`, body: `日子像河流一樣流過${t}的岸邊。${s}。我們在水聲中聽見了時間的溫柔。`, hashtags: ["#如水流淌", "#時間溫柔", `#${t}`] },
        { title: `在${t}的夢裡`, body: `如果${t}是一場夢，我願意永遠不醒來。${s}，夢裡的每一幀都值得被畫下來。`, hashtags: ["#夢境", "#每一幀", `#${t}`] },
        { title: `${t}，落筆成詩`, body: `提起筆，寫下${t}的模樣。${s}。文字是最輕的行李，卻能承載最重的情感。`, hashtags: ["#落筆成詩", "#文字行李", `#${t}`] },
        { title: `風中的${t}`, body: `風帶走了什麼，又留下了什麼？在${t}的季節裡，${s}。每一陣風都是一首未完的詩。`, hashtags: ["#風中詩篇", "#未完的詩", `#${t}`] },
      ];
      if (category === "n") base.push({ title: `聽，${t}的聲音`, body: `在${t}的時節裡，大地輕聲吟唱。${s}，這是自然最動人的旋律。`, hashtags: ["#自然旋律", "#大地吟唱", `#${t}`] });
      if (category === "d") base.push({ title: `${t}，無聲的吶喊`, body: `${s}。用一張海報，替那些無法發聲的人說話。設計是最溫柔的抗議。`, hashtags: ["#無聲吶喊", "#溫柔抗議", `#${t}`] });
      if (category === "c") base.push({ title: `${t}，美的迴響`, body: `${s}。藝術是靈魂的鏡子，在${t}的光芒中，我們看見了最真實的自己。`, hashtags: ["#藝術迴響", "#靈魂之鏡", `#${t}`] });
      return base;
    }
    if (style === "bold") {
      const base = [
        { title: `${t}！`, body: `今天，我們慶祝！${s}。放下一切，盡情享受這個屬於所有人的日子。`, hashtags: ["#全力以赴", "#慶祝", `#${t}`] },
        { title: `${t}，不容錯過`, body: `${s}。這一天，值得被記住，值得被大聲歡呼。`, hashtags: ["#不容錯過", "#大聲歡呼", `#${t}`] },
        { title: `${t}：行動的時刻`, body: `${s}。不只是紀念，更是行動。改變世界，從今天開始。`, hashtags: ["#行動起來", "#改變世界", `#${t}`] },
        { title: `${t}，無所畏懼`, body: `${s}。恐懼是成長的影子，穿越它，你就是光。勇敢面對一切！`, hashtags: ["#無所畏懼", "#穿越恐懼", `#${t}`] },
        { title: `${t}——現在就做！`, body: `${s}。別再猶豫，別再等待。你的人生，由你定義。此刻就是最好的時機。`, hashtags: ["#現在就做", "#定義人生", `#${t}`] },
        { title: `${t}，顛覆一切`, body: `打破規則，重新定義。${s}。真正的力量來自於敢於不同。`, hashtags: ["#顛覆一切", "#敢於不同", `#${t}`] },
        { title: `${t}的宣言`, body: `我們宣告：${s}。這不是口號，這是承諾。用行動證明一切！`, hashtags: ["#宣言", "#用行動證明", `#${t}`] },
        { title: `別低頭，${t}`, body: `${s}。抬起頭，挺起胸。你的存在本身就是一種力量。`, hashtags: ["#別低頭", "#你就是力量", `#${t}`] },
      ];
      if (category === "d") base.push({ title: `${t}——不能再等！`, body: `${s}。沉默就是共犯。拿起你的畫筆，讓世界聽見！`, hashtags: ["#不能再等", "#設計行動", `#${t}`] });
      return base;
    }
    if (style === "warm") {
      const base = [
        { title: `${t}，溫暖相伴`, body: `${s}。在這個特別的日子裡，最珍貴的不是禮物，而是身邊有你。`, hashtags: ["#溫暖相伴", "#珍貴時光", `#${t}`] },
        { title: `${t}的擁抱`, body: `${s}。讓我們用一個擁抱，傳遞所有說不出口的愛。`, hashtags: ["#擁抱", "#傳遞愛", `#${t}`] },
        { title: `親愛的，${t}`, body: `${s}。每一個努力的你，都值得被看見，被珍惜。你已經很棒了。`, hashtags: ["#被看見", "#被珍惜", `#${t}`] },
        { title: `${t}，小確幸`, body: `${s}。生活中最美的風景，往往藏在最平凡的日常裡。用心感受吧。`, hashtags: ["#小確幸", "#平凡之美", `#${t}`] },
        { title: `慢慢來，${t}`, body: `${s}。不急，不趕。用心感受每一個當下，這就是最好的生活方式。`, hashtags: ["#慢慢來", "#用心當下", `#${t}`] },
        { title: `${t}，你辛苦了`, body: `${s}。在忙碌的日子裡，別忘了停下來，給自己一個微笑。你值得所有美好。`, hashtags: ["#你辛苦了", "#值得美好", `#${t}`] },
        { title: `因為${t}，所以溫柔`, body: `${s}。這個世界需要更多溫柔，而你的存在，就是最好的證明。`, hashtags: ["#因為溫柔", "#你的存在", `#${t}`] },
        { title: `${t}的晚安`, body: `${s}。今天也辛苦了。願你帶著${t}的溫暖，安然入夢。明天又是新的一天。`, hashtags: ["#晚安", "#安然入夢", `#${t}`] },
      ];
      if (category === "d") base.push({ title: `${t}，我們都在`, body: `${s}。這個世界並不完美，但因為有人在乎，所以還有希望。`, hashtags: ["#我們都在", "#還有希望", `#${t}`] });
      return base;
    }
    if (style === "minimalist") {
      const base = [
        { title: t, body: s + "。", hashtags: [`#${t}`, "#簡"] },
        { title: `${t}。`, body: "此刻，剛好。", hashtags: [`#${t}`, "#剛好"] },
        { title: t, body: "不多說。", hashtags: [`#${t}`, "#留白"] },
        { title: t, body: "一個主題，一張海報，一個態度。", hashtags: [`#${t}`, "#態度"] },
        { title: t, body: "Less is more.", hashtags: [`#${t}`, "#LessIsMore"] },
        { title: `${t}。`, body: "留白，是最大的勇氣。", hashtags: [`#${t}`, "#勇氣"] },
        { title: t, body: "做就對了。", hashtags: [`#${t}`, "#行動"] },
        { title: t, body: "呼吸。感受。存在。", hashtags: [`#${t}`, "#存在"] },
      ];
      if (category === "n") base.push({ title: t, body: "天地之間，萬物生長。", hashtags: [`#${t}`, "#生長"] });
      return base;
    }
    if (style === "storytelling") {
      const base = [
        { title: `那年的${t}`, body: `還記得嗎？那年的${t}，我們圍坐在一起，笑聲比煙火還燦爛。${s}，這樣的時刻，值得被永遠記住。`, hashtags: ["#那年那天", "#記憶", `#${t}`] },
        { title: `${t}的故事`, body: `每個${t}都有一個故事。今年的故事，由你來寫。${s}。`, hashtags: ["#今年的故事", "#由你來寫", `#${t}`] },
        { title: `如果${t}會說話`, body: `如果這一天會說話，它會告訴你：${s}。世界很大，但改變可以從很小的地方開始。`, hashtags: ["#如果會說話", "#從小開始", `#${t}`] },
        { title: `從${t}開始`, body: `有人問我：「什麼時候開始都不晚嗎？」我說：「${s}。」${t}，就是最好的起點。`, hashtags: ["#最好的起點", "#開始", `#${t}`] },
        { title: `${t}教會我的事`, body: `${s}。人生沒有白走的路，每一步都算數。這是${t}教會我的事。`, hashtags: ["#教會我的事", "#每步算數", `#${t}`] },
        { title: `我的${t}日記`, body: `今天，我決定好好感受${t}。不是因為特別，而是因為平凡的日子也值得被認真對待。${s}。`, hashtags: ["#日記", "#認真對待", `#${t}`] },
        { title: `${t}的清晨`, body: `那天清晨，陽光灑進窗台。我翻開日曆，看到了「${t}」。${s}。於是我決定，用一整天來好好體會。`, hashtags: ["#清晨", "#好好體會", `#${t}`] },
        { title: `寫給未來的${t}`, body: `親愛的未來的我，今天是${t}。${s}。希望你讀到這段文字時，依然記得此刻的感動。`, hashtags: ["#寫給未來", "#此刻感動", `#${t}`] },
      ];
      if (category === "d") base.push({ title: `${t}的那一天`, body: `那一天，有人決定不再沉默。${s}。於是一張海報誕生了，它改變了一些人看世界的方式。`, hashtags: ["#那一天", "#不再沉默", `#${t}`] });
      return base;
    }
    const base = [
      { title: `${t}快樂！`, body: `${s}。一起慶祝，一起歡笑！`, hashtags: [`#${t}快樂`, "#一起慶祝"] },
      { title: `${t}，全球同行`, body: `${s}。同一個世界，同一個夢想。`, hashtags: [`#${t}`, "#全球同行"] },
      { title: `${t}，你可以的！`, body: `${s}。相信自己，全世界都會為你讓路。`, hashtags: [`#${t}`, "#你可以的"] },
      { title: `${t}，勇往直前`, body: `${s}。不怕慢，只怕站。每一步都是進步。`, hashtags: [`#${t}`, "#勇往直前"] },
      { title: `${t}，創意無限`, body: `${s}。讓想像力帶你飛，讓創造力改變世界。`, hashtags: [`#${t}`, "#創意無限"] },
      { title: `${t}，好好過`, body: `${s}。認真生活，就是最好的態度。`, hashtags: [`#${t}`, "#好好過"] },
      { title: `${t}，享受當下`, body: `${s}。此刻最美，不負時光。`, hashtags: [`#${t}`, "#享受當下"] },
      { title: `一起${t}！`, body: `${s}。你不是一個人，我們一起前行。`, hashtags: [`#${t}`, "#一起前行"] },
    ];
    if (category === "d") base.push({ title: `${t}，不能忽視！`, body: `${s}。設計師的責任，是讓被忽視的被看見！`, hashtags: [`#${t}`, "#不能忽視"] });
    return base;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  window.CopyGen = function CopyGen({ theme, subtitle, category, month, day }) {
    const [style, setStyle] = useState("poetic");
    const [copy, setCopy] = useState(null);
    const [copied, setCopied] = useState(false);
    const [gen, setGen] = useState(false);
    const [count, setCount] = useState(0);
    const counters = useRef({});
    const orders = useRef({});

    const templateCount = useMemo(() => getTemplates(theme, subtitle, style, category).length, [theme, subtitle, style, category]);
    const styleDef = STYLES.find((x) => x.id === style);

    function generate() {
      setGen(true); setCopied(false);
      setTimeout(() => {
        const templates = getTemplates(theme, subtitle, style, category);
        const len = templates.length;
        let order = orders.current[style] || [], counter = counters.current[style] != null ? counters.current[style] : -1;
        if (order.length !== len || counter >= len - 1) {
          const last = counter >= 0 && order.length ? order[counter] : -1;
          let no = shuffle(Array.from({ length: len }, (_, i) => i));
          if (no.length > 1 && no[0] === last) { const sw = 1 + Math.floor(Math.random() * (no.length - 1)); [no[0], no[sw]] = [no[sw], no[0]]; }
          orders.current[style] = no; order = no; counter = -1;
        }
        counter += 1; counters.current[style] = counter;
        setCopy({ ...templates[order[counter]] });
        setCount((c) => c + 1); setGen(false);
      }, 260);
    }

    function doCopy() {
      if (!copy) return;
      const text = `${copy.title}\n\n${copy.body}\n\n${copy.hashtags.join(" ")}`;
      navigator.clipboard && navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }

    const pinkBtn = { border: "1px solid var(--btn-pink-line)", borderLeft: "5px solid var(--btn-pink-bar)", background: "var(--btn-pink)", color: "var(--btn-pink-text)" };

    return e("div", { style: { marginTop: 22 } },
      e("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 } },
        e(Icon, { name: "wand", size: 15, color: "var(--ink-soft)" }),
        e("span", { style: { fontSize: 11.5, fontWeight: 700, letterSpacing: "0.12em", color: "var(--ink-soft)", textTransform: "uppercase" } }, "文案產生器"),
        e("span", { style: { fontSize: 11, color: "var(--ink-faint)", marginLeft: "auto" } }, `${templateCount} 種變化`)),
      e("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7, marginBottom: 12 } },
        STYLES.map((sd) => {
          const on = style === sd.id;
          return e("button", { key: sd.id, onClick: () => { setStyle(sd.id); setCopy(null); },
            style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "9px 6px",
              borderRadius: 5, border: `1px solid ${on ? sd.color : "var(--line-soft)"}`, cursor: "pointer",
              background: on ? sd.soft : "transparent", color: on ? sd.color : "var(--ink-faint)",
              fontWeight: on ? 600 : 400, transition: "all 0.2s" } },
            e(Icon, { name: sd.icon, size: 15 }),
            e("span", { style: { fontSize: 10.5, lineHeight: 1.2 } }, sd.label));
        })),
      e("button", { onClick: generate, disabled: gen,
        style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "11px", borderRadius: 5, cursor: "pointer", fontSize: 14, fontWeight: 700, opacity: gen ? 0.6 : 1, ...pinkBtn } },
        e(Icon, { name: gen ? "refresh" : "wand", size: 16, style: gen ? { animation: "pc-spin 0.8s linear infinite" } : null }),
        copy ? "重新生成" : "生成文案"),
      copy && e("div", { key: `${style}-${count}`, className: "pc-fade-up",
        style: { marginTop: 12, padding: 16, background: "var(--bg)", borderRadius: 5, border: "1px solid var(--line-soft)" } },
        e("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 } },
          e("span", { style: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 600,
            padding: "3px 9px", borderRadius: 4, border: `1px solid ${styleDef.color}`, color: styleDef.color, background: styleDef.soft } },
            e(Icon, { name: styleDef.icon, size: 12 }), styleDef.label),
          e("span", { style: { fontSize: 10.5, color: "var(--ink-faint)" } }, `${month}月${day}日`)),
        e("h4", { className: "pc-display", style: { fontSize: 19, fontWeight: 500, lineHeight: 1.35, margin: "0 0 9px", color: "var(--ink)" } }, copy.title),
        e("p", { style: { fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7, margin: "0 0 12px" } }, copy.body),
        e("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 } },
          copy.hashtags.map((h, i) => e("span", { key: i, style: { fontSize: 11, color: "var(--indigo)", background: "var(--card)", border: "1px solid var(--line-soft)", padding: "2px 7px", borderRadius: 4 } }, h))),
        e("button", { onClick: doCopy,
          style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px",
            fontSize: 12.5, fontWeight: 700, borderRadius: 5, cursor: "pointer",
            border: copied ? "1px solid #7faa97" : "1px solid var(--btn-pink-line)", borderLeft: copied ? "5px solid #7faa97" : "5px solid var(--btn-pink-bar)",
            background: copied ? "#eaf1ed" : "var(--btn-pink)", color: copied ? "#5a8a72" : "var(--btn-pink-text)" } },
          e(Icon, { name: copied ? "check" : "copy", size: 14 }), copied ? "已複製到剪貼簿" : "複製文案")));
  };
})();
