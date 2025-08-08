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

const PLACEHOLDERS = {
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
  return tmpl.replace(/\{(.*?)\}/g, (_, key) => fields[key.trim()] || `{${key}}`);
}

export default function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [templateText, setTemplateText] = useState(TEMPLATES[0].template);
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

  function generate() {
    const base = fillTemplate(templateText, PLACEHOLDERS);
    const toneText =
      tone === 'creative'
        ? 'Make it imaginative and surprising.'
        : tone === 'formal'
        ? 'Use a formal and professional tone.'
        : 'Keep it casual and friendly.';
    const lengthText =
      length === 'short'
        ? 'Keep it concise (1-2 sentences).'
        : length === 'medium'
        ? 'Provide 2-3 sentences with examples.'
        : 'Write a longer detailed prompt with examples.';
    let finalPrompt = `${base} ${toneText} ${lengthText}`;
    if (Math.random() > 0.7) finalPrompt += ' Add a quick example usage.';
    setResult(finalPrompt);
    setHistory((h) => [{ id: Date.now(), title: selectedTemplate.title, prompt: finalPrompt }, ...h].slice(0, 30));
  }

  function copyResult() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    alert('Prompt copied to clipboard!');
  }

  function downloadResult() {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  function loadTemplate(t) {
    setSelectedTemplate(t);
    setTemplateText(t.template);
    setResult('');
  }

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="logo" aria-label="AI logo">AI</div>
          <div>
            <div className="title">AI Prompt Writer</div>
            <div className="subtitle">Sleek prompt generator — modern, fast</div>
          </div>
        </div>
      </header>

      <main className="panel main-panel" role="main">
        <div className="controls">
          <select
            className="select"
            value={selectedTemplate.title}
            onChange={(e) => loadTemplate(TEMPLATES.find((t) => t.title === e.target.value))}
            aria-label="Select prompt template"
          >
            {TEMPLATES.map((t) => (
              <option key={t.title} value={t.title}>
                {t.title}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            aria-label="Select tone"
          >
            <option value="creative">Creative</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
          </select>

          <select
            className="select"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            aria-label="Select length"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <textarea
          className="textarea"
          value={templateText}
          onChange={(e) => setTemplateText(e.target.value)}
          placeholder="Edit your prompt template here..."
          spellCheck={false}
          aria-label="Edit prompt template"
        />

        <div className="actions">
          <button className="btn" onClick={generate} disabled={!templateText.trim()}>
            Generate Prompt
          </button>
          <button className="btn transparent" onClick={() => setResult('')} disabled={!result}>
            Clear
          </button>
        </div>

        {/* Always render resultCard to avoid layout shift, but hide if no result */}
        <div
          className="resultCard"
          style={{ visibility: result ? 'visible' : 'hidden', height: result ? 'auto' : 0, pointerEvents: result ? 'auto' : 'none' }}
          aria-live="polite"
          aria-atomic="true"
        >
          {result && (
            <>
              <div className="resultHeader">
                <strong>Generated Prompt</strong>
                <div className="resultButtons">
                  <button className="btn small" onClick={copyResult} aria-label="Copy generated prompt">
                    Copy
                  </button>
                  <button className="btn small transparent" onClick={downloadResult} aria-label="Download generated prompt">
                    Download
                  </button>
                </div>
              </div>
              <p className="resultText">{result}</p>
            </>
          )}
        </div>
      </main>

      <aside className="sidebar" aria-label="Templates and history">
        <div className="panel templatesPanel">
          <h3>Templates</h3>
          <small>Tap to load a template</small>
          <div className="templates">
            {TEMPLATES.map((t) => (
              <div
                key={t.title}
                className="template"
                onClick={() => loadTemplate(t)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    loadTemplate(t);
                    e.preventDefault();
                  }
                }}
                aria-label={`Load template ${t.title}`}
              >
                <strong>{t.title}</strong>
                <p>{t.template}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel historyPanel">
          <h3>History</h3>
          <small>{history.length} saved</small>
          <div className="historyList">
            {history.length ? (
              history.map((h) => (
                <div
                  key={h.id}
                  className="historyItem"
                  onClick={() => setResult(h.prompt)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setResult(h.prompt);
                      e.preventDefault();
                    }
                  }}
                  aria-label={`Load prompt from history titled ${h.title}`}
                >
                  <strong>{h.title}</strong>
                  <p className="truncate">{h.prompt}</p>
                </div>
              ))
            ) : (
              <p>No saved prompts yet — generate one!</p>
            )}
          </div>

          {history.length > 0 && (
            <div className="historyActions">
              <button
                className="btn small"
                onClick={() => {
                  navigator.clipboard.writeText(history.map((h) => h.prompt).join('\n---\n'));
                  alert('All prompts copied!');
                }}
                aria-label="Copy all saved prompts"
              >
                Copy All
              </button>
              <button className="btn small transparent" onClick={() => setHistory([])} aria-label="Clear prompt history">
                Clear History
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
