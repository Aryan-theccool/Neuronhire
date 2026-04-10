'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signup } from '../actions'
import { useSearchParams } from 'next/navigation'

export default function SignupPage() {
  const [role, setRole] = useState<'engineer' | 'company'>('engineer')
  const [step, setStep] = useState(1)
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  return (
    <div style={{maxWidth: 540, margin: '4rem auto', padding: '0 1.5rem'}}>
      <div style={{textAlign: 'center', marginBottom: '2.5rem'}}>
        <h1 style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          {step === 1 ? 'Join NeuralHire' : `Step ${step}: ${step === 2 ? 'AI Capability' : step === 3 ? 'Proof of Work' : 'Matching Engine'}`}
        </h1>
        <p style={{color: 'var(--on-surface-variant)'}}>
          {step === 1 ? 'Start your AI career or find top AI talent' : 'Help us match you with the right opportunities'}
        </p>
      </div>

      {message && (
        <p className="error-message" style={{color: 'red', textAlign: 'center', marginBottom: '1.5rem', padding: '0.75rem', background: 'rgba(255,0,0,0.1)', borderRadius: 'var(--radius-md)'}}>
          {message}
        </p>
      )}

      {/* Progress Bar */}
      {role === 'engineer' && step > 1 && (
        <div style={{display: 'flex', gap: '4px', marginBottom: '2rem'}}>
          {[1, 2, 3, 4].map(num => (
            <div key={num} style={{height: 4, flex: 1, background: num <= step ? 'var(--primary)' : 'var(--surface-container-highest)', borderRadius: 2, transition: 'all 0.3s'}} />
          ))}
        </div>
      )}

      {step === 1 && (
        <div style={{display: 'flex', gap: '0.5rem', marginBottom: '2rem'}}>
          <button
            type="button"
            className={role === 'engineer' ? 'btn-primary' : 'btn-secondary'}
            style={{flex: 1}} onClick={() => setRole('engineer')}>
            {"I'm an Engineer"}
          </button>
          <button
            type="button"
            className={role === 'company' ? 'btn-primary' : 'btn-secondary'}
            style={{flex: 1}} onClick={() => setRole('company')}>
            {"I'm a Company"}
          </button>
        </div>
      )}

      <form action={signup}>
        <input type="hidden" name="role" value={role} />

        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" name="email" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password" placeholder="Min 8 characters" required minLength={8} />
            </div>
            {role === 'engineer' && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" name="full_name" placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-input" type="text" name="location" placeholder="Bangalore, India" required />
                </div>
              </>
            )}
            
            <button 
              type={role === 'company' ? 'submit' : 'button'} 
              onClick={() => role === 'engineer' ? nextStep() : null} 
              className="btn-primary" 
              style={{width: '100%', marginTop: '1rem'}}
            >
              {role === 'engineer' ? 'Next: Capability Profile' : 'Create Company Account'}
            </button>
          </div>
        )}

        {/* STEP 2: AI CAPABILITY */}
        {step === 2 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            <div className="form-group">
              <label className="form-label">Primary Languages</label>
              <input className="form-input" type="text" name="primary_languages" placeholder="Python, JavaScript, C++, etc. (comma separated)" required />
            </div>
            <div className="form-group">
              <label className="form-label">Frameworks & Tools</label>
              <input className="form-input" type="text" name="frameworks" placeholder="LangChain, PyTorch, OpenAI, HuggingFace" />
            </div>
            <div className="form-group">
              <label className="form-label">Domain Expertise</label>
              <select name="domain_expertise" className="form-input" required multiple style={{height: '120px', padding: '0.5rem'}}>
                <option value="NLP">NLP (Natural Language Processing)</option>
                <option value="CV">Computer Vision</option>
                <option value="RAG">RAG & Vector DBs</option>
                <option value="Agents">AI Agents & Autonomy</option>
                <option value="Automation">Workflow Automation</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Skill Level</label>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                {['Beginner', 'Intermediate', 'Expert'].map(level => (
                  <label key={level} style={{flex: 1, cursor: 'pointer'}}>
                    <input type="radio" name="skill_level" value={level} style={{display: 'none'}} />
                    <div className="btn-secondary" style={{width: '100%', textAlign: 'center', padding: '0.5rem', fontSize: '12px'}}>
                      {level}
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <button type="button" onClick={prevStep} className="btn-secondary" style={{flex: 1}}>Back</button>
              <button type="button" onClick={nextStep} className="btn-primary" style={{flex: 1}}>Next: Proof of Work</button>
            </div>
          </div>
        )}

        {/* STEP 3: PROOF OF WORK */}
        {step === 3 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '1rem'}}>Add one high-impact case study to prove your architectural depth.</p>
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input className="form-input" type="text" name="project_title" placeholder="e.g. Autonomous Sales Agent" required />
            </div>
            <div className="form-group">
              <label className="form-label">Problem</label>
              <textarea className="form-input" name="project_problem" placeholder="What was the challenge?" rows={3} required />
            </div>
            <div className="form-group">
              <label className="form-label">Approach & Result</label>
              <textarea className="form-input" name="project_outcome" placeholder="How did you solve it and what was the impact?" rows={3} required />
            </div>
            <div className="form-group">
              <label className="form-label">Demo or GitHub Link</label>
              <input className="form-input" type="url" name="project_url" placeholder="https://github.com/..." />
            </div>
            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <button type="button" onClick={prevStep} className="btn-secondary" style={{flex: 1}}>Back</button>
              <button type="button" onClick={nextStep} className="btn-primary" style={{flex: 1}}>Next: Preferences</button>
            </div>
          </div>
        )}

        {/* STEP 4: PREFERENCES & PAYOUT */}
        {step === 4 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            <div className="form-group">
              <label className="form-label">Available for</label>
              <select name="work_type" className="form-input" required>
                <option value="full-time">Full-time Job</option>
                <option value="freelance">Freelance / Gig</option>
                <option value="bounties">Bounties Only</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Expected Hourly Rate (USD)</label>
              <input className="form-input" type="number" name="hourly_rate" placeholder="40" required />
            </div>
            <div className="form-group">
              <label className="form-label">UPI ID or Payout Link</label>
              <input className="form-input" type="text" name="payout_id" placeholder="yourname@upi" />
            </div>
            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <button type="button" onClick={prevStep} className="btn-secondary" style={{flex: 1}}>Back</button>
              <button type="submit" className="btn-primary" style={{flex: 1}}>Complete Onboarding</button>
            </div>
          </div>
        )}
      </form>
      
      {step === 1 && (
        <>
          <div style={{textAlign: 'center', margin: '1.5rem 0', color: 'var(--outline)'}}>or</div>
          <button className="btn-secondary" style={{width: '100%', marginBottom: '0.75rem'}}>Continue with GitHub</button>
          <button className="btn-secondary" style={{width: '100%'}}>Continue with Google</button>
          <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)'}}>
            Already have an account? <Link href="/login">Sign In</Link>
          </p>
        </>
      )}
    </div>
  )
}

