import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { storyboardData } from '../data'
import './Detail.css'

function Detail() {
  const { id } = useParams()
  const item = storyboardData.find(data => data.id === id)

  if (!item) {
    return (
      <div className="detail">
        <div className="not-found">
          <h2>分镜未找到</h2>
          <Link to="/" className="back-link">返回首页</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="detail">
      <Link to="/" className="back-link">← 返回首页</Link>
      
      <article className="detail-content">
        <header className="detail-header">
          <h1>{item.title}</h1>
          <div className="detail-meta">
            <span className="detail-category">{item.category}</span>
            <div className="detail-tags">
              {item.tags.map(tag => (
                <span key={tag} className="detail-tag">{tag}</span>
              ))}
            </div>
          </div>
        </header>

        <div className="detail-image-wrapper">
          <img src={item.image} alt={item.title} className="detail-image" />
        </div>

        <section className="detail-section">
          <h2>📖 适用场景/用途说明</h2>
          <p>{item.description}</p>
        </section>

        <section className="detail-section">
          <h2>🎥 镜头语言要点</h2>
          <p>{item.languagePoints}</p>
        </section>
      </article>
    </div>
  )
}

export default Detail
