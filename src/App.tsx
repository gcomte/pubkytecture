/**
 * App Component
 *
 * Main application entry point for Pubkytecture.
 * Demonstrates the three-panel layout with placeholder content.
 */

import { MainLayout, DiagramPanel, ExplanationPanel, ControlBar } from './components/layout';
import { PubkyDiagram } from './components/diagram';
import { PostPreview } from './components/post';

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
          stepDescription="Publish a picture to pubky.app. Watch as it flows through the distributed system to appear in social feeds."
          concept={{
            title: "Self-sovereign Publishing",
            description: "Your post is stored on your homeserver and made discoverable by pubky.app - without any centralized platform controlling your content."
          }}
        >
          <PostPreview
            imageUrl="/pubkytecture/post-image.png"
            onPublish={() => console.log('Publishing post...')}
          />
        </ExplanationPanel>
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
