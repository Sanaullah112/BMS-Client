import { CheckCircle2, Printer, Download } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import { formatCurrency } from '../../utils/format';
import { BRAND } from '../../constants/navigation';

export default function Receipt({ result, onClose }) {
  const rows = [
    ['Reference number', result.reference],
    result.from && ['From', result.from],
    result.to && ['To', result.to],
    ['Amount', formatCurrency(result.amount)],
    result.newBalance != null && ['Available balance', formatCurrency(result.newBalance)],
    ['Date & time', result.date],
  ].filter(Boolean);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-bg">
        <CheckCircle2 size={24} className="text-success" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-ink">Transaction successful</h3>
        <p className="text-sm text-text-muted">Your {result.type.toLowerCase()} has been completed.</p>
      </div>

      <div id="receipt-print" className="w-full rounded border border-line bg-paper/60 p-4 text-left">
        <div className="mb-3 flex items-center justify-between border-b border-line pb-3">
          <span className="font-display text-sm font-medium text-ink">{BRAND.name}</span>
          <Badge tone="brass">{result.type}</Badge>
        </div>
        <dl className="flex flex-col gap-2 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between">
              <dt className="text-text-muted">{label}</dt>
              <dd className="font-medium text-text tnum">{value}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1">
            <dt className="text-text-muted">Status</dt>
            <dd><Badge tone="success">Completed</Badge></dd>
          </div>
        </dl>
      </div>

      <div className="flex w-full gap-2">
        <Button variant="ghost" className="flex-1" icon={Printer} onClick={() => window.print()}>
          Print
        </Button>
        <Button variant="ghost" className="flex-1" icon={Download} onClick={() => window.print()}>
          Download
        </Button>
      </div>
      <Button variant="brass" className="w-full" onClick={onClose}>
        Close
      </Button>
    </div>
  );
}
