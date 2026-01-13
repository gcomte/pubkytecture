/**
 * ControlBar Component
 *
 * Bottom control bar with step navigation:
 * - Progress indicator
 * - Previous/Next/Reset buttons
 * - Retry button (shown on error)
 * - Step counter
 */

import type { SimulationStatus } from '../../types/simulation';

interface ControlBarProps {
  currentStep: number;
  totalSteps: number;
  status: SimulationStatus;
  error?: Error;
  disableNext?: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  onRetry: () => void;
}

export function ControlBar({
  currentStep,
  totalSteps,
  status,
  error,
  disableNext = false,
  onNext,
  onPrevious,
  onReset,
  onRetry,
}: ControlBarProps) {
  const canGoNext = currentStep < totalSteps && status !== 'loading' && !disableNext;
  const canGoPrevious = currentStep > 0 && status !== 'loading';
  const isComplete = currentStep >= totalSteps;

  return (
    <div className="flex items-center justify-between">
      {/* Left: Progress indicator */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-zinc-400">
          Step {Math.min(currentStep + 1, totalSteps)} of {totalSteps}
        </div>

        {/* Progress bar */}
        <div className="h-2 w-64 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${(Math.min(currentStep, totalSteps) / totalSteps) * 100}%`,
            }}
          />
        </div>

        {/* Status indicator */}
        {status === 'loading' && (
          <div className="text-sm text-blue-400">Processing...</div>
        )}
        {status === 'error' && error && (
          <div className="text-sm text-red-400">Error: {error.message}</div>
        )}
        {status === 'complete' && !isComplete && (
          <div className="text-sm text-green-400">Step complete</div>
        )}
      </div>

      {/* Right: Control buttons */}
      <div className="flex items-center gap-3">
        {/* Reset button */}
        <button
          onClick={onReset}
          disabled={status === 'loading'}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>

        {/* Retry button (shown on error) */}
        {status === 'error' && (
          <button
            onClick={onRetry}
            className="rounded-lg border border-red-700 bg-red-900 px-4 py-2 text-sm font-medium text-red-200 transition-colors hover:bg-red-800 hover:text-red-100"
          >
            Retry
          </button>
        )}

        {/* Previous button */}
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {/* Next button */}
        <button
          onClick={onNext}
          disabled={!canGoNext || isComplete}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isComplete ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
}
