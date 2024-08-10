'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Spline from '@splinetool/react-spline/next';
import { Button, Typography, Container } from '@mui/material';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth'); 
  };

  return (
    <div style={{ backgroundColor: 'black', height: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <main style={{ width: '100%', height: '100%', position: 'relative' }}>
        <Spline
          scene="https://prod.spline.design/RK2-M-rPuUouVkuj/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
        <Container
          maxWidth="sm"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h2" style={{ color: 'white', marginBottom: '20px' }}>
            Welcome to Track AI
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGetStarted}
            style={{
              backgroundColor: '#0070f3',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '20px'
            }}
          >
            Get Started
          </Button>
        </Container>
      </main>
    </div>
  );
}