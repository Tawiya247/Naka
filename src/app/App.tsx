import { RouterProvider } from "react-router";
import { DemoAppProvider } from "@/app/store";
import { router } from "@/app/routes";

export default function App() {
  return (
    <DemoAppProvider>
      <RouterProvider router={router} />
    </DemoAppProvider>
  );
}
