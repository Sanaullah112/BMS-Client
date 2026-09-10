import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowUpFromLine } from 'lucide-react';
import Card from '../../components/common/Card';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Receipt from '../../components/common/Receipt';
import PreviewBanner from '../../components/common/PreviewBanner';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/format';
import { listAccounts } from '../../services/accountService';
import { withdraw } from '../../services/transactionService';

export default function WithdrawalPage() {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const { push } = useToast();

  const refresh = async () => setAccounts((await listAccounts({ limit: 100 })).items);
  useEffect(() => { refresh().catch((err) => push(err.friendlyMessage || 'Could not load accounts.', 'error')); }, []);

  const accountId = watch('accountId');
  const amount = watch('amount');
  const description = watch('description');
  const account = accounts.find((a) => a.id === accountId);
  const insufficientFunds = account && Number(amount) > account.balance;

  const onConfirm = async () => {
    setSubmitting(true);
    try {
      const response = await withdraw({ accountId, amount: Number(amount), description });
      await refresh();
      setResult({
        type: 'Withdrawal',
        reference: response.transaction?.referenceNumber || response.transaction?._id,
        from: account.id,
        amount: Number(amount),
        newBalance: response.balance,
        date: response.transaction?.createdAt,
      });
      setConfirmOpen(false);
    } catch (err) {
      push(err.friendlyMessage || 'Withdrawal failed.', 'error');
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const closeReceipt = () => {
    setResult(null);
    reset();
  };

  return (
    <div className="flex flex-col gap-4">
      <PreviewBanner />
      <div>
        <h1 className="text-xl font-semibold text-ink">Withdrawal</h1>
        <p className="text-sm text-text-muted">Debit funds from a customer's account.</p>
      </div>

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit(() => setConfirmOpen(true))} className="flex flex-col gap-4" noValidate>
          <Select
            label="Account"
            required
            options={accounts.map((a) => ({ value: a.id, label: `${a.id} — ${a.customer}` }))}
            error={errors.accountId?.message}
            {...register('accountId', { required: 'Select an account' })}
          />

          {account && (
            <div className="flex items-center justify-between rounded border border-line bg-paper/60 px-3.5 py-2.5 text-sm">
              <span className="text-text-muted">Available balance</span>
              <span className="font-semibold text-ink tnum">{formatCurrency(account.balance)}</span>
            </div>
          )}

          <Input
            label="Amount"
            type="number"
            min="1"
            required
            error={errors.amount?.message || (insufficientFunds ? 'Amount exceeds available balance' : undefined)}
            {...register('amount', { required: 'Enter an amount', min: { value: 1, message: 'Amount must be greater than zero' } })}
          />
          <Input label="Description (optional)" {...register('description')} />

          <Button
            type="submit"
            variant="danger"
            icon={ArrowUpFromLine}
            disabled={!accountId || account?.status !== 'Active' || insufficientFunds}
          >
            Review withdrawal
          </Button>
          {account && account.status !== 'Active' && (
            <p className="text-xs text-danger">This account is {account.status.toLowerCase()} and cannot be debited.</p>
          )}
        </form>
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm withdrawal"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={submitting}>Cancel</Button>
            <Button variant="danger" onClick={onConfirm} loading={submitting}>Confirm withdrawal</Button>
          </>
        }
      >
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between"><span className="text-text-muted">Account</span><span className="font-medium">{account?.id}</span></div>
          <div className="flex justify-between"><span className="text-text-muted">Customer</span><span className="font-medium">{account?.customer}</span></div>
          <div className="flex justify-between"><span className="text-text-muted">Amount</span><span className="font-medium tnum">{formatCurrency(Number(amount) || 0)}</span></div>
          <div className="flex justify-between"><span className="text-text-muted">Remaining balance</span><span className="font-medium tnum">{formatCurrency((account?.balance || 0) - (Number(amount) || 0))}</span></div>
        </div>
      </Modal>

      <Modal open={!!result} onClose={closeReceipt} title="Receipt" size="sm">
        {result && <Receipt result={result} onClose={closeReceipt} />}
      </Modal>
    </div>
  );
}
