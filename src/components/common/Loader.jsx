import { Loader2 } from 'lucide-react';

export default function Loader({ label = 'Loading…', fullHeight = false }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 text-text-muted ${fullHeight ? 'h-64' : 'py-10'}`}>
      <Loader2 size={22} className="animate-spin text-brass" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
