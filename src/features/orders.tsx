import {
  FormEvent,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  Bike,
  Check,
  Clock3,
  LocateFixed,
  MapPin,
  MessageCircle,
  Navigation,
  Package,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  UserRound,
  X,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDemoApp } from "@/app/store";
import type { NakaMapProps } from "@/components/map";
import {
  Avatar,
  DemoNotice,
  PageHeader,
  PaymentSelector,
  StatusBadge,
  VehicleCard,
} from "@/components/ui";
import {
  addressCoords,
  demoAddresses,
  driverPhoto,
  formatMoney,
  initialState,
  uid,
  vehicles,
} from "@/data/demo";
import type { Order, PaymentMethod } from "@/models/types";

const NakaMap = lazy(() =>
  import("@/components/map").then((module) => ({ default: module.NakaMap })),
);

function SuspendedMap(props: NakaMapProps) {
  return (
    <Suspense
      fallback={<div className={`naka-map ${props.compact ? "compact" : ""} map-loading`} />}
    >
      <NakaMap {...props} />
    </Suspense>
  );
}

type RideDraft = {
  pickup: string;
  destination: string;
  vehicleId: string;
  payment: PaymentMethod;
  carbonCertified: boolean;
};

const defaultRide: RideDraft = {
  pickup: "Tokoin, Lomé",
  destination: "",
  vehicleId: "moto",
  payment: "cash",
  carbonCertified: false,
};

export function RideSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useDemoApp();
  const [draft, setDraft] = useState<RideDraft>(() => ({
    ...defaultRide,
    vehicleId:
      (location.state as { vehicleId?: string } | null)?.vehicleId ?? defaultRide.vehicleId,
  }));
  const [error, setError] = useState("");
  const [routeInfo, setRouteInfo] = useState<{ km: number | null; min: number | null }>({
    km: null,
    min: null,
  });
  const selected = vehicles.find((vehicle) => vehicle.id === draft.vehicleId) ?? vehicles[0];
  const pickupPoint = addressCoords[draft.pickup] ?? null;
  const destPoint = draft.destination ? (addressCoords[draft.destination] ?? null) : null;

  function proceed() {
    if (!draft.destination.trim()) {
      setError("Choisissez une destination pour obtenir une estimation.");
      return;
    }
    navigate("/ride/review", { state: { ...draft, amount: selected.price } });
  }

  return (
    <div>
      <PageHeader title="Commander un trajet" subtitle="Estimation locale · Lomé" />
      <SuspendedMap
        pickup={pickupPoint}
        destination={destPoint}
        onRouteInfo={(km, min) => setRouteInfo({ km, min })}
      />
      <div className="sheet order-sheet">
        <div className="sheet-handle" />
        <div className="route-fields">
          <label>
            <LocateFixed size={19} />
            <span>
              <small>Départ</small>
              <input
                value={draft.pickup}
                onChange={(e) => setDraft({ ...draft, pickup: e.target.value })}
              />
            </span>
          </label>
          <label className={error ? "field-error" : ""}>
            <MapPin size={19} />
            <span>
              <small>Destination</small>
              <select
                value={draft.destination}
                onChange={(e) => {
                  setError("");
                  setDraft({ ...draft, destination: e.target.value });
                }}
              >
                <option value="">Choisir une adresse</option>
                {demoAddresses
                  .filter((item) => item !== draft.pickup)
                  .map((item) => (
                    <option key={item}>{item}</option>
                  ))}
              </select>
            </span>
          </label>
          {error && <p className="form-error">{error}</p>}
        </div>
        <div className="estimate-strip">
          <Navigation size={17} />
          <span>
            {routeInfo.km != null ? "Itinéraire routier réel" : "Estimation de démonstration"}
          </span>
          <strong>
            {routeInfo.km != null
              ? `${routeInfo.km} km · ~${routeInfo.min} min`
              : "Choisissez une destination"}
          </strong>
        </div>
        <h2 className="form-title">Choisir un véhicule</h2>
        <div className="vehicle-list">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              selected={draft.vehicleId === vehicle.id}
              onClick={() => setDraft({ ...draft, vehicleId: vehicle.id })}
            />
          ))}
        </div>
        <h2 className="form-title">Moyen de paiement</h2>
        <PaymentSelector
          value={draft.payment}
          onChange={(payment) => setDraft({ ...draft, payment })}
          walletDisabled={state.walletBalance < selected.price}
        />
        <button className="primary-button full" onClick={proceed}>
          Continuer · {formatMoney(selected.price)} <ArrowRight size={18} />
        </button>
        <DemoNotice />
      </div>
    </div>
  );
}

