'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PremiumCard } from './ui/premium-card';
import { PremiumButton } from './ui/premium-button';
import { GlassPanel } from './ui/glass-panel';
import { SpringCard } from './ui/spring-card';
import { AnimatedText } from './animations/gsap/AnimatedText';
import { PremiumSection } from './animations/gsap/PremiumSection';
import { FadeIn } from './animations/motion/FadeIn';

function PremiumShowcase() {
  return (
    <div className="w-full">
      <PremiumSection 
        animationType="fade" 
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                <AnimatedText type="words" animation="slide" stagger={0.05}>
                  Premium Light Theme & Animations
                </AnimatedText>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                <AnimatedText type="lines" animation="fade" stagger={0.1} delay={0.3}>
                  Experience the enhanced light theme with premium animations powered by Framer Motion, GSAP, and React Spring.
                </AnimatedText>
              </p>
            </FadeIn>
          </div>

          {/* Card Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <FadeIn yOffset={30} delay={0.1}>
              <PremiumCard hoverEffect="lift" className="h-full">
                <h3 className="text-xl font-semibold mb-4">Premium Card</h3>
                <p className="text-muted-foreground mb-4">
                  Framer Motion powered card with smooth lift effect on hover.
                </p>
                <PremiumButton variant="primary" className="w-full">
                  Explore
                </PremiumButton>
              </PremiumCard>
            </FadeIn>

            <FadeIn yOffset={30} delay={0.2}>
              <GlassPanel intensity="medium" className="p-6 h-full">
                <h3 className="text-xl font-semibold mb-4">Glass Panel</h3>
                <p className="text-muted-foreground mb-4">
                  Modern glass morphism effect with hover animations.
                </p>
                <PremiumButton variant="secondary" className="w-full">
                  Discover
                </PremiumButton>
              </GlassPanel>
            </FadeIn>

            <FadeIn yOffset={30} delay={0.3}>
              <SpringCard glare borderGlow className="h-full">
                <h3 className="text-xl font-semibold mb-4">Spring Card</h3>
                <p className="text-muted-foreground mb-4">
                  React Spring powered card with 3D rotation and glare effects.
                </p>
                <PremiumButton variant="outline" className="w-full">
                  Learn More
                </PremiumButton>
              </SpringCard>
            </FadeIn>
          </div>

          {/* Button Showcase */}
          <PremiumSection animationType="stagger" staggerChildren className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-center">Premium Buttons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <PremiumButton variant="primary" size="lg" className="w-full">
                Primary Button
              </PremiumButton>
              <PremiumButton variant="secondary" size="lg" className="w-full">
                Secondary Button
              </PremiumButton>
              <PremiumButton variant="outline" size="lg" className="w-full">
                Outline Button
              </PremiumButton>
              <PremiumButton variant="ghost" size="lg" className="w-full">
                Ghost Button
              </PremiumButton>
            </div>
          </PremiumSection>

          {/* Text Animation Showcase */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Text Animations</h3>
            <div className="space-y-8">
              <div className="p-6 bg-card rounded-lg shadow-md">
                <h4 className="text-lg font-medium mb-4">Slide Animation</h4>
                <AnimatedText type="words" animation="slide" stagger={0.05} className="text-xl">
                  Words slide up with a staggered effect
                </AnimatedText>
              </div>
              
              <div className="p-6 bg-card rounded-lg shadow-md">
                <h4 className="text-lg font-medium mb-4">Scale Animation</h4>
                <AnimatedText type="chars" animation="scale" stagger={0.02} className="text-xl">
                  Characters scale in one by one
                </AnimatedText>
              </div>
              
              <div className="p-6 bg-card rounded-lg shadow-md">
                <h4 className="text-lg font-medium mb-4">Highlight Animation</h4>
                <AnimatedText type="words" animation="highlight" stagger={0.05} className="text-xl">
                  Words get highlighted with color
                </AnimatedText>
              </div>
            </div>
          </div>

          {/* Motion Effects */}
          <PremiumSection animationType="fade" className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Motion Effects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-card rounded-lg shadow-md overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-light/20 to-secondary-light/20"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 10,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
                <div className="relative z-10">
                  <h4 className="text-xl font-semibold mb-4">Gradient Animation</h4>
                  <p className="text-muted-foreground">
                    Smooth flowing gradient background that adds depth and movement.
                  </p>
                </div>
              </div>
              
              <div className="p-8 bg-card rounded-lg shadow-md overflow-hidden">
                <motion.div
                  className="flex items-center justify-center h-32"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-accent to-secondary" />
                </motion.div>
                <h4 className="text-xl font-semibold mb-2 mt-4">Pulse Animation</h4>
                <p className="text-muted-foreground">
                  Subtle pulsing effect that draws attention without being distracting.
                </p>
              </div>
            </div>
          </PremiumSection>
        </div>
      </PremiumSection>
    </div>
  );
}

export { PremiumShowcase };
export default PremiumShowcase;
