import { useState } from 'react';
import { api } from '../api';
import { Topbar } from './Topbar';
import { Placeholder } from './Placeholder';
import { CheckIcon, ChevronRight, PlusIcon } from './Icons';

export function SubmitPage({ onCancel, onComplete, onNav, onSubmit }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    tagline: '',
    description: '',
    industries: [],
    stack: '',
    type: 'Accelerator',
    repo: '',
    demo: '',
  });

  const update = (k, v) => setForm({ ...form, [k]: v });
  const toggleIndustry = (v) => {
    const has = form.industries.includes(v);
    update('industries', has ? form.industries.filter(x => x !== v) : [...form.industries, v]);
  };

  const steps = [
    { n: 1, t: 'Basics', d: 'Title, tagline, description' },
    { n: 2, t: 'Classification', d: 'Industry, type, stack' },
    { n: 3, t: 'Resources', d: 'Repo, demo, hero image' },
    { n: 4, t: 'Review', d: 'Confirm and submit' },
  ];

  return (
    <div className="sp-app">
      <Topbar active="catalog" onNav={onNav} onSubmit={onSubmit} />

      <div className="cat-scroll">
        <div className="sub-wrap">
          <div className="sub-header">
            <button className="sp-btn sp-btn-ghost sp-btn-sm" onClick={onCancel}>← Back to catalog</button>
            <h1>Submit a solution</h1>
            <p>Showcase what your team built. Submissions are reviewed by the practice lead within 3 business days.</p>
          </div>

          <div className="sub-grid">
            <aside className="sub-steps">
              {steps.map(s => (
                <div key={s.n} className={`sub-step ${step === s.n ? 'active' : ''} ${step > s.n ? 'done' : ''}`}>
                  <div className="sub-step-num">{step > s.n ? <CheckIcon /> : s.n}</div>
                  <div>
                    <div className="sub-step-t">{s.t}</div>
                    <div className="sub-step-d">{s.d}</div>
                  </div>
                </div>
              ))}
            </aside>

            <div className="sub-form">
              {step === 1 && (
                <>
                  <h2>Tell us the basics</h2>
                  <p className="sub-form-sub">A clear title and tagline help prospects find your solution.</p>
                  <Field label="Solution title" hint="Up to 40 characters">
                    <input
                      className="sub-input"
                      value={form.title}
                      onChange={e => update('title', e.target.value)}
                      placeholder="e.g. FraudShield AI"
                    />
                  </Field>
                  <Field label="One-line tagline" hint="Plain language, no buzzwords">
                    <input
                      className="sub-input"
                      value={form.tagline}
                      onChange={e => update('tagline', e.target.value)}
                      placeholder="e.g. Real-time transaction fraud detection for retail banking"
                    />
                  </Field>
                  <Field label="Description" hint="2–4 sentences. What does it do, and what's novel?">
                    <textarea
                      className="sub-input sub-textarea"
                      value={form.description}
                      onChange={e => update('description', e.target.value)}
                      placeholder="Describe the problem, your approach, and any measurable outcomes from production usage."
                      rows={5}
                    />
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <h2>Classify your solution</h2>
                  <p className="sub-form-sub">This drives where it appears in the catalog and which prospects discover it.</p>
                  <Field label="Industries served" hint="Pick all that apply">
                    <div className="sub-chip-group">
                      {['BFSI', 'Insurance', 'Healthcare', 'Retail', 'CPG', 'Telecom', 'Manufacturing', 'Energy', 'Logistics', 'Cross-industry'].map(i => (
                        <button
                          key={i}
                          className={`sp-chip ${form.industries.includes(i) ? 'active' : ''}`}
                          onClick={() => toggleIndustry(i)}
                          type="button"
                        >
                          {form.industries.includes(i) && <CheckIcon />}
                          {i}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Solution type">
                    <div className="sub-radio-group">
                      {[
                        { v: 'Accelerator', d: 'Reusable framework or kit that speeds delivery' },
                        { v: 'Solution', d: 'Complete product targeting a specific business problem' },
                        { v: 'Platform', d: 'Foundational system that hosts other solutions' },
                        { v: 'POC', d: 'Proof of concept demonstrating feasibility' },
                      ].map(opt => (
                        <label key={opt.v} className={`sub-radio ${form.type === opt.v ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            checked={form.type === opt.v}
                            onChange={() => update('type', opt.v)}
                          />
                          <span className="sub-radio-mark"></span>
                          <div>
                            <div className="sub-radio-t">{opt.v}</div>
                            <div className="sub-radio-d">{opt.d}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </Field>
                  <Field label="Tech stack" hint="Comma-separated, primary technologies first">
                    <input
                      className="sub-input"
                      value={form.stack}
                      onChange={e => update('stack', e.target.value)}
                      placeholder="e.g. Python, Kafka, TensorFlow, Snowflake"
                    />
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <h2>Add resources</h2>
                  <p className="sub-form-sub">Optional but strongly recommended — a hero image and demo dramatically improve discovery.</p>
                  <Field label="Hero image" hint="PNG or JPG, 1600×900 recommended">
                    <div className="sub-upload">
                      <Placeholder tone="default" label="hero_image.png" />
                      <div className="sub-upload-actions">
                        <button className="sp-btn sp-btn-sm">Upload image</button>
                        <span>or drag a file here</span>
                      </div>
                    </div>
                  </Field>
                  <Field label="Repository URL" hint="GitHub, GitLab, or internal Git">
                    <input
                      className="sub-input"
                      value={form.repo}
                      onChange={e => update('repo', e.target.value)}
                      placeholder="https://github.com/virtusa/..."
                    />
                  </Field>
                  <Field label="Live demo URL" hint="Sandbox or hosted prospect demo">
                    <input
                      className="sub-input"
                      value={form.demo}
                      onChange={e => update('demo', e.target.value)}
                      placeholder="https://demo.virtusa.internal/..."
                    />
                  </Field>
                </>
              )}

              {step === 4 && (
                <>
                  <h2>Review your submission</h2>
                  <p className="sub-form-sub">Confirm the details. You'll be able to edit after approval.</p>
                  <div className="sub-review">
                    <ReviewRow k="Title" v={form.title || '—'} />
                    <ReviewRow k="Tagline" v={form.tagline || '—'} />
                    <ReviewRow k="Description" v={form.description || '—'} multiline />
                    <ReviewRow k="Industries" v={form.industries.join(', ') || '—'} />
                    <ReviewRow k="Type" v={form.type} />
                    <ReviewRow k="Stack" v={form.stack || '—'} />
                    <ReviewRow k="Repository" v={form.repo || '—'} mono />
                    <ReviewRow k="Demo" v={form.demo || '—'} mono />
                  </div>
                  <div className="sub-confirm">
                    <span className="cat-fc-box checked"><CheckIcon /></span>
                    <div>
                      <strong>I confirm this submission complies with internal review policy</strong>
                      <p>No client-confidential code or data. Reusable assets and reference architectures only.</p>
                    </div>
                  </div>
                </>
              )}

              <div className="sub-foot">
                {step > 1 ? (
                  <button className="sp-btn" onClick={() => setStep(step - 1)}>← Previous</button>
                ) : <span />}
                {step < 4 ? (
                  <button className="sp-btn sp-btn-primary" onClick={() => setStep(step + 1)}>
                    Continue <ChevronRight />
                  </button>
                ) : (
                  <button className="sp-btn sp-btn-accent" onClick={() => {
                    api.submitSolution(form).then(() => onComplete()).catch(() => {});
                  }}>
                    Submit for review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="sub-field">
      <div className="sub-field-h">
        <label>{label}</label>
        {hint && <span className="sub-field-hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ReviewRow({ k, v, mono, multiline }) {
  return (
    <div className={`sub-review-row ${multiline ? 'multi' : ''}`}>
      <div className="sub-review-k">{k}</div>
      <div className={`sub-review-v ${mono ? 'mono' : ''}`}>{v}</div>
    </div>
  );
}
