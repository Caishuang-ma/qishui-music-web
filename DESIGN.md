# 汽水音乐 · 产品宣传落地页

> 让喜欢，响起来。以 Lenis 的巨幅排版和滚动节奏，表达汽水音乐的年轻、自由与音乐感。

状态：用户已确认，页面实现与验收完成。日期：2026-10-11。

本文件完全替换原设计草案，不保留旧方案或备份。当前范围：一个连续落地页、4 个主要屏幕、无二级页面。用户已确认 L2 流畅交互。中文内容，适配桌面与手机。

## 1. Visual Theme & Atmosphere

**Style**：Dark Editorial / Music Poster。
**Keywords**：大胆、自由、律动、清晰、留白、错落、沉浸。
**Tone**：年轻音乐产品的品牌宣传，强调品牌与真实产品功能。
**Feel**：像一张会随着滚动呼吸的音乐海报。
**Interaction Tier**：L2 流畅交互，用户已确认。
**Dependencies**：原生 CSS、JavaScript、IntersectionObserver、requestAnimationFrame。项目无现有应用框架，确认后采用最小静态 HTML/CSS/JS 方案。

### 四屏内容与构图

| 屏幕 / 锚点 | 文案 | 构图与视觉时刻 |
|---|---|---|
| 01 品牌首屏 / #home | H1「汽水音乐」；副标题「让喜欢，响起来。」；正文「从熟悉的旋律，到下一首心动。打开汽水音乐，让音乐陪你进入自己的节奏。」 | 黑底，荧光绿品牌大字占上半屏；右对齐副标题；底部集中滚动提示、短介绍与下载 CTA。大字遮罩入场，低对比声波环缓慢展开。 |
| 02 音乐场景 / #discover | H2「每一刻，都有你的节奏。」；正文「通勤路上，夜晚独处，或是全力奔跑。给这一刻，选一种音乐心情。」 | 第一次下滑出现横向宣言带；1 张大横图与 2 张不同大小的竖图形成错落海报；「通勤路上 / 夜晚独处 / 运动时刻」按钮切换当前场景及说明。 |
| 03 产品功能 / #features | H2「喜欢的歌，留在身边。」；「遇见下一首喜欢」：从推荐与听歌模式中，发现想听的旋律。「喜欢，随时重听」：我喜欢的音乐、历史播放与歌单，让心动有迹可循。「收藏的旋律，继续听」：在抖音收藏的音乐，也能在汽水音乐里找到入口。 | 左侧约 2/3 为用户桌面截图，右侧约 1/3 为三条功能说明；一处小浮层强调“我喜欢的音乐”。不等大展示区，产品截图缩放入场与局部聚光。 |
| 04 下载收尾 / #download | H2「下一首喜欢，从这里开始。」；正文「打开汽水音乐，找到属于你的节奏。」；CTA「前往官方下载」；辅助「回到顶部」 | 荧光绿底与黑字，巨大结束标题、品牌图标与下载按钮。footer 合并在此屏。小声波按钮点击后反馈「好，按你的节奏来。」 |

用户的“3～4 页、不需要二级页面”按 4 个连续叙事区域解释，不建立 4 条路由。移动端自然排版可能超过 4 个实际视口，但仍只有 4 个主要区域。

### 素材与内容依据

