# 汽水音乐 · Web 设计规范

状态：沿用用户已确认的 L2 方案，按本轮明确修改要求更新；仅做电脑端，增强动效。日期：2026-10-11。只保留当前设计；单页四屏，无二级页面。

## 1. Visual Theme & Atmosphere

Dark Editorial / Music Poster。黑底、荧光绿、巨型中文品牌字、轻导航与自然滚动。全页是一张连续呼吸的音乐海报。

| 区域 | 主信息 | 核心构图 |
|---|---|---|
| 第一屏 | 汽水音乐，让喜欢响起来 | 巨型品牌字、非对称文案、底部官方下载 |
| 第二屏 | 每一刻，都有你的节奏 | 八场景标签 + 倾斜三维摄影圆环 |
| 第三屏 | 喜欢，不止一种方式 | 三种听歌模式 + 原生唱片/唱片封套/收藏气泡 |
| 第四屏 | 下一首喜欢，从这里开始 | 绿底大字、官方下载、页脚与声波彩蛋 |

删除所有屏底页数标记。连续背景跨越四屏，绿底结束区仍能看到对应的深色曲线。第三屏不再使用产品截图，素材截图只为真实产品功能与场景名称提供依据。

用户新截图确认默认、熟悉、新鲜及多种听歌模式；从中选取通勤路上、夜晚独处、动感健身、专注模式、Chill 放松、旅行、海边、驾车八种适合摄影表达的场景。不沿用截图会员价格，不虚构歌单、播放、推荐算法或统计数据。

参考 Lenis 的字体比例、留白、宣言带与强烈结束；新交互参考 pmndrs Cards With Border Radius。真实审计见 reference-card-audit.md。

## 2. Color Palette & Roles

所有颜色集中于变量；熟悉模式用暖杏色，新鲜模式用浅蓝色，只作为唱片视觉反馈，主体始终保持品牌绿。

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

## 3. Typography Rules

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap');
body { font: 400 17px/1.75 var(--font-body); letter-spacing: .02em; }
h1,h2,h3 { font-family: var(--font-display); line-height: 1.7; letter-spacing: .02em; }
```

| 角色 | 电脑端字号 | 字重 |
|---|---|---|
| Hero H1 | clamp(104px,17.4vw,252px) | 900 |
| 章节 H2 | 40～72px | 800 |
| 结束 H2 | 48～96px | 900 |
| H3 | 功能19px / 模式反馈22px / 通用26px | 700 |
| 正文 | 15～17px | 400 |
| 标签 | 15px | 500 |

文字装饰：H1/H2/H3纯色，无渐变、投影或乱码。宣言带一部分描边文字属于海报装饰；唱片封套文字采用较紧行距，属于装饰图形而非阅读正文。禁止只使用西文字体、Emoji 图标和满屏光晕文字。

## 4. Component Stylings

所有交互保留 default/hover/active/focus/disabled。SVG使用 currentColor。导航链接高度至少44px，当前区域有 aria-current；标签与模式按钮用 aria-pressed。

### 通用行动与链接

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

### 摄影圆环与悬停反馈

每张卡分离位置与悬停层：父层 45° 等分位置，子层独立放大和改变圆角；选择切换旋转整个环。摄影不是歌曲封面。

```css
.scene-gallery { position: relative; height: 460px; width: 100%; perspective: 1150px; perspective-origin: 50% 45%; --ring-radius: clamp(220px,calc(25vw - 80px),280px); --card-width: clamp(158px,calc(13.33vw - 2px),190px); --card-height: 284px; }
.scene-carousel { position: absolute; inset: 0; transform-style: preserve-3d; transform: rotateZ(calc(-7deg + var(--gallery-tilt,0deg))) rotateX(calc(-8deg + var(--pointer-y,0) * 4deg)) rotateY(calc(var(--active-scene,0) * -45deg + var(--pointer-x,0) * 5deg)); transition: transform .85s cubic-bezier(.22,.7,.24,1); }
.scene-position { position: absolute; left: calc(50% - var(--card-width) / 2); top: 80px; width: var(--card-width); height: var(--card-height); transform-style: preserve-3d; transform: rotateY(var(--card-angle)) translateZ(var(--ring-radius)); }
.scene-position::before { content: ""; position: absolute; inset: 0; border: 1px solid var(--border); border-radius: 16px; background: linear-gradient(rgba(var(--ink-rgb),.45),rgba(var(--ink-rgb),.75)),var(--card-image) center / cover; transform: rotateY(180deg); backface-visibility: hidden; }
.scene-card { display: block; position: relative; width: 100%; height: 100%; padding: 0; border: 1px solid rgba(var(--text-rgb),.2); border-radius: 16px; overflow: hidden; background: var(--surface); color: var(--text); cursor: pointer; text-align: left; backface-visibility: hidden; transform: scale(1); box-shadow: var(--shadow-card); transition: transform .5s var(--ease),border-radius .5s var(--ease),border-color .3s; }
.scene-card img { width: 100%; height: 100%; display: block; object-fit: cover; transform: scale(1.32); transition: transform .7s var(--ease),opacity .4s; }
.scene-card::after { content: ''; position: absolute; inset: 35% 0 0; background: linear-gradient(var(--transparent),rgba(var(--ink-rgb),.82)); pointer-events: none; }
.scene-card-caption { position: absolute; inset: auto 16px 20px; z-index: 3; display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 17px; font-weight: 700; }
.scene-card-caption .icon { width: 20px; height: 20px; color: var(--accent); }
.scene-card[data-scene="seaside"] img { object-position: 38% 50%; }
.scene-card[data-scene="relax"] img { object-position: 55% 48%; }
.scene-card.is-selected { transform: scale(1.08); border-color: var(--accent); }
.scene-card.is-selected img { transform: scale(1.12); }
.scene-card:hover { transform: scale(1.15); border-radius: 36px; border-color: var(--accent-hover); }
.scene-card:hover img { transform: scale(1); }
.scene-card:active { transform: scale(1.06); border-color: var(--accent-active); }
.scene-card:focus-visible { outline: 3px solid var(--accent); outline-offset: 6px; border-radius: 30px; }
.scene-card:disabled { opacity: .45; cursor: default; }
.scene-card::before { content: ''; position: absolute; inset: 0; z-index: 2; pointer-events: none; background: radial-gradient(200px circle at var(--mx,50%) var(--my,50%),rgba(var(--accent-rgb),.12),var(--transparent) 70%); opacity: 0; transition: opacity .2s; }
.scene-card:hover::before { opacity: 1; }
.scene-stage-footer { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 16px; color: var(--text-tertiary); font-size: 13px; }
.stage-hint { margin-left: auto; color: var(--text-secondary); }
.stage-sound { display: flex; align-items: center; gap: 3px; height: 22px; color: var(--accent); }
.stage-sound i { width: 2px; height: 8px; background: currentColor; }
.stage-sound i:nth-child(2),.stage-sound i:nth-child(4) { height: 15px; }
.stage-sound i:nth-child(3) { height: 22px; }
```

### 听歌模式选择

```css
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

