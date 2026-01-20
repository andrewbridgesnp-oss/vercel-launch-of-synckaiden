# KAIDEN Hero Loop

> **The Autonomous Execution Cycle**  
> **Status:** CANONICAL SOURCE OF TRUTH

---

## Overview

The Hero Loop is KAIDEN's core operating cycle—the fundamental pattern by which she transforms user intent into autonomous action.

**Goal:** Maximize time returned while minimizing human intervention.

---

## The Loop

```
┌─────────────────────────────────────────────────────────────┐
│                      HERO LOOP                               │
│                                                              │
│   ┌─────────┐     ┌─────────┐     ┌─────────┐              │
│   │ INTAKE  │ ──► │ ANALYZE │ ──► │ DECIDE  │              │
│   └─────────┘     └─────────┘     └─────────┘              │
│        ▲                               │                    │
│        │                               ▼                    │
│   ┌─────────┐     ┌─────────┐     ┌─────────┐              │
│   │ REPORT  │ ◄── │ VERIFY  │ ◄── │ EXECUTE │              │
│   └─────────┘     └─────────┘     └─────────┘              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase Details

### 1. INTAKE
**Duration:** Instant to 30 seconds

**Sources:**
- User direct input (voice, text, upload)
- Scheduled triggers (time-based automation)
- Event triggers (email received, payment due, etc.)
- System triggers (error recovery, retry)

**Output:** Structured task object with:
- Intent classification
- Priority score
- Context bundle
- Required resources

```python
{
  "task_id": "uuid",
  "intent": "file_quarterly_taxes",
  "priority": "high",
  "context": {...},
  "source": "scheduled_trigger",
  "autonomy_level": 2
}
```

---

### 2. ANALYZE
**Duration:** 100ms to 5 seconds

**Process:**
1. Parse intent and extract requirements
2. Check against guardrails (see AI_GUARDRAILS.md)
3. Identify dependencies and prerequisites
4. Estimate time and resource requirements
5. Assess reversibility

**Outputs:**
- Execution plan
- Risk assessment
- Required approvals (if any)
- Estimated completion time

---

### 3. DECIDE
**Duration:** Instant (autonomous) or User-dependent (approval required)

**Decision Tree:**
```
Is action reversible?
├── Yes → Check autonomy level
│   ├── Level matches → PROCEED TO EXECUTE
│   └── Level too high → REQUEST APPROVAL
└── No → Check explicit pre-approval
    ├── Pre-approved → PROCEED TO EXECUTE
    └── Not pre-approved → REQUEST APPROVAL
```

**Approval Request Format:**
```
"I'm ready to [ACTION]. This will [CONSEQUENCE].
[REVERSIBLE/IRREVERSIBLE]. Approve?"
```

---

### 4. EXECUTE
**Duration:** Variable (seconds to hours for complex operations)

**Execution Principles:**
- **Atomic operations:** Each step succeeds or rolls back
- **Checkpointing:** Progress saved for recovery
- **Timeout handling:** Graceful degradation on delays
- **Retry logic:** Exponential backoff on failures

**States:**
- `pending` → Awaiting execution
- `running` → Currently executing
- `paused` → User or system paused
- `completed` → Successfully finished
- `failed` → Execution failed
- `rolled_back` → Reverted due to failure

---

### 5. VERIFY
**Duration:** 100ms to 30 seconds

**Verification Checks:**
- Action completed successfully?
- Expected outcome achieved?
- Side effects within acceptable range?
- Data integrity maintained?

**On Failure:**
1. Attempt auto-recovery if possible
2. Roll back to last checkpoint
3. Flag for human review if unrecoverable

---

### 6. REPORT
**Duration:** Instant

**Report Levels:**
- **Silent:** Log only, no notification
- **Summary:** End-of-day digest
- **Immediate:** Real-time notification
- **Urgent:** Interrupt user for critical issues

**Default:** Summary for successes, Immediate for failures

**Report Content:**
```
✅ [TASK] completed
   Time: X minutes
   Actions: [brief list]
   Next: [scheduled follow-ups if any]
```

---

## Loop Characteristics

### Continuous Operation
The Hero Loop runs continuously without supervision:
- Processes incoming tasks from all sources
- Maintains queue priority
- Handles concurrent operations
- Recovers from failures automatically

### Self-Healing
When failures occur:
1. Automatic retry with exponential backoff
2. Alternative path exploration
3. Graceful degradation
4. Human escalation as last resort

### Performance Targets

| Metric | Target |
|--------|--------|
| Intake latency | <100ms |
| Decision latency (autonomous) | <500ms |
| Execution start | <2s from decision |
| Recovery time | <30s for transient failures |
| Success rate | >99% |

---

## Kill Switch Behavior

When kill switch activated:
1. All `running` tasks → `paused`
2. No new tasks started
3. All pending approvals → cancelled
4. User notified immediately
5. State preserved for review

**Resume:** Manual only, with confirmation

---

## Offline Behavior

When offline:
1. Queue tasks locally
2. Execute offline-capable operations
3. Mark online-required tasks as `pending_connectivity`
4. Sync and resume on reconnection

See: OFFLINE_FIRST.md

---

*The Hero Loop is KAIDEN's heartbeat. Every optimization must preserve its integrity.*