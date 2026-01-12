import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPostJourneySteps } from './steps';
import type { PostJourneyClientInterface, PostJourneyConfig, Post } from './types';

describe('Post Journey Steps', () => {
  let mockClient: PostJourneyClientInterface;
  let config: PostJourneyConfig;
  let testPost: Post;

  beforeEach(() => {
    testPost = {
      content: 'Test post content',
      imageUrl: '/pubkytecture/post-image.png',
      timestamp: Date.now(),
    };

    // Mock Pubky client with all Post Journey operations
    mockClient = {
      publishPost: vi.fn(async () => ({
        uri: 'pubky://mock-public-key/pub/posts/mock-post-id',
        timestamp: Date.now(),
      })),
      indexPost: vi.fn(async () => ({
        indexed: true,
        nexusTimestamp: Date.now(),
      })),
      discoverPost: vi.fn(async () => ({
        discoveredBy: ['pubky.app', 'eventky.app'],
        timestamp: Date.now(),
      })),
    };

    config = {
      post: testPost,
      secretKey: new Uint8Array([1, 2, 3, 4]),
      homeserver: 'mock-homeserver-z32',
      client: mockClient,
    };
  });

  describe('Step Structure', () => {
    it('creates 4 steps with correct IDs and titles', () => {
      const steps = createPostJourneySteps(config);

      expect(steps).toHaveLength(4);
      expect(steps[0]).toMatchObject({
        id: 'create-post',
        title: 'Create Post',
      });
      expect(steps[1]).toMatchObject({
        id: 'publish-to-homeserver',
        title: 'Publish to Homeserver',
      });
      expect(steps[2]).toMatchObject({
        id: 'nexus-indexing',
        title: 'Nexus Indexing',
      });
      expect(steps[3]).toMatchObject({
        id: 'app-discovery',
        title: 'App Discovery',
      });
    });

    it('all steps have execute functions', () => {
      const steps = createPostJourneySteps(config);

      steps.forEach((step) => {
        expect(step.execute).toBeTypeOf('function');
      });
    });
  });

  describe('Step 1: Create Post', () => {
    it('returns the post data', async () => {
      const steps = createPostJourneySteps(config);
      const result = await steps[0].execute({});

      expect(result).toEqual({ post: testPost });
    });

    it('post includes content, imageUrl, and timestamp', async () => {
      const steps = createPostJourneySteps(config);
      const result = await steps[0].execute({});

      expect(result.post).toHaveProperty('content');
      expect(result.post).toHaveProperty('imageUrl');
      expect(result.post).toHaveProperty('timestamp');
    });
  });

  describe('Step 2: Publish to Homeserver', () => {
    it('calls client.publishPost with post and secretKey', async () => {
      const steps = createPostJourneySteps(config);
      const accumulatedData = { post: testPost };

      await steps[1].execute(accumulatedData);

      expect(mockClient.publishPost).toHaveBeenCalledWith(
        testPost,
        config.secretKey
      );
    });

    it('returns publish result with uri and timestamp', async () => {
      const steps = createPostJourneySteps(config);
      const accumulatedData = { post: testPost };

      const result = await steps[1].execute(accumulatedData);

      expect(result).toHaveProperty('publishResult');
      expect(result.publishResult).toHaveProperty('uri');
      expect(result.publishResult).toHaveProperty('timestamp');
      expect(result.publishResult?.uri).toContain('pubky://');
    });

    it('throws error if post not found in accumulated data', async () => {
      const steps = createPostJourneySteps(config);

      await expect(steps[1].execute({})).rejects.toThrow(
        'Post not found in accumulated data'
      );
    });
  });

  describe('Step 3: Nexus Indexing', () => {
    it('calls client.indexPost with uri from previous step', async () => {
      const steps = createPostJourneySteps(config);
      const accumulatedData = {
        post: testPost,
        publishResult: {
          uri: 'pubky://mock-public-key/pub/posts/mock-post-id',
          timestamp: Date.now(),
        },
      };

      await steps[2].execute(accumulatedData);

      expect(mockClient.indexPost).toHaveBeenCalledWith(
        'pubky://mock-public-key/pub/posts/mock-post-id'
      );
    });

    it('returns index result with indexed flag and timestamp', async () => {
      const steps = createPostJourneySteps(config);
      const accumulatedData = {
        post: testPost,
        publishResult: {
          uri: 'pubky://mock-public-key/pub/posts/mock-post-id',
          timestamp: Date.now(),
        },
      };

      const result = await steps[2].execute(accumulatedData);

      expect(result).toHaveProperty('indexResult');
      expect(result.indexResult).toHaveProperty('indexed');
      expect(result.indexResult).toHaveProperty('nexusTimestamp');
      expect(result.indexResult?.indexed).toBe(true);
    });

    it('throws error if publishResult not found', async () => {
      const steps = createPostJourneySteps(config);

      await expect(steps[2].execute({ post: testPost })).rejects.toThrow(
        'Publish result not found in accumulated data'
      );
    });
  });

  describe('Step 4: App Discovery', () => {
    it('calls client.discoverPost with uri', async () => {
      const steps = createPostJourneySteps(config);
      const accumulatedData = {
        post: testPost,
        publishResult: {
          uri: 'pubky://mock-public-key/pub/posts/mock-post-id',
          timestamp: Date.now(),
        },
        indexResult: {
          indexed: true,
          nexusTimestamp: Date.now(),
        },
      };

      await steps[3].execute(accumulatedData);

      expect(mockClient.discoverPost).toHaveBeenCalledWith(
        'pubky://mock-public-key/pub/posts/mock-post-id'
      );
    });

    it('returns discovery result with app list and timestamp', async () => {
      const steps = createPostJourneySteps(config);
      const accumulatedData = {
        post: testPost,
        publishResult: {
          uri: 'pubky://mock-public-key/pub/posts/mock-post-id',
          timestamp: Date.now(),
        },
        indexResult: {
          indexed: true,
          nexusTimestamp: Date.now(),
        },
      };

      const result = await steps[3].execute(accumulatedData);

      expect(result).toHaveProperty('discoveryResult');
      expect(result.discoveryResult).toHaveProperty('discoveredBy');
      expect(result.discoveryResult).toHaveProperty('timestamp');
      expect(result.discoveryResult?.discoveredBy).toContain('pubky.app');
      expect(result.discoveryResult?.discoveredBy).toContain('eventky.app');
    });

    it('throws error if publishResult not found', async () => {
      const steps = createPostJourneySteps(config);

      await expect(
        steps[3].execute({ post: testPost, indexResult: { indexed: true, nexusTimestamp: Date.now() } })
      ).rejects.toThrow('Publish result not found in accumulated data');
    });
  });

  describe('Data Accumulation', () => {
    it('accumulates data across all steps', async () => {
      const steps = createPostJourneySteps(config);
      let accumulatedData: Record<string, unknown> = {};

      // Step 1
      const result1 = await steps[0].execute(accumulatedData);
      accumulatedData = { ...accumulatedData, ...result1 };
      expect(accumulatedData).toHaveProperty('post');

      // Step 2
      const result2 = await steps[1].execute(accumulatedData);
      accumulatedData = { ...accumulatedData, ...result2 };
      expect(accumulatedData).toHaveProperty('post');
      expect(accumulatedData).toHaveProperty('publishResult');

      // Step 3
      const result3 = await steps[2].execute(accumulatedData);
      accumulatedData = { ...accumulatedData, ...result3 };
      expect(accumulatedData).toHaveProperty('post');
      expect(accumulatedData).toHaveProperty('publishResult');
      expect(accumulatedData).toHaveProperty('indexResult');

      // Step 4
      const result4 = await steps[3].execute(accumulatedData);
      accumulatedData = { ...accumulatedData, ...result4 };
      expect(accumulatedData).toHaveProperty('post');
      expect(accumulatedData).toHaveProperty('publishResult');
      expect(accumulatedData).toHaveProperty('indexResult');
      expect(accumulatedData).toHaveProperty('discoveryResult');
    });
  });

  describe('Error Handling', () => {
    it('handles publishPost errors', async () => {
      const errorClient = {
        ...mockClient,
        publishPost: vi.fn(async () => {
          throw new Error('Homeserver unreachable');
        }),
      };

      const steps = createPostJourneySteps({
        ...config,
        client: errorClient,
      });

      await expect(
        steps[1].execute({ post: testPost })
      ).rejects.toThrow('Homeserver unreachable');
    });

    it('handles indexPost errors', async () => {
      const errorClient = {
        ...mockClient,
        indexPost: vi.fn(async () => {
          throw new Error('Nexus indexing failed');
        }),
      };

      const steps = createPostJourneySteps({
        ...config,
        client: errorClient,
      });

      await expect(
        steps[2].execute({
          post: testPost,
          publishResult: { uri: 'test-uri', timestamp: Date.now() },
        })
      ).rejects.toThrow('Nexus indexing failed');
    });

    it('handles discoverPost errors', async () => {
      const errorClient = {
        ...mockClient,
        discoverPost: vi.fn(async () => {
          throw new Error('App discovery failed');
        }),
      };

      const steps = createPostJourneySteps({
        ...config,
        client: errorClient,
      });

      await expect(
        steps[3].execute({
          post: testPost,
          publishResult: { uri: 'test-uri', timestamp: Date.now() },
          indexResult: { indexed: true, nexusTimestamp: Date.now() },
        })
      ).rejects.toThrow('App discovery failed');
    });
  });
});
