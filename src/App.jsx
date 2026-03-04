import { useMemo, useState } from 'react'
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { categoryStats, categories, shotSizeOptions, shots } from './data/shots'
import './App.css'

const PAGE_SIZE = 12

function HomePage() {
  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Director Storyboard System</p>
        <h1>电影分镜视觉手册</h1>
        <p>四大板块统一管理：运镜、构图、分镜、景别。点击卡片进入列表页并自动筛选。</p>
      </header>

      <section className="home-grid">
        {categoryStats.map((cat) => (
          <Link key={cat.id} to={`/shots?category=${cat.id}`} className={`home-card ${cat.color}`}>
            <img src={cat.cover} alt={cat.title} loading="lazy" />
            <div className="mask" />
            <div className="home-card-content">
              <h2>{cat.title}</h2>
              <p>{cat.description}</p>
              <span>{cat.count} 条</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}

function FilterSidebar({ searchParams, setSearchParams }) {
  const selectedCategory = searchParams.get('category') || 'all'
  const selectedType = searchParams.get('type') || 'all'
  const selectedTag = searchParams.get('tag') || 'all'
  const selectedShotSize = searchParams.get('shotSize') || 'all'
  const keyword = searchParams.get('q') || ''

  const types = ['all', ...new Set(shots.map((s) => s.type))]
  const tags = ['all', ...new Set(shots.flatMap((s) => s.tags))]

  const update = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    next.set('page', '1')
    setSearchParams(next)
  }

  return (
    <aside className="sidebar">
      <h3>筛选器</h3>
      <label>
        分类
        <select value={selectedCategory} onChange={(e) => update('category', e.target.value)}>
          <option value="all">全部</option>
          {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
        </select>
      </label>

      <label>
        类型
        <select value={selectedType} onChange={(e) => update('type', e.target.value)}>
          {types.map((type) => <option key={type} value={type}>{type === 'all' ? '全部' : type}</option>)}
        </select>
      </label>

      <label>
        标签
        <select value={selectedTag} onChange={(e) => update('tag', e.target.value)}>
          {tags.map((tag) => <option key={tag} value={tag}>{tag === 'all' ? '全部' : tag}</option>)}
        </select>
      </label>

      <label>
        景别
        <select value={selectedShotSize} onChange={(e) => update('shotSize', e.target.value)}>
          {shotSizeOptions.map((size) => <option key={size} value={size}>{size === 'all' ? '全部' : size}</option>)}
        </select>
      </label>

      <label>
        关键词
        <input value={keyword} onChange={(e) => update('q', e.target.value.trim())} placeholder="分镜名 / 描述 / 用途" />
      </label>
    </aside>
  )
}

function ShotListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || 1)

  const filtered = useMemo(() => {
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const tag = searchParams.get('tag')
    const shotSize = searchParams.get('shotSize')
    const q = (searchParams.get('q') || '').toLowerCase()

    return shots.filter((s) => {
      if (category && s.category !== category) return false
      if (type && s.type !== type) return false
      if (tag && !s.tags.includes(tag)) return false
      if (shotSize && s.shotSize !== shotSize) return false
      if (
        q
        && !(
          s.name.toLowerCase().includes(q)
          || s.purpose.toLowerCase().includes(q)
          || s.description.toLowerCase().includes(q)
          || s.composition.toLowerCase().includes(q)
        )
      ) return false
      return true
    })
  }, [searchParams])

  const totalPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(page, 1), totalPage)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const goPage = (nextPage) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(nextPage))
    setSearchParams(next)
  }

  return (
    <main className="page list-layout">
      <FilterSidebar searchParams={searchParams} setSearchParams={setSearchParams} />
      <section className="content">
        <div className="list-head">
          <Link to="/" className="back-link">← 返回首页</Link>
          <h1>分镜列表</h1>
          <p>共 {filtered.length} 条结果，当前第 {safePage}/{totalPage} 页</p>
        </div>

        <div className="shot-list">
          {pageItems.map((shot) => (
            <Link key={shot.id} to={`/shot/${shot.id}`} className="shot-item">
              <img src={shot.thumbnail} alt={shot.name} loading="lazy" />
              <div className="meta">
                <h3>{shot.name}</h3>
                <ul>
                  <li><strong>构图名称：</strong>{shot.composition}</li>
                  <li><strong>摄像机位置：</strong>{shot.cameraPosition}</li>
                  <li><strong>摄像机动作：</strong>{shot.cameraMove}</li>
                  <li><strong>景别：</strong>{shot.shotSize}</li>
                  <li><strong>描述：</strong>{shot.description}</li>
                </ul>
                <div className="tags">{shot.tags.map((t) => <span key={t}>{t}</span>)}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="pagination">
          <button disabled={safePage === 1} onClick={() => goPage(safePage - 1)}>上一页</button>
          <span>{safePage} / {totalPage}</span>
          <button disabled={safePage === totalPage} onClick={() => goPage(safePage + 1)}>下一页</button>
        </div>
      </section>
    </main>
  )
}

function ShotDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const shot = shots.find((s) => s.id === id)
  const [copied, setCopied] = useState(false)

  if (!shot) return <Navigate to="/shots" replace />

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(shot.promptTemplate)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <main className="page detail-page">
      <div className="detail-head">
        <button className="ghost-btn" onClick={() => navigate(-1)}>← 返回</button>
        <Link to="/shots" className="back-link">返回分镜列表</Link>
      </div>

      <section className="detail-grid">
        <div className="detail-image-wrap">
          <img src={shot.thumbnail} alt={shot.name} className="detail-image" />
        </div>

        <article className="detail-panel">
          <h1>{shot.name}</h1>
          <p className="detail-desc">{shot.description}</p>

          <div className="detail-meta-grid">
            <p><strong>构图：</strong>{shot.composition}</p>
            <p><strong>机位：</strong>{shot.cameraPosition}</p>
            <p><strong>运镜：</strong>{shot.cameraMove}</p>
            <p><strong>景别：</strong>{shot.shotSize}</p>
          </div>

          <section>
            <h3>推荐场景</h3>
            <ul className="recommend-list">
              {shot.recommendedScenes.map((scene) => <li key={scene}>{scene}</li>)}
            </ul>
          </section>

          <section>
            <div className="prompt-head">
              <h3>Prompt</h3>
              <button className="copy-btn" onClick={copyPrompt}>{copied ? '已复制' : '复制'}</button>
            </div>
            <textarea value={shot.promptTemplate} readOnly rows={11} />
          </section>
        </article>
      </section>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/storyboard-site">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shots" element={<ShotListPage />} />
        <Route path="/shot/:id" element={<ShotDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
