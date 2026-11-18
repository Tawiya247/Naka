# Plan d’implémentation — Prototype Android NAKA Client

## 1. Objectif et nature du livrable

Construire dans le dépôt React + Vite existant un prototype mobile Android haute fidélité, interactif et entièrement en français de **NAKA Client**.

Le livrable sera :

- une application web mobile-first exécutable dans le panneau de prévisualisation Figma Make ;
- une référence visuelle et fonctionnelle destinée à guider une future implémentation Flutter ;
- un prototype local sans backend, sans paiement réel, sans géolocalisation réelle et sans réseau de pilotes ;
- une refonte cohérente des 19 captures du PDF, complétée par les parcours explicitement demandés dans le brief mais absents des captures : colis, suivi, chat, états de chargement et erreurs.

Le dépôt reste un projet React/Vite. Il ne sera pas converti en projet Flutter.

## 2. Constat d’audit

### Dépôt actuel

- React 19, Vite 8, TypeScript 5.7 et Tailwind CSS v4.
- `src/App.tsx` est vide hormis un conteneur centré.
- `src/index.css` ne contient que l’import Tailwind.
- Aucun composant, routeur, modèle, asset métier ou test existant.
- Aucun backend connecté.

### Références reçues

- Un brief complet décrivant le MVP NAKA Client.
- Un PDF de 19 captures Android, chacune fournie comme image pleine page.
- Le PDF n’embarque pas le logo, les illustrations d’onboarding ou la carte comme fichiers séparés.

### Cartographie des 19 captures

- Pages 1–3 : trois étapes de l’onboarding.
- Pages 4–6 : plusieurs états d’un même accueil, avec onglets Trajet/Colis et bannières différentes.
- Pages 7–9 : parcours Trajet, depuis la carte jusqu’à la recherche de pilote.
- Page 10 : Activité / Mes Courses.
- Page 11 : récapitulatif et paiement d’une commande.
- Page 12 : Impact NAKA.
- Page 13 : Profil.
- Pages 14–15 : même écran Portefeuille en double.
- Page 16 : Paramètres.
- Page 17 : Confidentialité.
- Page 18 : Centre d’aide.
- Page 19 : À propos de NAKA.

Les doublons et états successifs seront fusionnés dans des écrans interactifs plutôt que reproduits comme pages indépendantes.

## 3. Principes produit

### Périmètre fonctionnel

Le prototype couvrira :

1. Splash.
2. Onboarding en trois étapes.
3. Accueil avec bascule Trajet/Colis.
4. Commande d’un trajet.
5. Commande d’une livraison.
6. Récapitulatif et paiement simulé.
7. Recherche locale de pilote avec plusieurs états.
8. Suivi local d’une commande.
9. Chat local associé à une commande.
10. Activité et détail d’une commande.
11. Impact NAKA.
12. Portefeuille et recharge simulée.
13. Profil et modification locale.
14. Paramètres fonctionnels.
15. Confidentialité.
16. Centre d’aide et FAQ.
17. À propos.
18. États skeleton, vide, erreur et confirmation utiles.

### Hors périmètre

- Backend, API, serveur, Firebase ou base distante.
- Authentification réelle.
- Paiement réel ou collecte d’informations bancaires.
- Cartographie, GPS ou suivi en temps réel.
- Attribution réelle de pilote.
- Messages distants ou WebSocket.
- Calcul certifié de CO₂.
- Conversion du dépôt en Flutter.

Toutes les données commerciales et environnementales seront explicitement présentées comme des données de démonstration.

## 4. Architecture technique

### Dépendances

Ajouter uniquement :

- `react-router` pour la navigation en Data mode, conformément à la procédure du projet ;
- `lucide-react` pour un système d’icônes homogène et accessible.

Ne pas ajouter de librairie d’animation, de cartes, de formulaires ou de state management. Les transitions seront réalisées en CSS et l’état avec React.

### Organisation proposée

