'use client';

import React from 'react';
import { FadeIn, FadeInStaggered } from '@/components/animations/motion/FadeIn';
import { ScrollReveal, ScrollRevealStaggered } from '@/components/animations/gsap/ScrollReveal';
import { AnimatedContainer, StaggeredContainer } from '@/components/animations/spring/AnimatedContainer';
import Button from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnimationsDemo() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-12 text-center">Animation System Demo</h1>
      
      {/* Framer Motion Demo */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Framer Motion</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeIn>
            <Card>
              <CardHeader>
                <CardTitle>Fade In</CardTitle>
                <CardDescription>Basic fade in animation</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card fades in when it comes into view.</p>
              </CardContent>
            </Card>
          </FadeIn>
          
          <FadeInStaggered stagger={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>Staggered Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((item, i) => (
                  <div key={i} className="p-2 bg-muted rounded">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </FadeInStaggered>
        </div>
      </section>

      {/* GSAP Scroll Reveal Demo */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">GSAP Scroll Reveal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScrollReveal yOffset={50} duration={1}>
            <Card>
              <CardHeader>
                <CardTitle>Scroll Reveal</CardTitle>
                <CardDescription>Reveals on scroll</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card animates in as you scroll down the page.</p>
              </CardContent>
            </Card>
          </ScrollReveal>
          
          <ScrollRevealStaggered stagger={0.2} yOffset={30}>
            <Card>
              <CardHeader>
                <CardTitle>Staggered Scroll</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'].map((item, i) => (
                  <div key={i} className="p-2 bg-muted rounded">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </ScrollRevealStaggered>
        </div>
      </section>

      {/* React Spring Demo */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">React Spring</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedContainer
            from={{ opacity: 0, y: 50 }}
            to={{ opacity: 1, y: 0 }}
            config={{ tension: 170, friction: 26 }}
            delay={200}
          >
            <Card>
              <CardHeader>
                <CardTitle>Spring Animation</CardTitle>
                <CardDescription>Physics-based animation</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card uses spring physics for natural motion.</p>
              </CardContent>
            </Card>
          </AnimatedContainer>
          
          <StaggeredContainer
            from={{ opacity: 0, x: 50 }}
            to={{ opacity: 1, x: 0 }}
            config={{ tension: 170, friction: 26 }}
            delay={200}
            trail={100}
          >
            <Card>
              <CardHeader>
                <CardTitle>Staggered Spring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['Step 1', 'Step 2', 'Step 3', 'Step 4'].map((item, i) => (
                  <div key={i} className="p-2 bg-muted rounded">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </StaggeredContainer>
        </div>
      </section>

      {/* Combined Animation Demo */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Combined Animations</h2>
        <div className="grid grid-cols-1 gap-6">
          <FadeIn>
            <Card>
              <CardHeader>
                <CardTitle>Combined Animation Example</CardTitle>
                <CardDescription>Using all three animation libraries together</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <ScrollReveal yOffset={30}>
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h3 className="font-semibold mb-2">Scroll-Triggered Animation</h3>
                      <p>This section animates in as you scroll.</p>
                    </div>
                  </ScrollReveal>
                  
                  <AnimatedContainer
                    from={{ opacity: 0, scale: 0.9 }}
                    to={{ opacity: 1, scale: 1 }}
                    delay={300}
                  >
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <h3 className="font-semibold mb-2">Spring Animation</h3>
                      <p>This uses React Spring for physics-based motion.</p>
                    </div>
                  </AnimatedContainer>
                  
                  <FadeInStaggered stagger={0.2}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['Feature A', 'Feature B', 'Feature C'].map((feature, i) => (
                        <div key={i} className="p-4 bg-muted rounded-lg">
                          <h4 className="font-medium">{feature}</h4>
                          <p className="text-sm text-muted-foreground">Staggered animation</p>
                        </div>
                      ))}
                    </div>
                  </FadeInStaggered>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>
      
      {/* Animation Controls Demo */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Animation Controls</h2>
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Animation Controls</CardTitle>
              <CardDescription>Control animations with buttons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button>Play All</Button>
                <Button variant="outline">Pause All</Button>
                <Button variant="outline">Reset All</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
