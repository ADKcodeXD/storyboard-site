import { useMemo, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { filterOptions, sectionStats, sections, shots } from './data/shots'
import './App.css'

const PAGE_SIZE = 12

function HomePage() {
  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Director Storyboard System</p>
        <h1>电影分镜基础镜头手册</h1>
        <p>统一基于固定场景与固定角色，聚焦四个板块：分镜 / 景别 / 构图 / 视角。</p>
      </header>

      <section className="home-grid">
        {sectionStats.map((item) => (
          <Link key={item.id} to={`/shots?section=${item.id}`} className="home-card">
            <img src={item.cover} alt={item.title} loading="lazy" />
            <div className="mask" />
            <div className="home-card-content">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <span>{item.count} 条</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}

function FilterSidebar({ searchParams, setSearchParams }) {
  const selectedSection = searchParams.get('section') || 'all'
  const selectedShotSize = searchParams.get('shotSize') || 'all'
  const selectedComposition = searchParams.get('composition') || 'all'
  const selectedAngle = searchParams.get('angle') || 'all'
  const selectedTag = searchParams.get('tag') || 'all'
  const keyword = searchParams.get('q') || ''

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
        板块
        <select value={selectedSection} onChange={(e) => update('section', e.target.value)}>
          {filterOptions.sections.map((value) => {
            const label = value === 'all' ? '全部' : sections.find((s) => s.id === value)?.title
            return <option key={value} value={value}>{label}</option>
          })}
        </select>
      </label>

      <label>
        景别
        <select value={selectedShotSize} onChange={(e) => update('shotSize', e.target.value)}>
          {filterOptions.shotSizes.map((value) => <option key={value} value={value}>{value === 'all' ? '全部' : value}</option>)}
        </select>
      </label>

      <label>
        构图
        <select value={selectedComposition} onChange={(e) => update('composition', e.target.value)}>
          {filterOptions.compositions.map((value) => <option key={value} value={value}>{value === 'all' ? '全部' : value}</option>)}
        </select>
      </label>

      <label>
        视角
        <select value={selectedAngle} onChange={(e) => update('angle', e.target.value)}>
          {filterOptions.angles.map((value) => <option key={value} value={value}>{value === 'all' ? '全部' : value}</option>)}
        </select>
      </label>

      <label>
        标签
        <select value={selectedTag} onChange={(e) => update('tag', e.target.value)}>
          {filterOptions.tags.map((value) => <option key={value} value={value}>{value === 'all' ? '全部' : value}</option>)}
        </select>
      </label>

      <label>
        关键词
        <input value={keyword} onChange={(e) => update('q', e.target.value.trim())} placeholder="分镜名称 / 用途说明" />
      </label>
    </aside>
  )
}

function ShotListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || 1)

  const filtered = useMemo(() => {
    const section = searchParams.get('section')
    const shotSize = searchParams.get('shotSize')
    const composition = searchParams.get('composition')
    const angle = searchParams.get('angle')
    const tag = searchParams.get('tag')
    const q = (searchParams.get('q') || '').toLowerCase()

    return shots.filter((shot) => {
      if (section && shot.section !== section) return false
      if (shotSize && shot.shotSize !== shotSize) return false
      if (composition && shot.composition !== composition) return false
      if (angle && shot.angle !== angle) return false
      if (tag && !shot.tags.includes(tag)) return false
      if (
        q
        && !(shot.name.toLowerCase().includes(q)
          || shot.purpose.toLowerCase().includes(q)
          || shot.shotSize.toLowerCase().includes(q)
          || shot.composition.toLowerCase().includes(q)
          || shot.angle.toLowerCase().includes(q))
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
                  <li><strong>景别：</strong>{shot.shotSize}</li>
                  <li><strong>构图：</strong>{shot.composition}</li>
                  <li><strong>镜头视角：</strong>{shot.angle}</li>
                  <li><strong>经典语法：</strong>{shot.grammar}</li>
                  <li><strong>用途说明：</strong>{shot.purpose}</li>
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
  const shot = shots.find((item) => item.id === id)
  const [copied, setCopied] = useState(false)

  if (!shot) return <Navigate to="/shots" replace />

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(shot.prompt)
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

          <div className="detail-meta-grid">
            <p><strong>分镜名称：</strong>{shot.name}</p>
            <p><strong>景别：</strong>{shot.shotSize}</p>
            <p><strong>构图：</strong>{shot.composition}</p>
            <p><strong>镜头视角：</strong>{shot.angle}</p>
            <p><strong>经典语法：</strong>{shot.grammar}</p>
            <p><strong>用途说明：</strong>{shot.purpose}</p>
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
              <button className="copy-btn" onClick={copyPrompt}>{copied ? '已复制' : '复制 Prompt'}</button>
            </div>
            <textarea value={shot.prompt} readOnly rows={11} />
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
