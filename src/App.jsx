import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DIMENSIONS, lensDictionary, shots } from './data/shots';
import './App.css';

const FILTER_KEYS = ['narrative', 'shotSize', 'angle', 'motion', 'sceneType'];

function StoryboardLibrary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState(
    FILTER_KEYS.reduce((acc, key) => {
      const param = searchParams.get(key);
      acc[key] = param ? param.split(',').filter(Boolean) : [];
      return acc;
    }, {})
  );

  const filteredShots = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return shots.filter((shot) => {
      const passKeyword =
        !q ||
        [shot.name, shot.purpose, shot.tags.join(' ')].join(' ').toLowerCase().includes(q);

      const passFilters = FILTER_KEYS.every((key) => {
        if (!filters[key].length) return true;
        return filters[key].includes(shot[key]);
      });

      return passKeyword && passFilters;
    });
  }, [keyword, filters]);

  const shotFromQuery = searchParams.get('shot');
  const activeId = routeId || shotFromQuery || filteredShots[0]?.id || shots[0].id;
  const currentShot = filteredShots.find((s) => s.id === activeId) || shots.find((s) => s.id === activeId) || shots[0];

  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('q', keyword.trim());

    FILTER_KEYS.forEach((key) => {
      if (filters[key].length) params.set(key, filters[key].join(','));
    });

    if (!routeId && currentShot?.id) params.set('shot', currentShot.id);
    setSearchParams(params, { replace: true });
  }, [keyword, filters, currentShot?.id, routeId, setSearchParams]);

  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const has = prev[key].includes(value);
      const next = has ? prev[key].filter((v) => v !== value) : [...prev[key], value];
      return { ...prev, [key]: next };
    });
  };

  const selectShot = (id) => {
    if (routeId) {
      navigate(`/shot/${id}`);
      return;
    }
    const params = new URLSearchParams(searchParams);
    params.set('shot', id);
    setSearchParams(params, { replace: false });
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>分镜库</h1>
        <p className="muted">多维筛选 + 当前分镜即时预览</p>

        <label className="label">关键词搜索</label>
        <input
          className="searchInput"
          placeholder="搜索名称 / 用途 / 标签"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        {FILTER_KEYS.map((key) => (
          <section className="filterBlock" key={key}>
            <h3>{key === 'shotSize' ? '景别' : key === 'sceneType' ? '场景类型' : key === 'narrative' ? '叙事功能' : key === 'angle' ? '机位' : '运动'}</h3>
            <div className="chipGrid">
              {DIMENSIONS[key].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`chip ${filters[key].includes(item) ? 'active' : ''}`}
                  onClick={() => toggleFilter(key, item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        ))}

        <section className="listBlock">
          <div className="listHead">结果 {filteredShots.length}</div>
          <ul className="shotList">
            {filteredShots.map((shot) => (
              <li key={shot.id}>
                <button className={`shotBtn ${currentShot?.id === shot.id ? 'current' : ''}`} onClick={() => selectShot(shot.id)}>
                  <span>{shot.name}</span>
                  <small>{shot.narrative} / {shot.shotSize} / {shot.motion}</small>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </aside>

      <main className="detail">
        <div className="heroWrap">
          <img src={currentShot.image} alt={currentShot.name} className="hero" />
        </div>
        <h2>{currentShot.name}</h2>
        <p><strong>用途说明：</strong>{currentShot.purpose}</p>
        <p><strong>推荐时长/节奏：</strong>{currentShot.durationPace}</p>
        <p><strong>常见误用提示：</strong>{currentShot.misuseTips}</p>
        <div>
          <strong>镜头语言要点：</strong>
          <ul>
            {currentShot.languagePoints.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </div>

        <details className="dictionary" open>
          <summary>镜头语法字典（可折叠）</summary>
          <ul>
            {lensDictionary.map((item) => (
              <li key={item.term}><strong>{item.term}：</strong>{item.meaning}</li>
            ))}
          </ul>
        </details>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/storyboard-site">
      <Routes>
        <Route path="/" element={<StoryboardLibrary />} />
        <Route path="/shot/:id" element={<StoryboardLibrary />} />
      </Routes>
    </BrowserRouter>
  );
}
