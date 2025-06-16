
import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  animationType?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'bounce';
}

export const useScrollReveal = (options: UseScrollRevealOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
    animationType = 'fade'
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              setHasAnimated(true);
            }, delay);
          } else {
            setIsVisible(true);
            setHasAnimated(true);
          }
          
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce && !hasAnimated) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated]);

  const getAnimationClasses = () => {
    if (!isVisible) return 'opacity-0';
    
    switch (animationType) {
      case 'slide-up':
        return 'opacity-100 animate-slide-up';
      case 'slide-down':
        return 'opacity-100 animate-slide-down';
      case 'slide-left':
        return 'opacity-100 animate-slide-left';
      case 'slide-right':
        return 'opacity-100 animate-slide-right';
      case 'scale':
        return 'opacity-100 animate-scale-in';
      case 'bounce':
        return 'opacity-100 animate-bounce-in';
      default:
        return 'opacity-100 animate-fade-in';
    }
  };

  return { 
    ref, 
    isVisible, 
    animationClasses: getAnimationClasses(),
    hasAnimated 
  };
};
