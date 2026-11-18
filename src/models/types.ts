export type ServiceMode = "ride" | "delivery";
export type OrderKind = ServiceMode | "food";
export type PaymentMethod = "cash" | "mobile" | "wallet";
export type OrderStatus =
  | "pending"
  | "searching"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type Vehicle = {
  id: string;
  name: string;
  description: string;
  capacity: string;
  price: number;
  kind: "bike" | "tricycle" | "car";
  image?: string;
};

export type Order = {
  id: string;
  service: OrderKind;
  pickup: string;
  destination: string;
  date: string;
  amount: number;
  status: OrderStatus;
  vehicleId?: string;
  recipient?: string;
  parcel?: string;
  payment: PaymentMethod;
  carbonCertified?: boolean;
  restaurant?: string;
  rating?: {
    driver: number;
    chips: string[];
    comment?: string;
  };
};

export type FoodItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  delay: string;
  priceRange: string;
  tint: string;
  image?: string;
  items: FoodItem[];
};

export type ChatMessage = {
  id: string;
  text: string;
  sender: "user" | "driver";
  time: string;
};

export type Transaction = {
  id: string;
  label: string;
  amount: number;
  date: string;
};

export type Profile = {
  name: string;
  phone: string;
};

export type AppState = {
  onboardingDone: boolean;
  serviceMode: ServiceMode;
  points: number;
  profile: Profile;
  walletBalance: number;
  transactions: Transaction[];
  orders: Order[];
  messages: Record<string, ChatMessage[]>;
  notifications: boolean;
  darkMode: boolean;
};
