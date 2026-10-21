// Message pattern names for account operations over the Redis transport.
export const AccountPatterns = {
  CREATE: 'account.create',
  FIND_ONE: 'account.find_one',
  FIND_ALL: 'account.find_all',
  DEPOSIT: 'account.deposit',
  UPDATE_STATUS: 'account.update_status',
} as const;
