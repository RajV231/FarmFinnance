import React, { useEffect, useRef } from 'react';

interface RollingNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

export const RollingNumber = ({ value, prefix = '', suffix = '' }: RollingNumberProps) => {
  // 1. We use a Ref to grab the actual HTML element
  const spanRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    
    if (start === end) {
        if (spanRef.current) spanRef.current.innerText = `${prefix}${end.toLocaleString('en-IN')}${suffix}`;
        return;
    }

    let animationFrameId: number;
    const duration = 1000; // 1 second duration
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 4); 
      const current = Math.floor(start + (end - start) * easeOut);
      
      // 2. DIRECT DOM MANIPULATION: This is lightning fast and skips React's render cycle!
      if (spanRef.current) {
         spanRef.current.innerText = `${prefix}${current.toLocaleString('en-IN')}${suffix}`;
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        if (spanRef.current) {
           spanRef.current.innerText = `${prefix}${end.toLocaleString('en-IN')}${suffix}`;
        }
        prevValue.current = end;
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
        cancelAnimationFrame(animationFrameId);
    };
  }, [value, prefix, suffix]);

  // 3. Render once, let the useEffect handle the text changing
  return <span ref={spanRef} className="tabular-nums">{prefix}{prevValue.current.toLocaleString('en-IN')}{suffix}</span>;
};