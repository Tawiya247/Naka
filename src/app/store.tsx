import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { initialState, pointsPerService } from "@/data/demo";
import type {
  AppState,
  ChatMessage,
  Order,
  Profile,
  ServiceMode,
  Transaction,
} from "@/models/types";

type Action =
  | { type: "completeOnboarding" }
  | { type: "setMode"; payload: ServiceMode }
  | { type: "setProfile"; payload: Profile }
  | { type: "addOrder"; payload: Order }
  | { type: "updateOrder"; payload: { id: string; patch: Partial<Order> } }
  | { type: "addMessage"; payload: { orderId: string; message: ChatMessage } }
  | { type: "recharge"; payload: Transaction }
  | { type: "toggleNotifications" }
  | { type: "toggleDarkMode" }
  | { type: "reset" };

type Store = { state: AppState; dispatch: React.Dispatch<Action> };
const StoreContext = createContext<Store | null>(null);
const STORAGE_KEY = "naka-client-demo-v1";

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const saved = JSON.parse(raw) as Partial<AppState>;
    return {
      ...initialState,
      ...saved,
      onboardingDone:
        typeof saved.onboardingDone === "boolean"
          ? saved.onboardingDone
          : initialState.onboardingDone,
      serviceMode:
        saved.serviceMode === "ride" || saved.serviceMode === "delivery"
          ? saved.serviceMode
          : initialState.serviceMode,
      points: typeof saved.points === "number" ? saved.points : initialState.points,
      walletBalance:
        typeof saved.walletBalance === "number"
          ? saved.walletBalance
          : initialState.walletBalance,
      notifications:
        typeof saved.notifications === "boolean"
          ? saved.notifications
          : initialState.notifications,
      darkMode: typeof saved.darkMode === "boolean" ? saved.darkMode : initialState.darkMode,
      profile: {
        ...initialState.profile,
        ...(saved.profile && typeof saved.profile === "object" ? saved.profile : {}),
      },
      transactions: Array.isArray(saved.transactions)
        ? saved.transactions
        : initialState.transactions,
      orders: Array.isArray(saved.orders) ? saved.orders : initialState.orders,
      messages:
        saved.messages && typeof saved.messages === "object" && !Array.isArray(saved.messages)
          ? saved.messages
          : initialState.messages,
    };
  } catch {
    return initialState;
  }
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "completeOnboarding":
      return { ...state, onboardingDone: true };
    case "setMode":
      return { ...state, serviceMode: action.payload };
    case "setProfile":
      return { ...state, profile: action.payload };
    case "addOrder":
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        points: state.points + pointsPerService[action.payload.service],
      };
    case "updateOrder":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? { ...order, ...action.payload.patch } : order,
        ),
      };
    case "addMessage":
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.orderId]: [
            ...(state.messages[action.payload.orderId] ?? []),
            action.payload.message,
          ],
        },
      };
    case "recharge":
      return {
        ...state,
        walletBalance: state.walletBalance + action.payload.amount,
        transactions: [action.payload, ...state.transactions],
      };
    case "toggleNotifications":
      return { ...state, notifications: !state.notifications };
    case "toggleDarkMode":
      return { ...state, darkMode: !state.darkMode };
    case "reset":
      return { ...initialState, onboardingDone: true };
  }
}

export function DemoAppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    document.documentElement.dataset.theme = state.darkMode ? "dark" : "light";
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useDemoApp() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useDemoApp must be used inside DemoAppProvider");
  return store;
}
