"""
KAIDEN Autonomous Task Engine

The Hero Loop implementation - KAIDEN's core operating cycle.
INTAKE -> ANALYZE -> DECIDE -> EXECUTE -> VERIFY -> REPORT
"""

import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.schemas import (
    Task,
    TaskStatus,
    TrustLevel,
    ActionType,
    ApprovalRequest,
    TrustConfiguration,
    ActivityLog,
    KaidenStatus,
    SystemStatus,
)

logger = logging.getLogger(__name__)

# Hard stops - actions that ALWAYS require explicit approval
HARD_STOPS = [
    ActionType.FINANCIAL_TRANSACTION,
    ActionType.EXTERNAL_COMMUNICATION,
]

# Time estimates for different action types (in minutes)
TIME_ESTIMATES = {
    ActionType.EMAIL_DRAFT: 5,
    ActionType.EMAIL_SEND: 2,
    ActionType.CALENDAR_VIEW: 1,
    ActionType.CALENDAR_SCHEDULE: 10,
    ActionType.DOCUMENT_CREATE: 15,
    ActionType.DOCUMENT_SHARE: 3,
    ActionType.FINANCIAL_VIEW: 2,
    ActionType.FINANCIAL_TRANSACTION: 5,
    ActionType.CONTACT_MANAGE: 3,
    ActionType.EXTERNAL_COMMUNICATION: 10,
    ActionType.DATA_ANALYSIS: 20,
    ActionType.REPORT_GENERATE: 30,
    ActionType.REMINDER_CREATE: 1,
    ActionType.TASK_ORGANIZE: 5,
}


