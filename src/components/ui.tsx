import {
  ArrowLeft,
  Bike,
  Car,
  Check,
  ChevronRight,
  Package,
  Truck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useRouteError } from "react-router";
import { formatMoney } from "@/data/demo";
import type { OrderStatus, PaymentMethod, Vehicle } from "@/models/types";

export function RouteError() {
  const error = useRouteError();
  const message = error instanceof Error ? error.message : "Erreur inconnue";
  return (
    <div className="route-error">
      <NakaMark />
      <h2>Une erreur est survenue</h2>
      <p>{message}</p>
      <button className="primary-button" onClick={() => window.location.reload()}>
        Recharger l’application
      </button>
    </div>
  );
}

export function NakaMark({ size = 42 }: { size?: number }) {
  return (
    <div className="naka-mark" style={{ width: size, height: size }} aria-label="NAKA">
      <span />
      <span />
    </div>
  );
}

export function Avatar({
  src,
  initials,
  className,
  alt,
}: {
  src?: string;
  initials: string;
  className?: string;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <img
        className={`avatar-img ${className ?? ""}`}
        src={src}
        alt={alt ?? initials}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }
  return <span className={className}>{initials}</span>;
}

export function UserAvatar({
  className,
  iconSize = 22,
}: {
  className?: string;
  iconSize?: number;
}) {
  return (
    <span className={`user-avatar ${className ?? ""}`} aria-hidden>
      <UserRound size={iconSize} strokeWidth={2.2} />
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  backTo,
}: {
  title: string;
  subtitle?: string;
  backTo?: string;
}) {
  const navigate = useNavigate();
  return (
    <header className="page-header">
      <button
        className="icon-button"
        onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
        aria-label="Retour"
      >
        <ArrowLeft size={22} />
      </button>
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <span className="header-spacer" />
    </header>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action && <button>{action}</button>}
    </div>
  );
}

export function Segmented({
  value,
  onChange,
}: {
  value: "ride" | "delivery";
  onChange: (value: "ride" | "delivery") => void;
}) {
  return (
    <div className="segmented glass">
      <button className={value === "ride" ? "active" : ""} onClick={() => onChange("ride")}>
        <Car size={18} /> Trajet
      </button>
      <button className={value === "delivery" ? "active" : ""} onClick={() => onChange("delivery")}>
        <Truck size={18} /> Colis
      </button>
    </div>
  );
}

function vehicleIcon(vehicle: Vehicle) {
  if (vehicle.kind === "bike") return Bike;
  if (vehicle.kind === "tricycle") return Truck;
  return Car;
}

export function VehicleCard({
  vehicle,
  selected,
  compact,
  onClick,
}: {
  vehicle: Vehicle;
  selected?: boolean;
  compact?: boolean;
  onClick?: () => void;
}) {
  const Icon = vehicleIcon(vehicle);
  return (
    <button
      className={`vehicle-card ${selected ? "selected" : ""} ${compact ? "compact" : ""}`}
      onClick={onClick}
    >
      <span className="vehicle-icon">
        <Icon size={22} />
      </span>
      <span className="vehicle-copy">
        <strong>{vehicle.name}</strong>
        <small>{vehicle.description}</small>
      </span>
      <span className="vehicle-price">{formatMoney(vehicle.price).replace("FCFA", "F")}</span>
    </button>
  );
}

function VehicleArt({ vehicle, size }: { vehicle: Vehicle; size: number }) {
  const Icon = vehicleIcon(vehicle);
  const [failed, setFailed] = useState(false);
  if (vehicle.image && !failed) {
    return (
      <img
        className="vehicle-art-img"
        src={vehicle.image}
        alt={vehicle.name}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <span className="vehicle-art" data-kind={vehicle.kind} aria-hidden>
      <Icon size={size} />
    </span>
  );
}

export function VehicleArtCard({
  vehicle,
  onClick,
}: {
  vehicle: Vehicle;
  onClick?: () => void;
}) {
  return (
    <button className="vehicle-art-card glass" onClick={onClick}>
      <VehicleArt vehicle={vehicle} size={30} />
      <span className="vehicle-art-copy">
        <strong>{vehicle.name}</strong>
        <small>
          {vehicle.capacity} · dès {formatMoney(vehicle.price)}
        </small>
      </span>
    </button>
  );
}

const paymentLabels: Record<PaymentMethod, string> = {
  cash: "Espèces",
  mobile: "Mobile Money",
  wallet: "Portefeuille",
};

export function PaymentSelector({
  value,
  onChange,
  walletDisabled,
}: {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  walletDisabled?: boolean;
}) {
  return (
    <div className="payment-grid" role="radiogroup" aria-label="Moyen de paiement">
      {(Object.keys(paymentLabels) as PaymentMethod[]).map((key) => (
        <button
          key={key}
          disabled={key === "wallet" && walletDisabled}
          className={value === key ? "active" : ""}
          onClick={() => onChange(key)}
          role="radio"
          aria-checked={value === key}
        >
          {value === key && <Check size={15} />}
          {paymentLabels[key]}
        </button>
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const labels: Record<OrderStatus, string> = {
    pending: "En attente",
    searching: "Recherche",
    assigned: "Attribuée",
    in_progress: "En cours",
    completed: "Terminée",
    cancelled: "Annulée",
  };
  return <span className={`status status-${status}`}>{labels[status]}</span>;
}

export function MenuRow({
  icon: Icon,
  label,
  detail,
  onClick,
  danger,
}: {
  icon: LucideIcon;
  label: string;
  detail?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button className={`menu-row ${danger ? "danger" : ""}`} onClick={onClick}>
      <span className="menu-icon">
        <Icon size={20} />
      </span>
      <span>
        <strong>{label}</strong>
        {detail && <small>{detail}</small>}
      </span>
      <ChevronRight size={18} />
    </button>
  );
}

export function DemoNotice({
  children = "Version de démonstration · aucune opération réelle",
}: {
  children?: string;
}) {
  return <p className="demo-notice">{children}</p>;
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <span className={`skeleton ${className}`} />;
}

export function EmptyState({
  icon: Icon = Package,
  title,
  text,
}: {
  icon?: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="empty-state">
      <span>
        <Icon size={25} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
