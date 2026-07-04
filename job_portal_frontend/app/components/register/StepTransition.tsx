'use client';

import { useEffect, useState } from 'react';

export default function StepTransition({
  step,
  direction,
  children,
}: {
  step: number;
  direction: 1 | -1;
  children: React.ReactNode;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [step]);

  return (
    <div
      key={step}
      className="transition-all duration-300 ease-out"
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateX(0)' : `translateX(${direction * 20}px)`,
      }}
    >
      {children}
    </div>
  );
}