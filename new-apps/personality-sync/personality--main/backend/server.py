"""
KAIDEN - Your Business Operator
Approval-Gated Automation for Human Agency

API Server for autonomous task execution with human oversight.
"""

from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from models.schemas import (
    Task,
    TaskCreate,
    TaskUpdate,
    TaskStatus,
    TrustLevel,
    ActionType,
    SystemStatus,
    ApprovalRequest,
    ApprovalResponse,
    TrustConfiguration,
    TrustConfigUpdate,
    KaidenStatus,
    ActivityLog,
    DailyMetrics,
    User,
    UserCreate,
)
from services.kaiden_engine import KaidenEngine, KaidenPersonality

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'kaiden')]

# Create the main app
app = FastAPI(
    title="KAIDEN API",
    description="Autonomous Business Operations with Human Agency",
    version="1.0.0"
)

# Create router with /api prefix
api_router = APIRouter(prefix="/api")

# Initialize KAIDEN engine
kaiden_engine = KaidenEngine(db)
personality = KaidenPersonality()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ==================== HEALTH & STATUS ====================

@api_router.get("/")
async def root():
    """API health check."""
    return {
        "status": "online",
        "service": "KAIDEN",
        "message": personality.greeting(),
        "version": "1.0.0"
    }


@api_router.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "database": "connected",
        "engine": "running"
    }


# ==================== USER MANAGEMENT ====================

@api_router.post("/users", response_model=User)
async def create_user(user_data: UserCreate):
    """Create a new user."""
    user = User(**user_data.model_dump())
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    user_dict['updated_at'] = user_dict['updated_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # Create default trust configuration
    trust_config = TrustConfiguration(user_id=user.id)
    trust_dict = trust_config.model_dump()
    trust_dict['created_at'] = trust_dict['created_at'].isoformat()
    trust_dict['updated_at'] = trust_dict['updated_at'].isoformat()
    await db.trust_configs.insert_one(trust_dict)
    
    # Create default KAIDEN status
    status = KaidenStatus(user_id=user.id)
    status_dict = status.model_dump()
    status_dict['created_at'] = status_dict['created_at'].isoformat()
    status_dict['updated_at'] = status_dict['updated_at'].isoformat()
    await db.kaiden_status.insert_one(status_dict)
    
    return user


@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get user by ID."""
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ==================== KAIDEN STATUS ====================

@api_router.get("/kaiden/status/{user_id}")
async def get_kaiden_status(user_id: str):
    """Get KAIDEN's current operational status for a user."""
    status = await db.kaiden_status.find_one({"user_id": user_id}, {"_id": 0})
    
    if not status:
        # Create default status
        status = KaidenStatus(user_id=user_id)
        status_dict = status.model_dump()
        status_dict['created_at'] = status_dict['created_at'].isoformat()
        status_dict['updated_at'] = status_dict['updated_at'].isoformat()
        await db.kaiden_status.insert_one(status_dict)
        status = status_dict
    
    # Get counts
    tasks_completed = await db.tasks.count_documents({
        "user_id": user_id,
        "status": TaskStatus.COMPLETED.value
    })
    tasks_pending = await db.tasks.count_documents({
        "user_id": user_id,
        "status": {"$in": [TaskStatus.PENDING.value, TaskStatus.RUNNING.value]}
    })
    approvals_pending = await db.approval_requests.count_documents({
        "user_id": user_id,
        "status": "pending"
    })
    
    # Get today's metrics
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    metrics = await db.daily_metrics.find_one(
        {"user_id": user_id, "date": today},
        {"_id": 0}
    )
    time_saved = metrics.get("time_saved_minutes", 0) if metrics else 0
    
    return {
        "status": status.get("status", SystemStatus.RUNNING.value),
        "tasks_completed_today": tasks_completed,
        "tasks_pending": tasks_pending,
        "approvals_pending": approvals_pending,
        "time_saved_minutes": time_saved,
        "greeting": personality.greeting(time_saved),
        "status_message": personality.status_update(tasks_completed, approvals_pending, time_saved)
    }


@api_router.post("/kaiden/emergency-stop/{user_id}")
async def emergency_stop(user_id: str):
    """Emergency stop - halt all KAIDEN operations immediately."""
    result = await kaiden_engine.emergency_stop(user_id)
    return result


@api_router.post("/kaiden/pause/{user_id}")
async def pause_kaiden(user_id: str, reason: Optional[str] = None):
    """Pause KAIDEN operations (less severe than emergency stop)."""
    await db.kaiden_status.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "status": SystemStatus.PAUSED.value,
                "paused_at": datetime.now(timezone.utc).isoformat(),
                "paused_reason": reason or "User requested pause",
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        },
        upsert=True
    )
    return {
        "status": "paused",
        "message": "Operations paused. Say 'resume' when ready."
    }


@api_router.post("/kaiden/resume/{user_id}")
async def resume_kaiden(user_id: str):
    """Resume KAIDEN operations."""
    result = await kaiden_engine.resume(user_id)
    return result


