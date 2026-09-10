import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import { ROLES, ROLE_HOME } from './constants/roles';

import LoginPage from './pages/auth/LoginPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import CustomersPage from './pages/admin/CustomersPage';
import CustomerDetailsPage from './pages/admin/CustomerDetailsPage';
import AccountsPage from './pages/admin/AccountsPage';
import AccountDetailsPage from './pages/admin/AccountDetailsPage';
import EmployeesPage from './pages/admin/EmployeesPage';
import ReportsPage from './pages/admin/ReportsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

import EmployeeDashboard from './pages/employee/EmployeeDashboard';

import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerAccountsPage from './pages/customer/CustomerAccountsPage';
import CustomerAccountDetailsPage from './pages/customer/CustomerAccountDetailsPage';
import CustomerTransactionsPage from './pages/customer/CustomerTransactionsPage';
import CustomerTransferPage from './pages/customer/CustomerTransferPage';

import DepositPage from './pages/shared/DepositPage';
import WithdrawalPage from './pages/shared/WithdrawalPage';
import TransferPage from './pages/shared/TransferPage';
import TransactionsPage from './pages/shared/TransactionsPage';

function RoleHomeRedirect() {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[role] || '/login'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/" element={<RoleHomeRedirect />} />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allow={[ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/:id" element={<CustomerDetailsPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="accounts/:id" element={<AccountDetailsPage />} />
        <Route path="deposit" element={<DepositPage />} />
        <Route path="withdrawal" element={<WithdrawalPage />} />
        <Route path="transfer" element={<TransferPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        <Route path="settings" element={<ProfileSettingsPage />} />
      </Route>

      {/* EMPLOYEE */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allow={[ROLES.EMPLOYEE]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/:id" element={<CustomerDetailsPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="accounts/:id" element={<AccountDetailsPage />} />
        <Route path="deposit" element={<DepositPage />} />
        <Route path="withdrawal" element={<WithdrawalPage />} />
        <Route path="transfer" element={<TransferPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="settings" element={<ProfileSettingsPage />} />
      </Route>

      {/* CUSTOMER */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allow={[ROLES.CUSTOMER]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="accounts" element={<CustomerAccountsPage />} />
        <Route path="accounts/:id" element={<CustomerAccountDetailsPage />} />
        <Route path="transactions" element={<CustomerTransactionsPage />} />
        <Route path="transfer" element={<CustomerTransferPage />} />
        <Route path="profile" element={<ProfileSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  );
}
