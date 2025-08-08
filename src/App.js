import React, { useState, useEffect } from 'react';
import './App.css';

const TEMPLATES = [
  { title: 'Product Launch', template: 'Write a concise and persuasive product launch prompt for {product} highlighting {features} and targetting {audience}.' },
  { title: 'Social Media Hook', template: 'Create an engaging social media caption for {platform} to promote {topic} in a playful tone with hashtags.' },
  { title: 'Blog Intro', template: 'Write a compelling blog introduction about {topic} that grabs attention, establishes authority, and outlines the article.' },
  { title: 'Email Outreach', template: 'Draft a short outreach email to {recipient} introducing {offer} and requesting a meeting. Use a professional tone.' },
  { title: 'Ad Copy', template: 'Produce a short ad copy for {product} that focuses on benefit {benefit} and includes a CTA.' },
  { title: 'Creative Writing', template: 'Generate an imaginative writing prompt about {theme} that inspires vivid sensory detail and emotional stakes.' }
];

const sampleFields = {
  product: 'novel AI writing assistant',
  features: 'smart templates, tone control, and one-click export',
  audience: 'busy content creators',
  platform: 'Twitter',
  topic: 'how to write better prompts',
  recipient: 'a product manager',
  offer: 'early access to the beta',
  benefit: 'time-saving automation',
  theme: 'a moonlit carnival'
};

function fillTemplate(tmpl, fields) {
  return tmpl.replace(/\{(.*?)\}/g, (_, key) => fields[key.trim()] || key);
}

export default function App() {
  const [template, setTemplate] = useState(TEMPLATES[0].template);
  const [title, setTitle] = useState(TEMPLATES[0].title);
  const [customFields, setCustomFields] = useState(sampleFields);
  const [tone, setTone] = useState('creative');
  const [length, setLength] = useState('short');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('prompts') || '[]')
    } catch (e) { return [] }
  });

  useEffect(() => {
    localStorage.setItem('prompts', JSON.stringify(history))
  }, [history]);

  function generate() {
    let base = fillTemplate(template, customFields);
    // tweak based on tone & length
    let toneText = tone === 'creative' ? 'Make it imaginative and surprising.' : tone === 'formal' ? 'Use a formal and professional tone.' : 'Keep it casual and friendly.';
    let lenText = length === 'short' ? 'Keep it concise (1-2 sentences).' : length === 'medium' ? 'Provide 2-3 sentences with examples.' : 'Write a longer detailed prompt with examples.';
    let final = `${base} ${toneText} ${lenText}`;
    // small randomization
    if (Math.random() > .7) final += ' Add a quick example usage.';
    setResult(final);
    setHistory(h => [{ id: Date.now(), title: title, prompt: final }, ...h].slice(0, 30));
  }

  function copyResult() {
    navigator.clipboard?.writeText(result);
    alert('Prompt copied to clipboard!');
  }

  function useTemplate(t) {
    setTemplate(t.template);
    setTitle(t.title);
  }

  function updateField(key, val) {
    setCustomFields(f => ({ ...f, [key]: val }))
  }

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <div className="logo">AI</div>
          <div>
            <div className="title">AI Prompt Writer</div>
            <div className="subtitle">Sleek prompt generator — modern, fast, Framer-style</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="small">Theme</div>
        </div>
      </div>

      <main className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700 }}>Create Prompt</div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>AI-first templates</div>
        </div>

        <div className="controls">
          <select className="select" value={title} onChange={(e) => {
            const t = TEMPLATES.find(t => t.title === e.target.value);
            useTemplate(t);
          }}>
            {TEMPLATES.map(t => <option key={t.title} value={t.title}>{t.title}</option>)}
          </select>

          <select className="select" value={tone} onChange={e => setTone(e.target.value)}>
            <option value="creative">Creative</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
          </select>

          <select className="select" value={length} onChange={e => setLength(e.target.value)}>
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <textarea className="textarea" value={template} onChange={e => setTemplate(e.target.value)} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 12, marginTop: 12 }}>
          <div>
            <div className="grid-inputs">
              {Object.keys(sampleFields).slice(0, 6).map(k => (
                <input key={k} className="input" value={customFields[k] || ''} onChange={e => updateField(k, e.target.value)} placeholder={k} />
              ))}
            </div>
            <div className="grid-inputs" style={{ marginTop: 8 }}>
              {Object.keys(sampleFields).slice(6).map(k => (
                <input key={k} className="input" value={customFields[k] || ''} onChange={e => updateField(k, e.target.value)} placeholder={k} />
              ))}
            </div>
            <div className="actions">
              <button className="btn" onClick={generate}>Generate Prompt</button>
              <button className="btn transparent" onClick={() => {
                setResult('');
              }}>Clear</button>
            </div>
            {result && (
              <div className="resultCard">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700 }}>Generated Prompt</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" onClick={copyResult}>Copy</button>
                    <button className="btn transparent" onClick={() => {
                      const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = 'prompt.txt'; a.click();
                      URL.revokeObjectURL(url);
                    }}>Download</button>
                  </div>
                </div>
                <div style={{ marginTop: 10, whiteSpace: 'pre-wrap' }}>{result}</div>
              </div>
            )}
          </div>

          <aside className="sidebar">
            <div className="panel" style={{ padding: 14 }}>
              <div style={{ fontWeight: 700 }}>Templates</div>
              <div className="small" style={{ marginTop: 6 }}>Tap any template to load it</div>
              <div className="templates">
                {TEMPLATES.map(t => (
                  <div key={t.title} className="template" onClick={() => useTemplate(t)}>
                    <div style={{ fontWeight: 700 }}>{t.title}</div>
                    <div className="small" style={{ marginTop: 6 }}>{t.template}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: 12 }} />
            <div className="panel" style={{ padding: 14, marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700 }}>History</div>
                <div className="small" style={{ opacity: 0.8 }}>{history.length} saved</div>
              </div>
              <div className="history-list">
                {history.map(h => (
                  <div key={h.id} className="history-item" onClick={() => setResult(h.prompt)}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{h.title}</div>
                    <div className="small" style={{ marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.prompt}</div>
                  </div>
                ))}
                {history.length === 0 && <div className="small" style={{ marginTop: 8 }}>No saved prompts yet — generate one!</div>}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => { navigator.clipboard?.writeText(history.map(h => h.prompt).join('\n---\n')); alert('All prompts copied'); }}>Copy All</button>
                <button className="btn transparent" onClick={() => { setHistory([]); }}>Clear</button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="footer">Built with care — tweak templates, save favorites, and export prompts.</div>
    </div>
  );
}