```text
src/
  app/
    App.tsx
    routes.tsx
    AppShell.tsx
    providers/
      DemoAppProvider.tsx
  assets/
    references/
      onboarding-1.jpg
      onboarding-2.jpg
      onboarding-3.jpg
      map-reference.jpg
  components/
    app/
      MobileFrame.tsx
      TopBar.tsx
      BottomNavigation.tsx
      PageHeader.tsx
      DemoNotice.tsx
    feedback/
      Skeleton.tsx
      Toast.tsx
      EmptyState.tsx
      ErrorState.tsx
      ConfirmDialog.tsx
    glass/
      GlassSurface.tsx
      GlassSegmentedControl.tsx
      GlassBottomSheet.tsx
    forms/
      Field.tsx
      AddressField.tsx
      SelectRow.tsx
      ToggleRow.tsx
    order/
      VehicleCard.tsx
      PaymentSelector.tsx
      RouteSummary.tsx
      OrderStatusBadge.tsx
    shared/
      NakaMark.tsx
      Money.tsx
      SectionHeader.tsx
  data/
    demoData.ts
    demoConfig.ts
    demoRepository.ts
  features/
    splash/
    onboarding/
    home/
    ride/
    delivery/
    tracking/
    chat/
    activity/
    impact/
    wallet/
    profile/
    settings/
    help/
    about/
  models/
    order.ts
    vehicle.ts
    payment.ts
    chat.ts
    profile.ts
    transaction.ts
  styles/
    tokens.css
    animations.css
  index.css
  main.tsx
```

Les dossiers de fonctionnalités contiendront les écrans et les composants spécifiques. Les composants génériques resteront dans `components/`.

### Routage

Utiliser `createBrowserRouter` et `RouterProvider`.

Routes prévues :

```text
/                         splash / redirection initiale
/onboarding               onboarding
/home                     accueil
/ride                     configuration trajet
/ride/review              récapitulatif trajet
/ride/search              recherche pilote
/delivery                 formulaire colis
/delivery/review          récapitulatif colis
/tracking/:orderId        suivi local
/chat/:orderId            chat local
/activity                 activité
/activity/:orderId        détail commande
/impact                   impact
/wallet                   portefeuille
/profile                  profil
/profile/edit             modifier le profil
/settings                 paramètres
/privacy                  confidentialité
/help                     centre d’aide
/about                    à propos
*                         redirection vers /home
```

Le retour Android simulé sera cohérent via les boutons de retour et l’historique React Router.

### État et persistance

Créer un `DemoAppProvider` basé sur `useReducer` avec des actions typées.

État global :

- onboarding terminé ou non ;
- mode Trajet/Colis choisi ;
- profil de démonstration ;
- commande en cours ;
- liste des commandes ;
- état de recherche de pilote ;
- messages par commande ;
- solde et transactions ;
- préférences : notifications, langue, thème ;
- toasts et modales globales.

Persister dans `localStorage` :

- onboarding terminé ;
- profil modifié ;
- préférences ;
- solde/transactions simulés ;
- commandes et messages créés localement.

Prévoir une migration minimale par numéro de version de stockage. En cas de valeur invalide ou illisible, restaurer silencieusement les données de démonstration.

Le repository local exposera des promesses avec un délai court configurable pour rendre visibles les skeletons, sans disperser de `setTimeout` dans les écrans.

## 5. Modèles et données de démonstration

### Véhicules

- Moto Éco : 500 FCFA.
- Tricycle : 600 FCFA.
- Voiture Éco : 1 500 FCFA.
- Voiture Confort : 2 200 FCFA.

Chaque véhicule aura un identifiant, une capacité, un libellé, une description, une icône, un prix de démonstration et une disponibilité simulée.

### Paiements

- Espèces.
- Mobile Money, strictement simulé.
- Portefeuille NAKA, désactivé si le solde est insuffisant.

Aucun formulaire bancaire, numéro de carte ou identifiant Mobile Money ne sera demandé.

### Profil

Utiliser un profil entièrement fictif, par exemple :

- nom : Afi Mensah ;
- téléphone : +228 90 00 00 00 ;
- compte de démonstration vérifié.

Ne pas reprendre le nom ni le numéro personnel visibles dans les captures.

### Adresses

Utiliser des exemples cohérents avec Lomé :

- Quartier Administratif, Lomé ;
- Tokoin, Lomé ;
- Bè, Lomé ;
- Agoè, Lomé ;
- Boulevard du 13 Janvier, Lomé.

### Commandes

Précharger des exemples couvrant :

- en attente ;
- en cours ;
- terminée ;
- annulée.

Les identifiants seront clairement fictifs. Les métriques d’impact porteront la mention « Données de démonstration ».

## 6. Design system

### Direction visuelle

Conserver l’identité vert profond / vert vif / cyan aperçue dans les références, mais améliorer la hiérarchie et réduire les grands espaces inutiles.

Palette initiale à centraliser en variables CSS :

