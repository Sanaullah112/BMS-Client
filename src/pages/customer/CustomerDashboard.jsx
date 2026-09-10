import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Wallet, Receipt, ArrowLeftRight, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import PreviewBanner from '../../components/common/PreviewBanner';
import { formatCurrency, formatDate } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { listMyAccounts } from '../../services/accountService';
import { getCustomerTransactions } from '../../services/customerService';

const STATUS_TONE = { Completed: 'success', Pending: 'warning', Failed: 'danger' };
const TX_ICON = { Deposit: ArrowDownToLine, Withdrawal: ArrowUpFromLine, Transfer: ArrowLeftRight };

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => { if (user?.id) Promise.all([listMyAccounts(user.id), getCustomerTransactions(user.id)]).then(([accs, txs]) => { setAccounts(accs); setTransactions(txs); }).catch(() => { setAccounts([]); setTransactions([]); }); }, [user?.id]);
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="flex flex-col gap-5">
      <PreviewBanner />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Welcome back, {user?.name || ''}</h1>
          <p className="text-sm text-text-muted">Here's a snapshot of your accounts.</p>
        </div>
        <Button as={Link} to="/customer/transfer" variant="brass" icon={ArrowLeftRight}>
          New transfer
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label="Total balance" value={formatCurrency(totalBalance)} icon={Wallet} accent="success" />
        <StatCard label="Accounts" value={accounts.length} icon={Wallet} accent="brass" />
        <StatCard label="Transactions" value={transactions.length} icon={Receipt} accent="ink" />
      </div>

      <div>
        <h2 className="mb-2.5 text-sm font-semibold text-ink">My accounts</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {accounts.map((acc) => (
            <Link
              key={acc.id}
              to={`/customer/accounts/${acc.id}`}
              className="rounded border border-line bg-white p-4 hover:border-brass/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">{acc.type}</span>
                <Badge tone={acc.status === 'Active' ? 'success' : 'danger'}>{acc.status}</Badge>
              </div>
              <div className="mt-2 text-lg font-semibold text-ink tnum">{formatCurrency(acc.balance)}</div>
              <div className="mt-1 font-mono text-xs text-text-faint">{acc.id}</div>
            </Link>
          ))}
        </div>
      </div>

      <Card title="Recent transactions" noPadding action={<Link to="/customer/transactions" className="text-xs font-medium text-brass hover:text-brass-dark">View all</Link>}>
        <div className="divide-y divide-line">
          {transactions.slice(0, 10).map((t) => {
            const Icon = TX_ICON[t.type];
            return (
              <div key={t.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.04]">
                    <Icon size={15} className="text-text-muted" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text">{t.type}</div>
                    <div className="text-xs text-text-faint">{t.account} &middot; {formatDate(t.date)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold tnum ${t.amount < 0 ? 'text-danger' : 'text-success'}`}>
                    {t.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(t.amount))}
                  </div>
                  <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
