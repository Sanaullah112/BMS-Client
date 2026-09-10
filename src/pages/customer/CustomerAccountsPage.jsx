import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Badge from '../../components/common/Badge';
import PreviewBanner from '../../components/common/PreviewBanner';
import { formatCurrency } from '../../utils/format';
import { listMyAccounts } from '../../services/accountService';
import { useAuth } from '../../context/AuthContext';

export default function CustomerAccountsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  useEffect(() => { if (user?.id) listMyAccounts(user.id).then(setAccounts).catch(() => setAccounts([])); }, [user?.id]);
  return (
    <div className="flex flex-col gap-4">
      <PreviewBanner />
      <div>
        <h1 className="text-xl font-semibold text-ink">My accounts</h1>
        <p className="text-sm text-text-muted">{accounts.length} accounts linked to your profile.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((acc) => (
          <Link
            key={acc.id}
            to={`/customer/accounts/${acc.id}`}
            className="rounded border border-line bg-white p-4 hover:border-brass/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted">{acc.type} account</span>
              <Badge tone={acc.status === 'Active' ? 'success' : 'danger'}>{acc.status}</Badge>
            </div>
            <div className="mt-2 text-xl font-semibold text-ink tnum">{formatCurrency(acc.balance)}</div>
            <div className="mt-1 font-mono text-xs text-text-faint">{acc.id}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
