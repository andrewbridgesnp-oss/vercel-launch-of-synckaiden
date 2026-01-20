from typing import Dict, List, Any, Optional
from datetime import datetime, timezone
import hashlib
import random
import re

class AffiliateEngine:
    """Intelligent affiliate link automation and optimization"""
    
    def __init__(self):
        self.base_url = "https://kdn.ai"  # Branded short domain
        self.networks = {
            'shareasale': {'priority': 1, 'conversion_rate': 0.03},
            'cj': {'priority': 2, 'conversion_rate': 0.025},
            'impact': {'priority': 3, 'conversion_rate': 0.028},
            'rakuten': {'priority': 4, 'conversion_rate': 0.022}
        }
    
    async def select_offers_for_content(self, 
                                       content_theme: str, 
                                       script: str,
                                       available_offers: List[Dict],
                                       max_offers: int = 2) -> List[Dict]:
        """Intelligently select affiliate offers for content"""
        
        if not available_offers:
            return []
        
        # Score each offer
        scored_offers = []
        for offer in available_offers:
            if not offer.get('enabled', True):
                continue
            
            score = self._calculate_offer_score(
                offer=offer,
                content_theme=content_theme,
                script=script
            )
            
            scored_offers.append({
                **offer,
                'relevance_score': score
            })
        
        # Sort by score (descending)
        scored_offers.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        # Return top offers
        return scored_offers[:max_offers]
    
    def _calculate_offer_score(self, offer: Dict, content_theme: str, script: str) -> float:
        """Calculate relevance score for an offer"""
        score = 0.0
        
        # 1. Category match (40% weight)
        category = offer.get('category', '').lower()
        if category in content_theme.lower():
            score += 4.0
        elif self._is_related_category(category, content_theme):
            score += 2.0
        
        # 2. Keyword match in script (30% weight)
        keywords = offer.get('keywords', [])
        script_lower = script.lower()
        keyword_matches = sum(1 for kw in keywords if kw.lower() in script_lower)
        score += min(3.0, keyword_matches * 0.5)
        
        # 3. Commission rate (15% weight)
        commission = offer.get('commission', '')
        commission_value = self._parse_commission(commission)
        score += min(1.5, commission_value / 100)
        
        # 4. EPC (Earnings Per Click) (10% weight)
        epc = offer.get('epc', 0)
        score += min(1.0, epc / 10)
        
        # 5. Reputation score (5% weight)
        reputation = offer.get('reputation_score', 5.0)
        score += reputation / 20
        
        return round(score, 2)
    
    def _is_related_category(self, category: str, theme: str) -> bool:
        """Check if category is related to content theme"""
        related_categories = {
            'automation': ['software', 'tools', 'saas', 'productivity'],
            'business': ['entrepreneur', 'startup', 'marketing', 'sales'],
            'ai': ['machine learning', 'software', 'automation', 'technology'],
            'productivity': ['software', 'tools', 'business', 'organization']
        }
        
        theme_lower = theme.lower()
        for key, related in related_categories.items():
            if key in theme_lower:
                return category.lower() in related
        
        return False
    
    def _parse_commission(self, commission: str) -> float:
        """Parse commission string to numeric value"""
        if not commission:
            return 0.0
        
        # Extract percentage (e.g., "15%" -> 15.0)
        match = re.search(r'(\d+(?:\.\d+)?)%?', commission)
        if match:
            return float(match.group(1))
        
        return 0.0
    
    def generate_tracking_link(self, 
                              offer_id: str, 
                              video_id: str,
                              platform: str,
                              base_url: str) -> Dict[str, str]:
        """Generate unique tracking link with analytics"""
        
        # Create unique tracking ID
        tracking_data = f"{offer_id}:{video_id}:{platform}:{datetime.now().isoformat()}"
        tracking_id = hashlib.md5(tracking_data.encode()).hexdigest()[:8]
        
        # Generate short link
        short_code = self._generate_short_code(tracking_id)
        short_url = f"{self.base_url}/{short_code}"
        
        return {
            'tracking_id': tracking_id,
            'short_code': short_code,
            'short_url': short_url,
            'original_url': base_url,
            'created_at': datetime.now(timezone.utc).isoformat()
        }
    
    def _generate_short_code(self, tracking_id: str) -> str:
        """Generate readable short code"""
        # Use first 6 chars of tracking_id
        return tracking_id[:6].upper()
    
    async def generate_disclosure(self, 
                                  offers: List[Dict],
                                  platform: str = 'generic') -> str:
        """Generate FTC-compliant disclosure"""
        if not offers:
            return ''
        
        # Platform-specific disclosure formats
        disclosures = {
            'youtube': (
                "\n\n⚠️ DISCLOSURE: This video contains affiliate links. "
                "I may earn a commission if you purchase through these links "
                "at no additional cost to you. This helps support the channel. Thank you!"
            ),
            'tiktok': (
                "\n\n[AD] I may earn from links. "
                "No extra cost to you. Thanks for supporting!"
            ),
            'instagram': (
                "\n\n💡 Disclosure: Contains affiliate links. "
                "I earn from qualifying purchases. No extra cost!"
            ),
            'generic': (
                "\n\nDisclosure: I may earn a commission if you buy through my link. "
                "This helps me create more content. Thank you for your support!"
            )
        }
        
        return disclosures.get(platform, disclosures['generic'])
    
    async def track_click(self, 
                         tracking_id: str,
                         metadata: Dict) -> Dict[str, Any]:
        """Track affiliate link click"""
        return {
            'tracking_id': tracking_id,
            'clicked_at': datetime.now(timezone.utc).isoformat(),
            'user_agent': metadata.get('user_agent'),
            'referrer': metadata.get('referrer'),
            'ip_address': metadata.get('ip_address', 'unknown'),
            'platform': metadata.get('platform', 'unknown')
        }
    
    async def calculate_performance(self, offer_id: str, clicks: List[Dict]) -> Dict[str, Any]:
        """Calculate affiliate offer performance metrics"""
        total_clicks = len(clicks)
        
        if total_clicks == 0:
            return {
                'offer_id': offer_id,
                'total_clicks': 0,
                'conversion_rate': 0.0,
                'estimated_earnings': 0.0,
                'roi': 0.0
            }
        
        # Calculate conversions (placeholder - would integrate with affiliate network)
        estimated_conversion_rate = 0.03  # 3% industry average
        estimated_conversions = total_clicks * estimated_conversion_rate
        
        # Calculate earnings (placeholder)
        avg_commission = 50.0  # $50 per conversion
        estimated_earnings = estimated_conversions * avg_commission
        
        return {
            'offer_id': offer_id,
            'total_clicks': total_clicks,
            'estimated_conversions': round(estimated_conversions, 1),
            'conversion_rate': round(estimated_conversion_rate * 100, 2),
            'estimated_earnings': round(estimated_earnings, 2),
            'avg_commission': avg_commission,
            'performance_tier': self._classify_performance(total_clicks)
        }
    
    def _classify_performance(self, clicks: int) -> str:
        """Classify performance tier"""
        if clicks >= 1000:
            return 'Excellent'
        elif clicks >= 500:
            return 'Good'
        elif clicks >= 100:
            return 'Average'
        elif clicks >= 10:
            return 'Below Average'
        else:
            return 'Poor'
    
    async def optimize_offer_selection(self, 
                                      historical_performance: List[Dict]) -> Dict[str, Any]:
        """Analyze historical data and recommend optimization"""
        if not historical_performance:
            return {'recommendation': 'Not enough data yet'}
        
        # Calculate metrics
        total_revenue = sum(p.get('estimated_earnings', 0) for p in historical_performance)
        total_clicks = sum(p.get('total_clicks', 0) for p in historical_performance)
        
        # Find top performers
        sorted_by_revenue = sorted(
            historical_performance, 
            key=lambda x: x.get('estimated_earnings', 0), 
            reverse=True
        )
        
        top_offer = sorted_by_revenue[0] if sorted_by_revenue else None
        
        # Generate recommendations
        recommendations = []
        
        if total_clicks < 100:
            recommendations.append("Increase content volume to gather more data")
        
        if top_offer and top_offer.get('estimated_earnings', 0) > total_revenue * 0.5:
            recommendations.append(
                f"Focus on {top_offer.get('category', 'top-performing')} offers - "
                f"they generate {top_offer.get('estimated_earnings', 0) / total_revenue * 100:.0f}% of revenue"
            )
        
        avg_ctr = (total_clicks / len(historical_performance)) if historical_performance else 0
        if avg_ctr < 50:
            recommendations.append(
                "Consider more prominent CTAs to increase click-through rate"
            )
        
        return {
            'total_revenue': round(total_revenue, 2),
            'total_clicks': total_clicks,
            'avg_clicks_per_offer': round(avg_ctr, 1),
            'top_performing_category': top_offer.get('category') if top_offer else None,
            'recommendations': recommendations
        }

# Singleton instance
affiliate_engine = AffiliateEngine()