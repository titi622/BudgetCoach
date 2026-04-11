export interface Env {
  assets: D1Database;
}

export interface SavingRow {
  name: string;
  type: string;
  institution: string;
  product_name: string;
  total: number;
  payment: number;
  interest: number;
  start_date: string;
  end_date: string;
  received_year: string;
  create_dt: string;
  modify_dt: string;
}

export async function getSavings(env: Env): Promise<SavingRow[]> {
  const { results } = await env.assets
    .prepare(`SELECT * FROM tb_saving`)
    .all<SavingRow>();

  return results ?? [];
}