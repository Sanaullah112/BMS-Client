import { useState, useMemo, useEffect } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/tables/Table';
import Badge from '../../components/common/Badge';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import PreviewBanner from '../../components/common/PreviewBanner';
import { formatCurrency, formatDate } from '../../utils/format';
import { getCustomerTransactions } from '../../services/customerService';
import { listMyAccounts } from '../../services/accountService';
import { useAuth } from '../../context/AuthContext';

const PAGE_SIZE = 10;

export default function CustomerTransactionsPage() {
  const [account, setAccount] = useState('');
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const { user } = useAuth();
  useEffect(() => { if (user?.id) Promise.all([getCustomerTransactions(user.id), listMyAccounts(user.id)]).then(([txs, accs]) => { setTransactions(txs); setAccounts(accs); }).catch(() => { setTransactions([]); setAccounts([]); }); }, [user?.id]);

  const data = useMemo(
    () => transactions.filter((t) => !account || t.account === account),
    [transactions, account]
  );
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const pageItems = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      <PreviewBanner />
      <div>
        <h1 className="text-xl font-semibold text-ink">My transactions</h1>
        <p className="text-sm text-text-muted">A complete history across your accounts.</p>
      </div>

      <Card noPadding>
        <div className="p-4">
          <Select
            value={account}
            onChange={(e) => { setAccount(e.target.value); setPage(1); }}
            options={accounts.map((a) => ({ value: a.id, label: `${a.id} — ${a.type}` }))}
            placeholder="All accounts"
            className="w-56"
          />
        </div>
        <Table
          columns={[
            { key: 'id', header: 'Reference' },
            { key: 'type', header: 'Type' },
            { key: 'account', header: 'Account', render: (r) => <span className="font-mono text-xs">{r.account}</span> },
            { key: 'amount', header: 'Amount', render: (r) => (
              <span className={r.amount < 0 ? 'text-danger' : 'text-success'}>
                {r.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(r.amount))}
              </span>
            ) },
            { key: 'status', header: 'Status', render: (r) => <Badge tone={r.status === 'Completed' ? 'success' : 'warning'}>{r.status}</Badge> },
            { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
          ]}
          data={pageItems}
          emptyLabel="No transactions on this account yet"
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>
    </div>
  );
}
