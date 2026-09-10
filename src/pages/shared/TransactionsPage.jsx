import { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/tables/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SearchInput from '../../components/common/SearchInput';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import PreviewBanner from '../../components/common/PreviewBanner';
import { formatCurrency, formatDate } from '../../utils/format';
import { listTransactions } from '../../services/transactionService';

const TYPE_OPTIONS = [
  { value: 'Deposit', label: 'Deposit' },
  { value: 'Withdrawal', label: 'Withdrawal' },
  { value: 'Transfer', label: 'Transfer' },
];
const STATUS_OPTIONS = [
  { value: 'Completed', label: 'Completed' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Failed', label: 'Failed' },
];
const STATUS_TONE = { Completed: 'success', Pending: 'warning', Failed: 'danger' };
const PAGE_SIZE = 10;

export default function TransactionsPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => { listTransactions({ limit: 100 }).then((response) => setTransactions(response.items)).catch(() => setTransactions([])); }, []);

  const data = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (!type || t.type === type) &&
          (!status || t.status === status) &&
          [t.id, t.from, t.to].some((v) => (v || '').toLowerCase().includes(query.toLowerCase()))
      ),
    [transactions, query, type, status]
  );
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const pageItems = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      <PreviewBanner />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Transactions</h1>
          <p className="text-sm text-text-muted">{data.length} matching records</p>
        </div>
        <Button variant="ghost" icon={Download}>Export</Button>
      </div>

      <Card noPadding>
        <div className="flex flex-wrap items-center gap-3 p-4">
          <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search by ID or account…" className="max-w-xs" />
          <Select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} options={TYPE_OPTIONS} placeholder="All types" className="w-40" />
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} options={STATUS_OPTIONS} placeholder="All statuses" className="w-40" />
        </div>
        <Table
          columns={[
            { key: 'id', header: 'Reference' },
            { key: 'type', header: 'Type', render: (r) => <Badge tone="neutral">{r.type}</Badge> },
            { key: 'from', header: 'From' },
            { key: 'to', header: 'To' },
            { key: 'amount', header: 'Amount', render: (r) => formatCurrency(r.amount) },
            { key: 'status', header: 'Status', render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
            { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
          ]}
          data={pageItems}
          emptyLabel="No transactions match your filters"
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>
    </div>
  );
}
