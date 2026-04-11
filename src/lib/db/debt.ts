export interface Env {
  assets: D1Database;
}

export interface DebtRow {
  name: string;
  type: string;
  institution: string;
  product_name: string;
  principal: number;
  remaning: number;
  interest: number;
  start_date: string;
  end_date: string;
  period: number;
  plan: string;
  create_dt: string;
  modify_dt: string;
}

export async function getDebts(env: Env): Promise<DebtRow[]> {
  const { results } = await env.assets
    .prepare(`SELECT * FROM tb_debt`)
    .all<DebtRow>();

  return results ?? [];
}