第三屏原生唱片由 repeating-radial-gradient 绘制；封套使用真实场景摄影，切换模式时同步标题、说明、模式标签、照片、唱片标签色及封套角度。唱片和收藏气泡是宣传图形，没有播放按钮，不冒充真实听歌界面。

### 导航、场景标签和页脚反馈

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
.scene-options { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 30px; max-width: 470px; }
.tag { min-width: 44px; min-height: 44px; padding: 8px 16px; border-radius: 999px; border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); font: 500 15px/1.7 var(--font-body); letter-spacing: .02em; cursor: pointer; transition: color .2s,background .2s,border-color .2s; }
.tag:hover { color: var(--text); background: var(--surface-hover); border-color: var(--border-hover); }
.tag:active { border-color: var(--accent-active); }
.tag:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
.tag[aria-pressed='true'] { color: var(--ink); background: var(--accent); border-color: var(--accent); }
.tag:disabled { opacity: .45; cursor: default; }
.scene-status { margin-top: 22px; font-size: 15px; min-height: 54px; max-width: 28ch; }
.surprise-button { min-width: 44px; min-height: 44px; padding: 10px; display: grid; place-items: center; border: 1px solid rgba(var(--ink-rgb),.3); background: var(--transparent); color: var(--ink); border-radius: 50%; cursor: pointer; transition: background .2s,color .2s,transform .2s; }
.surprise-button:hover { background: var(--ink); color: var(--accent); }
.surprise-button:active { transform: scale(.95); }
.surprise-button:focus-visible { outline-color: var(--ink); }
.surprise-button:disabled { opacity: .45; cursor: default; }
.download .text-link { color: var(--ink); gap: 12px; }
.download .text-link:hover { color: var(--on-accent-secondary); text-decoration-color: currentColor; }
.download .text-link:active { color: var(--surface-hover); }
.download .text-link:focus-visible { outline-color: var(--ink); }
.download .text-link[aria-disabled='true'] { opacity: .45; }
```

## 5. Layout Principles

1440×900参考画布，安全边距约40px、最大容器1600px、24px基准间隔。节奏间距8/12/16/24/32/48/64/96。四个 section 桌面 min-height:100svh；页面最小宽度1024px，不设计手机布局。

第一屏底部 2:4:6 分配滚动提示、说明、CTA。第二屏文案与摄影圆环 5:7；环卡宽158～190px、半径220～280px、透视1150px。第三屏模式文案与唱片 5:7，下方三条简短功能说明，不使用产品截图或等大的卡片框。

全局背景fixed、pointer-events:none、z-index:2；章节内容z-index:3，导航50。背景mix-blend-mode:difference让曲线在黑底是绿、绿底是深色。背景不覆盖文字和点击区域。不得用body横向裁切掩盖布局错误，背景仅在固定视口内裁切，旋转位移作用于内部框架，不让固定层产生横向溢出。

## 6. Depth & Elevation

阴影使用 --shadow-card（摄影与收藏气泡）、--shadow-product（唱片封套）、--shadow-accent（选中轮廓）。深度主要来自透视、遮挡、图像缩放与明确边框。正文平面呈现；不把所有组件放入玻璃卡片，不对运动层加 blur。

## 7. Animation & Interaction

沿用L2核心并强化桌面三维和指针反馈，CSS + 原生 JavaScript + IntersectionObserver + requestAnimationFrame，无新增依赖。

| 类别 | 实现 | 范围/时长 |
|---|---|---|
| Hero H1 | 遮罩入场 | .8s，一次 |
| Section H2 | 浮入 | 28px/.64s |
| Body / label | reveal与状态轻反馈 | .56s/.4s |
| 元素 | CTA磁吸、卡片悬停 | 磁吸最多6px；外框1→1.15 |
| 交互构件 | 八场景3D圆环、三模式切换 | 45°/次、.85s；模式.7～1.2s |
| 背景 | 固定SVG曲线、光带、颗粒 | 18s呼吸，滚动上下±40px、转角0～12° |

卡片照片缩放1.32→1、圆角16→36px，模拟参考中的悬停退让；父层transform保持三维位置。选择点击/键盘控制，hover不会改变场景避免卡片移动到指针脚下。左右键环绕切换，Home/End跳第一/最后；焦点留在新选卡片且不自动滚动。所有pill与卡片按钮按唯一场景同步aria-pressed。

默认/熟悉/新鲜按钮同步图形和文案，role=status播报。背景随指针最多±20/14px；场景舞台跟随指针最多±5/4°；封套局部±7/5°，唱片与收藏气泡反向平移分层。后台暂停背景、宣言带、唱片与收藏气泡；唱片只有第三屏可见时旋转。指针与滚动rAF节流，轻视差仅fine pointer且非低动态。无滚轮截获，无长pin。

参考差异：pmndrs原例使用WebGL弯曲面与无限滚轮容器，本页用CSS3D近似透视构图与圆角缩放；本页新增实用的场景选择、中文反馈与键盘操作，不宣称复刻真实几何弯曲。详见审计。

无脚本时正文和八场景仍存在、默认模式完整、官方下载可用。减少动态设置停止所有持续动画与transition，视差归零，静态环仍保留场景选择。内容不依赖入场动画才能出现。

## 8. Do's and Don'ts

### Do

- 延续已确认的荧光绿、巨大中文品牌字和四屏范围。
- 让一个连续背景把不同区块连接起来。
- 八场景以真实摄影呈现，通勤更换为明确的地铁旅程。
- 第三屏用可交互模式与独立唱片视觉表达产品能力。
- 标签、照片、模式都支持键盘及明确焦点。
- 只用核实的官方下载链接。
- 尊重减少动态效果；后台及屏外暂停持续动效。
- 维护电脑端可读性、44px控件目标和无脚本内容。

### Don't

- 不保留旧设计草案或旧第三屏截图布局。
- 不保留每屏页数提醒。
- 不新增二级页面、定价、账户、博客或语言切换。
- 不复制参考的照片、紫色环境或全局圆点光标。
- 不让hover自动旋转选中卡片。
- 不把装饰唱片伪装成真实播放器或实际歌曲封面。
- 不使用会员价格、用户数、评价或曲库量等未核实承诺。
- 不自动发出声音，不把装饰声波称为真实音频分析。
- 不用移动blur、大面积backdrop-filter或滚轮劫持。
- 不用body横向裁切掩盖错误，不让3D卡片遮住CTA。

## 9. Responsive Behavior

用户明确只做电脑端。基准1440×900，页面最小宽1024px，1024/1280/1440/1920px窗口验证。≤1200px缩小圆环、唱片与封套，保持两栏构图，不提供手机版布局。正文和官方下载入口始终可见。

```css
@media (max-width: 1200px) {
  .discover-content { grid-template-columns: 5fr 7fr; gap: 24px; }
  .discover-copy h2 { font-size: 40px; }
  .scene-gallery { --ring-radius: 220px; --card-width: 158px; --card-height: 238px; height: 400px; }
  .scene-position { top: 72px; }
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

四屏签名视觉：巨型品牌字与全局声场 → 倾斜八卡环形选择器 → 模式切换唱片封套 → 绿底收尾与声波彩蛋。详细验收记录在AUDIT.md。
