import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import {
  ConfirmationStatus,
  Payment,
  PaymentStatus,
} from './entities/payment.entity';
import { PaymentService } from './payment.service';

/** Stands in for the PostgreSQL table: just what the service uses. */
function memoryRepository(): Repository<Payment> {
  const rows = new Map<string, Payment>();
  const newestFirst = (list: Payment[]) =>
    list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const fake = {
    save: (p: Payment) => {
      p.updatedAt = new Date();
      rows.set(p.id, p);
      return Promise.resolve(p);
    },
    findOneBy: ({ id }: { id: string }) =>
      Promise.resolve(rows.get(id) ?? null),
    find: (options?: { where?: { orderId?: string } }) =>
      Promise.resolve(
        newestFirst(
          [...rows.values()].filter(
            (p) =>
              !options?.where?.orderId || p.orderId === options.where.orderId,
          ),
        ),
      ),
  };
  return fake as unknown as Repository<Payment>;
}

describe('PaymentService', () => {
  let payments: PaymentService;

  beforeEach(() => {
    payments = new PaymentService(memoryRepository());
  });

  const charge = (orderId: string) =>
    payments.create({
      orderId,
      amount: 10,
      currency: 'USD',
      method: 'online',
      payer: { id: 'k.navin', name: 'Khiev Navin' },
      payee: { id: 'TK', name: 'Takeo Provincial Administration' },
      description: 'Birth Certificate',
    });

  it('looks a payment up by its id', async () => {
    const created = await charge('TK-2026-0001');
    const found = await payments.findOne(created.id);
    expect(found).toMatchObject({
      id: created.id,
      orderId: 'TK-2026-0001',
      status: PaymentStatus.COMPLETED,
      payer: { id: 'k.navin' },
      confirmationStatus: ConfirmationStatus.WAITING_CONFIRMATION,
      confirmedBy: null, // nobody confirmed it yet
    });
  });

  it('answers 404 for an unknown id', async () => {
    await expect(payments.findOne('nope')).rejects.toThrow(NotFoundException);
    await expect(
      payments.findOne('8693159c-6c9b-448a-8f36-f6b68f55335b'),
    ).rejects.toThrow(NotFoundException);
  });

  it("looks up an order's payments, newest first", async () => {
    const first = await charge('TK-2026-0002');
    await new Promise((r) => setTimeout(r, 2));
    const second = await charge('TK-2026-0002');
    await charge('TK-2026-0003');
    const found = await payments.findByOrder('TK-2026-0002');
    expect(found.map((p) => p.id)).toEqual([second.id, first.id]);
    expect(await payments.findByOrder('TK-2026-9999')).toEqual([]);
  });

  it('records an officer-confirmed payment and notes who confirmed an online one', async () => {
    const cash = await payments.record({
      orderId: 'TK-2026-0004',
      amount: 5,
      currency: 'USD',
      method: 'cash',
      reference: 'R-0001',
      confirmedBy: { id: 'takeo-dep1', name: 'takeo-staff' },
    });
    expect(cash).toMatchObject({
      status: PaymentStatus.COMPLETED,
      reference: 'R-0001',
      confirmedBy: { id: 'takeo-dep1' },
    });

    const online = await charge('TK-2026-0005');
    const confirmed = await payments.confirm(online.id, {
      id: 'takeo-dep1',
      name: 'takeo-staff',
    });
    expect(confirmed.confirmationStatus).toBe(ConfirmationStatus.CONFIRMED);
    expect(confirmed.confirmedBy).toEqual({
      id: 'takeo-dep1',
      name: 'takeo-staff',
    });
  });
});
