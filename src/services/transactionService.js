import api, { unwrap, unwrapPage } from './api';

export function normalizeTransaction(transaction) {
  const from = transaction.fromAccount?.accountNumber || transaction.fromAccount || '';
  const to = transaction.toAccount?.accountNumber || transaction.toAccount || '';
  const type = transaction.type ? transaction.type[0].toUpperCase() + transaction.type.slice(1) : transaction.type;
  return { ...transaction, id: transaction.referenceNumber || transaction._id, type, from, to, account: from || to, date: transaction.createdAt, status: transaction.status ? transaction.status[0].toUpperCase() + transaction.status.slice(1) : transaction.status, amount: type === 'Withdrawal' || (type === 'Transfer' && from) ? -Math.abs(transaction.amount) : transaction.amount };
}

export async function listTransactions(params = {}) {
  const res = await api.get('/transactions', { params });
  const page = unwrapPage(res);
  return { ...page, items: page.items.map(normalizeTransaction) };
}

export async function getTransaction(id) {
  const res = await api.get(`/transactions/${id}`);
  return normalizeTransaction(unwrap(res));
}

export async function deposit({ accountId, amount, description }) {
  const res = await api.post('/transactions/deposit', { accountId, amount, description });
  return unwrap(res); // must be authoritative: reference no. + resulting balance
}

export async function withdraw({ accountId, amount, description }) {
  const res = await api.post('/transactions/withdraw', { accountId, amount, description });
  return unwrap(res);
}

export async function transfer({ fromAccountId, toAccountNumber, amount, description }) {
  const res = await api.post('/transactions/transfer', { fromAccountId, toAccountNumber, amount, description });
  return unwrap(res);
}
