/**
 * PostPreview Component
 *
 * Shows the predefined post that will be published in the visualization.
 * Displays the image and explains this is what will be posted to pubky.app profile.
 * Requires pubky login to actually publish to the homeserver.
 */

interface PostPreviewProps {
  imageUrl: string;
  onPublish?: () => void;
}

export function PostPreview({ imageUrl, onPublish }: PostPreviewProps) {
  return (
    <div className="space-y-4">
      {/* Explanation */}
      <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
        <p className="text-sm leading-relaxed text-zinc-300">
          In this visualization, you'll publish the following picture to your homeserver,
          where it will be made discoverable by pubky.app. This requires a pubky login
          and actually posts to your pubky.app profile - watch as it flows through the distributed system!
        </p>
      </div>

      {/* Image preview */}
      <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
        <img
          src={imageUrl}
          alt="Post preview"
          className="h-auto w-full object-cover"
          style={{ maxHeight: '300px' }}
        />
      </div>

      {/* Publish button */}
      {onPublish && (
        <button
          onClick={onPublish}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          Publish Post
        </button>
      )}
    </div>
  );
}
