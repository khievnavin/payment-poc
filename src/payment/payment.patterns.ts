// Message pattern names used by other microservices (e.g. order-service)
// to talk to this payment-service over the Redis transport.
export const PaymentPatterns = {
  CREATE: 'payment.create',
  FIND_ONE: 'payment.find_one',
  FIND_ALL: 'payment.find_all',
  REFUND: 'payment.refund',
} as const;
