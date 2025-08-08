import React, { useState, useEffect } from 'react';
import './App.css';

const TEMPLATES = [
  {
    title: 'Product Launch',
    template:
      'Write a persuasive product launch prompt for {product} highlighting {features} and targeting {audience}. Use a {tone} tone and keep it {length}.',
  },
  {
    title: 'Social Media Caption',
    template:
      'Create an engaging {tone} social media caption for {platform} about {topic} that resonates with {audience}.',
  },
  {
    title: 'Email Outreach',
    template:
      'Draft a {tone} outreach email to {recipient} introducing {offer} for {product} and requesting a meeting. Keep it {length}.',
  },
  {
    title: 'Ad Copy',
    template:
      'Produce a compelling ad copy for {product} focusing on {benefit} with a {tone} tone and a strong call to action.',
  },
  {
    title: 'Blog Introduction',
    template:
      'Write a captivating blog introduction on {topic} that appeals to {audience} using a {tone} tone and {length} length.',
  },
  {
    title: 'Creative Writing Prompt',
    template:
      'Generate an imaginative writing prompt about {theme} that inspires vivid sensory detail and emotional stakes with a {tone} tone.',
  },
  {
    title: 'Product Description',
    template:
      'Write a detailed product description for {product} emphasizing {features} aimed at {audience} with a {tone} style.',
  },
  {
    title: 'Landing Page Headline',
    template:
      'Craft a compelling landing page headline for {product} that highlights {benefit} and appeals to {audience} in a {tone} tone.',
  },
  {
    title: 'FAQ Answer',
    template:
      'Provide a clear and helpful FAQ answer regarding {topic} for {audience} using a {tone} tone and concise {length} explanation.',
  },
  {
    title: 'Video Script',
    template:
      'Write a {length} video script about {topic} targeting {audience} with a {tone} tone and focus on {goal}.',
  },
  {
    title: 'Brand Slogan',
    template:
      'Create a catchy brand slogan for {product} that communicates {benefit} and evokes {emotion}.',
  },
  {
    title: 'Customer Testimonial',
    template:
      'Generate a positive customer testimonial for {product} emphasizing {features} and expressing {emotion}.',
  },
  {
    title: 'Newsletter Subject Line',
    template:
      'Write an attention-grabbing newsletter subject line about {topic} for {audience} using a {tone} style.',
  },
  {
    title: 'Press Release Intro',
    template:
      'Draft a professional press release introduction announcing {offer} related to {product} aimed at {audience}.',
  },
  {
    title: 'Event Invitation',
    template:
      'Compose an inviting event invitation for {event} targeting {audience} with a {tone} tone and clear call to action.',
  },
];

