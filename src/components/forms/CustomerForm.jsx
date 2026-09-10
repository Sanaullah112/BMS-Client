import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export default function CustomerForm({ defaultValues, onSubmit, onCancel, submitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Full name" required error={errors.fullName?.message} {...register('fullName', { required: 'Full name is required' })} />
        <Input label="Father / guardian name" {...register('guardianName')} />
        <Input
          label="CNIC"
          placeholder="XXXXX-XXXXXXX-X"
          required
          error={errors.cnic?.message}
          {...register('cnic', { required: 'CNIC is required' })}
        />
        <Input label="Date of birth" type="date" required error={errors.dob?.message} {...register('dob', { required: 'Date of birth is required' })} />
        <Select label="Gender" options={GENDER_OPTIONS} {...register('gender')} />
        <Input label="Phone" required error={errors.phone?.message} {...register('phone', { required: 'Phone is required' })} />
        <Input label="Email" type="email" {...register('email')} />
        <Input label="Password" type="password" required error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })} />
        <Input label="City" {...register('city')} />
      </div>
      <Input label="Address" {...register('address')} />

      <div className="mt-2 flex justify-end gap-2 border-t border-line pt-4">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="brass" type="submit" loading={submitting}>
          Save customer
        </Button>
      </div>
    </form>
  );
}
