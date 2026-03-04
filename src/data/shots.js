const BASE = import.meta.env.BASE_URL;

export const DIMENSIONS = {
  narrative: ['开场', '铺垫', '转折', '高潮', '收束'],
  shotSize: ['大全景', '全景', '中景', '近景', '特写'],
  angle: ['平视', '俯拍', '仰拍', '过肩', '主观'],
  motion: ['推', '拉', '摇', '移', '跟', '甩', '静'],
  sceneType: ['对话', '动作', 'MV', '风景'],
};

const rawShots = [
  ['opening-establishing-pan', '开场建立·大全景横摇', '开场', '大全景', '平视', '摇', '风景'],
  ['opening-city-push', '开场建立·城市推入', '开场', '全景', '平视', '推', '风景'],
  ['opening-pov-enter', '开场进入·主观穿行', '开场', '中景', '主观', '移', '动作'],
  ['foreshadow-shoulder-dialogue', '铺垫关系·过肩对话', '铺垫', '中景', '过肩', '静', '对话'],
  ['foreshadow-closeup-prop', '铺垫线索·道具近景', '铺垫', '近景', '俯拍', '推', '对话'],
  ['foreshadow-follow-walk', '铺垫行动·跟拍行走', '铺垫', '全景', '平视', '跟', '动作'],
  ['turning-angle-dutch-whip', '转折失衡·甩镜切换', '转折', '中景', '仰拍', '甩', 'MV'],
  ['turning-reveal-pullback', '转折揭示·拉出关系', '转折', '全景', '平视', '拉', '对话'],
  ['turning-overhead-chaos', '转折混乱·俯拍群像', '转折', '大全景', '俯拍', '移', '动作'],
  ['turning-subjective-run', '转折逃离·主观疾跑', '转折', '近景', '主观', '跟', '动作'],
  ['climax-confront-low-angle', '高潮对峙·仰拍压迫', '高潮', '中景', '仰拍', '推', '动作'],
  ['climax-impact-whip', '高潮打击·甩镜命中', '高潮', '近景', '平视', '甩', '动作'],
  ['climax-sprint-track', '高潮冲刺·侧移跟进', '高潮', '全景', '平视', '移', 'MV'],
  ['climax-emotion-closeup', '高潮情绪·特写停顿', '高潮', '特写', '平视', '静', '对话'],
  ['climax-overhead-collapse', '高潮崩塌·俯拍坠落', '高潮', '大全景', '俯拍', '拉', '动作'],
  ['resolution-wide-release', '收束释然·大全景留白', '收束', '大全景', '平视', '静', '风景'],
  ['resolution-dialogue-calm', '收束和解·过肩慢节奏', '收束', '中景', '过肩', '拉', '对话'],
  ['resolution-pov-walkaway', '收束离场·主观后退', '收束', '全景', '主观', '拉', '风景'],
  ['resolution-object-close', '收束寓意·道具特写', '收束', '特写', '俯拍', '推', '对话'],
  ['dialogue-shotreverse-basic', '对话基础·正反打', '铺垫', '中景', '过肩', '静', '对话'],
  ['dialogue-two-shot-balance', '对话平衡·双人中景', '铺垫', '中景', '平视', '静', '对话'],
  ['dialogue-power-lowhigh', '对话权力·仰俯对切', '转折', '近景', '仰拍', '静', '对话'],
  ['action-chase-follow', '动作追逐·后跟拍', '高潮', '全景', '平视', '跟', '动作'],
  ['action-lateral-move', '动作并行·侧向移镜', '高潮', '中景', '平视', '移', '动作'],
  ['action-punch-in', '动作爆点·快速推近', '高潮', '近景', '平视', '推', '动作'],
  ['mv-beat-pan', 'MV节拍·横摇切点', '高潮', '全景', '平视', '摇', 'MV'],
  ['mv-arc-track', 'MV绕拍·弧线跟进', '转折', '中景', '平视', '跟', 'MV'],
  ['mv-drop-whip', 'MV下落·甩镜转场', '转折', '近景', '主观', '甩', 'MV'],
  ['landscape-drone-pull', '风景航拍·高空拉远', '开场', '大全景', '俯拍', '拉', '风景'],
  ['landscape-foreground-push', '风景层次·前景推入', '铺垫', '全景', '平视', '推', '风景'],
  ['landscape-subjective-glance', '风景主观·回望摇镜', '收束', '近景', '主观', '摇', '风景'],
  ['action-over-shoulder-aim', '动作瞄准·过肩压迫', '转折', '近景', '过肩', '推', '动作'],
];

const paceMap = {
  开场: '4–8秒，节奏平稳，优先建立空间关系',
  铺垫: '3–6秒，节奏克制，给信息留理解时间',
  转折: '1.5–4秒，节奏明显变化，制造心理落差',
  高潮: '0.8–3秒，可快速切换，强调冲击',
  收束: '3–7秒，节奏放缓，保留回味余量',
};

const misuseMap = {
  大全景: '误用：信息点太小看不清。建议配一条中近景补信息。',
  全景: '误用：人物占比过小导致情绪弱化。建议关键句前切近景。',
  中景: '误用：背景杂乱分散注意。建议做减法构图。',
  近景: '误用：连续近景造成空间迷失。建议穿插全景校正方位。',
  特写: '误用：滥用特写导致“情绪通胀”。建议留给真正关键瞬间。',
};

const languageTemplate = (angle, motion) => [
  `机位控制：${angle}用于建立主观权力关系，注意轴线一致。`,
  `运动设计：${motion}镜头要有明确起止点，避免“为了动而动”。`,
  '构图建议：主体保持在三分区附近，前景/中景/背景至少保留两层。',
];

export const shots = rawShots.map(([id, name, narrative, shotSize, angle, motion, sceneType], idx) => ({
  id,
  name,
  narrative,
  shotSize,
  angle,
  motion,
  sceneType,
  tags: [narrative, shotSize, angle, motion, sceneType],
  image: `${BASE}shots/${id}.svg`,
  purpose: `适用于「${sceneType}」场景中的${narrative}段落，优先解决“${name.split('·')[1]}”的叙事表达。`,
  languagePoints: languageTemplate(angle, motion),
  durationPace: paceMap[narrative],
  misuseTips: misuseMap[shotSize],
  order: idx + 1,
}));

export const lensDictionary = [
  { term: '轴线', meaning: '人物对话或行动方向的连续性基准线，越轴会造成方向混乱。' },
  { term: '动机运镜', meaning: '镜头运动必须由角色动作、信息揭示或情绪变化触发。' },
  { term: '景别递进', meaning: '远到近用于聚焦信息，近到远用于释放情绪或收束段落。' },
  { term: '镜头重音', meaning: '在关键台词/动作节点使用特写、推近或停顿形成“重音”。' },
  { term: '前后景关系', meaning: '利用遮挡、透视、景深组织空间层次，避免平铺画面。' },
];