- `--naka-950` : vert profond pour en-têtes et texte de marque ;
- `--naka-800` : vert foncé ;
- `--naka-500` : vert principal d’action ;
- `--naka-300` : vert clair ;
- `--cyan-500` : accent secondaire ;
- neutres chauds très clairs pour le fond ;
- gris bleuté pour textes secondaires ;
- rouge modéré pour annulation/destruction ;
- ambre pour avertissements.

Les valeurs exactes seront ajustées visuellement à partir du PDF pendant l’implémentation.

### Typographie

Utiliser **Manrope** via Google Fonts pour une apparence moderne et lisible, avec repli système Android.

- Titres : 700–800.
- Corps : 400–500.
- Libellés : 600–700.
- Chiffres et prix : alignement et graisse renforcés.

### Échelle

- Espacement de base : 4 px, avec incréments 8/12/16/20/24/32.
- Rayons : 14 px pour champs, 18–22 px pour cartes, 24–28 px pour sheets.
- Cibles tactiles : minimum 44 × 44 px, objectif 48 × 48 px.
- Largeur mobile optimisée : 360 à 430 px.
- Au-delà, afficher l’application dans un cadre centré discret sans simuler excessivement un appareil.

### Liquid Glass maîtrisé

Réserver le verre à :

- navigation inférieure flottante ;
- segmented control Trajet/Colis ;
- bottom sheets ;
- bandeaux de suivi ;
- modales et menus rapides.

Les formulaires, prix, listes et textes longs utiliseront des surfaces opaques pour rester lisibles.

Chaque surface vitrée aura :

- transparence limitée ;
- bordure claire d’un pixel ;
- ombre douce ;
- flou unique et modéré ;
- repli opaque avec `@supports` et préférence de réduction de transparence.

### Icônes et logo

- Utiliser uniquement Lucide pour les icônes d’interface.
- Construire un `NakaMark` simple et propre inspiré du symbole éclair bicolore de la référence, sans prétendre disposer du logo vectoriel officiel.
- Les illustrations d’onboarding seront réutilisées depuis les captures fournies avec un recadrage CSS non destructif ; aucun nouvel artwork ne sera généré.
- La carte de démonstration réutilisera la zone cartographique de la capture comme fond statique, avec marqueurs et trajet clairement identifiés comme démonstration.

## 7. Écrans et comportements

### Splash

- Fond vert profond, marque NAKA et texte « NAKA Client ».
- Animation courte de fondu/échelle.
- Redirection vers onboarding au premier lancement, sinon vers accueil.
- Respect de `prefers-reduced-motion`.

### Onboarding

- Trois pages avec les textes du PDF.
- Illustration recadrée depuis chaque capture.
- Pagination, balayage horizontal, boutons Suivant/Commencer et option Passer.
- Persistance de l’achèvement.

### Accueil

- Salutation fictive, solde, notifications et avatar.
- Segmented control vitré Trajet/Colis.
- Champ principal adapté au service.
- Raccourcis Maison/Bureau.
- Pour Trajet : quatre véhicules, prix de démonstration et bannière Premium.
- Pour Colis : Impact, portefeuille et services Express/Certifiée.
- Carrousel de bannières manuel avec indicateurs ; pas d’auto-défilement agressif.
- Navigation inférieure Accueil, Activité, Impact, Profil.
- Tous les raccourcis ouvrent une destination fonctionnelle.

### Commande Trajet

Étapes :

1. Choix/édition du départ et de la destination.
2. Carte statique avec marqueurs et trajet démonstratif.
3. Estimation locale de distance et durée, marquée comme estimation.
4. Choix du véhicule.
5. Choix du paiement.
6. Récapitulatif avec option carbone +150 FCFA.
7. Confirmation simulée.

La validation bloque l’étape suivante si une adresse, un véhicule ou un paiement manque.

### Recherche de pilote

États locaux :

- recherche en cours avec animation discrète ;
- aucun pilote disponible ;
- pilote de démonstration attribué.

Le prototype fera évoluer automatiquement l’état après un délai court, avec actions permettant aussi de réessayer ou annuler.

Ne jamais employer une formulation laissant croire à un réseau réel. Utiliser « Recherche de démonstration » et « Pilote fictif attribué ».

### Livraison de colis

Formulaire :

- adresse de récupération ;
- destination ;
- nom du destinataire ;
- téléphone du destinataire ;
- description du colis ;
- instructions facultatives ;
- service Express ou Certifiée ;
- paiement.

Validation :

- champs requis ;
- format minimal du téléphone togolais ;
- messages d’erreur près des champs ;
- récapitulatif avant confirmation.

La commande créée est ajoutée à l’activité locale.

### Suivi local

