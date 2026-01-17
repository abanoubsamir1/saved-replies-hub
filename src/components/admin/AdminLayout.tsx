import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogOut, Globe, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useUserRole } from "@/hooks/useUserRole";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { role, isAdmin, loading } = useUserRole();
  const { toast } = useToast();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      
      // Enforce admin role after loading
      if (!loading && !isAdmin) {
        toast({
          title: language === 'en' ? "Access Denied" : "تم رفض الوصول",
          description: language === 'en' ? "Admin access required" : "يتطلب صلاحيات المدير",
          variant: "destructive"
        });
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate, isAdmin, loading, toast, language]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{language === 'en' ? 'Loading...' : 'جاري التحميل...'}</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
            <div className="flex h-full items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold">{t('adminPanel')}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">{language === 'en' ? 'Home' : 'الرئيسية'}</span>
                </Button>
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Globe className="h-4 w-4" />
                      <span className="hidden sm:inline">{language === 'en' ? 'English' : 'العربية'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer">
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('ar')} className="cursor-pointer">
                      العربية (Arabic)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  {t('logout')}
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
