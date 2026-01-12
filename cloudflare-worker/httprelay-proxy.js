/**
 * Cloudflare Worker: HTTP Relay CORS Proxy
 *
 * Proxies requests to demo.httprelay.io and adds CORS headers
 * to allow browser-based Pubky authentication from GitHub Pages.
 */

export default {
  async fetch(request) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      // Extract the path after the worker URL
      const url = new URL(request.url);
      const targetPath = url.pathname + url.search;

      // Construct the target URL
      const targetUrl = `https://demo.httprelay.io${targetPath}`;

      console.log('Proxying request to:', targetUrl);

      // Forward the request to demo.httprelay.io
      const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      // Get response from demo.httprelay.io
      const response = await fetch(proxyRequest);

      // Create new response with CORS headers
      const corsResponse = new Response(response.body, response);

      // Add CORS headers
      corsResponse.headers.set('Access-Control-Allow-Origin', '*');
      corsResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      corsResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      return corsResponse;
    } catch (error) {
      console.error('Proxy error:', error);

      return new Response(JSON.stringify({
        error: 'Proxy error',
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
