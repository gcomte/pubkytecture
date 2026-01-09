/**
 * Identity Birth Flow Types
 *
 * Defines data structures and interfaces for the Identity Birth simulation.
 */

/**
 * Accumulated data across Identity Birth steps
 */
export interface IdentityBirthData {
  // Step 1: Generate Keypair
  keypair?: {
    publicKey: string; // z-base-32 encoded public key
    secretKey: Uint8Array; // Raw secret key bytes
  };

  // Step 2: Create Recovery File
  recoveryFile?: Uint8Array; // Encrypted recovery file
  passphrase?: string; // User's passphrase (for demo purposes)

  // Step 3: Signup (DHT + Homeserver)
  session?: {
    publicKey: string; // z-base-32 encoded
    capabilities: string[]; // e.g., ["/pub/app/:rw"]
    homeserver: string; // z-base-32 encoded homeserver public key
  };

  // Step 4: Verify Session
  verified?: boolean;
}

/**
 * Pubky client interface for dependency injection and mocking
 */
export interface PubkyClientInterface {
  /**
   * Generate a new Ed25519 keypair
   */
  generateKeypair(): Promise<{
    publicKey: string;
    secretKey: Uint8Array;
  }>;

  /**
   * Create an encrypted recovery file from keypair
   */
  createRecoveryFile(
    secretKey: Uint8Array,
    passphrase: string
  ): Promise<Uint8Array>;

  /**
   * Sign up to a homeserver (publishes to DHT and registers)
   */
  signup(
    secretKey: Uint8Array,
    homeserver: string,
    signupToken?: string | null
  ): Promise<{
    publicKey: string;
    capabilities: string[];
    homeserver: string;
  }>;

  /**
   * Verify session is active and valid
   */
  verifySession(publicKey: string): Promise<boolean>;
}

/**
 * Configuration for Identity Birth flow
 */
export interface IdentityBirthConfig {
  homeserver: string; // z-base-32 encoded homeserver public key
  signupToken?: string | null; // Optional signup token
  client: PubkyClientInterface; // Injected Pubky client (for testing)
}
