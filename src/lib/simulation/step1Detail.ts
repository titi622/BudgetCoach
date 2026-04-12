// src/lib/simulation/step1Detail.ts

import type { EarningRow } from "../db/earning";
import type { SavingRow } from "../db/saving";
import type { DebtRow } from "../db/debt";
import type { InvestmentRealEstateRow } from "../db/realestate";
import type { ConsumptionRow } from "../db/consumption";
import type { SimulationSourceData, Step1DetailRow } from "./types";

/**
 * YYYY-MM 문자열 생성
 */
function formatMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

/**
 * YYYY-MM-DD 문자열을 Date로 변환
 */
function parseDate(dateText?: string | null): Date | null {
  if (!dateText) return null;
  const date = new Date(dateText);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * 날짜에서 YYYY-MM 추출
 */
function toMonthString(dateText?: string | null): string | null {
  if (!dateText) return null;
  return dateText.slice(0, 7);
}

/**
 * 시작 연/월 기준으로 index개월 뒤 연/월 계산
 */
function getYearMonth(startYear: number, startMonth: number, index: number) {
  const totalMonthIndex = startMonth - 1 + index;
  const year = startYear + Math.floor(totalMonthIndex / 12);
  const month = (totalMonthIndex % 12) + 1;

  return { year, month };
}

/**
 * 두 날짜 사이의 개월 수 차이
 * 예:
 * 2021-03 ~ 2021-03 => 0
 * 2021-03 ~ 2021-04 => 1
 */
function getMonthDiff(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
}

/**
 * date가 포함된 월이 시뮬레이션 조회 구간에 포함되는지 확인
 */
function isWithinSimulationWindow(
  date: Date,
  simulationStart: Date,
  simulationEnd: Date,
): boolean {
  const targetMonth = formatMonth(date.getFullYear(), date.getMonth() + 1);
  const startMonth = formatMonth(
    simulationStart.getFullYear(),
    simulationStart.getMonth() + 1,
  );
  const endMonth = formatMonth(
    simulationEnd.getFullYear(),
    simulationEnd.getMonth() + 1,
  );

  return targetMonth >= startMonth && targetMonth <= endMonth;
}

/**
 * 시뮬레이션 종료 월의 마지막 날짜
 */
function getSimulationEndDate(
  startYear: number,
  startMonth: number,
  months: number,
): Date {
  const { year, month } = getYearMonth(startYear, startMonth, months - 1);
  return new Date(year, month, 0);
}

/**
 * 소수점 반올림
 */
function roundAmount(value: number): number {
  return Math.round(value);
}

/**
 * Step1 - 소득 상세 이벤트 생성
 *
 * 규칙
 * - type과 무관하게 동일 계산
 * - 해당 연도의 월 소득 = af_tax / 12
 * - 해가 넘어가면 growth_rate를 연 단위로 반영
 * - 월 소득은 반올림
 */
export function buildEarningStep1Details(
  earnings: EarningRow[],
  startYear: number,
  startMonth: number,
  months: number,
): Step1DetailRow[] {
  const results: Step1DetailRow[] = [];

  for (const earning of earnings) {
    const baseAnnualIncome = Number(earning.af_tax ?? 0);
    const growthRate = Number(earning.growth_rate ?? 0);

    for (let i = 0; i < months; i++) {
      const { year, month } = getYearMonth(startYear, startMonth, i);
      const yearOffset = year - startYear;

      const annualIncome =
        baseAnnualIncome * Math.pow(1 + growthRate, yearOffset);

      const monthlyIncome = roundAmount(annualIncome / 12);

      results.push({
        month: formatMonth(year, month),
        category: "earning",
        name: earning.name,
        type: earning.type,
        itemName: earning.type,
        flowType: "income",
        amount: monthlyIncome,
        note: "월 소득 = 연 실수령액 / 12, 연 단위 임금상승률 반영",
      });
    }
  }

  return results;
}

/**
 * Step1 - 저축 상세 이벤트 생성
 *
 * 규칙
 * - type과 무관하게 동일 계산
 * - 매월 payment 금액 발생
 * - flowType은 income으로 처리
 * - end_date가 속한 월까지만 발생
 * - end_date가 없거나 9999-12-31이면 120개월 전체 발생
 */
export function buildSavingStep1Details(
  savings: SavingRow[],
  startYear: number,
  startMonth: number,
  months: number,
): Step1DetailRow[] {
  const results: Step1DetailRow[] = [];

  for (const saving of savings) {
    const payment = roundAmount(Number(saving.payment ?? 0));
    const endMonth = !saving.end_date || saving.end_date.startsWith("9999-12-31")
      ? null
      : toMonthString(saving.end_date);

    for (let i = 0; i < months; i++) {
      const { year, month } = getYearMonth(startYear, startMonth, i);
      const currentMonth = formatMonth(year, month);

      if (endMonth && currentMonth > endMonth) {
        continue;
      }

      results.push({
        month: currentMonth,
        category: "saving",
        name: saving.name,
        type: saving.type ?? "",
        itemName: saving.product_name ?? saving.type ?? "saving",
        flowType: "expense",
        amount: payment,
        note: "saving monthly payment until end_date month",
      });
    }
  }

  return results;
}

/**
 * Step1 - 부채 상세 이벤트 생성
 *
 * 기준
 * - remaining은 사용하지 않음
 * - principal, interest, start_date, end_date, plan 기준으로
 *   원래 계약 스케줄 전체를 생성한 뒤
 *   시뮬레이션 조회 구간에 포함되는 월만 반환
 *
 * 지원 plan
 * - 원금균등
 * - 원리금균등
 * - 만기상환
 */
export function buildDebtStep1Details(
  debts: DebtRow[],
  startYear: number,
  startMonth: number,
  months: number,
): Step1DetailRow[] {
  const results: Step1DetailRow[] = [];

  const simulationStart = new Date(startYear, startMonth - 1, 1);
  const simulationEnd = getSimulationEndDate(startYear, startMonth, months);

  for (const debt of debts) {
    const principal = Number(debt.principal ?? 0);
    const annualRate = Number(debt.interest ?? 0);
    const monthlyRate = annualRate / 12;

    const startDate = parseDate(debt.start_date);
    const endDate = parseDate(debt.end_date);

    if (!startDate || !endDate) {
      continue;
    }

    const totalMonths = getMonthDiff(startDate, endDate) + 1;
    if (totalMonths <= 0 || principal <= 0) {
      continue;
    }

    const plan = debt.plan ?? "";
    const itemName = debt.product_name ?? debt.type ?? "debt";

    if (plan === "원금균등") {
      const monthlyPrincipal = principal / totalMonths;
      let balance = principal;

      for (let installmentIndex = 0; installmentIndex < totalMonths; installmentIndex++) {
        const paymentDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + installmentIndex,
          1,
        );

        const interestAmount = balance * monthlyRate;
        let principalAmount = monthlyPrincipal;

        if (installmentIndex === totalMonths - 1) {
          principalAmount = balance;
        }

        const totalPayment = roundAmount(principalAmount + interestAmount);

        if (isWithinSimulationWindow(paymentDate, simulationStart, simulationEnd)) {
          results.push({
            month: formatMonth(
              paymentDate.getFullYear(),
              paymentDate.getMonth() + 1,
            ),
            category: "debt",
            name: debt.name,
            type: debt.type ?? "",
            itemName,
            flowType: "expense",
            amount: totalPayment,
            note: `debt payment (${plan})`,
          });
        }

        balance -= principalAmount;
        if (balance < 0) balance = 0;
      }
    } else if (plan === "원리금균등") {
      let monthlyPayment = 0;

      if (monthlyRate === 0) {
        monthlyPayment = principal / totalMonths;
      } else {
        const factor = Math.pow(1 + monthlyRate, totalMonths);
        monthlyPayment =
          principal * ((monthlyRate * factor) / (factor - 1));
      }

      let balance = principal;

      for (let installmentIndex = 0; installmentIndex < totalMonths; installmentIndex++) {
        const paymentDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + installmentIndex,
          1,
        );

        const interestAmount = balance * monthlyRate;
        let principalAmount = monthlyPayment - interestAmount;

        if (installmentIndex === totalMonths - 1) {
          principalAmount = balance;
        }

        const totalPayment = roundAmount(principalAmount + interestAmount);

        if (isWithinSimulationWindow(paymentDate, simulationStart, simulationEnd)) {
          results.push({
            month: formatMonth(
              paymentDate.getFullYear(),
              paymentDate.getMonth() + 1,
            ),
            category: "debt",
            name: debt.name,
            type: debt.type ?? "",
            itemName,
            flowType: "expense",
            amount: totalPayment,
            note: `debt payment (${plan})`,
          });
        }

        balance -= principalAmount;
        if (balance < 0) balance = 0;
      }
    } else if (plan === "만기상환") {
      for (let installmentIndex = 0; installmentIndex < totalMonths; installmentIndex++) {
        const paymentDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + installmentIndex,
          1,
        );

        const interestAmount = principal * monthlyRate;
        const isLastMonth = installmentIndex === totalMonths - 1;

        const totalPayment = roundAmount(
          isLastMonth ? interestAmount + principal : interestAmount,
        );

        if (isWithinSimulationWindow(paymentDate, simulationStart, simulationEnd)) {
          results.push({
            month: formatMonth(
              paymentDate.getFullYear(),
              paymentDate.getMonth() + 1,
            ),
            category: "debt",
            name: debt.name,
            type: debt.type ?? "",
            itemName,
            flowType: "expense",
            amount: totalPayment,
            note: `debt payment (${plan})`,
          });
        }
      }
    }
  }

  return results;
}

