'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface SocialLink {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  hoverColor: string;
  animation: {
    initial: { [key: string]: any };
    animate: { [key: string]: any };
  };
}

interface SocialLinkCardProps {
  link: SocialLink;
  inView: boolean;
}

export const SocialLinkCard = ({ link, inView }: SocialLinkCardProps) => (
  <motion.a
    href={link.href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group relative overflow-hidden rounded-xl p-6 backdrop-blur-sm transition-all duration-300 ${link.hoverColor} border border-border/20`}
    initial={link.animation.initial}
    animate={inView ? link.animation.animate : {}}
    whileHover={{ 
      y: -5,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
    }}
    transition={{
      duration: 0.6,
      ease: "easeOut"
    }}
  >
    <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${link.color} opacity-70 transition-opacity duration-300 group-hover:opacity-100`} />
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
        {link.icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{link.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{link.description}</p>
      <span className="mt-4 inline-flex items-center text-sm font-medium text-primary-500 group-hover:underline">
        {link.label}
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  </motion.a>
);
