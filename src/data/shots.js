const categoryMeta = {
  movement: {
    id: 'movement',
    title: '运镜',
    description: '镜头运动方式与镜头语义，强调节奏推进。',
    color: 'from-indigo',
  },
  composition: {
    id: 'composition',
    title: '构图',
    description: '画面布局、视觉引导与人物关系表达。',
    color: 'from-emerald',
  },
  storyboard: {
    id: 'storyboard',
    title: '分镜',
    description: '叙事功能导向的镜头设计，服务剧情节点。',
    color: 'from-amber',
  },
  shotSize: {
    id: 'shotSize',
    title: '景别',
    description: '远中近特镜头层级控制，塑造观众心理距离。',
    color: 'from-rose',
  },
}

const compositionPool = [
  '三分法', '中心对称', '肩后反打', '对角线构图', '前景遮挡',
  '框中框', '负空间', '引导线', '层次纵深', '黄金分割',
]

const cameraPositionPool = [
  '男A后肩 35°平视', '男A后肩 20°微低机位', '女B正面 15°平视', '双人轴线左侧 45°',
  '沙发侧前方中机位', '窗边逆光位', '书架缝隙位', '桌面低机位', '门框外窥视位', '高位俯拍 30°',
]

const cameraMovePool = [
  '静止', '缓慢推近', '轻微后拉', '滑轨平移', '稳定器跟拍', '轻摇镜', '弧线环绕', '短促推拉',
]

const shotSizePool = ['大全景', '全景', '中景', '中近景', '近景', '特写']
const usagePool = ['建立关系', '强化情绪', '推进信息', '制造悬念', '切换节奏', '段落收束', '转场过渡', '角色塑造']
const tagPool = ['室内夜戏', '电影感', '双人对话', '压迫感', '柔光', '高反差', '叙事关键', '慢节奏', '冲突', '留白']

function buildShotsForCategory(categoryId, prefix, count, imageOffset = 1) {
  return Array.from({ length: count }, (_, i) => {
    const idx = i + 1
    const imageNo = (i + imageOffset).toString().padStart(3, '0')
    const composition = compositionPool[i % compositionPool.length]
    const cameraPosition = cameraPositionPool[i % cameraPositionPool.length]
    const cameraMove = cameraMovePool[i % cameraMovePool.length]
    const shotSize = shotSizePool[i % shotSizePool.length]
    const purpose = `${usagePool[i % usagePool.length]}，用于${categoryMeta[categoryId].title}示例 #${idx}`
    const tags = [
      tagPool[i % tagPool.length],
      tagPool[(i + 3) % tagPool.length],
      categoryMeta[categoryId].title,
    ]

    return {
      id: `${categoryId}-${idx}`,
      category: categoryId,
      type: `${categoryMeta[categoryId].title}类型-${(i % 5) + 1}`,
      name: `${prefix}${idx}`,
      composition,
      cameraPosition,
      cameraMove,
      shotSize,
      purpose,
      tags,
      thumbnail: `/storyboard-site/shots/shot-${imageNo}.png`,
    }
  })
}

export const categories = Object.values(categoryMeta)

export const shots = [
  ...buildShotsForCategory('movement', '运镜分镜 ', 20, 1),
  ...buildShotsForCategory('composition', '构图分镜 ', 20, 21),
  ...buildShotsForCategory('storyboard', '叙事分镜 ', 20, 41),
  ...buildShotsForCategory('shotSize', '景别分镜 ', 20, 61),
]

export const categoryStats = categories.map((cat) => ({
  ...cat,
  count: shots.filter((s) => s.category === cat.id).length,
  cover: shots.find((s) => s.category === cat.id)?.thumbnail,
}))
