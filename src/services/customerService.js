import api, { unwrap, unwrapPage } from './api';
import { normalizeTransaction } from './transactionService';

function normalizeCustomer(customer) {
  return {
    ...customer,
    id: customer._id,
    name: customer.fullName,
    status: customer.status ? customer.status[0].toUpperCase() + customer.status.slice(1) : customer.status,
  };
}

export async function listCustomers(params = {}) {
  const res = await api.get('/customers', { params });
  const page = unwrapPage(res);
  return { ...page, items: page.items.map(normalizeCustomer) };
}

export async function getCustomer(id) {
  const res = await api.get(`/customers/${id}`);
  return normalizeCustomer(unwrap(res));
}

export async function createCustomer(payload) {
  const res = await api.post('/customers', payload);
  return normalizeCustomer(unwrap(res));
}

export async function updateCustomer(id, payload) {
  const res = await api.put(`/customers/${id}`, payload);
  return normalizeCustomer(unwrap(res));
}

export async function setCustomerStatus(id, status) {
  const path = status.toLowerCase() === 'inactive' ? `/customers/${id}/deactivate` : `/customers/${id}`;
  const res = status.toLowerCase() === 'inactive'
    ? await api.put(path)
    : await api.put(path, { status: status.toLowerCase() });
  return normalizeCustomer(unwrap(res));
}

export async function getCustomerAccounts(id) {
  const res = await api.get(`/customers/${id}/accounts`);
  return unwrap(res).map((account) => ({ ...account, id: account._id || account.accountNumber, type: account.accountType ? account.accountType[0].toUpperCase() + account.accountType.slice(1) : account.type, status: account.status ? account.status[0].toUpperCase() + account.status.slice(1) : account.status }));
}

export async function getCustomerTransactions(id, params = {}) {
  const res = await api.get(`/customers/${id}/transactions`, { params });
  return unwrap(res).map(normalizeTransaction);
}
