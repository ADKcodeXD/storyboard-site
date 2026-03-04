import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Detail from './pages/Detail'
import './App.css'

function App() {
  return (
    <Router basename="/storyboard-site">
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shot/:id" element={<Detail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
