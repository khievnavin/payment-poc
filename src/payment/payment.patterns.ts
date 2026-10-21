// Message pattern names used by other microservices (e.g. order-service)
// to talk to this payment-service over the Redis transport.
export const PaymentPatterns = {
  CREATE: 'payment.create',
  FIND_ONE: 'payment.find_one',
  FIND_ALL: 'payment.find_all',
  /** Every payment of an order (e.g. an application number), newest first. */
  FIND_BY_ORDER: 'payment.find_by_order',
  REFUND: 'payment.refund',
  /** A payment received outside this service (bank transfer, cash), confirmed by an officer. */
  RECORD: 'payment.record',
  /** An officer confirmed a payment this service charged: who it was. */
  CONFIRM: 'payment.confirm',
} as const;
