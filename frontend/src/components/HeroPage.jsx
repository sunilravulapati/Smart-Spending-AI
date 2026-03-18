import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

// Animated number counter that starts when scrolled into view
const Counter = ({ target, prefix = '', suffix = '', duration = 2000 }) => {
  const [current, setCurrent] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const animate = (now) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCurrent(Math.floor(eased * target))
          if (progress < 1) requestAnimationFrame(animate)
          else setCurrent(target)
        }
        requestAnimationFrame(animate)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{prefix}{current.toLocaleString('en-IN')}{suffix}</span>
}

// Dashboard preview mockup
const DashboardPreview = () => (
  <div className="hero-preview">
    <div className="preview-glow" />
    <div className="preview-card">
      <div className="preview-header">
        <div className="preview-dots"><span /><span /><span /></div>
        <span className="preview-title-text">ProsperOS · Dashboard</span>
      </div>
      <div className="preview-body">
        <div className="preview-stat-row">
          <div className="preview-stat">
            <div className="preview-stat-label">Net Income</div>
            <div className="preview-stat-val" style={{ color: 'var(--accent-green)' }}>₹60,000</div>
          </div>
          <div className="preview-stat">
            <div className="preview-stat-label">Free Cash</div>
            <div className="preview-stat-val" style={{ color: 'var(--primary)' }}>₹28,500</div>
          </div>
          <div className="preview-stat">
            <div className="preview-stat-label">Net Worth</div>
            <div className="preview-stat-val" style={{ color: 'var(--accent-blue)' }}>₹4.82L</div>
          </div>
        </div>
        <div className="preview-bars">
          {[55, 40, 72, 48, 85, 63, 90].map((h, i) => (
            <div key={i} className="preview-bar-wrap">
              <div
                className="preview-bar"
                style={{
                  height: `${h}%`,
                  animationDelay: `${0.6 + i * 0.08}s`,
                  background: i === 6 ? 'var(--primary)' : i === 4 ? 'var(--accent-blue)' : 'var(--surface-3)'
                }}
              />
            </div>
          ))}
        </div>
        <div className="preview-score-row">
          <div className="preview-score-ring">
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="17" fill="none" stroke="var(--surface-3)" strokeWidth="4" />
              <circle
                cx="22" cy="22" r="17" fill="none"
                stroke="var(--accent-blue)" strokeWidth="4"
                strokeLinecap="round" strokeDasharray="106.8"
                strokeDashoffset="29"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '22px 22px' }}
              />
            </svg>
            <div className="preview-score-num">72</div>
          </div>
          <div className="preview-score-info">
            <div className="preview-score-title">Health Score</div>
            <div className="preview-score-grade">Good · B+</div>
          </div>
          <div className="preview-ai-badge">✦ AI Ready</div>
        </div>
      </div>
    </div>
    <div className="preview-float preview-float-1">
      <div className="preview-float-icon" style={{ color: 'var(--accent-green)' }}>↑</div>
      <div>
        <div className="preview-float-val">47.5%</div>
        <div className="preview-float-lbl">Savings Rate</div>
      </div>
    </div>
    <div className="preview-float preview-float-2">
      <div className="preview-float-icon" style={{ color: 'var(--primary)' }}>✦</div>
      <div>
        <div className="preview-float-val">Safe</div>
        <div className="preview-float-lbl">AI Verdict</div>
      </div>
    </div>
  </div>
)

