import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, Wallet, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, UserPlus, PlusCircle } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/tables/Table';
import Badge from '../../components/common/Badge';
import PreviewBanner from '../../components/common/PreviewBanner';
import { formatCurrency, formatDate } from '../../utils/format';
import { getTransactionActivity } from '../../services/reportService';
import { listTransactions } from '../../services/transactionService';
import { useAuth } from '../../context/AuthContext';

const STATUS_TONE = { Completed: 'success', Pending: 'warning', Failed: 'danger' };

const QUICK_ACTIONS = [
  { label: 'Add customer', to: '/employee/customers?new=1', icon: UserPlus },
  { label: 'Create account', to: '/employee/accounts?new=1', icon: PlusCircle },
  { label: 'Deposit', to: '/employee/deposit', icon: ArrowDownToLine },
  { label: 'Withdrawal', to: '/employee/withdrawal', icon: ArrowUpFromLine },
  { label: 'Transfer', to: '/employee/transfer', icon: ArrowLeftRight },
];

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [report, setReport] = useState({ summary: [], transactions: [] });
  const [transactions, setTransactions] = useState([]);
  useEffect(() => { Promise.all([getTransactionActivity(), listTransactions({ limit: 10 })]).then(([summary, page]) => { setReport(summary); setTransactions(page.items); }).catch(() => {}); }, []);
  const total = (type) => report.summary.find((item) => item._id === type)?.totalAmount || 0;
  const s = { todaysDeposits: total('deposit'), todaysWithdrawals: total('withdrawal'), todaysTransfers: total('transfer') };

  return (
    <div className="flex flex-col gap-5">
      <PreviewBanner />

      <div>
        <h1 className="text-xl font-semibold text-ink">Welcome back, {user?.name || ''}</h1>
        <p className="text-sm text-text-muted">Your teller activity and shortcuts for today.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="flex flex-col items-center gap-2 rounded border border-line bg-white px-3 py-4 text-center hover:border-brass/40 hover:bg-brass/[0.03]"
          >
            <a.icon size={18} className="text-brass" />
            <span className="text-xs font-medium text-text">{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Today's deposits" value={formatCurrency(s.todaysDeposits)} icon={ArrowDownToLine} accent="success" />
        <StatCard label="Today's withdrawals" value={formatCurrency(s.todaysWithdrawals)} icon={ArrowUpFromLine} accent="danger" />
        <StatCard label="Today's transfers" value={formatCurrency(s.todaysTransfers)} icon={ArrowLeftRight} accent="brass" />
        <StatCard label="Customers served" value={report.transactions.length} icon={Users} accent="ink" />
      </div>

      <Card title="Recent transactions" noPadding>
        <Table
          columns={[
            { key: 'id', header: 'Transaction' },
            { key: 'type', header: 'Type', render: (r) => <Badge tone="neutral">{r.type}</Badge> },
            { key: 'from', header: 'From' },
            { key: 'to', header: 'To' },
            { key: 'amount', header: 'Amount', render: (r) => formatCurrency(r.amount) },
            { key: 'status', header: 'Status', render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
            { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
          ]}
          data={transactions}
        />
      </Card>
    </div>
  );
}
