import { useState } from 'react';
import { Menu, Bell, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ onMenuClick, breadcrumb }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = (user?.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-text-muted hover:text-text lg:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>
        {breadcrumb && (
          <nav className="text-sm text-text-muted" aria-label="Breadcrumb">
            {breadcrumb.map((crumb, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-1.5 text-text-faint">/</span>}
                <span className={i === breadcrumb.length - 1 ? 'text-ink font-medium' : ''}>{crumb}</span>
              </span>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative text-text-muted hover:text-text" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>

        <div className="h-6 w-px bg-line" />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-black/[0.04]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[11px] font-medium text-white">
              {initials}
            </div>
            <div className="hidden text-left leading-tight sm:block">
              <div className="text-sm font-medium text-text">{user?.name || 'User'}</div>
              <div className="text-[11px] capitalize text-text-faint">{user?.role}</div>
            </div>
            <ChevronDown size={14} className="text-text-faint" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-44 rounded border border-line bg-white shadow-panel py-1">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(`/${user?.role}/settings`.replace('/settings', user?.role === 'customer' ? '/profile' : '/settings'));
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-text hover:bg-black/[0.04]"
                >
                  <UserIcon size={15} /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-danger hover:bg-danger-bg"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
