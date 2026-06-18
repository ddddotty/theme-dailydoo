/* 品牌 Logo 設計隨機出題資料 — ported from brandChallengeData.ts. → window.BRAND.generate() */
(function () {
  const namePrefix = ["晨光","山嵐","穀雨","海風","花見","日和","森林","雲朵","微風","暮色","稻香","露珠","竹風","楓糖","潮汐","織光","霧面","裸色","琥珀","月石","絲路","墨染","雪松","琉璃","晨露","藍調","星塵","量子","雲端","光譜","脈衝","星際","深藍","光年","像素","木質","石光","綠洲","暖陽","拾光","微光","苔蘚","鐵器","棉麻","山徑","浪花","風行","峰頂","極光","墨水","種子","星火","靈感","老巷","天台","巷弄","閣樓","庭院","月台","漆器","素顏","風信","波粒","引力","維度","節點","迴路","奈米","矩陣","岩壁","草原","潛行","飛翔","奔跑","書頁","筆跡","語森","思維","碼頭","屋頂"];
  const nameSuffix = ["牧場","茶舍","食堂","釀造","甜點","咖啡","麵包","果汁","酒莊","海鮮","研究所","紡織","美學","衣櫥","飾品","珠寶","時裝","服飾","香氛","美妝","保養","香水","皮件","科技","方舟","數據","電子","網路","智能","軟體","通訊","材料","工坊","資訊","創新","生活","居家","寓所","家飾","家具","文具","書店","燈飾","陶藝","窗簾","花藝","織品","工藝","戶外","衝浪","單車","登山","水域","運動","滑翔","攀岩","露營","探險","學院","出版","書院","教育","學堂","工作室","導圖","學社","文化","餐酒館","小酒館","酒吧","料理","便當","花園"];
  const singleChars = ["晨","嵐","雨","風","花","森","雲","露","竹","楓","光","霧","墨","雪","藍","星","月","石","木","火","水","金","土","鐵","絲","玉","翠","碧","紫","朱","素","織","染","漆","陶","禾","稻","苔","蘚","松","嶺","峰","谷","川","海","潮","浪","泉","溪","澗"];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  function brandName() {
    const len = 2 + Math.floor(Math.random() * 4);
    if (len === 2) return pick(singleChars) + pick(singleChars);
    if (len === 3) {
      if (Math.random() > 0.5) { const s2 = nameSuffix.filter((s) => s.length === 2); return pick(singleChars) + pick(s2.length ? s2 : singleChars); }
      return pick(namePrefix) + pick(singleChars);
    }
    if (len === 4) { const s2 = nameSuffix.filter((s) => s.length === 2); return pick(namePrefix) + pick(s2.length ? s2 : nameSuffix); }
    const s3 = nameSuffix.filter((s) => s.length >= 3); return pick(namePrefix) + pick(s3.length ? s3 : nameSuffix);
  }

  const categories = [
    { id:"food", label:"食品飲料", icon:"🍽️", bg:"#fdecde", text:"#b9601a" },
    { id:"fashion", label:"時尚美妝", icon:"👗", bg:"#fce4ee", text:"#c83f7e" },
    { id:"tech", label:"科技數位", icon:"💻", bg:"#e3f0fd", text:"#2c6fd4" },
    { id:"lifestyle", label:"生活居家", icon:"🏠", bg:"#e2f7ee", text:"#1f9d6f" },
    { id:"sports", label:"運動戶外", icon:"⛰️", bg:"#eef7da", text:"#6a8f1a" },
    { id:"education", label:"教育文化", icon:"📚", bg:"#efeafe", text:"#7a5fe0" },
    { id:"restaurant", label:"餐飲服務業", icon:"🍷", bg:"#fdf2dc", text:"#b9831a" },
    { id:"health", label:"健康醫療", icon:"🩺", bg:"#dff6f3", text:"#1a9a8f" },
    { id:"travel", label:"旅遊觀光", icon:"✈️", bg:"#e3f4fd", text:"#2c9fd4" },
    { id:"finance", label:"金融理財", icon:"💰", bg:"#fbf3d6", text:"#a98a12" },
    { id:"pet", label:"寵物用品", icon:"🐾", bg:"#fde6ea", text:"#cf4a64" },
    { id:"art", label:"藝術設計", icon:"🎨", bg:"#e7e8fb", text:"#5a5be0" },
  ];

  const audienceMap = {
    food:["注重飲食健康的上班族","喜愛嘗鮮的美食愛好者","追求有機天然食材的家庭主婦","18-30 歲喜歡零食與飲品的年輕族群","關注食品安全的新手爸媽"],
    fashion:["20-35 歲追求時尚潮流的都會女性","注重個人風格的 Z 世代","偏好輕奢品味的中產白領","關注永續時尚的環保意識消費者","喜愛日韓系穿搭的大學生"],
    tech:["25-40 歲的科技早期採用者","追求效率的遠端工作者","對智慧家居有興趣的年輕家庭","熱衷 3C 產品的數位原住民","中小企業的 IT 決策者"],
    lifestyle:["注重居家美學的 30-45 歲屋主","喜愛北歐風格的租屋族","熱衷 DIY 手作的文青族群","剛搬新家的新婚夫妻","追求生活品質的單身貴族"],
    sports:["18-35 歲熱愛戶外運動的冒險家","週末登山健行的上班族","參加馬拉松的跑步愛好者","喜愛水上運動的年輕族群","注重體態的健身愛好者"],
    education:["3-12 歲兒童的家長","準備升學考試的高中生","追求自我成長的職場新鮮人","對藝術人文有興趣的終身學習者","需要語言學習資源的國際移工"],
    restaurant:["喜愛聚餐的親子家庭","追求約會氛圍的年輕情侶","商務午餐需求的上班族","喜歡探索特色餐廳的美食部落客","注重用餐體驗的銀髮族群","週末 brunch 愛好者","偏好異國料理的都市年輕人"],
    health:["40-65 歲注重養生保健的中年族群","產後調理需求的新手媽媽","有運動傷害的健身愛好者","關注心理健康的都市上班族","需要長照資源的銀髮家庭"],
    travel:["喜愛自由行的背包客","規劃家族旅遊的親子家庭","追求奢華度假的頂級旅客","熱愛深度文化體驗的文青旅人","經常出差的國際商務人士"],
    finance:["25-35 歲開始理財規劃的社會新鮮人","有房貸需求的年輕家庭","關注退休規劃的 45-60 歲族群","對加密貨幣有興趣的科技投資者","中小企業主的財務管理需求"],
    pet:["養貓的都市獨居青年","有多隻毛孩的寵物家庭","注重寵物飲食健康的飼主","第一次養寵物的新手飼主","帶寵物旅行的戶外愛好者"],
    art:["設計系學生與新銳設計師","對當代藝術有興趣的收藏家","需要設計服務的中小企業主","喜愛手作與插畫的創作者","關注藝文展覽的文化愛好者"],
  };

  const moods = [
    { id:"elegant", label:"優雅精緻", description:"高端質感、細膩工藝、低調奢華", keywords:["金色","絲綢","手工","精品","細節"], colorHint:"金、黑、象牙白、深棕" },
    { id:"playful", label:"活潑趣味", description:"充滿童趣、色彩繽紛、令人會心一笑", keywords:["圓潤","跳躍","笑臉","糖果色","手繪"], colorHint:"亮黃、粉紅、天藍、薄荷綠" },
    { id:"minimal", label:"極簡純粹", description:"去蕪存菁、留白呼吸、少即是多", keywords:["留白","線條","幾何","無襯線","克制"], colorHint:"白、灰、黑、單一強調色" },
    { id:"natural", label:"自然有機", description:"回歸自然、手感溫度、環保永續", keywords:["木紋","牛皮紙","植物","手寫","大地色"], colorHint:"橄欖綠、泥土棕、米白、苔蘚" },
    { id:"futuristic", label:"未來科技", description:"前衛創新、數位感、科幻視覺", keywords:["漸層","霓虹","3D","金屬","透明"], colorHint:"電光藍、霓虹紫、銀灰、深黑" },
    { id:"retro", label:"復古懷舊", description:"經典回味、時光倒流、溫暖記憶", keywords:["做舊","膠片","打字機","老照片","暖色調"], colorHint:"焦糖、暗紅、墨綠、芥末黃" },
    { id:"bold", label:"大膽前衛", description:"衝擊視覺、打破常規、強烈對比", keywords:["撞色","粗體","破格","塗鴉","實驗性"], colorHint:"螢光色、純黑、正紅、電光綠" },
    { id:"warm", label:"溫馨療癒", description:"柔軟親切、擁抱感、安心舒適", keywords:["圓角","暖光","毛線","水彩","柔焦"], colorHint:"奶油黃、珊瑚粉、淺木色、暖灰" },
    { id:"japanese", label:"日式侘寂", description:"不完美之美、質樸寧靜、歲月痕跡", keywords:["陶器","枯山水","和紙","墨色","不對稱"], colorHint:"墨黑、灰白、淡粉、枯葉色" },
    { id:"street", label:"街頭潮流", description:"次文化、嘻哈態度、都市能量", keywords:["塗鴉","貼紙","滑板","嘻哈","拼貼"], colorHint:"黑白、螢光黃、正紅、迷彩" },
    { id:"romantic", label:"浪漫夢幻", description:"柔美飄逸、花卉意象、童話感", keywords:["花瓣","蕾絲","水晶","星空","薄紗"], colorHint:"粉紫、玫瑰金、淺藍、珍珠白" },
    { id:"industrial", label:"工業粗獷", description:"原始材質、結構外露、力量感", keywords:["鐵鏽","水泥","鉚釘","管線","粗糙"], colorHint:"鐵灰、鏽紅、深棕、黑色" },
  ];

  const clientRequests = ["我們是新創品牌，需要一個能讓人一眼記住的 Logo，要能在名片和招牌上都好看。","品牌即將進行全面重塑，需要一個更現代、更有辨識度的新 Logo。","我們需要一個能同時適用於 App 圖示和實體包裝的 Logo 設計。","品牌要拓展國際市場，Logo 需要跨文化都能被理解和接受。","我們希望 Logo 能巧妙融入品牌名稱的意象，讓人看到就聯想到品牌故事。","需要一個簡潔有力的 Logo，在黑白印刷和彩色螢幕上都能清晰呈現。","我們的品牌強調手作溫度，Logo 需要傳達出人情味和工藝感。","品牌定位高端市場，Logo 必須展現出精緻與專業的質感。","我們需要一個有趣且親切的 Logo，能拉近與年輕消費者的距離。","品牌核心是永續環保，Logo 要能傳達綠色理念但不落入俗套。","我們正在開設第一家實體店面，需要一個能做成立體招牌的 Logo。","品牌要推出聯名系列，Logo 需要有足夠的彈性能與其他品牌搭配。","我們需要一個能在社群媒體大頭貼中清楚辨識的 Logo。","品牌歷史悠久，Logo 改版要保留經典元素同時注入新活力。","我們是科技新創，Logo 要展現創新精神但不能太冰冷。"];
  const extraConstraints = ["Logo 必須在 16x16 像素的 favicon 尺寸下仍可辨識","需要同時提供橫式與直式的 Logo 排列方式","Logo 必須包含品牌名稱的中文字型設計","限定使用兩種顏色以內（含黑白版本）","Logo 需要有獨立的圖標（icon）可單獨使用","必須考慮刺繡、燙印等實體應用的可行性","Logo 中需融入一個隱藏的視覺彩蛋","限定只使用幾何圖形構成","Logo 需要有動態版本的概念（motion logo）","必須在深色和淺色背景上都能使用","Logo 需要能延伸為品牌圖騰（pattern）","限定使用手繪風格呈現","Logo 必須包含英文品牌名稱","需要考慮 Logo 在圓形裁切下的呈現（如社群頭像）","Logo 設計需包含品牌標語（slogan）的排版位置","限定使用負空間（negative space）技法","Logo 必須能單色呈現且不失辨識度","需要設計 Logo 的最小使用規範（minimum size）","Logo 需要有季節或節慶的變體版本概念","限定使用對稱構圖"];

  function generate() {
    const category = pick(categories);
    return {
      brandName: brandName(),
      category,
      mood: pick(moods),
      clientRequest: pick(clientRequests),
      targetAudience: pick(audienceMap[category.id] || ["25-35 歲都市上班族"]),
      extraConstraint: pick(extraConstraints),
    };
  }

  window.BRAND = { generate, categories, moods };
})();
