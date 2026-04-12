// src/lib/simulation/types.ts

import type { EarningRow } from "../db/earning";
import type { SavingRow } from "../db/saving";
import type { DebtRow } from "../db/debt";
import type { InvestmentStockRow } from "../db/stock";
import type { InvestmentRealEstateRow } from "../db/realestate";
import type { ConsumptionRow } from "../db/consumption";

/**
 * 시뮬레이션 입력 데이터 (DB에서 가져온 원본 묶음)
 */
export interface SimulationSourceData {
  earnings: EarningRow[];
  savings: SavingRow[];
  debts: DebtRow[];
  investmentStocks: InvestmentStockRow[];
  investmentRealEstates: InvestmentRealEstateRow[];
  consumptions: ConsumptionRow[];
}

/**
 * * Step1 - 소득 상세 계산 결과 행 타입
*/
export type Step1Category =
  | "earning"
  | "saving"
  | "debt"
  | "stock"
  | "realestate"
  | "consumption";

export interface Step1DetailRow {
  month: string; // YYYY-MM
  category: Step1Category;
  name: string;
  type: string;
  itemName: string;
  flowType: "income" | "expense";
  amount: number;
  note?: string;
}

/**
 * Step2 - 월별 수입/지출 계산 결과 행 타입
 * 
 */
export interface Step2MonthlyBase {
  month: string;

  earningByType: Record<string, number>;
  realestate: number;
  savingMaturity: number;
  otherIncome: number;

  debt: number;
  saving: number;
  investment: number;
  consumption: number;
}

export interface Step2MonthlyRow extends Step2MonthlyBase {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
}

export type Step2MonthlyAccumulator = Step2MonthlyBase;


/**
 * 공통 Month 타입 (YYYY-MM)
 */
export type MonthString = string;