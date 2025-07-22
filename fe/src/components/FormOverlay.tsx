import { Loader2 } from 'lucide-react';
export default function FormOverlay({ loading }: { loading: boolean }) {
    if (!loading) return null;
    return (
      <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-xl">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }