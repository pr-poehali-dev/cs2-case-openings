
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { 
  Home, 
  Package, 
  Briefcase, 
  RefreshCw, 
  GitMerge, 
  TrendingUp, 
  HelpCircle, 
  LogOut, 
  LogIn, 
  Plus,
  User
} from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, balance, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-purple-900 text-white">
      <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-xl font-bold" onClick={() => navigate("/")}>
                <Package className="mr-2" /> CS2 Кейсы
              </Button>
              
              <nav className="hidden md:block">
                <ul className="flex space-x-2">
                  <li>
                    <Button variant="ghost" onClick={() => navigate("/")}>
                      <Home size={18} /> Главная
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" onClick={() => navigate(isAuthenticated ? "/upgrade" : "/login")}>
                      <TrendingUp size={18} /> Апгрейд
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" onClick={() => navigate(isAuthenticated ? "/contracts" : "/login")}>
                      <GitMerge size={18} /> Контракты
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" onClick={() => navigate(isAuthenticated ? "/crash" : "/login")}>
                      <RefreshCw size={18} /> Краш
                    </Button>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate("/support")}>
                <HelpCircle size={18} /> Поддержка
              </Button>

              {isAuthenticated ? (
                <>
                  <div className="bg-gray-800 rounded-lg px-4 py-2 flex items-center">
                    <span className="mr-2 font-medium">{balance} ₽</span>
                    <Button size="sm" variant="outline" onClick={() => navigate("/deposit")}>
                      <Plus size={16} />
                    </Button>
                  </div>
                  
                  <Button variant="secondary" onClick={() => navigate("/inventory")}>
                    <Briefcase size={18} /> Инвентарь
                  </Button>
                  
                  <Button variant="ghost" onClick={() => navigate("/profile")}>
                    <User size={18} /> {user?.username}
                  </Button>
                  
                  <Button variant="destructive" onClick={logout}>
                    <LogOut size={18} />
                  </Button>
                </>
              ) : (
                <Button onClick={() => navigate("/login")}>
                  <LogIn size={18} /> Войти
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>© 2025 CS2 Кейсы. Все права защищены.</p>
            <p className="mt-2 text-sm">Предметы из данного сайта не имеют ценности в реальном мире и предназначены исключительно для развлекательных целей.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
