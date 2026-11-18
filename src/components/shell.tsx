import { Home, ClipboardList, Leaf, UserRound, UtensilsCrossed } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router";
import { useDemoApp } from "@/app/store";

const items = [
  { to: "/home", label: "Accueil", icon: Home },
  { to: "/food", label: "Food", icon: UtensilsCrossed },
  { to: "/activity", label: "Activité", icon: ClipboardList },
  { to: "/impact", label: "Impact", icon: Leaf },
  { to: "/profile", label: "Profil", icon: UserRound },
];

export function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-stage">
      <div className="mobile-frame">{children}</div>
    </div>
  );
}

export function AppShell() {
  const location = useLocation();
  const { state } = useDemoApp();
  const showNav = [
    "/home",
    "/food",
    "/activity",
    "/impact",
    "/profile",
  ].includes(location.pathname);
  return (
    <MobileFrame>
      <main className={showNav ? "screen with-nav" : "screen"}>
        <Outlet />
      </main>
      {showNav && (
        <nav className="bottom-nav glass" aria-label="Navigation principale">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} aria-label={label}>
              {({ isActive }) => (
                <>
                  <span className={isActive ? "nav-icon active" : "nav-icon"}>
                    <Icon size={21} />
                  </span>
                  <small>{label}</small>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}
      <div className="sr-only" aria-live="polite">
        {state.darkMode ? "Mode sombre activé" : "Mode clair activé"}
      </div>
    </MobileFrame>
  );
}
