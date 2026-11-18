import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useDemoApp } from "@/app/store";
import { MobileFrame } from "@/components/shell";
import { NakaMark } from "@/components/ui";
import onboarding1 from "@/assets/references/onboarding-1.jpg";
import onboarding2 from "@/assets/references/onboarding-2.jpg";
import onboarding3 from "@/assets/references/onboarding-3.jpg";

const slides = [
  {
    title: "La Révolution silencieuse",
    text: "Chaque kilomètre compte. Profitez d’une mobilité urbaine rapide, silencieuse et 100 % électrique.",
    image: onboarding1,
  },
  {
    title: "L'Excellence à chaque déplacement",
    text: "Une prise en charge rigoureuse et une expérience fiable pour vos documents et colis les plus sensibles.",
    image: onboarding2,
  },
  {
    title: "Le Contrôle total, en temps réel",
    text: "Suivez chaque déplacement de démonstration avec précision et visualisez votre impact au quotidien.",
    image: onboarding3,
  },
];

export function Splash() {
  const navigate = useNavigate();
  const { state } = useDemoApp();
  useEffect(() => {
    const timer = window.setTimeout(
      () => navigate(state.onboardingDone ? "/home" : "/onboarding", { replace: true }),
      1100,
    );
    return () => window.clearTimeout(timer);
  }, [navigate, state.onboardingDone]);

  return (
    <MobileFrame>
      <div className="splash">
        <div className="splash-orb" />
        <NakaMark size={76} />
        <h1>NAKA</h1>
        <p>La mobilité qui avance autrement.</p>
        <span>NAKA Client · Démonstration</span>
      </div>
    </MobileFrame>
  );
}

export function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { dispatch } = useDemoApp();
  const slide = slides[index];

  function finish() {
    dispatch({ type: "completeOnboarding" });
    navigate("/home", { replace: true });
  }

  return (
    <MobileFrame>
      <div className="onboarding">
        <button className="skip-button" onClick={finish}>
          Passer
        </button>
        <div className="onboarding-image" style={{ backgroundImage: `url(${slide.image})` }} />
        <div className="onboarding-copy" key={slide.title}>
          <span className="eyebrow">NAKA CLIENT</span>
          <h1>{slide.title}</h1>
          <p>{slide.text}</p>
        </div>
        <div className="onboarding-footer">
          <div className="dots" aria-label={`Étape ${index + 1} sur 3`}>
            {slides.map((_, itemIndex) => (
              <span key={itemIndex} className={itemIndex === index ? "active" : ""} />
            ))}
          </div>
          <button
            className="primary-button round-action"
            onClick={() => (index === 2 ? finish() : setIndex(index + 1))}
          >
            {index === 2 ? "Commencer" : "Suivant"} <ArrowRight size={19} />
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
