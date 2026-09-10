import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { ROLE_HOME } from '../../constants/roles';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { role } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-bg">
        <ShieldAlert size={22} className="text-danger" />
      </div>
      <h1 className="font-display text-xl font-medium text-ink">You don't have access to this page</h1>
      <p className="max-w-sm text-sm text-text-muted">
        Your account role doesn't permit this section. If you think this is a mistake, contact your administrator.
      </p>
      <Button variant="brass" onClick={() => navigate(ROLE_HOME[role] || '/login')}>
        Back to dashboard
      </Button>
    </div>
  );
}
