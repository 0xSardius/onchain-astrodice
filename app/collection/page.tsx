export default function CollectionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-9rem)] px-4">
      <div className="text-center space-y-4">
        <div className="text-5xl">&#x1F4DA;</div>
        <h2 className="text-xl font-semibold text-white">Your Collection</h2>
        <p className="text-white/60 text-sm max-w-xs">
          Your minted readings and recent rolls will appear here.
        </p>
        <p className="text-white/40 text-xs">Coming in Phase 5</p>
      </div>
    </div>
  );
}
