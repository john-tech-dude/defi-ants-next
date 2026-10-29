import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useVisionAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a timeline for the animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        end: 'bottom center',
        toggleActions: 'play none none none',
      },
    });

    // Image animation
    if (imageRef.current) {
      // Parallax effect
      gsap.to(imageRef.current, {
        y: 50,
        scrollTrigger: {
          trigger: containerRef.current,
          scrub: 1,
          start: 'top bottom',
          end: 'bottom top',
        },
      });

      // Subtle floating animation
      gsap.to(imageRef.current, {
        y: '+=20',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // Content reveal animation
    if (titleRef.current && textRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo(
        textRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      );
    }

    // Hover effect for the image container
    if (containerRef.current) {
      containerRef.current.addEventListener('mouseenter', () => {
        gsap.to(imageRef.current, {
          scale: 1.03,
          duration: 0.8,
          ease: 'power2.out',
        });
      });

      containerRef.current.addEventListener('mouseleave', () => {
        gsap.to(imageRef.current, {
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return {
    containerRef,
    imageRef,
    contentRef,
    titleRef,
    textRef,
  };
};
