import {
  Waves,
  Dumbbell,
  UtensilsCrossed,
  DoorOpen,
  Flame,
  PartyPopper,
  Trophy,
  Baby,
  ChefHat,
  Sparkles,
  Laptop,
  PawPrint,
  Bike,
  Zap,
  ShieldCheck,
  Wifi,
  Beef,
  ArrowUpDown,
  CircleCheck,
} from "lucide-react";

export const ICONE_POR_COMODIDADE: Record<string, any> = {
  "Piscina": Waves,
  "Piscina infantil": Waves,
  "Parque aquático infantil": Waves,
  "Academia": Dumbbell,
  "Restaurante": UtensilsCrossed,
  "Portaria 24h": DoorOpen,
  "Sauna": Flame,
  "Salão de festas": PartyPopper,
  "Quadra poliesportiva": Trophy,
  "Playground": Baby,
  "Espaço gourmet": ChefHat,
  "Spa": Sparkles,
  "Coworking": Laptop,
  "Pet place": PawPrint,
  "Bicicletário": Bike,
  "Gerador": Zap,
  "Segurança 24h": ShieldCheck,
  "Wi-fi nas áreas comuns": Wifi,
  "Churrasqueira": Beef,
  "Elevador": ArrowUpDown,
};

export function iconeDaComodidade(nome: string) {
  return ICONE_POR_COMODIDADE[nome] ?? CircleCheck;
}