- 用户图标：design-inputs/qishui-icon.png，86 × 78px，保持原样，用于导航小尺寸参考，不拉伸为巨型图标；大尺寸品牌图标在开发时获取官方公开资源并验图。
- 用户截图：design-inputs/qishui-desktop.png，2424 × 1664px，保持比例与真实产品样貌，不重新绘制其中的功能和文字。
- 产品文案只使用截图可确认的推荐、听歌模式、我喜欢的音乐、抖音收藏、历史播放、歌单入口。
- 第二屏需 3 张真实场景照片，开发时选图和验图；摄影用于音乐情境表达，不标成真实歌曲封面。
- 官方下载入口已核实：[汽水音乐官方下载页](https://music.douyin.com/qishui)。CTA 指向该页面，不硬编码安装包、版本或价格。
- 截图内会员价格和歌曲信息只属于图片原有内容，不扩展为宣传承诺。页面不提供未接入的歌曲播放功能。

### 参考站分析与对齐

参考：[Lenis](https://lenis.dev/)。2026-10-11 读取公开 HTML/CSS，并在 1440 × 900 视口观察首屏、正文、横向画廊与标题放大转场。资料保存于设计参考/lenis/。

首页有 **5 个顶层 section + 1 个 footer**，另有 fixed 背景。顺序为 Hero → Why smooth scroll（4 条叙述）→ Showcase（9 个案例）→ Enter Lenis 放大转场 → 介绍与 7 项功能 → footer。其他导航页面不计入首页区域。

| 维度 | 参考站 | 本方案 |
|---|---|---|
| 色板 | 黑 #000、暖白 #efefef、粉 #ff98a2、灰 #b0b0b0 | 保留黑底与高对比，粉色改为品牌荧光绿 |
| 字体 | Anton、Panchang、Roboto | Noto Sans SC + Space Grotesk，确保中文字形一致 |
| 网格 | 桌面基准 1440px：12 列、40px safe、24px gap、56px header | 12 列、40px 左右边距、24px gap；导航增至 64px，方便中文触摸目标 |
| 首屏 | 巨型 SVG 字标、轻导航、底部 CTA | 巨型中文品牌字、右对齐短句、底部行动区 |
| 展示 | sticky 横向作品画廊、卡片依次进入 | 轻视差、错落场景海报与可直接操作的场景切换 |
| 叙事长度 | 多个 500～1600vh 长场景 | 压缩为 4 个主要屏幕，采用自然纵向滚动 |
| 收尾 | 主题反转、巨大结束文字 | 绿底黑字的下载屏 |

字体、色彩和叙事时长为有意改变，原因是品牌识别、中文阅读与用户选定的 L2 强度。比例、非对称留白、大字、底部 CTA 和展示节奏为对齐项目。

## 2. Color Palette & Roles

~~~css
:root {
  --bg: #050706;
  --surface: #111713;
  --surface-alt: #19221c;
  --surface-hover: #222f26;
  --border: #314337;
  --border-hover: #a8f43b;
  --text: #f3f5ed;
  --text-secondary: #b8c1b7;
  --text-tertiary: #8e9d90;
  --accent: #c4ff3b;
  --accent-hover: #d6ff79;
  --accent-active: #a8e52b;
  --brand-green: #00d76f;
  --ink: #061109;
  --on-accent-secondary: #243b12;
  --transparent: transparent;
  --success: #57ed98;
  --error: #ff9399;
  --warning: #ffe28a;
  --bg-rgb: 5, 7, 6;
  --surface-rgb: 17, 23, 19;
  --surface-alt-rgb: 25, 34, 28;
  --surface-hover-rgb: 34, 47, 38;
  --border-rgb: 49, 67, 55;
  --border-hover-rgb: 168, 244, 59;
  --text-rgb: 243, 245, 237;
  --text-secondary-rgb: 184, 193, 183;
  --text-tertiary-rgb: 142, 157, 144;
  --accent-rgb: 196, 255, 59;
  --accent-hover-rgb: 214, 255, 121;
  --accent-active-rgb: 168, 229, 43;
  --brand-green-rgb: 0, 215, 111;
  --ink-rgb: 6, 17, 9;
  --on-accent-secondary-rgb: 36, 59, 18;
  --success-rgb: 87, 237, 152;
  --error-rgb: 255, 147, 153;
  --warning-rgb: 255, 226, 138;
}
~~~

颜色字面量只放在变量定义，组件全部引用变量。摄影与截图保留素材原有颜色。浅荧光绿用于大字和 CTA，翠绿仅用于局部声波。绿底区域使用黑字与深色辅助字，正文不得用低对比透明色。

## 3. Typography Rules

~~~css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap');
:root {
  --font-body: 'Noto Sans SC', 'Space Grotesk', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-display: 'Noto Sans SC', 'Space Grotesk', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-latin: 'Space Grotesk', 'Noto Sans SC', sans-serif;
  --font-mono: 'SFMono-Regular', Consolas, monospace;
}
body { font-family: var(--font-body); line-height: 1.75; letter-spacing: .02em; }
h1, h2, h3 { font-family: var(--font-display); line-height: 1.7; letter-spacing: .02em; }
~~~

| Role | Desktop | Mobile ≤ 600px | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| Hero H1 | clamp(104px, 17.4vw, 252px) | clamp(58px, 17vw, 102px) | 900 | 1.7 | .02em |
| Hero 副标题 | clamp(32px, 3.6vw, 52px) | 26px | 700 | 1.7 | .02em |
| Section H2 | clamp(40px, 4.9vw, 72px) | clamp(30px, 8vw, 42px) | 800 | 1.7 | .02em |
| 功能 H3 | 26px | 22px | 700 | 1.7 | .02em |
| 正文 | 17px | 16px | 400 | 1.75 | .02em |
| 导航 / 标签 | 15px | 15px | 500 | 1.7 | .02em |
| 按钮 | 16px | 16px | 700 | 1.7 | .02em |
| 英文编号 / eyebrow | 12px / 14px | 12px / 13px | 600 | 1.5 / 1.7 | .08em |
| footer 辅助信息 | 13px | 13px | 400 | 1.75 | .02em |

**文字装饰决策**：海报式编辑风格，Hero H1、H2、H3 全部使用纯色，不添加文字渐变和投影。荧光感放在背景局部，字形保持锐利。正文不做渐变、描边、打字机或乱码。

中文始终使用中文字族在前的 stack。禁止只配 Inter/Arial 等英文字体，禁止花体、书法字、复制 Lenis Gothic 字标，禁止 transform 压扁字形。按语义断行，中文标题不能逐字闪烁。字体加载失败时 fallback 仍能读到完整内容。

## 4. Component Stylings

所有交互构件必须包含 default / hover / active / focus / disabled 状态。非交互图片与普通容器不伪装成可点击卡片。

### 按钮与图标按钮

~~~css
.button {
  display: inline-flex; align-items: center; justify-content: center; gap: 14px;
  min-height: 52px; padding: 12px 24px; border: 1px solid var(--accent);
  border-radius: 10px; background: var(--accent); color: var(--ink);
  font: 700 16px/1.7 var(--font-body); letter-spacing: .02em;
  text-decoration: none; cursor: pointer;
  transition: background .2s, border-color .2s, transform .2s;
}
.button:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
.button:active { background: var(--accent-active); transform: scale(.98); }
.button:focus-visible { outline: 2px solid var(--text); outline-offset: 5px; }
.button:disabled, .button[aria-disabled='true'] { opacity: .45; cursor: default; transform: none; }
.button.secondary { background: var(--transparent); border-color: var(--border); color: var(--text); }
.button.secondary:hover { border-color: var(--accent); background: var(--surface); }
.button.secondary:active { background: var(--surface-hover); }
.button.ink { background: var(--ink); color: var(--accent); border-color: var(--ink); }
.button.ink:hover { background: var(--surface-alt); }
.button.ink:active { background: var(--surface-hover); }
.button.ink:focus-visible { outline-color: var(--ink); }
.icon-button { min-width: 48px; min-height: 48px; padding: 10px; }
~~~

下载按钮是名称明确的真实链接，进入核实过的官方下载页；官方站负责设备版本选择。页内探索按钮滚动至第二屏，不添加下载倒计时和伪安装进度。

### 场景海报与展示卡片

~~~css
.scene-card {
  position: relative; display: block; overflow: hidden; min-height: 260px;
  padding: 0; border: 1px solid var(--border); border-radius: 14px;
  background: var(--surface); color: var(--text); text-align: left;
  transition: border-color .3s, box-shadow .3s;
}
button.scene-card { cursor: pointer; }
.scene-card img { display: block; width: 100%; height: 100%; object-fit: cover; }
.scene-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-card); }
.scene-card:active { border-color: var(--accent-active); }
.scene-card:focus-visible { outline: 2px solid var(--accent); outline-offset: 5px; }
.scene-card[aria-pressed='true'] { border-color: var(--accent); }
.scene-card:disabled { opacity: .45; cursor: default; box-shadow: none; }
.scene-card::before {
  content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%),
    rgba(var(--accent-rgb), .12), var(--transparent) 70%);
  opacity: 0; transition: opacity .2s;
}
.scene-card:hover::before, .scene-card:focus-visible::before { opacity: 1; }
~~~

