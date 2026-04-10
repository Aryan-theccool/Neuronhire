import { createClient } from '@/lib/supabase/server'
import EngineerCard from '@/components/profile/EngineerCard'
import FilterSidebar from '@/components/profile/FilterSidebar'
import SearchBar from '@/components/profile/SearchBar'
import Link from 'next/link'

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    search?: string
    available?: string
    demo?: string
    skills?: string
    sort?: string
  }>
}

export default async function EngineersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // 1. Fetch total count for the badge
  const { count: totalEngineers } = await supabase
    .from('engineers')
    .select('*', { count: 'exact', head: true })

  // 2. Build the query
  let query = supabase
    .from('engineers')
    .select('*')

  // Apply Search
  if (params.search) {
    query = query.or(`full_name.ilike.%${params.search}%,username.ilike.%${params.search}%`)
  }

  // Apply Availability
  if (params.available === 'true') {
    query = query.eq('is_available', true)
  }

  // Apply Skill Filters
  if (params.skills) {
    const skillList = params.skills.split(',')
    // Correct way to filter by overlapping arrays in Supabase
    query = query.contains('ai_stack', skillList)
  }

  // Apply Sorting
  if (params.sort === 'neuron_score') {
    query = query.order('neuron_score', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: engineers, error } = await query.limit(20)

  if (error) {
    console.error('Fetch Engineers Error:', error)
  }

  return (
    <div className="page-container">
      <header className="exploration-header">
        <div className="header-top">
          <h1>Explore AI Engineers</h1>
          <div className="count-badge">
            <span className="pulse-dot" />
            {totalEngineers || 0} engineers available
          </div>
        </div>
        <p className="subtitle">Discover engineers with verified proof-of-work portfolios and live demos</p>
      </header>

      <div className="explorer-layout">
        <FilterSidebar />

        <main className="explorer-main">
          <div className="results-controls">
            <SearchBar />
            
            <div className="sort-dropdown-container">
              <select className="sort-select-premium">
                <option value="best_match">Best Match</option>
                <option value="neuron_score">Highest NeuronScore</option>
                <option value="recent">Newest Members</option>
              </select>
            </div>
          </div>

          <div className="results-info">
            Showing <span className="highlight">1–{engineers?.length || 0}</span> of <span className="highlight">{totalEngineers || 0}</span> engineers
          </div>

          <div className="engineers-grid">
            {engineers && engineers.length > 0 ? (
              engineers.map((e) => (
                <EngineerCard key={e.username} engineer={e} />
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🤖</div>
                <h3>No engineers found</h3>
                <p>Try adjusting your search or filters to find more talent.</p>
                <Link href="/engineers" className="btn-secondary" style={{marginTop: '1.5rem'}}>
                  Clear all filters
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        .exploration-header { margin-bottom: 3rem; }
        .header-top { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 0.5rem; }
        .header-top h1 { font-size: 2.5rem; color: #fff; margin: 0; font-family: var(--font-display); }
        .count-badge { 
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.375rem 0.75rem; background: rgba(168, 85, 247, 0.1); 
          border-radius: 999px; color: var(--primary); font-family: var(--font-display);
          font-weight: 700; font-size: 0.8rem; border: 1px solid rgba(168, 85, 247, 0.2);
        }
        .pulse-dot { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 10px var(--primary); }
        .subtitle { color: var(--on-surface-variant); font-size: 1.1rem; }

        .explorer-layout { display: grid; grid-template-columns: 280px 1fr; gap: 3rem; }
        
        .explorer-main { min-width: 0; }
        .results-controls { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        
        .sort-select-premium {
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff; padding: 0 1.25rem; border-radius: var(--radius-lg); font-weight: 600; 
          height: 100%; outline: none; cursor: pointer; min-width: 160px;
        }
        .sort-select-premium:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.15); }

        .results-info { margin-bottom: 2rem; color: var(--on-surface-variant); font-size: 0.9rem; }
        .highlight { color: #fff; font-weight: 600; font-family: var(--font-display); }

        .engineers-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); 
          gap: 2rem; 
        }

        .no-results { 
          text-align: center; padding: 5rem 0; grid-column: 1 / -1; 
          background: var(--surface-container); border-radius: var(--radius-xl);
          border: 1px dashed var(--outline-variant);
        }
        .no-results-icon { font-size: 3rem; margin-bottom: 1rem; }
        .no-results h3 { color: #fff; margin-bottom: 0.5rem; }
        .no-results p { color: var(--on-surface-variant); }

        @media (max-width: 1024px) {
          .explorer-layout { grid-template-columns: 1fr; }
          .header-top { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
        }
      `}</style>
    </div>
  )
}
