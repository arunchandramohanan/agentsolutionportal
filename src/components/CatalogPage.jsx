import { useState, useMemo } from 'react';
import { useData } from '../DataContext';
import { Topbar } from './Topbar';
import { Placeholder } from './Placeholder';
import { SolutionCard } from './SolutionCard';
import { ChevronRight, ChevronDown, CheckIcon, CloseIcon, PlusIcon } from './Icons';

export function CatalogPage({ layout = 'grid', cardStyle = 'standard', mode = 'home', onOpenSolution, onOpenSubmit, onNav }) {
  const { solutions: SOLUTIONS, industries: INDUSTRIES, stacks: STACKS, featured: featuredSolutions, loading } = useData();
  const [query, setQuery] = useState('');
  const [selIndustries, setSelIndustries] = useState([]);
  const [selStacks, setSelStacks] = useState([]);
  const [selTypes, setSelTypes] = useState([]);
  const [sort, setSort] = useState('Recommended');
  const [featuredIdx, setFeaturedIdx] = useState(0);

  const featured = featuredSolutions;

  const toggleArr = (arr, setter, val) => {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const filtered = useMemo(() => {
    let out = SOLUTIONS;
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.stack.some(t => t.toLowerCase().includes(q)) ||
        s.industries.some(i => i.toLowerCase().includes(q))
      );
    }
    if (selIndustries.length) out = out.filter(s => s.industries.some(i => selIndustries.includes(i)));
    if (selStacks.length) out = out.filter(s => s.stack.some(t => selStacks.includes(t)));
    if (selTypes.length) out = out.filter(s => selTypes.includes(s.type));
    return out;
  }, [SOLUTIONS, query, selIndustries, selStacks, selTypes]);

  const totalActive = selIndustries.length + selStacks.length + selTypes.length;

  if (loading) return <div className="sp-app"><div className="cat-scroll" style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',opacity:0.5}}>Loading...</div></div>;

  return (
    <div className="sp-app">
      <Topbar
        active={mode}
        query={query}
        setQuery={setQuery}
        onNav={onNav}
        onSubmit={onOpenSubmit}
      />

      <div className="cat-scroll">
        {mode === 'home' && featured.length > 0 && <>
        <div className="cat-hero">
          <div className="cat-hero-inner">
            <div className="cat-hero-meta">
              <span className="sp-tag sp-tag-mono">FEATURED · WEEK 18</span>
            </div>
            <div className="cat-hero-grid">
              <div className="cat-hero-main">
                <Placeholder
                  tone={featured[featuredIdx].placeholderTone}
                  label={featured[featuredIdx].placeholderLabel}
                  imageUrl={featured[featuredIdx].imageUrl}
                  height="100%"
                />
                <div className="cat-hero-overlay">
                  <div className="cat-hero-eyebrow">
                    <span className="sp-tag sp-tag-industry" style={{background: 'oklch(1 0 0 / 0.15)', color: 'white', backdropFilter: 'blur(6px)'}}>
                      {featured[featuredIdx].industry}
                    </span>
                    <span className="cat-hero-type">{featured[featuredIdx].type}</span>
                  </div>
                  <h1>{featured[featuredIdx].title}</h1>
                  <p>{featured[featuredIdx].tagline}</p>
                  <div className="cat-hero-actions">
                    <button className="sp-btn sp-btn-accent" onClick={() => onOpenSolution?.(featured[featuredIdx].id)}>
                      Explore solution <ChevronRight />
                    </button>
                    <button className="sp-btn" style={{background: 'oklch(1 0 0 / 0.12)', color: 'white', borderColor: 'oklch(1 0 0 / 0.2)'}}>
                      Request demo
                    </button>
                  </div>
                </div>
                <div className="cat-hero-dots">
                  {featured.map((_, i) => (
                    <button
                      key={i}
                      className={`cat-hero-dot ${i === featuredIdx ? 'active' : ''}`}
                      onClick={() => setFeaturedIdx(i)}
                    />
                  ))}
                </div>
              </div>
              <div className="cat-hero-side">
                {featured.map((s, i) => (
                  <div
                    key={s.id}
                    className={`cat-hero-side-item ${i === featuredIdx ? 'active' : ''}`}
                    onClick={() => setFeaturedIdx(i)}
                  >
                    <div className="cat-hero-side-num">{String(i + 1).padStart(2, '0')}</div>
                    <div className="cat-hero-side-meta">
                      <div className="cat-hero-side-title">{s.title}</div>
                      <div className="cat-hero-side-sub">{s.industry} · {s.type}</div>
                    </div>
                  </div>
                ))}
                <div className="cat-hero-side-stat">
                  <div>
                    <div className="cat-hero-stat-num">247</div>
                    <div className="cat-hero-stat-lbl">Solutions in catalog</div>
                  </div>
                  <div>
                    <div className="cat-hero-stat-num">38</div>
                    <div className="cat-hero-stat-lbl">Engineering teams</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cat-strip">
          <div className="cat-strip-inner">
            <div className="sp-section-h">
              <h2>Curated for Banking & Insurance</h2>
              <span className="sub">Hand-picked by our BFSI practice leads</span>
              <span className="sub-link">View collection →</span>
            </div>
            <div className="cat-strip-rail">
              {SOLUTIONS.filter(s => s.industries.includes('BFSI') || s.industries.includes('Insurance')).slice(0, 5).map(s => (
                <div key={s.id} className="cat-pick" onClick={() => onOpenSolution?.(s.id)}>
                  <div className="cat-pick-media">
                    <Placeholder tone={s.placeholderTone} label={s.placeholderLabel} imageUrl={s.imageUrl} />
                  </div>
                  <div className="cat-pick-body">
                    <div className="cat-pick-meta">
                      <span className="sp-tag sp-tag-industry">{s.industry}</span>
                      <span className="cat-pick-type">{s.type}</span>
                    </div>
                    <h4>{s.title}</h4>
                    <p>{s.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </>}

        {mode === 'catalog' && <div className="cat-main">
          <aside className="cat-side">
            <div className="cat-side-block">
              <div className="cat-side-h">
                <span>Filters</span>
                {totalActive > 0 && (
                  <button className="cat-side-clear" onClick={() => { setSelIndustries([]); setSelStacks([]); setSelTypes([]); }}>
                    Clear all ({totalActive})
                  </button>
                )}
              </div>
            </div>

            <FilterGroup title="Industry vertical">
              {INDUSTRIES.map(item => (
                <FilterCheck
                  key={item.id}
                  label={item.id}
                  count={item.count}
                  checked={selIndustries.includes(item.id)}
                  onChange={() => toggleArr(selIndustries, setSelIndustries, item.id)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Technology / stack">
              {STACKS.map(item => (
                <FilterCheck
                  key={item.id}
                  label={item.id}
                  count={item.count}
                  checked={selStacks.includes(item.id)}
                  onChange={() => toggleArr(selStacks, setSelStacks, item.id)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Solution type">
              {['Accelerator', 'Solution', 'Platform', 'POC'].map(t => (
                <FilterCheck
                  key={t}
                  label={t}
                  count={SOLUTIONS.filter(s => s.type === t).length}
                  checked={selTypes.includes(t)}
                  onChange={() => toggleArr(selTypes, setSelTypes, t)}
                />
              ))}
            </FilterGroup>

            <div className="cat-side-cta">
              <div className="cat-side-cta-h">Built something?</div>
              <p>Submit your team's solution for review and inclusion in the catalog.</p>
              <button className="sp-btn sp-btn-sm" onClick={onOpenSubmit}>
                <PlusIcon /> Submit a solution
              </button>
            </div>
          </aside>

          <div className="cat-results">
            <div className="cat-results-h">
              <div>
                <h2>All solutions</h2>
                <span className="cat-results-count">
                  Browse the complete catalog. Showing <strong>{filtered.length}</strong> of {SOLUTIONS.length}
                </span>
              </div>
              <div className="cat-results-controls">
                <div className="cat-sort">
                  <span>Sort</span>
                  <button className="cat-sort-btn">
                    {sort} <ChevronDown />
                  </button>
                </div>
              </div>
            </div>

            {totalActive > 0 && (
              <div className="cat-active-chips">
                {selIndustries.map(v => (
                  <ActiveChip key={`i-${v}`} label={v} onRemove={() => toggleArr(selIndustries, setSelIndustries, v)} />
                ))}
                {selStacks.map(v => (
                  <ActiveChip key={`s-${v}`} label={v} onRemove={() => toggleArr(selStacks, setSelStacks, v)} />
                ))}
                {selTypes.map(v => (
                  <ActiveChip key={`t-${v}`} label={v} onRemove={() => toggleArr(selTypes, setSelTypes, v)} />
                ))}
              </div>
            )}

            <div className={`cat-grid cat-grid--${layout} cat-grid--style-${cardStyle}`}>
              {filtered.map(s => (
                <SolutionCard
                  key={s.id}
                  solution={s}
                  layout={layout}
                  style={cardStyle}
                  onClick={() => onOpenSolution?.(s.id)}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="cat-empty">
                <div className="cat-empty-mark">∅</div>
                <h3>No solutions match these filters</h3>
                <p>Try removing a filter or adjusting your search.</p>
              </div>
            )}
          </div>
        </div>}

        {mode === 'home' && (
          <div className="home-browse-cta">
            <div className="home-browse-cta-inner">
              <div>
                <h2>Browse the full catalog</h2>
                <p>{SOLUTIONS.length} solutions across BFSI, Healthcare, Retail, Telco, and more.</p>
              </div>
              <button className="sp-btn" onClick={() => onNav?.('catalog')}>
                Open catalog →
              </button>
            </div>
          </div>
        )}

        <div className="cat-foot">
          <span>Solutions Portal · Virtusa Engineering</span>
          <span>v2.4.1 · 247 solutions · Last sync 12 min ago</span>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`cat-fg ${open ? 'open' : ''}`}>
      <button className="cat-fg-h" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <ChevronDown />
      </button>
      {open && <div className="cat-fg-body">{children}</div>}
    </div>
  );
}

function FilterCheck({ label, count, checked, onChange }) {
  return (
    <label className="cat-fc">
      <span className={`cat-fc-box ${checked ? 'checked' : ''}`}>
        {checked && <CheckIcon />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} style={{display: 'none'}} />
      <span className="cat-fc-label">{label}</span>
      <span className="cat-fc-count">{count}</span>
    </label>
  );
}

function ActiveChip({ label, onRemove }) {
  return (
    <span className="cat-active-chip">
      {label}
      <button onClick={onRemove}><CloseIcon /></button>
    </span>
  );
}