文字放在实体底栏或可读暗色蒙层。场景按钮承担选择行为，卡片不嵌套按钮。静态产品介绍面板使用 section/article，不能增加虚假点击功能。

### 导航、链接与标签

~~~css
.nav {
  position: fixed; inset: 0 0 auto; z-index: 50; height: 64px;
  padding-inline: var(--safe); display: flex; align-items: center;
  justify-content: space-between; gap: 24px;
  background: var(--transparent); border-bottom: 1px solid var(--transparent);
  transition: background .25s, border-color .25s;
}
.nav.scrolled { background: rgba(var(--bg-rgb), .95); border-color: var(--border); }
.nav a { min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; }
.nav a:hover { color: var(--accent); }
.nav a:active { color: var(--accent-active); }
.nav a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
.nav a[aria-disabled='true'] { opacity: .45; cursor: default; }
.nav a[aria-current='location'] { color: var(--accent); }
.text-link {
  display: inline-flex; align-items: center; min-width: 44px; min-height: 44px; color: var(--text);
  text-decoration: underline; text-underline-offset: 5px;
  text-decoration-color: var(--transparent);
  transition: color .2s, text-decoration-color .2s;
}
.text-link:hover { color: var(--accent); text-decoration-color: currentColor; }
.text-link:active { color: var(--accent-active); }
.text-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
.text-link[aria-disabled='true'] { opacity: .45; cursor: default; }
.download .text-link { color: var(--ink); }
.download .text-link:hover { color: var(--on-accent-secondary); text-decoration-color: currentColor; }
.download .text-link:active { color: var(--surface-hover); }
.download .text-link:focus-visible { outline-color: var(--ink); }
.download .text-link[aria-disabled='true'] { opacity: .45; cursor: default; }
.tag {
  min-height: 44px; padding: 8px 18px; border-radius: 999px;
  border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary);
  font: 500 15px/1.7 var(--font-body); letter-spacing: .02em; cursor: pointer;
  transition: color .2s, background .2s, border-color .2s;
}
.tag:hover { color: var(--text); background: var(--surface-hover); border-color: var(--border-hover); }
.tag:active { border-color: var(--accent-active); }
.tag:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
.tag[aria-pressed='true'] { color: var(--ink); background: var(--accent); border-color: var(--accent); }
.tag:disabled { opacity: .45; cursor: default; }
~~~

