import { getEarnings, type EarningRow } from '../../src/lib/db/earning';
import { getDebts, type DebtRow } from '../../src/lib/db/debt';
import { getSavings, type SavingRow } from '../../src/lib/db/saving';
import { getInvestmentStocks, type InvestmentStockRow } from '../../src/lib/db/stock';
import { getInvestmentRealEstates, type InvestmentRealEstateRow } from '../../src/lib/db/realestate';
import { getConsumptions, type ConsumptionRow } from '../../src/lib/db/consumption';

export interface Env {
  assets: D1Database;
}

export interface TestQueryResponse {
  earnings: EarningRow[];
  debts: DebtRow[];
  savings: SavingRow[];
  investmentStocks: InvestmentStockRow[];
  investmentRealEstates: InvestmentRealEstateRow[];
  consumptions: ConsumptionRow[];
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const [
      earnings,
      debts,
      savings,
      investmentStocks,
      investmentRealEstates,
      consumptions,
    ] = await Promise.all([
      getEarnings(context.env),
      getDebts(context.env),
      getSavings(context.env),
      getInvestmentStocks(context.env),
      getInvestmentRealEstates(context.env),
      getConsumptions(context.env),
    ]);

    const response: TestQueryResponse = {
      earnings,
      debts,
      savings,
      investmentStocks,
      investmentRealEstates,
      consumptions,
    };

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch test query data',
        detail: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  }
};