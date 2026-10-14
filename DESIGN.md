# 汽水音乐 · Web 设计规范

状态：本轮最终方案，依据当前页面实现同步。日期：2026-10-11。仅做电脑端；一个连续落地页、四个主要屏幕、无二级页面。本文件覆盖原规范，不保留旧草案或备份。本文记录最终设计与交互，不代替独立页面验收记录。

## 1. Visual Theme & Atmosphere

**Style**：Dark Editorial / Music Poster。黑底、荧光绿、巨型中文品牌字、轻导航、真实摄影与三维层次。全页是一张连续呼吸的音乐海报。

**Interaction Tier**：沿用用户选定的 L2，按用户最新要求强化电脑端三维与手势反馈。页面主体使用 CSS、原生 JavaScript、IntersectionObserver 与 requestAnimationFrame。开场汽水瓶是唯一例外：桌面端首次进入用 Three.js（CDN ESM，无构建）播放约 3 秒的玻璃瓶开盖，然后交还给本页标题。减少动态或窄于 1024px 时跳过开场。

| 屏幕 / 锚点 | 主信息 | 最终构图与交互 |
|---|---|---|
| 01 / #home | 汽水音乐，让喜欢响起来 | 巨型品牌字、非对称短句、底部官方下载 CTA；文字遮罩入场，全局声场背景贯穿后续区域 |
| 02 / #discover | 每一刻，都有你的节奏 | 宣言带、八个场景标签、倾斜三维摄影圆环；双指上下 / 左右滑动、单一主指针上下 / 左右拖动、左右按钮与键盘切换 |
| 03 / #features | 喜欢，不止一种方式 | 默认 / 熟悉 / 新鲜三模式，原生唱片、摄影封套与收藏气泡；唱片中心唯一播放按钮打开完整官方 MV 弹窗，右上方显示歌曲信息 |
| 04 / #download | 把音乐，带进生活 | 延续黑底与荧光绿标题；立体品牌物体、轨道线、三张生活摄影、绿色下载票券与页脚声波彩蛋 |

所有屏底页数标记已删除，第四屏保持黑底。第三屏以独立模式视觉与官方视频体验表达产品能力，不展示桌面产品截图。用户截图只作为真实产品功能、场景和听歌模式的内容依据。

八场景为通勤路上、夜晚独处、动感健身、专注模式、Chill 放松、旅行、海边、驾车。通勤照片为明确的城市地铁旅程。摄影表达音乐情境；唱片封套为宣传图形，不能把这些摄影标成真实歌曲封面。

