import { useMemo, useState } from 'react';
import { shotLibrary, COMPOSITIONS, CAMERA_POSITIONS, CAMERA_MOVEMENTS } from './data/shotLibrary';
import './App.css';

const FILTERS = {
  composition: COMPOSITIONS,
  cameraPosition: CAMERA_POSITIONS,
  cameraMovement: CAMERA_MOVEMENTS,
};

export default function App() {
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState({
    composition: '',
    cameraPosition: '',
    cameraMovement: '',
  });
  const [activeId, setActiveId] = useState(shotLibrary[0]?.id);

  const filteredShots = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return shotLibrary.filter((shot) => {
      const passKeyword =
        !q ||
        [shot.shotName, shot.composition, shot.cameraPosition, shot.cameraMovement, shot.usage]
          .join(' ')
          .toLowerCase()
          .includes(q);

      const passFilter =
        (!filters.composition || shot.composition === filters.composition) &&
        (!filters.cameraPosition || shot.cameraPosition === filters.cameraPosition) &&
        (!filters.cameraMovement || shot.cameraMovement === filters.cameraMovement);

      return passKeyword && passFilter;
    });
  }, [keyword, filters]);

  const currentShot =
    filteredShots.find((item) => item.id === activeId) ||
    shotLibrary.find((item) => item.id === activeId) ||
    filteredShots[0] ||
    shotLibrary[0];

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>教学分镜库</h1>

        <label>关键词搜索</label>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索分镜名称/构图/机位/运镜"
        />

        <label>构图名称</label>
        <select
          value={filters.composition}
          onChange={(e) => setFilters((prev) => ({ ...prev, composition: e.target.value }))}
        >
          <option value="">全部构图</option>
          {FILTERS.composition.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <label>摄像机位置</label>
        <select
          value={filters.cameraPosition}
          onChange={(e) => setFilters((prev) => ({ ...prev, cameraPosition: e.target.value }))}
        >
          <option value="">全部机位</option>
          {FILTERS.cameraPosition.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <label>摄像机动作</label>
        <select
          value={filters.cameraMovement}
          onChange={(e) => setFilters((prev) => ({ ...prev, cameraMovement: e.target.value }))}
        >
          <option value="">全部运镜</option>
          {FILTERS.cameraMovement.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <p className="count">结果：{filteredShots.length} / {shotLibrary.length}</p>

        <ul className="shotList">
          {filteredShots.map((shot) => (
            <li key={shot.id}>
              <button
                type="button"
                className={shot.id === currentShot.id ? 'active' : ''}
                onClick={() => setActiveId(shot.id)}
              >
                <strong>{shot.shotName}</strong>
                <span>{shot.composition} · {shot.cameraPosition} · {shot.cameraMovement}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="detail">
        <h2>{currentShot.shotName}</h2>
        <div className="detailGrid">
          <p><strong>构图名称：</strong>{currentShot.composition}</p>
          <p><strong>摄像机位置：</strong>{currentShot.cameraPosition}</p>
          <p><strong>摄像机动作：</strong>{currentShot.cameraMovement}</p>
          <p><strong>配图路径：</strong>{currentShot.image}</p>
        </div>
        <p><strong>用途说明：</strong>{currentShot.usage}</p>
        <img src={currentShot.image} alt={currentShot.shotName} className="preview" />
      </main>
    </div>
  );
}