桌面导航为品牌 / 音乐场景 / 产品功能 / 下载。当前锚点用 aria-current 标记。品牌图标与名称合并为一个首页链接。图标用内联 SVG，颜色 currentColor，无 emoji。禁用锚点需移除 href、阻止行为，不能只变淡。保持默认系统指针。

## 5. Layout Principles

参考画布 1440 × 900；最大内容宽 1600px；桌面安全边距约 40px、gap 24px；正文不超过约 32 个中文字符宽。

间距梯度：8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px。

四个区域 min-height:100svh，内容可自然增长；1440 × 900 目标长度约 4～4.5 个视口。无长距离 pin 或空白占位，footer 合并第四屏。

~~~css
:root {
  --safe: clamp(24px, 2.78vw, 56px); --gap: 24px;
  --container: 1600px; --radius: 14px;
}
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font-size: 17px; }
.container { width: min(calc(100% - 2 * var(--safe)), var(--container)); margin-inline: auto; }
.grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: var(--gap); }
.chapter { position: relative; min-height: 100svh; padding-block: 96px 64px; }
.hero { min-height: 100svh; padding-top: 80px; display: flex; flex-direction: column; }
.hero-title { margin: 0; font-size: clamp(104px, 17.4vw, 252px); font-weight: 900; color: var(--accent); }
.hero-subtitle { margin-left: auto; max-width: 20ch; text-align: right; }
.hero-bottom { display: grid; grid-template-columns: 2fr 4fr 6fr; gap: var(--gap); margin-top: auto; padding-block: 32px; }
.product-shot { grid-column: span 8; min-width: 0; }
.product-copy { grid-column: span 4; min-width: 0; }
.product-shot img { display: block; width: 100%; height: auto; border-radius: var(--radius); }
.download { background: var(--accent); color: var(--ink); }
.download p { color: var(--on-accent-secondary); }
~~~

