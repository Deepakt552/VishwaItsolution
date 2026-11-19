import React, { useState } from 'react';
import { base, money } from './business';
import published from './catalog.json';

const draftKey = 'vishwa-catalog-draft-v1';
const blank = { name: '', category: 'Laptops', specs: '', condition: '', price: '', image: '', status: 'Available' };

function readDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(draftKey));
    if (Array.isArray(saved)) return saved;
  } catch {
    // The checked-in catalog also works when browser storage is unavailable.
  }
  return published;
}

export default function Inventory() {
  const [entries, setEntries] = useState(readDraft);
  const [form, setForm] = useState(blank);
  const [notice, setNotice] = useState('');

  function saveDraft(next) {
    setEntries(next);
    try {
      localStorage.setItem(draftKey, JSON.stringify(next));
      setNotice('Draft saved in this browser.');
    } catch {
      setNotice('Browser storage is unavailable. Export your changes before leaving.');
    }
  }

  function saveEntry(event) {
    event.preventDefault();
    const entry = {
      ...form,
      name: form.name.trim(), specs: form.specs.trim(), condition: form.condition.trim(),
      image: form.image.trim(), price: form.price === '' ? null : Number(form.price),
      id: form.id || globalThis.crypto.randomUUID(),
    };
    if (!entry.name || !entry.specs || !entry.condition) {
      setNotice('Enter a model, specifications and condition.');
      return;
    }
    saveDraft(form.id ? entries.map(current => current.id === form.id ? entry : current) : [...entries, entry]);
    setForm(blank);
  }

  function download() {
    const blob = new Blob([JSON.stringify(entries, null, 2) + '\n'], { type: 'application/json' });
    const uri = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = uri;
    link.download = 'catalog.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(uri), 1000);
  }

  function field(name, label, options = {}) {
    return <label>{label}<input {...options} value={form[name] ?? ''} onChange={event => setForm({ ...form, [name]: event.target.value })} /></label>;
  }

  return <main className="wrap inventory">
    <a href={base}>Back to storefront</a>
    <h1>Inventory editor</h1>
    <p>Use this browser to draft used computer listings. Export your catalog, replace <code>src/catalog.json</code> with the exported file, then rebuild to update the storefront.</p>
    <form className="inventory-form" onSubmit={saveEntry}>
      {field('name', 'Model name', { required: true, maxLength: 100 })}
      <label>Category<select value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}><option>Laptops</option><option>Desktops</option></select></label>
      {field('specs', 'Specifications', { required: true, maxLength: 200 })}
      {field('condition', 'Condition', { required: true, maxLength: 120 })}
      {field('price', 'Price in INR (optional)', { type: 'number', min: 0, step: '0.01' })}
      {field('image', 'Photo URL (optional)', { type: 'url' })}
      <label>Status<select value={form.status} onChange={event => setForm({ ...form, status: event.target.value })}><option>Available</option><option>Sold</option></select></label>
      <div className="actions"><button className="button primary" type="submit">{form.id ? 'Update listing' : 'Add listing'}</button>{form.id && <button className="button secondary" type="button" onClick={() => setForm(blank)}>Cancel edit</button>}</div>
    </form>
    <p role="status">{notice}</p>
    <div className="section-head"><h2>Draft listings</h2><button className="button secondary" onClick={download}>Export catalog</button></div>
    {entries.length ? <ul className="draft-list">{entries.map(entry => <li key={entry.id}>
      <div><strong>{entry.name}</strong><p>{entry.category} · {entry.status} · {entry.price == null || entry.price === '' ? 'Ask for price' : money.format(entry.price)}</p></div>
      <div className="actions">
        <button className="button secondary" onClick={() => { setForm(entry); window.scrollTo(0, 0); }}>Edit</button>
        <button className="button secondary" onClick={() => { saveDraft(entries.filter(item => item.id !== entry.id)); if (form.id === entry.id) setForm(blank); }}>Remove</button>
      </div>
    </li>)}</ul> : <p>There are no draft listings yet.</p>}
  </main>;
}
