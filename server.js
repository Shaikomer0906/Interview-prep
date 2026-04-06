import express from 'express';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

// Hardcoded Q&A Templates from interview_prep.html
const roleTemplates = {
  data: [
    {
      question: "What is ETL and why is it important in data engineering?",
      answer: [
        "ETL stands for Extract, Transform, Load.",
        "It moves data from source systems into analytics platforms.",
        "It ensures data is cleaned and standardized for reliable reporting."
      ]
    },
    {
      question: "How do you optimize a slow data pipeline?",
      answer: [
        "Profile each stage to find the bottleneck first.",
        "Optimize transformations, partitioning, and query patterns.",
        "Add monitoring metrics to validate throughput and latency gains."
      ]
    },
    {
      question: "How do you ensure data quality in production pipelines?",
      answer: [
        "Define validation checks for schema, nulls, and duplicates.",
        "Set automated alerts for failed quality rules.",
        "Track data freshness and lineage for root-cause analysis."
      ]
    },
    {
      question: "Tell me about a challenging data migration project.",
      answer: [
        "Situation: Legacy data sources caused inconsistent records.",
        "Task: Deliver migration with minimal downtime and no data loss.",
        "Action: Built validation scripts, staged loads, and rollback plans.",
        "Result: Migrated successfully with 99.9% data accuracy."
      ]
    },
    {
      question: "How do you collaborate with analysts and stakeholders?",
      answer: [
        "Translate business goals into measurable data requirements.",
        "Agree on metric definitions before building pipelines.",
        "Provide clear updates and iterate based on feedback."
      ]
    }
  ],
  backend: [
    {
      question: "How do you design a scalable REST API?",
      answer: [
        "Design resource-based endpoints with idempotent operations.",
        "Use caching, pagination, and database indexing.",
        "Protect services with rate limits and observability."
      ]
    },
    {
      question: "How do you debug production latency issues?",
      answer: [
        "Reproduce and isolate the issue using logs and traces.",
        "Identify hotspots in API handlers and database queries.",
        "Release measured fixes and verify p95/p99 latency improvements."
      ]
    },
    {
      question: "How do you secure backend systems?",
      answer: [
        "Apply least-privilege access controls and authentication.",
        "Validate all external inputs and sanitize outputs.",
        "Use encryption, secret management, and dependency scanning."
      ]
    },
    {
      question: "Tell me about a time you handled a critical outage.",
      answer: [
        "Situation: Traffic spike caused timeout errors on core endpoints.",
        "Task: Restore stability before customer impact increased.",
        "Action: Executed rollback, tuned queries, and added temporary caching.",
        "Result: Service recovered in 18 minutes and incidents dropped later."
      ]
    },
    {
      question: "How do you write maintainable backend code?",
      answer: [
        "Separate business logic from infrastructure concerns.",
        "Use clear module boundaries and contract tests.",
        "Prioritize readability and profile before optimization."
      ]
    }
  ],
  frontend: [
    {
      question: "How do you improve frontend performance in large apps?",
      answer: [
        "Measure bundle size and runtime rendering costs first.",
        "Use code splitting, lazy loading, and memoization.",
        "Monitor Core Web Vitals after each release."
      ]
    },
    {
      question: "How do you ensure accessibility in your UI work?",
      answer: [
        "Start with semantic HTML and keyboard support.",
        "Check contrast, focus order, and ARIA where needed.",
        "Validate with automated and manual screen-reader testing."
      ]
    },
    {
      question: "How do you manage complex state in web applications?",
      answer: [
        "Keep local state close to components.",
        "Use shared state only for cross-feature concerns.",
        "Handle server state with caching and invalidation strategies."
      ]
    },
    {
      question: "Tell me about a difficult cross-team UI delivery.",
      answer: [
        "Situation: Design and API changes kept shifting during a release.",
        "Task: Ship on time without sacrificing UX quality.",
        "Action: Created shared acceptance criteria and delivered in milestones.",
        "Result: Released on schedule with fewer regressions."
      ]
    },
    {
      question: "How do you reduce UI regressions in fast release cycles?",
      answer: [
        "Use component-level tests for critical interactions.",
        "Add visual checks for high-impact screens.",
        "Run staged rollouts and monitor user-impact metrics."
      ]
    }
  ],
  devops: [
    {
      question: "How do you design a reliable CI/CD pipeline?",
      answer: [
        "Use quality gates: lint, test, security scan, then deploy.",
        "Version artifacts and keep deployments reproducible.",
        "Include rollback paths and progressive rollout steps."
      ]
    },
    {
      question: "How do you improve observability in distributed systems?",
      answer: [
        "Correlate logs, metrics, and traces with request IDs.",
        "Define service-level indicators tied to user impact.",
        "Use alerting thresholds that reduce noise and false positives."
      ]
    },
    {
      question: "How do you optimize cloud cost without harming reliability?",
      answer: [
        "Right-size compute and storage based on usage patterns.",
        "Use autoscaling and lifecycle policies.",
        "Track cost and reliability together using SLO metrics."
      ]
    },
    {
      question: "Tell me about an incident you led in production.",
      answer: [
        "Situation: A deployment introduced elevated error rates.",
        "Task: Restore service rapidly and coordinate communication.",
        "Action: Rolled back safely, led triage, and documented root cause.",
        "Result: Service stabilized in under 20 minutes with improved safeguards."
      ]
    },
    {
      question: "How do you manage infrastructure as code at scale?",
      answer: [
        "Use reusable modules and strict code reviews.",
        "Enforce policy checks in CI before apply.",
        "Maintain clear environment promotion workflows."
      ]
    }
  ],
  general: [
    {
      question: "Tell me about yourself and your recent experience.",
      answer: [
        "Summarize your role and strongest skills.",
        "Highlight one or two measurable achievements.",
        "Connect your background to this target role."
      ]
    },
    {
      question: "How do you prioritize work under tight deadlines?",
      answer: [
        "Prioritize by business impact and dependencies.",
        "Break work into milestones with clear owners.",
        "Communicate trade-offs early and frequently."
      ]
    },
    {
      question: "How do you handle feedback and disagreements?",
      answer: [
        "Listen first and clarify the real concern.",
        "Focus discussion on goals and evidence.",
        "Align on a practical action plan."
      ]
    },
    {
      question: "Tell me about a challenging project you delivered.",
      answer: [
        "Situation: Project scope expanded close to deadline.",
        "Task: Deliver a stable release without major delays.",
        "Action: Re-prioritized scope and coordinated daily blocker removal.",
        "Result: Released on time with strong quality metrics."
      ]
    },
    {
      question: "Why do you want this role?",
      answer: [
        "Align your strengths with the role requirements.",
        "Show motivation for the team and mission.",
        "Explain how you can add value quickly."
      ]
    }
  ]
};

