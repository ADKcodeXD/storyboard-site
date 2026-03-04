const BASE = import.meta.env.BASE_URL

const BASE_SCENE = '夜晚室内：旧公寓客厅兼书房，窗外持续降雨，室内暖色钨丝灯与冷色月光交织。'
const BASE_CHARACTERS = '固定角色：男A（深色夹克，30+）与女B（浅灰衬衫，28+），电影写实风，保持同一造型与同一空间连续性。'

export const sections = [
  { id: 'storyboard', title: '分镜', description: '基础叙事镜头与正反打语法。', cover: `${BASE}shots/shot-001.png` },
  { id: 'shotSize', title: '景别', description: '从极特写到大全景的心理距离。', cover: `${BASE}shots/shot-008.png` },
  { id: 'composition', title: '构图', description: '六种基础构图快速控制视觉重心。', cover: `${BASE}shots/shot-015.png` },
  { id: 'angle', title: '视角', description: '平视 / 仰视 / 俯视 / 监控视角。', cover: `${BASE}shots/shot-022.png` },
]

const SHOT_SIZES = ['极特写', '特写', '近景', '半身（中近景）', '中景', '全景', '大全景']
const COMPOSITIONS = ['三分法', '居中对称', '对角线', '引导线', '框中框', '留白']
const ANGLES = ['平视', '仰视', '俯视', '监控视角（高位监控）']

const recommendedScenesBySize = {
  极特写: ['情绪爆点瞬间', '关键物件细节', '心理压迫时刻'],
  特写: ['人物独白', '对话反应镜头', '秘密揭示前后'],
  近景: ['双人对话', '冲突升级', '关系拉扯'],
  '半身（中近景）': ['角色动作展示', '信息交换', '节奏转换段'],
  中景: ['对白推进', '人物走位', '正反打衔接'],
  全景: ['场景建立', '关系定位', '段落开场'],
  大全景: ['章节转场', '命运感收束', '环境压迫强化'],
}

const purposeByComposition = {
  三分法: '用于自然平衡地突出角色与环境信息，适合稳定叙事推进。',
  居中对称: '用于强调秩序、控制感与角色心理僵持。',
  对角线: '用于制造方向性与冲突势能，增强画面动态。',
  引导线: '用于把观众视线精确引向人物或关键道具。',
  框中框: '用于强化窥视感、关系隔阂与叙事层次。',
  留白: '用于制造孤独、悬念或心理空间，服务情绪停顿。',
}

const sectionByIndex = ['storyboard', 'shotSize', 'composition', 'angle']

function buildPrompt({ name, shotSize, composition, angle }) {
  return [
    `场景：${BASE_SCENE}`,
    `角色：${BASE_CHARACTERS}`,
    `分镜名称：${name}`,
    `经典语法：正反打（shot-reverse-shot）`,
    `景别：${shotSize}`,
    `构图：${composition}`,
    `镜头视角：${angle}`,
    '画幅与分辨率：16:9，1K。',
    '镜头限制：禁止卡通、禁止插画、禁止第三角色入镜、禁止夸张畸变。',
    '影像风格：电影写实、胶片颗粒、暗调高动态范围，保持同一时空连续性。',
  ].join('\n')
}

export const shots = SHOT_SIZES.flatMap((shotSize, sizeIndex) =>
  COMPOSITIONS.map((composition, compIndex) => {
    const idx = sizeIndex * COMPOSITIONS.length + compIndex + 1
    const angle = ANGLES[(idx - 1) % ANGLES.length]
    const section = sectionByIndex[(idx - 1) % sectionByIndex.length]
    const name = `${shotSize}·${composition}·${angle}`

    return {
      id: `shot-${String(idx).padStart(3, '0')}`,
      section,
      name,
      shotSize,
      composition,
      angle,
      grammar: '正反打（shot-reverse-shot）',
      purpose: purposeByComposition[composition],
      recommendedScenes: recommendedScenesBySize[shotSize],
      tags: ['基础镜头', shotSize, composition, angle, '正反打'],
      prompt: buildPrompt({ name, shotSize, composition, angle }),
      thumbnail: `${BASE}shots/shot-${String(idx).padStart(3, '0')}.png`,
    }
  }),
)

export const filterOptions = {
  sections: ['all', ...sections.map((s) => s.id)],
  shotSizes: ['all', ...SHOT_SIZES],
  compositions: ['all', ...COMPOSITIONS],
  angles: ['all', ...ANGLES],
  tags: ['all', ...new Set(shots.flatMap((s) => s.tags))],
}

export const sectionStats = sections.map((s) => ({
  ...s,
  count: shots.filter((shot) => shot.section === s.id).length,
}))
