import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import { Inbox } from 'lucide-react';

export default function Table({ columns, data, loading, emptyLabel = 'No records found', keyField = 'id' }) {
  if (loading) return <Loader />;
  if (!data || data.length === 0) {
    return <EmptyState icon={Inbox} title={emptyLabel} description="Once there's activity, it will show up here." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-2.5 text-xs font-medium text-text-muted">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row[keyField]} className="border-b border-line last:border-0 hover:bg-black/[0.02]">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3 text-text">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
