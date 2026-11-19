import React from 'react';

let observer;

function observe(node) {
  if (!node || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  observer ??= new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.dataset.entered = 'true';
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  observer.observe(node);
  return () => observer.unobserve(node);
}

export default function Reveal({ as: Element = 'div', delay = 0, ...props }) {
  return <Element {...props} ref={observe} data-reveal="" style={delay ? { '--reveal-delay': `${delay}ms` } : undefined} />;
}
