import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyRound, User } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import PreviewBanner from '../components/common/PreviewBanner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { changePassword } from '../services/authService';

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const { push } = useToast();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const newPassword = watch('newPassword');

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      push('Password updated successfully.', 'success');
      reset();
    } catch (err) {
      push(err.friendlyMessage || 'Could not update password.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PreviewBanner />
      <div>
        <h1 className="text-xl font-semibold text-ink">Profile & settings</h1>
        <p className="text-sm text-text-muted">Manage your account information and security.</p>
      </div>

      <Card title="User information" className="max-w-lg">
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white">
              <User size={18} />
            </div>
            <div>
              <div className="font-medium text-text">{user?.name || 'Current user'}</div>
              <div className="text-xs capitalize text-text-faint">{user?.role}</div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-3">
            <dt className="text-text-muted">Email</dt>
            <dd className="font-medium text-text">{user?.email || '—'}</dd>
          </div>
        </dl>
      </Card>

      <Card title="Change password" className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            label="Current password"
            type="password"
            required
            error={errors.currentPassword?.message}
            {...register('currentPassword', { required: 'Enter your current password' })}
          />
          <Input
            label="New password"
            type="password"
            required
            error={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'Enter a new password',
              minLength: { value: 8, message: 'Use at least 8 characters' },
            })}
          />
          <Input
            label="Confirm new password"
            type="password"
            required
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirm your new password',
              validate: (v) => v === newPassword || 'Passwords do not match',
            })}
          />
          <Button type="submit" variant="brass" icon={KeyRound} loading={submitting} className="w-fit">
            Update password
          </Button>
        </form>
      </Card>
    </div>
  );
}
