# Animation System

A comprehensive animation system for Next.js applications using Framer Motion, GSAP, and React Spring.

## Features

- **Framer Motion**: Perfect for React-specific animations and gestures
- **GSAP**: High-performance animations with precise control
- **React Spring**: Physics-based animations for natural motion
- **Scroll-triggered animations**: Animate elements as they come into view
- **Staggered animations**: Create beautiful sequence animations
- **Responsive**: Works on all screen sizes
- **Performant**: Optimized for 60fps animations

## Installation

```bash
npm install framer-motion gsap @gsap/react @react-spring/web
```

## Usage

### 1. Wrap your app with AnimationProvider

```tsx
// app/layout.tsx
import { AnimationProvider } from '@/lib/animations/AnimationContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AnimationProvider>
          {children}
        </AnimationProvider>
      </body>
    </html>
  );
}
```

### 2. Use Framer Motion components

```tsx
import { FadeIn, FadeInStaggered } from '@/components/animations/motion/FadeIn';

function Component() {
  return (
    <div>
      <FadeIn>
        <div>This will fade in when it comes into view</div>
      </FadeIn>
      
      <FadeInStaggered stagger={0.1}>
        {items.map((item) => (
          <div key={item.id}>{item.text}</div>
        ))}
      </FadeInStaggered>
    </div>
  );
}
```

### 3. Use GSAP Scroll Reveal

```tsx
import { ScrollReveal, ScrollRevealStaggered } from '@/components/animations/gsap/ScrollReveal';

function Component() {
  return (
    <div>
      <ScrollReveal yOffset={50} duration={1}>
        <div>This will animate in on scroll</div>
      </ScrollReveal>
      
      <ScrollRevealStaggered stagger={0.2} yOffset={30}>
        {items.map((item) => (
          <div key={item.id}>{item.text}</div>
        ))}
      </ScrollRevealStaggered>
    </div>
  );
}
```

### 4. Use React Spring

```tsx
import { AnimatedContainer, StaggeredContainer } from '@/components/animations/spring/AnimatedContainer';

function Component() {
  return (
    <div>
      <AnimatedContainer
        from={{ opacity: 0, y: 50 }}
        to={{ opacity: 1, y: 0 }}
        config={{ tension: 170, friction: 26 }}
        delay={200}
      >
        <div>This will animate with spring physics</div>
      </AnimatedContainer>
      
      <StaggeredContainer
        from={{ opacity: 0, x: 50 }}
        to={{ opacity: 1, x: 0 }}
        config={{ tension: 170, friction: 26 }}
        delay={200}
        trail={100}
      >
        {items.map((item) => (
          <div key={item.id}>{item.text}</div>
        ))}
      </StaggeredContainer>
    </div>
  );
}
```

## Animation Presets

Import and use pre-defined animation presets:

```tsx
import { fadeIn, slideInFromLeft, scaleIn } from '@/components/animations/presets';

// Use with Framer Motion
<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeIn}
>
  Content
</motion.div>

// Use with GSAP
gsap.to(element, {
  ...gsapFadeIn,
  onComplete: () => console.log('Animation complete')
});

// Use with React Spring
const [styles, api] = useSpring(() => ({
  ...springFadeIn,
  onRest: () => console.log('Animation complete')
}));
```

## Custom Hooks

### useScrollAnimation

Create scroll-triggered animations:

```tsx
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

function Component() {
  const { ref, isInView, progress } = useScrollAnimation({
    trigger: null, // Optional: Element or selector to use as trigger
    start: 'top 80%', // When to start the animation
    end: 'top 20%', // When to end the animation
    onEnter: () => console.log('Entered view'),
    onLeave: () => console.log('Left view'),
  });

  return (
    <div ref={ref}>
      {isInView ? 'In view' : 'Out of view'}
      <div style={{ width: `${progress * 100}%` }} />
    </div>
  );
}
```

### useScrollTimeline

Create a scroll-triggered timeline:

```tsx
import { useScrollTimeline } from '@/hooks/useScrollAnimation';

gsap.registerPlugin(ScrollTrigger);

function Component() {
  const { ref, timeline } = useScrollTimeline((tl) => {
    tl.from('.element', { opacity: 0, y: 50 });
    tl.to('.element', { opacity: 1, y: 0 });
  });

  return (
    <div ref={ref}>
      <div className="element">Animated element</div>
    </div>
  );
}
```

## Best Practices

1. **Use the right tool for the job**:
   - Use **Framer Motion** for React component animations and gestures
   - Use **GSAP** for complex timelines and scroll-triggered animations
   - Use **React Spring** for physics-based animations

2. **Optimize performance**:
   - Use `will-change: transform` for elements that will be animated
   - Avoid animating properties that trigger layout recalculations
   - Use `transform` and `opacity` for smooth animations

3. **Accessibility**:
   - Respect `prefers-reduced-motion`
   - Ensure animations don't cause motion sickness
   - Provide controls to pause/stop animations

4. **Testing**:
   - Test animations on different devices and screen sizes
   - Ensure animations work with keyboard navigation
   - Verify performance on lower-end devices

## Examples

See the `/animations-demo` page for live examples of all animation types.

## License

MIT
