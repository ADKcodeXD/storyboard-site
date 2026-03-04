const categoryMeta = {
  movement: {
    id: 'movement',
    title: '运镜',
    description: '镜头运动方式与节奏控制，强调情绪推进。',
    color: 'from-indigo',
  },
  composition: {
    id: 'composition',
    title: '构图',
    description: '画面布局与视觉引导，突出人物关系。',
    color: 'from-emerald',
  },
  storyboard: {
    id: 'storyboard',
    title: '分镜',
    description: '叙事节点型镜头，服务剧情信息表达。',
    color: 'from-amber',
  },
  shotSize: {
    id: 'shotSize',
    title: '景别',
    description: '通过心理距离（特写到大全景）构建观感层次。',
    color: 'from-rose',
  },
}

const BASE_SCENE = '夜晚室内：旧公寓客厅兼书房，雨水拍打窗户，钨丝灯与冷月光混合。'
const BASE_CHARACTERS = '固定角色：男A（深色夹克，30+）与女B（浅灰衬衫，28+），电影写实风。'

const shotSizeTemplates = {
  特写: '强调面部细节与微表情，85mm+，浅景深，背景强虚化，仅保留关键情绪信息。',
  近景: '聚焦人物上半身与手部动作，50-85mm，背景可辨识但不过度抢戏，突出关系张力。',
  中景: '人物与环境并重，35-50mm，交代站位、动作、空间关系，便于承接对白。',
  全景: '建立房间结构与角色空间距离，24-35mm，展示完整调度与动线。',
  大全景: '优先空间建立与孤立感，18-24mm，人物占比小，突出环境压迫与叙事氛围。',
}

const compositions = [
  '三分法偏左留白', '中心对称', '对角线引导', '前景遮挡框中框', '负空间压迫构图',
  '门框二次取景', '书架缝隙窥视', '双人轴线反打', '层次纵深', '黄金分割',
]

const cameraPositions = [
  '男A后肩平视 35°', '女B正面平视 15°', '茶几低机位仰拍', '窗边侧逆光位', '书架高位俯拍 30°',
  '门外窥视位', '沙发侧前方中机位', '轴线左侧 45°', '轴线右侧 45°', '桌面高度平视',
]

const cameraMoves = [
  '静止', '缓慢推近', '轻微后拉', '滑轨平移', '稳定器跟拍',
  '弧线环绕', '微摇镜', '短促推拉', '慢速横移', '停顿后推进',
]

const shotSizes = ['特写', '近景', '中景', '全景', '大全景']
const purposes = ['情绪爆点', '信息揭示', '关系对峙', '节奏切换', '悬念建立', '段落收束', '角色塑造', '空间建立']
const sceneSuggestions = {
  特写: ['情绪爆发', '关键台词瞬间', '心理变化刻画'],
  近景: ['双人对话', '冲突升级', '细节动作表达'],
  中景: ['角色互动段落', '叙事推进', '走位调度展示'],
  全景: ['场景建立', '人物关系定位', '段落开场'],
  大全景: ['孤独氛围建立', '章节转场', '命运感收束'],
}

function buildPromptTemplate({ name, composition, cameraPosition, cameraMove, shotSize, purpose }) {
  return [
    `场景：${BASE_SCENE}`,
    `角色：${BASE_CHARACTERS}`,
    `镜头名：${name}`,
    `构图：${composition}`,
    `机位：${cameraPosition}`,
    `运镜：${cameraMove}`,
    `景别：${shotSize}`,
    `光线：主光为暖色台灯，辅光为窗外冷色月光，保持高动态范围与胶片颗粒。`,
    `情绪：${purpose}，克制表演，电影叙事真实感。`,
    `镜头语言限制：${shotSizeTemplates[shotSize]}；禁止卡通、禁止插画、禁止夸张畸变、禁止第三角色入镜。`,
  ].join('\n')
}

function createShots() {
  const defs = [
    { category: 'movement', prefix: '运镜分镜', start: 1, count: 10 },
    { category: 'composition', prefix: '构图分镜', start: 11, count: 10 },
    { category: 'storyboard', prefix: '叙事分镜', start: 21, count: 10 },
    { category: 'shotSize', prefix: '景别分镜', start: 31, count: 10 },
  ]

  const rows = []
  defs.forEach((group) => {
    Array.from({ length: group.count }, (_, i) => {
      const seq = group.start + i
      const imageNo = String(seq).padStart(3, '0')
      const shotSize = shotSizes[(seq - 1) % shotSizes.length]
      const composition = compositions[(seq - 1) % compositions.length]
      const cameraPosition = cameraPositions[(seq - 1) % cameraPositions.length]
      const cameraMove = cameraMoves[(seq - 1) % cameraMoves.length]
      const purpose = purposes[(seq - 1) % purposes.length]
      const name = `${group.prefix} ${i + 1}`
      const type = `${categoryMeta[group.category].title}类型-${((i + 2) % 5) + 1}`

      rows.push({
        id: `${group.category}-${i + 1}`,
        category: group.category,
        type,
        name,
        composition,
        cameraPosition,
        cameraMove,
        shotSize,
        purpose,
        description: `固定场景与固定角色下的${shotSize}设计，通过“${composition} + ${cameraMove}”突出${purpose}，并保持连续镜头语义。`,
        recommendedScenes: sceneSuggestions[shotSize],
        tags: [
          categoryMeta[group.category].title,
          shotSize,
          purpose,
          compositions[(seq + 2) % compositions.length],
        ],
        promptTemplate: buildPromptTemplate({
          name,
          composition,
          cameraPosition,
          cameraMove,
          shotSize,
          purpose,
        }),
        thumbnail: `/storyboard-site/shots/shot-${imageNo}.png`,
      })
    })
  })

  return rows
}

export const categories = Object.values(categoryMeta)
export const shots = createShots()

export const categoryStats = categories.map((cat) => ({
  ...cat,
  count: shots.filter((s) => s.category === cat.id).length,
  cover: shots.find((s) => s.category === cat.id)?.thumbnail,
}))

export const shotSizeOptions = ['all', ...new Set(shots.map((s) => s.shotSize))]
