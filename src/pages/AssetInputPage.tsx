import { useParams, useNavigate } from "react-router-dom";

export function AssetInputPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  // 카테고리별 한글 이름 매핑
  const categoryNames: Record<string, string> = {
    saving: "저축",
    debt: "부채",
    stock: "주식",
    realestate: "부동산",
    spending: "소비",
  };

  const title = category ? categoryNames[category] : "알 수 없는 항목";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <button 
          onClick={() => navigate(-1)} 
          className="text-sm text-indigo-600 mb-4 hover:underline"
        >
          ← 뒤로가기
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{title} 입력</h1>
        
        <div className="space-y-4">
          <p className="text-gray-500">여기에 {title} 관련 입력 폼이 들어갈 예정입니다.</p>
          <div className="h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
            준비 중...
          </div>
        </div>
      </div>
    </div>
  );
}