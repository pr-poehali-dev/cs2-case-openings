
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, RefreshCw } from "lucide-react";

// Mock data - in a real app, this would come from an API
const CASES = [
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
      { id: 13, name: "M4A1-S | Сайрекс", price: 1800, rarity: "restricted", image: "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?q=80&w=150&auto=format" },
      { id: 14, name: "Desert Eagle | Код", price: 550, rarity: "mil-spec", image: "https://images.unsplash.com/photo-1608525857889-1b6675f2c90d?q=80&w=150&auto=format" },
      { id: 15, name: "P250 | Азимов", price: 320, rarity: "mil-spec", image: "https://images.unsplash.com/photo-1608525884096-d5686e593c4a?q=80&w=150&auto=format" },
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
      { id: 16, name: "AWP | Электрический улей", price: 3200, rarity: "classified", image: "https://images.unsplash.com/photo-1608525858897-814fdcd32f0b?q=80&w=150&auto=format" },
      { id: 17, name: "Famas | Валентность", price: 120, rarity: "mil-spec", image: "https://images.unsplash.com/photo-1608525860741-a391e9de9fd1?q=80&w=150&auto=format" },
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
      { id: 18, name: "AK-47 | Вулкан", price: 3000, rarity: "classified", image: "https://images.unsplash.com/photo-1603481546579-65d935ba9894?q=80&w=150&auto=format" },
      { id: 19, name: "USP-S | Кортексс", price: 280, rarity: "mil-spec", image: "https://images.unsplash.com/photo-1608525857830-33f4ec44943b?q=80&w=150&auto=format" },
    ]
  }
];

interface Item {
  id: number;
  name: string;
  price: number;
  rarity: string;
  image: string;
}

