import React, { Suspense } from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const WithSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<LoadingSpinner variant='dots' height="h-screen" size="lg" />}>
      <Component />
    </Suspense>
  );
};

export default WithSuspense;