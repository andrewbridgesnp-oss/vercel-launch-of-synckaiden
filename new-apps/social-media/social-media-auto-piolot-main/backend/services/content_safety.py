from typing import Dict, List, Any
import re
from datetime import datetime, timezone

class ContentSafetyChecker:
    """AI-powered content safety and compliance checker"""
    
    def __init__(self):
        self.profanity_patterns = self._load_profanity_patterns()
        self.sensitive_topics = ['politics', 'religion', 'medical_claims', 'financial_advice']
        
    def _load_profanity_patterns(self) -> List[str]:
        # Basic profanity patterns (expand with comprehensive list)
        return [
            r'\b(fuck|shit|damn|hell|crap|ass)\b',
            r'\b(explicit|nsfw|18\+)\b'
        ]
    
    async def check_script(self, script: str) -> Dict[str, Any]:
        """Comprehensive script safety check"""
        score = 10.0
        flags = []
        warnings = []
        
        # 1. Profanity detection
        for pattern in self.profanity_patterns:
            if re.search(pattern, script, re.IGNORECASE):
                score -= 2.0
                flags.append('profanity_detected')
                warnings.append(f'Profanity pattern matched: {pattern}')
        
        # 2. Sensitive topic detection
        script_lower = script.lower()
        for topic in self.sensitive_topics:
            if topic in script_lower:
                score -= 1.0
                warnings.append(f'Sensitive topic detected: {topic}')
        
        # 3. FTC disclosure check (if affiliate content)
        if 'link' in script_lower or 'commission' in script_lower:
            if 'disclosure' not in script_lower:
                score -= 3.0
                flags.append('missing_ftc_disclosure')
                warnings.append('Affiliate content missing FTC disclosure')
        
        # 4. Length check (20-40 seconds at ~150 words/min = 50-100 words)
        word_count = len(script.split())
        if word_count < 40 or word_count > 120:
            score -= 1.0
            warnings.append(f'Word count outside optimal range: {word_count}')
        
        # 5. Claim detection (avoid guarantees)
        guarantee_patterns = [
            r'\bguarantee\b', r'\bpromise\b', r'\bguaranteed\b',
            r'\bcure\b', r'\bmake\s+\$\d+\b'
        ]
        for pattern in guarantee_patterns:
            if re.search(pattern, script, re.IGNORECASE):
                score -= 2.0
                flags.append('unrealistic_claim')
                warnings.append(f'Potential unrealistic claim: {pattern}')
        
        # Determine status
        if score >= 9.0:
            status = 'approved'
        elif score >= 6.0:
            status = 'review'
        else:
            status = 'rejected'
        
        return {
            'score': max(0, score),
            'status': status,
            'flags': flags,
            'warnings': warnings,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
    
    async def check_platform_compliance(self, platform: str, content: Dict) -> Dict[str, Any]:
        """Check platform-specific TOS compliance"""
        compliance = {
            'platform': platform,
            'compliant': True,
            'violations': []
        }
        
        # YouTube compliance
        if platform == 'youtube':
            if 'clickbait' in content.get('title', '').lower():
                compliance['compliant'] = False
                compliance['violations'].append('Misleading title')
            
            if len(content.get('title', '')) > 100:
                compliance['compliant'] = False
                compliance['violations'].append('Title too long')
        
        # TikTok compliance
        elif platform == 'tiktok':
            if len(content.get('caption', '')) > 150:
                compliance['compliant'] = False
                compliance['violations'].append('Caption too long')
        
        # Instagram compliance
        elif platform == 'instagram':
            hashtag_count = len([w for w in content.get('caption', '').split() if w.startswith('#')])
            if hashtag_count > 30:
                compliance['compliant'] = False
                compliance['violations'].append('Too many hashtags (max 30)')
        
        return compliance
    
    async def generate_disclosure(self, affiliate_offers: List[str]) -> str:
        """Generate FTC-compliant disclosure"""
        if not affiliate_offers:
            return ''
        
        return ("\n\n[Disclosure] I may earn a commission if you purchase "
                "through the links in this video. This helps support the channel "
                "at no extra cost to you. Thank you!")
    
    def calculate_brand_safety_score(self, content: Dict) -> float:
        """Calculate overall brand safety score"""
        # Placeholder for advanced ML model
        # In production: Use Google Cloud Video Intelligence API or similar
        base_score = 9.0
        
        # Simple heuristics
        script_safety = content.get('script_safety_score', 10.0)
        
        # Weight script safety heavily
        final_score = (script_safety * 0.7) + (base_score * 0.3)
        
        return min(10.0, max(0.0, final_score))

# Singleton instance
content_safety = ContentSafetyChecker()