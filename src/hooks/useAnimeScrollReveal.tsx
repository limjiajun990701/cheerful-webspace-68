
import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

interface UseAnimeScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  animationType?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'bounce';
  duration?: number;
  easing?: string;
}

export const useAnimeScrollReveal = (options: UseAnimeScrollRevealOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
    animationType = 'fade',
    duration = 800,
    easing = 'easeOutQuart'
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial state based on animation type
    const getInitialStyles = () => {
      switch (animationType) {
        case 'slide-up':
          return { opacity: 0, translateY: 50 };
        case 'slide-down':
          return { opacity: 0, translateY: -50 };
        case 'slide-left':
          return { opacity: 0, translateX: 50 };
        case 'slide-right':
          return { opacity: 0, translateX: -50 };
        case 'scale':
          return { opacity: 0, scale: 0.8 };
        case 'bounce':
          return { opacity: 0, scale: 0.3 };
        default:
          return { opacity: 0 };
      }
    };

    const getFinalStyles = () => {
      switch (animationType) {
        case 'slide-up':
        case 'slide-down':
          return { opacity: 1, translateY: 0 };
        case 'slide-left':
        case 'slide-right':
          return { opacity: 1, translateX: 0 };
        case 'scale':
        case 'bounce':
          return { opacity: 1, scale: 1 };
        default:
          return { opacity: 1 };
      }
    };

    // Apply initial styles
    anime.set(element, getInitialStyles());

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Cancel any existing animation
          if (animationRef.current) {
            animationRef.current.pause();
          }

          // Create new animation
          animationRef.current = anime({
            targets: element,
            ...getFinalStyles(),
            duration,
            delay,
            easing,
            complete: () => {
              if (triggerOnce) {
                observer.unobserve(element);
              }
            }
          });

          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          // Reset to initial state if not triggerOnce
          if (animationRef.current) {
            animationRef.current.pause();
          }
          anime.set(element, getInitialStyles());
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    // Reset animations on page change
    const handleReset = () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
      anime.set(element, getInitialStyles());
    };

    window.addEventListener('resetScrollAnimations', handleReset);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        animationRef.current.pause();
      }
      window.removeEventListener('resetScrollAnimations', handleReset);
    };
  }, [threshold, rootMargin, triggerOnce, delay, animationType, duration, easing]);

  return { ref };
};
