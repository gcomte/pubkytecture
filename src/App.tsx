/**
 * App Component
 *
 * Main application entry point for Pubkytecture.
 * Demonstrates the three-panel layout with placeholder content.
 */

import { useState, useEffect } from 'react';
import posthog from 'posthog-js';
import { MainLayout, DiagramPanel, ExplanationPanel, ControlBar } from './components/layout';
import { PubkyDiagram } from './components/diagram';
import { PostPreview } from './components/post';
import { PubkyLogin, type SessionInfo } from './components/auth';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const totalSteps = 4;

  // Track step changes
  useEffect(() => {
    posthog.capture('step_viewed', {
      step: currentStep,
      step_name: ['overview', 'login', 'auth_success', 'next_steps'][currentStep],
    });
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    posthog.capture('flow_reset', {
      from_step: currentStep,
    });
    setCurrentStep(0);
    setIsLoggedIn(false);
    setSessionInfo(null);
  };

  const handleLoginSuccess = (session: SessionInfo) => {
    console.log('✅ LOGIN SUCCESSFUL!');
    console.log('Public Key:', session.publicKey);
    console.log('Capabilities:', session.capabilities);
    console.log('Full session info:', session);
    posthog.capture('login_completed', {
      capabilities: session.capabilities,
    });
    setSessionInfo(session);
    setIsLoggedIn(true);
    // Auto-advance to next step after successful login
    handleNext();
  };

  const handleLoginError = (error: Error) => {
    console.error('❌ LOGIN FAILED:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    posthog.capture('login_failed', {
      error_name: error.name,
      error_message: error.message,
    });
  };

  // Determine which nodes to highlight based on current step
  const getHighlightedNodeIds = () => {
    switch (currentStep) {
      case 0:
        return []; // Overview - no specific nodes
      case 1:
        return ['pubky-app']; // Login step (Step 2 of 4) - highlight only pubky.app
      case 2:
        return ['pubky-app', 'pubky-ring']; // Auth success (Step 3 of 4) - highlight both
      default:
        return [];
    }
  };

  // Determine which edges to highlight based on current step
  const getHighlightedEdgeIds = () => {
    switch (currentStep) {
      case 0:
        return []; // Overview - no specific edges
      case 1:
        return []; // Login step (Step 2 of 4) - NO edge highlighting
      case 2:
        return ['e-ring-pubky']; // Auth success (Step 3 of 4) - highlight Auth connection
      default:
        return [];
    }
  };

  return (
    <MainLayout
      diagramPanel={
        <DiagramPanel>
          <PubkyDiagram
            highlightedNodeIds={getHighlightedNodeIds()}
            highlightedEdgeIds={getHighlightedEdgeIds()}
          />
        </DiagramPanel>
      }
      explanationPanel={
        currentStep === 0 ? (
          <ExplanationPanel
            stepTitle="Post to pubky.app"
            stepDescription={
              <>
                This website posts a picture to your{' '}
                <a
                  href="https://pubky.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  pubky.app
                </a>{' '}
                profile and visualizes the process. Watch how Pubky Core's components collaborate under the hood.
              </>
            }
            concept={{
              title: "Self-sovereign Publishing",
              description: (
                <>
                  The post is stored on your{' '}
                  <a
                    href="https://github.com/pubky/pubky-core/tree/main/pubky-homeserver"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300 underline hover:text-purple-200"
                  >
                    Homeserver
                  </a>{' '}
                  and made discoverable to pubky.app. You retain complete control over your data - running your own Homeserver means no one can restrict your access.
                </>
              ),
            }}
          >
            <PostPreview onPublish={handleNext} />
          </ExplanationPanel>
        ) : currentStep === 1 ? (
          <ExplanationPanel
            stepTitle="Log in to pubky.app"
            stepDescription="Scan the QR code with Pubky Ring to authenticate. Your identity will be used to publish the post to your homeserver."
            location={
              <>
                pubky.app Browser app, preferably with{' '}
                <a
                  href="https://github.com/pubky/pubky-ring"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 underline hover:text-blue-200"
                >
                  Pubky Ring
                </a>
              </>
            }
          >
            <PubkyLogin
              onLoginSuccess={handleLoginSuccess}
              onLoginError={handleLoginError}
            />
          </ExplanationPanel>
        ) : currentStep === 2 ? (
          <ExplanationPanel
            stepTitle="Authentication Successful"
            stepDescription="Here's what happened during the authentication process and what we received from Pubky Ring."
          >
            <div className="space-y-4">
              {/* Session information received */}
              {sessionInfo && (
                <div className="rounded-lg border border-green-800 bg-green-950/30 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-green-300">Session Information Received</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs font-medium text-zinc-400">Public Key</div>
                      <div className="font-mono text-sm text-zinc-200 break-all">{sessionInfo.publicKey}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-zinc-400">Capabilities</div>
                      <div className="font-mono text-sm text-zinc-200">{sessionInfo.capabilities}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Explanation of auth flow */}
              <div className="rounded-lg border border-blue-700 bg-blue-950/30 p-4">
                <h3 className="mb-2 text-sm font-semibold text-blue-300">Auth Flow</h3>
                <div className="space-y-3 text-sm text-zinc-300">
                  {/* Step 1: Pubky Ring signs */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500 flex items-center justify-center text-lg">
                      🔑
                    </div>
                    <div className="flex-1">
                      <p>
                        <strong className="text-purple-300">Pubky Ring signs the requested permissions</strong> with your private key, proving you own this identity (you hold the key pair)
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Signed authorization sent */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900/50 border border-blue-500 flex items-center justify-center text-lg">
                      📤
                    </div>
                    <div className="flex-1">
                      <p>
                        <strong>The signed authorization is sent back to pubky.app</strong> over a HTTP relay
                      </p>
                    </div>
                  </div>

                  {/* Step 3: pubky.app uses it */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-900/50 border border-green-500 flex items-center justify-center text-lg">
                      ✅
                    </div>
                    <div className="flex-1">
                      <p>
                        <strong>pubky.app uses it</strong> to read/write to <code className="bg-zinc-800 px-1 rounded text-sm">/pub/pubky.app</code> on your Homeserver (capability)
                      </p>
                    </div>
                  </div>

                  <p className="mt-3">
                    <a
                      href="https://github.com/pubky/pubky-core/blob/main/docs/AUTH.md#flow"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 underline hover:text-blue-300"
                    >
                      Detailed documentation
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </ExplanationPanel>
        ) : (
          <ExplanationPanel
            stepTitle="Next Steps"
            stepDescription="Continue with the post journey..."
          >
            <div className="text-zinc-400">More steps coming soon...</div>
          </ExplanationPanel>
        )
      }
      controlBar={
        <ControlBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          status="idle"
          disableNext={currentStep === 1 && !isLoggedIn}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onReset={handleReset}
          onRetry={() => console.log('Retry')}
        />
      }
    />
  );
}

export default App;
