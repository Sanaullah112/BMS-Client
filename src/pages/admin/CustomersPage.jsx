import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { UserPlus, Eye, Pencil, UserX } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/tables/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SearchInput from '../../components/common/SearchInput';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import PreviewBanner from '../../components/common/PreviewBanner';
import CustomerForm from '../../components/forms/CustomerForm';
import { useToast } from '../../context/ToastContext';
import { listCustomers, createCustomer, updateCustomer, setCustomerStatus } from '../../services/customerService';

const PAGE_SIZE = 10;

export default function CustomersPage() {
  const [params, setParams] = useSearchParams();
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(params.get('new') === '1');
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { push } = useToast();

  const refresh = async () => setCustomers((await listCustomers({ limit: 100 })).items);
  useEffect(() => { refresh().catch((err) => push(err.friendlyMessage || 'Could not load customers.', 'error')); }, []);

  const filtered = useMemo(
    () =>
      customers.filter((c) =>
        [c.name, c.id, c.cnic, c.phone].some((v) => v.toLowerCase().includes(query.toLowerCase()))
      ),
    [customers, query]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const closeForm = () => {
    setFormOpen(false);
    params.delete('new');
    setParams(params, { replace: true });
  };

  const handleCreate = async (values) => {
    setSubmitting(true);
    try {
      const payload = { ...values, fatherOrGuardianName: values.guardianName, dateOfBirth: values.dob, password: values.password };
      if (editTarget) await updateCustomer(editTarget.id, payload);
      else await createCustomer(payload);
      await refresh();
      push(editTarget ? 'Customer updated successfully.' : 'Customer added successfully.', 'success');
      setEditTarget(null);
      closeForm();
    } catch (err) {
      push(err.friendlyMessage || 'Could not add customer.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    setSubmitting(true);
    try {
      await setCustomerStatus(deactivateTarget.id, 'Inactive');
      await refresh();
      push(`${deactivateTarget.name} has been deactivated.`, 'success');
      setDeactivateTarget(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PreviewBanner />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Customers</h1>
          <p className="text-sm text-text-muted">{filtered.length} total</p>
        </div>
        <Button variant="brass" icon={UserPlus} onClick={() => setFormOpen(true)}>
          Add customer
        </Button>
      </div>

      <Card noPadding>
        <div className="flex items-center justify-between gap-3 p-4">
          <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search by name, ID, CNIC, phone…" className="max-w-sm" />
        </div>
        <Table
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'name', header: 'Name' },
            { key: 'cnic', header: 'CNIC' },
            { key: 'phone', header: 'Phone' },
            { key: 'status', header: 'Status', render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge> },
            {
              key: 'actions',
              header: 'Actions',
              render: (r) => (
                <div className="flex items-center gap-1">
                  <Link to={`/admin/customers/${r.id}`} className="rounded p-1.5 text-text-muted hover:bg-black/[0.04] hover:text-ink" aria-label="View">
                    <Eye size={15} />
                  </Link>
                  <button className="rounded p-1.5 text-text-muted hover:bg-black/[0.04] hover:text-ink" aria-label="Edit" onClick={() => setEditTarget(r)}>
                    <Pencil size={15} />
                  </button>
                  <button
                    className="rounded p-1.5 text-text-muted hover:bg-danger-bg hover:text-danger"
                    aria-label="Deactivate"
                    onClick={() => setDeactivateTarget(r)}
                    disabled={r.status !== 'Active'}
                  >
                    <UserX size={15} />
                  </button>
                </div>
              ),
            },
          ]}
          data={pageItems}
          emptyLabel="No customers match your search"
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>

      <Modal open={formOpen || !!editTarget} onClose={() => { closeForm(); setEditTarget(null); }} title={editTarget ? 'Edit customer' : 'Add customer'} size="lg">
        <CustomerForm defaultValues={editTarget ? { fullName: editTarget.name, cnic: editTarget.cnic, phone: editTarget.phone, email: editTarget.email, city: editTarget.city, address: editTarget.address, gender: editTarget.gender, dob: editTarget.dateOfBirth, guardianName: editTarget.fatherOrGuardianName } : undefined} onSubmit={handleCreate} onCancel={() => { closeForm(); setEditTarget(null); }} submitting={submitting} />
      </Modal>

      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        title="Deactivate customer"
        description={`${deactivateTarget?.name} will lose access and their accounts will be flagged for review. This can be reversed later.`}
        confirmLabel="Deactivate"
        loading={submitting}
      />
    </div>
  );
}
