import { loadSimulationSourceData } from "@/lib/simulation/sourceData";
import { buildStep1Details } from "@/lib/simulation/step1Detail";
import { buildStep2MonthlyRows } from "@/lib/simulation/step2Summary";

export interface Env {
  assets: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const source = await loadSimulationSourceData(context.env);

    const step1Details = buildStep1Details(
      source,
      2026,
      1,
      120,
    );

    const step2Rows = buildStep2MonthlyRows(step1Details);

    const escapeHtml = (value: unknown): string => {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    };

    const earningTypeSet = new Set<string>();
    for (const row of step2Rows) {
      for (const earningType of Object.keys(row.earningByType)) {
        earningTypeSet.add(earningType);
      }
    }

    const earningTypes = [...earningTypeSet].sort((a, b) => a.localeCompare(b));

    const thead = `
      <tr>
        <th>month</th>
        ${earningTypes.map((type) => `<th>${escapeHtml(type)}</th>`).join("")}
        <th>realestate</th>
        <th>savingMaturity</th>
        <th>otherIncome</th>
        <th>totalIncome</th>
        <th>debt</th>
        <th>saving</th>
        <th>investment</th>
        <th>consumption</th>
        <th>totalExpense</th>
        <th>netIncome</th>
      </tr>
    `;

    const tbody = step2Rows.map((row) => {
      const earningTypeCells = earningTypes.map((type) => {
        const amount = row.earningByType[type] ?? 0;
        return `<td class="number">${escapeHtml(amount.toLocaleString())}</td>`;
      }).join("");

      return `
        <tr>
          <td>${escapeHtml(row.month)}</td>
          ${earningTypeCells}
          <td class="number">${escapeHtml(row.realestate.toLocaleString())}</td>
          <td class="number">${escapeHtml(row.savingMaturity.toLocaleString())}</td>
          <td class="number">${escapeHtml(row.otherIncome.toLocaleString())}</td>
          <td class="number total-income">${escapeHtml(row.totalIncome.toLocaleString())}</td>
          <td class="number">${escapeHtml(row.debt.toLocaleString())}</td>
          <td class="number">${escapeHtml(row.saving.toLocaleString())}</td>
          <td class="number">${escapeHtml(row.investment.toLocaleString())}</td>
          <td class="number">${escapeHtml(row.consumption.toLocaleString())}</td>
          <td class="number total-expense">${escapeHtml(row.totalExpense.toLocaleString())}</td>
          <td class="number net-income">${escapeHtml(row.netIncome.toLocaleString())}</td>
        </tr>
      `;
    }).join("");

    const html = `
      <!doctype html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Step2 Summary Viewer</title>
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              font-family: Arial, sans-serif;
              background: #f7f7f8;
              color: #111827;
            }

            .container {
              max-width: 1800px;
              margin: 0 auto;
              padding: 24px;
            }

            h1 {
              margin: 0 0 8px;
              font-size: 28px;
            }

            .summary {
              margin-bottom: 20px;
              color: #4b5563;
              font-size: 14px;
            }

            .table-wrap {
              overflow-x: auto;
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 12px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
              white-space: nowrap;
            }

            th, td {
              border: 1px solid #e5e7eb;
              padding: 10px 12px;
              text-align: left;
            }

            th {
              background: #f3f4f6;
              position: sticky;
              top: 0;
              z-index: 1;
            }

            .number {
              text-align: right;
            }

            .total-income {
              font-weight: 700;
            }

            .total-expense {
              font-weight: 700;
            }

            .net-income {
              font-weight: 700;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Step2 Summary Viewer</h1>
            <div class="summary">
              시작: 2026-01 / 기간: 120개월 / 월 수: ${step2Rows.length}
            </div>

            <div class="table-wrap">
              <table>
                <thead>
                  ${thead}
                </thead>
                <tbody>
                  ${tbody}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "step2 view failed",
        detail: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  }

/**
* Step1DetailRow 데이터를 category 별로 그룹화하여 HTML 테이블로 렌더링
    type Step1Category =
    | "earning"
    | "saving"
    | "debt"
    | "investment"
    | "realestate"
    | "consumption";

    const categoryOrder: Step1Category[] = [
      "earning",
      "saving",
      "debt",
      "investment",
      "realestate",
      "consumption",
    ];

    const grouped = new Map<Step1Category, typeof step1Details>();

    for (const category of categoryOrder) {
      grouped.set(category, []);
    }

    for (const row of step1Details) {
      const list = grouped.get(row.category as Step1Category);
      if (list) {
        list.push(row);
      }
    }

    const escapeHtml = (value: unknown): string => {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    };

    const renderTable = (title: string, rows: typeof step1Details) => {
      if (rows.length === 0) {
        return `
          <section class="section">
            <h2>${escapeHtml(title)} <span class="count">(0)</span></h2>
            <div class="empty">데이터 없음</div>
          </section>
        `;
      }

      const tbody = rows
        .map(
          (row) => `
            <tr>
              <td>${escapeHtml(row.month)}</td>
              <td>${escapeHtml(row.category)}</td>
              <td>${escapeHtml(row.name)}</td>
              <td>${escapeHtml(row.type)}</td>
              <td>${escapeHtml(row.itemName)}</td>
              <td>${escapeHtml(row.flowType)}</td>
              <td class="number">${escapeHtml(row.amount.toLocaleString())}</td>
              <td>${escapeHtml(row.note ?? "")}</td>
            </tr>
          `,
        )
        .join("");

      return `
        <section class="section">
          <h2>${escapeHtml(title)} <span class="count">(${rows.length})</span></h2>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>month</th>
                  <th>category</th>
                  <th>name</th>
                  <th>type</th>
                  <th>itemName</th>
                  <th>flowType</th>
                  <th>amount</th>
                  <th>note</th>
                </tr>
              </thead>
              <tbody>
                ${tbody}
              </tbody>
            </table>
          </div>
        </section>
      `;
    };

    const sections = categoryOrder
      .map((category) => renderTable(category, grouped.get(category) ?? []))
      .join("");

    const html = `
      <!doctype html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Step1 Detail Viewer</title>
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              font-family: Arial, sans-serif;
              background: #f7f7f8;
              color: #111827;
            }

            .container {
              max-width: 1400px;
              margin: 0 auto;
              padding: 24px;
            }

            h1 {
              margin: 0 0 8px;
              font-size: 28px;
            }

            .summary {
              margin-bottom: 24px;
              color: #4b5563;
              font-size: 14px;
            }

            .section {
              margin-bottom: 32px;
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 16px;
            }

            .section h2 {
              margin: 0 0 12px;
              font-size: 20px;
            }

            .count {
              color: #6b7280;
              font-size: 16px;
              font-weight: normal;
            }

            .table-wrap {
              overflow-x: auto;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
              background: white;
            }

            th, td {
              border: 1px solid #e5e7eb;
              padding: 10px 12px;
              text-align: left;
              vertical-align: top;
              white-space: nowrap;
            }

            th {
              background: #f3f4f6;
              position: sticky;
              top: 0;
            }

            .number {
              text-align: right;
            }

            .empty {
              padding: 12px;
              color: #6b7280;
              background: #f9fafb;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Step1 Detail Viewer</h1>
            <div class="summary">
              시작: 2026-01 / 기간: 120개월 / 전체 이벤트 수: ${step1Details.length}
            </div>
            ${sections}
          </div>
        </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "step1 view failed",
        detail: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }
*/
};