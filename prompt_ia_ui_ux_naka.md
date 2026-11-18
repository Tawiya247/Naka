# Contexte et Rôle
Agis en tant qu'Ingénieur UI/UX et Développeur Frontend expert. Ton objectif est de concevoir et générer les vues pour l'application **Naka Client** (un MVP de mobilité urbaine décarbonée). Tu dois fusionner l'ergonomie d'accueil d'une super-app existante (Gozem) avec l'identité éco-responsable de Naka.

# 🎨 Style Visuel Obligatoire : "Liquid Glass" (Glassmorphism)
Toute l'interface doit être conçue avec ce style : 
- Cartes semi-transparentes
- Effet de flou d'arrière-plan (backdrop-blur)
- Bordures claires et subtiles (effet verre givré)
- Ombres douces pour donner de la profondeur
- Couleurs dominantes : rappels écologiques (teintes de vert Naka, blanc pur, reflets vitrés) avec des contrastes assurant une bonne lisibilité.

# Spécifications des écrans et composants :

## 1. ÉCRAN D'ACCUEIL (HOME)
* **Header :** Reproduis exactement la structure du header de l'application Gozem (une icône de profil utilisateur à gauche, le nom/logo au centre, et une icône de notification en forme de cloche à droite).
* **Bannières éducatives (Carrousel) :** En dessous du header, ajoute un carrousel coulissant horizontalement. Au lieu de promotions commerciales, ces bannières afficheront des conseils sur comment réduire les émissions de CO2 et des thématiques apparentées.
* **Gamification (Points) :** Intègre une logique visuelle de système de points que l'utilisateur gagne sur ses courses et livraisons.
* **⚠️ Règle stricte :** Ne prends **pas du tout en compte** la partie "Gozem Money" ou tout espace d'affichage de solde sur cet écran.
* **Grille de Services (Véhicules) :** Affiche une grille de raccourcis avec des images pour les véhicules.
* **Logique de navigation (Réutilisation de l'existant) :** Au clic sur l'un de ces véhicules, l'interface doit **rediriger vers la zone de sélection de destination déjà existante** dans l'application. Ne recrée surtout pas cette partie, cherche l'existant avant de faire quoi que ce soit. Lors de l'affichage du prix, cela doit se faire via une **Popup / Bottom Sheet** superposée, à l'image de l'écran original.

## 2. NOUVEL ÉCRAN : RESTAURATION (FOOD)
* Conçois un écran totalement dédié à la sélection de restaurants pour lancer une commande (cette section n'a rien à voir avec la livraison de colis déjà présente).
* Il doit inclure des cartes (toujours en Liquid Glass) présentant des images de restaurants et de plats de manière attrayante.

## 3. NOUVELLE SECTION : SUIVI ET COMMUNICATION PILOTE
* En suivant la logique d'une course active, conçois les options de communication avec le pilote.
* Ajoute trois options claires :
  1. Un bouton pour le **Chat intégré**.
  2. Un bouton pour lancer un **Appel téléphonique**.
  3. Un bouton pour écrire directement sur **WhatsApp**.