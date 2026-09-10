import { Info } from 'lucide-react';

// Shown only while the frontend is running against placeholder data.
// Remove this component's usage once every page below is wired to the
// real backend endpoints (see services/*.js).
export default function PreviewBanner() {
  return (
    <div className="mb-4 flex items-center gap-2 rounded border border-brass/30 bg-brass/[0.06] px-3.5 py-2 text-xs text-brass-dark">
      <Info size={14} />
      Preview data shown — this page will switch to live figures once connected to your backend.
    </div>
  );
}
