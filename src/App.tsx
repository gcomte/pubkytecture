/**
 * App Component
 *
 * Main application entry point for Pubkytecture.
 * Demonstrates the three-panel layout with placeholder content.
 */

import { MainLayout, DiagramPanel, ExplanationPanel, ControlBar } from './components/layout';
import { PubkyDiagram } from './components/diagram';

function App() {
  return (
    <MainLayout
      diagramPanel={
        <DiagramPanel>
          <PubkyDiagram activeNodeId="local" />
        </DiagramPanel>
      }
      explanationPanel={
        <ExplanationPanel
          stepTitle="Create a Post"
          stepDescription="Write a post and publish it to the Pubky network. Watch as it flows through the distributed system to appear in social feeds."
          location="Local Machine"
          concept={{
            title: "Distributed Publishing",
            description: "Your post is stored on your homeserver, indexed by Nexus, and made discoverable to all Pubky applications - without any centralized platform controlling your content."
          }}
          data={{
            status: "Ready to publish"
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
