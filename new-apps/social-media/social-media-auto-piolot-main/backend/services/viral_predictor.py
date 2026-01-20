from typing import Dict, List, Any
import math
from datetime import datetime, timezone

class ViralPredictor:
    """ML-based viral prediction engine"""
    
    def __init__(self):
        # Weights learned from historical data (placeholder)
        self.weights = {
            'trend_score': 0.25,
            'audience_fit': 0.20,
            'hook_quality': 0.15,
            'visual_appeal': 0.15,
            'timing': 0.10,
            'platform_algorithm': 0.10,
            'uniqueness': 0.05
        }
    
    async def predict_viral_score(self, video_data: Dict) -> Dict[str, Any]:
        """Predict likelihood of going viral (0-10 scale)"""
        
        # Extract features
        trend_score = video_data.get('trend_score', 5.0)
        audience_fit = video_data.get('audience_fit_score', 5.0)
        
        # Analyze hook quality
        script = video_data.get('script', '')
        hook_quality = self._analyze_hook(script)
        
        # Visual appeal (placeholder - would use computer vision)
        visual_appeal = 7.0
        
        # Timing score
        timing_score = self._calculate_timing_score(video_data.get('publish_time'))
        
        # Platform algorithm alignment
        platform_score = 6.5
        
        # Uniqueness (check against recent content)
        uniqueness = 7.0
        
        # Calculate weighted score
        viral_score = (
            trend_score * self.weights['trend_score'] +
            audience_fit * self.weights['audience_fit'] +
            hook_quality * self.weights['hook_quality'] +
            visual_appeal * self.weights['visual_appeal'] +
            timing_score * self.weights['timing'] +
            platform_score * self.weights['platform_algorithm'] +
            uniqueness * self.weights['uniqueness']
        )
        
        # Confidence score (higher with more data)
        confidence = min(0.95, 0.6 + (video_data.get('historical_data_points', 0) * 0.01))
        
        # Predicted views range
        base_views = 5000
        multiplier = math.exp((viral_score - 5) / 2)
        predicted_views = int(base_views * multiplier)
        
        return {
            'viral_score': round(viral_score, 2),
            'confidence': round(confidence, 2),
            'predicted_views': {
                'low': int(predicted_views * 0.5),
                'mid': predicted_views,
                'high': int(predicted_views * 2.0)
            },
            'factors': {
                'trend_score': round(trend_score, 2),
                'audience_fit': round(audience_fit, 2),
                'hook_quality': round(hook_quality, 2),
                'visual_appeal': round(visual_appeal, 2),
                'timing_score': round(timing_score, 2),
                'platform_score': round(platform_score, 2),
                'uniqueness': round(uniqueness, 2)
            },
            'recommendation': self._generate_recommendation(viral_score)
        }
    
    def _analyze_hook(self, script: str) -> float:
        """Analyze hook quality (first 3 seconds / ~10 words)"""
        if not script:
            return 0.0
        
        words = script.split()
        if len(words) < 10:
            return 5.0
        
        hook = ' '.join(words[:10]).lower()
        score = 5.0
        
        # Strong hook patterns
        strong_patterns = [
            'you', 'your', 'what if', 'imagine', 'never', 'always',
            'secret', 'truth', 'why', 'how', 'this changed'
        ]
        
        for pattern in strong_patterns:
            if pattern in hook:
                score += 0.5
        
        # Weak hook patterns (cliches)
        weak_patterns = ['hey guys', 'in this video', 'today i', 'welcome to']
        for pattern in weak_patterns:
            if pattern in hook:
                score -= 1.0
        
        return min(10.0, max(0.0, score))
    
    def _calculate_timing_score(self, publish_time: str = None) -> float:
        """Calculate timing score based on publish time"""
        if not publish_time:
            return 5.0
        
        try:
            dt = datetime.fromisoformat(publish_time.replace('Z', '+00:00'))
            hour = dt.hour
            day_of_week = dt.weekday()
            
            # Prime time: 6-10 PM
            if 18 <= hour <= 22:
                time_score = 9.0
            # Good time: 12-2 PM, 5-6 PM
            elif (12 <= hour <= 14) or (17 <= hour <= 18):
                time_score = 7.0
            # Decent time: Morning 7-9 AM
            elif 7 <= hour <= 9:
                time_score = 6.0
            # Off-hours
            else:
                time_score = 4.0
            
            # Weekday bonus
            if day_of_week < 5:  # Monday-Friday
                time_score += 0.5
            
            return min(10.0, time_score)
        except:
            return 5.0
    
    def _generate_recommendation(self, viral_score: float) -> str:
        """Generate actionable recommendation"""
        if viral_score >= 8.5:
            return "🔥 Extremely high viral potential! Publish immediately and prepare for scale."
        elif viral_score >= 7.0:
            return "✅ Strong viral potential. Good to publish with standard monitoring."
        elif viral_score >= 5.5:
            return "⚡ Moderate potential. Consider A/B testing thumbnail/title."
        elif viral_score >= 4.0:
            return "⚠️ Below average potential. Review script and visuals before publishing."
        else:
            return "❌ Low viral potential. Recommend regeneration with different angle."
    
    async def analyze_performance_trends(self, historical_data: List[Dict]) -> Dict[str, Any]:
        """Analyze historical performance to improve predictions"""
        if not historical_data:
            return {'insights': 'Not enough data yet'}
        
        # Calculate averages
        avg_views = sum(d.get('views', 0) for d in historical_data) / len(historical_data)
        avg_engagement = sum(d.get('engagement_rate', 0) for d in historical_data) / len(historical_data)
        
        # Identify top performers
        top_10_percent = sorted(historical_data, key=lambda x: x.get('views', 0), reverse=True)[:max(1, len(historical_data) // 10)]
        
        # Extract patterns from top performers
        common_themes = {}
        for video in top_10_percent:
            theme = video.get('theme', 'unknown')
            common_themes[theme] = common_themes.get(theme, 0) + 1
        
        top_theme = max(common_themes.items(), key=lambda x: x[1])[0] if common_themes else 'unknown'
        
        return {
            'avg_views': int(avg_views),
            'avg_engagement_rate': round(avg_engagement, 2),
            'total_videos': len(historical_data),
            'top_performing_theme': top_theme,
            'insights': f"Your {top_theme} content performs {(common_themes[top_theme] / len(top_10_percent) * 100):.0f}% better than average."
        }

# Singleton instance
viral_predictor = ViralPredictor()