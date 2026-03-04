const data = [
  { title:'叙事-开场建立', cat:'叙事', tags:['建立镜头','时空交代'], desc:'先给环境全貌，再切人物进入，建立故事起点。', img:'assets/generated/narrative.svg', source:'#' },
  { title:'叙事-线索揭示', cat:'叙事', tags:['信息点','节奏推进'], desc:'通过三连镜头把关键线索逐步推到观众视线中心。', img:'assets/generated/narrative.svg', source:'#' },

  { title:'动作-追逐段', cat:'动作', tags:['高速移动','运动轨迹'], desc:'对角线与前后景位移强化速度感。', img:'assets/generated/action.svg', source:'#' },
  { title:'动作-冲突爆发', cat:'动作', tags:['张力','爆发'], desc:'短焦快速切镜+动态线条，突出打击与反应。', img:'assets/generated/action.svg', source:'#' },

  { title:'对话-正反打', cat:'对话', tags:['过肩镜头','关系'], desc:'A肩后看B，再切B肩后看A，形成标准对话节奏。', img:'assets/generated/dialogue.svg', source:'#' },
  { title:'对话-情绪逼近', cat:'对话', tags:['特写','停顿'], desc:'在关键台词前后拉近景别，捕捉微表情。', img:'assets/generated/dialogue.svg', source:'#' },

  { title:'MV-副歌爆点', cat:'MV', tags:['节拍剪辑','灯光'], desc:'副歌处提高切镜频率，配合霓虹主色统一视觉。', img:'assets/generated/mv.svg', source:'#' },
  { title:'MV-桥段过渡', cat:'MV', tags:['转场','氛围'], desc:'用旋转或遮挡转场把叙事段引入表演段。', img:'assets/generated/mv.svg', source:'#' },

  { title:'风景-远景建立', cat:'风景', tags:['航拍','空间感'], desc:'先远景建立地理关系，再中景进入人物活动。', img:'assets/generated/landscape.svg', source:'#' },
  { title:'风景-情绪景别', cat:'风景', tags:['光线','氛围'], desc:'利用日出/日落逆光让环境参与情绪表达。', img:'assets/generated/landscape.svg', source:'#' }
];

const grid = document.getElementById('grid');
const search = document.getElementById('search');
const category = document.getElementById('categoryFilter');
const modal = document.getElementById('modal');
const els = { title:mTitle, img:mImg, cat:mCat, tags:mTags, desc:mDesc, source:mSource };
closeBtn.onclick = () => modal.close();

function render(){
  const q = search.value.trim();
  const c = category.value;
  grid.innerHTML = '';

  data
    .filter(x => (c === 'all' || x.cat === c) && `${x.title}${x.tags.join('')}${x.desc}`.includes(q))
    .forEach(x => {
      const d = document.createElement('div');
      d.className = 'card';
      d.innerHTML = `<img src="${x.img}" alt="${x.title}"/><div class="meta"><div class="title">${x.title}</div><div class="cat">${x.cat}</div><div class="tags">${x.tags.join(' / ')}</div></div>`;
      d.onclick = () => {
        els.title.textContent = x.title;
        els.img.src = x.img;
        els.cat.textContent = x.cat;
        els.tags.textContent = x.tags.join('、');
        els.desc.textContent = x.desc;
        if (x.source === '#') {
          els.source.textContent = '本地示意图';
          els.source.removeAttribute('href');
        } else {
          els.source.textContent = '查看原图';
          els.source.href = x.source;
        }
        modal.showModal();
      };
      grid.appendChild(d);
    });
}

search.oninput = render;
category.onchange = render;
render();
