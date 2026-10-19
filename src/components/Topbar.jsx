import { SearchIcon, PlusIcon } from './Icons';

export function Topbar({ active = 'home', onNav, query, setQuery, onSubmit }) {
  return (
    <div className="sp-topbar">
      <div className="sp-brand" onClick={() => onNav?.('home')} style={{cursor: 'pointer'}}>
        <div className="sp-brand-mark"></div>
        <div className="sp-brand-name">Solutions</div>
        <div className="sp-brand-sub">Virtusa Engineering</div>
      </div>
      <nav className="sp-nav">
        <a className={active === 'home' ? 'active' : ''} onClick={() => onNav?.('home')}>Home</a>
        <a className={active === 'catalog' ? 'active' : ''} onClick={() => onNav?.('catalog')}>Catalog</a>
        <a className={active === 'collections' ? 'active' : ''} onClick={() => onNav?.('collections')}>Collections</a>
        <a className={active === 'industries' ? 'active' : ''} onClick={() => onNav?.('industries')}>Industries</a>
      </nav>
      <div className="sp-topbar-spacer"></div>
      {setQuery && (
        <div className="sp-search">
          <SearchIcon />
          <input
            placeholder="Search 247 solutions, stacks, industries…"
            value={query || ''}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="sp-search-kbd">⌘K</span>
        </div>
      )}
      <div className="sp-topbar-actions">
        <button className="sp-btn sp-btn-sm" onClick={onSubmit}>
          <PlusIcon /> Submit solution
        </button>
        <div className="sp-avatar">PS</div>
      </div>
    </div>
  );
}
