import { useState, useCallback, useRef, useEffect } from 'react';
import type { Step, UseSimulationReturn, SimulationStatus } from '../types/simulation';

/**
 * Core state machine hook for step-through simulation
 *
 * Manages sequential step progression with:
 * - Forward navigation (next)
 * - Backward navigation (previous, view-only)
 * - Reset to initial state
 * - Retry after errors
 * - Accumulated data pattern (data persists across steps)
 */
export function useSimulation(steps: Step[]): UseSimulationReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<SimulationStatus>('idle');
  const [data, setData] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<Error | undefined>(undefined);

  // Use refs to capture latest values without triggering re-creation of callbacks
  const stepsRef = useRef(steps);
  const dataRef = useRef(data);
  const currentStepRef = useRef(currentStep);

  useEffect(() => {
    stepsRef.current = steps;
    dataRef.current = data;
    currentStepRef.current = currentStep;
  });

  /**
   * Advance to next step
   * - If current step has execute function, run it
   * - Accumulate returned data
   * - Handle errors
   */
  const next = useCallback(async () => {
    const stepIndex = currentStepRef.current;

    // Can't advance beyond last step
    if (stepIndex >= stepsRef.current.length) {
      return;
    }

    const step = stepsRef.current[stepIndex];

    // If step has no execute function, just advance
    if (!step.execute) {
      setCurrentStep(stepIndex + 1);
      return;
    }

    // Execute async step
    try {
      setStatus('loading');
      setError(undefined);

      const result = await step.execute(dataRef.current);

      // Accumulate data (merge with existing)
      setData((prevData) => ({ ...prevData, ...result }));
      setStatus('complete');
      setCurrentStep(stepIndex + 1);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err : new Error(String(err)));
      // Don't advance step on error
    }
  }, []);

  /**
   * Navigate to previous step (view-only)
   * - Does not roll back data
   * - Clears error state
   */
  const previous = useCallback(() => {
    const stepIndex = currentStepRef.current;
    if (stepIndex > 0) {
      setCurrentStep(stepIndex - 1);
      setStatus('idle');
      setError(undefined);
    }
  }, []);

  /**
   * Reset simulation to initial state
   * - Clear all data
   * - Reset to step 0
   * - Clear errors
   */
  const reset = useCallback(() => {
    setCurrentStep(0);
    setStatus('idle');
    setData({});
    setError(undefined);
  }, []);

  /**
   * Retry current step after error
   * - Only executes if status is 'error'
   * - Re-runs the execute function
   */
  const retry = useCallback(async () => {
    if (status !== 'error') {
      return;
    }

    const stepIndex = currentStepRef.current;
    const step = stepsRef.current[stepIndex];

    if (!step.execute) {
      return;
    }

    try {
      setStatus('loading');
      setError(undefined);

      const result = await step.execute(dataRef.current);

      setData((prev) => ({ ...prev, ...result }));
      setStatus('complete');
      setCurrentStep(stepIndex + 1);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [status]);

  return {
    currentStep,
    totalSteps: steps.length,
    status,
    data,
    error,
    next,
    previous,
    reset,
    retry,
  };
}
