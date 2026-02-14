import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();

  const onLogin = () => {
    // 임시 로그인: 실제 인증 없이 홈으로 이동
    navigate("/home");
  };

  return (
    <div style={{ padding: 24, maxWidth: 360 }}>
      <h1>BudgetCoach</h1>
      <p>임시 로그인 페이지</p>

      <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
        <label>
          이메일
          <input
            type="email"
            placeholder="test@budget.coach"
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            placeholder="••••••••"
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <button onClick={onLogin} style={{ padding: 10, marginTop: 8 }}>
          로그인
        </button>
      </div>
    </div>
  );
}