import { FormEvent, useEffect, useState, type CSSProperties } from "react";
import {
  Bike,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Globe2,
  History,
  Info,
  Languages,
  Leaf,
  LogOut,
  Mail,
  MessageCircle,
  Moon,
  Package,
  Pencil,
  RotateCcw,
  Settings,
  Shield,
  Star,
  ShieldCheck,
  Trash2,
  Trees,
  UserRound,
  UtensilsCrossed,
  Wallet as WalletIcon,
  Zap,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useDemoApp } from "@/app/store";
import {
  DemoNotice,
  EmptyState,
  MenuRow,
  NakaMark,
  PageHeader,
  StatusBadge,
  UserAvatar,
} from "@/components/ui";
import {
  formatMoney,
  initialState,
  orderKindLabels,
  pointsPerService,
  serviceThumbs,
  uid,
} from "@/data/demo";
import type { OrderKind, OrderStatus } from "@/models/types";

const serviceIcons: Record<OrderKind, typeof Bike> = {
  ride: Bike,
  delivery: Package,
  food: UtensilsCrossed,
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "En attente",
  searching: "Recherche",
  assigned: "Assignée",
  in_progress: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
};

function filterLabel(status: OrderStatus) {
  return statusLabels[status];
}

export function Activity() {
  const { state } = useDemoApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [loading, setLoading] = useState(true);
  const orders =
    filter === "all" ? state.orders : state.orders.filter((order) => order.status === filter);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="page-pad top-page">
      <div className="title-row">
        <div>
          <span className="eyebrow">VOTRE HISTORIQUE</span>
          <h1>Activité</h1>
        </div>
        <button className="icon-button" onClick={() => navigate("/home")}>
          <Package size={21} />
        </button>
      </div>
      {!loading && orders.length > 0 && (
        <p className="activity-count">
          {orders.length} commande{orders.length > 1 ? "s" : ""}
          {filter !== "all" ? ` · filtre « ${filterLabel(filter)} »` : ""}
        </p>
      )}
      <div className="filter-tabs">
        {[
          ["all", "Toutes"],
          ["in_progress", "En cours"],
          ["completed", "Terminées"],
          ["cancelled", "Annulées"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={filter === key ? "active" : ""}
            onClick={() => setFilter(key as typeof filter)}
          >
            {label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="activity-skeleton" aria-label="Chargement de l’activité">
          {[1, 2, 3].map((item) => (
            <span key={item} className="skeleton" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={History}
          title="Aucune commande"
          text="Aucune commande ne correspond à ce filtre."
        />
      ) : (
        <div className="order-list">
          {orders.map((order, index) => {
            const Icon = serviceIcons[order.service];
            return (
              <button
                key={order.id}
                className="order-card"
                style={{ "--i": index } as CSSProperties}
                onClick={() => navigate(`/activity/${order.id}`)}
              >
                <div className="order-card-head">
                  <span className="order-kind">
                    <span className={`order-kind-icon kind-${order.service}`}>
                      <Icon size={15} />
                    </span>
                    {orderKindLabels[order.service]}
                  </span>
                  <span className="order-card-head-right">
                    {serviceThumbs[order.service] && (
                      <img
                        className="order-thumb"
                        src={serviceThumbs[order.service]}
                        alt=""
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <StatusBadge status={order.status} />
                  </span>
                </div>
                <strong>
                  {orderKindLabels[order.service]} · {order.id}
                </strong>
                <div className="mini-route">
                  <span />
                  <p>{order.pickup}</p>
                  <span />
                  <p>{order.destination}</p>
                </div>
                <div className="order-card-foot">
                  <small>
                    {order.date} ·{" "}
                    {order.service === "ride"
                      ? "Mobilité électrique"
                      : order.service === "food"
                        ? order.restaurant
                        : order.parcel}
                  </small>
                  <span className="order-card-amount">
                    {order.status === "completed" && (
                      <span className="order-points">
                        <Zap size={11} /> +{pointsPerService[order.service]}
                      </span>
                    )}
                    <strong>{formatMoney(order.amount)}</strong>
                  </span>
                </div>
                {order.rating && (
                  <div className="order-card-rating">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={i < order.rating!.driver ? "on" : ""}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
      <button className="primary-button full" onClick={() => navigate("/home")}>
        Commander un service
      </button>
    </div>
  );
}

export function OrderDetail() {
  const { orderId } = useParams();
  const { state } = useDemoApp();
  const navigate = useNavigate();
  const order =
    state.orders?.find((item) => item.id === orderId) ??
    state.orders?.[0] ??
    initialState.orders[0];
  return (
    <div>
      <PageHeader title="Détail de la commande" subtitle={order.id} />
      <div className="page-pad">
        <div className="summary-card">
          <div className="detail-title">
            <div>
              <small>{order.date}</small>
              <h2>
                {order.service === "ride"
                  ? "Trajet électrique"
                  : order.service === "food"
                    ? "Commande restaurant"
                    : "Livraison locale"}
              </h2>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="summary-line">
            <span>Départ</span>
            <strong>{order.pickup}</strong>
          </div>
          <div className="summary-line">
            <span>Destination</span>
            <strong>{order.destination}</strong>
          </div>
          {order.recipient && (
            <div className="summary-line">
              <span>Destinataire</span>
              <strong>{order.recipient}</strong>
            </div>
          )}
          <div className="total-line">
            <span>Montant simulé</span>
            <strong>{formatMoney(order.amount)}</strong>
          </div>
          {order.rating && (
            <div className="order-rating">
              <span className="order-rating-stars">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={15}
                    className={index < order.rating!.driver ? "on" : ""}
                  />
                ))}
              </span>
              <div>
                <strong>Votre avis</strong>
                <small>
                  {order.rating.chips.length > 0
                    ? order.rating.chips.join(" · ")
                    : "Note globale"}
                  {order.rating.comment ? ` — « ${order.rating.comment} »` : ""}
                </small>
              </div>
            </div>
          )}
        </div>
        {["assigned", "in_progress"].includes(order.status) && (
          <button className="primary-button full" onClick={() => navigate(`/tracking/${order.id}`)}>
            Ouvrir le suivi
          </button>
        )}
        <DemoNotice />
      </div>
    </div>
  );
}

function useCountUp(target: number, duration = 1100) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

export function Impact() {
  const { state } = useDemoApp();
  const completed = state.orders.filter((order) => order.status === "completed").length;
  const co2 = useCountUp(completed * 1.8);
  const trees = useCountUp(Math.floor(completed / 3));
  const services = useCountUp(completed);
  const ringPct = Math.min(completed / 10, 1);
  const ringOffset = 2 * Math.PI * 52 * (1 - ringPct);
  const [ringOn, setRingOn] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setRingOn(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="page-pad top-page impact-page">
      <span className="eyebrow">DONNÉES DE DÉMONSTRATION</span>
      <h1>Votre impact NAKA</h1>
      <p className="lead">
        Une lecture simple de l’impact potentiel de vos déplacements électriques.
      </p>
      <div className="impact-hero">
        <span className="impact-float f1" aria-hidden>
          <Leaf size={16} />
        </span>
        <span className="impact-float f2" aria-hidden>
          <Leaf size={12} />
        </span>
        <span className="impact-float f3" aria-hidden>
          <Zap size={14} />
        </span>
        <div className="impact-ring-wrap">
          <svg viewBox="0 0 120 120" className="impact-ring-svg" aria-hidden>
            <circle className="ring-track" cx="60" cy="60" r="52" />
            <circle
              className={`ring-fill ${ringOn ? "on" : ""}`}
              cx="60"
              cy="60"
              r="52"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={ringOn ? ringOffset : 2 * Math.PI * 52}
            />
          </svg>
          <div className="impact-ring">
            <Leaf size={26} />
            <strong>{co2.toFixed(1)}</strong>
            <small>kg CO₂</small>
          </div>
        </div>
        <div>
          <span>CO₂ potentiellement économisé</span>
          <p>Indicateur fictif pour illustrer le futur tableau d’impact.</p>
        </div>
      </div>
      <div className="impact-grid">
        <article style={{ "--i": 0 } as CSSProperties}>
          <span>
            <Trees />
          </span>
          <strong>{Math.round(trees)}</strong>
          <p>arbres préservés</p>
        </article>
        <article style={{ "--i": 1 } as CSSProperties}>
          <span>
            <Package />
          </span>
          <strong>{Math.round(services)}</strong>
          <p>services terminés</p>
        </article>
      </div>
      <div className="impact-note" style={{ "--i": 2 } as CSSProperties}>
        <ShieldCheck />
        <div>
          <strong>Transparence avant tout</strong>
          <p>
            Ces valeurs ne reposent pas encore sur une formule certifiée et ne constituent pas un
            bilan carbone.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Wallet() {
  const { state, dispatch } = useDemoApp();
  const [open, setOpen] = useState(false);
  function recharge(amount: number) {
    dispatch({
      type: "recharge",
      payload: {
        id: uid(),
        amount,
        label: "Recharge de démonstration",
        date: "À l’instant",
      },
    });
    setOpen(false);
  }
  return (
    <div>
      <PageHeader title="Mon portefeuille" subtitle="Solde de démonstration" />
      <div className="page-pad wallet-page">
        <div className="wallet-hero">
          <span>
            <WalletIcon size={20} /> Solde disponible
          </span>
          <strong>{formatMoney(state.walletBalance)}</strong>
          <button onClick={() => setOpen(true)}>Recharger mon compte</button>
        </div>
        <h2 className="form-title">Transactions récentes</h2>
        {state.transactions.length === 0 ? (
          <EmptyState
            icon={History}
            title="Aucune transaction"
            text="Vos recharges simulées apparaîtront ici."
          />
        ) : (
          <div className="transaction-list">
            {state.transactions.map((item) => (
              <div key={item.id}>
                <span>
                  <RotateCcw size={18} />
                </span>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.date}</small>
                </div>
                <b>+ {formatMoney(item.amount)}</b>
              </div>
            ))}
          </div>
        )}
        <DemoNotice>Aucune transaction financière réelle n’est effectuée.</DemoNotice>
      </div>
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="bottom-sheet glass" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <span className="eyebrow">SIMULATION UNIQUEMENT</span>
            <h2>Recharger le portefeuille</h2>
            <p>Choisissez un montant fictif. Aucune information bancaire ne sera demandée.</p>
            <div className="amount-grid">
              {[1000, 2500, 5000, 10000].map((amount) => (
                <button key={amount} onClick={() => recharge(amount)}>
                  {formatMoney(amount)}
                </button>
              ))}
            </div>
            <button className="secondary-button full" onClick={() => setOpen(false)}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Profile() {
  const { state } = useDemoApp();
  const navigate = useNavigate();
  return (
    <div className="profile-page">
      <div className="profile-hero">
        <UserAvatar className="profile-avatar" iconSize={34} />
        <h1>{state.profile.name}</h1>
        <p>{state.profile.phone}</p>
        <span className="verified">
          <Check size={15} /> Compte de démonstration
        </span>
        <button onClick={() => navigate("/profile/edit")}>
          <Pencil size={16} /> Modifier le profil
        </button>
      </div>
      <div className="profile-menu page-pad">
        <MenuRow icon={ClipboardList} label="Mes commandes" onClick={() => navigate("/activity")} />
        <MenuRow icon={WalletIcon} label="Mon portefeuille" onClick={() => navigate("/wallet")} />
        <MenuRow icon={Settings} label="Paramètres" onClick={() => navigate("/settings")} />
        <MenuRow icon={Shield} label="Confidentialité" onClick={() => navigate("/privacy")} />
        <MenuRow icon={CircleHelp} label="Centre d’aide" onClick={() => navigate("/help")} />
        <MenuRow icon={Info} label="À propos de NAKA" onClick={() => navigate("/about")} />
        <MenuRow icon={LogOut} label="Se déconnecter" danger onClick={() => navigate("/")} />
      </div>
    </div>
  );
}

export function EditProfile() {
  const { state, dispatch } = useDemoApp();
  const navigate = useNavigate();
  const [name, setName] = useState(state.profile.name);
  const [phone, setPhone] = useState(state.profile.phone);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, "").length < 8) return;
    dispatch({ type: "setProfile", payload: { name: name.trim(), phone: phone.trim() } });
    navigate("/profile");
  }
  return (
    <div>
      <PageHeader title="Modifier le profil" />
      <form className="page-pad delivery-form" onSubmit={submit}>
        <label className="form-field">
          <span>Nom complet</span>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="form-field">
          <span>Téléphone de démonstration</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
        </label>
        <button className="primary-button full">Enregistrer</button>
        <DemoNotice>Ces informations restent uniquement dans ce navigateur.</DemoNotice>
      </form>
    </div>
  );
}

export function SettingsPage() {
  const { state, dispatch } = useDemoApp();
  const navigate = useNavigate();
  function reset() {
    if (window.confirm("Réinitialiser toutes les données locales de cette démonstration ?")) {
      dispatch({ type: "reset" });
      navigate("/home");
    }
  }
  return (
    <div>
      <PageHeader title="Paramètres" />
      <div className="page-pad settings-page">
        <h2>Préférences</h2>
        <ToggleRow
          icon={Bell}
          label="Notifications Push"
          checked={state.notifications}
          onChange={() => dispatch({ type: "toggleNotifications" })}
        />
        <ToggleRow
          icon={Moon}
          label="Mode sombre"
          checked={state.darkMode}
          onChange={() => dispatch({ type: "toggleDarkMode" })}
        />
        <div className="setting-row">
          <Languages />
          <div>
            <strong>Langue</strong>
            <small>Français (FR)</small>
          </div>
        </div>
        <h2>Données locales</h2>
        <button className="setting-row danger" onClick={reset}>
          <Trash2 />
          <div>
            <strong>Réinitialiser la démonstration</strong>
            <small>Efface le profil, les messages et les commandes locales.</small>
          </div>
        </button>
        <DemoNotice>Aucun compte distant n’existe dans cette version.</DemoNotice>
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button className="setting-row" onClick={onChange}>
      <Icon />
      <strong>{label}</strong>
      <span className={`switch ${checked ? "on" : ""}`}>
        <i />
      </span>
    </button>
  );
}

export function Privacy() {
  return (
    <div>
      <PageHeader title="Confidentialité" />
      <div className="page-pad legal-page">
        <div className="privacy-banner">
          <ShieldCheck />
          <div>
            <strong>Vos données restent locales</strong>
            <p>Cette démonstration ne transmet aucune donnée à un serveur NAKA.</p>
          </div>
        </div>
        <h2>Stockage des données</h2>
        <p>
          Le profil fictif, les commandes et les préférences sont enregistrés dans le stockage local
          de ce navigateur pour rendre le prototype interactif.
        </p>
        <h2>Localisation</h2>
        <p>
          La carte, les adresses et la position du pilote sont statiques ou simulées. Aucun suivi
          GPS réel n’est réalisé.
        </p>
        <h2>Effacement</h2>
        <p>
          Vous pouvez supprimer l’ensemble des données locales depuis Paramètres, puis «
          Réinitialiser la démonstration ».
        </p>
      </div>
    </div>
  );
}

const faqs = [
  [
    "Comment suivre mon colis ?",
    "Ouvrez Activité, choisissez une commande active puis consultez son suivi de démonstration.",
  ],
  [
    "Quels sont les tarifs de livraison ?",
    "Les montants affichés sont des exemples de démonstration, pas des tarifs contractuels.",
  ],
  [
    "Comment devenir un Jason ?",
    "Ce prototype client ne gère pas le recrutement des pilotes. Contactez NAKA pour obtenir les informations officielles.",
  ],
  [
    "Quels types de véhicules sont utilisés ?",
    "Le prototype présente des motos, tricycles et voitures électriques selon le service.",
  ],
  [
    "Comment recharger mon portefeuille ?",
    "Depuis Profil ou l’accueil, ouvrez Portefeuille puis choisissez un montant fictif.",
  ],
  [
    "Comment contacter mon Jason ?",
    "Une fois un pilote fictif attribué, utilisez le chat local depuis l’écran de suivi.",
  ],
  [
    "Que faire si mon colis est endommagé ?",
    "Dans une version réelle, contactez immédiatement le support avec les informations de la commande.",
  ],
];

export function Help() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      <PageHeader title="Centre d’aide" />
      <div className="page-pad help-page">
        <h1>Comment pouvons-nous vous aider ?</h1>
        <div className="contact-grid">
          <a href="mailto:support@naka-africa.com">
            <Mail />
            <span>
              <strong>Envoyer un e-mail</strong>
              <small>support@naka-africa.com</small>
            </span>
          </a>
          <a href="https://wa.me/22870251414" target="_blank" rel="noreferrer">
            <MessageCircle />
            <span>
              <strong>WhatsApp</strong>
              <small>Ouvre une application externe</small>
            </span>
          </a>
        </div>
        <h2>Questions fréquentes</h2>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <button
              key={question}
              className={open === index ? "open" : ""}
              onClick={() => setOpen(open === index ? null : index)}
            >
              <span>
                <strong>{question}</strong>
                <ChevronDown />
              </span>
              {open === index && <p>{answer}</p>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function About() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="À propos" />
      <div className="about-page page-pad">
        <NakaMark size={72} />
        <h1>NAKA Client</h1>
        <span>Prototype interactif · Version 1.0</span>
        <p>
          NAKA imagine une mobilité urbaine décarbonée, pensée pour les déplacements et la livraison
          au Togo.
        </p>
        <p>
          Cette version est une démonstration locale destinée à illustrer l’expérience du futur
          produit mobile.
        </p>
        <MenuRow
          icon={Shield}
          label="Politique de confidentialité"
          onClick={() => navigate("/privacy")}
        />
        <MenuRow
          icon={Globe2}
          label="Site web"
          detail="Lien de démonstration"
          onClick={() => window.alert("Le site officiel n’est pas relié dans ce prototype.")}
        />
        <MenuRow
          icon={Info}
          label="Conditions générales"
          detail="Contenu à valider"
          onClick={() => window.alert("Les conditions finales devront être fournies par NAKA.")}
        />
        <small>© 2026 NAKA Technologies · Prototype de démonstration</small>
      </div>
    </div>
  );
}
