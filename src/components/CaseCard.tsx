
import { Button } from "@/components/ui/button";

interface Item {
  id: number;
  name: string;
  price: number;
  rarity: string;
  image: string;
}

interface CaseData {
  id: number;
  name: string;
  price: number;
  image: string;
  items: Item[];
}

interface CaseCardProps {
  caseData: CaseData;
  onClick: () => void;
  disabled?: boolean;
}

export const CaseCard = ({ caseData, onClick, disabled = false }: CaseCardProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "covert": return "bg-red-500";
      case "classified": return "bg-pink-500";
      case "restricted": return "bg-purple-500";
      case "mil-spec": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="group relative bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-70 z-0"></div>
      
      <div className="relative z-10 p-5">
        <div className="mb-4 flex justify-center">
          <img 
            src={caseData.image} 
            alt={caseData.name} 
            className="h-32 object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        <h3 className="text-xl font-bold text-center mb-2">{caseData.name}</h3>
        
        <div className="flex justify-center mb-4">
          <div className="px-3 py-1 bg-gray-700 rounded-full text-yellow-400 font-medium">
            {caseData.price} ₽
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-1 mb-4">
          {caseData.items.map(item => (
            <div 
              key={item.id} 
              className={`h-2 ${getRarityColor(item.rarity)} rounded-full`}
              title={item.name}
            ></div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={onClick} 
            disabled={disabled}
            className="w-full relative overflow-hidden group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-500"
          >
            {disabled ? "Войдите в аккаунт" : "Открыть кейс"}
            <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
          </Button>
        </div>
      </div>
    </div>
  );
};