- Statut et timeline : confirmée, pilote attribué, en route, arrivée, terminée.
- Carte statique, détails du pilote fictif et résumé.
- Boutons Appeler et Chat : Appeler affiche un message de démonstration, Chat ouvre la conversation.
- Contrôle de démonstration permettant d’avancer l’état pour tester tout le parcours.

### Chat

- En-tête avec pilote fictif, avatar initiales, commande et statut.
- Bulles différenciées, heure et historique local.
- Champ de saisie et envoi réel dans l’état local.
- Réponses rapides prédéfinies.
- Réponse automatique locale courte pour illustrer la conversation.
- Message explicite indiquant qu’aucun message n’est transmis.
- Gestion correcte du clavier virtuel et maintien du dernier message visible.

### Activité

- Filtres Tous / En cours / Terminées / Annulées.
- Liste de commandes avec date, ID, itinéraire, prix et statut.
- Skeleton initial.
- État vide par filtre.
- Clic vers détail de commande ou suivi si active.
- Bouton Commander relié à l’accueil.

### Impact

- Indicateurs CO₂ économisé, arbres préservés et livraisons.
- Présentation visuelle plus claire que les grandes cartes du PDF.
- Mention « données de démonstration ».
- Pas de promesse de certification ni de calcul réel.

### Portefeuille

- Solde local.
- Transactions récentes.
- État vide.
- Recharge via bottom sheet avec montants prédéfinis.
- Confirmation explicite « simulation uniquement ».
- La recharge met à jour localement le solde et ajoute une transaction.

### Profil

- Avatar fictif, nom, téléphone et badge de démonstration.
- Menu complet du PDF.
- Modification locale du nom et du téléphone.
- Déconnexion : dialogue puis retour au splash sans effacer les données locales.

### Paramètres

- Notifications Push : interrupteur persistant.
- Langue : français uniquement, ligne informative désactivée.
- Mode sombre : interrupteur réellement fonctionnel et persistant.
- Supprimer mon compte : explique l’absence de compte distant et propose uniquement de réinitialiser les données locales de démonstration après double confirmation.

### Confidentialité

Réécrire le texte de la capture pour être exact :

- données stockées localement dans le navigateur pour la démonstration ;
- aucune transmission à un serveur NAKA ;
- localisation et suivi non réels ;
- possibilité d’effacer les données locales via Paramètres.

### Centre d’aide

- Liens e-mail et WhatsApp avec avertissement avant ouverture d’une application externe.
- Accordéons FAQ pour les sept questions du brief.
- Réponses concises et honnêtes, adaptées au prototype local.

### À propos

- Marque, version du prototype, mission NAKA.
- Liens Conditions, Confidentialité et Site web : ouvrir une modale « contenu de démonstration » ou la page Confidentialité ; aucun faux lien mort.

## 8. Skeletons, erreurs et retours utilisateur

Créer des variantes réutilisables correspondant à la structure réelle :

- `HomeSkeleton` ;
- `ActivitySkeleton` ;
- `WalletSkeleton` ;
- `ProfileSkeleton` ;
- `OrderSkeleton` ;
- `VehicleListSkeleton`.

Principes :

- shimmer léger ;
- durée de démonstration courte et centralisée ;
- pas de skeleton si les données sont déjà en mémoire ;
- transition en fondu vers le contenu ;
- états vides distincts ;
- état d’erreur testable via une action « Simuler une erreur » disponible uniquement dans un panneau de démonstration discret ou via un paramètre de repository.

Les actions importantes produiront un toast ou une confirmation visuelle.

## 9. Animations et accessibilité

### Animations

- transitions de routes par fondu/glissement léger ;
- `Animated` CSS pour segmented control, sheets, sélection de véhicule et progression ;
- pulsation limitée pour la recherche de pilote ;
- aucune animation infinie décorative hors état de chargement ;
- désactivation/réduction via `prefers-reduced-motion`.

### Accessibilité

- HTML sémantique ;
- boutons réels pour toutes les actions ;
- labels reliés aux champs ;
- `aria-current` dans la navigation ;
- `aria-live` pour toasts, progression et recherche ;
- focus visible ;
- ordre de tabulation logique ;
- contraste vérifié en clair et sombre ;
- taille minimale des zones tactiles ;
- aucun débordement à 360 px ;
- contenu scrollable avec zones fixes respectant les safe areas ;
- navigation au clavier utilisable pour la prévisualisation web.

## 10. Responsive et comportement Android

