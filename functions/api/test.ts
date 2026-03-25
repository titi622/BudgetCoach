export interface Env {
  assets: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { results } = await context.env.assets
      .prepare(`SELECT * FROM tb_earning`)
      .all();

    return Response.json(results);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch tb_earning',
        detail: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};