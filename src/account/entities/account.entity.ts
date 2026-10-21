export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
}

export class Account {
  id: string;
  name: string;
  currency: string;
  balance: number;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}
