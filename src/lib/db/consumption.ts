export interface Env {
  assets: D1Database;
}

export interface ConsumptionRow {
  name: string;
  food: number;
  housing: number;
  communication: number;
  medical: number;
  transportation: number;
  fuel: number;
  car_insurance: number;
  ceremony_expense: number;
  shopping: number;
  childcare: number;
  entertainment: number;
  event: number;
  other: number;
  note: string;
  create_dt: string;
  modify_dt: string;
}

export async function getConsumptions(env: Env): Promise<ConsumptionRow[]> {
  const { results } = await env.assets
    .prepare(`SELECT * FROM tb_consumption`)
    .all<ConsumptionRow>();

  return results ?? [];
}