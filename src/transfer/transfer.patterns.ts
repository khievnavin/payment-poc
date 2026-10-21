// Message pattern names for user-to-user transfers over the Redis transport.
export const TransferPatterns = {
  CREATE: 'transfer.create',
  FIND_ONE: 'transfer.find_one',
  FIND_ALL: 'transfer.find_all',
} as const;
