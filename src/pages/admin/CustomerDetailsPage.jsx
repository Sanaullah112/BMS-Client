import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Wallet } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Table from '../../components/tables/Table';
import PreviewBanner from '../../components/common/PreviewBanner';
import { formatCurrency, formatDate } from '../../utils/format';
import { getCustomer, getCustomerAccounts, getCustomerTransactions } from '../../services/customerService';

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => { if (id) Promise.all([getCustomer(id), getCustomerAccounts(id), getCustomerTransactions(id)]).then(([c, accs, txs]) => { setCustomer(c); setAccounts(accs); setTransactions(txs); }).catch(() => { setCustomer(null); setAccounts([]); setTransactions([]); }); }, [id]);
  if (!customer) return null;

  return (
    <div className="flex flex-col gap-4">
      <PreviewBanner />
      <Link to="/admin/customers" className="flex items-center gap-1.5 text-sm text-text-muted hover:text-ink w-fit">
        <ArrowLeft size={15} /> Back to customers
      </Link>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Personal information" className="lg:col-span-1">
          <dl className="flex flex-col gap-3 text-sm">
            {[
              ['Customer ID', customer.id],
              ['Full name', customer.name],
              ['CNIC', customer.cnic],
              ['Phone', customer.phone],
              ['Status', <Badge tone={customer.status === 'Active' ? 'success' : 'neutral'}>{customer.status}</Badge>],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <dt className="text-text-muted">{label}</dt>
                <dd className="font-medium text-text">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card title="Accounts" noPadding>
            <Table
              columns={[
                { key: 'id', header: 'Account No.' },
                { key: 'type', header: 'Type' },
                { key: 'balance', header: 'Balance', render: (r) => formatCurrency(r.balance) },
                { key: 'status', header: 'Status', render: (r) => <Badge tone={r.status === 'Active' ? 'success' : r.status === 'Frozen' ? 'warning' : 'neutral'}>{r.status}</Badge> },
              ]}
              data={accounts}
            />
          </Card>

          <Card title="Transaction history" noPadding>
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
    </div>
  );
}
