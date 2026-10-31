import React from 'react';

export function Notification({ text, isError }) {
  if (!text) return null;

  const base = isError ? '60, 10, 14' : '10, 48, 28';      
  const edge = isError ? '255, 90, 90' : '80, 220, 140';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px 18px',
        backgroundColor: `rgba(${base}, 0.82)`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        color: isError ? '#ffb9b9' : '#bdf5d2',
        border: `1px solid rgba(${edge}, 0.25)`,
        borderRadius: '10px',
        boxShadow: `0 0 18px 6px rgba(${base}, 0.65)`,        
        fontSize: '13px',
        fontWeight: 'bold',
        zIndex: 1000
      }}
    >
      {text}
    </div>
  );
}