'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set('search', query)
      } else {
        params.delete('search')
      }
      router.push(`/engineers?${params.toString()}`)
    }, 500)

    return () => clearTimeout(timer)
  }, [query, router, searchParams])

  return (
    <div className="search-bar">
      <div className="search-icon">🔍</div>
      <input 
        type="text" 
        placeholder="Search by name, skill, or project type..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <style jsx>{`
        .search-bar { 
          flex: 1; display: flex; align-items: center; gap: 0.75rem;
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-lg); padding-left: 1.25rem;
        }
        .search-bar input { background: transparent; border: none; color: #fff; flex: 1; padding: 0.875rem 0; outline: none; }
        .search-icon { color: var(--on-surface-variant); }
      `}</style>
    </div>
  )
}
