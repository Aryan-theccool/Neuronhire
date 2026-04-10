export async function calculateNeuronScore(engineerId: string, supabase: any): Promise<number> {
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
  // Calculate completeness based on the extensive new onboarding v2 fields
  const completenessFactors = [
    p?.bio, p?.avatar_url, p?.github_url, p?.ai_philosophy, p?.location,
    p?.primary_languages?.length > 0,
    p?.frameworks?.length > 0,
    p?.domain_expertise?.length > 0,
    p?.skill_level,
    p?.work_preferences?.work_type,
    p?.payout_info?.payout_id
  ].filter(Boolean).length / 11;

  const communityScore = Math.min(bountyWins + Math.round(completenessFactors * 60), 150);

  const total = Math.min(projectScore + badgeScore + ratingScore + marketScore + communityScore, 1000);
  await supabase.from('engineers').update({ neuron_score: total }).eq('id', engineerId);
  return total;
}
