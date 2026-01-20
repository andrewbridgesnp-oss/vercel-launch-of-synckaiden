# 🔌 API Documentation - Agentic AI Business Swarm

## Overview

The Agentic AI Business Swarm platform provides a comprehensive API for interacting with autonomous agents, workflows, and predictive analytics.

**Base URL**: `https://api.agenticaiswarm.com/v1`

**Authentication**: Bearer Token

```bash
Authorization: Bearer YOUR_API_KEY_HERE
```

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Agents](#agents)
3. [Workflows](#workflows)
4. [Analytics](#analytics)
5. [Insights](#insights)
6. [Integrations](#integrations)
7. [Webhooks](#webhooks)
8. [Rate Limits](#rate-limits)

---

## 🔐 Authentication

### Get API Key

```http
POST /auth/api-key
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response**:
```json
{
  "apiKey": "sk_live_xxxxxxxxxxxx",
  "expiresAt": "2026-12-28T00:00:00Z"
}
```

---

## 🤖 Agents

### List All Agents

```http
GET /agents
```

**Query Parameters**:
- `status` (optional): Filter by status (`active`, `idle`, `offline`)
- `type` (optional): Filter by agent type
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response**:
```json
{
  "agents": [
    {
      "id": "agent_alpha_001",
      "name": "Agent Alpha",
      "type": "Market Intelligence",
      "status": "active",
      "efficiency": 94.2,
      "tasksCompleted": 1247,
      "currentTask": "Analyzing market trends",
      "capabilities": ["Data Analysis", "Market Research", "Forecasting"],
      "createdAt": "2026-01-01T00:00:00Z",
      "lastActive": "2026-12-28T12:00:00Z"
    }
  ],
  "total": 24,
  "limit": 50,
  "offset": 0
}
```

### Get Single Agent

```http
GET /agents/:agentId
```

**Response**:
```json
{
  "id": "agent_alpha_001",
  "name": "Agent Alpha",
  "type": "Market Intelligence",
  "status": "active",
  "efficiency": 94.2,
  "metrics": {
    "tasksCompleted": 1247,
    "successRate": 98.5,
    "avgResponseTime": 1.2,
    "uptime": 99.9
  },
  "currentTask": {
    "id": "task_12345",
    "name": "Market Analysis Q4",
    "startedAt": "2026-12-28T11:30:00Z"
  },
  "performance": {
    "efficiency": 94,
    "speed": 92,
    "accuracy": 96,
    "reliability": 95
  }
}
```

### Create Agent

```http
POST /agents
```

**Request Body**:
```json
{
  "name": "Agent Omega",
  "type": "Custom Intelligence",
  "capabilities": ["Data Analysis", "Forecasting"],
  "config": {
    "maxConcurrentTasks": 5,
    "priority": "high"
  }
}
```

**Response**:
```json
{
  "id": "agent_omega_001",
  "name": "Agent Omega",
  "status": "initializing",
  "createdAt": "2026-12-28T12:00:00Z"
}
```

### Update Agent

```http
PATCH /agents/:agentId
```

**Request Body**:
```json
{
  "status": "paused",
  "config": {
    "maxConcurrentTasks": 10
  }
}
```

### Delete Agent

```http
DELETE /agents/:agentId
```

### Agent Actions

#### Start Agent
```http
POST /agents/:agentId/start
```

#### Stop Agent
```http
POST /agents/:agentId/stop
```

#### Assign Task
```http
POST /agents/:agentId/tasks
```

**Request Body**:
```json
{
  "taskType": "analysis",
  "data": {
    "target": "revenue_forecast",
    "timeRange": "Q1_2026"
  },
  "priority": "high"
}
```

---

## ⚡ Workflows

### List Workflows

```http
GET /workflows
```

**Response**:
```json
{
  "workflows": [
    {
      "id": "wf_001",
      "name": "Customer Onboarding",
      "status": "active",
      "triggers": ["webhook", "schedule"],
      "nodes": 12,
      "executions": 1847,
      "successRate": 98.5,
      "createdAt": "2026-01-15T00:00:00Z"
    }
  ]
}
```

### Create Workflow

```http
POST /workflows
```

**Request Body**:
```json
{
  "name": "New Workflow",
  "description": "Custom automation workflow",
  "nodes": [
    {
      "id": "node_1",
      "type": "trigger",
      "config": {
        "type": "webhook",
        "url": "/webhook/custom"
      }
    },
    {
      "id": "node_2",
      "type": "action",
      "agentId": "agent_alpha_001",
      "config": {
        "action": "analyze_data"
      }
    }
  ],
  "connections": [
    {
      "from": "node_1",
      "to": "node_2"
    }
  ]
}
```

### Execute Workflow

```http
POST /workflows/:workflowId/execute
```

**Request Body**:
```json
{
  "input": {
    "customerId": "cust_123",
    "data": {}
  }
}
```

**Response**:
```json
{
  "executionId": "exec_12345",
  "status": "running",
  "startedAt": "2026-12-28T12:00:00Z"
}
```

### Get Workflow Execution

```http
GET /workflows/:workflowId/executions/:executionId
```

---

## 📊 Analytics

### Get Dashboard Metrics

```http
GET /analytics/dashboard
```

**Query Parameters**:
- `timeRange`: `24h`, `7d`, `30d`, `90d`
- `metrics`: Comma-separated list of metrics

**Response**:
```json
{
  "timeRange": "7d",
  "metrics": {
    "totalAgents": 24,
    "activeAgents": 18,
    "tasksCompleted": 12847,
    "averageEfficiency": 92.4,
    "predictions": 156,
    "automations": 43
  },
  "trends": {
    "efficiency": {
      "current": 92.4,
      "previous": 88.6,
      "change": 4.3
    }
  }
}
```

### Get Predictive Analytics

```http
GET /analytics/predictions
```

**Response**:
```json
{
  "predictions": [
    {
      "id": "pred_001",
      "type": "revenue",
      "title": "Q1 Revenue Forecast",
      "confidence": 94.2,
      "value": 1250000,
      "timeframe": "2026-Q1",
      "insights": [
        "12% growth expected",
        "EMEA region outperforming",
        "Seasonal trends favorable"
      ]
    }
  ]
}
```

### Get Agent Performance

```http
GET /analytics/agents/:agentId/performance
```

**Query Parameters**:
- `timeRange`: Time range for analysis
- `metrics`: Specific metrics to include

**Response**:
```json
{
  "agentId": "agent_alpha_001",
  "timeRange": "7d",
  "performance": {
    "efficiency": [
      { "date": "2026-12-21", "value": 92 },
      { "date": "2026-12-22", "value": 94 }
    ],
    "tasksCompleted": 234,
    "avgResponseTime": 1.2,
    "successRate": 98.5
  }
}
```

---

## 💡 Insights

### Get AI Insights

```http
GET /insights
```

**Query Parameters**:
- `type`: Filter by type (`opportunity`, `warning`, `recommendation`)
- `priority`: Filter by priority (`high`, `medium`, `low`)
- `limit`: Number of results

**Response**:
```json
{
  "insights": [
    {
      "id": "insight_001",
      "type": "opportunity",
      "priority": "high",
      "title": "Revenue Optimization Detected",
      "description": "12% increase opportunity identified in EMEA",
      "impact": "+$47K MRR",
      "confidence": 94.2,
      "agent": "agent_gamma_001",
      "createdAt": "2026-12-28T11:30:00Z",
      "actions": [
        {
          "id": "action_001",
          "label": "Review Strategy",
          "url": "/strategies/revenue-optimization"
        }
      ]
    }
  ]
}
```

### Create Manual Insight

```http
POST /insights
```

**Request Body**:
```json
{
  "type": "recommendation",
  "priority": "medium",
  "title": "Custom Insight",
  "description": "Manual insight from analysis",
  "impact": "TBD"
}
```

---

## 🔗 Integrations

### Kayden AI Integration

#### Get Sync Status
```http
GET /integrations/kayden-ai/status
```

**Response**:
```json
{
  "connected": true,
  "lastSync": "2026-12-28T12:00:00Z",
  "syncStatus": "synced",
  "activeSessions": 3,
  "dataPoints": 15847
}
```

#### Trigger Manual Sync
```http
POST /integrations/kayden-ai/sync
```

### n8n Integration

#### Get Templates
```http
GET /integrations/n8n/templates
```

**Query Parameters**:
- `category`: Filter by category
- `search`: Search term
- `limit`: Number of results

**Response**:
```json
{
  "templates": [
    {
      "id": "n8n_template_001",
      "name": "Customer Onboarding",
      "category": "Sales & Marketing",
      "nodes": 12,
      "downloads": 8547,
      "rating": 4.8,
      "description": "Automated customer onboarding workflow"
    }
  ],
  "total": 100
}
```

#### Import Template
```http
POST /integrations/n8n/templates/:templateId/import
```

---

## 🔔 Webhooks

### Create Webhook

```http
POST /webhooks
```

**Request Body**:
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["agent.status.changed", "workflow.completed", "insight.created"],
  "secret": "your_webhook_secret"
}
```

### Webhook Events

Available events:
- `agent.created`
- `agent.status.changed`
- `agent.task.completed`
- `workflow.executed`
- `workflow.completed`
- `workflow.failed`
- `insight.created`
- `prediction.generated`

### Webhook Payload Example

```json
{
  "id": "evt_12345",
  "type": "agent.task.completed",
  "timestamp": "2026-12-28T12:00:00Z",
  "data": {
    "agentId": "agent_alpha_001",
    "taskId": "task_12345",
    "result": {
      "status": "success",
      "output": {}
    }
  }
}
```

---

## ⚡ Rate Limits

| Tier | Requests/Hour | Concurrent Agents | Workflows/Day |
|------|---------------|-------------------|---------------|
| Free | 1,000 | 3 | 10 |
| Pro | 10,000 | 24 | 1,000 |
| Enterprise | Unlimited | Unlimited | Unlimited |

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9847
X-RateLimit-Reset: 1735401600
```

---

## 🔒 Security Best Practices

1. **Never expose API keys** in client-side code
2. **Use environment variables** for sensitive data
3. **Implement webhook signature verification**
4. **Enable 2FA** for account access
5. **Rotate API keys** regularly
6. **Use HTTPS** for all API calls

---

## 📝 SDKs & Libraries

### JavaScript/TypeScript

```bash
npm install @agenticai/sdk
```

```typescript
import { AgenticAI } from '@agenticai/sdk';

const client = new AgenticAI({
  apiKey: process.env.AGENTIC_AI_API_KEY
});

// List agents
const agents = await client.agents.list();

// Create workflow
const workflow = await client.workflows.create({
  name: 'My Workflow',
  nodes: [...]
});
```

### Python

```bash
pip install agentic-ai
```

```python
from agentic_ai import Client

client = Client(api_key='YOUR_API_KEY')

# Get insights
insights = client.insights.list(type='opportunity')
```

---

## 🐛 Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

**Error Response Format**:
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Agent ID is required",
    "details": {}
  }
}
```

---

## 📞 Support

- **API Status**: [status.agenticaiswarm.com](https://status.agenticaiswarm.com)
- **Documentation**: [docs.agenticaiswarm.com](https://docs.agenticaiswarm.com)
- **Support Email**: api-support@agenticaiswarm.com
- **Discord**: [discord.gg/agenticaiswarm](https://discord.gg/agenticaiswarm)

---

**API Version**: 1.0.0 | **Last Updated**: December 28, 2025
