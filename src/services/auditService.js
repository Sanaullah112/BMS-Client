import api, { unwrapPage } from './api';

export async function listAuditLogs(params = {}) {
  const res = await api.get('/audit-logs', { params });
  const page = unwrapPage(res);
  return { ...page, items: page.items.map((log) => ({ ...log, id: log._id, user: log.user?.name || log.user?.email || log.user || '', recordId: log.recordId, result: log.result ? log.result[0].toUpperCase() + log.result.slice(1) : log.result, timestamp: log.timestamp })) };
}
