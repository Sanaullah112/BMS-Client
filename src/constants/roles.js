export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  CUSTOMER: 'customer',
};

export const ROLE_HOME = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.EMPLOYEE]: '/employee/dashboard',
  [ROLES.CUSTOMER]: '/customer/dashboard',
};
