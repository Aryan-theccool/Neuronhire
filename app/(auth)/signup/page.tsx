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
      {step > 1 && (
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
            
            {role === 'engineer' ? (
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
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input className="form-input" type="text" name="company_name" placeholder="e.g. Neural Dynamics" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <input className="form-input" type="text" name="industry" placeholder="FinTech, Healthcare, etc." required />
                </div>
              </>
            )}
            
            <button 
              type="button" 
              onClick={nextStep} 
              className="btn-primary" 
              style={{width: '100%', marginTop: '1rem'}}
            >
              {role === 'engineer' ? 'Next: Capability Profile' : 'Next: AI Readiness'}
            </button>
          </div>
        )}

        {/* STEP 2: CAPABILITY (ENGINEER) / AI READINESS (COMPANY) */}
        {step === 2 && role === 'engineer' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            <div className="form-group">
              <label className="form-label">Primary Languages</label>
              <input className="form-input" type="text" name="primary_languages" placeholder="Python, JavaScript, etc." required />
            </div>
            <div className="form-group">
              <label className="form-label">Frameworks & Tools</label>
              <input className="form-input" type="text" name="frameworks" placeholder="LangChain, PyTorch, etc." />
            </div>
            <div className="form-group">
              <label className="form-label">Domain Expertise</label>
              <select name="domain_expertise" className="form-input" required multiple style={{height: '120px', padding: '0.5rem'}}>
                <option value="NLP">NLP (Natural Language Processing)</option>
                <option value="CV">Computer Vision</option>
                <option value="RAG">RAG & Vector DBs</option>
                <option value="Agents">AI Agents & Autonomy</option>
              </select>
            </div>
            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <button type="button" onClick={prevStep} className="btn-secondary" style={{flex: 1}}>Back</button>
              <button type="button" onClick={nextStep} className="btn-primary" style={{flex: 1}}>Next: Proof of Work</button>
            </div>
          </div>
        )}

        {step === 2 && role === 'company' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            <div className="form-group">
              <label className="form-label">Have you used AI before?</label>
              <select name="used_ai" className="form-input" required>
                <option value="yes">Yes, heavily</option>
                <option value="no">No, first time</option>
                <option value="exploring">Just exploring</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Type of Needs</label>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                {['Chatbot', 'Automation', 'Model', 'Analytics'].map(need => (
                  <label key={need} style={{padding: '0.5rem 1rem', background: 'var(--surface-container)', borderRadius: '999px', fontSize: '13px', cursor: 'pointer'}}>
                    <input type="checkbox" name="ai_needs" value={need} style={{marginRight: '0.5rem'}} />
                    {need}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Approx. Monthly Budget (INR)</label>
              <select name="budget_range" className="form-input" required>
                <option value="10k-50k">₹10k – ₹50k</option>
                <option value="50k-2L">₹50k – ₹2L</option>
                <option value="2L+">₹2L+</option>
              </select>
            </div>
            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <button type="button" onClick={prevStep} className="btn-secondary" style={{flex: 1}}>Back</button>
              <button type="button" onClick={nextStep} className="btn-primary" style={{flex: 1}}>Next: Hiring Intent</button>
            </div>
          </div>
        )}

        {/* STEP 3: PROOF OF WORK (ENGINEER) / PROBLEM DEFINITION (COMPANY) */}
        {step === 3 && role === 'engineer' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input className="form-input" type="text" name="project_title" placeholder="e.g. Sales Voice AI" required />
            </div>
            <div className="form-group">
              <label className="form-label">Problem</label>
              <textarea className="form-input" name="project_problem" rows={3} required />
            </div>
            <div className="form-group">
              <label className="form-label">Approach & Result</label>
              <textarea className="form-input" name="project_outcome" rows={3} required />
            </div>
            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <button type="button" onClick={prevStep} className="btn-secondary" style={{flex: 1}}>Back</button>
              <button type="button" onClick={nextStep} className="btn-primary" style={{flex: 1}}>Next: Preferences</button>
            </div>
          </div>
        )}

        {step === 3 && role === 'company' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            <p style={{fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '0.5rem'}}>Define a specific problem to attract top AI talent immediately.</p>
            <div className="form-group">
              <label className="form-label">Problem Title</label>
              <input className="form-input" type="text" name="problem_title" placeholder="e.g. Automation of Customer Support" required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" name="problem_description" placeholder="What challenge are you facing?" rows={2} required />
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Timeline</label>
                <input className="form-input" type="text" name="timeline" placeholder="e.g. 2 Weeks" required />
              </div>
              <div className="form-group">
                <label className="form-label">Budget (₹)</label>
                <input className="form-input" type="number" name="problem_budget" placeholder="25000" required />
              </div>
            </div>
            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <button type="button" onClick={prevStep} className="btn-secondary" style={{flex: 1}}>Back</button>
              <button type="button" onClick={nextStep} className="btn-primary" style={{flex: 1}}>Next: Discovery</button>
            </div>
          </div>
        )}

        {/* STEP 4: FINAL SETTINGS */}
        {step === 4 && role === 'engineer' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            <div className="form-group">
              <label className="form-label">Expected Hourly Rate (USD)</label>
              <input className="form-input" type="number" name="hourly_rate" placeholder="40" required />
            </div>
            <div className="form-group">
              <label className="form-label">UPI ID or Payout Link</label>
              <input className="form-input" type="text" name="payout_id" placeholder="your@upi" />
            </div>
            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <button type="button" onClick={prevStep} className="btn-secondary" style={{flex: 1}}>Back</button>
              <button type="submit" className="btn-primary" style={{flex: 1}}>Complete Onboarding</button>
            </div>
          </div>
        )}

        {step === 4 && role === 'company' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            <div className="form-group">
              <label className="form-label">Target Experience</label>
              <select name="min_experience" className="form-input" required>
                <option value="Any">Any Experience</option>
                <option value="Junior">Junior (1-3 yrs)</option>
                <option value="Senior">Senior (5+ yrs)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select name="payment_method" className="form-input" required>
                <option value="razorpay">Razorpay / NetBanking</option>
                <option value="upi">Direct UPI</option>
                <option value="escrow">Neuron Escrow</option>
              </select>
            </div>
            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <button type="button" onClick={prevStep} className="btn-secondary" style={{flex: 1}}>Back</button>
              <button type="submit" className="btn-primary" style={{flex: 1}}>Activate Client Account</button>
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

