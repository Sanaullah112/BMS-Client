import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Table from '../../components/tables/Table';
import PreviewBanner from '../../components/common/PreviewBanner';
import { formatCurrency, formatDate } from '../../utils/format';
import { getAccount } from '../../services/accountService';
import { getCustomerTransactions } from '../../services/customerService';
import { useAuth } from '../../context/AuthContext';

// Ownership is enforced server-side (BOLA-protected middleware per the
// backend's design) — this page only ever requests data for the
// authenticated customer's own accounts.

export default function CustomerAccountDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => { if (id && user?.id) Promise.all([getAccount(id), getCustomerTransactions(user.id)]).then(([acc, txs]) => { setAccount(acc); setTransactions(txs.filter((t) => t.account === acc.id)); }).catch(() => { setAccount(null); setTransactions([]); }); }, [id, user?.id]);
  if (!account) return null;

  return (
    <div className="flex flex-col gap-4">
      <PreviewBanner />
      <Link to="/customer/accounts" className="flex items-center gap-1.5 text-sm text-text-muted hover:text-ink w-fit">
        <ArrowLeft size={15} /> Back to my accounts
      </Link>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Account details">
          <dl className="flex flex-col gap-3 text-sm">
            {[
              ['Account No.', <span className="font-mono">{account.id}</span>],
              ['Type', account.type],
              ['Balance', formatCurrency(account.balance)],
              ['Status', <Badge tone={account.status === 'Active' ? 'success' : 'danger'}>{account.status}</Badge>],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <dt className="text-text-muted">{label}</dt>
                <dd className="font-medium text-text">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Transactions" noPadding className="lg:col-span-2">
          <Table
            columns={[
              { key: 'id', header: 'Transaction' },
              { key: 'type', header: 'Type' },
              { key: 'amount', header: 'Amount', render: (r) => formatCurrency(Math.abs(r.amount)) },
              { key: 'status', header: 'Status', render: (r) => <Badge tone={r.status === 'Completed' ? 'success' : 'warning'}>{r.status}</Badge> },
              { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
            ]}
            data={transactions}
            emptyLabel="No transactions on this account yet"
          />
        </Card>
      </div>
    </div>
  );
}
