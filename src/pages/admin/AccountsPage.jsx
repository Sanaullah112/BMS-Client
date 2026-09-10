import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PlusCircle, Eye } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/tables/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SearchInput from '../../components/common/SearchInput';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import PreviewBanner from '../../components/common/PreviewBanner';
import AccountForm from '../../components/forms/AccountForm';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/format';
import { listAccounts, createAccount } from '../../services/accountService';
import { listCustomers } from '../../services/customerService';

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Frozen', label: 'Frozen' },
  { value: 'Closed', label: 'Closed' },
];
const PAGE_SIZE = 10;

export default function AccountsPage() {
  const [params, setParams] = useSearchParams();
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(params.get('new') === '1');
  const [submitting, setSubmitting] = useState(false);
  const { push } = useToast();

  const refresh = async () => {
    const [accountPage, customerPage] = await Promise.all([listAccounts({ limit: 100 }), listCustomers({ limit: 100 })]);
    setAccounts(accountPage.items);
    setCustomers(customerPage.items.filter((customer) => customer.status === 'Active'));
  };

  useEffect(() => { refresh().catch((err) => push(err.friendlyMessage || 'Could not load accounts.', 'error')); }, []);

  const filtered = useMemo(
    () =>
      accounts.filter(
        (a) =>
          (!status || a.status === status) &&
          [a.id, a.customer].some((v) => v.toLowerCase().includes(query.toLowerCase()))
      ),
    [accounts, query, status]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const closeForm = () => {
    setFormOpen(false);
    params.delete('new');
    setParams(params, { replace: true });
  };

  const handleCreate = async (values) => {
    setSubmitting(true);
    try {
      await createAccount(values);
      await refresh();
      push('Account created successfully.', 'success');
      closeForm();
    } catch (err) {
      push(err.friendlyMessage || 'Could not create account.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PreviewBanner />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Accounts</h1>
          <p className="text-sm text-text-muted">{filtered.length} total</p>
        </div>
        <Button variant="brass" icon={PlusCircle} onClick={() => setFormOpen(true)}>
          Create account
        </Button>
      </div>

      <Card noPadding>
        <div className="flex flex-wrap items-center gap-3 p-4">
          <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search by account no. or customer…" className="max-w-sm" />
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} options={STATUS_OPTIONS} placeholder="All statuses" className="w-44" />
        </div>
        <Table
          columns={[
            { key: 'id', header: 'Account No.', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
            { key: 'customer', header: 'Customer' },
            { key: 'type', header: 'Type' },
            { key: 'balance', header: 'Balance', render: (r) => formatCurrency(r.balance, r.currency) },
            { key: 'status', header: 'Status', render: (r) => <Badge tone={r.status === 'Active' ? 'success' : r.status === 'Frozen' ? 'warning' : 'neutral'}>{r.status}</Badge> },
            { key: 'opened', header: 'Opened', render: (r) => formatDate(r.opened) },
            {
              key: 'actions',
              header: 'Actions',
              render: (r) => (
                <Link to={`/admin/accounts/${r.id}`} className="rounded p-1.5 text-text-muted hover:bg-black/[0.04] hover:text-ink" aria-label="View">
                  <Eye size={15} />
                </Link>
              ),
            },
          ]}
          data={pageItems}
          emptyLabel="No accounts match your filters"
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>

      <Modal open={formOpen} onClose={closeForm} title="Create account">
        <AccountForm customers={customers} onSubmit={handleCreate} onCancel={closeForm} submitting={submitting} />
      </Modal>
    </div>
  );
}
