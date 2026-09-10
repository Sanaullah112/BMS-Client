import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus, KeyRound, UserX, Pencil } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/tables/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import PreviewBanner from '../../components/common/PreviewBanner';
import { useToast } from '../../context/ToastContext';
import { listEmployees, createEmployee, updateEmployee, setEmployeeStatus, resetEmployeePassword } from '../../services/employeeService';

const ROLE_OPTIONS = [
  { value: 'employee', label: 'Teller' },
  { value: 'employee', label: 'Loan Officer' },
  { value: 'employee', label: 'Branch Manager' },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { push } = useToast();

  const refresh = async () => setEmployees((await listEmployees({ limit: 100 })).items);
  useEffect(() => { refresh().catch((err) => push(err.friendlyMessage || 'Could not load employees.', 'error')); }, []);
  useEffect(() => {
    if (editTarget) reset({ name: editTarget.name, email: editTarget.email, role: editTarget.role, password: '' });
    else if (formOpen) reset({ name: '', email: '', role: 'employee', password: '' });
  }, [editTarget, formOpen, reset]);

  const handleCreate = async (values) => {
    setSubmitting(true);
    try {
      if (editTarget) await updateEmployee(editTarget.id, { name: values.name, role: 'employee' });
      else await createEmployee({ ...values, role: 'employee', password: values.password });
      await refresh();
      push(editTarget ? 'Employee updated successfully.' : 'Employee added successfully.', 'success');
      setEditTarget(null);
      setFormOpen(false);
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    setSubmitting(true);
    try {
      const response = await resetEmployeePassword(resetTarget.id);
      push(`A temporary password has been sent to ${resetTarget.email}: ${response.temporaryPassword || response.data?.temporaryPassword || ''}`, 'success');
      setResetTarget(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    setSubmitting(true);
    try {
      await setEmployeeStatus(deactivateTarget.id, 'Inactive');
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
          <h1 className="text-xl font-semibold text-ink">Employees</h1>
          <p className="text-sm text-text-muted">{employees.length} staff members</p>
        </div>
        <Button variant="brass" icon={UserPlus} onClick={() => setFormOpen(true)}>Add employee</Button>
      </div>

      <Card noPadding>
        <Table
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'name', header: 'Name' },
            { key: 'role', header: 'Role' },
            { key: 'email', header: 'Email' },
            { key: 'status', header: 'Status', render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge> },
            {
              key: 'actions',
              header: 'Actions',
              render: (r) => (
                <div className="flex items-center gap-1">
                  <button className="rounded p-1.5 text-text-muted hover:bg-black/[0.04] hover:text-ink" aria-label="Edit" onClick={() => setEditTarget(r)}><Pencil size={15} /></button>
                  <button className="rounded p-1.5 text-text-muted hover:bg-black/[0.04] hover:text-ink" aria-label="Reset password" onClick={() => setResetTarget(r)}><KeyRound size={15} /></button>
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
          data={employees}
        />
      </Card>

      <Modal open={formOpen || !!editTarget} onClose={() => { setFormOpen(false); setEditTarget(null); }} title={editTarget ? 'Edit employee' : 'Add employee'}>
        <form onSubmit={handleSubmit(handleCreate)} className="flex flex-col gap-4" noValidate>
          <Input label="Full name" required error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
          <Input label="Email" type="email" required error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
          {!editTarget && <Input label="Password" type="password" required error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })} />}
          <Select label="Role" required options={ROLE_OPTIONS} error={errors.role?.message} {...register('role', { required: 'Select a role' })} />
          <div className="mt-2 flex justify-end gap-2 border-t border-line pt-4">
            <Button variant="ghost" type="button" onClick={() => setFormOpen(false)} disabled={submitting}>Cancel</Button>
            <Button variant="brass" type="submit" loading={submitting}>Save employee</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!resetTarget}
        onClose={() => setResetTarget(null)}
        onConfirm={handleResetPassword}
        title="Reset password"
        description={`A temporary password will be issued to ${resetTarget?.name} and their current password revoked.`}
        confirmLabel="Reset password"
        variant="brass"
        loading={submitting}
      />

      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        title="Deactivate employee"
        description={`${deactivateTarget?.name} will immediately lose access to the system.`}
        confirmLabel="Deactivate"
        loading={submitting}
      />
    </div>
  );
}
