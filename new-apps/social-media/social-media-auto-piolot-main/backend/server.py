from fastapi import FastAPI, APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import os
import logging
import uuid
from services.content_safety import content_safety
from services.viral_predictor import viral_predictor

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create app
app = FastAPI(title="SYNDICA FORGE API")
api_router = APIRouter(prefix="/api")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserRegister(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TrendItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    source: str  # youtube, tiktok, google, twitter
    title: str
    summary: str
    tags: List[str] = []
    risk_flags: List[str] = []
    audience_fit_score: float = 0.0
    suggested_angles: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VideoDraft(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    script: str
    voice_profile: str  # calm, direct
    scenes: List[Dict[str, Any]] = []
    captions: Dict[str, str] = {}  # platform: caption
    affiliate_offer_ids: List[str] = []
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: str = "pending_approval"  # pending_approval, approved, rejected, published
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PostPlan(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    video_draft_id: str
    platform: str  # youtube, tiktok, facebook, instagram, snapchat
    scheduled_time: datetime
    caption: str
    media_url: str
    status: str = "scheduled"  # scheduled, publishing, published, failed
    posted_at: Optional[datetime] = None
    platform_post_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AffiliateOffer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    network: str
    commission: Optional[str] = None
    epc: Optional[float] = None
    url: str
    rules: Optional[str] = None
    reputation_score: float = 5.0
    enabled: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Capability(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    problem_solved: str
    use_cases: List[str] = []
    proof_points: List[str] = []
    tags: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PlatformCredential(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    platform: str  # youtube, tiktok, facebook, instagram, snapchat, elevenlabs, openai
    credentials: Dict[str, str] = {}
    enabled: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BrandSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    primary_color: str = "#0EA5E9"
    secondary_color: str = "#10B981"
    font_heading: str = "Azeret Mono"
    font_body: str = "Manrope"
    logo_url: Optional[str] = None
    watermark_enabled: bool = True
    cta_enabled: bool = False
    cta_text: Optional[str] = None
    disclosure_template: str = "Disclosure: I may earn a commission if you buy through my link."
    caption_style: str = "premium"
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DailyDirective(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str
    focus_topics: List[str] = []
    avoid_topics: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== AUTH ====================

@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    try:
        # Check if user exists
        existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Simple hash (in production use bcrypt)
        user = User(
            email=user_data.email,
            password_hash=user_data.password  # In production: bcrypt.hashpw
        )
        
        doc = user.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.users.insert_one(doc)
        
        return {"message": "User registered successfully", "user_id": user.id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    try:
        user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
        if not user or user.get('password_hash') != credentials.password:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # In production: generate JWT token
        return {
            "token": f"token_{user['id']}",
            "user_id": user['id'],
            "email": user['email']
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== DASHBOARD ====================

@api_router.get("/dashboard/status")
async def get_dashboard_status():
    try:
        pending_videos = await db.video_drafts.count_documents({"status": "pending_approval"})
        scheduled_posts = await db.post_plans.count_documents({"status": "scheduled"})
        
        # Get today's trend brief
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        trends = await db.trends.find({"date": today}, {"_id": 0}).to_list(10)
        
        # Get recent analytics
        recent_posts = await db.post_plans.find(
            {"status": "published"}, 
            {"_id": 0}
        ).sort("posted_at", -1).limit(5).to_list(5)
        
        return {
            "pending_videos": pending_videos,
            "scheduled_posts": scheduled_posts,
            "trends_count": len(trends),
            "recent_posts": recent_posts,
            "last_generation": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        logger.error(f"Dashboard error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== TRENDS ====================

@api_router.get("/trends/daily", response_model=List[TrendItem])
async def get_daily_trends():
    try:
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        trends = await db.trends.find({"date": today}, {"_id": 0}).to_list(100)
        return trends
    except Exception as e:
        logger.error(f"Get trends error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/trends/scan")
async def trigger_trend_scan(background_tasks: BackgroundTasks):
    try:
        # Trigger trend scanning in background
        background_tasks.add_task(scan_trends_task)
        return {"message": "Trend scanning initiated"}
    except Exception as e:
        logger.error(f"Trigger scan error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def scan_trends_task():
    """Background task to scan trends"""
    logger.info("Starting trend scan...")
    # This will be implemented with actual trend scanning logic
    # For now, create sample trends
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    sample_trends = [
        TrendItem(
            source="youtube",
            title="AI Automation for Small Business",
            summary="Trending topic about AI automation tools for entrepreneurs",
            tags=["AI", "automation", "business"],
            audience_fit_score=9.2,
            suggested_angles=["How AI reduces burnout", "Systems that work while you sleep"]
        ),
        TrendItem(
            source="tiktok",
            title="Gen X Catching Up with Tech",
            summary="Content about Gen X learning modern productivity tools",
            tags=["tech", "productivity", "gen-x"],
            audience_fit_score=8.5,
            suggested_angles=["It's not too late to automate", "Tools your kids already use"]
        )
    ]
    
    for trend in sample_trends:
        doc = trend.model_dump()
        doc['date'] = today
        doc['created_at'] = doc['created_at'].isoformat()
        await db.trends.insert_one(doc)
    
    logger.info(f"Trend scan complete: {len(sample_trends)} trends saved")

# ==================== VIDEO DRAFTS ====================

@api_router.get("/videos/queue", response_model=List[VideoDraft])
async def get_video_queue():
    try:
        videos = await db.video_drafts.find(
            {"status": "pending_approval"}, 
            {"_id": 0}
        ).sort("created_at", -1).to_list(100)
        return videos
    except Exception as e:
        logger.error(f"Get queue error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/videos/approve/{video_id}")
async def approve_video(video_id: str):
    try:
        result = await db.video_drafts.update_one(
            {"id": video_id},
            {"$set": {"status": "approved", "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Video not found")
        
        return {"message": "Video approved successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Approve error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/videos/reject/{video_id}")
async def reject_video(video_id: str):
    try:
        result = await db.video_drafts.update_one(
            {"id": video_id},
            {"$set": {"status": "rejected", "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Video not found")
        
        return {"message": "Video rejected successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Reject error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/videos/generate")
async def trigger_video_generation(background_tasks: BackgroundTasks):
    try:
        background_tasks.add_task(generate_videos_task)
        return {"message": "Video generation initiated"}
    except Exception as e:
        logger.error(f"Trigger generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def generate_videos_task():
    """Background task to generate videos"""
    logger.info("Starting video generation...")
    # Placeholder - will be implemented with actual generation logic
    logger.info("Video generation complete")

# ==================== SCHEDULE ====================

@api_router.get("/schedule/posts", response_model=List[PostPlan])
async def get_scheduled_posts():
    try:
        posts = await db.post_plans.find(
            {}, 
            {"_id": 0}
        ).sort("scheduled_time", 1).to_list(100)
        return posts
    except Exception as e:
        logger.error(f"Get schedule error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/schedule/create")
async def create_schedule(plan: PostPlan):
    try:
        doc = plan.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['scheduled_time'] = doc['scheduled_time'].isoformat()
        if doc.get('posted_at'):
            doc['posted_at'] = doc['posted_at'].isoformat()
        
        await db.post_plans.insert_one(doc)
        return {"message": "Post scheduled successfully", "id": plan.id}
    except Exception as e:
        logger.error(f"Create schedule error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== AFFILIATES ====================

@api_router.get("/affiliates", response_model=List[AffiliateOffer])
async def get_affiliates():
    try:
        offers = await db.affiliate_offers.find({}, {"_id": 0}).to_list(100)
        return offers
    except Exception as e:
        logger.error(f"Get affiliates error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/affiliates")
async def create_affiliate(offer: AffiliateOffer):
    try:
        doc = offer.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.affiliate_offers.insert_one(doc)
        return {"message": "Affiliate offer created", "id": offer.id}
    except Exception as e:
        logger.error(f"Create affiliate error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/affiliates/{offer_id}")
async def update_affiliate(offer_id: str, offer: AffiliateOffer):
    try:
        doc = offer.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        result = await db.affiliate_offers.replace_one({"id": offer_id}, doc)
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Offer not found")
        
        return {"message": "Affiliate offer updated"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update affiliate error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/affiliates/{offer_id}")
async def delete_affiliate(offer_id: str):
    try:
        result = await db.affiliate_offers.delete_one({"id": offer_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Offer not found")
        
        return {"message": "Affiliate offer deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete affiliate error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== CAPABILITIES ====================

@api_router.get("/capabilities", response_model=List[Capability])
async def get_capabilities(search: Optional[str] = None):
    try:
        query = {}
        if search:
            query = {"$or": [
                {"name": {"$regex": search, "$options": "i"}},
                {"problem_solved": {"$regex": search, "$options": "i"}},
                {"tags": {"$regex": search, "$options": "i"}}
            ]}
        
        capabilities = await db.capabilities.find(query, {"_id": 0}).to_list(500)
        return capabilities
    except Exception as e:
        logger.error(f"Get capabilities error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/capabilities")
async def create_capability(capability: Capability):
    try:
        doc = capability.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.capabilities.insert_one(doc)
        return {"message": "Capability created", "id": capability.id}
    except Exception as e:
        logger.error(f"Create capability error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== SETTINGS ====================

@api_router.get("/settings/brand")
async def get_brand_settings():
    try:
        settings = await db.brand_settings.find_one({}, {"_id": 0})
        if not settings:
            # Return defaults
            default_settings = BrandSettings()
            return default_settings.model_dump()
        return settings
    except Exception as e:
        logger.error(f"Get settings error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/settings/brand")
async def update_brand_settings(settings: BrandSettings):
    try:
        doc = settings.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        await db.brand_settings.delete_many({})
        await db.brand_settings.insert_one(doc)
        
        return {"message": "Brand settings updated"}
    except Exception as e:
        logger.error(f"Update settings error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/settings/credentials", response_model=List[PlatformCredential])
async def get_platform_credentials():
    try:
        creds = await db.platform_credentials.find({}, {"_id": 0}).to_list(100)
        # Mask sensitive data
        for cred in creds:
            if 'credentials' in cred:
                cred['credentials'] = {k: "***" for k in cred['credentials'].keys()}
        return creds
    except Exception as e:
        logger.error(f"Get credentials error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/settings/credentials")
async def save_platform_credentials(credential: PlatformCredential):
    try:
        doc = credential.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        # Update or insert
        await db.platform_credentials.delete_many({"platform": credential.platform})
        await db.platform_credentials.insert_one(doc)
        
        return {"message": f"{credential.platform} credentials saved"}
    except Exception as e:
        logger.error(f"Save credentials error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== DIRECTIVE ====================

@api_router.post("/directive")
async def save_directive(directive: DailyDirective):
    try:
        doc = directive.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        # Remove old directives for this date
        await db.directives.delete_many({"date": directive.date})
        await db.directives.insert_one(doc)
        
        return {"message": "Directive saved"}
    except Exception as e:
        logger.error(f"Save directive error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/directive/today")
async def get_today_directive():
    try:
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        directive = await db.directives.find_one({"date": today}, {"_id": 0})
        if not directive:
            return {"date": today, "focus_topics": [], "avoid_topics": []}
        return directive
    except Exception as e:
        logger.error(f"Get directive error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ADVANCED FEATURES ====================

@api_router.post("/content/safety-check")
async def check_content_safety(data: Dict):
    """AI-powered content safety and compliance check"""
    try:
        script = data.get('script', '')
        if not script:
            raise HTTPException(status_code=400, detail="Script is required")
        
        # Run safety check
        safety_result = await content_safety.check_script(script)
        
        # Add brand safety score
        safety_result['brand_safety_score'] = content_safety.calculate_brand_safety_score({
            'script_safety_score': safety_result['score']
        })
        
        return safety_result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Safety check error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/content/viral-prediction")
async def predict_viral_potential(video_data: Dict):
    """Predict viral potential of video content"""
    try:
        prediction = await viral_predictor.predict_viral_score(video_data)
        return prediction
    except Exception as e:
        logger.error(f"Viral prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/performance-trends")
async def get_performance_trends():
    """Analyze historical performance trends"""
    try:
        # Fetch historical video performance
        videos = await db.video_drafts.find(
            {"status": "published"},
            {"_id": 0}
        ).to_list(1000)
        
        # Get performance data from post_plans
        performance_data = []
        for video in videos:
            posts = await db.post_plans.find(
                {"video_draft_id": video['id'], "status": "published"},
                {"_id": 0}
            ).to_list(100)
            
            for post in posts:
                performance_data.append({
                    'video_id': video['id'],
                    'platform': post.get('platform'),
                    'views': post.get('views', 0),
                    'engagement_rate': post.get('engagement_rate', 0),
                    'theme': video.get('theme', 'general')
                })
        
        trends = await viral_predictor.analyze_performance_trends(performance_data)
        return trends
    except Exception as e:
        logger.error(f"Performance trends error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/webhooks/n8n")
async def n8n_webhook(data: Dict):
    """Webhook endpoint for n8n workflow integration"""
    try:
        event_type = data.get('event_type')
        payload = data.get('payload', {})
        
        logger.info(f"N8N webhook received: {event_type}")
        
        if event_type == 'video_generated':
            # Video generation completed
            video_id = payload.get('video_id')
            await db.video_drafts.update_one(
                {"id": video_id},
                {"$set": {"status": "pending_approval", "updated_at": datetime.now(timezone.utc).isoformat()}}
            )
            return {"message": "Video status updated"}
        
        elif event_type == 'publishing_completed':
            # Publishing completed
            post_id = payload.get('post_id')
            platform_post_id = payload.get('platform_post_id')
            await db.post_plans.update_one(
                {"id": post_id},
                {"$set": {
                    "status": "published",
                    "platform_post_id": platform_post_id,
                    "posted_at": datetime.now(timezone.utc).isoformat()
                }}
            )
            return {"message": "Post status updated"}
        
        elif event_type == 'performance_update':
            # Performance metrics update
            post_id = payload.get('post_id')
            metrics = payload.get('metrics', {})
            await db.post_plans.update_one(
                {"id": post_id},
                {"$set": {
                    "views": metrics.get('views', 0),
                    "engagement_rate": metrics.get('engagement_rate', 0),
                    "watch_time": metrics.get('watch_time', 0)
                }}
            )
            return {"message": "Metrics updated"}
        
        return {"message": "Webhook processed"}
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/templates")
async def get_templates():
    """Get video templates library"""
    try:
        templates = await db.templates.find({}, {"_id": 0}).to_list(100)
        
        # Return default templates if none exist
        if not templates:
            default_templates = [
                {
                    "id": str(uuid.uuid4()),
                    "name": "Problem → Solution",
                    "structure": "State problem, show impact, present Kayden solution, call to inevitability",
                    "category": "educational",
                    "duration": "30-40s",
                    "success_rate": 0.75
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Behind the Scenes",
                    "structure": "Show what's actually happening, reveal hidden truth, reframe perspective",
                    "category": "insight",
                    "duration": "20-30s",
                    "success_rate": 0.68
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Quick Win",
                    "structure": "One actionable tip, show how to implement, emphasize simplicity",
                    "category": "tutorial",
                    "duration": "20-25s",
                    "success_rate": 0.72
                }
            ]
            return default_templates
        
        return templates
    except Exception as e:
        logger.error(f"Get templates error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/revenue/summary")
async def get_revenue_summary():
    """Get revenue summary across all monetization channels"""
    try:
        # Placeholder - would integrate with affiliate networks, platform APIs
        summary = {
            "total_revenue_30d": 0.0,
            "affiliate_revenue": 0.0,
            "platform_revenue": {
                "youtube": 0.0,
                "tiktok": 0.0,
                "instagram": 0.0,
                "facebook": 0.0,
                "snapchat": 0.0
            },
            "top_earning_video": None,
            "revenue_per_video_avg": 0.0,
            "growth_rate": 0.0
        }
        
        return summary
    except Exception as e:
        logger.error(f"Revenue summary error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== SETUP ====================

app.include_router(api_router)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