# ==================== TASK MANAGEMENT ====================

@api_router.post("/tasks/{user_id}", response_model=Task)
async def create_task(user_id: str, task_data: TaskCreate):
    """Create a new task for KAIDEN to process."""
    # Check if KAIDEN is running
    status = await db.kaiden_status.find_one({"user_id": user_id})
    if status and status.get("status") in [SystemStatus.STOPPED.value, SystemStatus.EMERGENCY_STOP.value]:
        raise HTTPException(
            status_code=400,
            detail="KAIDEN is currently stopped. Resume operations first."
        )
    
    # Create task
    task = Task(user_id=user_id, **task_data.model_dump())
    
    # Get user's trust configuration
    trust_config_doc = await db.trust_configs.find_one({"user_id": user_id}, {"_id": 0})
    if not trust_config_doc:
        trust_config = TrustConfiguration(user_id=user_id)
    else:
        trust_config_doc['created_at'] = datetime.fromisoformat(trust_config_doc['created_at'])
        trust_config_doc['updated_at'] = datetime.fromisoformat(trust_config_doc['updated_at'])
        trust_config = TrustConfiguration(**trust_config_doc)
    
    # Run through Hero Loop phases
    # 1. INTAKE
    task = await kaiden_engine.intake(task)
    
    # 2. ANALYZE
    analysis = await kaiden_engine.analyze(task, trust_config)
    
    # 3. DECIDE
    decision = await kaiden_engine.decide(task, analysis)
    
    # 4. EXECUTE (if approved)
    if decision["action"] == "execute":
        result = await kaiden_engine.execute(task)
        
        # 5. VERIFY
        verification = await kaiden_engine.verify(task.id, result)
        
        # 6. REPORT
        await kaiden_engine.report(task, verification, user_id)
    
    # Return updated task
    task_doc = await db.tasks.find_one({"id": task.id}, {"_id": 0})
    return task_doc


@api_router.get("/tasks/{user_id}", response_model=List[dict])
async def get_tasks(
    user_id: str,
    status: Optional[TaskStatus] = None,
    limit: int = Query(default=50, le=100),
    skip: int = 0
):
    """Get tasks for a user."""
    query = {"user_id": user_id}
    if status:
        query["status"] = status.value
    
    tasks = await db.tasks.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return tasks


@api_router.get("/tasks/{user_id}/{task_id}")
async def get_task(user_id: str, task_id: str):
    """Get a specific task."""
    task = await db.tasks.find_one({"id": task_id, "user_id": user_id}, {"_id": 0})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@api_router.patch("/tasks/{user_id}/{task_id}")