// Role detection logic (from interview_prep.html)
function detectRoleKey(title) {
  const t = title.toLowerCase();
  if (["data", "engineer", "analyst", "scientist", "etl", "ml", "ai"].some(k => t.includes(k)) && t.includes("data")) return "data";
  if (["backend", "api", "python", "java", "node", "server"].some(k => t.includes(k))) return "backend";
  if (["frontend", "react", "angular", "vue", "ui"].some(k => t.includes(k))) return "frontend";
  if (["devops", "sre", "cloud", "platform"].some(k => t.includes(k))) return "devops";
  return "general";
}

// In-memory conversation sessions
const sessions = new Map();

app.use(express.json());
app.use(express.static(__dirname));

// Serve chat interface as default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'interview_prep_chat.html'));
});

// API: Generate initial 5 questions based on job title
app.post('/api/generate', (req, res) => {
  try {
    const { jobTitle, sessionId } = req.body;

    if (!jobTitle) {
      return res.status(400).json({ error: 'Job title is required' });
    }

    const roleKey = detectRoleKey(jobTitle);
    const questions = roleTemplates[roleKey] || roleTemplates.general;

    // Initialize session with conversation history
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {
        jobTitle,
        roleKey,
        messages: [],
        questions: questions.slice(0, 5)
      });
    }

    res.json({
      jobTitle,
      roleKey,
      questions: questions.slice(0, 5)
    });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// API: Chat endpoint for follow-ups and feedback using Claude
app.post('/api/chat', async (req, res) => {
  try {
    const { userMessage, sessionId, role } = req.body;

    if (!userMessage || !sessionId) {
      return res.status(400).json({ error: 'User message and session ID are required' });
    }

    // Get or create session
    let session = sessions.get(sessionId);
    if (!session) {
      session = {
        jobTitle: 'Unknown Role',
        roleKey: role || 'general',
        messages: [],
        questions: []
      };
      sessions.set(sessionId, session);
    }

    // Add user message to history
    session.messages.push({
      role: 'user',
      content: userMessage
    });

    // Prepare context about the questions for Claude
    const questionsContext = session.questions
      .map((q, i) => `Q${i + 1}: ${q.question}\nA${i + 1}: ${q.answer.join(' ')}`)
      .join('\n\n');

    const systemPrompt = `You are an expert interview coach specializing in ${session.roleKey} roles.
Your role is to provide concise, practical guidance and feedback to interview candidates.

Here are the 5 interview questions for this session:
${questionsContext}

Guidelines:
- Provide specific, actionable feedback on the candidate's answers
- Keep responses concise (2-3 sentences max for tips)
- Use the STAR method as reference for behavioral questions
- Highlight strengths and areas for improvement
- Provide example phrasings or approaches when helpful
- Encourage candidates with constructive feedback`;

    // Call Claude API with conversation history
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 500,
      system: systemPrompt,
      messages: session.messages
    });

    const coachResponse = response.content[0].type === 'text' ? response.content[0].text : '';

    // Add coach response to history
    session.messages.push({
      role: 'assistant',
      content: coachResponse
    });

    res.json({
      response: coachResponse,
      conversationLength: session.messages.length
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Interview Prep Coach running at http://localhost:${PORT}`);
  console.log(`⚠️  Make sure to set CLAUDE_API_KEY in .env file\n`);
});
