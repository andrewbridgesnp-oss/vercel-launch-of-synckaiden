// KAIDEN CAPITAL™ - Funding Graph Engine
// Production-ready decision engine for funding recommendations

import type {
  FundingProfile,
  FundingSource,
  FundingRecommendation,
  User,
} from '../types';

export interface FundingEngineConfig {
  mode: 'fastest-money' | 'lowest-cost' | 'balanced';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

export class FundingGraphEngine {
  private config: FundingEngineConfig;

  constructor(config: FundingEngineConfig = { mode: 'balanced', riskTolerance: 'moderate' }) {
    this.config = config;
  }

  /**
   * Generate ranked funding recommendations
   */
  generateRecommendations(
    profile: FundingProfile,
    user: User,
    sources: FundingSource[]
  ): FundingRecommendation[] {
    // Filter eligible sources
    const eligibleSources = sources.filter(source => 
      this.isEligible(source, user, profile)
    );

    // Score each source
    const recommendations = eligibleSources.map(source => 
      this.scoreSource(source, user, profile)
    );

    // Sort by composite score
    recommendations.sort((a, b) => b.score - a.score);

    // Assign ranks
    recommendations.forEach((rec, index) => {
      rec.rank = index + 1;
    });

    return recommendations;
  }

  /**
   * Check if user is eligible for a funding source
   */
  private isEligible(source: FundingSource, user: User, profile: FundingProfile): boolean {
    const { profile: userProfile } = user;

    // Check track compatibility
    if (!source.track.includes(profile.track)) {
      return false;
    }

    // Check minimum credit score
    if (source.minCreditScore) {
      const creditScoreMap = { excellent: 750, good: 680, fair: 620, poor: 550, unknown: 0 };
      if (creditScoreMap[userProfile.creditTier] < source.minCreditScore) {
        return false;
      }
    }

    // Check time in business
    if (source.minTimeInBusiness && userProfile.timeInBusiness) {
      if (userProfile.timeInBusiness < source.minTimeInBusiness) {
        return false;
      }
    }

    // Check revenue
    if (source.minRevenue && userProfile.annualRevenue) {
      if (userProfile.annualRevenue < source.minRevenue) {
        return false;
      }
    }

    // Check amount range
    if (profile.targetAmount < source.minAmount || profile.targetAmount > source.maxAmount) {
      return false;
    }

    // Check restrictions
    if (source.restrictions.industries && userProfile.industry) {
      if (source.restrictions.industries.includes(userProfile.industry)) {
        return false;
      }
    }

    if (source.restrictions.states && userProfile.state) {
      if (source.restrictions.states.includes(userProfile.state)) {
        return false;
      }
    }

    if (source.restrictions.entityTypes && userProfile.entityType) {
      if (source.restrictions.entityTypes.includes(userProfile.entityType)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Score a funding source for the user
   */
  private scoreSource(
    source: FundingSource,
    user: User,
    profile: FundingProfile
  ): FundingRecommendation {
    const approvalProbability = this.calculateApprovalProbability(source, user, profile);
    const speed = this.parseSpeed(source.approvalTimeframe);
    const netCost = this.estimateNetCost(source, profile.targetAmount);
    
    // Calculate composite score based on mode
    const score = this.calculateCompositeScore(approvalProbability, speed, netCost, profile);
    
    // Generate explanation
    const explanation = this.generateExplanation(source, user, profile, approvalProbability);
    
    // Identify tradeoffs
    const tradeoffs = this.identifyTradeoffs(source, speed, netCost);
    
    // Generate next actions
    const nextActions = this.generateNextActions(source, user);
    
    // Identify blockers
    const blockers = this.identifyBlockers(source, user, profile);
    
    // Calculate confidence
    const confidence = this.calculateConfidence(source, user, profile);

    return {
      id: `rec_${source.id}_${Date.now()}`,
      fundingProfileId: profile.id,
      source,
      approvalProbability,
      speed,
      netCost,
      score,
      confidence,
      explanation,
      tradeoffs,
      nextActions,
      blockers,
      estimatedAmount: profile.targetAmount,
      rank: 0, // Will be set later
    };
  }

  /**
   * Calculate approval probability (0-1)
   */
  private calculateApprovalProbability(
    source: FundingSource,
    user: User,
    profile: FundingProfile
  ): number {
    let probability = 0.5; // Base probability

    const { profile: userProfile } = user;
    const { trustScore } = user;

    // Credit tier impact
    const creditImpact = {
      excellent: 0.25,
      good: 0.15,
      fair: 0.05,
      poor: -0.15,
      unknown: -0.10,
    };
    probability += creditImpact[userProfile.creditTier];

    // Time in business impact
    if (source.minTimeInBusiness && userProfile.timeInBusiness) {
      const timeRatio = userProfile.timeInBusiness / source.minTimeInBusiness;
      if (timeRatio >= 2) probability += 0.15;
      else if (timeRatio >= 1.5) probability += 0.10;
      else if (timeRatio >= 1) probability += 0.05;
    }

    // Revenue impact
    if (source.minRevenue && userProfile.annualRevenue) {
      const revenueRatio = userProfile.annualRevenue / source.minRevenue;
      if (revenueRatio >= 3) probability += 0.15;
      else if (revenueRatio >= 2) probability += 0.10;
      else if (revenueRatio >= 1.5) probability += 0.05;
    }

    // Trust score impact
    if (trustScore.score >= 80) probability += 0.10;
    else if (trustScore.score >= 60) probability += 0.05;
    else if (trustScore.score < 40) probability -= 0.10;

    // Readiness score impact
    if (profile.readinessScore >= 80) probability += 0.10;
    else if (profile.readinessScore >= 60) probability += 0.05;
    else if (profile.readinessScore < 40) probability -= 0.10;

    // Urgency penalty (rushed applications have lower approval)
    if (profile.urgency === 'critical') probability -= 0.05;

    // Clamp between 0 and 1
    return Math.max(0.1, Math.min(0.95, probability));
  }

  /**
   * Parse speed string to days
   */
  private parseSpeed(timeframe: string): number {
    const match = timeframe.match(/(\d+)(?:-(\d+))?\s*(hour|day|week)/i);
    if (!match) return 30; // Default to 30 days

    const min = parseInt(match[1]);
    const max = match[2] ? parseInt(match[2]) : min;
    const unit = match[3].toLowerCase();

    const avg = (min + max) / 2;

    switch (unit) {
      case 'hour': return avg / 24;
      case 'day': return avg;
      case 'week': return avg * 7;
      default: return avg;
    }
  }

  /**
   * Estimate net cost of capital
   */
  private estimateNetCost(source: FundingSource, amount: number): number {
    const { costStructure } = source;

    if (costStructure.fees && costStructure.fees.includes('1.2-1.4x')) {
      // Revenue-based financing
      return amount * 0.3; // 30% average cost
    }

    if (costStructure.apr) {
      // Extract APR percentage
      const aprMatch = costStructure.apr.match(/(\d+(?:\.\d+)?)/);
      if (aprMatch) {
        const apr = parseFloat(aprMatch[1]) / 100;
        const years = 3; // Assume 3-year term
        return amount * apr * years;
      }
    }

    // Fallback estimate
    return amount * 0.15;
  }

  /**
   * Calculate composite score
   */
  private calculateCompositeScore(
    approvalProbability: number,
    speed: number,
    netCost: number,
    profile: FundingProfile
  ): number {
    let score = 0;

    // Normalize speed (inverse, faster is better)
    const speedScore = Math.max(0, 100 - speed * 2); // 50 days = 0 points

    // Normalize cost (inverse, cheaper is better)
    const costScore = Math.max(0, 100 - (netCost / profile.targetAmount) * 200);

    // Approval probability (0-100)
    const approvalScore = approvalProbability * 100;

    // Apply weights based on mode
    switch (this.config.mode) {
      case 'fastest-money':
        score = speedScore * 0.5 + approvalScore * 0.35 + costScore * 0.15;
        break;
      case 'lowest-cost':
        score = costScore * 0.5 + approvalScore * 0.35 + speedScore * 0.15;
        break;
      case 'balanced':
      default:
        score = approvalScore * 0.4 + speedScore * 0.3 + costScore * 0.3;
        break;
    }

    return Math.round(score);
  }

  /**
   * Generate explanation
   */
  private generateExplanation(
    source: FundingSource,
    user: User,
    profile: FundingProfile,
    approvalProbability: number
  ): string {
    const reasons: string[] = [];

    if (approvalProbability >= 0.8) {
      reasons.push('Excellent match based on your profile');
    } else if (approvalProbability >= 0.65) {
      reasons.push('Good fit for your situation');
    } else {
      reasons.push('Possible option with some limitations');
    }

    if (user.profile.creditTier === 'excellent' || user.profile.creditTier === 'good') {
      reasons.push('strong credit profile');
    }

    if (user.profile.timeInBusiness && source.minTimeInBusiness && 
        user.profile.timeInBusiness >= source.minTimeInBusiness * 1.5) {
      reasons.push('well-established business history');
    }

    if (user.profile.annualRevenue && source.minRevenue && 
        user.profile.annualRevenue >= source.minRevenue * 2) {
      reasons.push('strong revenue performance');
    }

    return reasons.join(', ') + '.';
  }

  /**
   * Identify tradeoffs
   */
  private identifyTradeoffs(source: FundingSource, speed: number, netCost: number): string[] {
    const tradeoffs: string[] = [];

    if (speed <= 3) {
      tradeoffs.push('Very fast approval, but may have higher costs');
    } else if (speed >= 30) {
      tradeoffs.push('Longer timeline, but typically lower rates');
    }

    if (source.costStructure.apr && parseFloat(source.costStructure.apr) < 10) {
      tradeoffs.push('Low APR, but extensive documentation required');
    }

    if (source.type === 'alternative') {
      tradeoffs.push('Flexible requirements, but higher total cost');
    }

    if (source.requirements.length > 5) {
      tradeoffs.push('Comprehensive requirements may extend timeline');
    }

    return tradeoffs;
  }

  /**
   * Generate next actions
   */
  private generateNextActions(source: FundingSource, user: User): string[] {
    const actions: string[] = [];

    if (source.requirements.includes('Active business checking account')) {
      actions.push('Connect business bank account');
    }

    if (source.requirements.some(r => r.includes('statement'))) {
      actions.push('Prepare financial statements');
    }

    if (source.requirements.some(r => r.includes('credit'))) {
      actions.push('Complete credit authorization');
    }

    if (!user.profile.businessName) {
      actions.push('Complete business profile');
    }

    if (actions.length === 0) {
      actions.push('Review full requirements', 'Start application process');
    }

    return actions.slice(0, 4);
  }

  /**
   * Identify blockers
   */
  private identifyBlockers(
    source: FundingSource,
    user: User,
    profile: FundingProfile
  ): string[] {
    const blockers: string[] = [];

    if (user.trustScore.score < 60 && source.requirements.length > 3) {
      blockers.push('Increase trust score to unlock faster processing');
    }

    if (profile.readinessScore < 50) {
      blockers.push('Improve readiness score for better approval odds');
    }

    if (source.minCreditScore && source.minCreditScore >= 680 && 
        (user.profile.creditTier === 'fair' || user.profile.creditTier === 'poor')) {
      blockers.push('Credit score may need improvement');
    }

    return blockers;
  }

  /**
   * Calculate confidence in recommendation
   */
  private calculateConfidence(
    source: FundingSource,
    user: User,
    profile: FundingProfile
  ): number {
    let confidence = 0.7; // Base confidence

    // More data = higher confidence
    if (user.profile.annualRevenue) confidence += 0.05;
    if (user.profile.timeInBusiness) confidence += 0.05;
    if (user.emailVerified && user.phoneVerified) confidence += 0.05;
    if (profile.intakeCompleted) confidence += 0.10;
    if (user.trustScore.score >= 70) confidence += 0.05;

    return Math.min(0.95, confidence);
  }
}
