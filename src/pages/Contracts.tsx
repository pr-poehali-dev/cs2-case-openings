
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/MainLayout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { GitMerge, Trash2, RefreshCw } from "lucide-react";

interface SkinItem {
  id: string;
  name: string;
  price: number;
  rarity: string;
  image: string;
}

const Contracts = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inventory, setInventory] = useState<SkinItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SkinItem[]>([]);
  const [contractResult, setContractResult] = useState<SkinItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load inventory from localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedInventory = localStorage.getItem('inventory');
      if (savedInventory) {
        setInventory(JSON.parse(savedInventory));
      }
    }
  }, [isAuthenticated, user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const selectItem = (item: SkinItem) => {
    // Don't select if already processing a contract
    if (isProcessing) return;
    
    // Check if already selected
    if (selectedItems.some(selected => selected.id === item.id)) {
      setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
      return;
    }
    
    // Max 10 items for a contract
    if (selectedItems.length >= 10) {
      toast({
        title: "Максимум 10 предметов",
        description: "Вы можете выбрать максимум 10 предметов для контракта",
        variant: "destructive"
      });
      return;
    }
    
    // Add to selected items
    setSelectedItems([...selectedItems, item]);
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const processContract = () => {
    if (selectedItems.length < 3) {
      toast({
        title: "Недостаточно предметов",
        description: "Выберите минимум 3 предмета для контракта",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Calculate the average price and tier of selected items
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
    const averagePrice = totalPrice / selectedItems.length;
    
    // Add a bonus for using more items (5-25%)
    const bonusMultiplier = 1 + (selectedItems.length - 3) * 0.05; // 5% per item above 3
    
    // Calculate new item price (higher than average)
    const newItemPrice = Math.round(averagePrice * bonusMultiplier * 1.2); // 20% value increase
    
    // Determine rarity based on price
    let newRarity = "mil-spec";
    if (newItemPrice > 1000) newRarity = "covert";
    else if (newItemPrice > 500) newRarity = "classified";
    else if (newItemPrice > 200) newRarity = "restricted";
    
    // Generate a list of possible outcome items
    const possibleOutcomes = [
      { name: "AWP | Lightning Strike", rarity: "covert", wear: "Factory New" },
      { name: "AK-47 | Fire Serpent", rarity: "covert", wear: "Field-Tested" },
      { name: "M4A4 | Howl", rarity: "covert", wear: "Minimal Wear" },
      { name: "Desert Eagle | Blaze", rarity: "restricted", wear: "Factory New" },
      { name: "USP-S | Kill Confirmed", rarity: "classified", wear: "Well-Worn" },
      { name: "Glock-18 | Fade", rarity: "restricted", wear: "Minimal Wear" },
      { name: "M4A1-S | Hyper Beast", rarity: "classified", wear: "Field-Tested" },
      { name: "P250 | Mehndi", rarity: "restricted", wear: "Factory New" },
      { name: "AWP | Asiimov", rarity: "classified", wear: "Field-Tested" },
      { name: "AK-47 | Redline", rarity: "restricted", wear: "Minimal Wear" },
    ];
    
    // Filter by rarity
    const rarityMatches = possibleOutcomes.filter(item => item.rarity === newRarity);
    
    // Choose a random outcome from matching rarity, or any if none match
    const chosenOutcome = rarityMatches.length > 0
      ? rarityMatches[Math.floor(Math.random() * rarityMatches.length)]
      : possibleOutcomes[Math.floor(Math.random() * possibleOutcomes.length)];
    
    // Generate a result item
    const resultItem: SkinItem = {
      id: `contract_${Date.now()}`,
      name: chosenOutcome.name,
      price: newItemPrice,
      rarity: chosenOutcome.rarity,
      image: `https://images.unsplash.com/photo-${1600000000 + Math.floor(Math.random() * 10000000)}?q=80&w=150&auto=format`,
    };
    
    // Simulate processing
    setTimeout(() => {
      // Remove selected items from inventory
      const updatedInventory = inventory.filter(
        item => !selectedItems.some(selected => selected.id === item.id)
      );
      
      // Add the new item
      updatedInventory.push(resultItem);
      
      // Update local storage
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));
      
      // Update state
      setInventory(updatedInventory);
      setContractResult(resultItem);
      setIsProcessing(false);
      
      // Show success notification
      toast({
        title: "Контракт выполнен",
        description: `Вы получили: ${resultItem.name}`,
      });
    }, 2000);
  };
  
  const resetContract = () => {
    setSelectedItems([]);
    setContractResult(null);
  };
  
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "mil-spec": return "bg-blue-500";
      case "restricted": return "bg-purple-500";
      case "classified": return "bg-pink-500";
      case "covert": return "bg-red-500";
      case "extraordinary": return "bg-yellow-400";
      default: return "bg-gray-500";
    }
  };
  
  const getRarityBorder = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "mil-spec": return "border-blue-500";
      case "restricted": return "border-purple-500";
      case "classified": return "border-pink-500";
      case "covert": return "border-red-500";
      case "extraordinary": return "border-yellow-400";
      default: return "border-gray-500";
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Контракты обмена
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel - Inventory */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="inventory" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="inventory">Ваш инвентарь</TabsTrigger>
                <TabsTrigger value="selected" className="relative">
                  Выбранные
                  {selectedItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedItems.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="inventory" className="bg-gray-800/60 rounded-lg p-4 min-h-[500px]">
                {inventory.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {inventory.map((item) => (
                      <div
                        key={item.id}
                        className={`relative rounded-md overflow-hidden border-2 ${
                          selectedItems.some(selected => selected.id === item.id)
                            ? 'border-blue-500'
                            : 'border-gray-700'
                        } cursor-pointer transition-all hover:scale-105`}
                        onClick={() => selectItem(item)}
                      >
                        <div className={`${getRarityColor(item.rarity)} h-1 w-full`}></div>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="bg-gray-800 p-2">
                          <p className="text-xs truncate font-medium">{item.name}</p>
                          <p className="text-green-400 text-xs">{item.price} ₽</p>
                        </div>
                        
                        {selectedItems.some(selected => selected.id === item.id) && (
                          <div className="absolute top-2 right-2 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">
                            {selectedItems.findIndex(selected => selected.id === item.id) + 1}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <p className="mb-4">Ваш инвентарь пуст</p>
                    <Button onClick={() => navigate("/")}>Открыть кейсы</Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="selected" className="bg-gray-800/60 rounded-lg p-4 min-h-[500px]">
                {selectedItems.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {selectedItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="relative rounded-md overflow-hidden border-2 border-blue-500 cursor-pointer transition-all hover:scale-105"
                        onClick={() => selectItem(item)}
                      >
                        <div className={`${getRarityColor(item.rarity)} h-1 w-full`}></div>
                        <div className="absolute top-2 right-2 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">
                          {index + 1}
                        </div>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="bg-gray-800 p-2">
                          <p className="text-xs truncate font-medium">{item.name}</p>
                          <p className="text-green-400 text-xs">{item.price} ₽</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <p className="mb-4">Нет выбранных предметов</p>
                    <p className="text-sm max-w-md text-center">
                      Выберите от 3 до 10 предметов из вашего инвентаря для создания контракта обмена
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right panel - Contract details */}
          <div className="bg-gray-800/60 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Информация о контракте</h2>
            
            {contractResult ? (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">Результат контракта:</p>
                  <div className={`inline-block rounded-md overflow-hidden border-2 ${getRarityBorder(contractResult.rarity)}`}>
                    <div className={`${getRarityColor(contractResult.rarity)} text-xs text-center py-0.5`}>
                      {contractResult.rarity}
                    </div>
                    <img 
                      src={contractResult.image} 
                      alt={contractResult.name} 
                      className="w-40 h-40 object-cover mx-auto"
                    />
                    <div className="bg-gray-800 p-2 text-center">
                      <p className="text-sm font-medium">{contractResult.name}</p>
                      <p className="text-green-400">{contractResult.price} ₽</p>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={resetContract}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  Новый контракт
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-300 text-sm">
                  Выберите от 3 до 10 предметов для создания контракта.
                  Чем больше предметов вы выберете, тем выше шанс получить ценный предмет.
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Выбрано предметов:</span>
                    <span className="font-medium">{selectedItems.length} / 10</span>
                  </div>
                  
                  {selectedItems.length > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span>Общая стоимость:</span>
                        <span className="font-medium">
                          {selectedItems.reduce((sum, item) => sum + item.price, 0)} ₽
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Средняя стоимость:</span>
                        <span className="font-medium">
                          {Math.round(selectedItems.reduce((sum, item) => sum + item.price, 0) / selectedItems.length)} ₽
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Предполагаемый результат:</span>
                        <span className="font-medium text-green-400">
                          ~{Math.round(selectedItems.reduce((sum, item) => sum + item.price, 0) / selectedItems.length * (1 + (selectedItems.length - 3) * 0.05) * 1.2)} ₽
                        </span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={clearSelection}
                    variant="outline"
                    disabled={selectedItems.length === 0 || isProcessing}
                    className="flex-1"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Очистить
                  </Button>
                  
                  <Button
                    onClick={processContract}
                    disabled={selectedItems.length < 3 || isProcessing}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Обработка...
                      </>
                    ) : (
                      <>
                        <GitMerge className="mr-2 h-4 w-4" /> Создать контракт
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-medium mb-2">Как работают контракты?</h3>
              <ul className="text-sm text-gray-300 space-y-2 list-disc pl-5">
                <li>Выберите от 3 до 10 предметов из вашего инвентаря</li>
                <li>Чем больше предметов вы выберете, тем выше бонус к стоимости результата</li>
                <li>Вы получите один предмет, стоимость которого будет выше средней стоимости выбранных предметов</li>
                <li>Редкость получаемого предмета зависит от стоимости выбранных предметов</li>
                <li>Выбранные предметы будут удалены из вашего инвентаря</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contracts;
