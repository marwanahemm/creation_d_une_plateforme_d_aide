UPDATE tutoriels

SET etapes = '[
  {
    "titre": "Aller sur caf.fr",
    "description": "Ouvrez votre navigateur et tapez caf.fr dans la barre d''adresse. Sur la page d''accueil, repérez le bouton « Créer » dans la section « Créer votre compte », ou identifiez-vous via FranceConnect.",
    "image": "/images/tutoriels/caf/etape_1.png"
  },
  {
    "titre": "Préparer les documents nécessaires",
    "description": "Munissez-vous de votre numéro de Sécurité sociale (présent sur votre carte Vitale) et d''une pièce d''identité. La création prend 3 étapes et environ 5 à 10 minutes.",
    "image": "/images/tutoriels/caf/etape_2.png"
  },
  {
    "titre": "Renseigner votre état civil",
    "description": "Saisissez votre numéro de sécurité sociale (13 caractères). Si vous n''en avez pas, cochez la case correspondante. Tous les champs sont obligatoires sauf mention contraire.",
    "image": "/images/tutoriels/caf/etape_3.png"
  },
  {
    "titre": "Saisir vos coordonnées",
    "description": "Renseignez votre adresse postale, votre numéro de téléphone et votre adresse e-mail. Ces informations serviront pour vos futurs échanges avec la CAF."
  },
  {
    "titre": "Créer votre mot de passe et valider",
    "description": "Choisissez un mot de passe sécurisé et validez la création de votre compte. Vous recevrez un e-mail de confirmation."
  }
]'::jsonb
WHERE titre LIKE '%CAF%';


UPDATE tutoriels
SET etapes = '[
  {
    "titre": "Aller sur ameli.fr",
    "description": "Ouvrez votre navigateur (Chrome, Firefox, Edge...) et tapez ameli.fr dans la barre d''adresse. Si demandé, renseignez votre code postal pour accéder aux informations de votre caisse.",
    "image": "/images/tutoriels/ameli/etape_1.png"
  },
  {
    "titre": "Cliquer sur « Compte ameli »",
    "description": "Sur la page d''accueil, cliquez sur l''icône « Compte ameli » en haut à droite. Une nouvelle page s''ouvre. Cliquez sur « Créer mon compte » pour commencer.",
    "image": "/images/tutoriels/ameli/etape_2.png"
  },
  {
    "titre": "Renseigner vos informations personnelles",
    "description": "Saisissez votre nom de famille, votre numéro de sécurité sociale (13 chiffres, sans la clé), votre date de naissance et votre code postal. Cliquez sur « Continuer ».",
    "image": "/images/tutoriels/ameli/etape_3.png"
  },
  {
    "titre": "Confirmer votre identité",
    "description": "Renseignez les 7 derniers chiffres de votre IBAN (présent sur votre RIB). Cette étape permet de vérifier votre identité de manière sécurisée.",
    "image": "/images/tutoriels/ameli/etape_4.png"
  },
  {
    "titre": "Créer votre mot de passe",
    "description": "Choisissez un mot de passe sécurisé comportant au moins 8 caractères avec majuscule, minuscule et chiffre ou caractère spécial. Validez votre compte via le lien reçu par e-mail.",
    "image": "/images/tutoriels/ameli/etape_5.png"
  }
]'::jsonb
WHERE titre LIKE '%Ameli%';


UPDATE tutoriels
SET etapes = '[
  {
    "titre": "Aller sur francetravail.fr",
    "description": "Ouvrez votre navigateur et tapez francetravail.fr dans la barre d''adresse. C''est le nouveau nom de Pôle Emploi depuis 2024.",
    "image": "/images/tutoriels/france-travail/etape_1.png"
  },
  {
    "titre": "Cliquer sur « S''inscrire »",
    "description": "Sur la page d''accueil, cliquez sur le bouton « S''inscrire / Se réinscrire » pour commencer votre inscription comme demandeur d''emploi.",
    "image": "/images/tutoriels/france-travail/etape_2.png"
  },
  {
    "titre": "Remplir le formulaire d''inscription",
    "description": "Renseignez votre état civil, votre adresse, votre dernier emploi et la raison de la fin de contrat. Ayez votre pièce d''identité et votre attestation employeur sous la main.",
    "image": "/images/tutoriels/france-travail/etape_3.png"
  },
  {
    "titre": "Compléter votre profil",
    "description": "Ajoutez votre CV, vos compétences, votre niveau d''études et votre secteur d''activité pour être visible des recruteurs.",
    "image": "/images/tutoriels/france-travail/etape_4.png"
  },
  {
    "titre": "Suivre votre espace chaque mois",
    "description": "Actualisez votre situation chaque mois entre le 28 et le 15 pour continuer à recevoir vos droits. Consultez aussi vos offres d''emploi personnalisées."
  }
]'::jsonb
WHERE titre LIKE '%France Travail%';


