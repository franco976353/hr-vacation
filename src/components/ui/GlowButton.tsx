"use client";

import React, { useRef } from 'react';
import './GlowButton.css';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function GlowButton({ children, className = '', ...props }: GlowButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    // Obtenemos los límites del botón en pantalla
    const rect = buttonRef.current.getBoundingClientRect();

    // Calculamos el punto exacto [X, Y] interno al botón
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Inyectamos las coordenadas en el style inline del nodo
    buttonRef.current.style.setProperty('--mouse-x', `${x}px`);
    buttonRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <button
      className={`glow-button ${className}`}
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <span className="glow-button-content">{children}</span>
    </button>
  );
}