export function RideReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [draft, setDraft] = useState<RideDraft & { amount: number }>(
    location.state ?? { ...defaultRide, destination: "Quartier Administratif, Lomé", amount: 500 },
  );
  const vehicle = vehicles.find((item) => item.id === draft.vehicleId) ?? vehicles[0];
  const total = draft.amount + (draft.carbonCertified ? 150 : 0);
  return (
    <div>
      <PageHeader title="Votre trajet" subtitle="Vérifiez avant de confirmer" />
      <div className="page-pad">
        <SuspendedMap
          compact
          pickup={addressCoords[draft.pickup] ?? null}
          destination={addressCoords[draft.destination] ?? null}
        />
        <div className="summary-card">
          <div className="route-summary">
            <span className="route-dot start" />
            <div>
              <small>Départ</small>
              <strong>{draft.pickup}</strong>
            </div>
            <span className="route-dot end" />
            <div>
              <small>Destination</small>
              <strong>{draft.destination}</strong>
            </div>
          </div>
          <div className="summary-line">
            <span>Véhicule</span>
            <strong>{vehicle.name}</strong>
          </div>
          <div className="summary-line">
            <span>Distance estimée</span>
            <strong>4,8 km</strong>
          </div>
          <label className="carbon-option">
            <span>
              <ShieldCheck size={20} />
              <span>
                <strong>Option carbone</strong>
                <small>Donnée de démonstration</small>
              </span>
            </span>
            <input
              type="checkbox"
              checked={draft.carbonCertified}
              onChange={(e) => setDraft({ ...draft, carbonCertified: e.target.checked })}
            />
          </label>
          <div className="total-line">
            <span>Total estimé</span>
            <strong>{formatMoney(total)}</strong>
          </div>
        </div>
        <h2 className="form-title">Paiement</h2>
        <PaymentSelector
          value={draft.payment}
          onChange={(payment) => setDraft({ ...draft, payment })}
        />
        <button
          className="primary-button full"
          onClick={() => navigate("/ride/search", { state: { ...draft, amount: total } })}
        >
          Confirmer la commande <ArrowRight size={18} />
        </button>
        <DemoNotice>Tarif et attribution simulés · aucun débit réel</DemoNotice>
      </div>
    </div>
  );
}

