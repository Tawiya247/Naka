import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  Coins,
  Home as HomeIcon,
  Leaf,
  PackageCheck,
  Search,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useDemoApp } from "@/app/store";
import { ecoTips, foodCardImage, formatMoney, vehicles } from "@/data/demo";
import {
  DemoNotice,
  NakaMark,
  SectionTitle,
  Segmented,
  UserAvatar,
  VehicleArtCard,
} from "@/components/ui";
import type { Vehicle } from "@/models/types";

export function Home() {
  const navigate = useNavigate();
  const { state, dispatch } = useDemoApp();
  const [loading, setLoading] = useState(true);
  const [sheetVehicle, setSheetVehicle] = useState<Vehicle | null>(null);
  const ride = state.serviceMode === "ride";

  const carouselRef = useRef<HTMLDivElement>(null);
  const tipIndexRef = useRef(0);
  const [tipIndex, setTipIndex] = useState(0);
  const tipCount = ecoTips.length;

  function scrollToTip(i: number) {
    const el = carouselRef.current;
    if (!el) return;
    const next = ((i % tipCount) + tipCount) % tipCount;
    tipIndexRef.current = next;
    setTipIndex(next);
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 10 : 262;
    el.scrollTo({ left: next * step, behavior: "smooth" });
  }

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const syncIndex = () => {
      const card = el.firstElementChild as HTMLElement | null;
      const step = card ? card.offsetWidth + 10 : 262;
      const index = Math.round(el.scrollLeft / step) % tipCount;
      tipIndexRef.current = index;
      setTipIndex(index);
    };
    el.addEventListener("scroll", syncIndex, { passive: true });
    const timer = window.setInterval(() => {
      if (!document.hidden) scrollToTip(tipIndexRef.current + 1);
    }, 4000);
    return () => {
      el.removeEventListener("scroll", syncIndex);
      window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 480);
    return () => window.clearTimeout(timer);
  }, []);

  function start(mode = state.serviceMode) {
    navigate(mode === "ride" ? "/ride" : "/delivery");
  }

  function continueWith(vehicle: Vehicle) {
    setSheetVehicle(null);
    navigate("/ride", { state: { vehicleId: vehicle.id } });
  }

  return (
    <div className="home-page">
      <div className="home-hero">
        <header className="home-header">
          <button
            className="home-avatar"
            onClick={() => navigate("/profile")}
            aria-label="Ouvrir le profil"
          >
            <UserAvatar className="home-avatar-inner" iconSize={20} />
          </button>
          <div className="home-brand">
            <NakaMark size={30} />
            <strong>NAKA</strong>
          </div>
          <button
            className="home-bell"
            aria-label="Notifications"
            onClick={() => window.alert("Vous n’avez aucune nouvelle notification.")}
          >
            <Bell size={20} />
          </button>
        </header>
        <Segmented
          value={state.serviceMode}
          onChange={(value) => dispatch({ type: "setMode", payload: value })}
        />
      </div>

      <section className="home-content">
        {loading ? (
          <div className="home-skeleton" aria-label="Chargement de l’accueil">
            <span className="skeleton skeleton-search" />
            <div>
              <span className="skeleton" />
              <span className="skeleton" />
            </div>
            <span className="skeleton skeleton-title" />
            <div className="skeleton-grid">
              <span className="skeleton" />
              <span className="skeleton" />
              <span className="skeleton" />
              <span className="skeleton" />
            </div>
            <span className="skeleton skeleton-banner" />
          </div>
        ) : (
          <>
            <div className="eco-carousel-wrap">
              <div
                className="eco-carousel"
                ref={carouselRef}
                aria-label="Conseils pour réduire les émissions"
              >
                {ecoTips.map((tip) => (
                  <article
                    key={tip.title}
                    className="eco-banner glass"
                    style={{ "--tint": tip.tint } as CSSProperties}
                  >
                    <span className="eco-banner-icon">
                      <Leaf size={17} />
                    </span>
                    <strong>{tip.title}</strong>
                    <p>{tip.text}</p>
                  </article>
                ))}
              </div>
              <div className="eco-controls">
                <div className="eco-dots" aria-hidden>
                  {ecoTips.map((_, index) => (
                    <span key={index} className={index === tipIndex ? "active" : ""} />
                  ))}
                </div>
              </div>
            </div>

            <button className="search-card" onClick={() => start()}>
              <span>
                <Search size={21} />
              </span>
              <div>
                <small>
                  {ride ? "Où allez-vous aujourd’hui ?" : "Une livraison à effectuer ?"}
                </small>
                <strong>
                  {ride ? "Choisir une destination" : "Indiquer le lieu de livraison"}
                </strong>
              </div>
              <ArrowRight size={20} />
            </button>

            <div className="quick-places">
              <button onClick={() => start()}>
                <HomeIcon size={17} /> Maison
              </button>
              <button onClick={() => start()}>
                <BriefcaseBusiness size={17} /> Bureau
              </button>
            </div>

            {ride ? (
              <>
                <SectionTitle title="Choisissez votre mobilité" action="Voir le trajet" />
                <div className="vehicle-home-grid">
                  {vehicles.map((vehicle) => (
                    <VehicleArtCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onClick={() => setSheetVehicle(vehicle)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <SectionTitle title="Nos services" />
                <div className="service-grid">
                  <button onClick={() => start("delivery")}>
                    <Zap />
                    <strong>Express</strong>
                    <small>Rapide & éco</small>
                  </button>
                  <button onClick={() => start("delivery")}>
                    <PackageCheck />
                    <strong>Certifiée</strong>
                    <small>Suivi de démonstration</small>
                  </button>
                </div>
              </>
            )}

            {ride && (
              <>
                <button className="food-entry glass" onClick={() => navigate("/food")}>
                  <img
                    className="food-entry-img"
                    src={foodCardImage}
                    alt=""
                    loading="lazy"
                    aria-hidden
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="food-entry-icon">
                    <UtensilsCrossed size={22} />
                  </span>
                  <span className="food-entry-copy">
                    <strong>Naka Food</strong>
                    <small>Commandez un repas à Lomé</small>
                  </span>
                  <ArrowRight size={20} />
                </button>

                <button className="points-card glass" onClick={() => navigate("/activity")}>
                  <span className="points-icon">
                    <Coins size={21} />
                  </span>
                  <span className="points-copy">
                    <strong>{state.points} pts</strong>
                    <small>Vos points NAKA</small>
                  </span>
                  <span className="points-hint">
                    Gagnez à chaque course
                    <ChevronRight size={17} />
                  </span>
                </button>
              </>
            )}
            <DemoNotice />
          </>
        )}
      </section>

      {sheetVehicle && (
        <div className="modal-backdrop" onClick={() => setSheetVehicle(null)}>
          <div className="bottom-sheet glass" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <span className="eyebrow">VÉHICULE</span>
            <h2>{sheetVehicle.name}</h2>
            <p>
              {sheetVehicle.description} · {sheetVehicle.capacity}
            </p>
            <div className="vehicle-sheet-price">
              <span>À partir de</span>
              <strong>{formatMoney(sheetVehicle.price)}</strong>
            </div>
            <p className="vehicle-sheet-note">
              Estimation pour un trajet standard · ~4,8 km · ~14 min
            </p>
            <button className="primary-button full" onClick={() => continueWith(sheetVehicle)}>
              Continuer <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
