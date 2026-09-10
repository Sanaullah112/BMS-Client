import api, { unwrap } from './api';

export async function getDashboardSummary(role) {
  const [customers, accounts, transactions] = await Promise.all([
    getCustomerSummary(),
    getAccountSummary(),
    getTransactionActivity(),
  ]);
  return { role, customers, accounts, transactions };
}

export async function getTransactionActivity(params = {}) {
  const res = await api.get('/reports/transactions', { params });
  return unwrap(res);
}

export async function getAccountSummary(params = {}) {
  const res = await api.get('/reports/accounts', { params });
  return unwrap(res);
}

export async function getCustomerSummary(params = {}) {
  const res = await api.get('/reports/customers', { params });
  return unwrap(res);
}