照片海报采用大小不一的组合，不能三张等大 grid。可旋转 −5° / +4°，正文不旋转。第三屏桌面截图保持 2424:1664，不能装入手机框。局部画面可裁切装饰，但不在 body 设置 overflow-x:hidden 掩盖布局错误。

## 6. Depth & Elevation

~~~css
:root {
  --shadow-flat: none;
  --shadow-card: 0 18px 42px rgba(var(--ink-rgb), .35);
  --shadow-product: 0 28px 70px rgba(var(--ink-rgb), .55);
  --shadow-accent: 0 0 0 1px rgba(var(--accent-rgb), .25);
}
~~~

| Level | Treatment | Use |
|---|---|---|
| Flat | 无阴影，以字号和空间分层 | 导航、正文、结束屏 |
| Subtle | 1px 边框 | 标签、功能面板 |
| Elevated | --shadow-card | 场景海报 |
| Product | --shadow-product | 桌面产品截图 |
| Selected | --shadow-accent | 场景选中轮廓 |

景深通过遮挡、缩放、亮度和轻位移表达。无大面积玻璃模糊，运动元素禁止 filter blur。阴影不覆盖每个组件。

## 7. Animation & Interaction

**Motion Philosophy**：每次运动服务于进入、展示和反馈；自然滚动，主信息始终可读。
**Tier**：L2。
**Dependencies**：CSS + 原生 JavaScript，无动画库强制依赖。

### 参考站 Motion Audit

| 区块 | Trigger | Driver | Elements | Effect | Timing / 范围 |
|---|---|---|---|---|---|
| Hero | 加载 | SVG / CSS / JS 状态 | 字标、文字、CTA | SVG 路径向上入场，字与按钮进入 | 源码约 1850～2050ms；新页缩短 |
| 背景 | 加载与持续绘制 | fixed 背景容器中的 canvas 与 CSS | 星点、材质、底部光带 | 氛围层贯穿多区域 | 运行时 DOM 确认 canvas，截图确认视觉；不推断内部库 |
| Why smooth scroll | section 进入 | CSS sticky | 左标题、右侧 4 条说明 | 左标题停在视口约 33%，右文经过 | 1440px 观察区约 2759px |
| Showcase | 展示区进入 | sticky + 横向 transform | 9 项案例轨道 | 纵向滚动时画廊横移 | 图片加载影响总高度 |
| Enter Lenis | 长场景滚动进度 | CSS --progress1/2 | 标题、覆盖层 | 大字上移、中心标题放大、白色覆盖横向展开 | desktop 1000vh / mobile 500vh；运行时观测 scale 约 6.74 |
| 功能枚举 / footer | 末段滚动 | sticky 舞台、主题变量 | 7 张功能卡、结束文字 | 卡片按序进入，主题反转与巨大结束字 | CSS 卡片过渡 1200ms，hover 上浮 8px |

只把源码和截图明确支持的表现写为事实。新页压缩长固定场景，使用轻视差与可操作的场景切换。

### 六类签名动效

| 类别 | 方案 | 参数 |
|---|---|---|
| Hero H1 | SplitText 式短语遮罩入场 | 800ms，错开 90ms，仅一次 |
| Section H2 | ScrollFloat 式行浮入 | 640ms，28px，IO 阈值 .18 |
| Body / Label | 语义行 ScrollReveal | 560ms，错开 60ms，不逐字 |
| 元素交互 | CTA 微磁吸与按压 | 最多 6px，仅 fine pointer |
| 交互构件 | 场景海报切换与 Spotlight | 300～450ms，transform / opacity |
| 氛围背景 | 原生 SVG 声波环与光带 | 12s 循环，仅可见时运行 |

