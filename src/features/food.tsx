import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Clock3,
  MapPin,
  Minus,
  Plus,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useDemoApp } from "@/app/store";
import { DemoNotice, PageHeader, PaymentSelector } from "@/components/ui";
import { formatMoney, restaurants } from "@/data/demo";
import type { FoodItem, Order, PaymentMethod, Restaurant } from "@/models/types";

function DishPhoto({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <img
      className={`dish-photo ${className}`.trim()}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function RestaurantArt({ restaurant }: { restaurant: Restaurant }) {
  return (
    <span
      className="restaurant-art"
      style={{ "--tint": restaurant.tint } as CSSProperties}
      aria-hidden
    >
      <UtensilsCrossed size={26} />
      <DishPhoto src={restaurant.image} alt="" className="cover" />
    </span>
  );
}

function MenuThumb({ item, tint }: { item: FoodItem; tint: string }) {
  return (
    <span
      className="menu-thumb"
      style={{ "--tint": tint } as CSSProperties}
      aria-hidden
    >
      <UtensilsCrossed size={15} />
      <DishPhoto src={item.image} alt="" />
    </span>
  );
}

export function Food() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Toutes");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);
  const cuisines = useMemo(
    () => ["Toutes", ...new Set(restaurants.map((restaurant) => restaurant.cuisine))],
    [],
  );
  const list =
    filter === "Toutes"
      ? restaurants
      : restaurants.filter((restaurant) => restaurant.cuisine === filter);

  return (
    <div className="page-pad top-page food-page">
      <div className="title-row">
        <div>
          <span className="eyebrow">NAKA FOOD</span>
          <h1>Restaurants</h1>
        </div>
      </div>
      <p className="lead food-sub">
        Commandez un repas à Lomé, livré par des coursiers en mobilité décarbonée.
      </p>
      <div className="filter-tabs">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine}
            className={filter === cuisine ? "active" : ""}
            onClick={() => setFilter(cuisine)}
          >
            {cuisine}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="restaurant-list" aria-label="Chargement des restaurants">
          {[1, 2, 3, 4].map((item) => (
            <span key={item} className="skeleton restaurant-skeleton" />
          ))}
        </div>
      ) : (
        <div className="restaurant-list">
          {list.map((restaurant, index) => (
          <button
            key={restaurant.id}
            className="restaurant-card glass"
            style={
              {
                "--tint": restaurant.tint,
                "--i": index,
              } as CSSProperties
            }
            onClick={() => navigate(`/food/${restaurant.id}`)}
          >
            <RestaurantArt restaurant={restaurant} />
            <span className="restaurant-copy">
              <strong>{restaurant.name}</strong>
              <small>{restaurant.cuisine}</small>
              <span className="restaurant-meta">
                <span>
                  <Star size={13} /> {restaurant.rating}
                </span>
                <span>
                  <Clock3 size={13} /> {restaurant.delay}
                </span>
                <span>{restaurant.priceRange}</span>
              </span>
            </span>
            <ArrowRight size={19} />
          </button>
          ))}
        </div>
      )}
      <DemoNotice>Restaurants et plats fictifs · aucune commande réelle</DemoNotice>
    </div>
  );
}

export function RestaurantDetail() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useDemoApp();
  const restaurant =
    restaurants.find((item) => item.id === restaurantId) ?? restaurants[0];
  const [cart, setCart] = useState<Record<string, number>>({});
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const total = restaurant.items.reduce(
    (sum, item) => sum + item.price * (cart[item.id] ?? 0),
    0,
  );
  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  function setQty(itemId: string, qty: number) {
    setCart((current) => {
      const next = { ...current, [itemId]: qty };
      if (next[itemId] <= 0) delete next[itemId];
      return next;
    });
  }

  function confirm() {
    if (total === 0) return;
    const order: Order = {
      id: `NK-${Math.floor(1000 + Math.random() * 8999)}`,
      service: "food",
      pickup: "Tokoin, Lomé",
      destination: `${restaurant.name}, Lomé`,
      date: "À l’instant",
      amount: total,
      status: "assigned",
      restaurant: restaurant.name,
      payment,
    };
    dispatch({ type: "addOrder", payload: order });
    navigate(`/tracking/${order.id}`, { replace: true });
  }

  return (
    <div className="food-detail">
      <PageHeader title={restaurant.name} subtitle={restaurant.cuisine} />
      <div className="page-pad">
        {loading ? (
          <div aria-label="Chargement du restaurant">
            <span className="skeleton restaurant-hero-skeleton" />
            <span className="skeleton skeleton-title" />
            {[1, 2, 3].map((item) => (
              <span key={item} className="skeleton menu-item-skeleton" />
            ))}
            <span className="skeleton skeleton-title" />
            <span className="skeleton payment-skeleton" />
          </div>
        ) : (
          <>
            <div
              className="restaurant-hero restaurant-hero-photo"
              style={{ "--tint": restaurant.tint } as CSSProperties}
            >
              <DishPhoto src={restaurant.image} alt={restaurant.name} className="hero" />
              <div className="restaurant-hero-overlay">
                <span className="restaurant-meta light">
                  <span>
                    <Star size={13} /> {restaurant.rating}
                  </span>
                  <span>
                    <Clock3 size={13} /> {restaurant.delay}
                  </span>
                  <span>
                    <MapPin size={13} /> Lomé
                  </span>
                </span>
                <p className="lead">{restaurant.priceRange} · démonstration</p>
              </div>
            </div>

            <h2 className="form-title">La carte</h2>
            <div className="menu-list">
              {restaurant.items.map((item, index) => {
                const qty = cart[item.id] ?? 0;
                return (
                  <div
                    key={item.id}
                    className="menu-item glass"
                    style={{ "--i": index } as CSSProperties}
                  >
                    <MenuThumb item={item} tint={restaurant.tint} />
                    <div className="menu-item-copy">
                      <strong>{item.name}</strong>
                      <small>{item.description}</small>
                      <b>{formatMoney(item.price)}</b>
                    </div>
                    <div className="menu-item-actions">
                      {qty > 0 && (
                        <>
                          <button
                            aria-label={`Retirer ${item.name}`}
                            onClick={() => setQty(item.id, qty - 1)}
                          >
                            <Minus size={15} />
                          </button>
                          <span>{qty}</span>
                        </>
                      )}
                      <button
                        aria-label={`Ajouter ${item.name}`}
                        onClick={() => setQty(item.id, qty + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <h2 className="form-title">Paiement</h2>
            <PaymentSelector
              value={payment}
              onChange={setPayment}
              walletDisabled={state.walletBalance < total}
            />
            <DemoNotice>Commande fictive · aucun paiement réel</DemoNotice>
          </>
        )}
      </div>

      {count > 0 && (
        <div className="cart-bar">
          <div>
            <strong>{formatMoney(total)}</strong>
            <small>
              {count} article{count > 1 ? "s" : ""}
            </small>
          </div>
          <button className="primary-button" onClick={confirm}>
            Commander <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
