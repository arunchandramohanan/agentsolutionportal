import { useData } from '../DataContext';
import { Topbar } from './Topbar';
import { Placeholder } from './Placeholder';
import { SolutionCard } from './SolutionCard';
import { ChevronRight, ExternalIcon, GitIcon } from './Icons';

export function DetailPage({ solutionId, onBack, onOpenSolution, onNav, onSubmit }) {
  const { solutions, loading } = useData();
  if (loading) return <div className="sp-app"><div className="cat-scroll" style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',opacity:0.5}}>Loading...</div></div>;
  const s = solutions.find(x => x.id === solutionId) || solutions[0];
  const related = solutions.filter(x => x.id !== s.id && x.industries.some(i => s.industries.includes(i))).slice(0, 3);

  return (
    <div className="sp-app">
      <Topbar active="catalog" onNav={onNav} onSubmit={onSubmit} />

      <div className="cat-scroll">
        <div className="det-crumb">
          <a onClick={onBack}>Catalog</a>
          <ChevronRight />
          <a onClick={onBack}>{s.industry}</a>
          <ChevronRight />
          <span>{s.title}</span>
        </div>

        <div className="det-hero">
          <div className="det-hero-inner">
            <div className="det-hero-meta">
              <span className="sp-tag sp-tag-industry">{s.industry}</span>
              <span className="det-hero-type">{s.type}</span>
              <span className="det-hero-status">
                <span className={`sp-status-dot sp-status-dot--${s.status}`}></span>
                {s.status === 'live' ? 'Production' : 'Beta'}
              </span>
              <span className="det-hero-team">· {s.team}</span>
            </div>
            <h1 className="det-hero-title">{s.title}</h1>
            <p className="det-hero-tag">{s.tagline}</p>
            <div className="det-hero-actions">
              <button className="sp-btn sp-btn-accent">
                Request live demo <ChevronRight />
              </button>
              <button className="sp-btn">
                <ExternalIcon /> Open sandbox
              </button>
              <button className="sp-btn sp-btn-ghost">
                <GitIcon /> Repository
              </button>
              <div className="det-hero-share">
                <button className="sp-btn sp-btn-ghost sp-btn-sm">Share</button>
                <button className="sp-btn sp-btn-ghost sp-btn-sm">Bookmark</button>
              </div>
            </div>
          </div>
        </div>

        <div className="det-body">
          <div className="det-main">
            <div className="det-shot">
              <Placeholder tone={s.placeholderTone} label={s.placeholderLabel} imageUrl={s.imageUrl} />
            </div>

            <section className="det-section">
              <h2>Overview</h2>
              <p>{s.description}</p>
              <p>Deployed in three production engagements across {s.industries.join(' and ')} with measurable business impact. The accelerator includes reference architectures, deployment runbooks, and a curated test dataset to validate behavior before customer-specific tuning.</p>
            </section>

            <section className="det-section">
              <h2>Capabilities</h2>
              <div className="det-caps">
                {[
                  { t: 'Reference architecture', d: 'Cloud-agnostic blueprint with infra-as-code modules for AWS, Azure, and GCP.' },
                  { t: 'Connector library', d: 'Pre-built integrations for the most common systems in this domain.' },
                  { t: 'Compliance baseline', d: 'Audit logs, encryption, and policy controls aligned to relevant standards.' },
                  { t: 'Demo environment', d: 'Spin up an isolated sandbox in under 15 minutes for prospect walkthroughs.' },
                ].map((c, i) => (
                  <div key={i} className="det-cap">
                    <div className="det-cap-num">{String(i + 1).padStart(2, '0')}</div>
                    <div>
                      <h4>{c.t}</h4>
                      <p>{c.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="det-section">
              <h2>Architecture</h2>
              <div className="det-arch">
                <Placeholder tone="default" label="architecture_diagram.svg" />
              </div>
            </section>

            <section className="det-section">
              <h2>Outcomes</h2>
              <div className="det-stats">
                <div>
                  <div className="det-stat-num">3</div>
                  <div className="det-stat-lbl">Production deployments</div>
                </div>
                <div>
                  <div className="det-stat-num">60%</div>
                  <div className="det-stat-lbl">Faster time-to-value</div>
                </div>
                <div>
                  <div className="det-stat-num">14</div>
                  <div className="det-stat-lbl">Engineers contributing</div>
                </div>
                <div>
                  <div className="det-stat-num">v3.2</div>
                  <div className="det-stat-lbl">Latest release</div>
                </div>
              </div>
            </section>
          </div>

          <aside className="det-side">
            <div className="det-side-card">
              <div className="det-side-row">
                <span className="det-side-key">Solution type</span>
                <span className="det-side-val">{s.type}</span>
              </div>
              <div className="det-side-row">
                <span className="det-side-key">Owner</span>
                <span className="det-side-val">{s.team}</span>
              </div>
              <div className="det-side-row">
                <span className="det-side-key">Industries</span>
                <span className="det-side-val">{s.industries.join(', ')}</span>
              </div>
              <div className="det-side-row">
                <span className="det-side-key">Last updated</span>
                <span className="det-side-val">12 days ago</span>
              </div>
              <div className="det-side-row">
                <span className="det-side-key">License</span>
                <span className="det-side-val">Internal · client-deliverable</span>
              </div>
            </div>

            <div className="det-side-card">
              <div className="det-side-h">Tech stack</div>
              <div className="det-side-stack">
                {s.stack.map(t => <span key={t} className="sp-tag sp-tag-mono">{t}</span>)}
              </div>
            </div>

            <div className="det-side-card">
              <div className="det-side-h">Engagement leads</div>
              <div className="det-side-people">
                {[
                  { n: 'Priya Subramanian', r: 'Solutions architect' },
                  { n: 'Marcus Whitfield', r: 'Practice lead' },
                  { n: 'Aisha Karunaratne', r: 'Engineering manager' },
                ].map(p => (
                  <div key={p.n} className="det-side-person">
                    <div className="sp-avatar" style={{width: 28, height: 28, fontSize: 10.5}}>
                      {p.n.split(' ').map(x => x[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div className="det-side-person-n">{p.n}</div>
                      <div className="det-side-person-r">{p.r}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="det-side-card det-side-cta">
              <div className="det-side-h">Talk to a solutions architect</div>
              <p>Schedule a 30-minute walkthrough with the team behind this solution.</p>
              <button className="sp-btn sp-btn-accent" style={{width: '100%', justifyContent: 'center'}}>
                Book a session
              </button>
            </div>
          </aside>
        </div>

        <div className="det-related">
          <div className="det-related-inner">
            <div className="sp-section-h">
              <h2>Related solutions</h2>
              <span className="sub">From the same industries</span>
            </div>
            <div className="det-related-grid">
              {related.map(r => (
                <SolutionCard key={r.id} solution={r} layout="grid" style="standard" onClick={() => onOpenSolution?.(r.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