const HeroPage = () => {
  return (
    <div className="hero-page">

      {/* Ambient background */}
      <div className="hero-bg">
        <div className="hero-bg-orb hero-bg-orb-1" />
        <div className="hero-bg-orb hero-bg-orb-2" />
        <div className="hero-bg-grid" />
      </div>

      {/* ── FOLD ── */}
      <section className="hero-fold">
        <div className="hero-fold-left">
          <div className="hero-badge-wrap">
            <span className="hero-badge-dot" />
            <span>AI-Powered Personal Finance</span>
          </div>

          <h1 className="hero-title">
            Your money,<br />
            <span className="hero-title-accent">finally<br />under control</span>
          </h1>

          <p className="hero-sub">
            Track expenses, set goals, analyze investments and get
            Groq AI-powered advice — all in one dark, fast, beautiful dashboard.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="hero-cta-primary">
              <span>Get Started Free</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link to="/login" className="hero-cta-ghost">I already have an account</Link>
          </div>

          <div className="hero-trust">
            {['No credit card', 'HTTP-only cookies', 'Free forever'].map((t, i) => (
              <div key={i} className="hero-trust-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-fold-right">
          <DashboardPreview />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="hero-stats-bar">
        {[
          { num: 47, suffix: '%', label: 'Avg savings rate tracked', color: 'var(--primary)' },
          { num: 6, suffix: ' pillars', label: 'Health score metrics', color: 'var(--accent-blue)' },
          { num: 100, suffix: '%', label: 'Data stays yours', color: 'var(--accent-green)' },
          { num: 0, prefix: '₹', suffix: ' fees', label: 'Always free', color: 'var(--primary)' },
        ].map((s, i) => (
          <>
            <div key={i} className="hero-stat-item">
              <div className="hero-stat-num" style={{ color: s.color }}>
                <Counter target={s.num} prefix={s.prefix} suffix={s.suffix} duration={1600 + i * 200} />
              </div>
              <div className="hero-stat-lbl">{s.label}</div>
            </div>
            {i < 3 && <div key={`d${i}`} className="hero-stat-divider" />}
          </>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className="hero-features-section">
        <div className="hero-section-label">What's inside</div>
        <h2 className="hero-section-title">Everything your finances need</h2>

        <div className="hero-features-grid">
          {[
            {
              color: 'blue',
              tag: 'New',
              title: 'Financial Health Score',
              desc: 'A composite 0–100 score across savings rate, debt ratio, emergency runway and net worth — updated live as you type.',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            },
            {
              color: 'amber',
              tag: 'AI',
              title: 'Groq AI Analysis',
              desc: 'Powered by Llama 3.3 70B. Get personalized verdicts on every purchase — Safe or Risky — with full financial context.',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            },
            {
              color: 'purple',
              tag: null,
              title: 'Bill Calendar',
              desc: 'See exactly which days cash leaves your account. Hover any day to see the bill. Spot dangerous clusters before they happen.',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            },
            {
              color: 'green',
              tag: null,
              title: '"What If?" Simulator',
              desc: 'Drag sliders to stress-test your budget. What if salary grows 20%? What if rent jumps 30%? See the live impact.',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
            },
            {
              color: 'amber',
              tag: null,
              title: 'Goal Milestone Rings',
              desc: 'Every savings goal gets a progress ring with a projected completion date based on your monthly contribution.',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            },
            {
              color: 'blue',
              tag: null,
              title: 'Secure by Design',
              desc: 'JWT tokens live only in HTTP-only cookies — never in localStorage. Your data never leaves your own MongoDB instance.',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            },
          ].map((f, i) => (
            <div key={i} className={`hf-card hf-card-${f.color}`} style={{ animationDelay: `${i * 0.07}s` }}>
              <div className={`hf-icon hf-icon-${f.color}`}>{f.icon}</div>
              <div className="hf-body">
                <div className="hf-title-row">
                  <h3 className="hf-title">{f.title}</h3>
                  {f.tag && <span className={`hf-tag hf-tag-${f.color}`}>{f.tag}</span>}
                </div>
                <p className="hf-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="hero-cta-section">
        <div className="hero-cta-inner">
          <div className="hero-cta-glow" />
          <h2 className="hero-cta-title">Ready to take control?</h2>
          <p className="hero-cta-sub">Free. No card needed. Takes 30 seconds.</p>
          <Link to="/register" className="hero-cta-primary hero-cta-large">
            <span>Start tracking your money</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>
      </section>

    </div>
  )
}

export default HeroPage