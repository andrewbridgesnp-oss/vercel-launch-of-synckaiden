import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Rocket,
  Brain,
  Workflow,
  TrendingUp,
  Wand2,
  Shield,
  BookOpen,
  ClipboardList,
  Zap,
  DollarSign,
  Video,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Calendar,
} from "lucide-react";

/**
 * Atlas Academy 2026 (MVP)
 * - Offline-first training OS for mastering AI products + building automations.
 * - No network calls. Bring your own “intel packs” (JSON) and paste tool notes.
 * - LocalStorage persistence.
 */

const LS_KEY = "atlas_academy_2026_v1";

function safeParseJSON(text) {
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

const DEFAULT_STATE = {
  profile: {
    name: "Andy",
    northStar: "Bridge thought → automation; ship daily; stay compliant; build compounding systems.",
    timeBudgetMin: 120,
  },
  streak: {
    lastDoneISO: "",
    count: 0,
  },
  mastery: {
    // moduleId -> { lessonId -> boolean }
  },
  notes: {
    // moduleId -> string
  },
  intelPacks: [],
  dailyLog: [],
  social: {
    selectedProfiles: ["TikTok", "YouTube"],
    niches: {
      TikTok: {
        brand: "AtlasOps",
        promise: "Daily AI cost-cuts + automations you can copy in 60 seconds.",
      },
      YouTube: {
        brand: "AtlasOps",
        promise: "Weekly deep dives: build agents, reduce costs, ship profitable systems.",
      },
    },
  },
  workflowBlueprints: [],
};

const CORE_MODULES = [
  {
    id: "agents",
    icon: Brain,
    title: "Agentic AI & Autonomy",
    why: "Agents are moving from ‘chat’ to goal-driven execution with tools, memory, and guardrails.",
    skills: ["task decomposition", "tool selection", "state & memory", "approval gates", "failure recovery"],
    lessons: [
      {
        id: "agents-1",
        title: "The Agent Loop: Plan → Act → Observe → Reflect",
        timeMin: 25,
        checklist: [
          "Write a single sentence goal (no ambiguity)",
          "Define allowed tools + forbidden actions",
          "Define success criteria + stop conditions",
          "Add an approval gate before irreversible steps",
          "Add retries with backoff + rollback plan",
        ],
      },
      {
        id: "agents-2",
        title: "Safety by Design: permissions, scopes, and audit trails",
        timeMin: 20,
        checklist: [
          "Use least-privilege API keys and scopes",
          "Log inputs/outputs (redact secrets)",
          "Rate-limit and cost-cap every tool",
          "Add human-in-the-loop for payments / account changes",
        ],
      },
      {
        id: "agents-3",
        title: "Reliability: evals, test harnesses, and guardrails",
        timeMin: 30,
        checklist: [
          "Create 10 realistic test cases",
          "Define 3 failure modes (hallucination, tool misuse, refusal loops)",
          "Add structured outputs (JSON schemas)",
          "Track error rate and fix the top 1 weekly",
        ],
      },
    ],
  },
  {
    id: "dev",
    icon: Zap,
    title: "AI for Software Engineering",
    why: "Coding models are becoming long-horizon teammates: refactors, migrations, code review, CI changes.",
    skills: ["repo mapping", "scoped diffs", "tests-first", "code review prompts", "secure coding"],
    lessons: [
      {
        id: "dev-1",
        title: "Repo Map + Task Scoping (the 10-minute habit)",
        timeMin: 20,
        checklist: [
          "Generate a repo map (folders + responsibilities)",
          "Pick the smallest shippable change",
          "Write acceptance tests (even if manual)",
          "Ask the model for a diff + rationale",
        ],
      },
      {
        id: "dev-2",
        title: "Ship Fast Without Breaking: migrations + rollbacks",
        timeMin: 30,
        checklist: [
          "Create a rollback plan before touching prod",
          "Add feature flags where possible",
          "Run tests + static checks",
          "Log what changed and why",
        ],
      },
      {
        id: "dev-3",
        title: "Defensive Security Mindset",
        timeMin: 25,
        checklist: [
          "Threat model the feature (abuse cases)",
          "Validate inputs everywhere",
          "Never log secrets",
          "Pin dependencies and scan",
        ],
      },
    ],
  },
  {
    id: "multimodal",
    icon: Wand2,
    title: "Multimodal Systems",
    why: "Text + images + audio + video + sensors unlock real-world automation.",
    skills: ["screen-to-action", "document understanding", "voice workflows", "quality checks"],
    lessons: [
      {
        id: "mm-1",
        title: "Screen-to-Action: automating UIs safely",
        timeMin: 25,
        checklist: [
          "Prefer APIs over UI automation",
          "If UI needed: add explicit element targeting",
          "Use confirmations before click/submit",
          "Record evidence (screenshots) for audits",
        ],
      },
      {
        id: "mm-2",
        title: "Audio: speech → structured actions",
        timeMin: 20,
        checklist: [
          "Define command grammar (what’s allowed)",
          "Add wake word + confirmation",
          "Log transcript + action taken",
        ],
      },
    ],
  },
  {
    id: "rag",
    icon: BookOpen,
    title: "RAG, Search, and ‘Truth First’",
    why: "Retrieval + citations + evaluation beats vibes. Your edge is accuracy.",
    skills: ["chunking", "embeddings", "grounding", "citations", "freshness"],
    lessons: [
      {
        id: "rag-1",
        title: "Build a Personal Knowledge Base (PKB)",
        timeMin: 30,
        checklist: [
          "Pick a storage (files + vector DB)",
          "Define chunk sizes + metadata",
          "Add freshness scoring",
          "Cite sources in outputs",
        ],
      },
      {
        id: "rag-2",
        title: "Evals for RAG: measure truth, not confidence",
        timeMin: 25,
        checklist: [
          "Create a Q/A set from your docs",
          "Score: correctness + citation relevance",
          "Track drift monthly",
        ],
      },
    ],
  },
  {
    id: "governance",
    icon: Shield,
    title: "AI Governance + Compliance",
    why: "The winners in 2026 will ship fast *and* pass audits.",
    skills: ["risk registers", "model cards", "PII handling", "policy controls"],
    lessons: [
      {
        id: "gov-1",
        title: "Risk Register (one page) for every automation",
        timeMin: 20,
        checklist: [
          "Identify stakeholders + harms",
          "Add mitigations + monitoring",
          "Define who approves changes",
        ],
      },
      {
        id: "gov-2",
        title: "Data Hygiene: least data, least time",
        timeMin: 20,
        checklist: [
          "Minimize PII",
          "Encrypt at rest",
          "Rotate keys",
          "Define retention and deletion",
        ],
      },
    ],
  },
  {
    id: "automation",
    icon: Workflow,
    title: "Automation Engineering (n8n / Make / Zapier mindset)",
    why: "Most revenue is ‘boring’ automation: intake → transform → approve → log → notify.",
    skills: ["events", "webhooks", "idempotency", "queues", "observability"],
    lessons: [
      {
        id: "auto-1",
        title: "The Universal Workflow Pattern",
        timeMin: 25,
        checklist: [
          "Single source of truth (DB)",
          "Event trigger",
          "Transformer",
          "Approval gate",
          "Actuator",
          "Audit log",
        ],
      },
      {
        id: "auto-2",
        title: "Cost Caps and Kill Switches",
        timeMin: 20,
        checklist: [
          "Daily spend cap",
          "Rate limits",
          "Alerting",
          "Emergency disable",
        ],
      },
    ],
  },
];

const SIDE_GIGS_25 = [
  {
    id: "sg-1",
    name: "AI Contract ‘Blacklight’ Auditor",
    buyer: "Real estate investors, med-spas, agencies",
    what: "Upload any contract → agent flags hidden risk, auto-generates redlines + negotiation script.",
    whyNow: "Agentic AI + policy maps + clause libraries.",
    pricing: "$299–$2,500 per contract / retainer",
    risk: "Unauthorized practice of law—must position as ‘risk analysis’ + recommend counsel.",
  },
  {
    id: "sg-2",
    name: "Personal AI CFO for High-Net-Worth Families",
    buyer: "Rich households",
    what: "Bill/expense triage, subscription hunting, cashflow forecasts, tax doc prep checklists.",
    whyNow: "Multimodal document + bank export parsing.",
    pricing: "$250–$1,500/mo",
    risk: "Financial advice licensing; keep it informational + approvals.",
  },
  {
    id: "sg-3",
    name: "‘Zero-Waste’ Ops Optimizer for SMB",
    buyer: "Clinics, salons, restaurants",
    what: "Agent reads invoices + schedules + inventory → proposes reorder timing + labor smoothing.",
    whyNow: "Agents + time-series + workflow automation.",
    pricing: "$500–$5,000/mo",
    risk: "Bad decisions without oversight—must include human approvals.",
  },
  {
    id: "sg-4",
    name: "AI ‘Procurement Sniper’",
    buyer: "Construction/healthcare offices",
    what: "Auto-matches purchase requests to cheapest compliant vendors, tracks rebates, negotiates quotes.",
    whyNow: "Tool-using agents + vendor RFP templates.",
    pricing: "% of savings (10–25%)",
    risk: "Vendor ToS and scraping; keep within allowed sources.",
  },
  {
    id: "sg-5",
    name: "Local ‘Edge AI Box’ for Privacy",
    buyer: "Law firms, clinics",
    what: "Plug-in box: private chat + doc Q&A + call summaries on-prem.",
    whyNow: "Small models + quantization + better hardware.",
    pricing: "$1,500–$10,000 setup + support",
    risk: "Security hardening required.",
  },
  {
    id: "sg-6",
    name: "AI Reputation & Review Recovery Engine",
    buyer: "Local service businesses",
    what: "Detects bad reviews, drafts compliant responses, triggers SOP fixes, requests make-goods.",
    whyNow: "Multichannel automation.",
    pricing: "$300–$2,000/mo",
    risk: "Never fake reviews.",
  },
  {
    id: "sg-7",
    name: "AI ‘Patient Journey Autopilot’ (Compliant)",
    buyer: "Clinics/med-spas",
    what: "Intake → education → consent reminders → follow-ups → outcomes tracking.",
    whyNow: "Agents + templates + EHR integrations.",
    pricing: "$1,000–$8,000/mo",
    risk: "HIPAA; must do proper BAAs and access control.",
  },
  {
    id: "sg-8",
    name: "AI ‘RFP Machine’ for Government + Enterprise",
    buyer: "SMBs trying to win contracts",
    what: "Auto-builds compliant proposals with citations + checklists.",
    whyNow: "RAG + structured outputs.",
    pricing: "$1,000–$25,000 per bid",
    risk: "Must avoid fabricated claims; cite everything.",
  },
  {
    id: "sg-9",
    name: "AI ‘Ops Twin’ for Franchises",
    buyer: "Franchise operators",
    what: "Digital twin: staffing, inventory, marketing, KPIs; recommends actions daily.",
    whyNow: "Agentic + analytics.",
    pricing: "$2,000–$20,000/mo",
    risk: "Data quality + governance.",
  },
  {
    id: "sg-10",
    name: "AI ‘Insurance Claim Maximizer’ (ethical)",
    buyer: "Consumers + small businesses",
    what: "Organizes evidence, drafts narratives, tracks deadlines, prevents missing paperwork.",
    whyNow: "Multimodal doc + timeline building.",
    pricing: "$99–$999",
    risk: "No fraud, no exaggeration; must stay factual.",
  },
  {
    id: "sg-11",
    name: "AI ‘Negotiation Copilot’ for High-Stakes Purchases",
    buyer: "Car buyers, contractors",
    what: "Analyzes quotes, suggests counters, scripts calls, logs outcomes.",
    pricing: "$49–$499",
    risk: "Keep it as coaching; don’t misrepresent identity.",
  },
  {
    id: "sg-12",
    name: "AI ‘Privacy Concierge’",
    buyer: "Families, executives",
    what: "Finds leaks, sets up 2FA, audits accounts, drafts data deletion requests.",
    pricing: "$500–$5,000",
    risk: "No hacking; user-authorized actions only.",
  },
  {
    id: "sg-13",
    name: "AI ‘Content-to-Products’ Factory",
    buyer: "Creators",
    what: "Turns every video into a course, email series, lead magnet, and offer.",
    pricing: "$300–$3,000/mo",
    risk: "Copyright and brand consistency.",
  },
  {
    id: "sg-14",
    name: "AI ‘Executive Assistant for Realtors’",
    buyer: "Realtors",
    what: "Listing intake, photo captions, comps packs, showing coordination.",
    pricing: "$500–$4,000/mo",
    risk: "Fair housing compliance.",
  },
  {
    id: "sg-15",
    name: "AI ‘Medical Coding + Denial Appeal Prep’ (assistive)",
    buyer: "Small practices",
    what: "Prepares denial packets, suggests documentation improvements.",
    pricing: "$1,000–$15,000/mo",
    risk: "Accuracy; keep human verification.",
  },
  {
    id: "sg-16",
    name: "AI ‘Micro-MBA’ for Blue-Collar Entrepreneurs",
    buyer: "Tradespeople",
    what: "Automates quoting, invoicing, follow-ups, reviews, scheduling.",
    pricing: "$79–$499/mo",
    risk: "Support burden; need templates.",
  },
  {
    id: "sg-17",
    name: "AI ‘Grant Watchtower’",
    buyer: "Nonprofits + startups",
    what: "Monitors opportunities, drafts fit analysis, prepares compliance packets.",
    pricing: "$199–$2,000/mo",
    risk: "Overpromising; must disclose probabilities.",
  },
  {
    id: "sg-18",
    name: "AI ‘Time-Value Marketplace’ (legal-safe)",
    buyer: "Communities",
    what: "A ‘time credit’ system for services; NOT money, more like loyalty/volunteering.",
    pricing: "$5–$20/user/mo",
    risk: "Regulatory if treated as money; must be careful.",
  },
  {
    id: "sg-19",
    name: "AI ‘Stress-Test My Business’ Simulator",
    buyer: "Founders",
    what: "Simulates cashflow shocks, staffing changes, ad spend; outputs contingency plan.",
    pricing: "$199–$2,500",
    risk: "Model error; label assumptions.",
  },
  {
    id: "sg-20",
    name: "AI ‘Compliance OS’ for Med-Spas",
    buyer: "Med-spas",
    what: "Tracks protocols, consents, supervision logs, complaint workflows.",
    pricing: "$1,000–$10,000/mo",
    risk: "Must be jurisdiction-aware.",
  },
  {
    id: "sg-21",
    name: "AI ‘Deal Screening’ for Investors",
    buyer: "Angel investors",
    what: "Reads pitch decks, flags risks, creates diligence questions.",
    pricing: "$99–$999/mo",
    risk: "Not investment advice.",
  },
  {
    id: "sg-22",
    name: "AI ‘Family Ops’ Chief-of-Staff",
    buyer: "Busy parents",
    what: "Schedules, school stuff, meal planning, budget, reminders.",
    pricing: "$25–$150/mo",
    risk: "Privacy.",
  },
  {
    id: "sg-23",
    name: "AI ‘Procurement + Staffing’ for Event Venues",
    buyer: "Venues",
    what: "Forecasts demand, schedules staff, automates vendor ordering.",
    pricing: "$500–$6,000/mo",
    risk: "Integration work.",
  },
  {
    id: "sg-24",
    name: "AI ‘Litigation Readiness’ Binder Builder",
    buyer: "Small businesses",
    what: "Organizes communications, invoices, timelines into court-ready binders.",
    pricing: "$299–$3,000",
    risk: "Not legal advice.",
  },
  {
    id: "sg-25",
    name: "AI ‘Shadow IT Cleaner’",
    buyer: "Companies",
    what: "Finds unused SaaS, redundant licenses, and security holes; proposes cuts.",
    pricing: "% of savings + setup",
    risk: "Needs careful access + approvals.",
  },
];

const TOOL_STACK = [
  {
    layer: "Edge / Self-Hosted",
    items: [
      { name: "Ubuntu Server + Docker", why: "Portable, reproducible stack" },
      { name: "n8n", why: "Workflow automation, connectors, approvals" },
      { name: "PostgreSQL", why: "Source of truth + audit logs" },
      { name: "Qdrant / pgvector", why: "Search + embeddings for your docs" },
      { name: "Ollama", why: "Local inference for privacy and cost" },
      { name: "Traefik", why: "TLS + reverse proxy" },
      { name: "Vaultwarden", why: "Secret storage" },
      { name: "Prometheus + Grafana", why: "Observability (costs, latency, errors)" },
    ],
  },
  {
    layer: "Cloud Frontier (optional)",
    items: [
      { name: "OpenAI (Responses/Codex)", why: "Best-in-class coding + agentic tool use" },
      { name: "Anthropic / Google / open models", why: "Redundancy + specialized strengths" },
      { name: "Cloud storage (S3/GCS)", why: "Artifacts + backups" },
    ],
  },
  {
    layer: "Creator Ops",
    items: [
      { name: "Notion/Linear", why: "Backlog + daily execution" },
      { name: "Descript/CapCut", why: "Fast editing + repurposing" },
      { name: "Metricool/Buffer", why: "Scheduling + analytics" },
      { name: "Canva", why: "Fast creative, templates" },
    ],
  },
];

const DEFAULT_BLUEPRINT_TEMPLATE = {
  goal: "Reduce operating cost by 20% in 60 days (while increasing speed).",
  environment: "Small business with email, calendar, invoicing, and payroll.",
  constraints: [
    "No unauthorized access",
    "All payments require human approval",
    "Audit trail for every action",
    "Cost caps for AI usage",
  ],
  signals: [
    "Bank/merchant exports",
    "Invoices + vendor contracts",
    "Scheduling/timecards",
    "SaaS subscriptions",
    "Utilities + telecom",
  ],
  actions: [
    "Subscription cancellation and downgrades",
    "Vendor renegotiation scripts",
    "Inventory reorder optimization",
    "Staff scheduling smoothing",
    "Billing and collections automation",
  ],
  monitoring: ["Weekly savings report", "Error alerts", "Data drift review monthly"],
};

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

function SectionTitle({ icon: Icon, title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-2xl bg-muted p-2 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xl font-semibold leading-tight">{title}</div>
          {subtitle ? <div className="text-sm text-muted-foreground">{subtitle}</div> : null}
        </div>
      </div>
      {right}
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium">
      {children}
    </span>
  );
}

function ScoreRing({ value = 0 }) {
  const pct = clamp(value, 0, 100);
  return (
    <div className="flex items-center gap-3">
      <div className="w-32">
        <Progress value={pct} />
      </div>
      <div className="text-sm font-semibold tabular-nums">{pct}%</div>
    </div>
  );
}

function computeMasteryPercent(state) {
  const lessons = CORE_MODULES.flatMap((m) => m.lessons.map((l) => ({ moduleId: m.id, lessonId: l.id })));
  const total = lessons.length;
  if (total === 0) return 0;
  let done = 0;
  for (const { moduleId, lessonId } of lessons) {
    if (state.mastery?.[moduleId]?.[lessonId]) done += 1;
  }
  return Math.round((done / total) * 100);
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isSameDay(iso) {
  return iso === todayISO();
}

function App() {
  const [state, setState] = useState(() => loadState());
  const [activeModuleId, setActiveModuleId] = useState(CORE_MODULES[0]?.id || "agents");
  const [intelText, setIntelText] = useState("{");
  const [intelError, setIntelError] = useState("");
  const [blueprint, setBlueprint] = useState(() => ({ ...DEFAULT_BLUEPRINT_TEMPLATE }));
  const [workflowName, setWorkflowName] = useState("Cost-Cut Autopilot v1");
  const [dailyMinutes, setDailyMinutes] = useState(state.profile.timeBudgetMin || 120);

  const masteryPercent = useMemo(() => computeMasteryPercent(state), [state]);
  const module = useMemo(() => CORE_MODULES.find((m) => m.id === activeModuleId) || CORE_MODULES[0], [activeModuleId]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const streakTodayDone = useMemo(() => isSameDay(state.streak?.lastDoneISO || ""), [state]);

  function bumpStreak() {
    const iso = todayISO();
    setState((s) => {
      const last = s.streak?.lastDoneISO || "";
      let count = s.streak?.count || 0;
      if (isSameDay(last)) {
        return s;
      }
      // if yesterday, increment; else reset to 1
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yISO = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(
        yesterday.getDate()
      ).padStart(2, "0")}`;
      count = last === yISO ? count + 1 : 1;
      return { ...s, streak: { lastDoneISO: iso, count } };
    });
  }

  function toggleLesson(moduleId, lessonId) {
    setState((s) => {
      const next = structuredClone(s);
      next.mastery = next.mastery || {};
      next.mastery[moduleId] = next.mastery[moduleId] || {};
      next.mastery[moduleId][lessonId] = !next.mastery[moduleId][lessonId];
      return next;
    });
  }

  function updateNotes(moduleId, text) {
    setState((s) => ({ ...s, notes: { ...(s.notes || {}), [moduleId]: text } }));
  }

  function addIntelPack(pack) {
    setState((s) => ({
      ...s,
      intelPacks: [
        { id: uid(), createdAt: new Date().toISOString(), ...pack },
        ...(s.intelPacks || []),
      ].slice(0, 50),
    }));
  }

  function removeIntelPack(id) {
    setState((s) => ({ ...s, intelPacks: (s.intelPacks || []).filter((p) => p.id !== id) }));
  }

  function exportState() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `atlas-academy-state-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importStateFromFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const parsed = safeParseJSON(text);
      if (!parsed.ok) {
        alert(`Import failed: ${parsed.error}`);
        return;
      }
      setState({ ...DEFAULT_STATE, ...parsed.data });
    };
    reader.readAsText(file);
  }

  function generateDailyPlan(minutes) {
    // simple heuristic: 60% learning, 40% shipping
    const learn = Math.round(minutes * 0.6);
    const ship = minutes - learn;

    // pick one lesson not done
    const pending = CORE_MODULES.flatMap((m) =>
      m.lessons
        .filter((l) => !(state.mastery?.[m.id]?.[l.id]))
        .map((l) => ({ module: m, lesson: l }))
    );
    const lessonPick = pending[0] || { module: CORE_MODULES[0], lesson: CORE_MODULES[0].lessons[0] };

    const plan = {
      id: uid(),
      dateISO: todayISO(),
      minutes,
      blocks: [
        {
          title: `Learn: ${lessonPick.module.title} → ${lessonPick.lesson.title}`,
          minutes: clamp(lessonPick.lesson.timeMin, 15, learn),
          steps: lessonPick.lesson.checklist,
          moduleId: lessonPick.module.id,
          lessonId: lessonPick.lesson.id,
        },
        {
          title: "Ship: one automation improvement",
          minutes: ship,
          steps: [
            "Pick one real workflow you touch daily",
            "Remove one manual step",
            "Add one approval gate",
            "Add one metric (time saved or $ saved)",
            "Write a 5-line changelog",
          ],
        },
      ],
      principle: "Truth-first. Ship small. Compound daily.",
    };

    setState((s) => ({ ...s, dailyLog: [plan, ...(s.dailyLog || [])].slice(0, 30) }));
    bumpStreak();
  }

  function saveBlueprint() {
    const entry = {
      id: uid(),
      name: workflowName.trim() || `Blueprint ${todayISO()}`,
      createdAt: new Date().toISOString(),
      blueprint: { ...blueprint },
    };
    setState((s) => ({ ...s, workflowBlueprints: [entry, ...(s.workflowBlueprints || [])].slice(0, 20) }));
  }

  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  const blueprintMarkdown = useMemo(() => {
    const b = blueprint;
    const lines = [
      `# ${workflowName || "Workflow Blueprint"}`,
      "",
      `**Goal:** ${b.goal}`,
      "",
      `**Environment:** ${b.environment}`,
      "",
      "## Constraints",
      ...(b.constraints || []).map((x) => `- ${x}`),
      "",
      "## Signals (inputs)",
      ...(b.signals || []).map((x) => `- ${x}`),
      "",
      "## Actions (outputs)",
      ...(b.actions || []).map((x) => `- ${x}`),
      "",
      "## Monitoring",
      ...(b.monitoring || []).map((x) => `- ${x}`),
      "",
      "## Implementation Notes",
      "- Trigger: webhook or schedule",
      "- Approvals: human gate for payments/account changes",
      "- Audit: store every action + evidence",
      "- Cost: cap spend daily; alert on anomalies",
    ];
    return lines.join("\n");
  }, [blueprint, workflowName]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Rocket className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Atlas Academy 2026</h1>
                <Badge variant="secondary">Offline-first MVP</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Train like a frontier builder: learn the primitives, ship systems daily, and keep an audit trail.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" onClick={exportState} className="gap-2">
                <Download className="h-4 w-4" /> Export
              </Button>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm shadow-sm">
                <Upload className="h-4 w-4" /> Import
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) importStateFromFile(f);
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm text-muted-foreground">Mastery</div>
                  <div className="mt-2">
                    <ScoreRing value={masteryPercent} />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Progress across the core modules. Don’t chase 100%. Chase shipping.
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Daily streak</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="text-2xl font-bold tabular-nums">{state.streak?.count || 0}</div>
                    {streakTodayDone ? (
                      <Pill>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Done today
                      </Pill>
                    ) : (
                      <Pill>
                        <AlertTriangle className="mr-2 h-4 w-4" /> Not logged today
                      </Pill>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    One meaningful win per day. Consistency beats intensity.
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Tonight’s mission</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      type="number"
                      value={dailyMinutes}
                      onChange={(e) => setDailyMinutes(Number(e.target.value || 0))}
                      className="w-28"
                    />
                    <span className="text-sm text-muted-foreground">minutes available</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button className="gap-2" onClick={() => generateDailyPlan(clamp(dailyMinutes, 30, 360))}>
                      <Calendar className="h-4 w-4" /> Generate plan
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setState((s) => ({ ...s, profile: { ...s.profile, timeBudgetMin: dailyMinutes } }));
                      }}
                    >
                      Save default
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="learn" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="learn">Learn</TabsTrigger>
            <TabsTrigger value="ship">Ship</TabsTrigger>
            <TabsTrigger value="gigs">25 Gigs</TabsTrigger>
            <TabsTrigger value="social">Social Autopilot</TabsTrigger>
            <TabsTrigger value="intel">Intel Packs</TabsTrigger>
          </TabsList>

          <TabsContent value="learn" className="mt-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-2xl md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base">Core modules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {CORE_MODULES.map((m) => {
                    const done = m.lessons.filter((l) => state.mastery?.[m.id]?.[l.id]).length;
                    const pct = Math.round((done / m.lessons.length) * 100);
                    const Icon = m.icon;
                    const active = m.id === activeModuleId;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setActiveModuleId(m.id)}
                        className={`w-full rounded-2xl border px-3 py-3 text-left transition hover:shadow-sm ${
                          active ? "bg-muted" : "bg-background"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <div className="font-semibold">{m.title}</div>
                          </div>
                          <Badge variant={pct === 100 ? "default" : "secondary"}>{pct}%</Badge>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{m.why}</div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="rounded-2xl md:col-span-2">
                <CardHeader>
                  <SectionTitle
                    icon={module.icon}
                    title={module.title}
                    subtitle={module.why}
                    right={<Badge variant="outline">{module.skills.join(" • ")}</Badge>}
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    {module.lessons.map((l) => {
                      const checked = !!state.mastery?.[module.id]?.[l.id];
                      return (
                        <div key={l.id} className="rounded-2xl border p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <Checkbox checked={checked} onCheckedChange={() => toggleLesson(module.id, l.id)} />
                                <div className="font-semibold">{l.title}</div>
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">~{l.timeMin} min</div>
                            </div>
                            <Button
                              size="sm"
                              variant={checked ? "secondary" : "default"}
                              onClick={() => {
                                toggleLesson(module.id, l.id);
                                bumpStreak();
                              }}
                            >
                              {checked ? "Mark not done" : "Mark done"}
                            </Button>
                          </div>
                          <Separator className="my-3" />
                          <div className="grid gap-2">
                            {l.checklist.map((c, idx) => (
                              <div key={idx} className="text-sm">
                                • {c}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-2xl border p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="font-semibold">Notes (truth-first)</div>
                      <Pill>Write facts, links, and decisions you made.</Pill>
                    </div>
                    <Textarea
                      value={state.notes?.[module.id] || ""}
                      onChange={(e) => updateNotes(module.id, e.target.value)}
                      placeholder="What did you learn? What broke? What will you change tomorrow?"
                      className="min-h-[140px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4 rounded-2xl">
              <CardHeader>
                <SectionTitle icon={ClipboardList} title="Daily Plans" subtitle="Generated plans show up here (last 30)." />
              </CardHeader>
              <CardContent className="space-y-3">
                {(state.dailyLog || []).length === 0 ? (
                  <div className="text-sm text-muted-foreground">Generate your first plan above.</div>
                ) : (
                  (state.dailyLog || []).map((p) => (
                    <div key={p.id} className="rounded-2xl border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-semibold">{p.dateISO} • {p.minutes} minutes</div>
                        <Badge variant="secondary">{p.principle}</Badge>
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {p.blocks.map((b, i) => (
                          <div key={i} className="rounded-2xl bg-muted p-3">
                            <div className="font-semibold">{b.title}</div>
                            <div className="text-xs text-muted-foreground">{b.minutes} min</div>
                            <div className="mt-2 grid gap-1 text-sm">
                              {b.steps.map((s, idx) => (
                                <div key={idx}>• {s}</div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ship" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-2xl">
                <CardHeader>
                  <SectionTitle
                    icon={Workflow}
                    title="Workflow Builder (plug-and-play blueprint)"
                    subtitle="Describe your objective and constraints. Output is a blueprint you can paste into your automation tool."
                    right={
                      <Button variant="secondary" className="gap-2" onClick={() => copy(blueprintMarkdown)}>
                        <Copy className="h-4 w-4" /> Copy
                      </Button>
                    }
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <div className="text-sm font-semibold">Blueprint name</div>
                    <Input value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
                  </div>

                  <div className="grid gap-2">
                    <div className="text-sm font-semibold">Goal</div>
                    <Textarea
                      value={blueprint.goal}
                      onChange={(e) => setBlueprint((b) => ({ ...b, goal: e.target.value }))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="text-sm font-semibold">Environment</div>
                    <Textarea
                      value={blueprint.environment}
                      onChange={(e) => setBlueprint((b) => ({ ...b, environment: e.target.value }))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="text-sm font-semibold">Constraints (one per line)</div>
                    <Textarea
                      value={(blueprint.constraints || []).join("\n")}
                      onChange={(e) =>
                        setBlueprint((b) => ({
                          ...b,
                          constraints: e.target.value
                            .split("\n")
                            .map((x) => x.trim())
                            .filter(Boolean),
                        }))
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="text-sm font-semibold">Signals / inputs (one per line)</div>
                    <Textarea
                      value={(blueprint.signals || []).join("\n")}
                      onChange={(e) =>
                        setBlueprint((b) => ({
                          ...b,
                          signals: e.target.value
                            .split("\n")
                            .map((x) => x.trim())
                            .filter(Boolean),
                        }))
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="text-sm font-semibold">Actions / outputs (one per line)</div>
                    <Textarea
                      value={(blueprint.actions || []).join("\n")}
                      onChange={(e) =>
                        setBlueprint((b) => ({
                          ...b,
                          actions: e.target.value
                            .split("\n")
                            .map((x) => x.trim())
                            .filter(Boolean),
                        }))
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="text-sm font-semibold">Monitoring (one per line)</div>
                    <Textarea
                      value={(blueprint.monitoring || []).join("\n")}
                      onChange={(e) =>
                        setBlueprint((b) => ({
                          ...b,
                          monitoring: e.target.value
                            .split("\n")
                            .map((x) => x.trim())
                            .filter(Boolean),
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button className="gap-2" onClick={saveBlueprint}>
                      <CheckCircle2 className="h-4 w-4" /> Save blueprint
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setWorkflowName("Cost-Cut Autopilot v1");
                        setBlueprint({ ...DEFAULT_BLUEPRINT_TEMPLATE });
                      }}
                    >
                      Reset
                    </Button>
                  </div>

                  <div className="rounded-2xl bg-muted p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">Output (Markdown)</div>
                    </div>
                    <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-background p-3 text-xs leading-relaxed">
                      {blueprintMarkdown}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <SectionTitle
                    icon={DollarSign}
                    title="Tool stack (default recommendation)"
                    subtitle="Choose boring, reliable primitives. Fancy comes later."
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  {TOOL_STACK.map((layer) => (
                    <div key={layer.layer} className="rounded-2xl border p-4">
                      <div className="font-semibold">{layer.layer}</div>
                      <div className="mt-2 grid gap-2">
                        {layer.items.map((it) => (
                          <div key={it.name} className="flex items-start justify-between gap-3 rounded-xl bg-muted p-3">
                            <div>
                              <div className="font-semibold">{it.name}</div>
                              <div className="text-xs text-muted-foreground">{it.why}</div>
                            </div>
                            <Badge variant="secondary">core</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="rounded-2xl border p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-xl bg-muted p-2">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Non-negotiables</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          If the automation touches money, identity, or protected data: add approvals, logs, and least-privilege access.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-muted p-4">
                    <div className="font-semibold">Saved blueprints</div>
                    {(state.workflowBlueprints || []).length === 0 ? (
                      <div className="mt-2 text-sm text-muted-foreground">Save your first blueprint to build a library.</div>
                    ) : (
                      <div className="mt-2 grid gap-2">
                        {(state.workflowBlueprints || []).map((b) => (
                          <div key={b.id} className="rounded-2xl bg-background p-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-semibold">{b.name}</div>
                              <Button size="sm" variant="secondary" onClick={() => copy(markdownFromSaved(b))} className="gap-2">
                                <Copy className="h-4 w-4" /> Copy
                              </Button>
                            </div>
                            <div className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gigs" className="mt-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <SectionTitle
                  icon={TrendingUp}
                  title="25 ‘not obvious yet’ AI money paths"
                  subtitle="These are designed for 2026: agentic, multimodal, compliance-aware, and measurable ROI."
                />
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {SIDE_GIGS_25.map((g) => (
                  <div key={g.id} className="rounded-2xl border p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold">{g.name}</div>
                      <Badge variant="secondary">{g.pricing}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">Buyer: {g.buyer}</div>
                    <div className="mt-2 text-sm">{g.what}</div>
                    <div className="mt-2 text-xs text-muted-foreground">Why now: {g.whyNow}</div>
                    <div className="mt-3 flex items-start gap-2 rounded-xl bg-muted p-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4" />
                      <div className="text-xs text-muted-foreground">Risk note: {g.risk}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-2xl">
                <CardHeader>
                  <SectionTitle
                    icon={Video}
                    title="Two profiles (recommended)"
                    subtitle="Build from scratch or acquire legitimately (partnership, purchase, or hired admin). No account takeovers."
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <div className="text-sm font-semibold">Profile 1</div>
                    <div className="rounded-2xl border p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">TikTok • {state.social.niches.TikTok.brand}</div>
                        <Badge variant="secondary">Short-form</Badge>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">{state.social.niches.TikTok.promise}</div>
                      <Separator className="my-3" />
                      <div className="grid gap-1 text-sm">
                        <div>• Content pillars: cost-cut hacks, automation demos, agent fails + fixes</div>
                        <div>• CTA: free “automation template” download → email list</div>
                        <div>• Monetization: affiliate tools + coaching + SaaS waitlist</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="text-sm font-semibold">Profile 2</div>
                    <div className="rounded-2xl border p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">YouTube • {state.social.niches.YouTube.brand}</div>
                        <Badge variant="secondary">Long + Shorts</Badge>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">{state.social.niches.YouTube.promise}</div>
                      <Separator className="my-3" />
                      <div className="grid gap-1 text-sm">
                        <div>• Weekly: build one system end-to-end (with proof)</div>
                        <div>• Shorts: repurpose best 10 seconds with a hook</div>
                        <div>• Monetization: ads + sponsorships + paid templates</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-muted p-4">
                    <div className="font-semibold">Autopilot loop (ethical)</div>
                    <div className="mt-2 grid gap-1 text-sm">
                      <div>1) Research: 10 ideas/day from tool release notes + real problems</div>
                      <div>2) Script: 60–120 sec hook → payoff → CTA</div>
                      <div>3) Produce: batch record 5 videos in 45 min</div>
                      <div>4) Edit: fast captions + cuts</div>
                      <div>5) Schedule: queue 7 days</div>
                      <div>6) Review: daily analytics (manual) → double down</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <SectionTitle
                    icon={Zap}
                    title="Tonight’s content generator"
                    subtitle="Paste a topic. It outputs 10 hooks, 3 scripts, and 1 offer angle."
                  />
                </CardHeader>
                <CardContent className="space-y-3">
                  <ContentGen />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="intel" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-2xl">
                <CardHeader>
                  <SectionTitle
                    icon={Upload}
                    title="Intel Packs"
                    subtitle="Import curated ‘trend cards’ and tool notes as JSON. Offline now; fetch later."
                  />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl bg-muted p-4 text-sm">
                    <div className="font-semibold">Intel pack format (example)</div>
                    <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-background p-3 text-xs">
{`{
  "title": "Agentic AI in banking",
  "dateISO": "2025-12-21",
  "signals": ["autonomous budgeting", "regulatory risk"],
  "opportunity": "Build guardrails + audit trails for agents",
  "links": ["https://..."]
}`}
                    </pre>
                  </div>

                  <Textarea
                    className="min-h-[200px]"
                    value={intelText}
                    onChange={(e) => setIntelText(e.target.value)}
                    placeholder="Paste a JSON intel pack here"
                  />
                  {intelError ? <div className="text-sm text-destructive">{intelError}</div> : null}
                  <div className="flex gap-2">
                    <Button
                      className="gap-2"
                      onClick={() => {
                        const parsed = safeParseJSON(intelText);
                        if (!parsed.ok) {
                          setIntelError(parsed.error);
                          return;
                        }
                        setIntelError("");
                        addIntelPack(parsed.data);
                        setIntelText("{");
                      }}
                    >
                      <Upload className="h-4 w-4" /> Add intel
                    </Button>
                    <Button variant="secondary" onClick={() => setIntelText(JSON.stringify(sampleIntelPack(), null, 2))}>
                      Insert example
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <SectionTitle icon={TrendingUp} title="Your intel library" subtitle="Keep the best 50. Review weekly." />
                </CardHeader>
                <CardContent className="space-y-3">
                  {(state.intelPacks || []).length === 0 ? (
                    <div className="text-sm text-muted-foreground">No intel packs yet. Add one on the left.</div>
                  ) : (
                    (state.intelPacks || []).map((p) => (
                      <div key={p.id} className="rounded-2xl border p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-semibold">{p.title || "Untitled"}</div>
                            <div className="text-xs text-muted-foreground">{p.dateISO || ""}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={() => copy(JSON.stringify(p, null, 2))} className="gap-2">
                              <Copy className="h-4 w-4" /> Copy
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => removeIntelPack(p.id)}>
                              Remove
                            </Button>
                          </div>
                        </div>
                        {p.opportunity ? (
                          <div className="mt-2 text-sm">Opportunity: {p.opportunity}</div>
                        ) : null}
                        {Array.isArray(p.signals) && p.signals.length ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {p.signals.slice(0, 8).map((s, idx) => (
                              <Badge key={idx} variant="outline">{s}</Badge>
                            ))}
                          </div>
                        ) : null}
                        {Array.isArray(p.links) && p.links.length ? (
                          <div className="mt-3 text-xs text-muted-foreground">
                            Links: {p.links.slice(0, 3).join(" • ")}
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Built for: shipping daily, with guardrails. This MVP is offline-first—connect it to live feeds later.
        </footer>
      </div>
    </div>
  );
}

function markdownFromSaved(entry) {
  const b = entry.blueprint || {};
  const lines = [
    `# ${entry.name}`,
    "",
    `**Goal:** ${b.goal || ""}`,
    "",
    `**Environment:** ${b.environment || ""}`,
    "",
    "## Constraints",
    ...(b.constraints || []).map((x) => `- ${x}`),
    "",
    "## Signals (inputs)",
    ...(b.signals || []).map((x) => `- ${x}`),
    "",
    "## Actions (outputs)",
    ...(b.actions || []).map((x) => `- ${x}`),
    "",
    "## Monitoring",
    ...(b.monitoring || []).map((x) => `- ${x}`),
  ];
  return lines.join("\n");
}

function sampleIntelPack() {
  return {
    title: "Multimodal apps becoming default",
    dateISO: todayISO(),
    signals: ["text+image", "video understanding", "workflows in enterprise"],
    opportunity: "Build a screenshot-to-action assistant with approvals + audit logs.",
    links: ["https://example.com"],
  };
}

function ContentGen() {
  const [topic, setTopic] = useState("AI cost-cutting for small businesses");
  const [out, setOut] = useState(null);

  function gen() {
    const t = topic.trim() || "AI automation";
    const hooks = [
      `If you’re still paying for ${t}, you’re doing it wrong—here’s the 60-second fix.`,
      `I found a hidden money leak in ${t}. This is how you stop it today.`,
      `Here’s the ‘one agent’ workflow that replaces 3 tools in ${t}.`,
      `The fastest way to win with ${t} in 2026 is NOT what you think.`,
      `I built a plug-and-play system for ${t}. Watch what it does in 30 seconds.`,
      `This is how rich people will use ${t} next year (and why you should copy it).`,
      `Stop hiring for this—automate ${t} with approvals and an audit trail.`,
      `The #1 mistake in ${t}: no cost caps. Fix it like this.`,
      `Here’s how to turn ${t} into a product you can sell weekly.`,
      `I tested 5 approaches to ${t}. Only one actually saved time.`
    ];

    const scripts = [
      {
        title: "60–75 sec demo",
        beats: [
          "Hook (0–3s): big promise + proof",
          "Context (3–10s): who this is for",
          "Steps (10–55s): 3 actions + 1 approval gate",
          "Result (55–65s): time/$ saved",
          "CTA (65–75s): ‘comment TEMPLATE’ / link in bio",
        ],
      },
      {
        title: "Myth-bust",
        beats: [
          "Hook: ‘Everyone thinks X…’",
          "Reality: ‘Actually Y…’",
          "Mini-framework: signal → decision → action → audit",
          "CTA: ‘I’ll drop the exact workflow’",
        ],
      },
      {
        title: "Case study",
        beats: [
          "Hook: ‘We cut costs by ___ in ___ days’",
          "What we tracked (inputs)",
          "What we automated (outputs)",
          "What we refused to automate (money/identity)",
          "CTA: ‘Want the checklist?’",
        ],
      },
    ];

    const offer = {
      angle: "Sell outcomes, not AI.",
      product: "$49 template pack + $499 setup + $199/mo monitoring",
      guarantee: "If you don’t save 5 hours/month or $200/month by day 30, I work free until you do.",
      disclaimer: "Guarantee must be realistic; avoid promising earnings.",
    };

    setOut({ hooks, scripts, offer });
  }

  useEffect(() => {
    gen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        <div className="text-sm font-semibold">Topic</div>
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Button className="gap-2" onClick={gen}>
          <Zap className="h-4 w-4" /> Generate
        </Button>
        {out ? (
          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => navigator.clipboard.writeText(JSON.stringify(out, null, 2))}
          >
            <Copy className="h-4 w-4" /> Copy JSON
          </Button>
        ) : null}
      </div>

      {out ? (
        <div className="grid gap-3">
          <div className="rounded-2xl border p-4">
            <div className="font-semibold">10 hooks</div>
            <div className="mt-2 grid gap-2 text-sm">
              {out.hooks.map((h, i) => (
                <div key={i}>• {h}</div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-4">
            <div className="font-semibold">3 scripts</div>
            <div className="mt-2 grid gap-3">
              {out.scripts.map((s, i) => (
                <div key={i} className="rounded-2xl bg-muted p-3">
                  <div className="font-semibold">{s.title}</div>
                  <div className="mt-2 grid gap-1 text-sm">
                    {s.beats.map((b, idx) => (
                      <div key={idx}>• {b}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-4">
            <div className="font-semibold">Offer angle</div>
            <div className="mt-2 text-sm">{out.offer.angle}</div>
            <div className="mt-2 text-sm">Product: {out.offer.product}</div>
            <div className="mt-2 text-sm">Guarantee: {out.offer.guarantee}</div>
            <div className="mt-2 text-xs text-muted-foreground">{out.offer.disclaimer}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
