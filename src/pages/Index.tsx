
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CaseCard } from "@/components/CaseCard";
import { MainLayout } from "@/components/MainLayout";
import { useAuth } from "@/hooks/useAuth";

const cases = [
  {
    id: 1,
    name: "Призма Кейс",
    price: 230,
    image: "https://images.unsplash.com/photo-1636955816868-fcb881e57954?q=80&w=200&auto=format",
    items: [
      { id: 1, name: "AWP | Азимов", price: 4500, rarity: "classified", image: "https://images.unsplash.com/photo-1608525877064-64701e255216?q=80&w=150&auto=format" },
      { id: 2, name: "AK-47 | Вулкан", price: 3200, rarity: "covert", image: "https://images.unsplash.com/photo-1603481546579-65d935ba9894?q=80&w=150&auto=format" },
      { id: 3, name: "M4A4 | Император", price: 1200, rarity: "restricted", image: "https://images.unsplash.com/photo-1664478711535-fd3cc5d1a99a?q=80&w=150&auto=format" },
      { id: 4, name: "USP-S | Неонуар", price: 800, rarity: "mil-spec", image: "https://images.unsplash.com/photo-1608525857830-33f4ec44943b?q=80&w=150&auto=format" },
    ]
  },
  {
    id: 2,
    name: "Хрома Кейс",
    price: 160,
    image: "https://images.unsplash.com/photo-1608525884096-d5686e593c4a?q=80&w=200&auto=format",
    items: [
      { id: 5, name: "Керамбит | Градиент", price: 12000, rarity: "covert", image: "https://images.unsplash.com/photo-1608525857887-a307c9115e8c?q=80&w=150&auto=format" },
      { id: 6, name: "M4A1-S | Гипербист", price: 2100, rarity: "classified", image: "https://images.unsplash.com/photo-1608525859112-01cca6ff3144?q=80&w=150&auto=format" },
      { id: 7, name: "Glock-18 | Градиент", price: 950, rarity: "restricted", image: "https://images.unsplash.com/photo-1608525858829-fb0597e14d37?q=80&w=150&auto=format" },
      { id: 8, name: "Deagle | Кодекс", price: 450, rarity: "mil-spec", image: "https://images.unsplash.com/photo-1665850595362-e0f5dfc5e8f4?q=80&w=150&auto=format" },
    ]
  },
  {
    id: 3,
    name: "Спектр Кейс",
    price: 350,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=200&auto=format",
    items: [
      { id: 9, name: "Нож Бабочка | Кровавая паутина", price: 25000, rarity: "covert", image: "https://images.unsplash.com/photo-1608525857750-98fb29e0d911?q=80&w=150&auto=format" },
      { id: 10, name: "AWP | Нео-нуар", price: 3800, rarity: "classified", image: "https://images.unsplash.com/photo-1605810230797-ba3b1c475844?q=80&w=150&auto=format" },
      { id: 11, name: "P250 | Азимов", price: 120, rarity: "restricted", image: "https://images.unsplash.com/photo-1590595978583-3d92b91fc9ab?q=80&w=150&auto=format" },
      { id: 12, name: "SSG 08 | Кровь в воде", price: 650, rarity: "mil-spec", image: "https://images.unsplash.com/photo-1590596413111-a7768f21954e?q=80&w=150&auto=format" },
    ]
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleCaseClick = (caseId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(`/case/${caseId}`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            CS2 Кейс Опенер
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Открывай кейсы, получай скины, используй контракты и апгрейды для получения эксклюзивных предметов!
          </p>
        </div>

        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-lg mb-10">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Войдите в аккаунт</h2>
                <p className="text-gray-600 mb-4">Для открытия кейсов и доступа ко всем функциям необходимо войти в аккаунт</p>
              </div>
              <div className="flex gap-4 mt-4 sm:mt-0">
                <Button onClick={() => navigate("/login")}>Войти</Button>
                <Button variant="outline" onClick={() => navigate("/register")}>Регистрация</Button>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">Популярные кейсы</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map(caseItem => (
            <CaseCard 
              key={caseItem.id}
              caseData={caseItem}
              onClick={() => handleCaseClick(caseItem.id)}
              disabled={!isAuthenticated}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
