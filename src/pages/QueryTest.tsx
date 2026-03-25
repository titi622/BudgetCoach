import { useEffect, useState } from 'react';

type Row = Record<string, unknown>;

export default function QueryTest() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/test');
        if (!res.ok) throw new Error('조회 실패');
        const data = (await res.json()) as Row[];
        setRows(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : '에러 발생');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;
  if (rows.length === 0) return <div>데이터 없음</div>;

  const columns = Object.keys(rows[0]);

  return (
    <div>
      <h2>tb_earning</h2>
      <table border={1} cellPadding={8} cellSpacing={0}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col}>{String(row[col] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}