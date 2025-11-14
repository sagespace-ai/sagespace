export default function CouncilLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto" />
        <p className="text-muted-foreground">Assembling Council...</p>
      </div>
    </div>
  )
}
