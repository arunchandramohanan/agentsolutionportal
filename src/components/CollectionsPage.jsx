import { useData } from '../DataContext';
import { Topbar } from './Topbar';
import { Placeholder } from './Placeholder';
import { SolutionCard } from './SolutionCard';
import { ChevronRight } from './Icons';

export function CollectionsPage({ onOpenSolution, onOpenSubmit, onNav, onOpenCollection }) {
  const { solutions, collections, loading } = useData();
  if (loading) return <div className="sp-app"><div className="cat-scroll" style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',opacity:0.5}}>Loading...</div></div>;
  return (
    <div className="sp-app">
      <Topbar active="collections" onNav={onNav} onSubmit={onOpenSubmit} />
      <div className="cat-scroll">
        <div className="col-header">
          <div className="col-header-inner">
            <div className="sp-tag sp-tag-mono" style={{marginBottom: 16}}>EDITORIAL · CURATED BY PRACTICE LEADS</div>
            <h1>Collections</h1>
            <p>Hand-picked bundles of solutions, framed around real business problems. Use these to open a conversation with a prospect — each collection includes a curator's pitch and the supporting solutions.</p>
          </div>
        </div>
        <div className="col-grid">
          <div className="col-grid-inner">
            {collections.map(c => {
              const sols = c.solutionIds.map(id => solutions.find(s => s.id === id)).filter(Boolean);
              return (
                <div key={c.id} className="col-card" onClick={() => onOpenCollection?.(c.id)}>
                  <div className="col-card-media">
                    <Placeholder tone={c.tone} label={c.label} imageUrl={c.imageUrl} />
                    <div className="col-card-count">{sols.length} solutions</div>
                  </div>
                  <div className="col-card-body">
                    <div className="col-card-tags">
                      {c.tags.map(t => <span key={t} className="sp-tag sp-tag-industry">{t}</span>)}
                    </div>
                    <h2>{c.title}</h2>
                    <p>{c.pitch}</p>
                    <div className="col-card-foot">
                      <div className="col-card-curator">
                        <div className="sp-avatar" style={{width: 26, height: 26, fontSize: 10}}>
                          {c.curator.name.split(' ').map(x => x[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="col-card-curator-n">{c.curator.name}</div>
                          <div className="col-card-curator-r">{c.curator.role}</div>
                        </div>
                      </div>
                      <span className="col-card-arrow"><ChevronRight /></span>
                    </div>
                    <div className="col-card-thumbs">
                      {sols.slice(0, 4).map(s => (
                        <div key={s.id} className="col-card-thumb" title={s.title}>
                          <Placeholder tone={s.placeholderTone} label="" imageUrl={s.imageUrl} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CollectionDetail({ collectionId, onBack, onOpenSolution, onOpenSubmit, onNav }) {
  const { solutions, collections, loading } = useData();
  if (loading) return <div className="sp-app"><div className="cat-scroll" style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',opacity:0.5}}>Loading...</div></div>;
  const c = collections.find(x => x.id === collectionId) || collections[0];
  const sols = c.solutionIds.map(id => solutions.find(s => s.id === id)).filter(Boolean);
  return (
    <div className="sp-app">
      <Topbar active="collections" onNav={onNav} onSubmit={onOpenSubmit} />
      <div className="cat-scroll">
        <div className="det-crumb">
          <a onClick={onBack}>Collections</a>
          <ChevronRight />
          <span>{c.title}</span>
        </div>
        <div className="col-detail-hero">
          <div className="col-detail-hero-inner">
            <div className="col-detail-hero-meta">
              {c.tags.map(t => <span key={t} className="sp-tag sp-tag-industry">{t}</span>)}
              <span className="det-hero-type">{sols.length} solutions</span>
            </div>
            <h1>{c.title}</h1>
            <p>{c.pitch}</p>
            <div className="col-detail-curator">
              <div className="sp-avatar" style={{width: 36, height: 36, fontSize: 12}}>
                {c.curator.name.split(' ').map(x => x[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div className="col-detail-curator-n">Curated by {c.curator.name}</div>
                <div className="col-detail-curator-r">{c.curator.role}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-detail-body">
          <div className="sp-section-h">
            <h2>Solutions in this collection</h2>
            <span className="sub">Click any to view details</span>
          </div>
          <div className="cat-grid cat-grid--grid">
            {sols.map(s => (
              <SolutionCard key={s.id} solution={s} layout="grid" style="standard" onClick={() => onOpenSolution?.(s.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function IndustriesPage({ onOpenSolution, onOpenSubmit, onNav }) {
  const { solutions, industries, loading } = useData();
  if (loading) return <div className="sp-app"><div className="cat-scroll" style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',opacity:0.5}}>Loading...</div></div>;
  return (
    <div className="sp-app">
      <Topbar active="industries" onNav={onNav} onSubmit={onOpenSubmit} />
      <div className="cat-scroll">
        <div className="col-header">
          <div className="col-header-inner">
            <div className="sp-tag sp-tag-mono" style={{marginBottom: 16}}>BROWSE BY VERTICAL</div>
            <h1>Industries</h1>
            <p>Jump straight into the solutions relevant to a specific industry vertical.</p>
          </div>
        </div>
        <div className="ind-grid">
          <div className="ind-grid-inner">
            {industries.map(i => {
              const sols = solutions.filter(s => s.industries.includes(i.id));
              return (
                <div key={i.id} className="ind-card">
                  <div className="ind-card-h">
                    <h2>{i.id}</h2>
                    <span className="ind-card-count">{sols.length}</span>
                  </div>
                  <div className="ind-card-list">
                    {sols.slice(0, 4).map(s => (
                      <div key={s.id} className="ind-card-item" onClick={() => onOpenSolution?.(s.id)}>
                        <div className="ind-card-thumb">
                          <Placeholder tone={s.placeholderTone} label="" imageUrl={s.imageUrl} />
                        </div>
                        <div>
                          <div className="ind-card-item-t">{s.title}</div>
                          <div className="ind-card-item-d">{s.tagline}</div>
                        </div>
                        <ChevronRight />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
