import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const TYPE_OPTIONS = [
  { value: 'savings', label: 'Savings' },
  { value: 'current', label: 'Current' },
];

export default function AccountForm({ customers, onSubmit, onCancel, submitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Select
        label="Customer"
        required
        error={errors.customerId?.message}
        options={customers.map((c) => ({ value: c.id, label: `${c.name} (${c.id})` }))}
        {...register('customerId', { required: 'Select a customer' })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Account type" required options={TYPE_OPTIONS} error={errors.type?.message} {...register('type', { required: 'Select account type' })} />
        <Input label="Opening deposit" type="number" min="0" required error={errors.openingDeposit?.message} {...register('openingDeposit', { required: 'Enter opening deposit', min: { value: 0, message: 'Must be zero or more' } })} />
      </div>
      <div className="mt-2 flex justify-end gap-2 border-t border-line pt-4">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={submitting}>Cancel</Button>
        <Button variant="brass" type="submit" loading={submitting}>Create account</Button>
      </div>
    </form>
  );
}
