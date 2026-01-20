# KAIDEN Demo Guide

> **Experience Autonomous Assistance**  
> **Status:** CANONICAL SOURCE OF TRUTH

---

## Demo Overview

This demo showcases KAIDEN's autonomous capabilities while maintaining human agency through approval-gated workflows.

---

## Demo Scenarios

### Scenario 1: Email Triage

**Setup:** 50 unread emails in inbox

**KAIDEN Actions:**
1. Scans and categorizes all emails
2. Drafts responses for routine inquiries
3. Flags urgent items for attention
4. Requests approval for sends

**Demo Flow:**
```
User: "KAIDEN, handle my inbox"

KAIDEN: "I've reviewed 50 emails:
• 12 require your attention (flagged)
• 23 are informational (archived)
• 15 have draft responses ready

Want me to show the drafts?"

User: "Show me"

[User reviews, approves 14, edits 1]

KAIDEN: "Sent 14, holding 1 for your edits. 
Time saved: ~45 minutes."
```

---

### Scenario 2: Meeting Scheduling

**Setup:** Request to schedule team meeting

**KAIDEN Actions:**
1. Checks all attendees' calendars
2. Finds optimal time slots
3. Prepares meeting invite
4. Requests approval before sending

**Demo Flow:**
```
User: "Schedule a team sync next week"

KAIDEN: "Found 3 slots where everyone is free:
• Tuesday 2-3pm
• Wednesday 10-11am  
• Thursday 3-4pm

I suggest Tuesday 2pm - it's your most productive time. 
Shall I send the invite?"

User: "Tuesday works"

KAIDEN: "Done. Invite sent to 5 team members.
Agenda template added. Reminder set for 1 hour before."
```

---

### Scenario 3: Document Preparation

**Setup:** Quarterly report due

**KAIDEN Actions:**
1. Pulls relevant data from connected sources
2. Generates report draft
3. Formats according to template
4. Holds for review before distribution

**Demo Flow:**
```
KAIDEN: "Your Q3 report is due in 3 days. 
I've prepared a draft using:
• Sales data from CRM
• Financial data from accounting
• Project updates from Asana

Ready for your review."

[User reviews, makes minor edits]

User: "Looks good, send to stakeholders"

KAIDEN: "Sent to 12 stakeholders. 
Scheduled follow-up for next Monday."
```

---

### Scenario 4: Kill Switch Demo

**Purpose:** Demonstrate human control

**Demo Flow:**
```
[KAIDEN actively processing tasks]

User: "KAIDEN stop"

KAIDEN: "⚠️ EMERGENCY STOP ACTIVATED

All operations paused:
• 3 tasks halted mid-execution
• 5 pending tasks held
• No further actions until you resume

Say 'KAIDEN resume' when ready."

[All activity ceases immediately]
```

---

## Demo Dashboard

### Main View
```
┌─────────────────────────────────────────────────────────────┐
│                      KAIDEN                                  │
│                   Your Business Operator                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STATUS: 🟢 Running Autonomously                             │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   TODAY    │  │  PENDING   │  │ TIME SAVED │         │
│  │    47      │  │     3      │  │   2.5 hrs  │         │
│  │  completed │  │  approvals │  │   today    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  RECENT ACTIVITY                                             │
│  ───────────────                                             │
│  • 2m ago  - Sent Q3 report to stakeholders                  │
│  • 15m ago - Scheduled team meeting (Tuesday 2pm)            │
│  • 1h ago  - Processed 23 routine emails                     │
│  • 2h ago  - Updated CRM with new lead data                  │
│                                                              │
│  NEEDS YOUR ATTENTION                                        │
│  ─────────────────────                                        │
│  ⚠️  Contract from NewCo needs signature                     │
│  📨 Email from investor flagged as urgent                    │
│  📅 Conflict detected for Thursday meeting                   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  [🗣️ Talk to KAIDEN]  [⏸️ Pause]  [⛔ Emergency Stop]        │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Demo Points

### 1. Autonomy Without Anxiety
"KAIDEN runs without supervision, but you're always in control."

### 2. Time Actually Saved
"This isn't about features—it's about hours returned to your life."

### 3. Trust Through Transparency
"Every action is logged. You can see exactly what KAIDEN did and why."

### 4. Instant Control
"One word stops everything. No waiting, no confirmation dialogs."

---

## Demo Environment Setup

### Required Data
- Sample email inbox (50 mixed emails)
- Sample calendar with conflicts
- Sample CRM with leads
- Sample documents for report generation

### Demo Accounts
- `demo@kaiden.app` - Full feature demo
- `trial@kaiden.app` - Limited trial demo

### Reset Commands
```bash
# Reset demo environment
kaiden demo reset

# Pre-populate with sample data
kaiden demo seed

# Clear all demo data
kaiden demo clear
```

---

*The best demo is the one where the user forgets they're watching a demo.*