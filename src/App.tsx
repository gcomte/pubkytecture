/**
 * App Component
 *
 * Main application entry point for Pubkytecture.
 * Demonstrates the three-panel layout with placeholder content.
 */

import { useState } from 'react';
import { MainLayout, DiagramPanel, ExplanationPanel, ControlBar } from './components/layout';
import { PubkyDiagram } from './components/diagram';
import { PostPreview } from './components/post';
import { PubkyLogin } from './components/auth';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;

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
    setCurrentStep(0);
  };

  const handleLoginSuccess = (publicKey: string) => {
    console.log('✅ LOGIN SUCCESSFUL!');
    console.log('Public Key:', publicKey);
    console.log('User authenticated and ready to post');
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
  };

  // Determine which node to highlight based on current step
  const getActiveNodeId = () => {
    switch (currentStep) {
      case 0:
        return undefined; // Overview - no specific node
      case 1:
        return 'pubky-app'; // Login step - highlight pubky.app
      default:
        return undefined;
    }
  };

  return (
    <MainLayout
      diagramPanel={
        <DiagramPanel>
          <PubkyDiagram activeNodeId={getActiveNodeId()} />
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
        ) : (
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
        )
      }
      controlBar={
        <ControlBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          status="idle"
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
