export interface Split {
  id: string;
  name: string;
  users: UserBalance[];
}

export interface CreateSplitDto {
  name: string;
}

export interface UserBalance {
  id: string;
  username: string;
  balance: number;
}

export interface Settlement {
  payerId: string;
  recipientId: string;
  amount: number;
}

interface SettlementBalance {
  id: string;
  balance: number;
}

export function calculateSettlements(
  balances: SettlementBalance[],
): Settlement[] {
  const remaining = balances
    .filter(({ balance }) => balance !== 0)
    .map(({ id, balance }) => ({ id, balance }));
  let best: Settlement[] | null = null;

  function search(current: SettlementBalance[], payments: Settlement[]) {
    const firstIndex = current.findIndex(({ balance }) => balance !== 0);
    if (firstIndex === -1) {
      if (best === null || payments.length < best.length) {
        best = payments;
      }
      return;
    }
    if (best !== null && payments.length >= best.length) {
      return;
    }

    const first = current[firstIndex];
    const triedBalances = new Set<number>();

    for (let index = firstIndex + 1; index < current.length; index += 1) {
      const other = current[index];
      if (
        first.balance * other.balance >= 0 ||
        triedBalances.has(other.balance)
      ) {
        continue;
      }
      triedBalances.add(other.balance);

      const amount = Math.min(Math.abs(first.balance), Math.abs(other.balance));
      const next = current.map((entry) => ({ ...entry }));
      next[firstIndex].balance += first.balance < 0 ? amount : -amount;
      next[index].balance += first.balance < 0 ? -amount : amount;

      const payment =
        first.balance < 0
          ? { payerId: first.id, recipientId: other.id, amount }
          : { payerId: other.id, recipientId: first.id, amount };
      search(next, [...payments, payment]);
    }
  }

  search(remaining, []);
  return best ?? [];
}
