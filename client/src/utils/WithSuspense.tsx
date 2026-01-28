import React, { Suspense } from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import Logo from '../assets/Logo MRF.png';

const WithSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<LoadingSpinner variant='dots' logo={Logo} height="h-screen" size="lg" />}>
      <Component />
    </Suspense>
  );
};

export default WithSuspense;