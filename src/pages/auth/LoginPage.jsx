import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { Banknote, ShieldCheck, Lock } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { ROLE_HOME } from '../../constants/roles';
import { BRAND } from '../../constants/navigation';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    setServerError('');
    setLoading(true);
    try {
      const user = await login(values);
      const redirectTo = location.state?.from || ROLE_HOME[user.role] || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // Always log the raw error while wiring this up — friendlyMessage
      // is a UI-safe summary, but the console has the real cause.
      console.error('[LoginPage] login failed:', err);
      setServerError(err.friendlyMessage || err.message || 'Something went wrong signing you in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Brand panel */}
      <div className="relative hidden w-[42%] flex-col justify-between bg-ink px-12 py-12 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-brass/20 text-brass">
            <Banknote size={19} />
          </div>
          <span className="font-display text-lg font-medium">{BRAND.name}</span>
        </div>

        <div>
          <h1 className="font-display text-[2.1rem] leading-[1.15] font-medium">
            Every ledger entry,
            <br />
            accounted for.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            A single system of record for customer accounts, deposits, withdrawals,
            and transfers — built for the people who keep the books straight.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-sm text-white/70">
              <ShieldCheck size={16} className="text-brass" />
              Role-based access for admins, staff, and customers
            </div>
            <div className="flex items-center gap-2.5 text-sm text-white/70">
              <Lock size={16} className="text-brass" />
              Every transaction recorded atomically, no exceptions
            </div>
          </div>
        </div>

        <p className="text-xs text-white/40">{BRAND.system}</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-ink text-brass">
              <Banknote size={17} />
            </div>
            <span className="font-display text-lg font-medium text-ink">{BRAND.name}</span>
          </div>

          <h2 className="text-xl font-semibold text-ink">Welcome back</h2>
          <p className="mt-1 text-sm text-text-muted">Sign in to continue to your dashboard.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
            <Input
              label="Email"
              type="email"
              autoComplete="username"
              required
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />

            {serverError && (
              <div className="rounded border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">
                {serverError}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-text-muted">
                <input type="checkbox" className="rounded border-line text-brass focus:ring-brass" {...register('remember')} />
                Remember me
              </label>
              <button type="button" className="text-brass hover:text-brass-dark">
                Forgot password?
              </button>
            </div>

            <Button type="submit" variant="brass" size="lg" loading={loading} className="w-full">
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-text-faint">
            Access is provisioned by your bank administrator. There is no self-service sign-up.
          </p>
        </div>
      </div>
    </div>
  );
}
