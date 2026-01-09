import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSimulation } from './useSimulation';
import type { Step } from '../types/simulation';

describe('useSimulation', () => {
  const mockSteps: Step[] = [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
    { id: 'step3', title: 'Step 3' },
  ];

  describe('initialization', () => {
    it('starts at step 0 with idle status', () => {
      const { result } = renderHook(() => useSimulation(mockSteps));

      expect(result.current.currentStep).toBe(0);
      expect(result.current.status).toBe('idle');
      expect(result.current.totalSteps).toBe(3);
    });

    it('initializes with empty data', () => {
      const { result } = renderHook(() => useSimulation(mockSteps));

      expect(result.current.data).toEqual({});
    });

    it('initializes without error', () => {
      const { result } = renderHook(() => useSimulation(mockSteps));

      expect(result.current.error).toBeUndefined();
    });
  });

  describe('next()', () => {
    it('advances to next step when current step has no execute function', async () => {
      const { result } = renderHook(() => useSimulation(mockSteps));

      await act(async () => {
        await result.current.next();
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.status).toBe('idle');
    });

    it('sets loading status while executing async step', async () => {
      const asyncStep: Step = {
        id: 'async',
        title: 'Async Step',
        execute: vi.fn(() => new Promise((resolve) => setTimeout(() => resolve({ result: 'data' }), 50))),
      };
      const steps = [asyncStep];

      const { result } = renderHook(() => useSimulation(steps));

      const nextPromise = act(async () => {
        await result.current.next();
      });

      // Check loading status during execution
      await waitFor(() => {
        expect(result.current.status).toBe('loading');
      });

      await nextPromise;
    });

    it('accumulates data from step execution', async () => {
      const stepWithData: Step = {
        id: 'step1',
        title: 'Step 1',
        execute: vi.fn(() => Promise.resolve({ keypair: 'mock-keypair' })),
      };
      const steps = [stepWithData, mockSteps[1]];

      const { result } = renderHook(() => useSimulation(steps));

      await act(async () => {
        await result.current.next();
      });

      expect(result.current.data).toEqual({ keypair: 'mock-keypair' });
      expect(result.current.currentStep).toBe(1);
      expect(result.current.status).toBe('complete');
    });

    it('preserves previous data when adding new data', async () => {
      const step1: Step = {
        id: 'step1',
        title: 'Step 1',
        execute: vi.fn(() => Promise.resolve({ keypair: 'mock-keypair' })),
      };
      const step2: Step = {
        id: 'step2',
        title: 'Step 2',
        execute: vi.fn(() => Promise.resolve({ recoveryFile: 'mock-file' })),
      };
      const steps = [step1, step2, mockSteps[2]];

      const { result } = renderHook(() => useSimulation(steps));

      await act(async () => {
        await result.current.next();
      });

      await act(async () => {
        await result.current.next();
      });

      expect(result.current.data).toEqual({
        keypair: 'mock-keypair',
        recoveryFile: 'mock-file',
      });
      expect(result.current.currentStep).toBe(2);
    });

    it('sets error status when step execution fails', async () => {
      const failingStep: Step = {
        id: 'failing',
        title: 'Failing Step',
        execute: vi.fn(() => Promise.reject(new Error('Network error'))),
      };
      const steps = [failingStep];

      const { result } = renderHook(() => useSimulation(steps));

      await act(async () => {
        await result.current.next();
      });

      expect(result.current.status).toBe('error');
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Network error');
      expect(result.current.currentStep).toBe(0); // Should stay at current step on error
    });

    it('does not advance beyond last step', async () => {
      const steps = [mockSteps[0]];
      const { result } = renderHook(() => useSimulation(steps));

      await act(async () => {
        await result.current.next();
      });

      await act(async () => {
        await result.current.next();
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.status).toBe('idle');
    });

    it('passes accumulated data to step execute function', async () => {
      const executeMock = vi.fn((data) => Promise.resolve({ ...data, newData: 'value' }));
      const step1: Step = {
        id: 'step1',
        title: 'Step 1',
        execute: vi.fn(() => Promise.resolve({ initial: 'data' })),
      };
      const step2: Step = {
        id: 'step2',
        title: 'Step 2',
        execute: executeMock,
      };
      const steps = [step1, step2];

      const { result } = renderHook(() => useSimulation(steps));

      await act(async () => {
        await result.current.next();
      });

      await act(async () => {
        await result.current.next();
      });

      expect(executeMock).toHaveBeenCalledWith({ initial: 'data' });
      expect(result.current.data).toEqual({ initial: 'data', newData: 'value' });
    });
  });

  describe('previous()', () => {
    it('navigates to previous step without changing data', async () => {
      const stepWithData: Step = {
        id: 'step1',
        title: 'Step 1',
        execute: vi.fn(() => Promise.resolve({ keypair: 'mock-keypair' })),
      };
      const steps = [stepWithData, mockSteps[1], mockSteps[2]];

      const { result } = renderHook(() => useSimulation(steps));

      // Advance to step 1
      await act(async () => {
        await result.current.next();
      });

      // Go back to step 0
      act(() => {
        result.current.previous();
      });

      expect(result.current.currentStep).toBe(0);
      expect(result.current.data).toEqual({ keypair: 'mock-keypair' }); // Data preserved
    });

    it('does not go before step 0', () => {
      const { result } = renderHook(() => useSimulation(mockSteps));

      act(() => {
        result.current.previous();
      });

      expect(result.current.currentStep).toBe(0);
    });

    it('clears error status when navigating backward', async () => {
      const failingStep: Step = {
        id: 'failing',
        title: 'Failing Step',
        execute: vi.fn(() => Promise.reject(new Error('Network error'))),
      };
      const steps = [mockSteps[0], failingStep];

      const { result } = renderHook(() => useSimulation(steps));

      // Advance to step 1
      await act(async () => {
        await result.current.next();
      });

      // Trigger error
      await act(async () => {
        await result.current.next();
      });

      expect(result.current.status).toBe('error');

      // Go back
      act(() => {
        result.current.previous();
      });

      expect(result.current.status).toBe('idle');
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('reset()', () => {
    it('resets to step 0 with idle status', async () => {
      const stepWithData: Step = {
        id: 'step1',
        title: 'Step 1',
        execute: vi.fn(() => Promise.resolve({ keypair: 'mock-keypair' })),
      };
      const steps = [stepWithData, mockSteps[1]];

      const { result } = renderHook(() => useSimulation(steps));

      await act(async () => {
        await result.current.next();
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.currentStep).toBe(0);
      expect(result.current.status).toBe('idle');
    });

    it('clears all accumulated data', async () => {
      const stepWithData: Step = {
        id: 'step1',
        title: 'Step 1',
        execute: vi.fn(() => Promise.resolve({ keypair: 'mock-keypair' })),
      };
      const steps = [stepWithData, mockSteps[1]];

      const { result } = renderHook(() => useSimulation(steps));

      await act(async () => {
        await result.current.next();
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toEqual({});
    });

    it('clears error state', async () => {
      const failingStep: Step = {
        id: 'failing',
        title: 'Failing Step',
        execute: vi.fn(() => Promise.reject(new Error('Network error'))),
      };
      const steps = [failingStep];

      const { result } = renderHook(() => useSimulation(steps));

      await act(async () => {
        await result.current.next();
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBeUndefined();
      expect(result.current.status).toBe('idle');
    });
  });

  describe('retry()', () => {
    it('re-executes the current step after error', async () => {
      let attempts = 0;
      const flakyStep: Step = {
        id: 'flaky',
        title: 'Flaky Step',
        execute: vi.fn(() => {
          attempts++;
          if (attempts === 1) {
            return Promise.reject(new Error('First attempt failed'));
          }
          return Promise.resolve({ success: true });
        }),
      };
      const steps = [flakyStep];

      const { result } = renderHook(() => useSimulation(steps));

      // First attempt - should fail
      await act(async () => {
        await result.current.next();
      });

      expect(result.current.status).toBe('error');
      expect(result.current.currentStep).toBe(0);

      // Retry - should succeed
      await act(async () => {
        await result.current.retry();
      });

      expect(result.current.status).toBe('complete');
      expect(result.current.currentStep).toBe(1);
      expect(result.current.data).toEqual({ success: true });
    });

    it('does not execute when status is not error', async () => {
      const executeMock = vi.fn(() => Promise.resolve({ data: 'value' }));
      const step: Step = {
        id: 'step',
        title: 'Step',
        execute: executeMock,
      };
      const steps = [step];

      const { result } = renderHook(() => useSimulation(steps));

      await act(async () => {
        await result.current.retry();
      });

      expect(executeMock).not.toHaveBeenCalled();
      expect(result.current.status).toBe('idle');
    });

    it('preserves data from previous successful steps', async () => {
      const step1: Step = {
        id: 'step1',
        title: 'Step 1',
        execute: vi.fn(() => Promise.resolve({ first: 'data' })),
      };

      let attempts = 0;
      const step2: Step = {
        id: 'step2',
        title: 'Step 2',
        execute: vi.fn(() => {
          attempts++;
          if (attempts === 1) {
            return Promise.reject(new Error('Failed'));
          }
          return Promise.resolve({ second: 'data' });
        }),
      };

      const steps = [step1, step2];

      const { result } = renderHook(() => useSimulation(steps));

      // Complete step 1
      await act(async () => {
        await result.current.next();
      });

      // Fail step 2
      await act(async () => {
        await result.current.next();
      });

      expect(result.current.data).toEqual({ first: 'data' });

      // Retry step 2
      await act(async () => {
        await result.current.retry();
      });

      expect(result.current.data).toEqual({ first: 'data', second: 'data' });
    });
  });

  describe('edge cases', () => {
    it('handles empty steps array', () => {
      const { result } = renderHook(() => useSimulation([]));

      expect(result.current.currentStep).toBe(0);
      expect(result.current.totalSteps).toBe(0);
      expect(result.current.status).toBe('idle');
    });

    it('handles single step', async () => {
      const { result } = renderHook(() => useSimulation([mockSteps[0]]));

      await act(async () => {
        await result.current.next();
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.totalSteps).toBe(1);
    });

    it('handles step that returns empty object', async () => {
      const emptyStep: Step = {
        id: 'empty',
        title: 'Empty Step',
        execute: vi.fn(() => Promise.resolve({})),
      };
      const steps = [emptyStep];

      const { result } = renderHook(() => useSimulation(steps));

      await act(async () => {
        await result.current.next();
      });

      expect(result.current.data).toEqual({});
      expect(result.current.status).toBe('complete');
    });
  });
});
