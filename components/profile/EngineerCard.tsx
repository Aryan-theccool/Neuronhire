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

      </div>
    </Link>
  )
}
