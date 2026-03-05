import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/home");
    }, 1500);
  };

  return (
    // 💡 중앙 정렬 핵심: min-h-screen + grid + place-items-center
    <div className="min-h-screen w-full grid place-items-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-[420px] space-y-8">
        
        {/* 상단 로고 (글씨체/자간 조정) */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
            <span className="text-white font-black text-2xl italic tracking-tighter">B</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">BUGET COACH</h1>
            <p className="text-slate-400 text-sm font-bold mt-2 uppercase tracking-widest">Asset Manager</p>
          </div>
        </div>

        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="space-y-1 text-center pt-12 pb-8 px-10">
            <CardTitle className="text-3xl font-black tracking-tighter text-slate-900">환영합니다</CardTitle>
            <CardDescription className="font-semibold text-slate-400">
              계정에 접속하여 자산을 관리하세요.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-10 pb-10">
            <form onSubmit={onLogin} className="space-y-6">
              <div className="space-y-2.5">
                <Label className="font-black text-slate-700 ml-1 text-xs uppercase tracking-wider">Email Address</Label>
                <div className="relative group">
                  {/* 💡 아이콘 크기 고정: h-5 w-5 + padding 조절 */}
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                  <Input 
                    type="email" 
                    placeholder="test@budget.coach" 
                    className="pl-12 h-14 rounded-2xl border-none bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="font-black text-slate-700 ml-1 text-xs uppercase tracking-wider">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-12 h-14 rounded-2xl border-none bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-16 rounded-[1.5rem] bg-slate-900 hover:bg-black text-white font-black text-lg shadow-2xl shadow-slate-200 transition-all active:scale-[0.97] mt-2"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    로그인 <ChevronRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-slate-50/50 flex flex-col gap-4 py-8 px-10 border-t border-slate-50">
            <p className="text-center text-sm text-slate-400 font-bold leading-none">
              아직 회원이 아니신가요? 
              <button className="text-slate-900 font-black ml-2 hover:underline">회원가입</button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}