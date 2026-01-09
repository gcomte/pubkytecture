/**
 * Core types for the simulation state machine
 */

export type SimulationStatus = 'idle' | 'loading' | 'complete' | 'error';

export interface SimulationState {
  currentStep: number;
  totalSteps: number;
  status: SimulationStatus;
  data: Record<string, unknown>;
  error?: Error;
}

export interface Step {
  id: string;
  title: string;
  execute?: (data: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

export interface SimulationActions {
  next: () => Promise<void>;
  previous: () => void;
  reset: () => void;
  retry: () => Promise<void>;
}

export type UseSimulationReturn = SimulationState & SimulationActions;
