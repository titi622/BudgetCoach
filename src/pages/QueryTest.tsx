import { useEffect, useState } from 'react';

type EarningRow = {
  name: string;
  type: string;
  bf_tax: number;
  af_tax: number;
  growth_rate: number;
  create_dt: string;
  modify_dt: string;
};

type DebtRow = {
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
};

type SavingRow = {
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
};

type InvestmentStockRow = {
  name: string;
  institution: string;
  account_type: string;
  product_name: string;
  principal_amount: number;
  valuation_amount: number;
  create_dt: string;
  modify_dt: string;
};

type InvestmentRealEstateRow = {
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
};

type ConsumptionRow = {
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
};

type TestQueryResponse = {
  earnings: EarningRow[];
  debts: DebtRow[];
  savings: SavingRow[];
  investmentStocks: InvestmentStockRow[];
  investmentRealEstates: InvestmentRealEstateRow[];
  consumptions: ConsumptionRow[];
};

function DataTable({
  title,
  data,
}: {
  title: string;
  data: Record<string, unknown>[];
}) {
  if (!data || data.length === 0) {
    return (
      <div style={{ marginBottom: '40px' }}>
        <h2>{title}</h2>
        <p>데이터 없음</p>
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div style={{ marginBottom: '40px' }}>
      <h2>{title}</h2>
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            minWidth: '900px',
          }}
        >
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    backgroundColor: '#f3f3f3',
                    textAlign: 'left',
                  }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td
                    key={column}
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                    }}
                  >
                    {String(row[column] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function QueryTest() {
  const [data, setData] = useState<TestQueryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/test');

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result: TestQueryResponse = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  if (!data) {
    return <div>데이터 없음</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>DB 조회 테스트</h1>

      <DataTable title="소득(tb_earning)" data={data.earnings} />
      <DataTable title="부채(tb_dept)" data={data.debts} />
      <DataTable title="저축(tb_saving)" data={data.savings} />
      <DataTable title="주식투자(tb_investment_stock)" data={data.investmentStocks} />
      <DataTable title="부동산투자(tb_investment_realestate)" data={data.investmentRealEstates} />
      <DataTable title="소비(tb_consumption)" data={data.consumptions} />
    </div>
  );
}



// export default function QueryTest() {
//   return <h1>QueryTest 페이지 진입 성공</h1>;
// }