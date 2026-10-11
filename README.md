# 汽水音乐宣传落地页

## GitHub Pages

仓库名称：`qishui-music-web`。工作流 `.github/workflows/pages.yml` 在推送到 `main` 或手动运行时发布 `dist/`，保留当前电脑端页面与全部交互。首次部署时在仓库 Settings → Pages 将 Source 选择为 GitHub Actions。

部署采用 [GitHub 官方 Pages 工作流](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically)。网页使用相对资源路径，支持 `/qishui-music-web/` 项目路径，无需构建或安装依赖。

## 当前页面

电脑端单页，共品牌、听歌场景、听歌模式及下载四屏，无二级页面。基准画布1440×900，目标为1024px以上桌面窗口，不提供手机布局。

静态 HTML/CSS/JavaScript，打开 `dist/index.html` 或以 `dist` 为根目录启动静态 HTTP 服务，无需安装依赖或编译。

包含贯穿全页的流动曲线背景与指针视差、巨型标题入场、宣言带、八场景3D摄影圆环、默认 / 熟悉 / 新鲜三种模式切换、唱片旋转、封套视差与收藏气泡浮动。场景画廊内支持触控板上下 / 左右滑动、鼠标或单一主指针上下 / 左右拖拽、左右按钮和方向键。wheel选绝对值较大的主轴，X/Y不叠加；拖动超过8px后锁定主轴。200px移动一格，手势连续推动圆环；wheel停手140ms后吸附，拖动在松手或取消后吸附。画廊内 `touch-action:none`；画廊外保持普通页面滚动。没有页数提醒或产品截图展示。

第三屏的唯一歌曲播放入口在唱片中心：112px按钮与旋转唱片分层，按钮图标和文字不随唱片转动；歌曲名与演唱者显示在舞台右上方。左侧只保留听歌模式与反馈。舞台保持可访问，装饰子层分别隐藏于无障碍树，播放按钮可以键盘聚焦。

点击中心按钮打开 Kate Bush 的 [Running Up That Hill 官方 MV](https://www.youtube.com/watch?v=wp43OdtAAkM)，动态载入可见 YouTube 播放器，保留画面、原生控制栏、全屏及官方来源链接。原生 dialog 支持关闭按钮、Esc 和框外点击；关闭后移除 iframe、停止播放并恢复中心按钮焦点。按钮 `aria-expanded` 随弹窗开启 / 关闭更新。没有下载或重新上传媒体；实际播放依赖第三方播放器可访问性。

第四屏是黑底音乐海报：巨型双行标题、悬浮品牌物体与椭圆轨道、三张错位生活摄影及绿色下载票券。行动链接指向[汽水音乐官方下载页](https://music.douyin.com/qishui)，不把会员价格作为营销承诺。减少动态设置停用持续装饰、视差与过渡，保留选择和主动播放入口；后台和屏外暂停持续视觉动效。

设计参考 [Lenis](https://lenis.dev/) 与 [pmndrs Cards With Border Radius](https://pmndrs.github.io/examples/cards-with-border-radius/)。圆环用原生 CSS 3D 近似透视与悬停语言，未复制 WebGL 源码。用户截图提供真实产品模式与场景分类依据。摄影出处见 `assets-sources.md`，参考审计见 `reference-card-audit.md`，当前规范见 `DESIGN.md`。本说明记录实现与使用方式，不新增页面验收结论；实际验证单独记录在 `AUDIT.md`。
