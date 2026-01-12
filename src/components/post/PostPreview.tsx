/**
 * PostPreview Component
 *
 * Overview page explaining the Post Journey flow.
 * Shows login requirement and start button.
 */

interface PostPreviewProps {
  onPublish?: () => void;
}

export function PostPreview({ onPublish }: PostPreviewProps) {
  return (
    <div className="space-y-4">
      {/* Login explanation */}
      <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
        <p className="text-sm leading-relaxed text-zinc-300">
          Publishing requires your Pubky identity - the same one you use on pubky.app.
          In the next step, we'll let you log in to this website, but visualize it as if
          you're logging in to pubky.app.
        </p>
      </div>

      {/* Start button */}
      {onPublish && (
        <button
          onClick={onPublish}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          Let's get started!
        </button>
      )}
    </div>
  );
}
