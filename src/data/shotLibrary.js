const BASE = import.meta.env.BASE_URL;

export const COMPOSITIONS = ['三分法', '居中对称', '引导线', '对角线', '三角构图', '框中框', '留白构图', '前景遮挡'];
export const CAMERA_POSITIONS = ['平视', '俯拍', '仰拍', '过肩', '主观', '顶拍', '低机位'];
export const CAMERA_MOVEMENTS = ['固定', '推镜', '拉镜', '摇镜', '移镜', '跟拍', '甩镜', '升降'];

const shotNameMap = {
  三分法: '叙事三分焦点',
  居中对称: '对称秩序构图',
  引导线: '引导线聚焦',
  对角线: '对角张力场面',
  三角构图: '三角关系画面',
  框中框: '框中框视角',
  留白构图: '留白情绪镜头',
  前景遮挡: '前景遮挡窥视',
};

const purposeMap = {
  固定: '稳定交代空间与角色关系',
  推镜: '逐步强调关键信息或情绪',
  拉镜: '释放信息，揭示更大环境',
  摇镜: '在同一时空内重新分配注意力',
  移镜: '建立角色与环境的动态关系',
  跟拍: '强化行动连续性与代入感',
  甩镜: '制造冲击与段落转换感',
  升降: '强化空间层次与权力变化',
};

const buildShots = () => {
  const list = [];
  for (let i = 0; i < 48; i += 1) {
    const composition = COMPOSITIONS[i % COMPOSITIONS.length];
    const cameraPosition = CAMERA_POSITIONS[i % CAMERA_POSITIONS.length];
    const cameraMovement = CAMERA_MOVEMENTS[i % CAMERA_MOVEMENTS.length];
    const id = `shot-${String(i + 1).padStart(2, '0')}`;

    list.push({
      id,
      shotName: `${shotNameMap[composition]} ${String(i + 1).padStart(2, '0')}`,
      composition,
      cameraPosition,
      cameraMovement,
      image: `${BASE}shots/${id}.jpg`,
      usage: `教学用途：用于${cameraPosition}机位下的${cameraMovement}示例，重点演示「${composition}」的可视化执行。${purposeMap[cameraMovement]}。`,
    });
  }
  return list;
};

export const shotLibrary = buildShots();
