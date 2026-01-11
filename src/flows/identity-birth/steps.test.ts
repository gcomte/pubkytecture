import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createIdentityBirthSteps } from './steps';
import type { PubkyClientInterface, IdentityBirthConfig } from './types';

describe('Identity Birth Steps', () => {
  let mockClient: PubkyClientInterface;
  let config: IdentityBirthConfig;

  beforeEach(() => {
    // Mock Pubky client with all operations
    mockClient = {
      generateKeypair: vi.fn(async () => ({
        publicKey: 'mock-public-key-z32',
        secretKey: new Uint8Array([1, 2, 3, 4]),
      })),
      createRecoveryFile: vi.fn(async () => new Uint8Array([5, 6, 7, 8])),
      signup: vi.fn(async () => ({
        publicKey: 'mock-public-key-z32',
        capabilities: ['/pub/:rw'],
        homeserver: 'mock-homeserver-z32',
      })),
      verifySession: vi.fn(async () => true),
    };

    config = {
      homeserver: 'mock-homeserver-z32',
      signupToken: null,
      client: mockClient,
    };
  });

  describe('Step Structure', () => {
    it('creates 4 steps with correct IDs and titles', () => {
      const steps = createIdentityBirthSteps(config);

      expect(steps).toHaveLength(4);
      expect(steps[0]).toMatchObject({
        id: 'generate-keypair',
        title: 'Generate Keypair',
      });
      expect(steps[1]).toMatchObject({
        id: 'create-recovery',
        title: 'Create Recovery File',
      });
      expect(steps[2]).toMatchObject({
        id: 'signup',
        title: 'Signup to Homeserver',
      });
      expect(steps[3]).toMatchObject({
        id: 'verify',
        title: 'Verify Session',
      });
    });

    it('all steps have execute functions', () => {
      const steps = createIdentityBirthSteps(config);

      steps.forEach((step) => {
        expect(step.execute).toBeDefined();
        expect(typeof step.execute).toBe('function');
      });
    });
  });

  describe('Step 1: Generate Keypair', () => {
    it('generates keypair and returns public key and secret key', async () => {
      const steps = createIdentityBirthSteps(config);
      const step = steps[0];

      const result = await step.execute!({});

      expect(mockClient.generateKeypair).toHaveBeenCalledOnce();
      expect(result).toEqual({
        keypair: {
          publicKey: 'mock-public-key-z32',
          secretKey: new Uint8Array([1, 2, 3, 4]),
        },
      });
    });

    it('throws error if keypair generation fails', async () => {
      const steps = createIdentityBirthSteps(config);
      const step = steps[0];

      vi.mocked(mockClient.generateKeypair).mockRejectedValueOnce(
        new Error('Keypair generation failed')
      );

      await expect(step.execute!({})).rejects.toThrow(
        'Keypair generation failed'
      );
    });
  });

  describe('Step 2: Create Recovery File', () => {
    it('creates recovery file from keypair in accumulated data', async () => {
      const steps = createIdentityBirthSteps(config);
      const step = steps[1];

      const accumulatedData = {
        keypair: {
          publicKey: 'mock-public-key-z32',
          secretKey: new Uint8Array([1, 2, 3, 4]),
        },
      };

      const result = await step.execute!(accumulatedData);

      expect(mockClient.createRecoveryFile).toHaveBeenCalledWith(
        new Uint8Array([1, 2, 3, 4]),
        expect.any(String) // passphrase
      );
      expect(result).toHaveProperty('recoveryFile');
      expect(result).toHaveProperty('passphrase');
      expect(result.recoveryFile).toEqual(new Uint8Array([5, 6, 7, 8]));
    });

    it('throws error if keypair is missing from accumulated data', async () => {
      const steps = createIdentityBirthSteps(config);
      const step = steps[1];

      await expect(step.execute!({})).rejects.toThrow(
        'Keypair not found in accumulated data'
      );
    });

    it('throws error if recovery file creation fails', async () => {
      const steps = createIdentityBirthSteps(config);
      const step = steps[1];

      const accumulatedData = {
        keypair: {
          publicKey: 'mock-public-key-z32',
          secretKey: new Uint8Array([1, 2, 3, 4]),
        },
      };

      vi.mocked(mockClient.createRecoveryFile).mockRejectedValueOnce(
        new Error('Recovery file creation failed')
      );

      await expect(step.execute!(accumulatedData)).rejects.toThrow(
        'Recovery file creation failed'
      );
    });
  });

  describe('Step 3: Signup to Homeserver', () => {
    it('signs up using keypair from accumulated data', async () => {
      const steps = createIdentityBirthSteps(config);
      const step = steps[2];

      const accumulatedData = {
        keypair: {
          publicKey: 'mock-public-key-z32',
          secretKey: new Uint8Array([1, 2, 3, 4]),
        },
        recoveryFile: new Uint8Array([5, 6, 7, 8]),
      };

      const result = await step.execute!(accumulatedData);

      expect(mockClient.signup).toHaveBeenCalledWith(
        new Uint8Array([1, 2, 3, 4]),
        'mock-homeserver-z32',
        null
      );
      expect(result).toEqual({
        session: {
          publicKey: 'mock-public-key-z32',
          capabilities: ['/pub/:rw'],
          homeserver: 'mock-homeserver-z32',
        },
      });
    });

    it('throws error if keypair is missing from accumulated data', async () => {
      const steps = createIdentityBirthSteps(config);
      const step = steps[2];

      await expect(step.execute!({})).rejects.toThrow(
        'Keypair not found in accumulated data'
      );
    });

    it('throws error if signup fails with AuthenticationError', async () => {
      const steps = createIdentityBirthSteps(config);
      const step = steps[2];

      const accumulatedData = {
        keypair: {
          publicKey: 'mock-public-key-z32',
          secretKey: new Uint8Array([1, 2, 3, 4]),
        },
      };

      const authError = new Error('Invalid signup token');
      Object.defineProperty(authError, 'name', { value: 'AuthenticationError' });

      vi.mocked(mockClient.signup).mockRejectedValueOnce(authError);

      await expect(step.execute!(accumulatedData)).rejects.toThrow(
        'Invalid signup token'
      );
    });

    it('throws error if signup fails with PkarrError', async () => {
      const steps = createIdentityBirthSteps(config);
      const step = steps[2];

      const accumulatedData = {
        keypair: {
          publicKey: 'mock-public-key-z32',
          secretKey: new Uint8Array([1, 2, 3, 4]),
        },
      };

      const pkarrError = new Error('DHT publish failed');
      Object.defineProperty(pkarrError, 'name', { value: 'PkarrError' });

      vi.mocked(mockClient.signup).mockRejectedValueOnce(pkarrError);

      await expect(step.execute!(accumulatedData)).rejects.toThrow(
        'DHT publish failed'
      );
    });

    it('uses signup token from config if provided', async () => {
      const configWithToken = {
        ...config,
        signupToken: 'test-token-123',
      };
      const steps = createIdentityBirthSteps(configWithToken);
      const step = steps[2];

      const accumulatedData = {
        keypair: {
          publicKey: 'mock-public-key-z32',
          secretKey: new Uint8Array([1, 2, 3, 4]),
        },
      };

      await step.execute!(accumulatedData);

      expect(mockClient.signup).toHaveBeenCalledWith(
        new Uint8Array([1, 2, 3, 4]),
        'mock-homeserver-z32',
        'test-token-123'
      );
    });
  });

  describe('Step 4: Verify Session', () => {
    it('verifies session using public key from accumulated data', async () => {
      const steps = createIdentityBirthSteps(config);
      const step = steps[3];

      const accumulatedData = {
        keypair: {
          publicKey: 'mock-public-key-z32',
          secretKey: new Uint8Array([1, 2, 3, 4]),
        },
        session: {
          publicKey: 'mock-public-key-z32',
          capabilities: ['/pub/:rw'],
          homeserver: 'mock-homeserver-z32',
        },
      };

      const result = await step.execute!(accumulatedData);

      expect(mockClient.verifySession).toHaveBeenCalledWith(
        'mock-public-key-z32'
      );
      expect(result).toEqual({
        verified: true,
      });
    });

    it('throws error if session is missing from accumulated data', async () => {
      const steps = createIdentityBirthSteps(config);
      const step = steps[3];

      await expect(step.execute!({})).rejects.toThrow(
        'Session not found in accumulated data'
      );
    });

    it('throws error if verification fails', async () => {
      const steps = createIdentityBirthSteps(config);
      const step = steps[3];

      const accumulatedData = {
        session: {
          publicKey: 'mock-public-key-z32',
          capabilities: ['/pub/:rw'],
          homeserver: 'mock-homeserver-z32',
        },
      };

      vi.mocked(mockClient.verifySession).mockRejectedValueOnce(
        new Error('Session verification failed')
      );

      await expect(step.execute!(accumulatedData)).rejects.toThrow(
        'Session verification failed'
      );
    });

    it('returns verified: false if verification returns false', async () => {
      const steps = createIdentityBirthSteps(config);
      const step = steps[3];

      const accumulatedData = {
        session: {
          publicKey: 'mock-public-key-z32',
          capabilities: ['/pub/:rw'],
          homeserver: 'mock-homeserver-z32',
        },
      };

      vi.mocked(mockClient.verifySession).mockResolvedValueOnce(false);

      const result = await step.execute!(accumulatedData);

      expect(result).toEqual({
        verified: false,
      });
    });
  });

  describe('Data Accumulation Pattern', () => {
    it('steps can access data from all previous steps', async () => {
      const steps = createIdentityBirthSteps(config);

      // Step 1: Generate Keypair
      const data1 = await steps[0].execute!({});

      // Step 2: Create Recovery File (needs keypair from Step 1)
      const data2 = await steps[1].execute!({ ...data1 });
      expect(mockClient.createRecoveryFile).toHaveBeenCalledWith(
        data1.keypair!.secretKey,
        expect.any(String)
      );

      // Step 3: Signup (needs keypair from Step 1)
      const data3 = await steps[2].execute!({ ...data1, ...data2 });
      expect(mockClient.signup).toHaveBeenCalledWith(
        data1.keypair!.secretKey,
        'mock-homeserver-z32',
        null
      );

      // Step 4: Verify (needs session from Step 3)
      const data4 = await steps[3].execute!({ ...data1, ...data2, ...data3 });
      expect(mockClient.verifySession).toHaveBeenCalledWith(
        data3.session!.publicKey
      );

      // Final accumulated data should have all properties
      const finalData = { ...data1, ...data2, ...data3, ...data4 };
      expect(finalData).toHaveProperty('keypair');
      expect(finalData).toHaveProperty('recoveryFile');
      expect(finalData).toHaveProperty('session');
      expect(finalData).toHaveProperty('verified');
    });
  });

  describe('Error Handling', () => {
    it('preserves accumulated data when step fails', async () => {
      const steps = createIdentityBirthSteps(config);

      // Step 1 succeeds
      const data1 = await steps[0].execute!({});

      // Step 2 fails
      vi.mocked(mockClient.createRecoveryFile).mockRejectedValueOnce(
        new Error('Network error')
      );

      try {
        await steps[1].execute!(data1);
      } catch {
        // Accumulated data from Step 1 should still be available
        expect(data1).toHaveProperty('keypair');
      }
    });
  });
});
