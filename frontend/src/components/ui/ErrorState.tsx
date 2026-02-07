export default function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
      {message}
    </div>
  );
}
