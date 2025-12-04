"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    if (process.env.NODE_ENV === "production") {
      // logger.error('Global error', { error: error.message, digest: error.digest })
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Critical Error Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Critical Error
            </h1>
            <p className="text-gray-600 mb-6">
              The application encountered a critical error and needs to be
              reloaded. We apologize for the inconvenience.
            </p>

            {/* Error Digest */}
            {error.digest && (
              <p className="text-xs text-gray-500 mb-6 font-mono bg-gray-100 px-3 py-2 rounded-lg inline-block">
                Reference: {error.digest}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                Try again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
