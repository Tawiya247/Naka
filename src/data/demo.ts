import motoImg from "@/assets/vehicles/moto.png";
import tricycleImg from "@/assets/vehicles/tricycle.png";
import voitureEcoImg from "@/assets/vehicles/voiture-eco.png";
import voitureConfortImg from "@/assets/vehicles/voiture-confort.png";
import type { AppState, OrderKind, OrderStatus, Restaurant, Vehicle } from "@/models/types";

export const vehicles: Vehicle[] = [
  {
    id: "moto",
    name: "Moto Éco",
    description: "Rapide & agile",
    capacity: "1 place",
    price: 500,
    kind: "bike",
    image: motoImg,
  },
  {
    id: "tricycle",
    name: "Tricycle",
    description: "Spacieux · Bagages",
    capacity: "2 places",
    price: 600,
    kind: "tricycle",
    image: tricycleImg,
  },
  {
    id: "eco",
    name: "Voiture Éco",
    description: "Citadine électrique",
    capacity: "4 places",
    price: 1500,
    kind: "car",
    image: voitureEcoImg,
  },
  {
    id: "comfort",
    name: "Voiture Confort",
    description: "Berline tout confort",
    capacity: "4 places",
    price: 2200,
    kind: "car",
    image: voitureConfortImg,
  },
];

export const driverPhoto =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop";

export const foodCardImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&auto=format&fit=crop";

export const serviceThumbs: Record<OrderKind, string> = {
  ride: vehicles[0].image ?? "",
  delivery: vehicles[1].image ?? "",
  food: foodCardImage,
};

export const statusLabels: Record<OrderStatus, string> = {
  pending: "En attente",
  searching: "Recherche",
  assigned: "Pilote attribué",
  in_progress: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
};

export const orderKindLabels: Record<OrderKind, string> = {
  ride: "Trajet",
  delivery: "Colis",
  food: "Restaurant",
};

export const pointsPerService: Record<OrderKind, number> = {
  ride: 50,
  delivery: 40,
  food: 30,
};

export const ecoTips = [
  {
    title: "Roulez groupé, roulez vert",
    text: "Un trajet partagé en tricycle émet jusqu’à 60 % de CO₂ en moins qu’une voiture solo.",
    tint: "#10a96b",
  },
  {
    title: "Le vélo cargo pour les petits colis",
    text: "Sous 5 km, la livraison à vélo cargo reste la solution la plus propre en ville.",
    tint: "#19b9d2",
  },
  {
    title: "Anticipez vos courses",
    text: "Planifier son trajet hors heure de pointe réduit le temps de route et l’impact.",
    tint: "#24ce7b",
  },
  {
    title: "Chaque course compte",
    text: "Vos points NAKA récompensent chaque trajet réalisé en mobilité décarbonée.",
    tint: "#0b3429",
  },
];