官方行动入口：[汽水音乐官方下载页](https://music.douyin.com/qishui)。歌曲体验为 Kate Bush 的 [Running Up That Hill 官方 MV](https://www.youtube.com/watch?v=wp43OdtAAkM)，视频 ID `wp43OdtAAkM`。点击后载入 YouTube 可见播放器，保留原生播放、暂停、音量和全屏控制；不下载歌曲或视频，不重新上传媒体。是否能成功载入以第三方播放器实际状态为准。

**参考对齐**：Lenis 的巨幅排版、非对称留白、宣言带与底部行动区；其首页有 5 个顶层 section + footer，本方案压缩为四个主要区域。Lenis 的粉色、拉丁字标和长 pin 叙事改为品牌绿、中文字形与电脑端直接交互。第二屏参考 pmndrs [Cards With Border Radius](https://pmndrs.github.io/examples/cards-with-border-radius/) 的环形排列、前后遮挡、外框放大与照片退让。该示例的真 WebGL 弯曲几何由本页 CSS 3D 近似；本页新增场景选择、手势吸附及中文状态反馈。原例审计见 `reference-card-audit.md`，其中原生适配建议属于参考分析，本文件描述当前最终参数。

## 2. Color Palette & Roles

所有颜色字面量集中于变量，组件引用变量。主体保持品牌绿；熟悉模式用暖杏色，新鲜模式用浅蓝色，仅用于唱片标签、封套文字与收藏心形的模式反馈。照片保留原有色彩。

```css
:root {
  --bg: #050706; --surface: #111713; --surface-alt: #19221c; --surface-hover: #222f26;
  --border: #314337; --border-hover: #a8f43b; --text: #f3f5ed; --text-secondary: #b8c1b7;
  --text-tertiary: #8e9d90; --accent: #c4ff3b; --accent-hover: #d6ff79; --accent-active: #a8e52b;
  --brand-green: #00d76f; --ink: #061109; --on-accent-secondary: #243b12; --transparent: transparent;
  --mode-warm: #f4bd72; --mode-cool: #a8cfff; --mode-warm-rgb: 244,189,114; --mode-cool-rgb: 168,207,255;
  --success: #57ed98; --error: #ff9399; --warning: #ffe28a;
  --bg-rgb: 5,7,6; --surface-rgb: 17,23,19; --surface-alt-rgb: 25,34,28; --surface-hover-rgb: 34,47,38;
  --border-rgb: 49,67,55; --border-hover-rgb: 168,244,59; --text-rgb: 243,245,237;
  --text-secondary-rgb: 184,193,183; --text-tertiary-rgb: 142,157,144; --accent-rgb: 196,255,59;
  --accent-hover-rgb: 214,255,121; --accent-active-rgb: 168,229,43; --brand-green-rgb: 0,215,111;
  --ink-rgb: 6,17,9; --on-accent-secondary-rgb: 36,59,18; --success-rgb: 87,237,152;
  --error-rgb: 255,147,153; --warning-rgb: 255,226,138;
  --font-body: 'Noto Sans SC','Space Grotesk','PingFang SC','Microsoft YaHei',sans-serif;
  --font-display: 'Noto Sans SC','Space Grotesk','PingFang SC','Microsoft YaHei',sans-serif;
  --font-latin: 'Space Grotesk','Noto Sans SC',sans-serif;
  --safe: clamp(24px,2.78vw,56px); --gap: 24px; --container: 1600px; --radius: 14px;
  --ease: cubic-bezier(.16,1,.3,1);
  --shadow-card: 0 18px 42px rgba(var(--ink-rgb),.35);
  --shadow-product: 0 28px 70px rgba(var(--ink-rgb),.55);
  --shadow-accent: 0 0 0 1px rgba(var(--accent-rgb),.25);
}
```

黑底上的主文字使用 --text，正文使用 --text-secondary；荧光绿按钮或下载票券使用 --ink。全局曲线使用 mix-blend-mode:difference；内容层在背景之上，保持清晰对比。

## 3. Typography Rules

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap');
body { font: 400 17px/1.75 var(--font-body); letter-spacing: .02em; }
h1,h2,h3 { font-family: var(--font-display); line-height: 1.7; letter-spacing: .02em; }
```

| 角色 | 电脑端字号 | 字重 / 行高 |
|---|---|---|
| Hero H1 | clamp(104px,17.4vw,252px) | 900 / 1.7 |
| Hero 副标题 | clamp(32px,3.6vw,52px) | 700 / 1.7 |
| 音乐场景 H2 | clamp(36px,4.1vw,62px) | 800 / 1.7 |
| 模式 H2 | clamp(40px,4.4vw,64px) | 800 / 1.7 |
| 下载 H2 | clamp(72px,6.4vw,96px) | 900 / 1.7，字距 .02em |
| 功能 H3 / 模式反馈 H3 | 19px / 22px | 700 / 1.7 |
| 通用 H3 / 播放器英文 H3 | 26px / 28px | 700 / 1.7 |
| 正文 | 15～17px | 400 / 1.75 |
| 场景与模式按钮 | 15px | 500 / 1.7 |
| 下载票券主文案 | 25px；矮屏23px | 900 / 1.7，字距 .02em |
| 辅助标签与摄影题注 | 12～14px | 400～600 |

中文使用 Noto Sans SC 在前的 fallback stack；英文编号、歌名与大型 QISHUI 装饰使用 Space Grotesk。H1/H2/H3 为纯色，无渐变、投影或乱码；宣言带部分描边文字与第四屏巨型描边 QISHUI 为海报装饰。封套上的「听见心动」采用1.35紧行距，属于视觉图形；阅读正文保持1.75。禁止只配西文字体、Emoji 图标、压扁中文字形和满屏光晕文字。

## 4. Component Stylings

各交互保留 default / hover / active / focus / disabled。SVG 默认 currentColor；控件目标至少44px。所有按钮和链接共用以下焦点基线，因此歌曲播放、关闭和场景箭头的 focus 状态也明确可见。

```css
button:focus-visible,a:focus-visible { outline: 2px solid var(--accent); outline-offset: 5px; }
```

### 导航、下载按钮与文字链接

导航当前区域用 aria-current；品牌图标与名称为同一个首页链接。链接 disabled 状态需禁用行为，不能只改透明度。

```css
.nav { min-width: 1024px; height: 64px; position: fixed; inset: 0 0 auto; z-index: 50; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 0 var(--safe); border-bottom: 1px solid var(--transparent); background: var(--transparent); transition: background .25s,border-color .25s; }
.nav.scrolled { background: rgba(var(--bg-rgb),.96); border-color: rgba(var(--border-rgb),.55); }
.brand { display: inline-flex; align-items: center; gap: 10px; min-height: 44px; font-size: 18px; font-weight: 800; }
.brand-icon { display: inline-block; width: 32px; height: 32px; border-radius: 8px; overflow: hidden; background: var(--ink); flex: 0 0 auto; }
.brand-icon img { width: 100%; height: 100%; object-fit: contain; }
.nav-links { display: flex; align-items: center; gap: 32px; font-size: 15px; }
.nav a { min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; }
.nav a:hover,.nav a[aria-current='location'] { color: var(--accent); }
.nav a:active { color: var(--accent-active); }
.nav a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
.nav a[aria-disabled='true'] { opacity: .45; cursor: default; }
.nav-download { gap: 12px; }
.nav-download .icon { width: 18px; height: 18px; }
```

```css
.button { display: inline-flex; align-items: center; justify-content: center; gap: 14px; min-height: 56px; padding: 14px 24px; border: 1px solid var(--accent); border-radius: 10px; background: var(--accent); color: var(--ink); font: 700 16px/1.7 var(--font-body); letter-spacing: .02em; cursor: pointer; transition: background .2s,border-color .2s,transform .2s; }
.button:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
.button:active { background: var(--accent-active); transform: scale(.98); }
.button:focus-visible { outline: 2px solid var(--text); outline-offset: 5px; }
.button:disabled,.button[aria-disabled='true'] { opacity: .45; cursor: default; transform: none; }
.button.ink { background: var(--ink); color: var(--accent); border-color: var(--ink); }
.button.ink:hover { background: var(--surface-alt); }
.button.ink:active { background: var(--surface-hover); }
.button.ink:focus-visible { outline-color: var(--ink); }
.button-icon { width: 36px; height: 36px; display: grid; place-items: center; background: var(--ink); color: var(--accent); border-radius: 7px; }
.magnet-inner { display: inline-flex; align-items: center; justify-content: center; gap: 28px; translate: var(--dx,0px) var(--dy,0px); transition: translate .15s; }
.text-link { display: inline-flex; align-items: center; min-width: 44px; min-height: 44px; color: var(--text); text-decoration: underline; text-underline-offset: 5px; text-decoration-color: var(--transparent); transition: color .2s,text-decoration-color .2s; }
.text-link:hover { color: var(--accent); text-decoration-color: currentColor; }
.text-link:active { color: var(--accent-active); }
.text-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
.text-link[aria-disabled='true'] { opacity: .45; cursor: default; }
```

### 八场景圆环与选择控件

外层 .scene-position 承担45°等分位置，内部 .scene-card 独立执行悬停缩放，避免定位与反馈互相覆盖。标签与卡片同步 aria-pressed，当前卡片使用 roving tabindex。选中外框1.025倍、照片1.12倍；悬停外框1.07倍、照片退到1倍、圆角16→32px。后排卡片通过独立背面摄影保持视觉存在。画廊内部 touch-action:none，支持上下与左右手势；画廊外保持正常页面滚动。

```css
.scene-options { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 30px; max-width: 470px; }
.tag { min-width: 44px; min-height: 44px; padding: 8px 16px; border-radius: 999px; border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); font: 500 15px/1.7 var(--font-body); letter-spacing: .02em; cursor: pointer; transition: color .2s,background .2s,border-color .2s; }
.tag:hover { color: var(--text); background: var(--surface-hover); border-color: var(--border-hover); }
.tag:active { border-color: var(--accent-active); }
.tag:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
.tag[aria-pressed='true'] { color: var(--ink); background: var(--accent); border-color: var(--accent); }
.tag:disabled { opacity: .45; cursor: default; }
.scene-status { margin-top: 22px; font-size: 15px; min-height: 54px; max-width: 28ch; }
.scene-stage { min-width: 0; }
.scene-gallery { position: relative; height: 520px; width: 100%; perspective: 1800px; perspective-origin: 50% 45%; --ring-radius: clamp(250px,calc(25vw - 40px),320px); --card-width: clamp(140px,11.4vw,164px); --card-height: 248px; cursor: grab; touch-action: none; user-select: none; }
.scene-carousel { position: absolute; inset: 0; transform-style: preserve-3d; transform: rotateZ(calc(-5deg + var(--gallery-tilt,0deg))) rotateX(calc(-23deg + var(--pointer-y,0) * 2deg)) rotateY(calc(var(--carousel-position,0) * -45deg)); }
.scene-gallery.is-scrubbing,.scene-gallery.is-scrubbing .scene-card { cursor: grabbing; }
.scene-gallery.is-scrubbing .scene-carousel { transition: none; }
.scene-position { position: absolute; left: calc(50% - var(--card-width) / 2); top: 125px; width: var(--card-width); height: var(--card-height); transform-style: preserve-3d; transform: rotateY(var(--card-angle)) translateZ(var(--ring-radius)); }
.scene-position::before { content: ""; position: absolute; inset: 0; border: 1px solid var(--border); border-radius: 16px; background: linear-gradient(rgba(var(--ink-rgb),.2),rgba(var(--ink-rgb),.4)),var(--card-image) center / cover; transform: rotateY(180deg); backface-visibility: hidden; }
.scene-card { display: block; position: relative; width: 100%; height: 100%; padding: 0; border: 1px solid rgba(var(--text-rgb),.2); border-radius: 16px; overflow: hidden; background: var(--surface); color: var(--text); cursor: pointer; text-align: left; backface-visibility: hidden; transform: scale(1); box-shadow: var(--shadow-card); transition: transform .5s var(--ease),border-radius .5s var(--ease),border-color .3s; }
.scene-card img { width: 100%; height: 100%; display: block; object-fit: cover; transform: scale(1.32); transition: transform .7s var(--ease),opacity .4s; }
.scene-card::after { content: ''; position: absolute; inset: 35% 0 0; background: linear-gradient(var(--transparent),rgba(var(--ink-rgb),.82)); pointer-events: none; }
.scene-card-caption { position: absolute; inset: auto 16px 20px; z-index: 3; display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 17px; font-weight: 700; }
.scene-card-caption .icon { width: 20px; height: 20px; color: var(--accent); }
.scene-card[data-scene="seaside"] img { object-position: 38% 50%; }
.scene-card[data-scene="relax"] img { object-position: 55% 48%; }
.scene-card.is-selected { transform: scale(1.025); border-color: var(--accent); }
.scene-card.is-selected img { transform: scale(1.12); }
.scene-card:hover { transform: scale(1.07); border-radius: 32px; border-color: var(--accent-hover); }
.scene-card:hover img { transform: scale(1); }
.scene-card:active { transform: scale(1.02); border-color: var(--accent-active); }
.scene-card:focus-visible { outline: 3px solid var(--accent); outline-offset: 6px; border-radius: 30px; }
.scene-card:disabled { opacity: .45; cursor: default; }
.scene-card::before { content: ''; position: absolute; inset: 0; z-index: 2; pointer-events: none; background: radial-gradient(200px circle at var(--mx,50%) var(--my,50%),rgba(var(--accent-rgb),.12),var(--transparent) 70%); opacity: 0; transition: opacity .2s; }
.scene-card:hover::before { opacity: 1; }
.scene-stage-footer { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 16px; color: var(--text-tertiary); font-size: 13px; }
.stage-hint { margin-left: auto; color: var(--text-secondary); }
.scene-arrows { display: flex; gap: 8px; margin-left: 12px; }
.scene-arrow { width: 44px; height: 44px; display: grid; place-items: center; border: 1px solid var(--border); border-radius: 50%; background: var(--surface); color: var(--text-secondary); cursor: pointer; transition: background .2s,border-color .2s,color .2s,transform .2s; }
.scene-arrow[data-scene-step='-1'] .icon { transform: rotate(180deg); }
.scene-arrow:hover { background: var(--surface-hover); border-color: var(--accent); color: var(--accent); }
.scene-arrow:active { transform: scale(.94); }
.scene-arrow:disabled { opacity: .45; cursor: default; }
.stage-sound { display: flex; align-items: center; gap: 3px; height: 22px; color: var(--accent); }
.stage-sound i { width: 2px; height: 8px; background: currentColor; }
.stage-sound i:nth-child(2),.stage-sound i:nth-child(4) { height: 15px; }
.stage-sound i:nth-child(3) { height: 22px; }
.features { border-top: 1px solid rgba(var(--border-rgb),.4); padding-top: 80px; }
```

### 听歌模式与唱片视觉

默认 / 熟悉 / 新鲜切换同步标题、说明、模式标签、封套照片、唱片标签色、心形色和封套角度。反馈区 role=status；唱片只在第三屏可见且页面在前台时旋转。

唯一 data-play-song 按钮 .vinyl-play 为112px圆形，居中固定于 .vinyl-wrap，与旋转的 .vinyl 是兄弟层，因此按钮文字和图标不随唱片旋转。它保留清晰的 hover、active、focus 与 disabled 状态，背景跟随模式色。歌曲名与 Kate Bush · 官方 MV 信息放在舞台右上方 .record-info；左侧只有模式选择与反馈，不再放独立歌曲条。

.mode-stage 保留在无障碍树中；轨道、旋转唱片、封套、收藏气泡等装饰子层各自 aria-hidden=true，不能把整个舞台隐藏而导致播放按钮不可访问。

```css
.mode-layout { display: grid; grid-template-columns: 5fr 7fr; gap: 48px; align-items: center; }
.mode-copy { min-width: 0; }
.section-eyebrow { display: block; color: var(--accent); font-size: 14px; margin-bottom: 12px; }
.mode-copy h2 { font-size: clamp(40px,4.4vw,64px); line-height: 1.7; }
.mode-intro { margin-top: 24px; font-size: 16px; }
.mode-options { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 32px; padding: 4px; border: 1px solid var(--border); border-radius: 14px; background: var(--surface); width: fit-content; }
.mode-button { min-width: 44px; min-height: 44px; border: 0; padding: 8px 14px; background: var(--transparent); color: var(--text-secondary); border-radius: 10px; font-size: 15px; cursor: pointer; transition: background .25s,color .25s,transform .25s; }
.mode-button:hover { background: var(--surface-hover); color: var(--text); }
.mode-button[aria-pressed='true'] { background: var(--accent); color: var(--ink); }
.mode-button:active { transform: scale(.96); }
.mode-button:focus-visible { outline: 2px solid var(--accent); outline-offset: 5px; }
.mode-button:disabled { opacity: .45; cursor: default; }
.mode-feedback { min-height: 94px; margin-top: 24px; max-width: 30ch; }
.mode-feedback h3 { font-size: 22px; margin-bottom: 6px; }
.mode-feedback p { font-size: 15px; }
.mode-feedback.is-changing { animation: label-in .4s var(--ease); }
```

```css
.mode-stage { perspective: 1000px; position: relative; height: 520px; min-width: 0; --mode-accent: var(--accent); }
.mode-stage[data-mode='familiar'] { --mode-accent: var(--mode-warm); }
.mode-stage[data-mode='fresh'] { --mode-accent: var(--mode-cool); }
.mode-orbit { position: absolute; border: 1px solid rgba(var(--text-rgb),.12); border-radius: 50%; pointer-events: none; }
.orbit-one { width: 90%; height: 90%; top: 5%; left: 5%; transform: rotate(-25deg) scaleY(.8); }
.orbit-two { width: 86%; height: 84%; top: 8%; left: 7%; transform: rotate(20deg) scaleY(.65); border-style: dashed; }
.vinyl-wrap { transform: translate3d(calc(var(--pointer-x,0) * 14px),calc(var(--pointer-y,0) * 10px),0); position: absolute; width: 340px; height: 340px; top: 74px; left: 39%; transition: translate .8s var(--ease),transform .4s ease-out; }
.vinyl { position: absolute; inset: 0; border-radius: 50%; border: 1px solid var(--border); background: repeating-radial-gradient(circle,var(--ink) 0 3px,var(--surface-alt) 4px 5px,var(--ink) 6px 8px); display: grid; place-items: center; animation: vinyl-spin 24s linear infinite; animation-play-state: paused; box-shadow: var(--shadow-product); }
.mode-stage.in-view .vinyl { animation-play-state: running; }
.mode-stage.in-view .favorite-bubble { animation: bubble-float 6s ease-in-out infinite; }
.vinyl-label { width: 112px; height: 112px; border-radius: 50%; background: var(--mode-accent); color: var(--ink); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; transition: background .7s; }
.vinyl-label span { font-size: 12px; font-weight: 600; }
.vinyl-label .icon { width: 36px; height: 36px; }
.vinyl-etch { position: absolute; top: 26px; left: 50%; translate: -50% 0; color: var(--text-tertiary); font: 500 10px/1.7 var(--font-latin); letter-spacing: .12em; white-space: nowrap; }
.vinyl-play { position: absolute; z-index: 3; left: calc(50% - 56px); top: calc(50% - 56px); width: 112px; height: 112px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; padding: 0; border: 1px solid rgba(var(--ink-rgb),.15); border-radius: 50%; background: var(--mode-accent); color: var(--ink); cursor: pointer; transition: background .3s,transform .25s,border-color .25s; }
.vinyl-play .icon { width: 30px; height: 30px; margin-left: 4px; fill: currentColor; stroke: none; }
.vinyl-play span { font-size: 12px; font-weight: 700; line-height: 1.7; }
.vinyl-play:hover { background: var(--accent-hover); transform: scale(1.07); border-color: var(--accent-hover); }
.vinyl-play:active { background: var(--accent-active); transform: scale(.97); }
.vinyl-play:focus-visible { outline: 3px solid var(--text); outline-offset: 7px; }
.vinyl-play:disabled,.vinyl-play[aria-disabled='true'] { opacity: .45; cursor: default; transform: none; }
.album-sleeve { position: absolute; top: 80px; left: 6%; width: 300px; height: 348px; border-radius: 16px; overflow: hidden; border: 1px solid rgba(var(--text-rgb),.25); transform: rotate(-9deg) rotateY(calc(var(--pointer-x,0) * 7deg)) rotateX(calc(var(--pointer-y,0) * -5deg)); box-shadow: var(--shadow-product); background: var(--surface-alt); transition: transform .8s var(--ease),border-radius .8s; }
.album-photo { position: absolute; inset: 0; }
.album-photo img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; opacity: 0; transform: scale(1.1); transition: opacity .8s,transform 1.2s var(--ease); }
.mode-stage[data-mode='default'] .cover-default,.mode-stage[data-mode='familiar'] .cover-familiar,.mode-stage[data-mode='fresh'] .cover-fresh { opacity: 1; transform: scale(1); }
.album-photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(rgba(var(--ink-rgb),.18),rgba(var(--ink-rgb),.65)); }
.album-brand { position: absolute; top: 20px; left: 24px; font-size: 12px; }
.album-title { position: absolute; top: 65px; left: 24px; font-size: 50px; font-weight: 800; line-height: 1.35; color: var(--mode-accent); transition: color .7s; }
.album-mode { position: absolute; left: 24px; bottom: 24px; font-size: 14px; }
.album-wave { position: absolute; right: 20px; bottom: 22px; }
.album-wave .icon { width: 32px; height: 32px; }
.mode-stage[data-mode='familiar'] .album-sleeve { transform: rotate(-4deg) translateX(10px) rotateY(calc(var(--pointer-x,0) * 7deg)) rotateX(calc(var(--pointer-y,0) * -5deg)); border-radius: 30px; }
.mode-stage[data-mode='fresh'] .album-sleeve { transform: rotate(-13deg) translateY(-10px) rotateY(calc(var(--pointer-x,0) * 7deg)) rotateX(calc(var(--pointer-y,0) * -5deg)); }
.mode-stage[data-mode='fresh'] .vinyl-wrap { translate: 12px 0; }
.favorite-bubble { translate: calc(var(--pointer-x,0) * -16px) calc(var(--pointer-y,0) * -12px); transition: translate .4s ease-out; position: absolute; right: 8%; bottom: 65px; display: flex; align-items: center; gap: 12px; padding: 16px 20px; border: 1px solid var(--border); border-radius: 999px; background: var(--surface); box-shadow: var(--shadow-card); transform: rotate(6deg); color: var(--text); }
.favorite-bubble .icon { width: 26px; height: 26px; fill: var(--mode-accent); stroke: var(--mode-accent); transition: fill .7s,stroke .7s; }
.favorite-bubble span { font-size: 15px; }
.record-info { position: absolute; right: 5%; top: 18px; display: flex; flex-direction: column; gap: 4px; text-align: right; }
.record-info strong { font: 600 17px/1.7 var(--font-latin); letter-spacing: 0; color: var(--text); }
.record-info span { font-size: 13px; color: var(--text-tertiary); }
```

### 歌曲入口与官方 MV 弹窗

唱片中心112px播放按钮打开原生 dialog；弹窗宽度不超过860px，完整可见16:9视频。打开后动态插入 YouTube iframe，并请求 autoplay；用户可使用播放器原生控制。播放按钮使用 aria-haspopup=dialog、aria-controls=song-dialog；aria-expanded 在打开时为true、关闭时恢复false。

原生模态框管理焦点与 Esc 关闭；关闭按钮或点击框外也能关闭。关闭后移除 iframe 以停止播放，恢复页面滚动并把焦点还给唱片中心播放按钮。播放器状态区使用 role=status；12秒未加载时显示官方频道备用链接提示。默认页面不插入或预加载视频 iframe。

```css
.player-open { overflow: hidden; }
.song-dialog { width: min(860px,calc(100vw - 80px)); max-height: calc(100vh - 80px); padding: 24px; border: 1px solid var(--border); border-radius: 20px; background: var(--bg); color: var(--text); box-shadow: var(--shadow-product); }
.song-dialog::backdrop { background: rgba(var(--bg-rgb),.88); }
.player-header { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; margin-bottom: 20px; }
.player-eyebrow { font: 500 12px/1.75 var(--font-latin); color: var(--accent); letter-spacing: .1em; }
.player-header h3 { font: 700 28px/1.7 var(--font-latin); letter-spacing: 0; }
.player-header p { font-size: 14px; }
.player-close { display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 1px solid var(--border); border-radius: 50%; background: var(--surface); color: var(--text); cursor: pointer; transition: background .2s,transform .2s; }
.player-close:hover { background: var(--surface-hover); }
.player-close:active { transform: scale(.95); }
.player-close:disabled { opacity: .45; cursor: default; }
.player-frame { aspect-ratio: 16/9; background: var(--surface); border-radius: 8px; overflow: hidden; }
.player-frame iframe { display: block; width: 100%; height: 100%; border: 0; }
.player-footer { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-top: 12px; color: var(--text-tertiary); font-size: 13px; }
.player-footer .text-link { gap: 8px; }
.player-footer .icon { width: 18px; height: 18px; }
```

### 黑底下载收尾、品牌物体与绿色票券

主标题「把音乐，带进生活」的第二行为品牌绿，右侧立体物体展示官方品牌图标。底部左侧三张错落生活摄影；右侧绿色票券承担唯一官方下载行动。票券缺口、虚线和小箭头强化“现在出发”的动作感；hover摆正并上浮4px，active轻压，focus清晰描边。生活摄影和品牌物体为非交互装饰，不伪装成额外链接。

```css
.download { background: var(--bg); color: var(--text); display: flex; padding: 82px 0 0; overflow: hidden; border-top: 1px solid var(--border); }
.download-content { display: flex; flex-direction: column; min-height: calc(100svh - 83px); }
.download-ghost { position: absolute; z-index: 1; left: 50%; bottom: 82px; translate: -50% 0; color: var(--transparent); -webkit-text-stroke: 1px rgba(var(--accent-rgb),.12); font: 700 clamp(220px,30vw,470px)/1 var(--font-latin); letter-spacing: -.06em; white-space: nowrap; pointer-events: none; }
.download-topline { display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid rgba(var(--border-rgb),.7); padding: 5px 0 16px; color: var(--text-tertiary); font-size: 13px; font-weight: 500; }
.download-topline > span:first-child { display: inline-flex; align-items: center; gap: 12px; color: var(--text-secondary); }
.download-topline > span:first-child::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
.download-topline > span:last-child { font: 500 12px/1.5 var(--font-latin); letter-spacing: .08em; }
.download-main { display: grid; grid-template-columns: 1.18fr 1fr; gap: 40px; align-items: center; min-height: 330px; margin-top: 20px; }
.download-copy { min-width: 0; }
.download-main h2 { font-size: clamp(72px,6.4vw,96px); font-weight: 900; line-height: 1.7; letter-spacing: .02em; }
.download-main h2 > span { color: var(--accent); }
.download-copy p { margin-top: 22px; color: var(--text-secondary); font-size: 16px; line-height: 1.75; }
.download-art { position: relative; min-width: 0; height: 330px; perspective: 900px; background: radial-gradient(ellipse at 50% 46%,rgba(var(--brand-green-rgb),.08),var(--transparent) 62%); }
.brand-orbit { position: absolute; left: 50%; top: 49%; width: min(94%,480px); height: 180px; border: 1px solid rgba(var(--accent-rgb),.38); border-radius: 50%; pointer-events: none; }
.orbit-back { z-index: 0; transform: translate(-50%,-50%) rotate(-29deg); border-color: rgba(var(--border-hover-rgb),.26); }
.orbit-front { z-index: 3; height: 158px; transform: translate(-50%,-50%) rotate(24deg); border-color: rgba(var(--accent-rgb),.48); clip-path: polygon(0 46%,100% 46%,100% 100%,0 100%); }
.brand-object { position: absolute; z-index: 2; left: calc(50% - 124px); top: 36px; width: 248px; height: 260px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid rgba(var(--text-rgb),.2); border-radius: 42px; background: linear-gradient(150deg,var(--surface-hover),var(--surface) 42%,var(--bg) 100%); box-shadow: 14px 16px 0 var(--surface-alt),15px 17px 0 rgba(var(--text-rgb),.2),0 30px 60px rgba(var(--ink-rgb),.65); transform: rotate(-9deg) rotateY(-10deg); translate: calc(var(--pointer-x,0) * 10px) calc(var(--pointer-y,0) * 7px); transition: translate .4s ease-out; }
.brand-object::before { content: ''; position: absolute; inset: 9px; border: 1px solid rgba(var(--text-rgb),.06); border-radius: 34px; pointer-events: none; }
.object-icon { display: block; width: 112px; height: 112px; margin-bottom: 12px; overflow: hidden; border-radius: 28px; background: var(--ink); box-shadow: 0 9px 20px rgba(var(--ink-rgb),.45); }
.object-icon img { width: 100%; height: 100%; display: block; object-fit: contain; }
.brand-object strong { font-size: 21px; font-weight: 800; }
.brand-object > span:last-child { margin-top: 4px; color: var(--text-tertiary); font-size: 12px; }
.object-note { position: absolute; left: 50%; bottom: 0; translate: -50% 0; color: var(--text-tertiary); font-size: 12px; white-space: nowrap; }
.object-note::before { content: ''; display: inline-block; width: 23px; height: 1px; margin-right: 10px; vertical-align: middle; background: var(--accent); }
.object-spark { position: absolute; z-index: 4; width: 10px; height: 10px; color: var(--accent); }
.object-spark::before,.object-spark::after { content: ''; position: absolute; background: currentColor; }
.object-spark::before { width: 100%; height: 1px; top: 50%; }
.object-spark::after { height: 100%; width: 1px; left: 50%; }
.spark-one { top: 43px; right: 19%; transform: rotate(12deg); }
.spark-two { bottom: 57px; left: 13%; width: 7px; height: 7px; opacity: .65; }
.download-art.in-view .brand-object { animation: download-object-float 7s ease-in-out infinite; }
.page-hidden .download-art .brand-object { animation-play-state: paused; }
.download-bottom { display: grid; grid-template-columns: 1.28fr 1fr; gap: 40px; align-items: center; min-height: 204px; margin: 20px 0 26px; }
.life-strip { height: 204px; display: flex; align-items: center; gap: 14px; padding-left: 10px; min-width: 0; }
.life-photo { position: relative; flex: 0 0 auto; overflow: hidden; border-radius: 10px; border: 1px solid rgba(var(--text-rgb),.24); box-shadow: var(--shadow-card); background: var(--surface); }
.life-photo::after { content: ''; position: absolute; inset: 25% 0 0; background: linear-gradient(var(--transparent),rgba(var(--ink-rgb),.74)); pointer-events: none; }
.life-photo img { width: 100%; height: 100%; display: block; object-fit: cover; }
.life-photo figcaption { position: absolute; z-index: 1; left: 13px; right: 8px; bottom: 11px; color: var(--text); font-size: 12px; font-weight: 500; white-space: nowrap; }
.life-night { width: 27%; max-width: 182px; height: 143px; transform: rotate(-6deg) translateY(12px); }
.life-travel { width: 35%; max-width: 238px; height: 181px; transform: rotate(3deg); }
.life-travel img { object-position: 50% 43%; }
.life-sea { width: 26%; max-width: 180px; height: 140px; transform: rotate(-4deg) translateY(16px); }
.download-pass { position: relative; display: flex; flex-direction: column; justify-content: space-between; justify-self: end; width: min(100%,430px); min-height: 204px; padding: 18px 26px 16px; border: 1px solid var(--accent); border-radius: 12px; background: var(--accent); color: var(--ink); transform: rotate(-3deg); box-shadow: 7px 11px 0 rgba(var(--accent-rgb),.14),0 22px 40px rgba(var(--ink-rgb),.5); transition: transform .35s var(--ease),background .2s,border-color .2s,box-shadow .35s; }
.download-pass::before,.download-pass::after { content: ''; position: absolute; top: 67%; width: 18px; height: 18px; border-radius: 50%; background: var(--bg); }
.download-pass::before { left: -10px; }
.download-pass::after { right: -10px; }
.pass-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 12px; font-weight: 700; }
.pass-top .icon { width: 23px; height: 23px; }
.pass-title { display: block; margin: 5px 0 8px; font-size: 25px; line-height: 1.7; font-weight: 900; letter-spacing: .02em; }
.pass-action { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 44px; border-top: 1px dashed rgba(var(--ink-rgb),.45); padding-top: 10px; font-size: 15px; font-weight: 800; }
.pass-action > .icon { width: 32px; height: 32px; padding: 7px; border-radius: 50%; background: var(--ink); color: var(--accent); }
.download-pass:hover { transform: rotate(0) translateY(-4px); border-color: var(--accent-hover); background: var(--accent-hover); box-shadow: 7px 14px 0 rgba(var(--accent-rgb),.2),0 22px 40px rgba(var(--ink-rgb),.5); }
.download-pass:active { transform: rotate(0) scale(.98); background: var(--accent-active); border-color: var(--accent-active); }
.download-pass:focus-visible { outline: 2px solid var(--text); outline-offset: 7px; transform: rotate(0); }
.download-pass[aria-disabled='true'] { opacity: .45; cursor: default; transform: rotate(-3deg); }
.footer { border-top: 1px solid rgba(var(--border-rgb),.8); display: flex; justify-content: space-between; align-items: center; gap: 24px; margin-top: auto; padding: 12px 0; font-size: 13px; }
.footer-brand { display: flex; align-items: center; gap: 10px; color: var(--text); font-size: 15px; font-weight: 700; }
.footer-brand .brand-icon { width: 26px; height: 26px; border-radius: 7px; }
.footer-easter { display: flex; align-items: center; gap: 10px; color: var(--text-tertiary); font-size: 12px; }
.surprise-button { min-width: 44px; min-height: 44px; padding: 10px; display: grid; place-items: center; border: 1px solid var(--border); background: var(--transparent); color: var(--accent); border-radius: 50%; cursor: pointer; transition: background .2s,color .2s,transform .2s; }
.surprise-button:hover { background: var(--accent); color: var(--ink); }
.surprise-button:active { transform: scale(.95); }
.surprise-button:focus-visible { outline-color: var(--accent); }
.surprise-button:disabled { opacity: .45; cursor: default; }
.download .text-link { color: var(--text-secondary); gap: 12px; font-size: 12px; }
.download .text-link:hover { color: var(--accent); text-decoration-color: currentColor; }
.download .text-link:active { color: var(--accent-active); }
.download .text-link:focus-visible { outline-color: var(--accent); }
.download .text-link[aria-disabled='true'] { opacity: .45; }
.back-top .icon { width: 18px; height: 18px; }
```

## 5. Layout Principles

参考画布1440×900，页面最小宽1024px，不设计手机布局。最大内容容器1600px、安全边距约40px、基准gap24px；间距梯度8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px。四个主section默认 min-height:100svh，内容允许自然增长。

第一屏底部按2:4:6分配滚动提示、说明、CTA；第二屏文案与圆环5:7，画廊高度520px，透视1800px；第三屏模式文案与唱片5:7，顶部80px，下方三条简短功能说明；第四屏顶部82px，主区1.18:1、底部摄影与下载票券1.28:1，footer在底部自然收尾。

全局背景fixed、pointer-events:none、z-index:2，章节内容z-index:3、导航50。视口外的背景框架在固定层内裁切，移动与旋转作用在内部框架上，不通过body横向裁切掩盖布局错误。第四屏只对自己的装饰背景作局部裁切。弹窗进入浏览器top layer，不受章节堆叠限制。

## 6. Depth & Elevation

--shadow-card用于摄影和收藏气泡，--shadow-product用于封套与视频弹窗，--shadow-accent为可用选中轮廓。圆环透视1800px、模式舞台1000px、第四屏品牌物体舞台900px。品牌物体以多层偏移阴影模拟厚度；下载票券以偏移绿影表达纸张抬起。深度主要来自透视、遮挡、图像退让、实体边框和少量阴影，正文保持平面阅读。不对运动层添加blur，不铺满玻璃卡片。

## 7. Animation & Interaction

CSS + 原生JavaScript；页面、背景与模式交互由 script.js 管理，连续圆环由 scenes.js 管理，官方MV由 player.js 管理，开场汽水瓶由 splash.js 通过 CDN 上的 Three.js 播放。除此之外无动画运行库，也无构建步骤。全局声场不再使用 difference 混合，避免荧光曲线压过「汽水音乐」标题；指针跟随和滚动视差幅度已减弱。开场期间声场与导航让位给瓶子。

| L2动效类别 | 最终实现 | 参数 |
|---|---|---|
| Hero H1 | 遮罩入场 | .8s一次；副标题延迟.12s |
| Section H2 | 滚动浮入 | 28px / .64s，IO阈值.18 |
| Body / label | reveal与模式状态轻反馈 | .56s / .4s |
| 元素 | CTA微磁吸、摄影hover、票券反馈 | 磁吸最多6px；卡片1→1.07；票券上浮4px |
| 交互构件 | 连续八卡3D圆环、三模式切换、原生播放dialog | 环每格45°；模式.7～1.2s |
| 背景 | 固定SVG曲线、光带、颗粒 | 18s呼吸；滚动上下±40px、转角0～12° |

### 圆环连续输入与吸附

- .scene-carousel 读取连续数值 --carousel-position，最终 rotateY = position × −45°，不靠离散CSS transition追手势。
- 仅在场景画廊内部处理上下或左右wheel，先按deltaMode换算像素，再取绝对值较大的主轴delta；相等时使用X轴，不叠加X/Y。主轴幅度>0.5px时阻止该次画廊默认滚动并转动圆环；Ctrl+wheel保留浏览器行为，画廊之外正常滚动页面。
- 上下与左右输入均200px为一格；事件按rAF合并，停手140ms后吸附到最近整数位置。
- 仅接受左键或单一primary pointer；任一轴位移达到8px才开始拖动，并锁定绝对位移较大的X或Y主轴，整次拖动不切轴、不叠加。使用pointer capture，主轴拖动200px为一格。画廊touch-action:none并阻止原生图片拖放。松手、取消或捕获丢失时吸附；拖动后的合成点击被抑制，避免误选照片。
- 场景标签、照片点击走最短环绕路径；左右按钮每次一格并环绕，左右键同样操作；Home/End选择第一/最后场景，焦点留在新选卡片，防止自动滚动。
- 吸附采用cubic ease-out，持续时间 min(520ms,260ms + 格数距离 × 70ms)。减少动态或切后台时直接落到目标位置。
- 圆环在滚动中轻倾斜±6°，指针仅微调X轴最多±2°；hover不改变选择，不把卡片自动移动到指针脚下。

### 模式、背景、收尾与媒体

模式舞台指针旋转封套最多±7/5°；唱片容器位移±14/10px，收藏气泡反向±16/12px；唱片24s旋转、中心播放按钮方向固定，气泡6s轻浮动。全局背景指针位移最多±20/14px，持续18s呼吸。第四屏品牌物体在可见时7s漂浮，指针位移±10/7px；收尾声波彩蛋仅点击后短暂放大并显示「好，按你的节奏来。」

所有持续装饰离开所属视口或切后台暂停；pointermove与scroll用rAF节流。背景与悬浮效果尊重prefers-reduced-motion。歌曲MV仅用户点击后启动嵌入播放；视频控制交由可见YouTube原生界面，关闭dialog即移除iframe，不把装饰唱片转动当作真实播放状态。

### 背景与入场CSS

```css
.site-atmosphere { --ambient-x: 0px; --ambient-y: 0px; position: fixed; inset: 0; z-index: 2; overflow: clip; pointer-events: none; mix-blend-mode: difference; }
.ambient-frame { position: absolute; inset: -10%; translate: 0 var(--field-y,0px); rotate: var(--field-turn,0deg); transition: rotate .8s linear; }
.ambient-halo { position: absolute; inset: -20%; background: radial-gradient(ellipse at 75% 65%,rgba(var(--brand-green-rgb),.1),var(--transparent) 58%); }
.ambient-drift { translate: var(--ambient-x,0px) var(--ambient-y,0px); position: absolute; inset: -12%; animation: field-drift 18s ease-in-out infinite; animation-play-state: paused; }
.site-atmosphere.in-view .ambient-drift { animation-play-state: running; }
.ambient-lines { width: 100%; height: 100%; max-width: none; }
.flow-lines { stroke: var(--accent); stroke-width: 1; opacity: .24; }
.ambient-particles { fill: var(--accent); opacity: .35; }
```

```css
.motion-ready .hero-title .line-mask > span { animation: title-in .8s var(--ease) both; }
.motion-ready .hero-subtitle .line-mask > span { animation: title-in .8s .12s var(--ease) both; }
.motion-ready .reveal { opacity: 0; translate: 0 28px; transition: opacity .64s var(--ease),translate .64s var(--ease); }
.motion-ready .reveal.in-view { opacity: 1; translate: 0 0; }
.motion-ready .reveal-body { transition-duration: .56s; }
.motion-ready .reveal-scale { opacity: 0; scale: .96; transition: opacity .7s var(--ease),scale .7s var(--ease); }
.motion-ready .reveal-scale.in-view { opacity: 1; scale: 1; }
.scene-status.is-changing { animation: label-in .35s var(--ease); }
.is-pulsing .surprise-wave { animation: small-pulse .7s ease-out both; }
.page-hidden .ambient-drift,.page-hidden .vinyl,.page-hidden .favorite-bubble,.page-hidden .marquee-track { animation-play-state: paused !important; }
@keyframes title-in { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes field-drift { 0%,100% { transform: translate(-2%,3%) scale(1.02) rotate(-3deg); } 50% { transform: translate(2%,-3%) scale(1.08) rotate(3deg); } }
@keyframes bubble-float { 0%,100% { transform: rotate(6deg) translateY(0); } 50% { transform: rotate(3deg) translateY(-8px); } }
@keyframes vinyl-spin { to { transform: rotate(360deg); } }
@keyframes ribbon-pass { to { transform: translateX(-50%); } }
@keyframes small-pulse { 50% { transform: scale(1.18); } }
@keyframes label-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
```

```css
@keyframes download-object-float { 0%,100% { transform: rotate(-9deg) rotateY(-10deg) translateY(0); } 50% { transform: rotate(-6deg) rotateY(-6deg) translateY(-9px); } }
```

无脚本时正文、场景摄影、默认模式和官方下载链接保持存在。播放按钮和手势控制需要JavaScript，不能声称无脚本播放。减少动态设置停止持续装饰、过渡和视差，场景与模式选择保留；媒体弹窗仍由用户主动打开，视频本身遵循其原生控制。

## 8. Do's and Don'ts

### Do

- 四屏各自只传达一个清楚重点，电脑端维持大胆排版和摄影层次。
- 连续背景将品牌、场景、模式和下载区连接起来。
- 八场景以真实摄影呈现，通勤使用明确的地铁旅程。
- 圆环输入跟手，停手吸附，最短环绕；键盘和按钮可完成同一选择。
- 第三屏用模式视觉与唱片中心的唯一官方MV播放入口表达产品能力。
- 视频完整可见、原生控制可用、关闭移除iframe并恢复唱片中心按钮焦点与aria-expanded状态。
- 官方下载统一接到核实的官方页面，票券文案明确可点击。
- 中文正文15～17px、行高1.75；标题字体与焦点状态保持清晰。
- 屏外与后台暂停持续装饰，尊重减少动态设置。

### Don't

- 不保留旧设计草案、第三屏截图布局或屏底页数提醒。
- 不新增二级页面、定价、账户、博客或语言切换。
- 不复制参考站照片、紫色环境或全局圆点光标。
- 不让hover自动选择并旋转到另一场景。
- 不把宣传摄影与装饰封套称为真实歌曲封面。
- 不下载或重新上传官方MV、歌曲，不隐藏第三方播放器控制。
- 不在用户点击前载入视频iframe或播放声音。
- 不将装饰唱片转动、声波或收藏气泡当作真实播放器状态。
- 不使用会员价格、用户量、评价或曲库量等未核实承诺。
- 不对运动元素加blur，不覆盖大面积backdrop-filter。
- 不在场景画廊外截获wheel或拖动，不增加长pin，不用body裁切掩盖横向布局错误。
- 不把非交互生活摄影与品牌物体伪装成额外操作入口。

## 9. Responsive Behavior

用户明确只做电脑端。基准1440×900，页面最小宽1024px；规格覆盖1024 / 1280 / 1440 / 1920px窗口，未声明手机适配。≤1200px缩小圆环、唱片和封套，保持两栏；圆环半径240px、卡宽140px、高228px、舞台500px。

第四屏在1024～1200px宽度使用H2 clamp(64px,6.4vw,76px)，缩小品牌物体与下载票券；在高度≤800px的电脑窗口，顶部76px、主区278px，H2 clamp(62px,5.5vw,76px)，票券标题23px，摄影和footer压缩间距。所有阅读文案和官方下载保持完整。

原生dialog宽min(860px,100vw−80px)、最大高100vh−80px、视频16:9；播放器始终可见，不将官方视频变成隐藏音轨。

以下为当前桌面缩放与减少动态规则，不代表已完成所有尺寸实测；实际验收另记。

```css
@media (min-width: 1024px) and (max-width: 1200px) {
  .download-main,.download-bottom { gap: 24px; }
  .download-main h2 { font-size: clamp(64px,6.4vw,76px); }
  .brand-object { left: calc(50% - 112px); width: 224px; height: 244px; top: 44px; border-radius: 36px; }
  .object-icon { width: 100px; height: 100px; }
  .brand-orbit { width: 94%; height: 170px; }
  .orbit-front { height: 142px; }
  .life-strip { gap: 11px; padding-left: 6px; }
  .life-night { height: 134px; }
  .life-travel { height: 171px; }
  .life-sea { height: 130px; }
  .download-pass { width: min(100%,374px); }
}
@media (min-width: 1024px) and (max-height: 800px) {
  .download { padding-top: 76px; }
  .download-content { min-height: calc(100svh - 77px); }
  .download-topline { padding-bottom: 12px; }
  .download-main { min-height: 278px; margin-top: 14px; }
  .download-main h2 { font-size: clamp(62px,5.5vw,76px); }
  .download-copy p { margin-top: 15px; font-size: 15px; }
  .download-art { height: 278px; }
  .brand-object { top: 14px; left: calc(50% - 109px); width: 218px; height: 229px; border-radius: 36px; }
  .object-icon { width: 98px; height: 98px; margin-bottom: 8px; }
  .brand-object strong { font-size: 19px; }
  .brand-object > span:last-child { font-size: 11px; }
  .brand-orbit { height: 150px; }
  .orbit-front { height: 130px; }
  .spark-one { top: 20px; }
  .spark-two { bottom: 35px; }
  .download-bottom { min-height: 184px; margin: 14px 0 20px; }
  .life-strip { height: 184px; }
  .life-night { height: 123px; }
  .life-travel { height: 156px; }
  .life-sea { height: 121px; }
  .download-pass { min-height: 184px; padding: 13px 24px; }
  .pass-title { font-size: 23px; margin: 3px 0 4px; }
  .pass-action { padding-top: 7px; }
  .footer { padding: 10px 0; }
}
@media (prefers-reduced-motion: reduce) {
  .download-art .brand-object { animation: none; translate: none; transform: rotate(-9deg); }
  .download-pass:hover,.download-pass:active,.download-pass:focus-visible { transform: rotate(-3deg); }
}
```

```css
@media (max-width: 1200px) {
  .discover-content { grid-template-columns: 5fr 7fr; gap: 24px; }
  .discover-copy h2 { font-size: 40px; }
  .scene-gallery { --ring-radius: 240px; --card-width: 140px; --card-height: 228px; height: 500px; }
  .scene-position { top: 125px; }
  .mode-layout { gap: 24px; }
  .mode-stage { height: 460px; }
  .vinyl-wrap { width: 280px; height: 280px; left: 36%; }
  .album-sleeve { width: 250px; height: 300px; left: 2%; }
  .album-title { font-size: 42px; }
  .favorite-bubble { right: 0; bottom: 35px; }
  .feature-row { gap: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *,*::before,*::after { animation: none !important; transition: none !important; }
  .motion-ready .reveal,.motion-ready .reveal-scale,.motion-ready .hero-title .line-mask > span,.motion-ready .hero-subtitle .line-mask > span { opacity: 1; translate: none; scale: 1; transform: none; }
  .parallax-layer,.magnet-inner,.ambient-frame { translate: none !important; rotate: none !important; }
  .marquee-track { transform: none; }
  .ambient-drift { transform: none; }
  .scene-card:hover { transform: scale(1); }
}
```

四个签名时刻为巨型品牌字与全局声场 → 跟手八卡圆环 → 模式唱片与可见官方MV → 黑底品牌物体与绿色下载票券。规范以当前页面为准；测试记录独立维护，不在此虚构验证结果。
