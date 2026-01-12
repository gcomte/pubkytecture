/**
 * Post Journey Flow Step Definitions
 *
 * Creates step definitions for the Post Journey simulation.
 * Each step executes operations to publish a post and track its flow
 * through the distributed system.
 */

import type { Step } from '../../types/simulation';
import type { PostJourneyConfig, PostJourneyData } from './types';

/**
 * Creates the Post Journey step definitions
 *
 * @param config - Configuration including post, secretKey, homeserver, and client
 * @returns Array of Step objects for use with useSimulation hook
 */
export function createPostJourneySteps(config: PostJourneyConfig): Step[] {
  const { post, secretKey, client } = config;

  return [
    // Step 1: Create Post
    {
      id: 'create-post',
      title: 'Create Post',
      execute: async (): Promise<Partial<PostJourneyData>> => {
        return { post };
      },
    },

    // Step 2: Publish to Homeserver
    {
      id: 'publish-to-homeserver',
      title: 'Publish to Homeserver',
      execute: async (
        data: Record<string, unknown>
      ): Promise<Partial<PostJourneyData>> => {
        const accumulatedData = data as PostJourneyData;

        if (!accumulatedData.post) {
          throw new Error('Post not found in accumulated data');
        }

        const publishResult = await client.publishPost(
          accumulatedData.post,
          secretKey
        );

        return { publishResult };
      },
    },

    // Step 3: Nexus Indexing
    {
      id: 'nexus-indexing',
      title: 'Nexus Indexing',
      execute: async (
        data: Record<string, unknown>
      ): Promise<Partial<PostJourneyData>> => {
        const accumulatedData = data as PostJourneyData;

        if (!accumulatedData.publishResult) {
          throw new Error('Publish result not found in accumulated data');
        }

        const indexResult = await client.indexPost(
          accumulatedData.publishResult.uri
        );

        return { indexResult };
      },
    },

    // Step 4: App Discovery
    {
      id: 'app-discovery',
      title: 'App Discovery',
      execute: async (
        data: Record<string, unknown>
      ): Promise<Partial<PostJourneyData>> => {
        const accumulatedData = data as PostJourneyData;

        if (!accumulatedData.publishResult) {
          throw new Error('Publish result not found in accumulated data');
        }

        const discoveryResult = await client.discoverPost(
          accumulatedData.publishResult.uri
        );

        return { discoveryResult };
      },
    },
  ];
}
