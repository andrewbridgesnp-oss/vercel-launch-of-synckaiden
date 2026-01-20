# KAIDEN AI Guardrails

> **Safety Constraints for Autonomous Operation**  
> **Status:** CANONICAL SOURCE OF TRUTH  
> **Enforcement:** MANDATORY - NO EXCEPTIONS

---

## Guiding Principle

**KAIDEN is autonomous in execution, not in authority.**

All irreversible actions require explicit human consent.  
All reversible actions operate within pre-defined boundaries.

---

## Constraint Categories

### 🔴 HARD STOPS (Never Autonomous)

These actions ALWAYS require explicit human approval:

| Action | Reason |
|--------|--------|
| Send money/payments | Financial irreversibility |
| Delete data permanently | Data loss irreversibility |
| Contact new external parties | Relationship implications |
| Legal document submission | Legal binding |
| Account credential changes | Security critical |
| Cancel subscriptions/services | Service interruption |
| Public posts/publications | Reputation impact |
| Contract signatures | Legal binding |

**Implementation:**
```python
HARD_STOPS = [
    "financial_transaction",
    "permanent_deletion",
    "new_contact_outreach",
    "legal_submission",
    "credential_change",
    "service_cancellation",
    "public_publication",
    "contract_execution"
]
```

---

### 🟡 SOFT GATES (Approval Recommended)

These actions request approval by default but can be pre-authorized:

| Action | Default | Can Pre-Auth? |
|--------|---------|---------------|
| Email to known contacts | Ask | ✅ Yes |
| Calendar changes | Ask | ✅ Yes |
| Document generation | Ask | ✅ Yes |
| Report distribution | Ask | ✅ Yes |
| Data exports | Ask | ✅ Yes |
| Internal notifications | Ask | ✅ Yes |

**Pre-authorization format:**
```json
{
  "action_type": "email_known_contact",
  "conditions": {
    "contacts": ["team@company.com"],
    "max_frequency": "5/day",
    "content_filter": "business_only"
  },
  "expires": "2025-12-31"
}
```

---

### 🟢 AUTONOMOUS ZONE (No Approval Needed)

These actions execute without approval:

| Action | Constraint |
|--------|------------|
| Data organization | User's own data only |
| Analysis & insights | Read-only operations |
| Draft preparation | No send/submit |
| Schedule optimization | Suggest only |
| Status monitoring | Passive observation |
| Report generation | Internal only |
| Search & retrieval | User's data scope |
| Reminder creation | Self-notifications |

---

## Boundary Conditions

### Financial Boundaries
```python
FINANCIAL_LIMITS = {
    "auto_approve_max": 0,  # No autonomous financial actions
    "daily_limit": 0,
    "requires_2fa": True,
    "cool_down_period": 300  # 5 min between requests
}
```

### Communication Boundaries
```python
COMMUNICATION_LIMITS = {
    "new_contact_auto": False,
    "known_contact_auto": False,  # Default, can enable
    "internal_auto": True,
    "max_emails_hour": 10,
    "content_scan": True  # Check for sensitive info
}
```

### Data Boundaries
```python
DATA_LIMITS = {
    "delete_auto": False,
    "export_auto": False,
    "share_auto": False,
    "organize_auto": True,
    "analyze_auto": True,
    "backup_auto": True
}
```

---

## Escalation Protocol

### Level 1: Soft Block
- Action paused
- User notified via app
- 24-hour timeout, then reminder

### Level 2: Hard Block
- Action stopped
- Requires active approval
- Cannot auto-proceed

### Level 3: Emergency Stop
- All operations halted
- User notified via all channels
- Manual restart required

---

## Anomaly Detection

KAIDEN monitors for unusual patterns:

| Signal | Response |
|--------|----------|
| Unusual request volume | Rate limit + notify |
| Off-hours activity | Confirm user identity |
| Large data operations | Approval required |
| Multiple failures | Pause + investigate |
| Unknown command patterns | Clarify before act |

---

## Override Protocol

### User Override
Users can temporarily elevate autonomy:
```
"KAIDEN, for the next hour, auto-approve emails to my team."
```
- Time-limited
- Logged
- Revocable instantly

### Emergency Override
Admins can force-stop all operations:
```
POST /api/kaiden/emergency-stop
Authorization: Admin-Token
```
- Immediate effect
- All tasks paused
- Requires manual resume

---

## Audit Trail

All actions logged with:
- Timestamp
- Action type
- Autonomy level used
- Approval status (if applicable)
- Execution result
- Rollback status (if applicable)

**Retention:** 90 days minimum, user-exportable

---

## Guardrail Violations

If KAIDEN detects potential guardrail bypass:

1. **Halt immediately**
2. **Log incident with full context**
3. **Notify user**
4. **Require explicit re-authorization**
5. **Report to system administrators**

---

## Testing Requirements

All guardrails must be:
- Unit tested for enforcement
- Integration tested for bypass resistance
- Penetration tested quarterly
- Reviewed after any security incident

---

*These guardrails are non-negotiable. Any code that bypasses them is a critical security vulnerability.*