import { useEffect, useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/tables/Table';
import Badge from '../../components/common/Badge';
import SearchInput from '../../components/common/SearchInput';
import Pagination from '../../components/common/Pagination';
import PreviewBanner from '../../components/common/PreviewBanner';
import { listAuditLogs } from '../../services/auditService';

const PAGE_SIZE = 15;

export default function AuditLogsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState([]);

  useEffect(() => { listAuditLogs({ limit: 200 }).then((response) => setLogs(response.items)).catch(() => setLogs([])); }, []);

  const filtered = useMemo(
    () =>
      logs.filter((l) =>
        [l.user, l.action, l.module, l.recordId].some((v) => v.toLowerCase().includes(query.toLowerCase()))
      ),
    [logs, query]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      <PreviewBanner />
      <div>
        <h1 className="text-xl font-semibold text-ink">Audit logs</h1>
        <p className="text-sm text-text-muted">A record of sensitive actions taken across the system.</p>
      </div>

      <Card noPadding>
        <div className="p-4">
          <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search by user, action, module, or record…" className="max-w-sm" />
        </div>
        <Table
          columns={[
            { key: 'user', header: 'User' },
            { key: 'action', header: 'Action', render: (r) => <Badge tone="brass">{r.action}</Badge> },
            { key: 'module', header: 'Module' },
            { key: 'recordId', header: 'Record ID' },
            { key: 'timestamp', header: 'Timestamp' },
            { key: 'result', header: 'Result', render: (r) => <Badge tone={r.result === 'Success' ? 'success' : 'danger'}>{r.result}</Badge> },
          ]}
          data={pageItems}
          emptyLabel="No audit entries match your search"
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>
    </div>
  );
}