export function DriverSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useDemoApp();
  const [phase, setPhase] = useState<"searching" | "none" | "assigned">("searching");
  const added = useRef(false);
  const draft = (location.state ?? {
    ...defaultRide,
    destination: "Quartier Administratif, Lomé",
    amount: 500,
  }) as RideDraft & { amount: number };

  useEffect(() => {
    const first = window.setTimeout(() => setPhase("none"), 2400);
    return () => window.clearTimeout(first);
  }, []);

  function assignDriver() {
    setPhase("assigned");
    if (!added.current) {
      const order: Order = {
        id: `NK-${Math.floor(1000 + Math.random() * 8999)}`,
        service: "ride",
        pickup: draft.pickup,
        destination: draft.destination,
        date: "À l’instant",
        amount: draft.amount,
        status: "assigned",
        vehicleId: draft.vehicleId,
        payment: draft.payment,
        carbonCertified: draft.carbonCertified,
      };
      dispatch({ type: "addOrder", payload: order });
      added.current = true;
      window.setTimeout(() => navigate(`/tracking/${order.id}`, { replace: true }), 1300);
    }
  }

  return (
    <div>
      <PageHeader title="Recherche de pilote" subtitle="Simulation locale" />
      <div className="search-driver-page">
        <div className={`search-orbit ${phase}`}>
          <span>
            <Bike size={30} />
          </span>
        </div>
        {phase === "searching" && (
          <>
            <span className="eyebrow">RECHERCHE DE DÉMONSTRATION</span>
            <h1>Nous consultons les pilotes fictifs à proximité.</h1>
            <p>Cette animation ne représente pas un réseau réel de pilotes.</p>
          </>
        )}
        {phase === "none" && (
          <>
            <span className="eyebrow warning">AUCUN PILOTE DISPONIBLE</span>
            <h1>Aucun pilote de démonstration n’a répondu.</h1>
            <p>Vous pouvez relancer la simulation ou revenir au choix du véhicule.</p>
            <button className="primary-button full" onClick={assignDriver}>
              Relancer la simulation
            </button>
          </>
        )}
        {phase === "assigned" && (
          <>
            <span className="assigned-check">
              <Check size={30} />
            </span>
            <span className="eyebrow">PILOTE FICTIF ATTRIBUÉ</span>
            <h1>Koffi prépare votre trajet.</h1>
            <p>Ouverture du suivi de démonstration…</p>
          </>
        )}
        <div className="search-order-card">
          <div>
            <Bike size={20} />
            <span>
              <strong>{vehicles.find((v) => v.id === draft.vehicleId)?.name}</strong>
              <small>{formatMoney(draft.amount)}</small>
            </span>
          </div>
          <Clock3 size={18} />
          <strong>~14 min</strong>
        </div>
        {phase !== "assigned" && (
          <button className="cancel-button" onClick={() => navigate("/home")}>
            <X size={18} /> Annuler la recherche
          </button>
        )}
        <DemoNotice />
      </div>
    </div>
  );
}

type DeliveryDraft = {
  pickup: string;
  destination: string;
  recipient: string;
  phone: string;
  parcel: string;
  instructions: string;
  certified: boolean;
  payment: PaymentMethod;
};

