export interface Engineer {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  ai_philosophy: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  ai_stack: string[];
  specializations: string[];
  neuron_score: number;
  is_available: boolean;
  hourly_rate_inr: number | null;
  created_at: string;
}

export interface Company {
  id: string;
  company_name: string;
  logo_url: string | null;
  website: string | null;
  industry: string | null;
  size: string | null;
  ai_readiness_score: number;
  is_verified: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  engineer_id: string;
  title: string;
  problem: string | null;
  approach: string | null;
  outcome: string | null;
  tech_stack: string[];
  demo_url: string | null;
  github_url: string | null;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface SkillBadge {
  id: string;
  engineer_id: string;
  badge_type: string;
  verified: boolean;
  score: number | null;
  earned_at: string;
}

export interface JobPosting {
  id: string;
  company_id: string;
  title: string;
  description: string;
  engagement_type: 'fulltime' | 'internship' | 'hourly' | 'project';
  skills_required: string[];
  budget_min_inr: number | null;
  budget_max_inr: number | null;
  min_neuron_score: number;
  duration: string | null;
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
  company?: Company;
}

export interface Proposal {
  id: string;
  job_id: string;
  engineer_id: string;
  cover_note: string;
  proposed_rate_inr: number | null;
  timeline: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  engineer?: Engineer;
}

export interface Bounty {
  id: string;
  company_id: string;
  title: string;
  problem_description: string;
  expected_output: string | null;
  reward_inr: number;
  skills_needed: string[];
  deadline: string | null;
  status: string;
  winner_id: string | null;
  created_at: string;
  company?: Company;
}

export interface BountySubmission {
  id: string;
  bounty_id: string;
  engineer_id: string;
  solution_description: string;
  demo_url: string | null;
  github_url: string | null;
  status: string;
  created_at: string;
}

export interface MarketplaceProduct {
  id: string;
  engineer_id: string;
  name: string;
  description: string;
  category: 'agent' | 'model' | 'saas' | 'workflow' | 'dataset' | 'template';
  pricing_model: string | null;
  price_inr: number | null;
  demo_url: string | null;
  docs_url: string | null;
  thumbnail_url: string | null;
  tech_stack: string[];
  avg_rating: number;
  total_sales: number;
  status: string;
  created_at: string;
  engineer?: Engineer;
}

export interface Contract {
  id: string;
  job_id: string;
  engineer_id: string;
  company_id: string;
  total_inr: number;
  escrow_payment_id: string | null;
  status: 'active' | 'completed' | 'disputed';
  started_at: string;
  completed_at: string | null;
}

export interface Review {
  id: string;
  contract_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}
