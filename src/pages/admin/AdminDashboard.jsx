import { Users, Wallet, Banknote, Receipt, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/tables/Table';
import Badge from '../../components/common/Badge';
import PreviewBanner from '../../components/common/PreviewBanner';
import { formatCurrency, formatDate } from '../../utils/format';
import { getAccountSummary, getCustomerSummary, getTransactionActivity } from '../../services/reportService';
import { normalizeTransaction } from '../../services/transactionService';

const STATUS_TONE = { Completed: 'success', Pending: 'warning', Failed: 'danger' };
const PIE_COLORS = ['#1F7A5C', '#B7791F', '#B3261E'];

export default function AdminDashboard() {
  const [data, setData] = useState({ customers: { total: 0 }, accounts: { byStatus: [], totalActiveBalance: 0 }, transactions: { summary: [], transactions: [] } });
  useEffect(() => { Promise.all([getCustomerSummary(), getAccountSummary(), getTransactionActivity()]).then(([customers, accounts, transactions]) => setData({ customers, accounts, transactions })).catch(() => {}); }, []);
  const s = { totalCustomers: data.customers.total, totalAccounts: data.accounts.byStatus.reduce((sum, item) => sum + item.count, 0), totalBalance: data.accounts.totalActiveBalance, todaysTransactions: data.transactions.transactions.length, todaysDeposits: data.transactions.summary.find((item) => item._id === 'deposit')?.totalAmount || 0, todaysWithdrawals: data.transactions.summary.find((item) => item._id === 'withdrawal')?.totalAmount || 0, todaysTransfers: data.transactions.summary.find((item) => item._id === 'transfer')?.totalAmount || 0, newCustomers: 0 };
  const activity = data.transactions.transactions.map(normalizeTransaction).slice(0, 7).map((t) => ({ day: formatDate(t.date), deposits: t.type === 'Deposit' ? Math.abs(t.amount) : 0, withdrawals: t.type === 'Withdrawal' ? Math.abs(t.amount) : 0, transfers: t.type === 'Transfer' ? Math.abs(t.amount) : 0 }));
  const accountStatus = data.accounts.byStatus.map((item) => ({ name: item._id[0].toUpperCase() + item._id.slice(1), value: item.count }));

  return (
    <div className="flex flex-col gap-5">
      <PreviewBanner />

      <div>
        <h1 className="text-xl font-semibold text-ink">Welcome back, Admin</h1>
        <p className="text-sm text-text-muted">Here's what's happening across the bank today.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total customers" value={s.totalCustomers.toLocaleString()} icon={Users} accent="ink" />
        <StatCard label="Total accounts" value={s.totalAccounts.toLocaleString()} icon={Wallet} accent="brass" />
        <StatCard label="Total balance" value={formatCurrency(s.totalBalance)} icon={Banknote} accent="success" />
        <StatCard label="Transactions today" value={s.todaysTransactions.toLocaleString()} icon={Receipt} accent="ink" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Today's deposits" value={formatCurrency(s.todaysDeposits)} icon={ArrowDownToLine} accent="success" />
        <StatCard label="Today's withdrawals" value={formatCurrency(s.todaysWithdrawals)} icon={ArrowUpFromLine} accent="danger" />
        <StatCard label="Today's transfers" value={formatCurrency(s.todaysTransfers)} icon={ArrowLeftRight} accent="brass" />
        <StatCard label="New customers" value={s.newCustomers} icon={UserPlus} accent="ink" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Transaction activity" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E1D9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8B93A1' }} axisLine={{ stroke: '#E3E1D9' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8B93A1' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: '#E3E1D9' }}
              />
              <Line type="monotone" dataKey="deposits" stroke="#1F7A5C" strokeWidth={2} dot={false} name="Deposits" />
              <Line type="monotone" dataKey="withdrawals" stroke="#B3261E" strokeWidth={2} dot={false} name="Withdrawals" />
              <Line type="monotone" dataKey="transfers" stroke="#A9812F" strokeWidth={2} dot={false} name="Transfers" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Account status">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={accountStatus} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={2}>
                {accountStatus.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: '#E3E1D9' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 px-1">
            {accountStatus.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-text-muted">
                  <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  {s.name}
                </span>
                <span className="font-medium text-text tnum">{s.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Recent transactions" noPadding action={<a href="/admin/transactions" className="text-xs font-medium text-brass hover:text-brass-dark">View all</a>}>
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
          data={data.transactions.transactions.map(normalizeTransaction)}
        />
      </Card>
    </div>
  );
}