export function DeliverySetup() {
  const navigate = useNavigate();
  const { state } = useDemoApp();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<DeliveryDraft>({
    pickup: "Tokoin, Lomé",
    destination: "",
    recipient: "",
    phone: "",
    parcel: "",
    instructions: "",
    certified: false,
    payment: "cash",
  });
  const price = draft.certified ? 900 : 650;

  function submit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!draft.destination) next.destination = "Choisissez une destination.";
    if (!draft.recipient.trim()) next.recipient = "Indiquez le nom du destinataire.";
    if (draft.phone.replace(/\D/g, "").length < 8)
      next.phone = "Saisissez un numéro togolais valide.";
    if (!draft.parcel.trim()) next.parcel = "Décrivez brièvement le colis.";
    setErrors(next);
    if (Object.keys(next).length === 0)
      navigate("/delivery/review", { state: { ...draft, amount: price } });
  }

  return (
    <div>
      <PageHeader title="Envoyer un colis" subtitle="Simple, local et sans paiement réel" />
      <form className="page-pad delivery-form" onSubmit={submit}>
        <div className="delivery-intro">
          <Package size={24} />
          <div>
            <strong>Les informations essentielles</strong>
            <p>Votre colis sera ajouté à l’activité de démonstration.</p>
          </div>
        </div>
        <Field
          label="Adresse de récupération"
          value={draft.pickup}
          onChange={(value) => setDraft({ ...draft, pickup: value })}
        />
        <label className="form-field">
          <span>Adresse de destination</span>
          <select
            value={draft.destination}
            onChange={(e) => setDraft({ ...draft, destination: e.target.value })}
          >
            <option value="">Choisir une adresse</option>
            {demoAddresses.map((address) => (
              <option key={address}>{address}</option>
            ))}
          </select>
          {errors.destination && <small className="form-error">{errors.destination}</small>}
        </label>
        <Field
          label="Nom du destinataire"
          value={draft.recipient}
          onChange={(value) => setDraft({ ...draft, recipient: value })}
          error={errors.recipient}
        />
        <Field
          label="Téléphone du destinataire"
          value={draft.phone}
          onChange={(value) => setDraft({ ...draft, phone: value })}
          error={errors.phone}
          inputMode="tel"
          placeholder="+228 90 00 00 00"
        />
        <Field
          label="Description du colis"
          value={draft.parcel}
          onChange={(value) => setDraft({ ...draft, parcel: value })}
          error={errors.parcel}
          placeholder="Ex. Documents, petit paquet…"
        />
        <Field
          label="Instructions (facultatif)"
          value={draft.instructions}
          onChange={(value) => setDraft({ ...draft, instructions: value })}
          placeholder="Ex. Appeler à l’arrivée"
        />
        <div className="service-choice">
          <button
            type="button"
            className={!draft.certified ? "active" : ""}
            onClick={() => setDraft({ ...draft, certified: false })}
          >
            <Sparkles />
            <strong>Express</strong>
            <small>650 FCFA</small>
          </button>
          <button
            type="button"
            className={draft.certified ? "active" : ""}
            onClick={() => setDraft({ ...draft, certified: true })}
          >
            <ShieldCheck />
            <strong>Certifiée</strong>
            <small>900 FCFA</small>
          </button>
        </div>
        <h2 className="form-title">Paiement</h2>
        <PaymentSelector
          value={draft.payment}
          onChange={(payment) => setDraft({ ...draft, payment })}
          walletDisabled={state.walletBalance < price}
        />
        <button className="primary-button full" type="submit">
          Voir le récapitulatif <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  inputMode?: "tel";
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
      />
      {error && <small className="form-error">{error}</small>}
    </label>
  );
}

export function DeliveryReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useDemoApp();
  const draft = (location.state ?? {
    pickup: "Tokoin, Lomé",
    destination: "Bè, Lomé",
    recipient: "Komi A.",
    phone: "+228 90 00 00 00",
    parcel: "Documents",
    certified: false,
    payment: "cash",
    amount: 650,
  }) as DeliveryDraft & { amount: number };

  function confirm() {
    const order: Order = {
      id: `NK-${Math.floor(1000 + Math.random() * 8999)}`,
      service: "delivery",
      pickup: draft.pickup,
      destination: draft.destination,
      recipient: draft.recipient,
      parcel: draft.parcel,
      date: "À l’instant",
      amount: draft.amount,
      status: "assigned",
      payment: draft.payment,
    };
    dispatch({ type: "addOrder", payload: order });
    navigate(`/tracking/${order.id}`, { replace: true });
  }

  return (
    <div>
      <PageHeader title="Récapitulatif du colis" subtitle="Vérifiez les informations" />
      <div className="page-pad">
        <div className="summary-card">
          <div className="parcel-badge">
            <Package size={24} />
            <div>
              <small>{draft.certified ? "Livraison certifiée" : "Livraison express"}</small>
              <strong>{draft.parcel}</strong>
            </div>
          </div>
          <div className="summary-line">
            <span>Récupération</span>
            <strong>{draft.pickup}</strong>
          </div>
          <div className="summary-line">
            <span>Destination</span>
            <strong>{draft.destination}</strong>
          </div>
          <div className="summary-line">
            <span>Destinataire</span>
            <strong>{draft.recipient}</strong>
          </div>
          <div className="summary-line">
            <span>Paiement</span>
            <strong>
              {draft.payment === "cash"
                ? "Espèces"
                : draft.payment === "mobile"
                  ? "Mobile Money"
                  : "Portefeuille"}
            </strong>
          </div>
          <div className="total-line">
            <span>Total estimé</span>
            <strong>{formatMoney(draft.amount)}</strong>
          </div>
        </div>
        <button className="primary-button full" onClick={confirm}>
          Confirmer la livraison <ArrowRight size={18} />
        </button>
        <DemoNotice>Aucun paiement ni envoi réel ne sera effectué.</DemoNotice>
      </div>
    </div>
  );
}