/**
 * Step1 - 부동산 상세 이벤트 생성
 *
 * 규칙
 * - tb_investmonth 의 monthly_rent 를 매월 income 으로 사용
 * - 만기일은 고려하지 않음
 * - months 기간 동안 매월 동일 금액 발생
 */
export function buildRealestateStep1Details(
  realestates: InvestmentRealEstateRow[],
  startYear: number,
  startMonth: number,
  months: number,
): Step1DetailRow[] {
  const results: Step1DetailRow[] = [];

  for (const realestate of realestates) {
    const monthlyRent = roundAmount(Number(realestate.monthly_rent ?? 0));


    if (monthlyRent <= 0) {
      continue;
    }

    const name = realestate.name;
    const type = "monthly_rent";
    const itemName = `${realestate.apt_name} ${realestate.dong}동 ${realestate.ho}호`;


    for (let i = 0; i < months; i++) {
      const { year, month } = getYearMonth(startYear, startMonth, i);

      results.push({
        month: formatMonth(year, month),
        category: "realestate",
        name,
        type,
        itemName,
        flowType: "income",
        amount: monthlyRent,
        note: "realestate monthly rent",
      });
    }
  }

  return results;
}

export function buildConsumptionStep1Details(
  consumptions: ConsumptionRow[],
  startYear: number,
  startMonth: number,
  months: number,
): Step1DetailRow[] {
  const results: Step1DetailRow[] = [];

  const expenseFields: Array<{
    key: keyof Pick<
      ConsumptionRow,
      | "food"
      | "housing"
      | "communication"
      | "medical"
      | "transportation"
      | "fuel"
      | "car_insurance"
      | "ceremony_expense"
      | "shopping"
      | "childcare"
      | "entertainment"
      | "event"
      | "other"
    >;
    label: string;
  }> = [
    { key: "food", label: "food" },
    { key: "housing", label: "housing" },
    { key: "communication", label: "communication" },
    { key: "medical", label: "medical" },
    { key: "transportation", label: "transportation" },
    { key: "fuel", label: "fuel" },
    { key: "car_insurance", label: "car_insurance" },
    { key: "ceremony_expense", label: "ceremony_expense" },
    { key: "shopping", label: "shopping" },
    { key: "childcare", label: "childcare" },
    { key: "entertainment", label: "entertainment" },
    { key: "event", label: "event" },
    { key: "other", label: "other" },
  ];

  for (const consumption of consumptions) {
    for (const field of expenseFields) {
      const amount = roundAmount(Number(consumption[field.key] ?? 0));

      if (amount <= 0) {
        continue;
      }

      for (let i = 0; i < months; i++) {
        const { year, month } = getYearMonth(startYear, startMonth, i);

        results.push({
          month: formatMonth(year, month),
          category: "consumption",
          name: consumption.name,
          type: field.label,
          itemName: field.label,
          flowType: "expense",
          amount,
          note: consumption.note ?? "",
        });
      }
    }
  }

  return results;
}


/**
 * Step1 전체 상세 이벤트 생성
 *
 * 현재는 소득 + 저축 + 부채 + 부동산 반영
 * 이후 투자, 소비 로직을 같은 배열에 이어 붙이는 방식으로 확장
 */
export function buildStep1Details(
  sourceData: SimulationSourceData,
  startYear: number,
  startMonth: number,
  months: number,
): Step1DetailRow[] {
  const earningDetails = buildEarningStep1Details(
    sourceData.earnings,
    startYear,
    startMonth,
    months,
  );

  const savingDetails = buildSavingStep1Details(
    sourceData.savings,
    startYear,
    startMonth,
    months,
  );

  const debtDetails = buildDebtStep1Details(
    sourceData.debts,
    startYear,
    startMonth,
    months,
  );


const realestateDetails = buildRealestateStep1Details(
  sourceData.investmentRealEstates,
  startYear,
  startMonth,
  months,
);

const consumptionDetails = buildConsumptionStep1Details(
  sourceData.consumptions,
  startYear,
  startMonth,
  months,
);
  return [
    ...earningDetails,
    ...savingDetails,
    ...debtDetails,
    ...realestateDetails,
    ...consumptionDetails,
  ];
}