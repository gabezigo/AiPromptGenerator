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
      'Craft a short launch blurb for {product} that highlights {features} and invites {audience} to try it.',
    ],
  },
  {
    title: 'Social Media Hook',
    templates: [
      'Craft an engaging social media caption for {platform} to promote {topic} with a {toneWord} tone and trending hashtags.',
      'Create a {toneWord} and catchy post for {platform} about {topic} that drives engagement.',
      'Write a playful {toneWord} social media hook for {platform} centered on {topic}.',
      'Generate a short, shareable tagline for {platform} that teases {topic} and appeals to {audience}.',
    ],
  },
  {
    title: 'Blog Intro',
    templates: [
      'Write a {adjective} introduction about {topic} that grabs attention and establishes authority.',
      'Create a compelling opening paragraph for a blog on {topic} that hooks readers immediately.',
      'Generate an {adjective} blog intro about {topic}, highlighting key points and engaging the audience.',
      'Draft a persuasive lead-in for a long-form article on {topic} that sets expectations and interest.',
    ],
  },
  {
    title: 'Email Outreach',
    templates: [
      'Draft a short and {toneWord} outreach email to {recipient} introducing {offer} and requesting a meeting.',
      'Write a professional yet {toneWord} email pitching {offer} to {recipient}.',
      'Create a concise email to {recipient} about {offer} with a {toneWord} tone, asking for a follow-up.',
      'Compose an approachable follow-up email to {recipient} referencing {product} and offering {offer}.',
    ],
  },
  {
    title: 'Ad Copy',
    templates: [
      'Produce a {adjective} ad copy for {product} that focuses on the benefit of {benefit} and includes a clear CTA.',
      'Write a persuasive advertisement for {product} highlighting {benefit} with a strong call-to-action.',
      'Create a {adjective} promotional text for {product} emphasizing {benefit} and encouraging action.',
      'Generate a short paid ad headline + body for {product} aimed at {audience} with a punchy CTA.',
    ],
  },
  {
    title: 'Creative Writing',
    templates: [
      'Generate an imaginative writing prompt about {theme} that inspires vivid sensory detail and emotional stakes.',
      'Write a creative scenario involving {theme} that challenges the reader’s imagination.',
      'Create a {adjective} creative writing prompt centered on {theme} to inspire unique storytelling.',
      'Draft a scene starter set in {theme} with a dramatic opening line and character motivation.',
    ],
  },
  {
    title: 'Product Description',
    templates: [
      'Describe {product} focusing on {features} and explain how it benefits {audience} in simple terms.',
      'Write a concise product blurb for {product} highlighting the top three {features} for {audience}.',
      'Create a persuasive long-form product description for {product} that showcases {features} and use cases.',
    ],
  },
  {
    title: 'Landing Page Headline',
    templates: [
      'Craft a compelling landing page headline for {product} that highlights {benefit} and appeals to {audience}.',
      'Write a short subheadline that supports a bold headline for {product} and explains {features}.',
    ],
  },
  {
    title: 'FAQ Answer',
    templates: [
      'Provide a clear FAQ answer about {topic} for {audience} with actionable steps.',
      'Write a concise help-center response explaining {topic} and listing common troubleshooting tips.',
    ],
  },
  {
    title: 'Video Script',
    templates: [
      'Write a {length} video script about {topic} targeting {audience} with a {toneWord} tone and a strong hook.',
      'Generate a short social video script for {platform} that demonstrates {product} benefits and ends with a CTA.',
    ],
  },
  {
    title: 'Brand Slogan',
    templates: [
      'Create a catchy brand slogan for {product} that communicates {benefit} and evokes {emotion}.',
      'Write three short slogan options for {product} emphasizing {benefit}.',
    ],
  },
  {
    title: 'Customer Testimonial',
    templates: [
      'Generate a believable customer testimonial for {product} praising {features} and expressing {emotion}.',
      'Write a short quote-style testimonial highlighting {benefit} from the perspective of {audience}.',
    ],
  },
  {
    title: 'Newsletter Subject Line',
    templates: [
      'Write an attention-grabbing newsletter subject line about {topic} for {audience}.',
      'Generate three subject line variants for a campaign promoting {offer} and {topic}.',
    ],
  },
  {
    title: 'Press Release Intro',
    templates: [
      'Draft a professional press release lead announcing {offer} related to {product} aimed at {audience}.',
      'Write an opening paragraph for a press release about {product} launch and its key {features}.',
    ],
  },
  {
    title: 'Event Invitation',
    templates: [
      'Compose an inviting event invitation for {event} targeting {audience} with a {toneWord} tone and clear CTA.',
      'Write a brief RSVP invitation copy for a {event} with highlights and what attendees will gain.',
    ],
  },
  {
    title: 'SEO Meta & Ads',
    templates: [
      'Create an SEO meta title and meta description for an article about {topic} aimed at {audience}.',
      'Write a short ad headline and description optimized for search about {product} and {benefit}.',
    ],
  },
];

