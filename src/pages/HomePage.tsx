import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Home</h1>
      <p>임시 홈 화면입니다.</p>
      <Link to="/">로그아웃(임시)</Link>
    </div>
  );
}