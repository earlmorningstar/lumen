import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const PlayerPage = lazy(() => import('@/pages/PlayerPage'));
// ... other pages will be added

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="skeleton w-12 h-12 rounded-full" />
    </div>
  );
}

import type { FallbackProps } from 'react-error-boundary';


function ErrorFallback({ error }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-text-secondary mb-4"> {error instanceof Error ? error.message : 'An unknown error occurred'}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-surface-interactive rounded-lg">
        Reload
      </button>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/player/:id" element={<PlayerPage />} />
              {/* more routes later */}
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}