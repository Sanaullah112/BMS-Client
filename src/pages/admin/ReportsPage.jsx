import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { FileDown } from 'lucide-react';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import PreviewBanner from '../../components/common/PreviewBanner';
import { formatCurrency } from '../../utils/format';
import { getTransactionActivity, getAccountSummary, getCustomerSummary } from '../../services/reportService';

const REPORT_TYPES = [
  { value: 'transactions', label: 'Daily transactions' },
  { value: 'accounts', label: 'Account summary' },
  { value: 'customers', label: 'Customer summary' },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState('transactions');
  const [report, setReport] = useState({ summary: [], transactions: [] });
  const [accounts, setAccounts] = useState({ totalActiveBalance: 0 });
  const [customers, setCustomers] = useState({ total: 0 });
  useEffect(() => { Promise.all([getTransactionActivity(), getAccountSummary(), getCustomerSummary()]).then(([tx, acc, cust]) => { setReport(tx); setAccounts(acc); setCustomers(cust); }).catch(() => {}); }, []);
  const s = { todaysDeposits: report.summary.find((item) => item._id === 'deposit')?.totalAmount || 0, todaysWithdrawals: report.summary.find((item) => item._id === 'withdrawal')?.totalAmount || 0, todaysTransfers: report.summary.find((item) => item._id === 'transfer')?.totalAmount || 0, todaysTransactions: report.transactions.length };

  return (
    <div className="flex flex-col gap-4">
      <PreviewBanner />
      <div>
        <h1 className="text-xl font-semibold text-ink">Reports</h1>
        <p className="text-sm text-text-muted">Generate and review activity across the bank.</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <Select label="Report type" options={REPORT_TYPES} value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-52" />
          <Input label="From date" type="date" className="w-44" />
          <Input label="To date" type="date" className="w-44" />
          <Button variant="brass" icon={FileDown}>Generate</Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total deposits" value={formatCurrency(s.todaysDeposits)} accent="success" />
        <StatCard label="Total withdrawals" value={formatCurrency(s.todaysWithdrawals)} accent="danger" />
        <StatCard label="Total transfers" value={formatCurrency(s.todaysTransfers)} accent="brass" />
        <StatCard label="Total transactions" value={s.todaysTransactions.toLocaleString()} accent="ink" />
      </div>

      <Card title="Transactions overview">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={report.transactions.map((transaction) => ({ day: transaction.createdAt, deposits: transaction.type === 'deposit' ? transaction.amount : 0, withdrawals: transaction.type === 'withdrawal' ? transaction.amount : 0, transfers: transaction.type === 'transfer' ? transaction.amount : 0 }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3E1D9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8B93A1' }} axisLine={{ stroke: '#E3E1D9' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#8B93A1' }} axisLine={false} tickLine={false} width={40} />
            <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: '#E3E1D9' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="deposits" fill="#1F7A5C" name="Deposits" radius={[2, 2, 0, 0]} />
            <Bar dataKey="withdrawals" fill="#B3261E" name="Withdrawals" radius={[2, 2, 0, 0]} />
            <Bar dataKey="transfers" fill="#A9812F" name="Transfers" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
