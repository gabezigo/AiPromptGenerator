import React, { useState, useEffect } from 'react';
import './App.css';

// Expanded templates with multiple sentence structures
const TEMPLATES = [
  {
    title: 'Product Launch',
    templates: [
      'Write a {adjective} and {adjective2} product launch prompt for {product} highlighting {features} and targeting {audience}.',
      'Create a {adjective} announcement for {product} that emphasizes {features} to attract {audience}.',
      'Generate a {adjective} launch message for {product} focusing on {features} and designed for {audience}.',
    ],
  },
  {
    title: 'Social Media Hook',
    templates: [
      'Craft an engaging social media caption for {platform} to promote {topic} with a {toneWord} tone and trending hashtags.',
      'Create a {toneWord} and catchy post for {platform} about {topic} that drives engagement.',
      'Write a playful {toneWord} social media hook for {platform} centered on {topic}.',
    ],
  },
  {
    title: 'Blog Intro',
    templates: [
      'Write a {adjective} introduction about {topic} that grabs attention and establishes authority.',
      'Create a compelling opening paragraph for a blog on {topic} that hooks readers immediately.',
      'Generate an {adjective} blog intro about {topic}, highlighting key points and engaging the audience.',
    ],
  },
  {
    title: 'Email Outreach',
    templates: [
      'Draft a short and {toneWord} outreach email to {recipient} introducing {offer} and requesting a meeting.',
      'Write a professional yet {toneWord} email pitching {offer} to {recipient}.',
      'Create a concise email to {recipient} about {offer} with a {toneWord} tone, asking for a follow-up.',
    ],
  },
  {
    title: 'Ad Copy',
    templates: [
      'Produce a {adjective} ad copy for {product} that focuses on the benefit of {benefit} and includes a clear CTA.',
      'Write a persuasive advertisement for {product} highlighting {benefit} with a strong call-to-action.',
      'Create a {adjective} promotional text for {product} emphasizing {benefit} and encouraging action.',
    ],
  },
  {
    title: 'Creative Writing',
    templates: [
      'Generate an imaginative writing prompt about {theme} that inspires vivid sensory detail and emotional stakes.',
      'Write a creative scenario involving {theme} that challenges the reader’s imagination.',
      'Create a {adjective} creative writing prompt centered on {theme} to inspire unique storytelling.',
    ],
  },
];

// Word banks for random insertion
const WORD_BANKS = {
  adjective: ['concise', 'persuasive', 'engaging', 'compelling', 'creative', 'imaginative', 'playful', 'professional', 'casual', 'fresh', 'dynamic'],
  adjective2: ['clear', 'vivid', 'catchy', 'strong', 'impactful', 'friendly', 'brief', 'memorable', 'inviting'],
  toneWord: ['creative', 'formal', 'casual', 'friendly', 'professional', 'playful', 'warm', 'enthusiastic', 'optimistic', 'serious'],
  product: ['novel AI writing assistant', 'smart productivity app', 'innovative design tool', 'cutting-edge software', 'advanced analytics platform'],
  features: ['smart templates, tone control, and one-click export', 'real-time collaboration and version control', 'AI-powered insights and automation', 'customizable workflows and integrations'],
  audience: ['busy content creators', 'small business owners', 'marketing professionals', 'tech enthusiasts', 'creative writers'],
  platform: ['Twitter', 'Instagram', 'Facebook', 'LinkedIn', 'TikTok'],
  topic: ['how to write better prompts', 'maximizing social media reach', 'effective content marketing', 'AI in everyday work', 'creative storytelling techniques'],
  recipient: ['a product manager', 'a marketing director', 'a startup founder', 'an editor', 'a potential client'],
  offer: ['early access to the beta', 'exclusive product demo', 'special discount offer', 'free trial period', 'invitation to a webinar'],
  benefit: ['time-saving automation', 'increased productivity', 'enhanced creativity', 'cost reduction', 'improved engagement'],
  theme: ['a moonlit carnival', 'a futuristic cityscape', 'an enchanted forest', 'a mysterious island', 'a bustling marketplace'],
};

// Helper to pick a random item from array
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Fill template string with random words from banks
function fillTemplate(tmpl, tone, length) {
  // Select random words from word banks
  const replacements = {
    adjective: randomChoice(WORD_BANKS.adjective),
    adjective2: randomChoice(WORD_BANKS.adjective2),
    toneWord: tone,
    product: randomChoice(WORD_BANKS.product),
    features: randomChoice(WORD_BANKS.features),
    audience: randomChoice(WORD_BANKS.audience),
    platform: randomChoice(WORD_BANKS.platform),
    topic: randomChoice(WORD_BANKS.topic),
    recipient: randomChoice(WORD_BANKS.recipient),
    offer: randomChoice(WORD_BANKS.offer),
    benefit: randomChoice(WORD_BANKS.benefit),
    theme: randomChoice(WORD_BANKS.theme),
  };

  // Replace placeholders in template string
  let filled = tmpl.replace(/\{(.*?)\}/g, (_, key) => replacements[key.trim()] || `{${key}}`);

  // Append tone and length instructions
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

  filled += ` ${toneText} ${lengthText}`;

  // Randomly add example usage sometimes
  if (Math.random() > 0.7) filled += ' Add a quick example usage.';

  return filled;
}

export default function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
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
    // Pick a random sentence structure for the selected template
    const tmpl =
      selectedTemplate.templates[Math.floor(Math.random() * selectedTemplate.templates.length)];

    // Fill it with random words
    const prompt = fillTemplate(tmpl, tone, length);

    setResult(prompt);
    setHistory((h) => [{ id: Date.now(), title: selectedTemplate.title, prompt }, ...h].slice(0, 30));
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
    setResult('');
  }

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="logo">AI</div>
          <div>
            <div className="title">AI Prompt Writer</div>
            <div className="subtitle">Sleek prompt generator — modern, fast</div>
          </div>
        </div>
      </header>

      <main className="panel main-panel">
        <div className="controls">
          <select
            className="select"
            value={selectedTemplate.title}
            onChange={(e) =>
              loadTemplate(TEMPLATES.find((t) => t.title === e.target.value))
            }
          >
            {TEMPLATES.map((t) => (
              <option key={t.title} value={t.title}>
                {t.title}
              </option>
            ))}
          </select>

          <select className="select" value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="creative">Creative</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
          </select>

          <select className="select" value={length} onChange={(e) => setLength(e.target.value)}>
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <textarea
          className="textarea"
          readOnly
          value={result || 'Generate a prompt to see it here...'}
          placeholder="Generated prompt will appear here"
          spellCheck={false}
          rows={6}
          style={{ resize: 'none' }}
        />

        <div className="actions">
          <button className="btn" onClick={generate}>
            Generate Prompt
          </button>
          <button className="btn transparent" onClick={() => setResult('')}>
            Clear
          </button>
        </div>

        {result && (
          <div className="resultCard">
            <div className="resultHeader">
              <strong>Generated Prompt</strong>
              <div className="resultButtons">
                <button className="btn small" onClick={copyResult}>
                  Copy
                </button>
                <button className="btn small transparent" onClick={downloadResult}>
                  Download
                </button>
              </div>
            </div>
            <p className="resultText">{result}</p>
          </div>
        )}
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
              >
                <strong>{t.title}</strong>
                <p>{t.templates[0]}</p>
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
              >
                Copy All
              </button>
              <button className="btn small transparent" onClick={() => setHistory([])}>
                Clear History
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
