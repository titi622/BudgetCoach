export interface Env {
  assets: D1Database;
}

export interface InvestmentStockRow {
  name: string;
  institution: string;
  account_type: string;
  product_name: string;
  principal_amount: number;
  valuation_amount: number;
  create_dt: string;
  modify_dt: string;
}

export async function getInvestmentStocks(env: Env): Promise<InvestmentStockRow[]> {
  const { results } = await env.assets
    .prepare(`SELECT * FROM tb_investment_stock`)
    .all<InvestmentStockRow>();

  return results ?? [];
}