- Design prioritaire à 390 × 844 px.
- Vérifications à 360 × 800, 412 × 915 et 430 × 932.
- Utilisation de `env(safe-area-inset-*)`.
- Barre inférieure fixe/flottante sans masquer le contenu.
- Bottom sheets limitées en hauteur avec scroll interne.
- Formulaires utilisant les bons `inputMode` et `autoComplete`.
- Éviter toute dépendance à la barre de statut visible dans les captures.

## 11. Ordre d’implémentation

1. Installer `react-router` et `lucide-react`.
2. Mettre en place le routeur, le provider local et le shell mobile.
3. Créer les tokens, thèmes clair/sombre et composants fondamentaux.
4. Importer les captures nécessaires comme assets de référence et configurer leurs recadrages.
5. Implémenter splash et onboarding.
6. Implémenter accueil et navigation inférieure.
7. Implémenter le parcours Trajet complet.
8. Implémenter le parcours Colis complet.
9. Implémenter suivi et chat.
10. Implémenter Activité, Impact et Portefeuille.
11. Implémenter Profil, Paramètres, Confidentialité, Aide et À propos.
12. Ajouter skeletons, états vides/erreurs et animations.
13. Réviser toutes les actions pour éliminer boutons morts et placeholders.
14. Vérifier responsive, thème sombre, accessibilité et cohérence des données.

## 12. Vérification

### Commandes

- `pnpm format`
- `pnpm build`

Ne pas lancer de serveur de développement : celui de Figma Make est déjà supervisé.

### Vérifications fonctionnelles manuelles

Tester au minimum :

1. Premier lancement → onboarding → accueil.
2. Lancement suivant → accueil direct.
3. Bascule Trajet/Colis.
4. Trajet complet avec chaque véhicule et chaque paiement disponible.
5. Blocage Wallet avec solde insuffisant.
6. Recharge simulée puis paiement Wallet disponible.
7. Recherche → absence → réessai → attribution fictive.
8. Suivi → ouverture du chat → envoi et réponse locale.
9. Création d’un colis et apparition dans Activité.
10. Filtres et détails d’Activité.
11. Modification du profil et persistance.
12. Notifications et mode sombre persistants.
13. FAQ dépliable.
14. Réinitialisation des données locales.
15. Retour navigateur/Android simulé sans route cassée.
16. Rechargement direct sur une route profonde.

### Vérifications visuelles

- aucune coupure ou superposition à 360 px ;
- navigation inférieure n’occulte aucun contenu ;
- claviers et champs restent accessibles ;
- contraste clair/sombre ;
- zones tactiles ;
- skeletons structurels ;
- cohérence des rayons, espacements et icônes ;
- verre limité aux surfaces prévues ;
- absence de données personnelles reprises des captures.

### Critères d’acceptation

- Tous les écrans uniques du PDF sont représentés.
- Les états dupliqués sont fusionnés de manière interactive.
- Les parcours Trajet et Colis sont terminables.
- Les commandes créées alimentent l’activité locale.
- Le suivi et le chat local fonctionnent.
- Le portefeuille et les paramètres modifient réellement l’état.
- Aucun bouton principal n’est inerte.
- Aucune fonctionnalité ne laisse croire à un backend, un paiement ou un GPS réel.
- Le prototype reste fluide et lisible sur petit écran Android.
- Le formatage et le build réussissent.

## 13. Risques et traitement

- **Assets non séparés dans le PDF** : réutiliser uniquement les zones d’illustration/cartographie via recadrage CSS ; reconstruire le reste de l’interface en composants.
- **Carte non interactive** : l’indiquer comme carte de démonstration et superposer uniquement des marqueurs/états locaux.
- **Nombre élevé d’écrans** : partager shell, en-têtes, formulaires, cartes de commande et composants de feedback afin de maintenir la cohérence.
- **Persistance corrompue** : valider les données lues et restaurer les fixtures.
- **Historique et deep links** : utiliser React Router plutôt qu’une navigation maison.
- **Glassmorphism coûteux** : limiter le nombre de surfaces floutées et fournir un repli opaque.
- **Données sensibles visibles dans le PDF** : ne reprendre aucun nom, téléphone ou identifiant de commande réel.

## 14. Procédures utilisées pour la planification

- `make/react-router` : impose React Router en Data mode pour ce prototype multi-écrans et définit `RouterProvider` comme point d’entrée de navigation.

Les recommandations Flutter du brief ne s’appliquent pas au livrable retenu, qui est explicitement un prototype React dans Figma Make. Le plan conserve néanmoins une séparation par fonctionnalités, des modèles typés et un repository local pour faciliter une future transposition Flutter.
