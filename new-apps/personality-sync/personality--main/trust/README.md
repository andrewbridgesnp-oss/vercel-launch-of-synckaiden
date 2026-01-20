# KAIDEN Trust Framework

> **Approval-Gated Automation for Human Agency**  
> **Status:** CANONICAL SOURCE OF TRUTH

---

## Core Trust Model

```
┌─────────────────────────────────────────────────────────────┐
│                     TRUST PYRAMID                            │
│                                                              │
│                          /\                                  │
│                         /  \                                 │
│                        / L4 \   Full Autonomous              │
│                       /______\  (User grants complete trust) │
│                      /        \                              │
│                     /   L3     \  Pre-Approved Boundaries    │
│                    /____________\                            │
│                   /              \                           │
│                  /      L2        \  Approval Required       │
│                 /__________________\  (DEFAULT LEVEL)        │
│                /                    \                        │
│               /        L1            \  Suggest Only         │
│              /________________________\                      │
│             /                          \                     │
│            /           L0               \  Informational     │
│           /______________________________\                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Trust Levels Explained

### Level 0: Informational
- KAIDEN provides information only
- No actions taken on user's behalf
- Use case: New users, sensitive contexts

### Level 1: Suggested
- KAIDEN prepares and suggests actions
- User must manually execute
- Use case: Learning phase, high-stakes decisions

### Level 2: Approved (DEFAULT)
- KAIDEN prepares actions and requests approval
- Single-click approval to execute
- Use case: Most business operations

### Level 3: Pre-Approved Boundaries
- KAIDEN executes within defined rules
- No approval needed within boundaries
- Notifications sent for transparency
- Use case: Routine, repetitive tasks

### Level 4: Full Autonomous
- KAIDEN operates independently
- Summary reports only
- Emergency stop always available
- Use case: Fully trusted operations

---

## Trust Boundaries

### Per-Action Type Trust

```json
{
  "trust_configuration": {
    "email_drafting": "level_3",
    "email_sending": "level_2",
    "calendar_viewing": "level_4",
    "calendar_scheduling": "level_2",
    "document_creation": "level_3",
    "document_sharing": "level_2",
    "financial_viewing": "level_2",
    "financial_transactions": "level_1",
    "contact_management": "level_3",
    "external_communication": "level_2"
  }
}
```

### Trust Escalation

Actions can temporarily require higher approval:

```javascript
const escalationTriggers = {
  largeAmount: (amount) => amount > userSettings.threshold,
  newRecipient: (contact) => !knownContacts.includes(contact),
  offHours: (time) => !isBusinessHours(time),
  highFrequency: (count) => count > rateLimit,
  sensitiveContent: (content) => containsSensitive(content)
};
```

---

## Approval Flow

### Standard Approval Request

```
┌────────────────────────────────────────────────┐
│ 📨 KAIDEN needs your approval              │
│                                                │
│ Action: Send email to john@client.com         │
│ Subject: Q3 Report Follow-up                  │
│                                                │
│ This action is: REVERSIBLE                    │
│ (You can unsend within 30 seconds)            │
│                                                │
│ [Preview] [Approve] [Deny] [Ask KAIDEN]       │
└────────────────────────────────────────────────┘
```

### Batch Approval

For multiple similar actions:

```
┌────────────────────────────────────────────────┐
│ 📨 KAIDEN has 5 pending approvals            │
│                                                │
│ • 3 emails to known contacts                  │
│ • 1 calendar invitation                       │
│ • 1 document share                            │
│                                                │
│ [Review Each] [Approve All] [Deny All]        │
└────────────────────────────────────────────────┘
```

---

## Trust Building

### Progressive Autonomy

KAIDEN earns trust through performance:

```javascript
const trustProgression = {
  // Track successful completions
  successfulActions: 0,
  failedActions: 0,
  
  // Calculate trust score
  trustScore: () => {
    const total = successfulActions + failedActions;
    if (total < 10) return 'establishing';
    const successRate = successfulActions / total;
    if (successRate > 0.99) return 'excellent';
    if (successRate > 0.95) return 'good';
    if (successRate > 0.90) return 'fair';
    return 'needs_attention';
  },
  
  // Suggest trust level increases
  suggestUpgrade: (actionType) => {
    const history = getHistory(actionType);
    if (history.successRate > 0.99 && history.count > 20) {
      return `You've approved ${history.count} ${actionType} actions with 99%+ success. Want to auto-approve these?`;
    }
    return null;
  }
};
```

---

## Emergency Controls

### Kill Switch

**Activation:** Any of the following:
- Voice: "KAIDEN stop"
- UI: Emergency stop button
- API: `POST /api/kaiden/emergency-stop`
- Keyboard: Ctrl+Shift+K (in app)

**Effect:** Immediate halt of all operations

### Pause Mode

**Activation:** "KAIDEN pause" or UI toggle

**Effect:**
- Queue all new tasks
- Complete in-progress tasks
- Hold all approvals
- Resume on command

### Rollback

For reversible actions within window:

```javascript
const rollbackCapability = {
  email: { window: '30 seconds', method: 'unsend' },
  calendar: { window: '24 hours', method: 'delete_event' },
  document: { window: 'unlimited', method: 'version_restore' },
  notification: { window: 'none', method: 'cannot_rollback' }
};
```

---

## Audit & Transparency

### Action Log

Every action recorded with:

```json
{
  "action_id": "uuid",
  "timestamp": "ISO-8601",
  "action_type": "email_send",
  "trust_level_used": 2,
  "approval_status": "approved",
  "approved_by": "user_click",
  "execution_status": "completed",
  "reversible": true,
  "rollback_window_expires": "timestamp",
  "details": { /* action-specific */ }
}
```

### Weekly Trust Report

```
┌────────────────────────────────────────────────┐
│ 📊 Weekly Autonomy Report                    │
│                                                │
│ Actions completed: 147                        │
│ Approvals requested: 23                       │
│ Auto-completed (Level 3+): 124                │
│ Success rate: 99.3%                           │
│                                                │
│ Time saved: ~8.5 hours                        │
│                                                │
│ Suggested trust upgrades:                     │
│ • Email to team@company.com → Level 3        │
│ • Calendar scheduling → Level 3              │
│                                                │
│ [Review Suggestions] [Dismiss]                │
└────────────────────────────────────────────────┘
```

---

*Trust is earned, not assumed. KAIDEN proves herself through every successful action.*