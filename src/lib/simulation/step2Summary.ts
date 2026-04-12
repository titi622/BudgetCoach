import type {
  Step1DetailRow,
  Step2MonthlyAccumulator,
  Step2MonthlyRow,
} from "./types";

function createStep2Accumulator(month: string): Step2MonthlyAccumulator {
  return {
    month,
    earningByType: {},
    realestate: 0,
    savingMaturity: 0,
    otherIncome: 0,
    debt: 0,
    saving: 0,
    investment: 0,
    consumption: 0,
  };
}

/* Step1DetailRow 배열을 받아서 각 항목별 합계를 산출 */
export function buildStep2MonthlyAccumulators(
  step1Details: Step1DetailRow[],
): Step2MonthlyAccumulator[] {
  const monthMap = new Map<string, Step2MonthlyAccumulator>();

  for (const row of step1Details) {
    let acc = monthMap.get(row.month);

    if (!acc) {
      acc = createStep2Accumulator(row.month);
      monthMap.set(row.month, acc);
    }

    if (row.category === "earning" && row.flowType === "income") {
      const earningType = row.type || "unknown";
      acc.earningByType[earningType] =
        (acc.earningByType[earningType] ?? 0) + row.amount;
      continue;
    }

    if (row.category === "realestate" && row.flowType === "income") {
      acc.realestate += row.amount;
      continue;
    }

    if (row.category === "debt" && row.flowType === "expense") {
      acc.debt += row.amount;
      continue;
    }

    if (row.category === "saving" && row.flowType === "expense") {
      acc.saving += row.amount;
      continue;
    }

    if (row.category === "consumption" && row.flowType === "expense") {
      acc.consumption += row.amount;
      continue;
    }
  }

  return [...monthMap.values()].sort((a, b) => a.month.localeCompare(b.month));
}

/* accumulators를 받아서 월별 총수입, 총지출, 순수입을 계산하여 반환 */
export function buildStep2MonthlyRows(
  step1Details: Step1DetailRow[],
): Step2MonthlyRow[] {
  const accumulators = buildStep2MonthlyAccumulators(step1Details);
  // earning은 종류가 많아서 accumulator 에서 각각 계산된 내용을 다 합친다
  return accumulators.map((acc) => {
    const earningTotal = Object.values(acc.earningByType).reduce(
      (sum, value) => sum + value,
      0,
    );

    const totalIncome =
      earningTotal +
      acc.realestate +
      acc.savingMaturity +
      acc.otherIncome;

    const totalExpense =
      acc.debt +
      acc.saving +
      acc.investment +
      acc.consumption;

    const netIncome = totalIncome - totalExpense;

    return {
      month: acc.month,
      earningByType: acc.earningByType,
      realestate: acc.realestate,
      savingMaturity: acc.savingMaturity,
      otherIncome: acc.otherIncome,
      totalIncome,
      debt: acc.debt,
      saving: acc.saving,
      investment: acc.investment,
      consumption: acc.consumption,
      totalExpense,
      netIncome,
    };
  });
}