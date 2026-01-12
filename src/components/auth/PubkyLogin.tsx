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

const DEFAULT_HTTP_RELAY = '/api/httprelay/link/';
const CAPABILITIES = '/pub/pubky.app/:rw';

export function PubkyLogin({ onLoginSuccess, onLoginError }: PubkyLoginProps) {
  const [authUrl, setAuthUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'generating' | 'waiting' | 'success' | 'error'>('generating');

  useEffect(() => {
    const generateAuthRequest = async () => {
      try {
        console.log('🔐 Starting Pubky authentication flow...');
        setStatus('generating');
        setIsLoading(true);

        // Initialize Pubky client
        console.log('Initializing Pubky client...');
        const pubky = new Pubky();

        // Start auth flow for sign-in
        console.log('Starting auth flow with capabilities:', CAPABILITIES);
        console.log('HTTP Relay:', DEFAULT_HTTP_RELAY);

        const authFlow = pubky.startAuthFlow(
          CAPABILITIES,
          AuthFlowKind.signin(),
          DEFAULT_HTTP_RELAY
        );

        console.log('Auth URL generated:', authFlow.authorizationUrl);
        setAuthUrl(authFlow.authorizationUrl);
        setStatus('waiting');
        setIsLoading(false);

        console.log('⏳ Waiting for user to scan and approve in Pubky Ring...');

        // Wait for user to scan and approve in Pubky Ring
        const session = await authFlow.awaitApproval();
        const publicKeyStr = session.info.publicKey.z32();

        console.log('✅ Authentication approved!');
        console.log('Session info:', session.info);

        setStatus('success');
        onLoginSuccess?.(publicKeyStr);
      } catch (error) {
        console.error('❌ Auth request failed:', error);
        console.error('Error type:', typeof error);
        console.error('Error details:', error);
        setStatus('error');
        setIsLoading(false);
        onLoginError?.(error as Error);
      }
    };

    generateAuthRequest();
  }, [onLoginSuccess, onLoginError]);

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
      <div className="rounded-lg border border-red-800 bg-red-950/30 p-4">
        <p className="text-sm text-red-300">
          Failed to generate login QR code. Please try again.
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
