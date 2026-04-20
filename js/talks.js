const TALKS_KEY = 'gradion_talks';

const DEFAULT_TALKS = [
  {
    id: 1,
    title: 'ChatGPT & LLMs for Business Productivity',
    speaker: 'Sarah Chen · AI Lead', date: 'Apr 12, 2025',
    duration: '42 min', topic: 'Generative AI',
    description: 'A practical walkthrough of how ChatGPT and modern LLMs can transform day-to-day business workflows — from drafting emails and reports to automating repetitive tasks.',
    videoUrl: 'https://www.youtube.com/embed/JTxsNm9IdYU',
    slidesUrl: '#', coverEmoji: '🤖',
    tags: ['ChatGPT', 'Productivity']
  },
  {
    id: 2,
    title: 'Building RAG Applications from Scratch',
    speaker: 'James Park · Senior Engineer', date: 'Apr 8, 2025',
    duration: '55 min', topic: 'Advanced AI',
    description: 'Deep dive into Retrieval-Augmented Generation (RAG). We cover vector embeddings, choosing the right vector DB (Pinecone, Chroma, Weaviate), chunking strategies, and real-world architecture patterns.',
    videoUrl: 'https://www.youtube.com/embed/T-D1OfcDW1M',
    slidesUrl: '#', coverEmoji: '🔍',
    tags: ['RAG', 'Architecture', 'Vector DB']
  },
  {
    id: 3,
    title: 'Prompt Engineering Masterclass',
    speaker: 'Mark Johnson · ML Engineer', date: 'Apr 3, 2025',
    duration: '38 min', topic: 'Generative AI',
    description: 'From zero-shot to chain-of-thought: a hands-on masterclass covering all major prompting techniques with live demos using Claude and GPT-4.',
    videoUrl: 'https://www.youtube.com/embed/1bUy-1hGZpI',
    slidesUrl: '#', coverEmoji: '✍️',
    tags: ['Prompt Engineering', 'LLM']
  },
  {
    id: 4,
    title: 'AI Tools for Developers in 2025',
    speaker: 'Alex Kumar · DevOps Lead', date: 'Mar 28, 2025',
    duration: '31 min', topic: 'AI Tools',
    description: 'A curated tour of the best AI developer tools in 2025: GitHub Copilot, Cursor IDE, Codeium, Claude Code, and how to integrate AI into your CI/CD pipelines.',
    videoUrl: 'https://www.youtube.com/embed/gqUQbjsYZLQ',
    slidesUrl: '#', coverEmoji: '⚙️',
    tags: ['Developer Tools', 'Copilot', 'Productivity']
  },
  {
    id: 5,
    title: 'AI Ethics: Building Responsible Systems',
    speaker: 'Emma Davis · Policy Manager', date: 'Mar 21, 2025',
    duration: '46 min', topic: 'AI Ethics',
    description: 'Covers the ethical landscape of AI: bias, fairness, explainability, and the EU AI Act. Includes a framework for conducting ethical reviews before deploying AI systems.',
    videoUrl: 'https://www.youtube.com/embed/aGwYtUzMQUk',
    slidesUrl: '#', coverEmoji: '⚖️',
    tags: ['Ethics', 'Governance', 'EU AI Act']
  },
  {
    id: 6,
    title: 'Introduction to Machine Learning for Non-Engineers',
    speaker: 'Lisa Wang · Data Analyst', date: 'Mar 14, 2025',
    duration: '28 min', topic: 'AI Basics',
    description: 'An accessible, jargon-free explanation of machine learning concepts for product managers, designers, and business stakeholders who want to collaborate better with AI teams.',
    videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU',
    slidesUrl: '#', coverEmoji: '📊',
    tags: ['ML Basics', 'Non-Technical']
  },
  {
    id: 7,
    title: 'Fine-Tuning vs RAG vs Prompting: When to Use Each',
    speaker: 'James Park · Senior Engineer', date: 'Mar 7, 2025',
    duration: '35 min', topic: 'Advanced AI',
    description: 'A decision framework for choosing between fine-tuning a model, using RAG, or improving your prompts. Includes cost analysis and real project examples from Gradion.',
    videoUrl: 'https://www.youtube.com/embed/00Q0G84kq3M',
    slidesUrl: '#', coverEmoji: '🧩',
    tags: ['Fine-tuning', 'RAG', 'Strategy']
  },
  {
    id: 8,
    title: 'AI Security: Prompt Injection & Defence',
    speaker: 'Security Team', date: 'Feb 28, 2025',
    duration: '40 min', topic: 'AI Security',
    description: 'An in-depth look at AI-specific security vulnerabilities — prompt injection, jailbreaks, model inversion — and practical defences for production AI deployments.',
    videoUrl: 'https://www.youtube.com/embed/Sv5OLj2nVAQ',
    slidesUrl: '#', coverEmoji: '🔒',
    tags: ['Security', 'Prompt Injection']
  }
];

function getTalks() {
  const stored = localStorage.getItem(TALKS_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fall through */ }
  }
  localStorage.setItem(TALKS_KEY, JSON.stringify(DEFAULT_TALKS));
  return DEFAULT_TALKS;
}

function saveTalks(talks) {
  localStorage.setItem(TALKS_KEY, JSON.stringify(talks));
}

function addTalk(talkData) {
  const talks = getTalks();
  const newTalk = {
    ...talkData,
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    coverEmoji: '🎤'
  };
  talks.unshift(newTalk);
  saveTalks(talks);
  return newTalk;
}
