import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { NAVIGATION, BRAND } from '../../constants/navigation';

export default function Sidebar({ role, open, onClose }) {
  const items = NAVIGATION[role] || [];
  const BrandIcon = BRAND.icon;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-ink transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-brass/20 text-brass">
            <BrandIcon size={17} />
          </div>
          <div className="leading-tight">
            <div className="font-display text-[15px] font-medium text-white">{BRAND.name}</div>
            <div className="text-[11px] text-white/50">{BRAND.system}</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-2.5 rounded px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-brass/15 text-brass-light font-medium'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      )
                    }
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-5 py-4 text-[11px] text-white/40">
          &copy; {new Date().getFullYear()} {BRAND.name}
        </div>
      </aside>
    </>
  );
}