const CaseOpening = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, balance, updateBalance } = useAuth();
  const { toast } = useToast();
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [won, setWon] = useState<Item | null>(null);
  const [inventory, setInventory] = useState<Item[]>([]);
  const rouletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Find the case by ID
    const caseData = CASES.find(c => c.id === Number(id));
    if (!caseData) {
      navigate("/");
      return;
    }
    
    setSelectedCase(caseData);
    
    // Load inventory from localStorage
    const savedInventory = localStorage.getItem('inventory');
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  }, [id, isAuthenticated, navigate]);

  useEffect(() => {
    // Save inventory to localStorage when it changes
    if (inventory.length > 0) {
      localStorage.setItem('inventory', JSON.stringify(inventory));
    }
  }, [inventory]);

  const startSpin = () => {
    if (!selectedCase) return;
    
    // Check if user has enough balance
    if (balance < selectedCase.price) {
      toast({
        title: "Недостаточно средств",
        description: "Пополните баланс для открытия кейса",
        variant: "destructive"
      });
      return;
    }

    // Deduct the case price from balance
    updateBalance(-selectedCase.price);
    
    setIsSpinning(true);
    setWon(null);
    
    // Determine the item that will be won (pre-selected)
    const roll = Math.random();
    let selectedItem: Item;
    
    if (roll < 0.01) { // 1% chance for the most expensive item
      selectedItem = [...selectedCase.items].sort((a, b) => b.price - a.price)[0];
    } else if (roll < 0.1) { // 9% chance for expensive items
      const expensiveItems = [...selectedCase.items].sort((a, b) => b.price - a.price).slice(0, 2);
      selectedItem = expensiveItems[Math.floor(Math.random() * expensiveItems.length)];
    } else if (roll < 0.5) { // 40% chance for medium value items
      const mediumItems = [...selectedCase.items].filter(item => 
        item.price > selectedCase.price && item.price < selectedCase.price * 5
      );
      
      if (mediumItems.length > 0) {
        selectedItem = mediumItems[Math.floor(Math.random() * mediumItems.length)];
      } else {
        // Fallback if there are no medium items
        selectedItem = selectedCase.items[Math.floor(Math.random() * selectedCase.items.length)];
      }
    } else { // 50% chance for common items
      const commonItems = [...selectedCase.items].filter(item => 
        item.price < selectedCase.price * 3
      );
      
      if (commonItems.length > 0) {
        selectedItem = commonItems[Math.floor(Math.random() * commonItems.length)];
      } else {
        // Fallback
        selectedItem = selectedCase.items[Math.floor(Math.random() * selectedCase.items.length)];
      }
    }
    
    // Create the roulette items, ensuring the selected item appears
    const rouletteItems: Item[] = [];
    const totalItems = 50; // Total slots in the roulette
    const winPosition = 38; // Position where the winning item will be
    
    for (let i = 0; i < totalItems; i++) {
      if (i === winPosition) {
        rouletteItems.push(selectedItem);
      } else {
        // Random items from the case
        const randomItem = selectedCase.items[Math.floor(Math.random() * selectedCase.items.length)];
        rouletteItems.push(randomItem);
      }
    }
    
    setItems(rouletteItems);
    
    if (rouletteRef.current) {
      rouletteRef.current.style.transition = 'none';
      rouletteRef.current.style.transform = 'translateX(0)';
      
      setTimeout(() => {
        if (rouletteRef.current) {
          rouletteRef.current.style.transition = 'transform 8s cubic-bezier(0.12, 0.39, 0.17, 0.99)';
          rouletteRef.current.style.transform = `translateX(calc(-${winPosition * 160}px + 50%))`;
        }
        
        // After animation ends
        setTimeout(() => {
          setIsSpinning(false);
          setWon(selectedItem);
          
          // Add the won item to inventory
          setInventory(prev => [...prev, selectedItem]);
          
          toast({
            title: "Поздравляем!",
            description: `Вы выиграли: ${selectedItem.name} (${selectedItem.price} ₽)`,
          });
        }, 8000);
      }, 100);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "covert": return "bg-red-500";
      case "classified": return "bg-pink-500";
      case "restricted": return "bg-purple-500";
      case "mil-spec": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  if (!selectedCase) {
    return (
      <MainLayout>
        <div className="container mx-auto p-8 text-center">
          Загрузка...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="mr-4">
            <ArrowLeft className="mr-2" /> Назад
          </Button>
          <h1 className="text-3xl font-bold">{selectedCase.name}</h1>
        </div>

        <div className="mb-8 flex justify-center">
          <img src={selectedCase.image} alt={selectedCase.name} className="h-40 object-contain" />
        </div>

        <div className="mb-6 text-center">
          <div className="inline-block px-4 py-2 bg-gray-800 rounded-full text-yellow-400 font-medium">
            Цена: {selectedCase.price} ₽
          </div>
        </div>

        <div className="mb-10 relative overflow-hidden">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-500 z-10"></div>
          <div className="h-40 relative overflow-hidden">
            <div 
              ref={rouletteRef} 
              className="absolute flex space-x-2 h-full"
              style={{ transform: 'translateX(0)' }}
            >
              {items.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex-shrink-0 w-40 h-full p-2 ${getRarityColor(item.rarity)} rounded-lg flex flex-col items-center justify-center`}
                >
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-contain mb-2" />
                  <div className="text-white text-center font-medium text-sm truncate w-full">{item.name}</div>
                  <div className="text-yellow-200 text-xs">{item.price} ₽</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <Button 
            onClick={startSpin}
            disabled={isSpinning || balance < selectedCase.price}
            className="px-8 py-6 text-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            {isSpinning ? (
              <>
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> Открывается...
              </>
            ) : (
              <>Открыть кейс ({selectedCase.price} ₽)</>
            )}
          </Button>
        </div>

        {won && (
          <div className="py-6 text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Ваш выигрыш</h2>
            <div className="flex justify-center">
              <div className={`p-4 ${getRarityColor(won.rarity)} rounded-lg max-w-xs`}>
                <img src={won.image} alt={won.name} className="mx-auto w-32 h-32 object-contain mb-4" />
                <div className="text-white text-xl font-medium mb-1">{won.name}</div>
                <div className="text-yellow-200 text-lg">{won.price} ₽</div>
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <Button onClick={() => navigate("/inventory")}>
                Перейти в инвентарь
              </Button>
              <Button variant="outline" onClick={startSpin} disabled={balance < selectedCase.price}>
                Открыть еще раз
              </Button>
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Предметы в кейсе</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedCase.items.map((item: Item) => (
              <div 
                key={item.id} 
                className={`p-3 ${getRarityColor(item.rarity)} rounded-lg flex flex-col items-center`}
              >
                <img src={item.image} alt={item.name} className="w-24 h-24 object-contain mb-2" />
                <div className="text-white text-center font-medium text-sm truncate w-full">{item.name}</div>
                <div className="text-yellow-200 text-xs">{item.price} ₽</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CaseOpening;
