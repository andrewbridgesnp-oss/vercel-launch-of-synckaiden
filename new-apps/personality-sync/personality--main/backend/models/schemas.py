from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from enum import Enum
import uuid


class TaskStatus(str, Enum):
    PENDING = "pending"
    AWAITING_APPROVAL = "awaiting_approval"
    APPROVED = "approved"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"
    ROLLED_BACK = "rolled_back"
    CANCELLED = "cancelled"


class TrustLevel(int, Enum):
    INFORMATIONAL = 0
    SUGGESTED = 1
    APPROVED = 2  # Default
    PRE_APPROVED = 3
    FULL_AUTO = 4


class ActionType(str, Enum):
    EMAIL_DRAFT = "email_draft"
    EMAIL_SEND = "email_send"
    CALENDAR_VIEW = "calendar_view"
    CALENDAR_SCHEDULE = "calendar_schedule"
    DOCUMENT_CREATE = "document_create"
    DOCUMENT_SHARE = "document_share"
    FINANCIAL_VIEW = "financial_view"
    FINANCIAL_TRANSACTION = "financial_transaction"
    CONTACT_MANAGE = "contact_manage"
    EXTERNAL_COMMUNICATION = "external_communication"
    DATA_ANALYSIS = "data_analysis"
    REPORT_GENERATE = "report_generate"
    REMINDER_CREATE = "reminder_create"
    TASK_ORGANIZE = "task_organize"


class SystemStatus(str, Enum):
    RUNNING = "running"
    PAUSED = "paused"
    STOPPED = "stopped"
    EMERGENCY_STOP = "emergency_stop"


# Task Models
class Task(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    action_type: ActionType
    title: str
    description: Optional[str] = None
    payload: Dict[str, Any] = Field(default_factory=dict)
    status: TaskStatus = TaskStatus.PENDING
    trust_level_required: TrustLevel = TrustLevel.APPROVED
    is_reversible: bool = True
    rollback_window_seconds: Optional[int] = 30
    priority: int = Field(default=5, ge=1, le=10)  # 1=highest, 10=lowest
    source: str = "user_input"  # user_input, scheduled, event_trigger, system
    retry_count: int = 0
    max_retries: int = 3
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    approved_by: Optional[str] = None


class TaskCreate(BaseModel):
    action_type: ActionType
    title: str
    description: Optional[str] = None
    payload: Dict[str, Any] = Field(default_factory=dict)
    priority: int = Field(default=5, ge=1, le=10)
    source: str = "user_input"


class TaskUpdate(BaseModel):
    status: Optional[TaskStatus] = None
    payload: Optional[Dict[str, Any]] = None
    priority: Optional[int] = None


# Approval Models
class ApprovalRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    task_id: str
    user_id: str
    action_type: ActionType
    action_summary: str
    details: Dict[str, Any] = Field(default_factory=dict)
    is_reversible: bool = True
    consequence_description: str
    expires_at: Optional[datetime] = None
    status: str = "pending"  # pending, approved, denied, expired
    response: Optional[str] = None
    responded_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ApprovalResponse(BaseModel):
    approved: bool
    comment: Optional[str] = None


# Trust Configuration Models
class FinancialLimits(BaseModel):
    auto_approve_max: float = 0
    daily_limit: float = 0
    require_2fa: bool = True


class QuietHours(BaseModel):
    enabled: bool = False
    start: str = "22:00"
    end: str = "07:00"
    trust_level_during: TrustLevel = TrustLevel.SUGGESTED


class EmergencyContact(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    can_kill_switch: bool = False


class TrustConfiguration(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    global_trust_level: TrustLevel = TrustLevel.APPROVED
    action_trust_overrides: Dict[str, int] = Field(default_factory=dict)
    pre_approved_contacts: List[str] = Field(default_factory=list)
    pre_approved_domains: List[str] = Field(default_factory=list)
    financial_limits: FinancialLimits = Field(default_factory=FinancialLimits)
    quiet_hours: QuietHours = Field(default_factory=QuietHours)
    emergency_contacts: List[EmergencyContact] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TrustConfigUpdate(BaseModel):
    global_trust_level: Optional[TrustLevel] = None
    action_trust_overrides: Optional[Dict[str, int]] = None
    pre_approved_contacts: Optional[List[str]] = None
    pre_approved_domains: Optional[List[str]] = None
    financial_limits: Optional[FinancialLimits] = None
    quiet_hours: Optional[QuietHours] = None
    emergency_contacts: Optional[List[EmergencyContact]] = None


# System Status Models
class KaidenStatus(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    status: SystemStatus = SystemStatus.RUNNING
    paused_at: Optional[datetime] = None
    paused_reason: Optional[str] = None
    tasks_completed_today: int = 0
    tasks_pending: int = 0
    approvals_pending: int = 0
    time_saved_minutes: float = 0
    last_activity_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Activity Log Models
class ActivityLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    task_id: Optional[str] = None
    action_type: str
    action_description: str
    trust_level_used: TrustLevel
    approval_status: Optional[str] = None
    execution_status: str
    is_reversible: bool = True
    rollback_expires_at: Optional[datetime] = None
    details: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Metrics Models
class DailyMetrics(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    date: str  # YYYY-MM-DD
    tasks_completed: int = 0
    tasks_failed: int = 0
    approvals_requested: int = 0
    approvals_granted: int = 0
    approvals_denied: int = 0
    auto_completed: int = 0
    time_saved_minutes: float = 0
    success_rate: float = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# User Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    avatar_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserCreate(BaseModel):
    email: str
    name: str
    avatar_url: Optional[str] = None
