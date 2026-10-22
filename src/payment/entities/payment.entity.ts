import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

/** Whether an officer has confirmed the money arrived. */
export enum ConfirmationStatus {
  WAITING_CONFIRMATION = 'WAITING_CONFIRMATION',
  CONFIRMED = 'CONFIRMED',
}

/** Who pays or who receives a payment. */
export interface PaymentParty {
  /** The caller's id for them, e.g. a username or an office code. */
  id: string;
  name: string;
  /** Receiving side: the department / office that collects it. */
  department?: string;
}

/** numeric(12,2) comes back from PostgreSQL as text: read it as a number. */
const money = {
  to: (v: number) => v,
  from: (v: string | null) => (v === null ? null : Number(v)),
};

@Entity('payments')
export class Payment {
  @PrimaryColumn('uuid')
  id: string;

  /** The caller's order, e.g. an application number (TK-2026-0040). */
  @Index()
  @Column()
  orderId: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, transformer: money })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column()
  method: string;

  @Column({ type: 'varchar', length: 20 })
  status: PaymentStatus;

  /** Who pays (e.g. the citizen). */
  @Column({ type: 'jsonb', nullable: true })
  payer?: PaymentParty;

  /** Who receives the money (e.g. the province office). */
  @Column({ type: 'jsonb', nullable: true })
  payee?: PaymentParty;

  /** What it is for (e.g. the government service applied for). */
  @Column({ type: 'varchar', nullable: true })
  description?: string;

  /** The receiving bank (e.g. the province's bank from its website); null if not given. */
  @Column({ type: 'varchar', nullable: true })
  bankName?: string | null;

  /** Transaction reference: a UUID made by this service, or the receipt number an officer recorded. */
  @Column({ type: 'varchar', nullable: true })
  reference?: string;

  /** WAITING_CONFIRMATION until an officer confirms it (online payments start there). */
  @Column({
    type: 'varchar',
    length: 30,
    default: ConfirmationStatus.WAITING_CONFIRMATION,
  })
  confirmationStatus: ConfirmationStatus;

  /** The officer who confirmed the money arrived; null while waiting. */
  @Column({ type: 'jsonb', nullable: true })
  confirmedBy?: PaymentParty | null;

  @Column({ type: 'timestamptz', nullable: true })
  confirmedAt?: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
