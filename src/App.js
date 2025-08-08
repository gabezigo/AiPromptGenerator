import React, { useState, useEffect } from 'react';
import './App.css';

const TEMPLATES = [
  { title: 'Product Launch', template: 'Write a concise and persuasive product launch prompt for {product} highlighting {features} and targeting {audience}.' },
  { title: 'Social Media Hook', template: 'Create an engaging social media caption for {platform} to promote {topic} in a playful tone with hashtags.' },
  { title: 'Blog Intro', template: 'Write a compelling blog introduction about {topic} that grabs attention, establishes authority, and outlines the article.' },
  { title: 'Email Outreach', template: 'Draft a short outreach email to {recipient} introducing {offer} and requesting a meeting. Use a professional tone.' },
  { title: 'Ad Copy', template: 'Produce a short ad copy for {product} that focuses on benefit {benefit} and includes a CTA.' },
  { title: 'Creative Writing', template: 'Generate an imaginative writing prompt about {theme} that inspires vivid sensory detail and emotional stakes.' }
];

const DEFAULT_FIELDS = {
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

function fillTemplate(template, fields) {
  return template.replace(/\{(.*?)\}/g, (_, key) => fields[key.trim()] || `{${key}}`);
}

export default function App() {
  const [template, setTemplate] = useState(TEMPLATES[0].template);
  const [title, setTitle] = useState(TEMPLATES[0].title);
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [tone, setTone] = useState('creative');
  const [length, setLength] = useState('short');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('prompts') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('prompts', JSON.stringify(history));
  }, [history]);

  const generatePrompt = () => {
    const base = fillTemplate(template, fields);
    const toneText = tone === 'creative'
      ? 'Make it imaginative and surprising.'
      : tone === 'formal'
        ? 'Use a formal and professional tone.'
        : 'Keep it casual and friendly.';
    const lengthText = length === 'short'
      ? 'Keep it concise (1-2 sentences).'
      : length === 'medium'
        ? 'Provide 2-3 sentences with examples.'
        : 'Write a longer detailed prompt with examples.';
    let final = `${base} ${toneText} ${lengthText}`;

    if (Math.random() > 0.7) final += ' Add a quick example usage.';
    setResult(final);
    setHistory(h => [{ id: Date.now(), title, prompt: final }, ...h].slice(0, 30));
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      alert('Prompt copied to clipboard!');
    }
  };

  const loadTemplate = t => {
    setTemplate(t.template);
    setTitle(t.title);
  };

  const updateField = (key, value) => {
    setFields(f => ({ ...f, [key]: value }));
  };

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="logo">AI</div>
          <div>
            <div className="title">AI Prompt Writer</div>
            <div className="subtitle">Sleek prompt generator — modern, fast, Framer-style</div>
          </div>
        </div>
      </header>

      <main className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', fontWeight: '700' }}>
          Create Prompt
          <span style={{ color: 'var(--muted)', fontSize: '1.3rem' }}>AI-first templates</span>
        </div>

        <div className="controls">
          <select className="select" value={title} onChange={e => loadTemplate(TEMPLATES.find(t => t.title === e.target.value))}>
            {TEMPLATES.map(t => (
              <option key={t.title} value={t.title}>{t.title}</option>
            ))}
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 26rem', gap: '1.2rem', marginTop: '1.2rem' }}>
          <div>
            <div className="grid-inputs">
              {Object.keys(DEFAULT_FIELDS).slice(0, 6).map(key => (
                <input
                  key={key}
                  className="input"
                  placeholder={key}
                  value={fields[key] || ''}
                  onChange={e => updateField(key, e.target.value)}
                />
              ))}
            </div>
            <div className="grid-inputs">
              {Object.keys(DEFAULT_FIELDS).slice(6).map(key => (
                <input
                  key={key}
                  className="input"
                  placeholder={key}
                  value={fields[key] || ''}
                  onChange={e => updateField(key, e.target.value)}
                />
              ))}
            </div>

            <div className="actions">
              <button className="btn" onClick={generatePrompt}>Generate Prompt</button>
              <button className="btn transparent" onClick={() => setResult('')}>Clear</button>
            </div>

            {result && (
              <section className="resultCard" aria-live="polite">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Generated Prompt</strong>
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <button className="btn" onClick={copyToClipboard}>Copy</button>
                    <button
                      className="btn transparent"
                      onClick={() => {
                        const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'prompt.txt';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download
                    </button>
                  </div>
                </div>
                <p style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{result}</p>
              </section>
            )}
          </div>

          <aside className="sidebar" aria-label="Templates and History">
            <section className="panel" style={{ padding: '1.4rem' }}>
              <h2 style={{ fontWeight: '700' }}>Templates</h2>
              <p className="small" style={{ marginTop: '0.6rem' }}>Tap any template to load it</p>
              <div className="templates">
                {TEMPLATES.map(t => (
                  <div
                    key={t.title}
                    className="template"
                    role="button"
                    tabIndex={0}
                    onClick={() => loadTemplate(t)}
                    onKeyDown={e => { if (e.key === 'Enter') loadTemplate(t); }}
                    aria-label={`Load ${t.title} template`}
                  >
                    <div style={{ fontWeight: '700' }}>{t.title}</div>
                    <p className="small" style={{ marginTop: '0.6rem' }}>{t.template}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel" style={{ padding: '1.4rem', marginTop: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontWeight: '700' }}>History</h2>
                <span className="small" style={{ opacity: 0.8 }}>{history.length} saved</span>
              </div>
              <div className="history-list">
                {history.length === 0 && <p className="small" style={{ marginTop: '0.8rem' }}>No saved prompts yet — generate one!</p>}
                {history.map(h => (
                  <div
                    key={h.id}
                    className="history-item"
                    role="button"
                    tabIndex={0}
                    onClick={() => setResult(h.prompt)}
                    onKeyDown={e => { if (e.key === 'Enter') setResult(h.prompt); }}
                    aria-label={`Load saved prompt: ${h.title}`}
                  >
                    <div>{h.title}</div>
                    <div>{h.prompt}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.8rem' }}>
                <button
                  className="btn"
                  onClick={() => {
                    navigator.clipboard.writeText(history.map(h => h.prompt).join('\n---\n'));
                    alert('All prompts copied');
                  }}
                >
                  Copy All
                </button>
                <button className="btn transparent" onClick={() => setHistory([])}>Clear</button>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <footer className="footer">
        Built with care — tweak templates, save favorites, and export prompts.
      </footer>
    </div>
  );
}
