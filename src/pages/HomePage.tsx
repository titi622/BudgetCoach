import { Link } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import type { DropdownItem } from "../components/Dropdown";

export function HomePage() {
  const categoryList: DropdownItem[] = [
    { id: 'saving', label: '저축' },
    { id: 'debt', label: '부채' },
    { id: 'stock', label: '주식' },
    { id: 'realestate', label: '부동산' },
    { id: 'spending', label: '소비' },
  ];

  const handleCategorySelect = (category: DropdownItem) => {
    alert(`${category.label} 항목을 추가합니다!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">BudgetCoach</h1>
            <p className="text-gray-500 mt-1">나의 자산을 체계적으로 관리하세요.</p>
          </div>
          <Link to="/" className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors">
            로그아웃(임시)
          </Link>
        </header>

        <main className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-800">자산 내역</h2>
            <Dropdown items={categoryList} onSelect={handleCategorySelect} />
          </div>

          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">아직 등록된 내역이 없습니다.</p>
            <p className="text-gray-400 text-sm mt-1">'추가하기' 버튼을 눌러 첫 내역을 작성해 보세요.</p>
          </div>
        </main>
      </div>
    </div>
  );
}