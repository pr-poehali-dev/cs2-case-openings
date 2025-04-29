
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { LogIn, User, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Успешно",
        description: "Вы успешно вошли в аккаунт"
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: "Неверные данные для входа",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-purple-900 p-4">
      <div className="w-full max-w-md p-8 bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Вход в аккаунт</h1>
          <p className="text-gray-400">Войдите для доступа к кейсам и вашему инвентарю</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            disabled={isLoading}
          >
            {isLoading ? 
              "Вход..." : 
              <>
                <LogIn className="mr-2 h-4 w-4" /> Войти
              </>
            }
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Нет аккаунта?{" "}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Зарегистрироваться
            </Link>
          </p>
          <Link to="/" className="text-gray-500 hover:text-gray-400 text-sm mt-4 inline-block">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
