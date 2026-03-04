const U='https://source.unsplash.com/featured/800x500/?';
const data=[
 {title:'三角构图',cat:'构图',tags:['平衡','稳定','人物群像'],desc:'主体形成三角关系，强化稳定与叙事重心。',img:U+'portrait,group,triangular-composition',source:'https://unsplash.com/s/photos/triangular-composition'},
 {title:'左三分之一构图',cat:'构图',tags:['三分法','留白','引导视线'],desc:'主体放在画面左侧三分之一，右侧留白承接信息。',img:U+'portrait,rule-of-thirds,left',source:'https://unsplash.com/s/photos/rule-of-thirds'},
 {title:'居中对称构图',cat:'构图',tags:['对称','秩序','庄重'],desc:'主体居中，左右结构对称，强化仪式感。',img:U+'symmetry,architecture,centered',source:'https://unsplash.com/s/photos/symmetry'},
 {title:'引导线构图',cat:'构图',tags:['线条','纵深','动势'],desc:'利用道路、栏杆等线条引导视线至主体。',img:U+'leading-lines,road,street',source:'https://unsplash.com/s/photos/leading-lines'},
 {title:'前景框架构图',cat:'构图',tags:['层次','空间','沉浸'],desc:'以前景形成框架包裹主体，增加纵深。',img:U+'frame-within-frame,window,door',source:'https://unsplash.com/s/photos/frame-within-frame'},
 {title:'对角线构图',cat:'构图',tags:['张力','速度','冲突'],desc:'主体沿对角线排布，营造运动和冲突感。',img:U+'diagonal-composition,motion',source:'https://unsplash.com/s/photos/diagonal-composition'},
 {title:'俯拍机位',cat:'机位',tags:['压迫','观察视角'],desc:'镜头高于主体，常用于弱化角色力量。',img:U+'top-view,overhead,person',source:'https://unsplash.com/s/photos/top-view-person'},
 {title:'仰拍机位',cat:'机位',tags:['权威','压迫感'],desc:'镜头低于主体，强化角色气场。',img:U+'low-angle,building,person',source:'https://unsplash.com/s/photos/low-angle'},
 {title:'过肩镜头',cat:'叙事',tags:['对话','关系'],desc:'从A肩后看B，强调人物关系与对位。',img:U+'over-shoulder,conversation',source:'https://unsplash.com/s/photos/over-shoulder'},
 {title:'特写镜头',cat:'景别',tags:['情绪','细节'],desc:'突出面部或物体细节，传达强情绪。',img:U+'close-up,face,emotion',source:'https://unsplash.com/s/photos/close-up-face'},
 {title:'中景镜头',cat:'景别',tags:['动作','关系'],desc:'兼顾人物与环境，适合对话和行动。',img:U+'medium-shot,person,street',source:'https://unsplash.com/s/photos/medium-shot'},
 {title:'全景镜头',cat:'景别',tags:['环境','建立空间'],desc:'展示场景全貌，建立时空关系。',img:U+'wide-shot,landscape,cinematic',source:'https://unsplash.com/s/photos/wide-shot'}
];

const grid=document.getElementById('grid');
const search=document.getElementById('search');
const category=document.getElementById('categoryFilter');
const modal=document.getElementById('modal');
const els={title:mTitle,img:mImg,cat:mCat,tags:mTags,desc:mDesc,source:mSource};
closeBtn.onclick=()=>modal.close();

function render(){
 const q=search.value.trim(); const c=category.value;
 grid.innerHTML='';
 data.filter(x=>(c==='all'||x.cat===c)&&(`${x.title}${x.tags.join('')}${x.desc}`.includes(q)))
 .forEach(x=>{
   const d=document.createElement('div'); d.className='card';
   d.innerHTML=`<img src="${x.img}"/><div class="meta"><div class="title">${x.title}</div><div class="cat">${x.cat}</div><div class="tags">${x.tags.join(' / ')}</div></div>`;
   d.onclick=()=>{els.title.textContent=x.title;els.img.src=x.img;els.cat.textContent=x.cat;els.tags.textContent=x.tags.join('、');els.desc.textContent=x.desc;els.source.href=x.source||'#';modal.showModal();}
   grid.appendChild(d);
 })
}
search.oninput=render; category.onchange=render; render();
