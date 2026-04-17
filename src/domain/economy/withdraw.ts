/**
 * Withdrawal logic — pollen → ДаРаи token (NEAR).
 *
 * Rules:
 * - Minimum withdrawal: 500 pollen
 * - Tax: 0% initially (may add progressive later)
 * - Anti-bot: must have meaningful activity in last 7 days
 * - Only available with active account prокачка
 */

const MIN_WITHDRAW = 500;
const ACTIVITY_WINDOW_MS = 7 * 24 * 3600_000; // 7 days

export interface WithdrawCheck {
  canWithdraw: boolean;
  reason?: string;
  netAmount?: number;
  tax?: number;
}

export function checkWithdrawal(
  pollen: number,
  amount: number,
  lastActivity: number,
  now: number,
): WithdrawCheck {
  if (amount < MIN_WITHDRAW) {
    return { canWithdraw: false, reason: `Minimum withdrawal: ${MIN_WITHDRAW} pollen` };
  }

  if (pollen < amount) {
    return { canWithdraw: false, reason: "Insufficient pollen balance" };
  }

  const daysSinceActivity = (now - lastActivity) / (24 * 3600_000);
  if (now - lastActivity > ACTIVITY_WINDOW_MS) {
    return {
      canWithdraw: false,
      reason: `Must have activity in last 7 days (last: ${Math.floor(daysSinceActivity)}d ago)`,
    };
  }

  // 0% tax for now
  const tax = 0;
  const netAmount = amount - tax;

  return { canWithdraw: true, netAmount, tax };
}

export { MIN_WITHDRAW, ACTIVITY_WINDOW_MS };
