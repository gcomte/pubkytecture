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
          <PostPreview
            onPublish={() => console.log('Starting post journey...')}
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