const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const restaurants: Restaurant[] = [
  {
    id: "maquis-centre",
    name: "Le Maquis du Centre",
    cuisine: "Cuisine togolaise",
    rating: 4.6,
    delay: "25–35 min",
    priceRange: "500–1500 FCFA",
    tint: "#10a96b",
    image: unsplash("photo-1604329760661-e71dc83f8f26"),
    items: [
      {
        id: "i1",
        name: "Riz sauce graine",
        description: "Le classique avec poisson braisé et légumes",
        price: 800,
        image: unsplash("photo-1512058564366-18510be2db19", 400),
      },
      {
        id: "i2",
        name: "Akoumé + sauce",
        description: "Pâte de maïs avec sauce arachide",
        price: 600,
        image: unsplash("photo-1504674900247-0877df9cc836", 400),
      },
      {
        id: "i3",
        name: "Poulet bicyclette",
        description: "Quart de poulet grillé, alloco en accompagnement",
        price: 1500,
        image: unsplash("photo-1488477181946-6428a0291777", 400),
      },
    ],
  },
  {
    id: "saveur-bouffe",
    name: "Saveurs de Bouffe",
    cuisine: "Grillades & fast-food",
    rating: 4.4,
    delay: "20–30 min",
    priceRange: "700–2500 FCFA",
    tint: "#19b9d2",
    image: unsplash("photo-1555939594-58d7cb561ad1"),
    items: [
      {
        id: "i1",
        name: "Brochette mixte (5)",
        description: "Bœuf, agneau et poulet au charbon",
        price: 1200,
        image: unsplash("photo-1555939594-58d7cb561ad1", 400),
      },
      {
        id: "i2",
        name: "Poisson braisé + alloco",
        description: "Tilapia grillé, banane plantain frite",
        price: 1800,
        image: unsplash("photo-1467003909585-2f8a72700288", 400),
      },
      {
        id: "i3",
        name: "Burger local",
        description: "Bœuf haché, oignons caramélisés, frites",
        price: 1400,
        image: unsplash("photo-1568901346375-23c9450c58cd", 400),
      },
    ],
  },
  {
    id: "chez-awa",
    name: "Chez Awa",
    cuisine: "Pâtisseries & desserts",
    rating: 4.8,
    delay: "15–25 min",
    priceRange: "300–1200 FCFA",
    tint: "#a46a12",
    image: unsplash("photo-1578985545062-69928b1d9587"),
    items: [
      {
        id: "i1",
        name: "Gâteau moelleux",
        description: "Gâteau au chocolat fait maison",
        price: 500,
        image: unsplash("photo-1578985545062-69928b1d9587", 400),
      },
      {
        id: "i2",
        name: "Beignets de banane",
        description: "4 beignets chauds au sucre",
        price: 300,
        image: unsplash("photo-1565958011703-44f9829ba187", 400),
      },
      {
        id: "i3",
        name: "Salade de fruits",
        description: "Fruits de saison au jus de gingembre",
        price: 600,
        image: unsplash("photo-1512621776951-a57141f2eefd", 400),
      },
    ],
  },
  {
    id: "le-ptit-marseillais",
    name: "Le Petit Marseille",
    cuisine: "Boulangerie & sandwiches",
    rating: 4.2,
    delay: "10–20 min",
    priceRange: "400–1000 FCFA",
    tint: "#d75555",
    image: unsplash("photo-1555507036-ab1f4038808a"),
    items: [
      {
        id: "i1",
        name: "Sandwich jambon-fromage",
        description: "Baguette croustillante, crudités",
        price: 700,
        image: unsplash("photo-1528735602780-2552fd46c7af", 400),
      },
      {
        id: "i2",
        name: "Croissant + jus",
        description: "Viennoiserie du jour et jus d’orange",
        price: 450,
        image: unsplash("photo-1555507036-ab1f4038808a", 400),
      },
      {
        id: "i3",
        name: "Tartine avocat-poulet",
        description: "Pain complet, avocat écrasé, poulet grillé",
        price: 900,
        image: unsplash("photo-1541519227354-08fa5d50c44d", 400),
      },
    ],
  },
];

export const initialState: AppState = {
  onboardingDone: false,
  serviceMode: "ride",
  points: 240,
  profile: { name: "Afi Mensah", phone: "+228 90 00 00 00" },
  walletBalance: 0,
  transactions: [],
  notifications: true,
  darkMode: false,
  messages: {
    "NK-2408": [
      {
        id: "m1",
        text: "Bonjour, je viens de démarrer vers votre point de départ.",
        sender: "driver",
        time: "10:24",
      },
      {
        id: "m2",
        text: "Parfait, je vous attends devant l’entrée principale.",
        sender: "user",
        time: "10:25",
      },
    ],
  },
  orders: [
    {
      id: "NK-2408",
      service: "ride",
      pickup: "Tokoin, Lomé",
      destination: "Quartier Administratif, Lomé",
      date: "Aujourd’hui, 10:18",
      amount: 1500,
      status: "in_progress",
      vehicleId: "eco",
      payment: "cash",
    },
    {
      id: "NK-2391",
      service: "delivery",
      pickup: "Bè, Lomé",
      destination: "Agoè, Lomé",
      date: "07 nov. 2026, 16:42",
      amount: 600,
      status: "completed",
      recipient: "Komi A.",
      parcel: "Documents",
      payment: "mobile",
    },
    {
      id: "NK-2375",
      service: "ride",
      pickup: "Boulevard du 13 Janvier",
      destination: "Adidogomé, Lomé",
      date: "02 nov. 2026, 08:15",
      amount: 500,
      status: "cancelled",
      vehicleId: "moto",
      payment: "cash",
    },
  ],
};

export function formatMoney(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

export function uid() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  );
}

export const demoAddresses = [
  "Quartier Administratif, Lomé",
  "Tokoin, Lomé",
  "Bè, Lomé",
  "Agoè, Lomé",
];

export const addressCoords: Record<string, { lat: number; lng: number }> = {
  "Quartier Administratif, Lomé": { lat: 6.1261, lng: 1.2163 },
  "Tokoin, Lomé": { lat: 6.1702, lng: 1.256 },
  "Bè, Lomé": { lat: 6.1427, lng: 1.2485 },
  "Agoè, Lomé": { lat: 6.2484, lng: 1.2005 },
};
