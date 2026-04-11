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
    <div className="page-container" style={{ paddingTop: '2rem' }}>
      <header className="cinema-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
          <h1>Explore AI Engineers</h1>
          <div className="count-badge" style={{ background: 'rgba(173, 198, 255, 0.1)', border: '1px solid rgba(173, 198, 255, 0.2)' }}>
            <span className="pulse-dot" />
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{totalEngineers || 0} engineers live</span>
          </div>
        </div>
        <p className="subtitle" style={{ maxWidth: '700px', fontSize: '1.1rem', opacity: 0.8 }}>
          Discover elite engineers with verified proof-of-work portfolios and high-fidelity neural implementations.
        </p>
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
              engineers.map((e: any) => (
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

    </div>
  )
}
