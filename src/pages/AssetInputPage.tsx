import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, Save, LayoutDashboard, Wallet, 
  ArrowUpRight, History, Settings, Bell, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AssetInputPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* 1. 사이드바 네비게이션 (상용 앱의 필수 요소) */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-white p-6 gap-8">
        <div className="flex items-center gap-2 px-2">
          <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <Wallet className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tighter">BUGET COACH</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start gap-3 h-12 font-bold text-slate-500">
            <LayoutDashboard size={20} /> 대시보드
          </Button>
          <Button variant="secondary" className="justify-start gap-3 h-12 font-bold bg-slate-900 text-white">
            <ArrowUpRight size={20} /> 자산 등록
          </Button>
          <Button variant="ghost" className="justify-start gap-3 h-12 font-bold text-slate-500">
            <History size={20} /> 거래 내역
          </Button>
          <Button variant="ghost" className="justify-start gap-3 h-12 font-bold text-slate-500">
            <Settings size={20} /> 설정
          </Button>
        </nav>
      </aside>

      {/* 2. 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 상단바 */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-8">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-xl w-96">
            <Search size={18} className="text-slate-400" />
            <input placeholder="자산 검색..." className="bg-transparent outline-none text-sm w-full" />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full"><Bell size={18} /></Button>
            <div className="h-9 w-9 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
          </div>
        </header>

        {/* 메인 폼 섹션 */}
        <main className="p-8 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight uppercase">{category} 입력</h1>
                <p className="text-slate-500 font-medium">정확한 정보를 입력하여 자산 리포트를 업데이트하세요.</p>
              </div>
              <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl border-slate-200">
                <ChevronLeft size={16} className="mr-2" /> 돌아가기
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 왼쪽: 메인 폼 카드 */}
              <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 rounded-[2rem]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold">상세 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   {/* 여기에 이전에 만든 한 줄 배치 폼들이 들어갑니다. */}
                   <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label className="text-sm font-bold ml-1">금융 기관</Label>
                        <Input placeholder="기관명 입력" className="h-12 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-900" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm font-bold ml-1">현재 잔액</Label>
                        <div className="relative">
                          <Input type="number" className="h-12 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 text-right pr-12 font-bold" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">KRW</span>
                        </div>
                      </div>
                   </div>
                   
                   <Button className="w-full h-14 rounded-2xl bg-slate-900 text-lg font-black mt-4">
                     <Save className="mr-2 h-5 w-5" /> 데이터 저장하기
                   </Button>
                </CardContent>
              </Card>

              {/* 오른쪽: 가이드 및 미리보기 카드 */}
              <div className="space-y-6">
                <Card className="border-none bg-slate-900 text-white rounded-[2rem] p-2">
                  <CardHeader>
                    <CardTitle className="text-sm">입력 가이드</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-slate-400 leading-relaxed">
                    데이터는 암호화되어 전송되며, 실시간 스케줄링 알고리즘에 의해 분석됩니다.
                  </CardContent>
                </Card>

                <Card className="border-dashed border-2 border-slate-200 rounded-[2rem] bg-transparent">
                  <CardContent className="p-8 text-center">
                    <div className="h-20 w-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <History className="text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-400 leading-tight">
                      최근에 입력한 <br /> {category} 내역이 없습니다.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}