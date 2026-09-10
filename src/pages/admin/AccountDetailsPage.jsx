import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Table from '../../components/tables/Table';
import PreviewBanner from '../../components/common/PreviewBanner';
import { formatCurrency, formatDate } from '../../utils/format';
import { getAccount, getAccountTransactions } from '../../services/accountService';

export default function AccountDetailsPage() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => { if (id) Promise.all([getAccount(id), getAccountTransactions(id)]).then(([acc, txs]) => { setAccount(acc); setTransactions(txs.items || txs); }).catch(() => { setAccount(null); setTransactions([]); }); }, [id]);
  if (!account) return null;

  return (
    <div className="flex flex-col gap-4">
      <PreviewBanner />
      <Link to="/admin/accounts" className="flex items-center gap-1.5 text-sm text-text-muted hover:text-ink w-fit">
        <ArrowLeft size={15} /> Back to accounts
      </Link>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Account details">
          <dl className="flex flex-col gap-3 text-sm">
            {[
              ['Account No.', <span className="font-mono">{account.id}</span>],
              ['Customer', account.customer],
              ['Type', account.type],
              ['Balance', formatCurrency(account.balance, account.currency)],
              ['Status', <Badge tone={account.status === 'Active' ? 'success' : account.status === 'Frozen' ? 'warning' : 'neutral'}>{account.status}</Badge>],
              ['Opened', formatDate(account.opened)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <dt className="text-text-muted">{label}</dt>
                <dd className="font-medium text-text">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Transaction history" noPadding className="lg:col-span-2">
          <Table
            columns={[
              { key: 'id', header: 'Transaction' },
              { key: 'type', header: 'Type' },
              { key: 'amount', header: 'Amount', render: (r) => formatCurrency(r.amount) },
              { key: 'status', header: 'Status', render: (r) => <Badge tone={r.status === 'Completed' ? 'success' : r.status === 'Pending' ? 'warning' : 'danger'}>{r.status}</Badge> },
              { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
            ]}
            data={transactions}
          />
        </Card>
      </div>
    </div>
  );
}