四个签名时刻：巨型品牌字 → 首次滑动宣言带与照片展入 → 不等大产品展示 → 绿底收尾与声波彩蛋。每 1～2 屏出现一个。

优先参考 motion-library 的 SplitText、ScrollFloat、ScrollReveal、Magnet、SpotlightCard 模式，静态方案采用原生适配。若开发时直接移植 reactbits/vue-bits 源码，先核对源码与许可，在 README 注明“Motion effects derived from vue-bits by DavidHDev (MIT)”并附原仓库链接；未移植源码时不虚构致谢。

### 入场、氛围与反馈 CSS

~~~css
html { scroll-behavior: smooth; }
[id] { scroll-margin-top: 80px; }
.line-mask { display: block; overflow: hidden; }
.line-mask > span { display: block; }
.motion-ready .hero-title .line-mask > span { animation: title-in .8s cubic-bezier(.16,1,.3,1) both; }
.motion-ready .hero-title .line-mask:nth-child(2) > span { animation-delay: .09s; }
@keyframes title-in {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.motion-ready .reveal { opacity: 0; translate: 0 28px; transition: opacity .64s, translate .64s; }
.motion-ready .reveal.in-view { opacity: 1; translate: 0 0; }
.motion-ready .reveal-body { transition-duration: .56s; }
.motion-ready .reveal-scale { opacity: 0; scale: .96; transition: opacity .7s, scale .7s; }
.motion-ready .reveal-scale.in-view { opacity: 1; scale: 1; }
.parallax-layer { translate: 0 var(--py, 0px); }
.magnet-inner { display: inline-flex; gap: 14px; translate: var(--dx, 0px) var(--dy, 0px); transition: translate .15s; }
.hero-atmosphere { position: absolute; inset: 55% 0 0; overflow: clip; pointer-events: none; }
.sound-ring { opacity: .12; transform-origin: center; animation: sound-breathe 12s ease-in-out infinite; animation-play-state: paused; }
.hero-atmosphere.in-view .sound-ring { animation-play-state: running; }
@keyframes sound-breathe {
  0%,100% { transform: scale(.94); opacity: .08; }
  50% { transform: scale(1.06); opacity: .16; }
}
.marquee-window { overflow: clip; }
.marquee-track { width: max-content; display: flex; gap: 48px; animation: ribbon-pass 24s linear infinite; animation-play-state: paused; }
.marquee-window.in-view .marquee-track { animation-play-state: running; }
.marquee-window:hover .marquee-track { animation-play-state: paused; }
@keyframes ribbon-pass { to { transform: translateX(-50%); } }
.surprise-wave { display: inline-block; }
.is-pulsing .surprise-wave { animation: small-pulse .7s ease-out both; }
@keyframes small-pulse { 50% { transform: scale(1.18); } }
.page-hidden .sound-ring, .page-hidden .marquee-track { animation-play-state: paused !important; }
~~~

无脚本时内容默认可见。只有初始化成功后添加 motion-ready。宣言带两份完全相同的等宽 group（各自包含间隔）实现无缝回环，复制组 aria-hidden；正文不自动横滚。

### 观察器、视差、导航与指针交互

~~~js
function initMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const root = document.documentElement;
  const nav = document.querySelector('.nav');
  const parallax = document.querySelectorAll('.parallax-layer');
  let scrollFrame = 0;

  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      reveal.unobserve(entry.target);
    });
  }, { threshold: .18 });
  document.querySelectorAll('.reveal, .reveal-scale').forEach(el => reveal.observe(el));

  const visible = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting));
  }, { threshold: .05 });
  document.querySelectorAll('.hero-atmosphere, .marquee-window').forEach(el => visible.observe(el));

  function update() {
    nav?.classList.toggle('scrolled', scrollY > 40);
    parallax.forEach(el => {
      if (reduced.matches || !fine.matches) { el.style.setProperty('--py', '0px'); return; }
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const offset = Math.max(-32, Math.min(32, ((r.top + r.bottom) / 2 - innerHeight / 2) * .06));
      el.style.setProperty('--py', offset + 'px');
    });
    scrollFrame = 0;
  }
  const queue = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(update); };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue, { passive: true });
  reduced.addEventListener('change', queue);
  fine.addEventListener('change', queue);
  queue();

  const chapters = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.nav a[href^="#"]').forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-30% 0px -45% 0px' });
  document.querySelectorAll('.chapter[id]').forEach(el => chapters.observe(el));

  document.querySelectorAll('[data-scene]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-scene]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
      document.querySelectorAll('[data-scene-panel]').forEach(panel => {
        panel.hidden = panel.dataset.scenePanel !== button.dataset.scene;
      });
      const status = document.querySelector('[data-scene-status]');
      if (status) status.textContent = button.dataset.description || '';
    });
  });

  document.querySelectorAll('[data-spotlight], [data-magnet]').forEach(el => {
    let pointerFrame = 0;
    let last;
    el.addEventListener('pointermove', event => {
      if (reduced.matches || !fine.matches || document.hidden) return;
      last = event;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = last.clientX - r.left, y = last.clientY - r.top;
        if (el.hasAttribute('data-spotlight')) {
          el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
        }
        if (el.hasAttribute('data-magnet')) {
          el.style.setProperty('--dx', Math.max(-6, Math.min(6, (x - r.width / 2) * .08)) + 'px');
          el.style.setProperty('--dy', Math.max(-6, Math.min(6, (y - r.height / 2) * .08)) + 'px');
        }
        pointerFrame = 0;
      });
    });
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(pointerFrame); pointerFrame = 0;
      el.style.setProperty('--dx', '0px'); el.style.setProperty('--dy', '0px');
    });
  });
  const pause = () => root.classList.toggle('page-hidden', document.hidden);
  document.addEventListener('visibilitychange', pause);
  pause();

  let feedbackTimer;
  const surprise = document.querySelector('[data-surprise]');
  surprise?.addEventListener('click', () => {
    clearTimeout(feedbackTimer);
    surprise.classList.remove('is-pulsing');
    requestAnimationFrame(() => surprise.classList.add('is-pulsing'));
    const status = document.querySelector('[data-surprise-status]');
    if (status) status.textContent = '好，按你的节奏来。';
    feedbackTimer = setTimeout(() => surprise.classList.remove('is-pulsing'), 700);
  });
  root.classList.add('motion-ready');
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMotion, { once: true });
else initMotion();
~~~

