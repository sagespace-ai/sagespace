export default function PlaygroundLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto" />
        <p className="text-muted-foreground">Loading Playground...</p>
      </div>
    </div>
  )
}
