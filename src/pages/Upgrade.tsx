
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

interface SkinItem {
  id: string;
  name: string;
  price: number;
  rarity: string;
  image: string;
}

const Upgrade = () => {
  const { isAuthenticated, user, updateBalance } = useAuth();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<SkinItem[]>([]);
  const [selectedSkin, setSelectedSkin] = useState<SkinItem | null>(null);
  const [targetSkin, setTargetSkin] = useState<SkinItem | null>(null);
  const [upgradeChance, setUpgradeChance] = useState<number>(50);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState<boolean>(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  
  // Fake target skins with different price tiers
  const targetSkins: SkinItem[] = [
    { id: "target1", name: "AWP | Neo-Noir", price: 150, rarity: "classified", image: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=1000&auto=format&fit=crop" },
    { id: "target2", name: "AK-47 | Asiimov", price: 200, rarity: "covert", image: "https://images.unsplash.com/photo-1598897516650-e4dc73d8e196?q=80&w=1000&auto=format&fit=crop" },
    { id: "target3", name: "M4A4 | The Emperor", price: 300, rarity: "covert", image: "https://images.unsplash.com/photo-1613564833984-eae2d33cd654?q=80&w=1000&auto=format&fit=crop" },
    { id: "target4", name: "Desert Eagle | Blaze", price: 400, rarity: "restricted", image: "https://images.unsplash.com/photo-1550029402-226115b7c579?q=80&w=1000&auto=format&fit=crop" },
    { id: "target5", name: "Butterfly Knife | Fade", price: 1200, rarity: "extraordinary", image: "https://images.unsplash.com/photo-1607302293386-3b37ccbe9730?q=80&w=1000&auto=format&fit=crop" },
  ];

  // Load inventory from localStorage
  useEffect(() => {
    if (user) {
      const storedInventory = localStorage.getItem(`inventory_${user.id}`);
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      }
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Set a target skin when the selected skin changes
  useEffect(() => {
    if (selectedSkin) {
      // Filter skins that are more expensive than the selected one
      const eligibleSkins = targetSkins.filter(skin => skin.price > selectedSkin.price);
      if (eligibleSkins.length > 0) {
        setTargetSkin(eligibleSkins[0]);
      } else {
        setTargetSkin(null);
      }
    } else {
      setTargetSkin(null);
    }
  }, [selectedSkin]);

  // Calculate the upgradeChance based on price difference
  useEffect(() => {
    if (selectedSkin && targetSkin) {
      // Calculate chance based on price ratio
      const priceRatio = selectedSkin.price / targetSkin.price;
      const calculatedChance = Math.min(Math.round(priceRatio * 100), 90);
      setUpgradeChance(calculatedChance);
    }
  }, [selectedSkin, targetSkin]);

  const selectSkin = (skin: SkinItem) => {
    setSelectedSkin(skin);
  };

  const handleChanceChange = (value: number[]) => {
    setUpgradeChance(value[0]);
    
    // Adjust target skin based on chance
    if (selectedSkin) {
      const targetPrice = Math.round(selectedSkin.price / (value[0] / 100));
      
      // Find closest skin by price
      const sortedTargets = [...targetSkins]
        .filter(skin => skin.price > selectedSkin.price)
        .sort((a, b) => Math.abs(a.price - targetPrice) - Math.abs(b.price - targetPrice));
      
      if (sortedTargets.length > 0) {
        setTargetSkin(sortedTargets[0]);
      }
    }
  };

  const spinWheel = () => {
    if (!wheelRef.current || !selectedSkin || !targetSkin) return;
    
    setIsSpinning(true);
    
    // Random outcome based on chance
    const isSuccess = Math.random() * 100 < upgradeChance;
    setUpgradeSuccess(isSuccess);
    
    // Calculate rotation
    const baseRotation = 1080; // Spin at least 3 full circles
    const targetRotation = isSuccess 
      ? baseRotation + Math.random() * 90 + 45 // Land on green
      : baseRotation + (Math.random() * 90 + 180); // Land on red
    
    wheelRef.current.style.transition = "transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)";
    wheelRef.current.style.transform = `rotate(${targetRotation}deg)`;
    
    setTimeout(() => {
      setShowResult(true);
      setIsSpinning(false);
      
      if (isSuccess && user) {
        // Remove selected skin from inventory
        const updatedInventory = inventory.filter(item => item.id !== selectedSkin.id);
        
        // Add target skin to inventory
        updatedInventory.push({...targetSkin, id: `${targetSkin.id}_${Date.now()}`});
        
        // Update local storage
        localStorage.setItem(`inventory_${user.id}`, JSON.stringify(updatedInventory));
        setInventory(updatedInventory);
      } else if (user) {
        // On failure, remove selected skin from inventory
        const updatedInventory = inventory.filter(item => item.id !== selectedSkin.id);
        localStorage.setItem(`inventory_${user.id}`, JSON.stringify(updatedInventory));
        setInventory(updatedInventory);
      }
    }, 5000);
  };

  const resetUpgrade = () => {
    setShowResult(false);
    setSelectedSkin(null);
    setTargetSkin(null);
    setUpgradeChance(50);
    if (wheelRef.current) {
      wheelRef.current.style.transition = "none";
      wheelRef.current.style.transform = "rotate(0deg)";
    }
  };

  const getBackgroundColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-500";
      case "uncommon": return "bg-blue-500";
      case "rare": return "bg-blue-600";
      case "mythical": return "bg-purple-600";
      case "legendary": return "bg-pink-600";
      case "ancient": return "bg-red-600";
      case "immortal": return "bg-yellow-500";
      case "arcana": return "bg-green-500";
      case "restricted": return "bg-purple-500";
      case "classified": return "bg-pink-500";
      case "covert": return "bg-red-500";
      case "extraordinary": return "bg-yellow-400";
      default: return "bg-gray-500";
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Skin Upgrade</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Inventory */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Your Inventory</h2>
              {inventory.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {inventory.map((skin) => (
                    <div 
                      key={skin.id} 
                      className={`relative rounded-md overflow-hidden border-2 ${selectedSkin?.id === skin.id ? 'border-green-400' : 'border-gray-700'} cursor-pointer transition-all hover:scale-105`}
                      onClick={() => selectSkin(skin)}
                    >
                      <div className={`absolute top-0 left-0 right-0 ${getBackgroundColor(skin.rarity)} text-xs text-center py-0.5`}>
                        {skin.rarity}
                      </div>
                      <img 
                        src={skin.image} 
                        alt={skin.name} 
                        className="w-full aspect-square object-cover"
                      />
                      <div className="bg-gray-800 p-2">
                        <p className="text-xs truncate font-medium">{skin.name}</p>
                        <p className="text-green-400 text-xs">${skin.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <p>Your inventory is empty</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate("/case/1")}
                  >
                    Open Cases
                  </Button>
                </div>
              )}
            </div>
            
            {/* Center Panel - Upgrade Wheel */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold mb-4">Upgrade Wheel</h2>
              
              {selectedSkin && targetSkin ? (
                <>
                  <div className="relative w-64 h-64 mb-6">
                    {/* Wheel background */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="h-1/2 bg-red-600"></div>
                      <div className="h-1/2 bg-green-600"></div>
                    </div>
                    
                    {/* Success/Fail sections with percentages */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-bold">
                        FAIL ({100 - upgradeChance}%)
                      </div>
                      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-white text-sm font-bold">
                        SUCCESS ({upgradeChance}%)
                      </div>
                    </div>
                    
                    {/* Pointer */}
                    <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1 z-10">
                      <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-white"></div>
                    </div>
                    
                    {/* Spinning part */}
                    <div 
                      ref={wheelRef}
                      className="absolute inset-0 rounded-full overflow-hidden"
                      style={{ transformOrigin: "center" }}
                    >
                      <div style={{ height: `${100 - upgradeChance}%` }} className="bg-red-600"></div>
                      <div style={{ height: `${upgradeChance}%` }} className="bg-green-600"></div>
                    </div>
                  </div>
                  
                  <Button 
                    disabled={isSpinning}
                    onClick={spinWheel}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSpinning ? "Spinning..." : "UPGRADE"}
                  </Button>
                  
                  {/* Chance slider */}
                  <div className="w-full mt-6">
                    <p className="text-sm text-gray-300 mb-2">Upgrade Chance: {upgradeChance}%</p>
                    <Slider
                      disabled={isSpinning}
                      value={[upgradeChance]}
                      min={10}
                      max={90}
                      step={1}
                      onValueChange={handleChanceChange}
                      className="mb-4"
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <p>Select a skin from your inventory to upgrade</p>
                </div>
              )}
              
              {/* Upgrade result dialog */}
              <AlertDialog open={showResult} onOpenChange={setShowResult}>
                <AlertDialogContent className="bg-gray-900 border border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className={upgradeSuccess ? "text-green-400" : "text-red-400"}>
                      {upgradeSuccess ? "Upgrade Successful!" : "Upgrade Failed!"}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-300">
                      {upgradeSuccess 
                        ? `You successfully upgraded to ${targetSkin?.name}!` 
                        : "Better luck next time. Your skin was lost in the upgrade attempt."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex justify-center py-4">
                    {upgradeSuccess && targetSkin && (
                      <div className="text-center">
                        <div className={`inline-block rounded-md overflow-hidden border-2 border-green-400`}>
                          <div className={`${getBackgroundColor(targetSkin.rarity)} text-xs text-center py-0.5`}>
                            {targetSkin.rarity}
                          </div>
                          <img 
                            src={targetSkin.image} 
                            alt={targetSkin.name} 
                            className="w-32 h-32 object-cover"
                          />
                          <div className="bg-gray-800 p-2">
                            <p className="text-sm font-medium">{targetSkin.name}</p>
                            <p className="text-green-400">${targetSkin.price.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {!upgradeSuccess && selectedSkin && (
                      <div className="text-center opacity-60">
                        <div className={`inline-block rounded-md overflow-hidden border-2 border-red-400`}>
                          <div className={`${getBackgroundColor(selectedSkin.rarity)} text-xs text-center py-0.5`}>
                            {selectedSkin.rarity}
                          </div>
                          <img 
                            src={selectedSkin.image} 
                            alt={selectedSkin.name} 
                            className="w-32 h-32 object-cover"
                          />
                          <div className="bg-gray-800 p-2">
                            <p className="text-sm font-medium">{selectedSkin.name}</p>
                            <p className="text-red-400">${selectedSkin.price.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogAction onClick={resetUpgrade} className="bg-gradient-to-r from-purple-600 to-blue-600">
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            {/* Right Panel - Selected items */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Upgrade Details</h2>
              
              {selectedSkin && targetSkin ? (
                <>
                  <div className="flex items-center justify-between space-x-4 mb-6">
                    {/* Input skin */}
                    <Card className="bg-gray-900 border-gray-700 w-1/2 overflow-hidden">
                      <div className={`${getBackgroundColor(selectedSkin.rarity)} text-xs text-center py-0.5`}>
                        {selectedSkin.rarity}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium mb-1">Your skin:</p>
                        <img 
                          src={selectedSkin.image} 
                          alt={selectedSkin.name} 
                          className="w-full aspect-square object-cover rounded mb-2"
                        />
                        <p className="text-sm font-medium truncate">{selectedSkin.name}</p>
                        <p className="text-green-400 text-sm">${selectedSkin.price.toFixed(2)}</p>
                      </div>
                    </Card>
                    
                    {/* Arrow */}
                    <div className="flex-shrink-0 text-xl text-gray-400">→</div>
                    
                    {/* Target skin */}
                    <Card className="bg-gray-900 border-gray-700 w-1/2 overflow-hidden">
                      <div className={`${getBackgroundColor(targetSkin.rarity)} text-xs text-center py-0.5`}>
                        {targetSkin.rarity}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium mb-1">Target skin:</p>
                        <img 
                          src={targetSkin.image} 
                          alt={targetSkin.name} 
                          className="w-full aspect-square object-cover rounded mb-2"
                        />
                        <p className="text-sm font-medium truncate">{targetSkin.name}</p>
                        <p className="text-green-400 text-sm">${targetSkin.price.toFixed(2)}</p>
                      </div>
                    </Card>
                  </div>
                  
                  <Separator className="bg-gray-700 my-4" />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Upgrade Price:</span>
                      <span className="text-white">${selectedSkin.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Target Value:</span>
                      <span className="text-white">${targetSkin.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Profit if Successful:</span>
                      <span className="text-green-400">${(targetSkin.price - selectedSkin.price).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-400">Success Chance:</span>
                      <span className="text-white">{upgradeChance}%</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <p>Select a skin to see upgrade details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Upgrade;
