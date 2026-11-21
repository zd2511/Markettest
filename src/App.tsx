import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X, Globe2, ChartNoAxesCombined, Workflow, Code2, ArrowRight, MoveUpRight, Sparkles } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Planet from './components/Planet'
import CustomCursor from './components/CustomCursor'
import site from './data/site.json'

gsap.registerPlugin(ScrollTrigger)

const iconMap = {
  web: Globe2,
  marketing: ChartNoAxesCombined,
  automation: Workflow,
  software: Code2
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [planetReady, setPlanetReady] = useState(false)
  const hero = useRef<HTMLElement>(null)
  const sections = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', { y: 34, opacity: 0, duration: 1, stagger: 0.16, ease: 'power3.out', delay: 0.25 })
      gsap.from('.hero-kicker', { opacity: 0, letterSpacing: '0.7em', duration: 1.3, ease: 'power3.out' })
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(el, { y: 52, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.95, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 84%', once: true }
        })
      })
      gsap.to('.hero-planet-layer', {
        yPercent: 16, scale: 0.94, ease: 'none',
        scrollTrigger: { trigger: hero.current, start: 'top top', end: 'bottom top', scrub: 1 }
      })
      gsap.to('.hero-orbit-glow', {
        rotation: 12, ease: 'none',
        scrollTrigger: { trigger: hero.current, start: 'top top', end: 'bottom top', scrub: 1 }
      })
    }, sections)
    return () => ctx.revert()
  }, [])

  const markPlanetReady = useCallback(() => setPlanetReady(true), [])
  const closeMenu = () => setMenuOpen(false)
  const navItems = ['Home', 'Services', 'Portfolio', 'About', 'Pricing', 'Contact']

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const subject = encodeURIComponent('Project enquiry — TA Rocket Marketing')
    const body = encodeURIComponent(`Name: ${form.get('name')}\nEmail: ${form.get('email')}\n\nProject details:\n${form.get('message')}`)
    const email = 'ADD-BUSINESS-EMAIL-HERE'
    if (email.startsWith('ADD-')) {
      alert('The contact form is in setup mode. Add the business email in src/App.tsx before publishing.')
      return
    }
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  return <div className="app-shell" ref={sections}>
    <CustomCursor />
    <div className="ambient-grain" />
    <header className="topbar">
      <a className="brand-mark" href="#home" aria-label="TA Rocket Marketing home">
        <img src="/assets/ta-rocket-logo.jpg" alt="TA Rocket Marketing" />
      </a>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
        {navItems.map((item, i) => <a key={item} className={i === 0 ? 'nav-active' : ''} href={`#${item.toLowerCase()}`} onClick={closeMenu}>{item}</a>)}
      </nav>
      <a className="top-cta" href="#contact">Let's Talk <ArrowUpRight size={15}/></a>
    </header>

    <main>
      <section className="hero" id="home" ref={hero}>
        <div className="hero-space">
          <div className="space-stars stars-one" /><div className="space-stars stars-two" />
          <div className="nebula-cloud cloud-a"/><div className="nebula-cloud cloud-b"/>
          <div className="solar-flare"><span/></div>
          <div className="hero-planet-layer">
            <div className="planet-aura"/>
            <Planet onReady={markPlanetReady} />
            <div className="hero-orbit-glow orbit-a"/>
            <div className="hero-orbit-glow orbit-b"/>
            <div className="hero-orbit-glow orbit-c"/>
          </div>
          <div className="hero-copy">
            <div className="hero-kicker"><span/> DIGITAL GROWTH. NEXT-LEVEL THINKING <span/></div>
            <div className="hero-logo-large"><img src="/assets/ta-rocket-logo.jpg" alt="TA Rocket Marketing logo"/></div>
            <h1>TARGET THE RIGHT <em>AUDIENCE.</em><br/>LAUNCH REAL <em>RESULTS.</em></h1>
            <p>Big ideas deserve more than ordinary execution. We build the digital engines that move ambitious businesses forward.</p>
            <div className="hero-buttons"><a className="button-primary" href="#contact">Launch a project <ArrowUpRight size={17}/></a><a className="button-quiet" href="#services">Explore our universe <span>↓</span></a></div>
          </div>
          <div className="planet-hint">{planetReady ? 'INTERACTIVE PLANET · DRAG TO ROTATE' : 'INITIALISING PLANET SYSTEM'} <span className={planetReady ? 'status-dot ready' : 'status-dot'}/></div>
          <div className="hero-bottomline"><span>STRATEGY <b>✦</b> DESIGN <b>✦</b> TECHNOLOGY</span><span>SCROLL TO EXPLORE <i/></span></div>
        </div>
      </section>

      <section className="services-section section-pad" id="services">
        <div className="section-topline reveal"><span>01 / WHAT WE DO</span><span>BUILT FOR BUSINESS. DESIGNED FOR IMPACT.</span></div>
        <div className="section-heading reveal"><p className="eyebrow">GROW YOUR BUSINESS</p><h2>DIGITAL <em>MARKETING</em></h2><p className="lead">Websites. Marketing. Automation. Software.</p></div>
        <div className="service-rail">
          {site.services.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap]
            return <a className="service-rail-item reveal" href="#contact" key={service.number}>
              <span className="service-index">{service.number} / SERVICE</span><Icon className="service-icon" strokeWidth={1.25}/>
              <h3>{service.title}</h3><p>{service.description}</p><span className="service-arrow"><ArrowUpRight size={18}/></span>
            </a>
          })}
        </div>
      </section>

      <section className="statement-section">
        <div className="statement-grid">
          <div className="statement-orbit"><div className="mini-planet"/><div className="mini-ring"/></div>
          <div className="statement-copy reveal"><p className="eyebrow">02 / THE BIGGER PICTURE</p><h2>DON'T JUST<br/>SHOW UP.<br/><em>STAND OUT.</em></h2><p>Every touchpoint is an opportunity. Every interaction can move someone closer. We bring your digital presence, marketing and technology together into one clear direction.</p><a className="text-arrow" href="#contact">Build something that moves <ArrowUpRight size={16}/></a></div>
        </div>
      </section>

      <section className="experience-section section-pad" id="portfolio">
        <div className="section-topline reveal"><span>03 / THE EXPERIENCE</span><span>YOUR NEXT CHAPTER STARTS HERE</span></div>
        <div className="section-heading reveal"><p className="eyebrow">POSSIBILITIES WITHOUT LIMITS</p><h2>MAKE YOUR<br/><em>MARK.</em></h2><p className="lead">Your business deserves a digital presence with a point of view.</p></div>
        <div className="experience-grid">
          <article className="experience-card card-web reveal"><div className="card-art web-art"><div className="browser-frame"><div/><div/><div/><span>YOUR BRAND<br/>IN A NEW LIGHT.</span></div></div><div className="card-meta"><span>01 — DIGITAL PRESENCE</span><ArrowUpRight/></div><h3>Websites that<br/>make an entrance.</h3></article>
          <article className="experience-card card-growth reveal"><div className="card-art growth-art"><div className="growth-orbit"/><div className="growth-signal">↗</div><div className="growth-lines"/></div><div className="card-meta"><span>02 — GROWTH SYSTEMS</span><ArrowUpRight/></div><h3>Reach the people<br/>who move you forward.</h3></article>
          <article className="experience-card card-tech reveal"><div className="card-art tech-art"><div className="tech-core">TA<span>✦</span></div><div className="tech-circuit circuit-one"/><div className="tech-circuit circuit-two"/></div><div className="card-meta"><span>03 — CUSTOM TECHNOLOGY</span><ArrowUpRight/></div><h3>Technology with<br/>a purpose.</h3></article>
        </div>
        <p className="portfolio-disclaimer">Portfolio showcases can be populated with approved client work and live project links.</p>
      </section>

      <section className="about-section" id="about">
        <div className="about-sun"/>
        <div className="about-inner reveal"><p className="eyebrow">04 / WHO WE ARE</p><h2>YOUR VISION.<br/>OUR <em>MISSION.</em></h2><p>TA Rocket Marketing exists to help businesses move beyond the ordinary. We combine creative thinking and practical technology to build digital experiences that have a reason to exist — and a job to do.</p><a className="button-outline" href="#contact">Get to know us <ArrowUpRight size={17}/></a></div>
        <div className="about-coordinate">26° 42' S &nbsp; 27° 50' E <span>MISSION CONTROL</span></div>
      </section>

      <section className="pricing-section section-pad" id="pricing">
        <div className="section-heading reveal"><p className="eyebrow">05 / YOUR NEXT MOVE</p><h2>READY FOR<br/><em>TAKE-OFF?</em></h2><p className="lead">Tell us what you want to achieve. We'll shape the right solution around your goals.</p><a className="button-primary" href="#contact">Request a tailored quote <ArrowUpRight size={17}/></a></div>
      </section>

      <section className="contact-section section-pad" id="contact">
        <div className="contact-orb"/>
        <div className="contact-layout">
          <div className="contact-intro reveal"><p className="eyebrow">06 / MAKE CONTACT</p><h2>LET'S<br/>LAUNCH<br/><em>YOUR IDEA.</em></h2><p>One conversation can be the start of something extraordinary. Tell us what you're thinking.</p><div className="contact-coordinate">TRANSMISSION CHANNEL OPEN <span/></div></div>
          <form className="contact-form reveal" onSubmit={handleSubmit}>
            <label>Your name<input name="name" placeholder="How should we address you?" required/></label>
            <label>Email address<input name="email" type="email" placeholder="you@company.com" required/></label>
            <label>What do you need?<select name="service" defaultValue=""><option value="" disabled>Select a service</option><option>Web Design & Development</option><option>Digital Marketing</option><option>Automation</option><option>Custom Software</option><option>Something else</option></select></label>
            <label>Tell us about your project<textarea name="message" rows={4} placeholder="Give us the mission briefing..." required/></label>
            <button className="button-primary" type="submit">Send your transmission <ArrowUpRight size={17}/></button>
            <small>Contact form is in setup mode until the business email is configured.</small>
          </form>
        </div>
      </section>
    </main>
    <footer className="footer"><a href="#home" className="footer-brand">TA ROCKET <em>MARKETING</em></a><span>© {new Date().getFullYear()} TA Rocket Marketing. All systems go.</span><a href="#home">BACK TO ORBIT ↑</a></footer>
  </div>
}