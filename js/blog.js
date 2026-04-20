const BLOG_KEY = 'gradion_articles';

const DEFAULT_ARTICLES = [
  {
    id: 1, title: 'Introduction to Large Language Models',
    author: 'Dr. Sarah Chen', date: 'Apr 15, 2025', type: 'PDF',
    tags: ['LLM', 'AI Basics'], readTime: '8 min read',
    excerpt: 'A comprehensive introduction to Large Language Models (LLMs) — how they work, how they are trained, and why they have revolutionised natural language processing.',
    downloadUrl: 'https://arxiv.org/pdf/2307.06435',
    category: 'AI Basics'
  },
  {
    id: 2, title: 'Prompt Engineering: A Practical Guide',
    author: 'Mark Johnson', date: 'Apr 10, 2025', type: 'Article',
    tags: ['Prompt Engineering', 'Generative AI'], readTime: '12 min read',
    excerpt: 'Master the art of prompt engineering. Learn techniques like chain-of-thought, few-shot prompting, and role prompting to get consistently better results from AI models.',
    downloadUrl: '#',
    category: 'Generative AI'
  },
  {
    id: 3, title: 'AI in Enterprise: Opportunities & Challenges',
    author: 'Lisa Wang', date: 'Apr 8, 2025', type: 'PDF',
    tags: ['Enterprise AI', 'Strategy'], readTime: '15 min read',
    excerpt: 'A strategic overview of how enterprises are adopting AI in 2025. Covers ROI analysis, change management, governance frameworks, and real-world case studies.',
    downloadUrl: 'https://arxiv.org/pdf/2408.04174',
    category: 'Business AI'
  },
  {
    id: 4, title: 'Understanding Neural Networks',
    author: 'Alex Kumar', date: 'Apr 5, 2025', type: 'Article',
    tags: ['Neural Networks', 'Deep Learning'], readTime: '10 min read',
    excerpt: 'Demystify neural networks from the ground up. Understand perceptrons, activation functions, backpropagation, and how deep networks learn representations.',
    downloadUrl: '#',
    category: 'AI Basics'
  },
  {
    id: 5, title: 'Responsible AI: Ethics & Governance',
    author: 'Emma Davis', date: 'Apr 2, 2025', type: 'PDF',
    tags: ['AI Ethics', 'Governance'], readTime: '11 min read',
    excerpt: 'Explore the principles of responsible AI development — fairness, transparency, accountability, and privacy. Includes frameworks for implementing ethical AI in your organisation.',
    downloadUrl: 'https://arxiv.org/pdf/2206.08514',
    category: 'AI Ethics'
  },
  {
    id: 6, title: 'Getting Started with AI APIs',
    author: 'Gradion Tech Team', date: 'Mar 28, 2025', type: 'Article',
    tags: ['APIs', 'Developer Guide'], readTime: '9 min read',
    excerpt: 'Step-by-step guide to integrating OpenAI, Anthropic Claude, and Google Gemini APIs in your projects. Includes code samples, best practices, and cost optimisation tips.',
    downloadUrl: '#',
    category: 'Developer Guide'
  },
  {
    id: 7, title: 'RAG Architecture Deep Dive',
    author: 'James Park', date: 'Mar 22, 2025', type: 'PDF',
    tags: ['RAG', 'Architecture'], readTime: '14 min read',
    excerpt: 'Retrieval-Augmented Generation (RAG) explained in depth. Learn about vector databases, embedding models, chunking strategies, and how to build production-ready RAG systems.',
    downloadUrl: 'https://arxiv.org/pdf/2312.10997',
    category: 'Advanced AI'
  },
  {
    id: 8, title: 'AI Security: Risks & Mitigations',
    author: 'Security Team', date: 'Mar 18, 2025', type: 'Article',
    tags: ['Security', 'AI Risk'], readTime: '13 min read',
    excerpt: 'Understand the unique security challenges of AI systems — prompt injection, model poisoning, data privacy leaks, and adversarial attacks — with practical mitigation strategies.',
    downloadUrl: '#',
    category: 'AI Security'
  }
];

function getArticles() {
  const stored = localStorage.getItem(BLOG_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fall through */ }
  }
  localStorage.setItem(BLOG_KEY, JSON.stringify(DEFAULT_ARTICLES));
  return DEFAULT_ARTICLES;
}

function saveArticles(articles) {
  localStorage.setItem(BLOG_KEY, JSON.stringify(articles));
}

function addArticle(articleData) {
  const articles = getArticles();
  const newArticle = {
    ...articleData,
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
  articles.unshift(newArticle);
  saveArticles(articles);
  return newArticle;
}
