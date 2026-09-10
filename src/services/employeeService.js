import api, { unwrap, unwrapPage } from './api';

function normalizeEmployee(employee) {
  return { ...employee, id: employee._id, status: employee.status ? employee.status[0].toUpperCase() + employee.status.slice(1) : employee.status };
}

export async function listEmployees(params = {}) {
  const res = await api.get('/employees', { params });
  const page = unwrapPage(res);
  return { ...page, items: page.items.map(normalizeEmployee) };
}

export async function getEmployee(id) {
  const res = await api.get(`/employees/${id}`);
  return normalizeEmployee(unwrap(res));
}

export async function createEmployee(payload) {
  const res = await api.post('/employees', payload);
  return normalizeEmployee(unwrap(res));
}

export async function updateEmployee(id, payload) {
  const res = await api.put(`/employees/${id}`, payload);
  return normalizeEmployee(unwrap(res));
}

export async function setEmployeeStatus(id, status) {
  const path = status.toLowerCase() === 'inactive' ? `/employees/${id}/deactivate` : `/employees/${id}`;
  const res = status.toLowerCase() === 'inactive' ? await api.put(path) : await api.put(path, { status: status.toLowerCase() });
  return normalizeEmployee(unwrap(res));
}

export async function resetEmployeePassword(id) {
  const res = await api.put(`/employees/${id}/reset-password`);
  return unwrap(res);
}
