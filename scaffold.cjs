const fs = require('fs');
const path = require('path');
function w(f, c) {
  const d = path.dirname(f);
  if (!fs.existsSync(d)) fs.mkdirSync(d, {recursive: true});
  fs.writeFileSync(f, c, 'utf8');
  console.log('OK: ' + f);
}

// === lib/supabase/client.ts ===
w('lib/supabase/client.ts',
`import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
`);

// === lib/supabase/server.ts ===
w('lib/supabase/server.ts',
`import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
`);

// === lib/supabase/middleware.ts ===
w('lib/supabase/middleware.ts',
`import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  await supabase.auth.getUser()
  return supabaseResponse
}
`);

// === middleware.ts ===
w('middleware.ts',
`import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}
`);

// === lib/neuron-score.ts ===
w('lib/neuron-score.ts',
`export async function calculateNeuronScore(engineerId: string, supabase: any): Promise<number> {
  const [projects, badges, reviews, products, bounties, profile] = await Promise.all([
    supabase.from('projects').select('*').eq('engineer_id', engineerId),
    supabase.from('skill_badges').select('*').eq('engineer_id', engineerId).eq('verified', true),
    supabase.from('reviews').select('rating').eq('reviewee_id', engineerId),
    supabase.from('marketplace_products').select('total_sales,avg_rating').eq('engineer_id', engineerId),
    supabase.from('bounty_submissions').select('status').eq('engineer_id', engineerId).eq('status', 'winner'),
    supabase.from('engineers').select('*').eq('id', engineerId).single(),
  ]);

  const verifiedProjects = (projects.data || []).filter((p: any) => p.demo_url || p.github_url);
  const projectScore = Math.min(verifiedProjects.length * 50 + verifiedProjects.filter((p: any) => p.outcome).length * 20, 300);

  const badgeScore = Math.min((badges.data?.length || 0) * 40, 200);

  const ratings = reviews.data || [];
  const avgRating = ratings.length ? ratings.reduce((s: number, r: any) => s + r.rating, 0) / ratings.length : 0;
  const ratingScore = Math.round(avgRating * 40);

  const prods = products.data || [];
  const salesScore = Math.min(prods.reduce((s: number, p: any) => s + p.total_sales * 2, 0), 100);
  const prodRatingAvg = prods.length ? prods.reduce((s: number, p: any) => s + p.avg_rating, 0) / prods.length : 0;
  const marketScore = Math.min(salesScore + Math.round(prodRatingAvg * 10), 150);

  const bountyWins = Math.min((bounties.data?.length || 0) * 30, 90);
  const p = profile.data;
  const completeness = [p?.bio, p?.avatar_url, p?.github_url, p?.ai_philosophy, p?.ai_stack?.length, p?.location].filter(Boolean).length / 6;
  const communityScore = Math.min(bountyWins + Math.round(completeness * 60), 150);

  const total = Math.min(projectScore + badgeScore + ratingScore + marketScore + communityScore, 1000);
  await supabase.from('engineers').update({ neuron_score: total }).eq('id', engineerId);
  return total;
}
`);

// === lib/razorpay.ts ===
w('lib/razorpay.ts',
`import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
`);

// === lib/utils.ts ===
w('lib/utils.ts',
`import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
`);

// === types/index.ts ===
w('types/index.ts',
`export interface Engineer {
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
`);

console.log('All scaffold files written successfully!');