场景与彩蛋提示使用 role=status、aria-live=polite。选中场景切换时焦点留在按钮，不能伪装成歌曲播放。产品截图与照片分别进入，场景面板可在可见后执行一次 opacity/transform 入场；只保留当前说明在无障碍树中。

开发时若用前置海报布局，三个静态摄影层保持视觉存在，用 data-active 切换 z-index 与 transform；隐藏行为仅用于对应文本说明面板，不应误把另外两张静态海报隐藏。

### Reduced Motion

~~~css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .motion-ready .reveal, .motion-ready .reveal-scale,
  .motion-ready .hero-title .line-mask > span { opacity: 1; translate: none; scale: 1; transform: none; }
  .parallax-layer, .magnet-inner { translate: none !important; }
  .marquee-track { transform: none; }
  .sound-ring { transform: none; opacity: .1; }
}
~~~

动态降级时展示静态声波、全部正文和正常场景按钮。所有持续动画离开视口、切后台后暂停。pointermove rAF 节流；视差最多 3 层，幅度不超过 32px；入场 transform 与 opacity 优先。无全局自定义光标、滚轮劫持、连续 blur 或永久 canvas。图片设置尺寸避免布局跳动，屏下图片 lazy-load。

## 8. Do's and Don'ts

### Do

- 让巨型品牌字与荧光绿承担辨识度。
- 四屏各自只传达一个清楚的重点。
- 保留参考站非对称留白和底部 CTA 的比例。
- 首次下滑出现宣言带，第三屏让真实产品截图成为主角。
- 所有可点击元素可由键盘操作，并有明确 focus。
- 下载统一接到核实过的官方页面。
- 中文正文 ≥ 16px，行高 ≥ 1.7，字距 .02em。
- 小屏、无脚本、减少动态效果均能阅读完整内容。

