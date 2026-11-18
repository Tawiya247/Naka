import { createBrowserRouter, redirect } from "react-router";
import { AppShell } from "@/components/shell";
import { RouteError } from "@/components/ui";
import { Splash, Onboarding } from "@/features/entry";
import { Home } from "@/features/home";
import {
  Chat,
  DeliveryReview,
  DeliverySetup,
  DriverSearch,
  RideReview,
  RideSetup,
  Tracking,
} from "@/features/orders";
import { Food, RestaurantDetail } from "@/features/food";
import {
  About,
  Activity,
  EditProfile,
  Help,
  Impact,
  OrderDetail,
  Privacy,
  Profile,
  SettingsPage,
  Wallet,
} from "@/features/secondary";

export const router = createBrowserRouter([
  { path: "/", Component: Splash },
  { path: "/onboarding", Component: Onboarding },
  {
    Component: AppShell,
    ErrorBoundary: RouteError,
    children: [
      { path: "/home", Component: Home },
      { path: "/ride", Component: RideSetup },
      { path: "/ride/review", Component: RideReview },
      { path: "/ride/search", Component: DriverSearch },
      { path: "/delivery", Component: DeliverySetup },
      { path: "/delivery/review", Component: DeliveryReview },
      { path: "/tracking/:orderId", Component: Tracking },
      { path: "/chat/:orderId", Component: Chat },
      { path: "/food", Component: Food },
      { path: "/food/:restaurantId", Component: RestaurantDetail },
      { path: "/activity", Component: Activity },
      { path: "/activity/:orderId", Component: OrderDetail },
      { path: "/impact", Component: Impact },
      { path: "/wallet", Component: Wallet },
      { path: "/profile", Component: Profile },
      { path: "/profile/edit", Component: EditProfile },
      { path: "/settings", Component: SettingsPage },
      { path: "/privacy", Component: Privacy },
      { path: "/help", Component: Help },
      { path: "/about", Component: About },
    ],
  },
  { path: "*", loader: () => redirect("/home") },
]);
