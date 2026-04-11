export interface Env {
  assets: D1Database;
}

export interface EarningRow {
  name: string;
  type: string;
  bf_tax: number;
  af_tax: number;
  growth_rate: number;
  create_dt: string;
  modify_dt: string;
}

export async function getEarnings(env: Env): Promise<EarningRow[]> {
  const { results } = await env.assets
    .prepare(`SELECT * FROM tb_earning`)
    .all<EarningRow>();

  return results ?? [];
}