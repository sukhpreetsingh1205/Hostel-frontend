export const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  WARDEN: 'warden',
  STUDENT: 'student',
});

export const USER_ROLE_LIST = Object.freeze([USER_ROLES.ADMIN, USER_ROLES.WARDEN, USER_ROLES.STUDENT]);

export const FEE_STATUS = Object.freeze({
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
  PARTIAL: 'partial',
});

export const COMPLAINT_STATUS = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
});

export const LEAVE_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
});
