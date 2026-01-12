/**
 * Post Journey Flow Types
 *
 * Types for the Post Journey simulation that publishes a post
 * to homeserver and watches it flow through the distributed system.
 */

/**
 * Post data structure
 */
export interface Post {
  content: string;
  imageUrl?: string;
  timestamp: number;
}

/**
 * Accumulated data throughout the Post Journey flow
 */
export interface PostJourneyData {
  // Step 1: Create post locally
  post?: Post;

  // Step 2: Publish to homeserver
  publishResult?: {
    uri: string;
    timestamp: number;
  };

  // Step 3: Nexus indexes the post
  indexResult?: {
    indexed: boolean;
    nexusTimestamp: number;
  };

  // Step 4: Apps discover the post
  discoveryResult?: {
    discoveredBy: string[];
    timestamp: number;
  };
}

/**
 * Mock Pubky client interface for Post Journey operations
 */
export interface PostJourneyClientInterface {
  /**
   * Publishes a post to the homeserver
   */
  publishPost: (post: Post, secretKey: Uint8Array) => Promise<{
    uri: string;
    timestamp: number;
  }>;

  /**
   * Simulates Nexus indexing the post
   */
  indexPost: (uri: string) => Promise<{
    indexed: boolean;
    nexusTimestamp: number;
  }>;

  /**
   * Simulates apps discovering the post
   */
  discoverPost: (uri: string) => Promise<{
    discoveredBy: string[];
    timestamp: number;
  }>;
}

/**
 * Configuration for Post Journey flow
 */
export interface PostJourneyConfig {
  post: Post;
  secretKey: Uint8Array;
  homeserver: string;
  client: PostJourneyClientInterface;
}
