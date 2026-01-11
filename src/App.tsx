/**
 * App Component
 *
 * Main application entry point for Pubkytecture.
 * Demonstrates the three-panel layout with placeholder content.
 */

import { MainLayout, DiagramPanel, ExplanationPanel, ControlBar } from './components/layout';

function App() {
  return (
    <MainLayout
      diagramPanel={
        <DiagramPanel>
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-zinc-700">React Flow Diagram</div>
              <div className="mt-2 text-zinc-600">Architecture visualization will appear here</div>
            </div>
          </div>
        </DiagramPanel>
      }
      explanationPanel={
        <ExplanationPanel
          stepTitle="Generate Keypair"
          stepDescription="Creating a new Ed25519 keypair locally. This keypair becomes your sovereign identity on the Pubky network."
          location="Local Machine"
          concept={{
            title: "Self-sovereignty",
            description: "Your keypair is generated locally, and your private key never leaves your device. You retain full control over the core identifier of your identity — forming the basis for true ownership and a credible exit."
          }}
          data={{
            publicKey: "8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo",
            algorithm: "Ed25519"
          }}
        />
      }
      controlBar={
        <ControlBar
          currentStep={0}
          totalSteps={4}
          status="idle"
          onNext={() => console.log('Next')}
          onPrevious={() => console.log('Previous')}
          onReset={() => console.log('Reset')}
          onRetry={() => console.log('Retry')}
        />
      }
    />
  );
}

export default App;
