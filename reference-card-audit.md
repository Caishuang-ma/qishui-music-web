# 场景卡片参考动效审计

参考：[Cards With Border Radius — pmndrs examples](https://pmndrs.github.io/examples/cards-with-border-radius/)。审计日期：2026-10-11。用 Tabbit 独立任务「场景卡片参考审计」在 1440 × 900 真实浏览器中检查默认、悬停、点击、滚动，并读取公开构建脚本与 CSS。

## 直接观察到的视觉行为

- 8 张照片在一个倾斜的三维圆环上排列：中间前景较大，两侧卡片侧转、重叠；后排仍有视觉存在。卡片不是普通平面横向列表。
- 整组构图向左上倾斜，照片边缘略有弯曲；一条白色重复文字丝带绕圆环前后穿行。
- 悬停前景卡片时，卡片放大、圆角变大、图片从近景裁切退回完整构图；离开后平滑恢复。没有光斑追踪、翻牌或文字浮层。
- 单击同一卡片，页面地址与信息不变，没有选中、弹窗或导航；源码也没有给照片卡片注册 click 事件。
- 滚轮使圆环沿 Y 轴旋转，轮廓与前后遮挡关系随之改变；示例使用自己的一屏滚动容器无限循环。指针位置还会改变整体观察角度。
- 默认状态并非所有照片自行绕圈：圆环旋转来自滚动；持续运动的是文字丝带。

## 源码确认的参数

公开文件：[页面脚本](https://pmndrs.github.io/examples/cards-with-border-radius/assets/index-Zr9Bdc7_.js)、[页面 CSS](https://pmndrs.github.io/examples/cards-with-border-radius/assets/index-D_CJqOTt.css)。构建文件名可能随更新变化。

| 项目 | 源码证据 |
|---|---|
| 圆环 | 8 张，半径 1.4 世界单位，45° 等角排列；position = [sin(θ) × r, 0, cos(θ) × r] |
| 舞台倾斜 | group rotationZ = 0.15rad，约 8.59°；由于 WebGL 与 CSS 的 Y 轴方向不同，CSS 视觉对应约 −8.6° |
| 卡片形状 | bentPlaneGeometry 的弯曲量 0.1，1 × 1 正方形，20 × 20 分段；双面材质 |
| 悬停外框 | scale 1 → 1.15，damp smoothTime 0.1 |
| 悬停圆角 | shader radius 0.1 → 0.25，damp smoothTime 0.2；这里是世界/材质参数，不能直接称为 10px/25px |
| 悬停照片 | texture zoom 1.5 → 1，damp smoothTime 0.2；放大外框的同时，图像向外退让 |
| 滚动 | pages=4、infinite=true，默认 damping=0.25；rotationY = −offset × 2π |
| 指针观察角 | 相机目标 [−pointerX × 2, pointerY + 1.5, 10]，smoothTime 0.3，并 lookAt 原点 |
| 前景丝带 | 圆柱半径 1.6、高 0.14；纹理每秒向 X 偏移 0.5，横向重复 30 次；滚动加快正弦起伏 |
| 氛围 | dawn 环境贴图 + blur 0.5；雾从 8.5 到 12 世界单位，颜色 #aa7799 |
| 加载 | canvas 淡入为 5 秒、延迟 1 秒；这是原例行为，不建议照搬宣传页的等待时间 |

damp 的 smoothTime 是平滑响应参数，不等于 CSS transition 的精确持续时间。源例是真 WebGL 的弯曲图片和圆柱丝带；纯 CSS 3D 可以复现构图、透视和反馈，不能宣称复现了真实几何弯曲。

## 在汽水音乐 L2 页面中的原生适配建议

保留八场景的圆环语法，全部替换为音乐场景照片和名称；背景沿用现有品牌色，不照搬紫色、室内摄影、pmndrs 标志或全局圆点光标。

| 原生实现 | 建议起点，属于适配参数 |
|---|---|
| 舞台 | perspective 1000～1200px；外层 rotateZ(−8.6deg)，内层 preserve-3d |
| 卡片 | 正方形，宽 clamp(170px,17vw,250px)；环半径 clamp(280px,30vw,430px)；45° 间隔 |
| 位置 | 每张卡外层 rotateY(θ) translateZ(radius)；内部独立 hover 层，避免覆盖定位 transform |
| Hover / focus | 内框 scale(1.15)，圆角由 10% → 25%，照片内部 scale(1.5) → scale(1)；约 220～380ms，ease-out |
| 圆环进度 | 第二屏进入时的自然页面滚动关联一个有限角度区间，例如 −35° → 35°；场景按钮或左右控制每次再转 45°，不截获滚轮 |
| 点击 | 原例没有点击行为；新页可明确新增“选择场景”，用 aria-pressed 和文字说明反馈，并把选中照片转向前景 |
| 指针视差 | 仅 fine pointer，舞台附加 rotateX/rotateY 各不超过 3～5°，rAF 节流；离开时归零 |
| 丝带 | 可用透视椭圆的前后两层文字环近似，或更克制地用背景曲线带；无需为此加入第二套 WebGL |
| 运行与降级 | IO 不可见、切后台时停止持续动画；手机改直接可滑动的场景卡片；reduced-motion 显示静态卡片并保留选择功能 |

避免把整个圆环整体持续 scale 或晃动。最关键的识别行为是“环形排列 + 自然旋转 + hover 外框放大、照片缩小、圆角扩大”。功能性点击和移动端控件属于汽水音乐方案的新增内容，不能写成原例现有行为。

## 审计证据

原始浏览器截图保存在 `/Users/huayu/Library/Application Support/Tabbit/LocalAgent/Runtime/artifacts/task-7248afed-7cec-42ac-8b42-4f75992751fd/`：

- 默认：`screenshot-shot-91bdb36d-a6e2-4be6-856f-7d82f618841f.png`
- 悬停：`screenshot-shot-d19375ee-c54c-421c-a6a8-2cb9a433f0eb.png`
- 点击后：`screenshot-shot-46860dc3-10ff-41aa-8b32-17da5499f758.png`
- 滚动后：`screenshot-shot-5a677fc4-45fd-45c2-8ec8-eda2e9b0d865.png`

所有上述截图均已打开检查。没有修改汽水音乐页面代码。
