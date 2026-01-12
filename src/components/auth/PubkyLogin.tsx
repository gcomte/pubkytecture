/**
 * PubkyLogin Component
 *
 * Displays a QR code for logging in with Pubky Ring.
 * Uses the pubky library to generate an auth request and waits for approval.
 */

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Pubky, AuthFlowKind } from '@synonymdev/pubky';

interface PubkyLoginProps {
  onLoginSuccess?: (publicKey: string) => void;
  onLoginError?: (error: Error) => void;
}

// Use Vite proxy in development, Cloudflare Worker proxy in production
const DEFAULT_HTTP_RELAY = import.meta.env.DEV
  ? '/api/httprelay/link/'
  : 'https://pubkytecture-httprelay-proxy.gcomte.workers.dev/link/';
const CAPABILITIES = '/pub/pubky.app/:rw';

export function PubkyLogin({ onLoginSuccess, onLoginError }: PubkyLoginProps) {
  const [authUrl, setAuthUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'generating' | 'waiting' | 'success' | 'error'>('generating');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const generateAuthRequest = async () => {
      try {
        console.log('🔐 [STEP 1/5] Starting Pubky authentication flow...');
        console.log('Environment:', {
          isDev: import.meta.env.DEV,
          mode: import.meta.env.MODE,
          baseUrl: import.meta.env.BASE_URL,
        });
        setStatus('generating');
        setIsLoading(true);

        // Initialize Pubky client
        console.log('🔐 [STEP 2/5] Initializing Pubky client...');
        const pubky = new Pubky();
        console.log('✓ Pubky client initialized successfully');

        // Start auth flow for sign-in
        console.log('🔐 [STEP 3/5] Starting auth flow...');
        console.log('Capabilities:', CAPABILITIES);
        console.log('HTTP Relay:', DEFAULT_HTTP_RELAY);
        console.log('Auth Flow Kind:', 'signin');

        const authFlow = pubky.startAuthFlow(
          CAPABILITIES,
          AuthFlowKind.signin(),
          DEFAULT_HTTP_RELAY
        );
        console.log('✓ Auth flow started successfully');

        console.log('🔐 [STEP 4/5] Generating auth URL...');
        console.log('Auth URL generated:', authFlow.authorizationUrl);
        setAuthUrl(authFlow.authorizationUrl);
        setStatus('waiting');
        setIsLoading(false);

        console.log('🔐 [STEP 5/5] Waiting for user to scan and approve in Pubky Ring...');

        // Wait for user to scan and approve in Pubky Ring
        const session = await authFlow.awaitApproval();
        const publicKeyStr = session.info.publicKey.z32();

        console.log('✅ Authentication approved!');
        console.log('Public Key:', publicKeyStr);
        console.log('Session info:', session.info);

        setStatus('success');
        onLoginSuccess?.(publicKeyStr);
      } catch (error) {
        console.error('❌ [ERROR] Auth request failed at step:', status);
        console.error('Error object:', error);
        console.error('Error type:', typeof error);
        console.error('Error name:', error instanceof Error ? error.name : 'unknown');
        console.error('Error message:', error instanceof Error ? error.message : String(error));
        console.error('Error stack:', error instanceof Error ? error.stack : 'no stack');

        const errorMsg = error instanceof Error ? error.message : String(error);
        setErrorMessage(errorMsg);
        setStatus('error');
        setIsLoading(false);
        onLoginError?.(error as Error);
      }
    };

    generateAuthRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-zinc-400">Generating QR code...</div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="space-y-3 rounded-lg border border-red-800 bg-red-950/30 p-4">
        <p className="text-sm font-semibold text-red-300">
          Failed to generate login QR code
        </p>
        {errorMessage && (
          <div className="rounded bg-red-950/50 p-3">
            <p className="font-mono text-xs text-red-200">
              Error: {errorMessage}
            </p>
          </div>
        )}
        <p className="text-xs text-red-400">
          Check the browser console for detailed error information.
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-green-800 bg-green-950/30 p-4">
        <p className="text-sm text-green-300">
          Successfully authenticated! Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
        <p className="text-sm leading-relaxed text-zinc-300">
          Scan this QR code with Pubky Ring to log in. If you don't have Pubky Ring yet,
          download it from the{' '}
          <a
            href="https://github.com/pubky/pubky-ring"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            GitHub repository
          </a>
          .
        </p>
      </div>

      {/* QR Code with Ring Logo Overlay */}
      <div className="flex justify-center">
        <div className="relative inline-block">
          <QRCodeSVG
            value={authUrl}
            size={280}
            bgColor="#ffffff"
            fgColor="#000000"
            className="rounded-lg bg-white p-2"
            level="Q"
          />

          {/* Ring Logo Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-black">
              <div className="text-2xl">💍</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        <p className="text-sm text-zinc-400">Waiting for approval in Pubky Ring...</p>
      </div>
    </div>
  );
}
