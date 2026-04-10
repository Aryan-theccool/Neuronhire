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
    <div className="search-bar-premium">
      <div className="search-icon">🔍</div>
      <input 
        type="text" 
        placeholder="Search by name, skill, or project type..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}
