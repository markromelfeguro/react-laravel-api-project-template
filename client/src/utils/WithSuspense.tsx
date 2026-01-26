import React, { Suspense } from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const WithSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<LoadingSpinner height="h-screen" size="lg" text="Loading..." />}>
      <Component />
    </Suspense>
  );
};

export default WithSuspense;