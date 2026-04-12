// src/lib/simulation/sourceData.ts

import type { Env } from "../db/earning"; // Env 타입 재사용
import { getEarnings } from "../db/earning";
import { getSavings } from "../db/saving";
import { getDebts } from "../db/debt";
import { getInvestmentStocks } from "../db/stock";
import { getInvestmentRealEstates } from "../db/realestate";
import { getConsumptions } from "../db/consumption";

import type { SimulationSourceData } from "./types";

/**
 * 시뮬레이션에 필요한 모든 원본 데이터를 로딩
 */
export async function loadSimulationSourceData(env: Env): Promise<SimulationSourceData> {
  const [
    earnings,
    savings,
    debts,
    investmentStocks,
    investmentRealEstates,
    consumptions,
  ] = await Promise.all([
    getEarnings(env),
    getSavings(env),
    getDebts(env),
    getInvestmentStocks(env),
    getInvestmentRealEstates(env),
    getConsumptions(env),
  ]);

  return {
    earnings,
    savings,
    debts,
    investmentStocks,
    investmentRealEstates,
    consumptions,
  };
}