class KaidenEngine:
    """KAIDEN's autonomous task execution engine - The Hero Loop."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.personality = KaidenPersonality()
    
    # ==================== INTAKE PHASE ====================
    
    async def intake(self, task: Task) -> Task:
        """
        INTAKE: Receive and classify incoming tasks.
        Duration target: Instant to 30 seconds
        """
        logger.info(f"INTAKE: Processing task {task.id} - {task.title}")
        
        # Classify priority if not set
        if task.priority == 5:  # Default
            task.priority = self._classify_priority(task)
        
        # Set trust level requirement based on action type
        task.trust_level_required = self._determine_trust_requirement(task)
        
        # Determine reversibility
        task.is_reversible = self._is_reversible(task)
        
        # Save to database
        task_dict = task.model_dump()
        task_dict['created_at'] = task_dict['created_at'].isoformat()
        task_dict['updated_at'] = task_dict['updated_at'].isoformat()
        if task_dict.get('started_at'):
            task_dict['started_at'] = task_dict['started_at'].isoformat()
        if task_dict.get('completed_at'):
            task_dict['completed_at'] = task_dict['completed_at'].isoformat()
        if task_dict.get('approved_at'):
            task_dict['approved_at'] = task_dict['approved_at'].isoformat()
        
        await self.db.tasks.insert_one(task_dict)
        
        return task
    
    def _classify_priority(self, task: Task) -> int:
        """Auto-classify task priority based on type and content."""
        # Financial tasks are high priority
        if task.action_type in [ActionType.FINANCIAL_TRANSACTION, ActionType.FINANCIAL_VIEW]:
            return 2
        # External communications are medium-high
        if task.action_type == ActionType.EXTERNAL_COMMUNICATION:
            return 3
        # Routine tasks are lower priority
        if task.action_type in [ActionType.REMINDER_CREATE, ActionType.TASK_ORGANIZE]:
            return 7
        return 5
    
    def _determine_trust_requirement(self, task: Task) -> TrustLevel:
        """Determine required trust level for action."""
        if task.action_type in HARD_STOPS:
            return TrustLevel.APPROVED  # Always require approval
        
        # Map action types to default trust requirements
        trust_map = {
            ActionType.EMAIL_DRAFT: TrustLevel.PRE_APPROVED,
            ActionType.EMAIL_SEND: TrustLevel.APPROVED,
            ActionType.CALENDAR_VIEW: TrustLevel.FULL_AUTO,
            ActionType.CALENDAR_SCHEDULE: TrustLevel.APPROVED,
            ActionType.DOCUMENT_CREATE: TrustLevel.PRE_APPROVED,
            ActionType.DOCUMENT_SHARE: TrustLevel.APPROVED,
            ActionType.FINANCIAL_VIEW: TrustLevel.APPROVED,
            ActionType.DATA_ANALYSIS: TrustLevel.FULL_AUTO,
            ActionType.REPORT_GENERATE: TrustLevel.PRE_APPROVED,
            ActionType.REMINDER_CREATE: TrustLevel.FULL_AUTO,
            ActionType.TASK_ORGANIZE: TrustLevel.FULL_AUTO,
            ActionType.CONTACT_MANAGE: TrustLevel.PRE_APPROVED,
        }
        return trust_map.get(task.action_type, TrustLevel.APPROVED)
    
    def _is_reversible(self, task: Task) -> bool:
        """Determine if action can be rolled back."""
        irreversible = [
            ActionType.FINANCIAL_TRANSACTION,
            ActionType.EXTERNAL_COMMUNICATION,
        ]
        return task.action_type not in irreversible
    
    # ==================== ANALYZE PHASE ====================
    
    async def analyze(self, task: Task, user_trust_config: TrustConfiguration) -> Dict[str, Any]:
        """
        ANALYZE: Parse requirements, check guardrails, assess risk.
        Duration target: 100ms to 5 seconds
        """
        logger.info(f"ANALYZE: Analyzing task {task.id}")
        
        analysis = {
            "task_id": task.id,
            "can_execute": True,
            "requires_approval": False,
            "blocked_reason": None,
            "risk_level": "low",
            "estimated_time_minutes": TIME_ESTIMATES.get(task.action_type, 5),
            "dependencies": [],
            "guardrail_checks": []
        }
        
        # Check against guardrails
        guardrail_result = self._check_guardrails(task, user_trust_config)
        analysis["guardrail_checks"] = guardrail_result["checks"]
        
        if not guardrail_result["passed"]:
            analysis["can_execute"] = False
            analysis["blocked_reason"] = guardrail_result["reason"]
            return analysis
        
        # Determine if approval is needed
        user_trust_level = self._get_effective_trust_level(task, user_trust_config)
        
        if task.trust_level_required.value > user_trust_level.value:
            analysis["requires_approval"] = True
        
        # Hard stops always need approval
        if task.action_type in HARD_STOPS:
            analysis["requires_approval"] = True
            analysis["risk_level"] = "high"
        
        # Check quiet hours
        if user_trust_config.quiet_hours.enabled:
            if self._is_quiet_hours(user_trust_config.quiet_hours):
                analysis["requires_approval"] = True
                analysis["guardrail_checks"].append({
                    "check": "quiet_hours",
                    "passed": True,
                    "note": "Operating in quiet hours - elevated approval required"
                })
        
        return analysis
    
    def _check_guardrails(self, task: Task, config: TrustConfiguration) -> Dict[str, Any]:
        """Check task against all guardrails."""
        checks = []
        
        # Check financial limits
        if task.action_type == ActionType.FINANCIAL_TRANSACTION:
            amount = task.payload.get("amount", 0)
            if amount > config.financial_limits.auto_approve_max:
                checks.append({
                    "check": "financial_limit",
                    "passed": True,
                    "note": f"Amount ${amount} requires manual approval"
                })
        
        # Check for external contacts
        if task.action_type in [ActionType.EMAIL_SEND, ActionType.EXTERNAL_COMMUNICATION]:
            recipient = task.payload.get("recipient", "")
            domain = recipient.split("@")[-1] if "@" in recipient else ""
            
            is_known = (
                recipient in config.pre_approved_contacts or
                domain in config.pre_approved_domains
            )
            
            checks.append({
                "check": "contact_verification",
                "passed": True,
                "note": "Known contact" if is_known else "New contact - approval required"
            })
        
        return {
            "passed": True,
            "reason": None,
            "checks": checks
        }
    
    def _get_effective_trust_level(self, task: Task, config: TrustConfiguration) -> TrustLevel:
        """Get effective trust level for this action type."""
        # Check for action-specific override
        action_name = task.action_type.value
        if action_name in config.action_trust_overrides:
            return TrustLevel(config.action_trust_overrides[action_name])
        return config.global_trust_level
    
    def _is_quiet_hours(self, quiet_hours) -> bool:
        """Check if current time is within quiet hours."""
        now = datetime.now(timezone.utc)
        current_time = now.strftime("%H:%M")
        
        start = quiet_hours.start
        end = quiet_hours.end
        
        if start < end:
            return start <= current_time <= end
        else:  # Spans midnight
            return current_time >= start or current_time <= end
    
    # ==================== DECIDE PHASE ====================
    
    async def decide(self, task: Task, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        DECIDE: Determine whether to execute, request approval, or block.
        Duration target: Instant (autonomous) or User-dependent (approval required)
        """
        logger.info(f"DECIDE: Making decision for task {task.id}")
        
        decision = {
            "task_id": task.id,
            "action": "execute",  # execute, request_approval, block
            "reason": None,
            "approval_request": None
        }
        
        if not analysis["can_execute"]:
            decision["action"] = "block"
            decision["reason"] = analysis["blocked_reason"]
            
            # Update task status
            await self._update_task_status(task.id, TaskStatus.CANCELLED, error=analysis["blocked_reason"])
            return decision
        
        if analysis["requires_approval"]:
            decision["action"] = "request_approval"
            decision["reason"] = "Action requires human approval"
            
            # Create approval request
            approval = await self._create_approval_request(task, analysis)
            decision["approval_request"] = approval
            
            # Update task status
            await self._update_task_status(task.id, TaskStatus.AWAITING_APPROVAL)
            return decision
        
        # Can execute autonomously
        decision["reason"] = "Within autonomous boundaries"
        return decision
    
    async def _create_approval_request(self, task: Task, analysis: Dict[str, Any]) -> ApprovalRequest:
        """Create an approval request for human review."""
        consequence = "This action is reversible." if task.is_reversible else "This action is IRREVERSIBLE."
        
        approval = ApprovalRequest(
            task_id=task.id,
            user_id=task.user_id,
            action_type=task.action_type,
            action_summary=self.personality.format_approval_summary(task),
            details=task.payload,
            is_reversible=task.is_reversible,
            consequence_description=consequence,
            expires_at=datetime.now(timezone.utc) + timedelta(hours=24)
        )
        
        # Save to database
        approval_dict = approval.model_dump()
        approval_dict['created_at'] = approval_dict['created_at'].isoformat()
        if approval_dict.get('expires_at'):
            approval_dict['expires_at'] = approval_dict['expires_at'].isoformat()
        if approval_dict.get('responded_at'):
            approval_dict['responded_at'] = approval_dict['responded_at'].isoformat()
        
        await self.db.approval_requests.insert_one(approval_dict)
        
        return approval
    
    # ==================== EXECUTE PHASE ====================
    
    async def execute(self, task: Task) -> Dict[str, Any]:
        """
        EXECUTE: Perform the action.
        Duration target: Variable (seconds to hours for complex operations)
        """
        logger.info(f"EXECUTE: Executing task {task.id}")
        
        # Update status to running
        await self._update_task_status(task.id, TaskStatus.RUNNING)
        
        try:
            # Simulate execution based on action type
            result = await self._execute_action(task)
            
            # Update task with result
            await self.db.tasks.update_one(
                {"id": task.id},
                {
                    "$set": {
                        "result": result,
                        "status": TaskStatus.COMPLETED.value,
                        "completed_at": datetime.now(timezone.utc).isoformat(),
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
            
            return {
                "success": True,
                "task_id": task.id,
                "result": result
            }
            
        except Exception as e:
            logger.error(f"EXECUTE: Task {task.id} failed: {str(e)}")
            
            # Check if we should retry
            if task.retry_count < task.max_retries:
                await self.db.tasks.update_one(
                    {"id": task.id},
                    {
                        "$set": {
                            "status": TaskStatus.PENDING.value,
                            "retry_count": task.retry_count + 1,
                            "error": str(e),
                            "updated_at": datetime.now(timezone.utc).isoformat()
                        }
                    }
                )
                return {
                    "success": False,
                    "task_id": task.id,
                    "retry": True,
                    "error": str(e)
                }
            else:
                await self._update_task_status(task.id, TaskStatus.FAILED, error=str(e))
                return {
                    "success": False,
                    "task_id": task.id,
                    "retry": False,
                    "error": str(e)
                }
    
    async def _execute_action(self, task: Task) -> Dict[str, Any]:
        """Execute the specific action type."""
        # This is where actual integrations would happen
        # For now, simulate successful execution
        
        action_results = {
            ActionType.EMAIL_DRAFT: {
                "draft_id": f"draft_{task.id[:8]}",
                "status": "drafted",
                "message": self.personality.task_complete_message(task)
            },
            ActionType.EMAIL_SEND: {
                "message_id": f"msg_{task.id[:8]}",
                "status": "sent",
                "recipient": task.payload.get("recipient"),
                "message": self.personality.task_complete_message(task)
            },
            ActionType.CALENDAR_SCHEDULE: {
                "event_id": f"evt_{task.id[:8]}",
                "status": "scheduled",
                "message": self.personality.task_complete_message(task)
            },
            ActionType.DOCUMENT_CREATE: {
                "document_id": f"doc_{task.id[:8]}",
                "status": "created",
                "message": self.personality.task_complete_message(task)
            },
            ActionType.REPORT_GENERATE: {
                "report_id": f"rpt_{task.id[:8]}",
                "status": "generated",
                "message": self.personality.task_complete_message(task)
            },
            ActionType.REMINDER_CREATE: {
                "reminder_id": f"rem_{task.id[:8]}",
                "status": "set",
                "message": self.personality.task_complete_message(task)
            },
        }
        
        return action_results.get(task.action_type, {
            "status": "completed",
            "message": self.personality.task_complete_message(task)
        })
    
    # ==================== VERIFY PHASE ====================
    
    async def verify(self, task_id: str, execution_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        VERIFY: Confirm action completed successfully.
        Duration target: 100ms to 30 seconds
        """
        logger.info(f"VERIFY: Verifying task {task_id}")
        
        verification = {
            "task_id": task_id,
            "verified": execution_result.get("success", False),
            "checks": []
        }
        
        if execution_result.get("success"):
            verification["checks"].append({
                "check": "execution_complete",
                "passed": True
            })
        else:
            verification["checks"].append({
                "check": "execution_complete",
                "passed": False,
                "error": execution_result.get("error")
            })
        
        return verification
    
    # ==================== REPORT PHASE ====================
    
    async def report(self, task: Task, verification: Dict[str, Any], user_id: str) -> ActivityLog:
        """
        REPORT: Log action and notify user as appropriate.
        Duration target: Instant
        """
        logger.info(f"REPORT: Logging task {task.id}")
        
        # Create activity log
        log = ActivityLog(
            user_id=user_id,
            task_id=task.id,
            action_type=task.action_type.value,
            action_description=task.title,
            trust_level_used=task.trust_level_required,
            execution_status="completed" if verification["verified"] else "failed",
            is_reversible=task.is_reversible,
            rollback_expires_at=datetime.now(timezone.utc) + timedelta(seconds=task.rollback_window_seconds or 30) if task.is_reversible else None,
            details=verification
        )
        
        # Save to database
        log_dict = log.model_dump()
        log_dict['created_at'] = log_dict['created_at'].isoformat()
        if log_dict.get('rollback_expires_at'):
            log_dict['rollback_expires_at'] = log_dict['rollback_expires_at'].isoformat()
        
        await self.db.activity_logs.insert_one(log_dict)
        
        # Update daily metrics
        await self._update_metrics(user_id, task, verification["verified"])
        
        return log
    
    async def _update_metrics(self, user_id: str, task: Task, success: bool):
        """Update daily metrics after task completion."""
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        
        time_saved = TIME_ESTIMATES.get(task.action_type, 5)
        
        update_ops = {
            "$inc": {
                "tasks_completed" if success else "tasks_failed": 1,
                "time_saved_minutes": time_saved if success else 0
            },
            "$set": {
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
        
        await self.db.daily_metrics.update_one(
            {"user_id": user_id, "date": today},
            update_ops,
            upsert=True
        )
    
    # ==================== HELPER METHODS ====================
    
    async def _update_task_status(self, task_id: str, status: TaskStatus, error: str = None):
        """Update task status in database."""
        update = {
            "status": status.value,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        if status == TaskStatus.RUNNING:
            update["started_at"] = datetime.now(timezone.utc).isoformat()
        elif status in [TaskStatus.COMPLETED, TaskStatus.FAILED, TaskStatus.CANCELLED]:
            update["completed_at"] = datetime.now(timezone.utc).isoformat()
        
        if error:
            update["error"] = error
        
        await self.db.tasks.update_one({"id": task_id}, {"$set": update})
    
    async def process_approval(self, approval_id: str, approved: bool, user_id: str) -> Dict[str, Any]:
        """Process an approval response."""
        # Get approval request
        approval = await self.db.approval_requests.find_one({"id": approval_id})
        if not approval:
            return {"error": "Approval request not found"}
        
        # Update approval status
        await self.db.approval_requests.update_one(
            {"id": approval_id},
            {
                "$set": {
                    "status": "approved" if approved else "denied",
                    "responded_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        if approved:
            # Get and execute the task
            task_doc = await self.db.tasks.find_one({"id": approval["task_id"]})
            if task_doc:
                task_doc['created_at'] = datetime.fromisoformat(task_doc['created_at'])
                task_doc['updated_at'] = datetime.fromisoformat(task_doc['updated_at'])
                task = Task(**task_doc)
                
                await self.db.tasks.update_one(
                    {"id": task.id},
                    {
                        "$set": {
                            "status": TaskStatus.APPROVED.value,
                            "approved_at": datetime.now(timezone.utc).isoformat(),
                            "approved_by": user_id
                        }
                    }
                )
                
                # Execute the task
                result = await self.execute(task)
                verification = await self.verify(task.id, result)
                await self.report(task, verification, user_id)
                
                return {
                    "status": "executed",
                    "task_id": task.id,
                    "result": result
                }
        else:
            # Cancel the task
            await self._update_task_status(approval["task_id"], TaskStatus.CANCELLED)
            return {
                "status": "cancelled",
                "task_id": approval["task_id"]
            }
        
        return {"error": "Task not found"}
    
    async def emergency_stop(self, user_id: str) -> Dict[str, Any]:
        """Emergency stop - halt all operations immediately."""
        logger.warning(f"EMERGENCY STOP activated by user {user_id}")
        
        # Pause all running tasks
        result = await self.db.tasks.update_many(
            {"user_id": user_id, "status": TaskStatus.RUNNING.value},
            {
                "$set": {
                    "status": TaskStatus.PAUSED.value,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        # Update KAIDEN status
        await self.db.kaiden_status.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "status": SystemStatus.EMERGENCY_STOP.value,
                    "paused_at": datetime.now(timezone.utc).isoformat(),
                    "paused_reason": "Emergency stop activated",
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            },
            upsert=True
        )
        
        return {
            "status": "emergency_stop_activated",
            "tasks_paused": result.modified_count,
            "message": self.personality.emergency_stop_message()
        }
    
    async def resume(self, user_id: str) -> Dict[str, Any]:
        """Resume operations after pause or emergency stop."""
        logger.info(f"RESUME: Resuming operations for user {user_id}")
        
        # Update KAIDEN status
        await self.db.kaiden_status.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "status": SystemStatus.RUNNING.value,
                    "paused_at": None,
                    "paused_reason": None,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            },
            upsert=True
        )
        
        return {
            "status": "resumed",
            "message": self.personality.resume_message()
        }


class KaidenPersonality:
    """KAIDEN's voice and personality - warm, confident, brief, honest."""
    
    def format_approval_summary(self, task: Task) -> str:
        """Format approval request in KAIDEN's voice."""
        action_descriptions = {
            ActionType.EMAIL_SEND: f"Send email to {task.payload.get('recipient', 'recipient')}",
            ActionType.CALENDAR_SCHEDULE: f"Schedule: {task.title}",
            ActionType.DOCUMENT_SHARE: f"Share document: {task.title}",
            ActionType.FINANCIAL_TRANSACTION: f"Process payment: ${task.payload.get('amount', 0)}",
            ActionType.EXTERNAL_COMMUNICATION: f"Contact: {task.payload.get('contact', 'external party')}",
        }
        
        return action_descriptions.get(task.action_type, task.title)
    
    def task_complete_message(self, task: Task) -> str:
        """Generate completion message in KAIDEN's voice."""
        messages = {
            ActionType.EMAIL_DRAFT: f"Done. Draft ready for '{task.title}'.",
            ActionType.EMAIL_SEND: "Done. Email sent.",
            ActionType.CALENDAR_SCHEDULE: "Done. Meeting scheduled.",
            ActionType.DOCUMENT_CREATE: "Done. Document created.",
            ActionType.REPORT_GENERATE: "Done. Report generated.",
            ActionType.REMINDER_CREATE: "Done. Reminder set.",
            ActionType.TASK_ORGANIZE: "Done. Tasks organized.",
        }
        return messages.get(task.action_type, f"Done. {task.title} completed.")
    
    def emergency_stop_message(self) -> str:
        """Emergency stop acknowledgment."""
        return "All operations halted immediately. Nothing will run until you say 'resume'. I'm here when you're ready."
    
    def resume_message(self) -> str:
        """Resume acknowledgment."""
        return "Back online. Ready to help."
    
    def greeting(self, time_saved_today: float = 0) -> str:
        """Daily greeting."""
        if time_saved_today > 0:
            return f"Good to see you. I've saved you about {int(time_saved_today)} minutes today. What's next?"
        return "Ready when you are. What can I handle for you?"
    
    def status_update(self, completed: int, pending: int, time_saved: float) -> str:
        """Status update message."""
        if pending > 0:
            return f"{completed} tasks done, {pending} need your attention. {int(time_saved)} minutes saved today."
        return f"All caught up. {completed} tasks completed, {int(time_saved)} minutes saved today."
