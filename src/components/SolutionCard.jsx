import { Placeholder } from './Placeholder';
import { ChevronRight } from './Icons';

export function SolutionCard({ solution, layout = 'grid', style: styleVariant = 'standard', onClick }) {
  if (layout === 'list') return <SolutionRow solution={solution} onClick={onClick} />;
  if (layout === 'compact') return <SolutionCompact solution={solution} onClick={onClick} />;
  if (styleVariant === 'flat') return <SolutionCardFlat solution={solution} onClick={onClick} />;
  if (styleVariant === 'editorial') return <SolutionCardEditorial solution={solution} onClick={onClick} />;
  return <SolutionCardStandard solution={solution} onClick={onClick} />;
}

function SolutionCardStandard({ solution, onClick }) {
  const s = solution;
  return (
    <div className="sc sc-std" onClick={onClick}>
      <div className="sc-std-media">
        <Placeholder tone={s.placeholderTone} label={s.placeholderLabel} imageUrl={s.imageUrl} />
      </div>
      <div className="sc-std-body">
        <div className="sc-std-row1">
          <span className="sp-tag sp-tag-industry">{s.industry}</span>
          <span className="sc-std-status">
            <span className={`sp-status-dot sp-status-dot--${s.status}`}></span>
            {s.status === 'live' ? 'Live' : 'Beta'}
          </span>
        </div>
        <h3 className="sc-std-title">{s.title}</h3>
        <p className="sc-std-desc">{s.tagline}</p>
        <div className="sc-std-stack">
          {s.stack.slice(0, 3).map(t => (
            <span key={t} className="sp-tag sp-tag-mono">{t}</span>
          ))}
          {s.stack.length > 3 && <span className="sp-tag sp-tag-mono">+{s.stack.length - 3}</span>}
        </div>
      </div>
    </div>
  );
}

function SolutionCardFlat({ solution, onClick }) {
  const s = solution;
  return (
    <div className="sc sc-flat" onClick={onClick}>
      <div className="sc-flat-media">
        <Placeholder tone={s.placeholderTone} label={s.placeholderLabel} imageUrl={s.imageUrl} />
        <div className="sc-flat-pill">
          <span className={`sp-status-dot sp-status-dot--${s.status}`}></span>
          {s.industry}
        </div>
      </div>
      <h3 className="sc-flat-title">{s.title}</h3>
      <p className="sc-flat-desc">{s.tagline}</p>
      <div className="sc-flat-stack">
        {s.stack.slice(0, 4).map(t => (
          <span key={t} className="sc-flat-stack-item">{t}</span>
        ))}
      </div>
    </div>
  );
}

function SolutionCardEditorial({ solution, onClick }) {
  const s = solution;
  return (
    <div className="sc sc-edi" onClick={onClick}>
      <div className="sc-edi-media">
        <Placeholder tone={s.placeholderTone} label={s.placeholderLabel} imageUrl={s.imageUrl} />
      </div>
      <div className="sc-edi-meta">
        <span>{s.type}</span>
        <span>·</span>
        <span>{s.industry}</span>
      </div>
      <h3 className="sc-edi-title">{s.title}</h3>
      <p className="sc-edi-desc">{s.description.slice(0, 110)}…</p>
      <div className="sc-edi-foot">
        <span className="sc-edi-stack">{s.stack.slice(0, 3).join(' · ')}</span>
        <span className="sc-edi-arrow"><ChevronRight /></span>
      </div>
    </div>
  );
}

function SolutionRow({ solution, onClick }) {
  const s = solution;
  return (
    <div className="sc sc-row" onClick={onClick}>
      <div className="sc-row-thumb">
        <Placeholder tone={s.placeholderTone} label="" imageUrl={s.imageUrl} />
      </div>
      <div className="sc-row-main">
        <div className="sc-row-title">
          <h3>{s.title}</h3>
          <span className="sp-tag sp-tag-industry">{s.industry}</span>
          <span className="sc-row-status">
            <span className={`sp-status-dot sp-status-dot--${s.status}`}></span>
            {s.status === 'live' ? 'Live' : 'Beta'}
          </span>
        </div>
        <p className="sc-row-desc">{s.tagline}</p>
      </div>
      <div className="sc-row-stack">
        {s.stack.slice(0, 4).map(t => (
          <span key={t} className="sp-tag sp-tag-mono">{t}</span>
        ))}
      </div>
      <div className="sc-row-team">{s.team}</div>
      <div className="sc-row-arrow"><ChevronRight /></div>
    </div>
  );
}

function SolutionCompact({ solution, onClick }) {
  const s = solution;
  return (
    <div className="sc sc-cmp" onClick={onClick}>
      <div className="sc-cmp-thumb">
        <Placeholder tone={s.placeholderTone} label="" imageUrl={s.imageUrl} />
      </div>
      <div className="sc-cmp-body">
        <h3 className="sc-cmp-title">{s.title}</h3>
        <p className="sc-cmp-desc">{s.tagline}</p>
        <div className="sc-cmp-meta">
          <span className="sp-tag sp-tag-industry">{s.industry}</span>
          <span className="sp-tag sp-tag-mono">{s.stack[0]}</span>
          <span className="sc-cmp-dot">·</span>
          <span className={`sp-status-dot sp-status-dot--${s.status}`}></span>
        </div>
      </div>
    </div>
  );
}
