import { createClient } from '@/lib/supabase/server'
import { SAMPLE_PRODUCTS } from '@/lib/samples'
import EngineerCard from '@/components/profile/EngineerCard'

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
    query = query.ilike('full_name', `%${params.search}%`)
  }

  // Apply Availability
  if (params.available === 'true') {
    query = query.eq('is_available', true)
  }

  // Apply Skill Filters
  if (params.skills) {
    const skillList = params.skills.split(',')
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

  const activeSkills = params.skills?.split(',') || []

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
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3 className="filter-title">Quick Filters</h3>
            <div className="filter-toggle">
              <span>Has live demo</span>
              <label className="switch">
                <input type="checkbox" defaultChecked={params.demo === 'true'} />
                <span className="slider" />
              </label>
            </div>
            <div className="filter-toggle">
              <span className="active-label">Available now</span>
              <label className="switch">
                <input type="checkbox" defaultChecked={params.available === 'true'} />
                <span className="slider" />
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">AI Skills</h3>
            <div className="checkbox-list">
              {['LLMs / GPT-4', 'LangChain', 'RAG Pipelines', 'AI Agents', 'NLP / spaCy', 'Computer Vision', 'Fine-tuning'].map((skill) => (
                <label key={skill} className="checkbox-item">
                  <input 
                    type="checkbox" 
                    defaultChecked={activeSkills.includes(skill)}
                  />
                  <span className="item-name">{skill}</span>
                  <span className="item-count">{Math.floor(Math.random() * 100) + 50}</span>
                </label>
              ))}
            </div>
            <button className="show-more">Show 5 more skills</button>
          </div>
        </aside>

        <main className="explorer-main">
          <div className="results-controls">
            <div className="search-bar">
              <div className="search-icon">🔍</div>
              <input type="text" placeholder="Search by name, skill, or project type..." defaultValue={params.search} />
            </div>
            
            <div className="sort-dropdown">
              <button className="filter-trigger">
                <span>⚡ Filters</span>
              </button>
              <select defaultValue={params.sort || 'best_match'} className="sort-select">
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
                <p>No engineers found matching your filters.</p>
                <button className="btn-secondary">Clear all filters</button>
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        .exploration-header { margin-bottom: 3rem; }
        .header-top { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 0.5rem; }
        .header-top h1 { font-size: 2.5rem; color: #fff; margin: 0; }
        .count-badge { 
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.375rem 0.75rem; background: rgba(168, 85, 247, 0.1); 
          border-radius: 999px; color: var(--primary); font-family: var(--font-display);
          font-weight: 700; font-size: 0.8rem;
        }
        .pulse-dot { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 10px var(--primary); }
        .subtitle { color: var(--on-surface-variant); font-size: 1.1rem; }

        .explorer-layout { display: grid; grid-template-columns: 280px 1fr; gap: 3rem; }
        .filters-sidebar { position: sticky; top: 6rem; height: fit-content; }
        .filter-section { margin-bottom: 2.5rem; }
        .filter-title { 
          font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--on-surface-variant); margin-bottom: 1.25rem; font-weight: 700;
        }
        .filter-toggle { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; color: var(--on-surface-variant); font-size: 0.9rem; }
        .active-label { color: #fff; font-weight: 500; }

        .checkbox-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .checkbox-item { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; }
        .checkbox-item input { accent-color: var(--primary); width: 16px; height: 16px; }
        .item-name { flex: 1; font-size: 0.9rem; color: var(--on-surface-variant); }
        .checkbox-item:hover .item-name { color: #fff; }
        .item-count { font-size: 0.75rem; color: var(--outline); font-family: var(--font-display); }
        .show-more { background: none; border: none; color: var(--primary); font-size: 0.8rem; font-weight: 600; margin-top: 1rem; cursor: pointer; }

        .results-controls { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .search-bar { 
          flex: 1; display: flex; align-items: center; gap: 0.75rem;
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-lg); padding-left: 1.25rem;
        }
        .search-bar input { background: transparent; border: none; color: #fff; flex: 1; padding: 0.875rem 0; outline: none; }
        
        .sort-dropdown { display: flex; gap: 1rem; }
        .filter-trigger { 
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff; padding: 0 1.25rem; border-radius: var(--radius-lg); font-weight: 600;
        }
        .sort-select {
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff; padding: 0 1.25rem; border-radius: var(--radius-lg); font-weight: 600; outline: none;
        }

        .results-info { margin-bottom: 2rem; color: var(--on-surface-variant); font-size: 0.9rem; }
        .highlight { color: #fff; font-weight: 600; font-family: var(--font-display); }

        .engineers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 2rem; }
        .no-results { text-align: center; padding: 5rem 0; grid-column: 1 / -1; }
      `}</style>
    </div>
  )
}
