'use client'

import Link from 'next/link'
import { getImpactMetric, getProjectImage, getDeterministicRate, getDeterministicProjects, getDeterministicRating } from '@/lib/utils/metrics'

interface EngineerCardProps {
  engineer: {
    id?: string
    username: string
    full_name: string | null
    avatar_url: string | null
    neuron_score: number
    ai_stack: string[]
    is_available: boolean
    hourly_rate?: number
    location?: string
    timezone?: string
    rating?: number
    projects_count?: number
    success_rate?: number
  }
}

export default function EngineerCard({ engineer }: EngineerCardProps) {
  const metric = getImpactMetric(engineer.username)
  const bgImage = getProjectImage(engineer.username)
  
  // Deterministic data for premium feel (prevents hydration mismatch)
  const rate = engineer.hourly_rate || getDeterministicRate(engineer.username)
  const location = engineer.location || "Bangalore, India"
  const timezone = engineer.timezone || "IST"
  const rating = engineer.rating || getDeterministicRating(engineer.username)
  const projects = engineer.projects_count || getDeterministicProjects(engineer.username)
  const successRate = engineer.success_rate || 100

  return (
    <Link href={`/engineer/${engineer.username}`} className="engineer-card-premium">
      <div className="card-banner" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="card-badges">
          <span className="glass-badge glass-badge--featured">★ Featured</span>
          <span className="glass-badge glass-badge--demo">▶ Live Demo</span>
          {engineer.is_available && <span className="glass-badge glass-badge--available">● Available</span>}
        </div>
        
        <div className="impact-container">
          <div className="metric-pill">
            <span className="metric-icon">🚀</span>
            {metric}
          </div>
        </div>
      </div>

      <div className="card-content">
        <div className="engineer-row">
          <div className="engineer-avatar-wrapper">
            {engineer.avatar_url ? (
              <img src={engineer.avatar_url} alt={engineer.full_name || ''} className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">{(engineer.full_name || engineer.username)[0].toUpperCase()}</div>
            )}
            {engineer.is_available && <div className="online-indicator" />}
          </div>
          <div className="engineer-main-info">
            <div className="name-verified">
              <h4>{engineer.full_name || engineer.username}</h4>
              <span className="verified-badge">✓</span>
            </div>
            <p className="role-text">Senior AI Engineer</p>
          </div>
          <div className="rate-info">
            <span className="rate-amount">${rate}</span>
            <span className="rate-unit">/hr</span>
          </div>
        </div>

        <div className="location-stats-row">
          <div className="stat-item">
            <span className="stat-icon">📍</span>
            <span>{location}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🕒</span>
            <span>{timezone}</span>
          </div>
        </div>

        <div className="performance-stats-row">
          <div className="perf-item highlighted">
            <span className="perf-icon">★</span>
            <span className="perf-value">{rating}</span>
            <span className="perf-label">(38)</span>
          </div>
          <div className="perf-item">
            <span className="perf-icon">📁</span>
            <span className="perf-value">{projects} projects</span>
          </div>
          <div className="perf-item">
            <span className="perf-icon">📈</span>
            <span className="perf-value">{successRate}%</span>
          </div>
        </div>

        <div className="skills-row">
          {engineer.ai_stack?.slice(0, 3).map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
          {(engineer.ai_stack?.length || 0) > 3 && (
            <span className="skill-tag more">+{engineer.ai_stack.length - 3}</span>
          )}
        </div>

        <div className="card-footer">
          <span className="response-time">⚡ Responds &lt; 2 hours</span>
        </div>
      </div>

      <style jsx>{`
        .engineer-card-premium {
          display: block; background: var(--surface-container); 
          border-radius: var(--radius-lg); overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.05);
          text-decoration: none; color: inherit;
        }
        .engineer-card-premium:hover {
          transform: translateY(-4px); 
          background: var(--surface-container-high);
          box-shadow: 0 32px 64px rgba(0,0,0,0.5), 0 0 20px rgba(173, 198, 255, 0.1);
          border-color: rgba(173, 198, 255, 0.2);
        }
        .card-banner {
          height: 160px; background-size: cover; background-position: center;
          position: relative; padding: 1rem;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .card-banner::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6));
        }
        .card-badges { position: relative; z-index: 1; display: flex; gap: 0.5rem; }
        .impact-container { position: relative; z-index: 1; display: flex; justify-content: flex-end; }
        
        .card-content { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
        .engineer-row { display: flex; align-items: center; gap: 0.75rem; }
        .engineer-avatar-wrapper { position: relative; width: 44px; height: 44px; flex-shrink: 0; }
        .avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
        .avatar-placeholder { 
          width: 100%; height: 100%; border-radius: 50%; 
          background: var(--primary); color: #000; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .online-indicator {
          position: absolute; bottom: 0; right: 0; width: 12px; height: 12px;
          background: var(--success); border: 2px solid var(--surface-container); border-radius: 50%;
        }
        .engineer-main-info { flex: 1; }
        .name-verified { display: flex; align-items: center; gap: 0.375rem; }
        .name-verified h4 { font-size: 1rem; color: #fff; margin: 0; }
        .verified-badge { color: var(--secondary); font-size: 0.9rem; font-weight: bold; }
        .role-text { font-size: 0.75rem; color: var(--on-surface-variant); margin: 0; }
        
        .rate-info { text-align: right; }
        .rate-amount { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: #fff; }
        .rate-unit { font-size: 0.7rem; color: var(--on-surface-variant); }

        .location-stats-row { display: flex; gap: 1.5rem; }
        .stat-item { display: flex; align-items: center; gap: 0.375rem; font-size: 0.75rem; color: var(--on-surface-variant); }
        .stat-icon { font-size: 0.9rem; }

        .performance-stats-row { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-top: 1px solid rgba(255,255,255,0.05); }
        .perf-item { display: flex; align-items: center; gap: 0.25rem; }
        .perf-icon { font-size: 0.8rem; color: var(--on-surface-variant); }
        .perf-value { font-size: 0.85rem; font-weight: 600; color: #fff; }
        .perf-label { font-size: 0.7rem; color: var(--on-surface-variant); }
        .perf-item.highlighted .perf-icon { color: var(--warning); }
        .perf-item.highlighted .perf-value { color: var(--warning); }

        .skills-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .skill-tag { 
          padding: 0.25rem 0.625rem; background: rgba(255,255,255,0.05); 
          border-radius: var(--radius-sm); font-size: 0.7rem; color: var(--on-surface-variant);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .skill-tag.more { color: var(--primary); }

        .card-footer { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.75rem; }
        .response-time { font-size: 0.7rem; color: var(--on-surface-variant); font-style: italic; }
      `}</style>
    </Link>
  )
}
