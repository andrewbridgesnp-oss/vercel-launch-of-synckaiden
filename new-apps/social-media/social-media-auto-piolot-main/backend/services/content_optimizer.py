from typing import Dict, List, Any
import random
from datetime import datetime, timezone

class ContentOptimizer:
    """Optimize content with affiliate integration"""
    
    def __init__(self):
        self.cta_templates = {
            'subtle': [
                "Tools that help with this are in the description.",
                "Link to resources below.",
                "Check description for what I use."
            ],
            'direct': [
                "Comment TOOLS for the link.",
                "Want the system? Link in bio.",
                "Get this automation - link below."
            ],
            'curiosity': [
                "The tool that handles this? Description.",
                "See what automates this in the bio.",
                "This is powered by something. Link below."
            ]
        }
    
    async def integrate_affiliate_into_script(self, 
                                             script: str,
                                             offer: Dict,
                                             cta_style: str = 'subtle') -> str:
        """Seamlessly integrate affiliate mention into script"""
        
        # Don't modify if no offer
        if not offer:
            return script
        
        product_name = offer.get('name', 'this tool')
        category = offer.get('category', 'automation')
        
        # Find natural insertion point (usually near the end)
        sentences = script.split('.')
        if len(sentences) < 2:
            return script
        
        # Create natural mention
        mention = self._create_natural_mention(product_name, category)
        
        # Insert before last sentence
        sentences.insert(-1, mention)
        
        return '. '.join(sentences)
    
    def _create_natural_mention(self, product_name: str, category: str) -> str:
        """Create natural product mention"""
        templates = [
            f" {product_name} handles the {category} part",
            f" I use {product_name} for the {category} workflow",
            f" The {category} runs through {product_name}",
            f" {product_name} automates the {category} side"
        ]
        return random.choice(templates)
    
    async def generate_caption_with_cta(self,
                                       base_caption: str,
                                       offers: List[Dict],
                                       cta_style: str = 'subtle',
                                       platform: str = 'youtube') -> str:
        """Generate platform-optimized caption with CTA"""
        
        if not offers:
            return base_caption
        
        # Get CTA
        cta = random.choice(self.cta_templates.get(cta_style, self.cta_templates['subtle']))
        
        # Build caption
        caption_parts = [base_caption]
        
        # Add CTA
        caption_parts.append(f"\n\n{cta}")
        
        # Add offer details for description (YouTube/Facebook)
        if platform in ['youtube', 'facebook']:
            caption_parts.append("\n\n📦 RESOURCES:")
            for i, offer in enumerate(offers, 1):
                caption_parts.append(
                    f"\n{i}. {offer.get('name')} - [Link in description]"
                )
        
        return ''.join(caption_parts)
    
    async def optimize_for_conversion(self, 
                                     video_data: Dict,
                                     offers: List[Dict]) -> Dict[str, Any]:
        """Optimize video for affiliate conversion"""
        
        optimizations = {
            'thumbnail_overlay': None,
            'end_card': None,
            'pinned_comment': None,
            'description_placement': 'top'
        }
        
        if offers:
            # Generate pinned comment
            offer = offers[0]
            optimizations['pinned_comment'] = (
                f"✨ Ready to automate this? Get {offer.get('name')} "
                f"(link in description). It's what I use."
            )
            
            # Suggest thumbnail overlay
            optimizations['thumbnail_overlay'] = {
                'text': '+ FREE TOOLS',
                'position': 'bottom-right',
                'color': '#0EA5E9'
            }
        
        return optimizations

# Singleton instance
content_optimizer = ContentOptimizer()