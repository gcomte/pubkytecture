/**
 * Identity Birth Flow Step Definitions
 *
 * Creates step definitions for the Identity Birth simulation.
 * Each step executes a Pubky operation and returns data to accumulate.
 */

import type { Step } from '../../types/simulation';
import type { IdentityBirthConfig, IdentityBirthData } from './types';

/**
 * Creates the Identity Birth step definitions
 *
 * @param config - Configuration including homeserver, signup token, and Pubky client
 * @returns Array of Step objects for use with useSimulation hook
 */
export function createIdentityBirthSteps(config: IdentityBirthConfig): Step[] {
  const { client, homeserver, signupToken } = config;

  return [
    // Step 1: Generate Keypair
    {
      id: 'generate-keypair',
      title: 'Generate Keypair',
      execute: async (): Promise<Partial<IdentityBirthData>> => {
        const keypair = await client.generateKeypair();
        return { keypair };
      },
    },

    // Step 2: Create Recovery File
    {
      id: 'create-recovery',
      title: 'Create Recovery File',
      execute: async (
        data: Record<string, unknown>
      ): Promise<Partial<IdentityBirthData>> => {
        const accumulatedData = data as IdentityBirthData;

        if (!accumulatedData.keypair) {
          throw new Error('Keypair not found in accumulated data');
        }

        // Generate a demo passphrase (in real app, user would provide this)
        const passphrase = 'demo-passphrase-' + Math.random().toString(36);

        const recoveryFile = await client.createRecoveryFile(
          accumulatedData.keypair.secretKey,
          passphrase
        );

        return {
          recoveryFile,
          passphrase,
        };
      },
    },

    // Step 3: Signup to Homeserver (DHT + Homeserver registration)
    {
      id: 'signup',
      title: 'Signup to Homeserver',
      execute: async (
        data: Record<string, unknown>
      ): Promise<Partial<IdentityBirthData>> => {
        const accumulatedData = data as IdentityBirthData;

        if (!accumulatedData.keypair) {
          throw new Error('Keypair not found in accumulated data');
        }

        const session = await client.signup(
          accumulatedData.keypair.secretKey,
          homeserver,
          signupToken ?? null
        );

        return { session };
      },
    },

    // Step 4: Verify Session
    {
      id: 'verify',
      title: 'Verify Session',
      execute: async (
        data: Record<string, unknown>
      ): Promise<Partial<IdentityBirthData>> => {
        const accumulatedData = data as IdentityBirthData;

        if (!accumulatedData.session) {
          throw new Error('Session not found in accumulated data');
        }

        const verified = await client.verifySession(
          accumulatedData.session.publicKey
        );

        return { verified };
      },
    },
  ];
}
