import React from 'react';

export function Notification({ text, isError }) {
  if (!text) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px 18px',
        backgroundColor: isError ? '#f8d7da' : '#d4edda',
        color: isError ? '#721c24' : '#155724',
        border: `1px solid ${isError ? '#f5c6cb' : '#c3e6cb'}`,
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontSize: '13px',
        fontWeight: 'bold',
        zIndex: 1000
      }}
    >
      {text}
    </div>
  );
}