const PLACEHOLDER_OPTIONS = {
  product: [
    'AI writing assistant',
    'creative content generator',
    'smart email automation tool',
    'marketing copywriter bot',
    'social media caption creator',
    'SEO blog assistant',
    'video script writer',
    'brand slogan generator',
    'customer feedback analyzer',
    'productivity booster',
    'digital marketing platform',
    'e-commerce tool',
    'content scheduling app',
    'influencer outreach tool',
    'email drip campaign software',
    'sales funnel optimizer',
    'blog topic generator',
    'content calendar planner',
    'advertisement manager',
    'SEO keyword research tool',
    'conversion rate optimizer',
    'online reputation manager',
    'brand awareness tool',
    'lead generation platform',
    'customer engagement tool',
    'multilingual content creator',
    'creative brainstorming assistant',
    'webinar promotion assistant',
    'customer loyalty program manager',
    'market research analyzer',
    'social listening platform',
    'A/B testing tool',
    'content personalization engine',
    'user experience analyzer',
    'email subject line optimizer',
    'in-app messaging tool',
    'affiliate marketing software',
    'paid ads manager',
    'landing page builder',
    'video marketing tool',
    'copyediting assistant',
    'automated report generator',
    'voice assistant integration',
    'interactive chatbot',
    'virtual event coordinator',
    'influencer collaboration platform',
    'real-time analytics dashboard',
    'mobile marketing platform',
    'customer feedback collector',
    'AI-powered chatbot',
  ],
  features: [
    'smart templates',
    'tone control',
    'one-click export',
    'AI-powered suggestions',
    'collaboration tools',
    'real-time analytics',
    'multi-language support',
    'SEO optimization',
    'custom branding',
    'drag-and-drop interface',
    'automated scheduling',
    'A/B testing',
    'performance tracking',
    'content calendar',
    'audience segmentation',
    'social media integration',
    'email automation',
    'lead scoring',
    'CRM integration',
    'personalized recommendations',
    'data visualization',
    'behavior tracking',
    'keyword research',
    'market insights',
    'custom workflows',
    'analytics reports',
    'user feedback',
    'content suggestions',
    'brand monitoring',
    'automated alerts',
    'responsive design',
    'multi-device support',
    'voice recognition',
    'image generation',
    'real-time collaboration',
    'customer journey mapping',
    'automated translations',
    'content tagging',
    'performance benchmarks',
    'smart notifications',
    'sentiment analysis',
    'content approval workflows',
    'version control',
    'SEO audits',
    'data export',
    'custom API',
    'email templates',
    'customer segmentation',
  ],
  audience: [
    'busy content creators',
    'social media managers',
    'freelance writers',
    'marketing teams',
    'small business owners',
    'e-commerce entrepreneurs',
    'bloggers and vloggers',
    'digital nomads',
    'startup founders',
    'non-profit organizations',
    'online educators',
    'influencers',
    'advertising agencies',
    'public relations professionals',
    'customer support teams',
    'sales representatives',
    'product managers',
    'content strategists',
    'SEO specialists',
    'email marketers',
    'affiliate marketers',
    'community managers',
    'brand managers',
    'event planners',
    'mobile app developers',
    'software engineers',
    'graphic designers',
    'video producers',
    'podcasters',
    'e-learning creators',
    'HR professionals',
    'fundraising coordinators',
    'real estate agents',
    'healthcare marketers',
    'travel bloggers',
    'photographers',
    'online retailers',
    'music promoters',
    'fashion designers',
    'consultants',
    'legal professionals',
    'finance advisors',
    'tech enthusiasts',
    'environmental activists',
    'government agencies',
    'journalists',
    'writers and authors',
    'students',
  ],
  platform: [
    'Twitter',
    'Facebook',
    'LinkedIn',
    'Instagram',
    'TikTok',
    'Pinterest',
    'Reddit',
    'YouTube',
    'Snapchat',
    'Clubhouse',
    'Medium',
    'Quora',
    'Tumblr',
    'Discord',
    'Slack',
    'WhatsApp',
    'Telegram',
    'WeChat',
    'Vimeo',
    'Twitch',
    'Google Ads',
    'Bing Ads',
    'Amazon Ads',
    'Email',
    'Blog',
    'Podcast',
    'Webinar',
    'Landing Page',
  ],
  topic: [
    'how to write better prompts',
    'boosting engagement on social media',
    'effective email outreach',
    'creative storytelling',
    'building a personal brand',
    'maximizing productivity',
    'increasing website traffic',
    'launching new products',
    'customer retention strategies',
    'AI in content marketing',
    'social media trends',
    'content repurposing',
    'SEO best practices',
    'video marketing tips',
    'email marketing strategies',
    'lead generation tactics',
    'branding essentials',
    'marketing automation',
    'content personalization',
    'influencer marketing',
    'conversion optimization',
    'blogging tips',
    'public relations',
    'customer feedback analysis',
    'digital advertising',
    'mobile marketing',
    'content creation workflows',
    'webinar hosting',
    'email list building',
    'data-driven marketing',
    'user engagement',
    'customer experience',
    'market research insights',
    'multichannel marketing',
    'online community building',
    'affiliate marketing',
    'content SEO',
    'creative campaigns',
    'brand storytelling',
    'social selling',
    'email deliverability',
    'content calendar planning',
  ],
  recipient: [
    'a product manager',
    'a marketing director',
    'a CEO',
    'a startup founder',
    'a small business owner',
    'a sales lead',
    'a customer service manager',
    'a social media influencer',
    'a project manager',
    'a content strategist',
    'an HR manager',
    'a business analyst',
    'an investor',
    'a freelancer',
    'a journalist',
    'a blogger',
    'an editor',
    'a developer',
    'a designer',
    'a community manager',
  ],
  offer: [
    'early access to the beta',
    'exclusive discount',
    'free trial',
    'limited time offer',
    'special promotion',
    'VIP membership',
    'complimentary consultation',
    'free demo',
    'bonus content',
    'early bird pricing',
    'premium package',
    'subscription discount',
    'bundle deal',
    'launch event invite',
    'free upgrade',
    'extended trial period',
  ],
  benefit: [
    'time-saving automation',
    'increased engagement',
    'higher conversion rates',
    'better brand awareness',
    'improved customer retention',
    'enhanced productivity',
    'streamlined workflows',
    'cost-effective marketing',
    'personalized messaging',
    'data-driven decisions',
    'real-time insights',
    'scalable solutions',
    'competitive advantage',
    'seamless integrations',
    'customer satisfaction',
    'innovative features',
  ],
  theme: [
    'a moonlit carnival',
    'a futuristic cityscape',
    'an enchanted forest',
    'a bustling marketplace',
    'a serene beach sunset',
    'a vintage carnival',
    'a cosmic adventure',
    'a mysterious mansion',
    'a vibrant street festival',
    'a whimsical garden',
    'an underwater expedition',
    'a snowy mountain retreat',
    'a magical library',
    'a steampunk workshop',
    'a tropical island',
    'a desert oasis',
  ],
  tone: [
    'creative',
    'formal',
    'casual',
    'playful',
    'serious',
    'enthusiastic',
    'friendly',
    'professional',
    'humorous',
    'inspirational',
  ],
  length: ['short', 'medium', 'long', 'detailed', 'concise'],
  goal: [
    'increasing conversions',
    'boosting brand awareness',
    'engaging new customers',
    'improving customer loyalty',
    'driving website traffic',
    'enhancing social media presence',
    'streamlining marketing campaigns',
    'optimizing email outreach',
    'generating qualified leads',
    'building community trust',
  ],
  emotion: [
    'excitement',
    'trust',
    'curiosity',
    'joy',
    'inspiration',
    'confidence',
    'urgency',
    'hope',
    'admiration',
    'surprise',
  ],
  event: [
    'product launch party',
    'webinar',
    'virtual conference',
    'networking event',
    'annual meetup',
    'workshop',
    'training session',
    'fundraising gala',
    'charity run',
    'hackathon',
  ],
};

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fillTemplate(tmpl, options) {
  return tmpl.replace(/\{(.*?)\}/g, (_, key) => {
    const choices = options[key.trim()];
    return choices ? randomChoice(choices) : `{${key}}`;
  });
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
    // We override tone and length placeholders with currently selected values
    const options = {
      ...PLACEHOLDER_OPTIONS,
      tone: [tone],
      length: [length],
    };

    const finalPrompt = fillTemplate(selectedTemplate.template, options);
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
    setResult('');
  }

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="logo">AI</div>
          <div>
            <div className="title">AI Prompt Writer</div>
            <div className="subtitle">Supercharged prompt generator — millions of unique prompts</div>
          </div>
        </div>
      </header>

      <main className="panel main-panel">
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
            {PLACEHOLDER_OPTIONS.tone.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>

          <select className="select" value={length} onChange={(e) => setLength(e.target.value)}>
            {PLACEHOLDER_OPTIONS.length.map((l) => (
              <option key={l} value={l}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </option>
            ))}
          </select>
        </div>

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