### Don't

- 不沿用或备份原设计草案。
- 不新增二级页面、定价、账户、博客或语言切换。
- 不使用三张等大功能卡的通用模板布局。
- 不复制 Lenis 字标、粉色、案例素材和英文营销文案。
- 不把桌面截图塞进手机框，不放大小图标造成失真。
- 不虚构播放、安装进度、评价、用户数或曲库数据。
- 不把截图中的会员价格扩展为当前促销承诺。
- 不自动播放声音，不把装饰声波标成真实音频分析。
- 不给运动元素加 filter blur，不用大面积 backdrop-filter。
- 不添加 scroll-jacking、L3 长固定场景或全局自定义光标。
- 不用 body 横向裁切掩盖移动端溢出。
- 不给全部标题加渐变、霓虹投影或故障效果。
- 不在产品主要内容中介绍动画库或开发实现细节。

## 9. Responsive Behavior

| Breakpoint | Width | Changes |
|---|---|---|
| Desktop | ≥ 1024px | 12 列、错落海报、产品 8+4 列，4 个主要全视口区域 |
| Tablet | 601～1023px | 6 列，产品截图与说明上下排列，海报减少重叠 |
| Mobile | ≤ 600px | 1 列、20px 边距；品牌与下载入口；取消视差、磁吸与旋转 |

触摸目标至少 44 × 44px，主 CTA 高度 ≥ 52px。移动端隐藏两个非必要导航锚点，保留品牌首页和下载，不增加汉堡菜单。四屏顺序一致，正文与按钮优先显示。

~~~css
@media (max-width: 1023px) {
  .grid { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  .product-shot, .product-copy { grid-column: 1 / -1; }
  .hero-bottom { grid-template-columns: 1fr 2fr; }
  .hero-bottom .hero-intro { grid-column: 1 / -1; }
  .chapter { padding-block: 88px 56px; }
}
@media (max-width: 600px) {
  :root { --safe: 20px; --gap: 16px; }
  body { font-size: 16px; }
  .grid { grid-template-columns: minmax(0, 1fr); }
  .nav { height: 60px; gap: 12px; }
  .nav .section-nav { display: none; }
  .hero { padding-top: 76px; min-height: 100svh; }
  .hero-title { font-size: clamp(58px, 17vw, 102px); }
  .hero-subtitle { font-size: 26px; text-align: left; margin-left: 0; }
  .hero-bottom { display: flex; flex-direction: column; gap: 20px; }
  .hero-bottom .button { width: 100%; }
  .chapter { padding-block: 80px 48px; }
  .chapter:not(.hero) { min-height: auto; }
  .chapter.hero { min-height: 100svh; padding-top: 76px; }
  .chapter h2 { font-size: clamp(30px, 8vw, 42px); }
  .scene-gallery { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; }
  .scene-card { position: relative; width: 100%; min-height: 240px; transform: none; }
  .parallax-layer, .magnet-inner { translate: none; }
  .marquee-track { animation: none; width: 100%; flex-wrap: wrap; gap: 16px; }
  .marquee-window { overflow: visible; }
  .marquee-track > [aria-hidden='true'] { display: none; }
  img, svg { max-width: 100%; }
  .download .button { width: 100%; }
}
~~~

开发后视觉验收 1440 × 900 与 390 × 844，并检查 320、600、1024px：无横向溢出、正文和 CTA 不遮挡、截图比例正确、官方入口可用、场景切换和键盘焦点可用、减少动态效果下信息完整。完成后记录参考对齐项与主动偏离项。

页面代码保存在 qishui-landing/dist/，已完成桌面与移动端视觉检查、断点布局和交互验收。具体证据与参考差异记录在 qishui-landing/AUDIT.md。
