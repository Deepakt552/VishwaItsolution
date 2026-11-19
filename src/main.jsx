import React, { useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import {
  Check, CircuitBoard, Laptop,
  Mail, MapPin, Menu, Monitor, Phone, Search, X,
} from 'lucide-react';
import { base, business, directions, money, whatsapp } from './business';
import catalog from './catalog.json';
import Reviews from './Reviews';
import Inventory from './Inventory';
import Reveal from './Reveal';
import AnimatedIcon from './AnimatedIcon';
import WhatsAppIcon from './WhatsAppIcon';
export { business, justdialListing, mapsListing } from './business';
import './styles.css';

const nav = [['services', 'Services'], ['amc', 'AMC Plans'], ['shop', 'Shop'], ['reviews', 'Reviews'], ['contact', 'Contact']];
const services = [
  { icon: 'laptop', title: 'Laptop & PC Repair', info: 'Troubleshoot slow systems, broken screens, power faults and hardware failures.' },
  { icon: 'network', title: 'Networking', info: 'Set up or troubleshoot Wi‑Fi, routers, cabling and office networks.' },
  { icon: 'recovery', title: 'Data Recovery', info: 'Get an assessment for missing files, inaccessible drives and data backup options.' },
  { icon: 'upgrades', title: 'IT Support & Upgrades', info: 'Get help with Windows, software setup, SSD or RAM upgrades and system maintenance.' },
];
const categories = ['All devices', 'Laptops', 'Desktops'];

function Chat({ children, message, className = 'button primary', icon = 'white' }) {
  return <a className={`${className} whatsapp-link`} href={whatsapp(message)} target="_blank" rel="noreferrer"><WhatsAppIcon variant={icon} />{children}</a>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <>
    <div className="topbar"><div className="wrap top-inner">
      <a href={directions} target="_blank" rel="noreferrer"><MapPin size={15} /> Nalasopara East, Maharashtra</a>
      <a href={`tel:${business.phone}`}><Phone size={14} /> {business.phoneText}</a>
    </div></div>
    <header className="header">
      <div className="wrap header-inner">
        <a className="brand" href="#home" aria-label="Vishwa IT Solutions home"><img src={`${base}vishwa-logo.svg`} alt="Vishwa IT Solutions" width="192" height="63" /></a>
        <button type="button" className="menu-button" aria-controls="site-nav" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav id="site-nav" className={menuOpen ? 'nav open' : 'nav'} aria-label="Main">
          {nav.map(([id, title]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{title}</a>)}
        </nav>
        <Chat className="button header-chat">WhatsApp us</Chat>
      </div>
    </header>
  </>;
}

function Hero() {
  return <section className="hero" id="home">
    <div className="wrap hero-grid">
      <Reveal className="hero-copy">
        <p className="eyebrow"><span /> VISHWA IT SOLUTIONS · VASAI-VIRAR</p>
        <h1>Laptop &amp; PC repair <em>in Nalasopara East</em></h1>
        <p className="hero-description">Get help with hardware faults, slow computers and data recovery. We also provide office IT maintenance and sell pre-owned laptops and desktops.</p>
        <div className="actions">
          <Chat icon="black" message="Hi Vishwa IT Solutions, I’d like help with a computer repair.">Chat on WhatsApp</Chat>
          <a href="#shop" className="button pale"><Laptop size={19} /> Browse used computers</a>
        </div>
      </Reveal>
      <Reveal className="hero-visual" delay={100}>
        <img src={`${base}repair-bench.webp`} alt="A technician working on an open laptop motherboard" fetchPriority="high" width="1200" height="800" />
        <div className="hero-caption"><CircuitBoard size={19} /> PC & LAPTOP REPAIR</div>
      </Reveal>
    </div>
  </section>;
}

function Services() {
  return <section id="services" className="section">
    <div className="wrap"><Reveal className="section-head">
      <div><p className="eyebrow">REPAIR & SUPPORT</p><h2>How we can help</h2></div>
      <p>Bring us a device issue or tell us what you need for your home or office.</p>
    </Reveal>
    <div className="service-grid">
      {services.map(({ icon, title, info }, index) => <Reveal as="article" key={title} className="service-card" delay={index * 65}>
        <AnimatedIcon name={icon} />
        <h3>{title}</h3><p>{info}</p>
        <Chat icon="black" className="text-link" message={`Hi Vishwa IT Solutions, I’d like to enquire about ${title}.`}>Enquire on WhatsApp</Chat>
      </Reveal>)}
    </div></div>
  </section>;
}

function Maintenance() {
  return <section id="amc" className="section amc">
    <div className="wrap amc-inner">
      <Reveal>
        <p className="eyebrow">ANNUAL MAINTENANCE CONTRACTS</p><h2>IT support for your office.</h2>
        <p>Tell us how many devices you use and what support you need. We’ll discuss the right maintenance scope for your setup.</p>
        <Chat message="Hi Vishwa IT Solutions, I’d like an annual maintenance contract quote for my office. Number of computers: ">Request an AMC quote</Chat>
      </Reveal>
      <Reveal className="amc-card" delay={90}>
        <AnimatedIcon name="calendar" />
        <h3>What we can cover</h3>
        <ul>{['Scheduled computer maintenance', 'Desktop, laptop and office network support', 'Troubleshooting and upgrade planning'].map(item => <li key={item}><Check size={17} /> {item}</li>)}</ul>
      </Reveal>
    </div>
  </section>;
}

function Shop() {
  const [category, setCategory] = useState(categories[0]);
  const [search, setSearch] = useState('');
  const matches = catalog.filter(item => item.status !== 'Sold'
    && (category === categories[0] || category === item.category)
    && [item.name, item.specs, item.condition].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
  const categoryName = category === categories[0] ? 'pre-owned laptops or desktops' : `pre-owned ${category.toLowerCase()}`;
  return <section id="shop" className="section shop">
    <div className="wrap">
      <Reveal className="section-head">
        <div><p className="eyebrow">THE PRE-OWNED SHOP</p><h2>Laptops & desktops</h2></div>
        <p>Check specs and condition, then confirm price and availability with us on WhatsApp.</p>
      </Reveal>
      <Reveal className="shop-controls" delay={55}>
        <div className="filters" role="group" aria-label="Device category">
          {categories.map(label => <button key={label} type="button" aria-pressed={category === label} onClick={() => setCategory(label)}>{label}</button>)}
        </div>
        <label className="search"><Search size={19} /><input aria-label="Search computers" placeholder="Search by model or specs" value={search} onChange={event => setSearch(event.target.value)} /></label>
      </Reveal>
      {matches.length ? <div className="product-grid">
        {matches.map((item, index) => <Reveal as="article" className="product-card" key={item.id} delay={index % 3 * 65}>
          {item.image ? <img className="product-photo" src={item.image} alt={item.name} loading="lazy" /> : <div className="product-photo empty-photo">{item.category === 'Laptops' ? <Laptop size={46} /> : <Monitor size={46} />}</div>}
          <div className="product-copy">
            <p className="product-meta">{item.category} · {item.condition}</p>
            <h3>{item.name}</h3><p>{item.specs}</p>
            <strong>{item.price === '' || item.price == null ? 'Ask for price' : money.format(item.price)}</strong>
            <Chat icon="black" className="text-link" message={`Hi Vishwa IT Solutions, is the ${item.name} still available? Listing ID: ${item.id}.`}>Check on WhatsApp</Chat>
          </div>
        </Reveal>)}
      </div> : <Reveal className="shop-empty">
        <div className="service-icon">{category === 'Desktops' ? <Monitor size={26} /> : <Laptop size={26} />}</div>
        <div><h3>{search.trim() ? 'No matching devices' : 'Ask about current stock'}</h3><p>{search.trim() ? 'Try a different search or send us the model you’re looking for.' : 'Tell us your budget and what you need the computer for. We’ll let you know what’s available.'}</p></div>
        <Chat icon="black" className="button secondary" message={`Hi Vishwa IT Solutions, I’m looking for ${categoryName}.${search.trim() ? ` Model or specs: ${search.trim()}.` : ''}`}>Ask on WhatsApp</Chat>
      </Reveal>}
    </div>
  </section>;
}

function Contact() {
  return <section id="contact" className="section contact">
    <div className="wrap contact-grid">
      <Reveal><p className="eyebrow">GET IN TOUCH</p><h2>Visit or get help.</h2><p>Message us with your device, issue or budget, or call to check before visiting.</p></Reveal>
      <Reveal className="contact-card" delay={90}>
        <div><MapPin size={22} /><div><h3>Find us</h3><address>{business.address}</address><a href={directions} target="_blank" rel="noreferrer">Get directions</a></div></div>
        <div><Phone size={21} /><div><h3>Call</h3><a href={`tel:${business.phone}`}>{business.phoneText}</a></div></div>
        <div><WhatsAppIcon /><div><h3>WhatsApp</h3><a href={whatsapp()} target="_blank" rel="noreferrer">Start a chat</a></div></div>
        {business.email && <div><Mail size={22} /><div><h3>Email</h3><a href={`mailto:${business.email}`}>{business.email}</a></div></div>}
      </Reveal>
    </div>
  </section>;
}

function FrequentlyAsked() {
  return <section className="section faq" id="faq" aria-labelledby="faq-title">
    <div className="wrap faq-grid">
      <Reveal><h2 id="faq-title">Laptop repair questions</h2><p>What to know before you contact us or visit.</p></Reveal>
      <div className="faq-list">
        <Reveal as="details">
          <summary>What laptop and desktop issues can you help with?</summary>
          <p>Contact us about a laptop that won’t turn on, a broken screen, a slow computer, a faulty drive, or RAM and SSD upgrades. Describe the symptoms so we can discuss what to check first.</p>
        </Reveal>
        <Reveal as="details" delay={55}>
          <summary>How do I ask for a repair quote?</summary>
          <p><a className="whatsapp-link faq-chat" href={whatsapp('Hi Vishwa IT Solutions, I’d like a repair quote. Device model and issue: ')} target="_blank" rel="noreferrer"><WhatsAppIcon variant="black" size={16} />Send your device model and symptoms on WhatsApp</a>. The price depends on the fault and any parts needed.</p>
        </Reveal>
        <Reveal as="details" delay={110}>
          <summary>Where is Vishwa IT Solutions located?</summary>
          <p>We’re in Hawai Pada, Nalasopara East, Vasai-Virar. See the <a href="#contact">full address and directions</a>, or call to check before visiting.</p>
        </Reveal>
        <Reveal as="details" delay={165}>
          <summary>Do you offer office AMC and networking support?</summary>
          <p>Yes. Ask about <a href="#amc">annual maintenance contracts</a> for your office computers and network. Share your device count and the kind of support you need for a quote.</p>
        </Reveal>
      </div>
    </div>
  </section>;
}

export function App() {
  return <>
    <a href="#main" className="skip">Skip to content</a>
    <Header />
    <main id="main"><Hero /><Services /><Maintenance /><Shop /><Reviews /><FrequentlyAsked /><Contact /></main>
    <footer><div className="wrap footer-inner"><span>© Vishwa IT Solutions</span><a href={`tel:${business.phone}`}>{business.phoneText}</a></div></footer>
    <a className="float-chat" href={whatsapp()} target="_blank" rel="noreferrer" aria-label="Chat with Vishwa IT Solutions on WhatsApp"><WhatsAppIcon size={32} /></a>
  </>;
}

if (!import.meta.env.SSR) {
  const root = document.getElementById('root');
  if (new URLSearchParams(location.search).has('inventory')) {
    createRoot(root).render(<Inventory />);
  } else if (root.hasChildNodes()) {
    hydrateRoot(root, <App />);
  } else {
    createRoot(root).render(<App />);
  }
}
