import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nextlara-app">
      {children}
    </div>
  );
}
