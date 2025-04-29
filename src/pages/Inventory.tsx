
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/MainLayout";
import { useAuth } from "@/hooks/useAuth";

interface InventoryItem {
  id: string;
  name: string;
  image: string;
  rarity: string;
  price: number;
  wear: string;
}

const Inventory = () => {
  const { isAuthenticated, user, updateUserBalance } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast } = useToast();

  // Load inventory from localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedInventory = localStorage.getItem(`inventory_${user.id}`);
      if (savedInventory) {
        setInventory(JSON.parse(savedInventory));
      }
    }
  }, [isAuthenticated, user]);

  const handleSellItem = (itemId: string) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Необходимо войти в аккаунт"
      });
      return;
    }

    const item = inventory.find(item => item.id === itemId);
    if (!item) return;

    // Remove item from inventory
    const newInventory = inventory.filter(item => item.id !== itemId);
    setInventory(newInventory);
    
    // Update localStorage
    if (user) {
      localStorage.setItem(`inventory_${user.id}`, JSON.stringify(newInventory));
    }

    // Update user balance
    updateUserBalance(user?.balance || 0 + item.price);
    
    toast({
      title: "Предмет продан",
      description: `${item.name} продан за ${item.price} руб.`
    });
  };

  const toggleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSellSelected = () => {
    if (selectedItems.length === 0) return;
    
    const totalPrice = selectedItems.reduce((sum, itemId) => {
      const item = inventory.find(item => item.id === itemId);
      return sum + (item?.price || 0);
    }, 0);
    
    // Remove selected items from inventory
    const newInventory = inventory.filter(item => !selectedItems.includes(item.id));
    setInventory(newInventory);
    
    // Update localStorage
    if (user) {
      localStorage.setItem(`inventory_${user.id}`, JSON.stringify(newInventory));
    }
    
    // Update user balance
    updateUserBalance(user?.balance || 0 + totalPrice);
    
    toast({
      title: "Предметы проданы",
      description: `${selectedItems.length} предметов продано за ${totalPrice} руб.`
    });
    
    setSelectedItems([]);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common": return "border-gray-400";
      case "uncommon": return "border-blue-400";
      case "rare": return "border-purple-500";
      case "mythical": return "border-pink-500";
      case "legendary": return "border-yellow-400";
      case "ancient": return "border-red-500";
      default: return "border-gray-400";
    }
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 px-4">
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <h2 className="text-2xl font-bold mb-4">Требуется авторизация</h2>
            <p className="text-muted-foreground mb-6">
              Войдите в аккаунт, чтобы просмотреть ваш инвентарь
            </p>
            <Button variant="default" className="bg-gradient-to-r from-purple-500 to-blue-500">
              Войти
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Мой инвентарь
          </h1>
          
          {selectedItems.length > 0 && (
            <Button onClick={handleSellSelected} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              Продать выбранное ({selectedItems.length})
            </Button>
          )}
        </div>
        
        <Separator className="mb-6" />
        
        {inventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <h2 className="text-2xl font-bold mb-4">Ваш инвентарь пуст</h2>
            <p className="text-muted-foreground mb-6">
              Откройте кейсы, чтобы получить предметы
            </p>
            <Button variant="default" className="bg-gradient-to-r from-purple-500 to-blue-500">
              Открыть кейсы
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {inventory.map((item) => (
              <Card key={item.id} className={`border-2 ${getRarityColor(item.rarity)} hover:shadow-lg transition-all duration-300 ${selectedItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
                  <CardDescription>
                    {item.wear} | {item.rarity}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-2">
                  <div className="h-40 w-full flex items-center justify-center">
                    <img 
                      src={item.image || "https://csgo-trader.app/img/placeholder.png"} 
                      alt={item.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="font-semibold">{item.price} ₽</div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => toggleSelectItem(item.id)}
                      className={selectedItems.includes(item.id) ? "bg-blue-500/20" : ""}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 11 12 14 22 4"></polyline>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                    </Button>
                    <Button 
                      variant="default" 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      onClick={() => handleSellItem(item.id)}
                    >
                      Продать
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Inventory;
