export interface Env {
  assets: D1Database;
}

export interface InvestmentRealEstateRow {
  name: string;
  address: string;
  apt_name: string;
  dong: number;
  ho: number;
  tenant: string;
  deposit_amount: number;
  monthly_rent: number;
  start_date: string;
  end_date: string;
  create_dt: string;
  modify_dt: string;
}

export async function getInvestmentRealEstates(env: Env): Promise<InvestmentRealEstateRow[]> {
  const { results } = await env.assets
    .prepare(`SELECT * FROM tb_investment_realestate`)
    .all<InvestmentRealEstateRow>();

  return results ?? [];
}