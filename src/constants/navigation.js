import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowLeftRight,
  UserCog,
  BarChart3,
  ScrollText,
  Settings,
  Banknote,
  ArrowDownToLine,
  ArrowUpFromLine,
  ReceiptText,
} from 'lucide-react';
import { ROLES } from './roles';

export const NAVIGATION = {
  [ROLES.ADMIN]: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Customers', to: '/admin/customers', icon: Users },
    { label: 'Accounts', to: '/admin/accounts', icon: Wallet },
    { label: 'Deposits', to: '/admin/deposit', icon: ArrowDownToLine },
    { label: 'Withdrawals', to: '/admin/withdrawal', icon: ArrowUpFromLine },
    { label: 'Transfers', to: '/admin/transfer', icon: ArrowLeftRight },
    { label: 'Transactions', to: '/admin/transactions', icon: ReceiptText },
    { label: 'Employees', to: '/admin/employees', icon: UserCog },
    { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
    { label: 'Audit logs', to: '/admin/audit-logs', icon: ScrollText },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ],
  [ROLES.EMPLOYEE]: [
    { label: 'Dashboard', to: '/employee/dashboard', icon: LayoutDashboard },
    { label: 'Customers', to: '/employee/customers', icon: Users },
    { label: 'Accounts', to: '/employee/accounts', icon: Wallet },
    { label: 'Deposits', to: '/employee/deposit', icon: ArrowDownToLine },
    { label: 'Withdrawals', to: '/employee/withdrawal', icon: ArrowUpFromLine },
    { label: 'Transfers', to: '/employee/transfer', icon: ArrowLeftRight },
    { label: 'Transactions', to: '/employee/transactions', icon: ReceiptText },
    { label: 'Settings', to: '/employee/settings', icon: Settings },
  ],
  [ROLES.CUSTOMER]: [
    { label: 'Dashboard', to: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'My accounts', to: '/customer/accounts', icon: Wallet },
    { label: 'Transactions', to: '/customer/transactions', icon: ReceiptText },
    { label: 'Transfer', to: '/customer/transfer', icon: ArrowLeftRight },
    { label: 'Profile', to: '/customer/profile', icon: Settings },
  ],
};

export const BRAND = {
  name: 'Meridian Trust',
  system: 'Bank Management System',
  icon: Banknote,
};