// Expanded word banks with many options
const WORD_BANKS = {
  adjective: [
    'concise', 'persuasive', 'engaging', 'compelling', 'creative', 'imaginative', 'playful',
    'professional', 'casual', 'fresh', 'dynamic', 'vibrant', 'impactful', 'memorable',
    'bold', 'clear', 'elegant', 'succinct', 'eloquent', 'energetic', 'sparkling', 'inventive',
    'crisp', 'brilliant', 'dramatic', 'expressive', 'friendly', 'gentle', 'heartfelt',
    'inspiring', 'jovial', 'keen', 'lively', 'motivational', 'nuanced', 'optimistic',
    'passionate', 'quirky', 'radiant', 'sincere', 'thoughtful', 'upbeat', 'vivacious', 'witty',
    'youthful', 'zealous',
  ],
  adjective2: [
    'clear', 'vivid', 'catchy', 'strong', 'impactful', 'friendly', 'brief', 'memorable', 'inviting',
    'polished', 'crisp', 'sharp', 'bright', 'colorful', 'distinct', 'elegant', 'fresh', 'luminous',
    'pure', 'refined', 'smooth', 'sparkling', 'striking', 'stylish', 'timely',
  ],
  toneWord: [
    'creative', 'formal', 'casual', 'friendly', 'professional', 'playful', 'warm', 'enthusiastic',
    'optimistic', 'serious', 'humorous', 'sarcastic', 'dramatic', 'informative', 'sincere',
  ],
  product: [
    'novel AI writing assistant', 'smart productivity app', 'innovative design tool',
    'cutting-edge software', 'advanced analytics platform', 'content scheduling app',
    'social caption generator', 'SEO blog assistant', 'video script writer',
    'smart calendar', 'collaborative editor', 'interactive dashboard', 'marketing funnel builder',
    'mobile photo editor', 'customer support chatbot', 'fitness tracker app', 'language learning tool',
    'virtual reality platform', 'blockchain wallet', 'e-commerce storefront', 'email automation tool',
    'web accessibility checker', 'game development kit', 'financial planning app', 'online course creator',
  ],
  features: [
    'smart templates, tone control, and one-click export',
    'real-time collaboration and version control',
    'AI-powered insights and automation',
    'customizable workflows and integrations',
    'multi-language support and SEO suggestions',
    'drag-and-drop interface',
    'cloud syncing and backup',
    'advanced analytics dashboard',
    'robust security features',
    'personalized recommendations',
    '24/7 customer support',
    'seamless third-party integrations',
    'automated reporting tools',
    'interactive tutorials and guides',
    'scalable infrastructure',
  ],
  audience: [
    'busy content creators', 'small business owners', 'marketing professionals',
    'tech enthusiasts', 'creative writers', 'social media managers',
    'freelancers', 'startup founders', 'e-commerce entrepreneurs', 'educators',
  ],
  platform: ['Twitter', 'Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'YouTube', 'Pinterest', 'Reddit'],
  topic: [
    'how to write better prompts', 'maximizing social media reach', 'effective content marketing',
    'AI in everyday work', 'creative storytelling techniques', 'email conversion strategies',
    'building personal brands', 'time management tips', 'productivity hacks', 'remote work trends',
  ],
  recipient: [
    'a product manager', 'a marketing director', 'a startup founder', 'an editor', 'a potential client',
    'a team lead', 'an investor', 'a business analyst', 'a customer support agent', 'a project manager',
  ],
  offer: [
    'early access to the beta', 'exclusive product demo', 'special discount offer',
    'free trial period', 'invitation to a webinar', 'complimentary consultation',
    'priority onboarding', 'limited-time upgrade', 'free eBook download', 'VIP event access',
  ],
  benefit: [
    'time-saving automation', 'increased productivity', 'enhanced creativity',
    'cost reduction', 'improved engagement', 'higher conversion rates',
    'better collaboration', 'streamlined workflows', 'greater accuracy', 'faster decision making',
  ],
  theme: [
    'a moonlit carnival', 'a futuristic cityscape', 'an enchanted forest',
    'a mysterious island', 'a bustling marketplace', 'a serene beach sunset',
    'a dystopian future', 'a magical school', 'a haunted mansion', 'a space colony',
  ],
  event: ['product launch party', 'webinar', 'virtual conference', 'networking event', 'live demo'],
  emotion: ['excitement', 'trust', 'curiosity', 'joy', 'inspiration', 'confidence', 'surprise'],
};

// Tone instructions mapped by tone word
const TONE_INSTRUCTIONS = {
  creative: 'Make it imaginative and surprising.',
  formal: 'Use a formal and professional tone.',
  casual: 'Keep it casual and friendly.',
  friendly: 'Maintain a warm and approachable style.',
  professional: 'Sound authoritative and credible.',
  playful: 'Use a light-hearted and fun tone.',
  warm: 'Convey kindness and empathy.',
  enthusiastic: 'Be energetic and positive.',
  optimistic: 'Focus on hopeful and bright aspects.',
  serious: 'Keep a straightforward and no-nonsense tone.',
  humorous: 'Add wit and light humor.',
  sarcastic: 'Use ironic or dry humor.',
  dramatic: 'Emphasize emotion and intensity.',
  informative: 'Be clear and educational.',
  sincere: 'Express genuine feelings.',
};

// Helper to pick a random element
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Fill template with random words and add tone/length instructions (no custom overrides)
function fillTemplate(tmpl, tone, length) {
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
    event: randomChoice(WORD_BANKS.event),
    emotion: randomChoice(WORD_BANKS.emotion),
  };

  let filled = tmpl.replace(/\{(.*?)\}/g, (_, key) => replacements[key.trim()] || `{${key}}`);


  const toneText = TONE_INSTRUCTIONS[tone] || 'Keep it casual and friendly.';

  const lengthText =
    length === 'short'
      ? 'Keep it concise (1-2 sentences).'
      : length === 'medium'
      ? 'Provide 2-3 sentences with examples.'
      : 'Write a longer detailed prompt with examples.';

  filled +=  ${toneText} ${lengthText};

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
    const tmpl =
      selectedTemplate.templates[Math.floor(Math.random() * selectedTemplate.templates.length)];
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
        {/* Controls */}
        <div className="controls">
          <select
            className="select"
            value={selectedTemplate.title}
            onChange={(e) => loadTemplate(TEMPLATES.find((t) => t.title === e.target.value))}
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
