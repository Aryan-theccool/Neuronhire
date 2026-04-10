'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleToggle = (name: string, checked: boolean) => {
    router.push(`/engineers?${createQueryString(name, checked ? 'true' : '')}`)
  }

  const handleSkillChange = (skill: string, checked: boolean) => {
    const currentSkills = searchParams.get('skills')?.split(',') || []
    let newSkills = checked 
      ? [...currentSkills, skill]
      : currentSkills.filter(s => s !== skill)
    
    router.push(`/engineers?${createQueryString('skills', newSkills.join(','))}`)
  }

  return (
    <aside className="filters-sidebar">
      <div className="filter-section">
        <h3 className="filter-title">Quick Filters</h3>
        <div className="filter-toggle">
          <span>Has live demo</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={searchParams.get('demo') === 'true'} 
              onChange={(e) => handleToggle('demo', e.target.checked)}
            />
            <span className="slider" />
          </label>
        </div>
        <div className="filter-toggle">
          <span className={searchParams.get('available') === 'true' ? 'active-label' : ''}>Available now</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={searchParams.get('available') === 'true'} 
              onChange={(e) => handleToggle('available', e.target.checked)}
            />
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
                checked={(searchParams.get('skills')?.split(',') || []).includes(skill)}
                onChange={(e) => handleSkillChange(skill, e.target.checked)}
              />
              <span className="item-name">{skill}</span>
              <span className="item-count">12</span>
            </label>
          ))}
        </div>
        <button className="show-more">Show 5 more skills</button>
      </div>
      
      <style jsx>{`
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
        
        .switch { position: relative; display: inline-block; width: 34px; height: 20px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--surface-container-highest); transition: .4s; border-radius: 20px;
        }
        .slider:before {
          position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px;
          background-color: white; transition: .4s; border-radius: 50%;
        }
        input:checked + .slider { background-color: var(--primary); }
        input:checked + .slider:before { transform: translateX(14px); }
      `}</style>
    </aside>
  )
}
