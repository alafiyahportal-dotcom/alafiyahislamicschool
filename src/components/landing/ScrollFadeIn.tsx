'use client';

import React from 'react';
import ScrollReveal from './ScrollReveal';

export default function ScrollFadeIn({
  children,
  className = '',
  delay = 0,
  yOffset = 28,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}) {
  return (
    <ScrollReveal className={className} delay={delay} yOffset={yOffset}>
      {children}
    </ScrollReveal>
  );
}
