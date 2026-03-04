import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { storyboardData, categories } from '../data'
import './Home.css'

function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredData = storyboardData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      item.title.includes(searchQuery) || 
      item.tags.some(tag => tag.includes(searchQuery)) ||
      item.description.includes(searchQuery)
    return matchesCategory && matchesSearch
  })

  return (
    <div className="home">
      <header className="header">
        <h1>🎬 分镜示例库</h1>
        <p>按 叙事 / 动作 / 对话 / MV / 风景 分类浏览，点击卡片查看示例与说明。</p>
      </header>

      <section className="toolbar">
        <input
          type="text"
          placeholder="搜索：如 三角构图 / 左三分之一 / 特写"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="all">全部分类</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </section>

      <main className="grid">
        {filteredData.map(item => (
          <Link to={`/shot/${item.id}`} key={item.id} className="card">
            <img src={item.image} alt={item.title} className="card-image" />
            <div className="card-meta">
              <div className="card-title">{item.title}</div>
              <div className="card-category">{item.category}</div>
              <div className="card-tags">{item.tags.join(' / ')}</div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  )
}

export default Home
