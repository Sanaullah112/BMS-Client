import api, { unwrap, unwrapPage } from './api';

function normalizeAccount(account) {
  return {
    ...account,
    id: account._id || account.accountNumber,
    customer: account.customer?.fullName || account.customer?.name || account.customer,
    customerId: account.customer?._id || account.customer,
    type: account.accountType ? account.accountType[0].toUpperCase() + account.accountType.slice(1) : account.type,
    opened: account.openingDate || account.opened,
    status: account.status ? account.status[0].toUpperCase() + account.status.slice(1) : account.status,
  };
}

export async function listAccounts(params = {}) {
  const res = await api.get('/accounts', { params });
  const page = unwrapPage(res);
  return { ...page, items: page.items.map(normalizeAccount) };
}

export async function getAccount(id) {
  const res = await api.get(`/accounts/${id}`); 
  return normalizeAccount(unwrap(res));
}

export async function createAccount(payload) {
  const res = await api.post('/accounts', {
    customer: payload.customerId || payload.customer,
    accountType: payload.type || payload.accountType,
    initialDeposit: Number(payload.openingDeposit ?? payload.initialDeposit ?? 0),
    currency: payload.currency,
  });
  return normalizeAccount(unwrap(res));
}
 
export async function setAccountStatus(id, status) {
  const res = await api.put(`/accounts/${id}/status`, { status: status.toLowerCase() });
  return normalizeAccount(unwrap(res));
}

export async function getAccountTransactions(id, params = {}) {
  const res = await api.get('/transactions', { params: { ...params, accountNumber: id } });
  return unwrapPage(res);
}

export async function listMyAccounts(customerId) {
  const res = await api.get(`/customers/${customerId}/accounts`);
  return unwrap(res).map(normalizeAccount);
}
