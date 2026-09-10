import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeftRight } from 'lucide-react';
import Card from '../../components/common/Card';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Receipt from '../../components/common/Receipt';
import PreviewBanner from '../../components/common/PreviewBanner';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/format';
import { listMyAccounts } from '../../services/accountService';
import { transfer } from '../../services/transactionService';
import { useAuth } from '../../context/AuthContext';

export default function CustomerTransferPage() {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const { push } = useToast();
  const { user } = useAuth();
  const refresh = async () => setAccounts(await listMyAccounts(user.id));
  useEffect(() => { if (user?.id) refresh().catch(() => setAccounts([])); }, [user?.id]);

  const fromAccountId = watch('fromAccountId');
  const toAccountNumber = watch('toAccountNumber');
  const amount = watch('amount');
  const description = watch('description');
  const fromAccount = accounts.find((a) => a.id === fromAccountId);
  const insufficientFunds = fromAccount && Number(amount) > fromAccount.balance;
  const sameAccount = fromAccountId && fromAccountId === toAccountNumber;

  const onConfirm = async () => {
    setSubmitting(true);
    try {
      const response = await transfer({ fromAccountId, toAccountNumber, amount: Number(amount), description });
      await refresh();
      setResult({
        type: 'Transfer',
        reference: response.debitTransaction?.referenceNumber || response.debitTransaction?._id,
        from: fromAccount.id,
        to: toAccountNumber,
        amount: Number(amount),
        newBalance: response.senderBalance,
        date: response.debitTransaction?.createdAt,
      });
      setConfirmOpen(false);
    } catch (err) {
      push(err.friendlyMessage || 'Transfer failed.', 'error');
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
        <h1 className="text-xl font-semibold text-ink">Transfer funds</h1>
        <p className="text-sm text-text-muted">Send money from one of your accounts to another account.</p>
      </div>

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit(() => setConfirmOpen(true))} className="flex flex-col gap-4" noValidate>
          <Select
            label="From account"
            required
            options={accounts.map((a) => ({ value: a.id, label: `${a.id} — ${a.type}` }))}
            error={errors.fromAccountId?.message}
            {...register('fromAccountId', { required: 'Select an account' })}
          />
          {fromAccount && (
            <div className="flex items-center justify-between rounded border border-line bg-paper/60 px-3.5 py-2.5 text-sm -mt-2">
              <span className="text-text-muted">Available balance</span>
              <span className="font-semibold text-ink tnum">{formatCurrency(fromAccount.balance)}</span>
            </div>
          )}

          <Input
            label="Receiver account number"
            required
            error={errors.toAccountNumber?.message || (sameAccount ? 'You cannot transfer to the same account' : undefined)}
            {...register('toAccountNumber', { required: 'Enter the receiving account number' })}
          />

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
            variant="brass"
            icon={ArrowLeftRight}
            disabled={!fromAccountId || !toAccountNumber || sameAccount || insufficientFunds}
          >
            Review transfer
          </Button>
        </form>
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm transfer"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={submitting}>Cancel</Button>
            <Button variant="brass" onClick={onConfirm} loading={submitting}>Confirm transfer</Button>
          </>
        }
      >
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between"><span className="text-text-muted">From</span><span className="font-medium">{fromAccount?.id}</span></div>
          <div className="flex justify-between"><span className="text-text-muted">To</span><span className="font-medium">{toAccountNumber}</span></div>
          <div className="flex justify-between"><span className="text-text-muted">Amount</span><span className="font-medium tnum">{formatCurrency(Number(amount) || 0)}</span></div>
        </div>
      </Modal>

      <Modal open={!!result} onClose={closeReceipt} title="Receipt" size="sm">
        {result && <Receipt result={result} onClose={closeReceipt} />}
      </Modal>
    </div>
  );
}
