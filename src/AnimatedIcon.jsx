import React, { useEffect, useRef } from 'react';
import { base } from './business';

export default function AnimatedIcon({ name, className = '' }) {
  const picture = useRef(null);
  const container = useRef(null);
  const player = useRef(null);
  const asset = `${base}animations/${name}`;

  useEffect(() => {
    const target = container.current;
    const fallback = picture.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer;
    let generation = 0;

    function reset() {
      generation += 1;
      observer?.disconnect();
      player.current?.destroy();
      player.current = null;
      fallback.hidden = false;
    }

    function schedule() {
      reset();
      if (motion.matches || !('IntersectionObserver' in window)) return;
      const request = generation;
      observer = new IntersectionObserver(async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        try {
          const { default: lottie } = await import('lottie-web/build/player/lottie_light.js');
          if (generation !== request) return;
          const animation = lottie.loadAnimation({
            container: target,
            renderer: 'svg',
            path: `${asset}.json`,
            loop: false,
            autoplay: false,
          });
          player.current = animation;
          animation.addEventListener('DOMLoaded', () => {
            if (generation !== request) return;
            fallback.hidden = true;
            animation.play();
          });
          animation.addEventListener('data_failed', reset);
        } catch {
          if (generation === request) reset();
        }
      }, { threshold: 0.25 });
      observer.observe(target);
    }

    schedule();
    motion.addEventListener('change', schedule);
    return () => {
      motion.removeEventListener('change', schedule);
      reset();
    };
  }, [asset]);

  function replay(event) {
    const animation = player.current;
    if (event.pointerType === 'mouse' && animation?.isLoaded && animation.isPaused) {
      animation.goToAndPlay(0, true);
    }
  }

  return <span className={`service-icon animated-icon ${className}`} aria-hidden="true" onPointerEnter={replay}>
    <img ref={picture} src={`${asset}.svg`} alt="" width="42" height="42" />
    <span className="lottie-stage" ref={container} />
  </span>;
}
