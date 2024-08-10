'use client';

import React from 'react';
import { useRouter } from 'next/router';
import Spline from '@splinetool/react-spline';

export default function LandingPage() {
  const router = useRouter();

  // Function to handle navigation
  const handleSplineClick = () => {
    router.push('/chatbot'); // Ensure navigation to the correct page
  };

  return (
    <div style={{ backgroundColor: 'black', height: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <main style={{ width: '100%', height: '100%', position: 'relative' }}>
        <Spline
          scene="https://prod.spline.design/RK2-M-rPuUouVkuj/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
          onClick={handleSplineClick} // Handle click event
        />
      </main>
    </div>
  );
}