export function Tracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useDemoApp();
  const order =
    state.orders.find((item) => item.id === orderId) ??
    state.orders[0] ??
    initialState.orders[0];
  const [celebrate, setCelebrate] = useState(false);
  const steps = ["Commande confirmée", "Pilote attribué", "En route", "Arrivée"];
  const statusIndex =
    order.status === "assigned"
      ? 1
      : order.status === "in_progress"
        ? 2
        : order.status === "completed"
          ? 3
          : 0;

  function advance() {
    const next = order.status === "assigned" ? "in_progress" : "completed";
    dispatch({ type: "updateOrder", payload: { id: order.id, patch: { status: next } } });
    if (next === "completed") {
      setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 2400);
    }
  }

  return (
    <div>
      <PageHeader
        title={
          order.service === "ride"
            ? "Suivi du trajet"
            : order.service === "food"
              ? "Suivi de la commande"
              : "Suivi du colis"
        }
        subtitle={`Commande ${order.id}`}
        backTo={order.status === "completed" ? "/home" : undefined}
      />
      <SuspendedMap
        compact
        pickup={addressCoords[order.pickup] ?? null}
        destination={addressCoords[order.destination] ?? null}
        movingMarker={["assigned", "in_progress"].includes(order.status)}
      />
      <div className="sheet tracking-sheet">
        <div className="tracking-head">
          <div>
            <span className="eyebrow">SUIVI DE DÉMONSTRATION</span>
            <h2>{statusIndex >= 2 ? "Koffi est en route" : "Pilote fictif attribué"}</h2>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div className="driver-card">
          <Avatar
            src={driverPhoto}
            initials="KA"
            className="driver-avatar"
            alt="Koffi Adjevi"
          />
          <div>
            <strong>Koffi Adjevi</strong>
            <small>
              {order.service === "food"
                ? "Livreur de démonstration"
                : "Pilote de démonstration · Moto électrique"}
            </small>
          </div>
        </div>
        {["assigned", "in_progress", "searching"].includes(order.status) && (
          <div className="contact-actions">
            <button onClick={() => navigate(`/chat/${order.id}`)}>
              <MessageCircle size={19} />
              <span>Chat</span>
            </button>
            <a href="tel:+22800000000">
              <Phone size={19} />
              <span>Appel</span>
            </a>
            <a href="https://wa.me/22870251414" target="_blank" rel="noreferrer">
              <Smartphone size={19} />
              <span>WhatsApp</span>
            </a>
          </div>
        )}
        <div className="timeline">
          {steps.map((step, index) => (
            <div key={step} className={index <= statusIndex ? "done" : ""}>
              <span>{index < statusIndex ? <Check size={13} /> : index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
        {order.status !== "completed" && (
          <button className="secondary-button full" onClick={advance}>
            Avancer l’état de démonstration
          </button>
        )}
        {order.status === "completed" && <TripReview order={order} />}
        <DemoNotice>Position et progression simulées localement.</DemoNotice>
      </div>
      {celebrate && (
        <div className="arrival-overlay" role="status" aria-live="polite">
          <span className="arrival-check">
            <Check size={46} />
          </span>
          <strong>Destination atteinte</strong>
          <p>Merci d’avoir voyagé avec NAKA</p>
        </div>
      )}
    </div>
  );
}

const ratingChips = ["Ponctualité", "Confort", "Propreté", "Conduite"];

function TripReview({ order }: { order: Order }) {
  const { dispatch } = useDemoApp();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(0);
  const [chips, setChips] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const existing = order.rating;

  function toggleChip(chip: string) {
    setChips((current) =>
      current.includes(chip) ? current.filter((item) => item !== chip) : [...current, chip],
    );
  }

  function submit() {
    if (driver === 0) return;
    dispatch({
      type: "updateOrder",
      payload: {
        id: order.id,
        patch: {
          rating: {
            driver,
            chips,
            comment: comment.trim() || undefined,
          },
        },
      },
    });
    setSent(true);
    window.setTimeout(() => navigate("/home"), 1400);
  }

  const done = sent || Boolean(existing);
  const score = existing?.driver ?? driver;

  return (
    <div className="rating-card glass">
      {done ? (
        <div className="rating-thanks">
          <span className="rating-thanks-icon">
            <Check size={24} />
          </span>
          <div>
            <strong>Merci pour votre avis</strong>
            <p>
              {score}/5 · {existing?.chips?.join(", ") || chips.join(", ") || "sans précision"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <h3>Comment s’est passé {order.service === "food" ? "votre commande" : "votre trajet"} ?</h3>
          <div className="star-picker" role="radiogroup" aria-label="Note du chauffeur">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className={value <= driver ? "on" : ""}
                onClick={() => setDriver(value)}
                aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
                role="radio"
                aria-checked={value === driver}
              >
                <Star size={26} />
              </button>
            ))}
          </div>
          <div className="rating-chips">
            {ratingChips.map((chip) => (
              <button
                key={chip}
                className={chips.includes(chip) ? "active" : ""}
                onClick={() => toggleChip(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
          <textarea
            className="rating-comment"
            placeholder="Un commentaire (facultatif)…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
          />
          <button className="primary-button full" onClick={submit} disabled={driver === 0}>
            Envoyer l’avis <Check size={18} />
          </button>
        </>
      )}
    </div>
  );
}

export function Chat() {
  const { orderId = "NK-2408" } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useDemoApp();
  const [text, setText] = useState("");
  const order = state.orders?.find((item) => item.id === orderId);
  const messages = state.messages?.[orderId] ?? [];
  const bottomRef = useRef<HTMLDivElement>(null);
  const quick = ["Je suis devant.", "J’arrive dans 2 min.", "Merci de m’appeler."];
  const closed = order ? ["completed", "cancelled"].includes(order.status) : false;

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  function send(value = text) {
    if (!value.trim()) return;
    dispatch({
      type: "addMessage",
      payload: {
        orderId,
        message: {
          id: uid(),
          text: value.trim(),
          sender: "user",
          time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        },
      },
    });
    setText("");
    window.setTimeout(
      () =>
        dispatch({
          type: "addMessage",
          payload: {
            orderId,
            message: {
              id: uid(),
              text: "Bien reçu. Je vous tiens informé de mon arrivée.",
              sender: "driver",
              time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            },
          },
        }),
      800,
    );
  }

  if (!order) {
    return (
      <div className="chat-page">
        <PageHeader title="Discussion" subtitle={orderId} />
        <div className="chat-empty" style={{ marginTop: 40 }}>
          <MessageCircle />
          <p>Cette commande est introuvable.</p>
          <button className="primary-button" onClick={() => navigate("/home")}>
            Retour à l’accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <PageHeader title="Koffi Adjevi" subtitle={`Pilote fictif · ${orderId}`} />
      <div className="chat-notice">Conversation locale : aucun message n’est transmis.</div>
      <div className="messages">
        {closed && (
          <div className="chat-empty">
            <MessageCircle />
            <p>La conversation est terminée : le trajet ou la commande est clôturé.</p>
          </div>
        )}
        {!closed && messages.length === 0 && (
          <div className="chat-empty">
            <MessageCircle />
            <p>Commencez la conversation avec votre pilote de démonstration.</p>
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <p>{message.text}</p>
            <small>{message.time}</small>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {!closed && (
        <>
          <div className="quick-replies">
            {quick.map((item) => (
              <button key={item} onClick={() => send(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="chat-composer">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Écrire un message…"
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button onClick={() => send()} aria-label="Envoyer">
              <Send size={19} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