async def update_task(user_id: str, task_id: str, update: TaskUpdate):
    """Update a task."""
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.tasks.update_one(
        {"id": task_id, "user_id": user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return await db.tasks.find_one({"id": task_id}, {"_id": 0})


# ==================== APPROVAL MANAGEMENT ====================

@api_router.get("/approvals/{user_id}", response_model=List[dict])
async def get_pending_approvals(user_id: str):
    """Get all pending approval requests for a user."""
    approvals = await db.approval_requests.find(
        {"user_id": user_id, "status": "pending"},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return approvals


@api_router.post("/approvals/{user_id}/{approval_id}/respond")
async def respond_to_approval(user_id: str, approval_id: str, response: ApprovalResponse):
    """Respond to an approval request (approve or deny)."""
    result = await kaiden_engine.process_approval(approval_id, response.approved, user_id)
    
    # Update metrics
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    field = "approvals_granted" if response.approved else "approvals_denied"
    await db.daily_metrics.update_one(
        {"user_id": user_id, "date": today},
        {
            "$inc": {field: 1, "approvals_requested": 1},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        },
        upsert=True
    )
    
    return result


@api_router.post("/approvals/{user_id}/batch")
async def batch_approve(user_id: str, approval_ids: List[str], approved: bool = True):
    """Batch approve or deny multiple requests."""
    results = []
    for approval_id in approval_ids:
        result = await kaiden_engine.process_approval(approval_id, approved, user_id)
        results.append({"approval_id": approval_id, **result})
    
    return {
        "processed": len(results),
        "results": results
    }


# ==================== TRUST CONFIGURATION ====================

@api_router.get("/trust/{user_id}")
async def get_trust_config(user_id: str):
    """Get user's trust configuration."""
    config = await db.trust_configs.find_one({"user_id": user_id}, {"_id": 0})
    if not config:
        # Create default
        config = TrustConfiguration(user_id=user_id)
        config_dict = config.model_dump()
        config_dict['created_at'] = config_dict['created_at'].isoformat()
        config_dict['updated_at'] = config_dict['updated_at'].isoformat()
        await db.trust_configs.insert_one(config_dict)
        config = config_dict
    return config


@api_router.patch("/trust/{user_id}")
async def update_trust_config(user_id: str, update: TrustConfigUpdate):
    """Update user's trust configuration."""
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    # Convert nested models
    if "financial_limits" in update_data:
        update_data["financial_limits"] = update_data["financial_limits"].model_dump()
    if "quiet_hours" in update_data:
        update_data["quiet_hours"] = update_data["quiet_hours"].model_dump()
    if "emergency_contacts" in update_data:
        update_data["emergency_contacts"] = [c.model_dump() for c in update_data["emergency_contacts"]]
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.trust_configs.update_one(
        {"user_id": user_id},
        {"$set": update_data},
        upsert=True
    )
    
    return await db.trust_configs.find_one({"user_id": user_id}, {"_id": 0})


# ==================== ACTIVITY & METRICS ====================

@api_router.get("/activity/{user_id}", response_model=List[dict])
async def get_activity_log(
    user_id: str,
    limit: int = Query(default=50, le=100),
    skip: int = 0
):
    """Get user's activity log."""
    logs = await db.activity_logs.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return logs


@api_router.get("/metrics/{user_id}")
async def get_metrics(user_id: str, days: int = Query(default=7, le=30)):
    """Get user's metrics for the specified number of days."""
    from datetime import timedelta
    
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=days)
    
    metrics = await db.daily_metrics.find(
        {
            "user_id": user_id,
            "date": {
                "$gte": start_date.strftime("%Y-%m-%d"),
                "$lte": end_date.strftime("%Y-%m-%d")
            }
        },
        {"_id": 0}
    ).sort("date", -1).to_list(days)
    
    # Calculate totals
    total_completed = sum(m.get("tasks_completed", 0) for m in metrics)
    total_failed = sum(m.get("tasks_failed", 0) for m in metrics)
    total_time_saved = sum(m.get("time_saved_minutes", 0) for m in metrics)
    total_approvals = sum(m.get("approvals_requested", 0) for m in metrics)
    
    return {
        "period_days": days,
        "daily_metrics": metrics,
        "totals": {
            "tasks_completed": total_completed,
            "tasks_failed": total_failed,
            "time_saved_minutes": total_time_saved,
            "time_saved_hours": round(total_time_saved / 60, 1),
            "approvals_processed": total_approvals,
            "success_rate": round(total_completed / (total_completed + total_failed) * 100, 1) if (total_completed + total_failed) > 0 else 100
        }
    }


@api_router.get("/metrics/{user_id}/summary")
async def get_metrics_summary(user_id: str):
    """Get a quick summary of today's metrics."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    metrics = await db.daily_metrics.find_one(
        {"user_id": user_id, "date": today},
        {"_id": 0}
    )
    
    if not metrics:
        metrics = {
            "tasks_completed": 0,
            "tasks_failed": 0,
            "time_saved_minutes": 0,
            "approvals_requested": 0
        }
    
    pending_approvals = await db.approval_requests.count_documents({
        "user_id": user_id,
        "status": "pending"
    })
    
    return {
        "date": today,
        "tasks_completed": metrics.get("tasks_completed", 0),
        "time_saved_minutes": metrics.get("time_saved_minutes", 0),
        "pending_approvals": pending_approvals,
        "message": personality.status_update(
            metrics.get("tasks_completed", 0),
            pending_approvals,
            metrics.get("time_saved_minutes", 0)
        )
    }


# ==================== QUICK ACTIONS ====================

@api_router.post("/quick/{user_id}/email-draft")
async def quick_email_draft(user_id: str, recipient: str, subject: str, body: Optional[str] = None):
    """Quick action: Draft an email."""
    task_data = TaskCreate(
        action_type=ActionType.EMAIL_DRAFT,
        title=f"Draft email: {subject}",
        payload={"recipient": recipient, "subject": subject, "body": body or ""},
        source="quick_action"
    )
    return await create_task(user_id, task_data)


@api_router.post("/quick/{user_id}/schedule")
async def quick_schedule(user_id: str, title: str, date: str, time: str, attendees: Optional[List[str]] = None):
    """Quick action: Schedule a meeting."""
    task_data = TaskCreate(
        action_type=ActionType.CALENDAR_SCHEDULE,
        title=f"Schedule: {title}",
        payload={"event_title": title, "date": date, "time": time, "attendees": attendees or []},
        source="quick_action"
    )
    return await create_task(user_id, task_data)


@api_router.post("/quick/{user_id}/reminder")
async def quick_reminder(user_id: str, message: str, remind_at: str):
    """Quick action: Create a reminder."""
    task_data = TaskCreate(
        action_type=ActionType.REMINDER_CREATE,
        title=f"Reminder: {message}",
        payload={"message": message, "remind_at": remind_at},
        source="quick_action"
    )
    return await create_task(user_id, task_data)


@api_router.post("/quick/{user_id}/report")
async def quick_report(user_id: str, report_type: str, period: str = "weekly"):
    """Quick action: Generate a report."""
    task_data = TaskCreate(
        action_type=ActionType.REPORT_GENERATE,
        title=f"Generate {period} {report_type} report",
        payload={"report_type": report_type, "period": period},
        source="quick_action"
    )
    return await create_task(user_id, task_data)


# Include router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
