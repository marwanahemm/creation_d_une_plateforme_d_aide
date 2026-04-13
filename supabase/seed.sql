UPDATE tutoriels
SET etapes = '[
  {
    "titre": "Accéder à Mon Compte sur caf.fr",
    "description": "Rendez-vous sur caf.fr. Cliquez sur le picto « Mon Compte » dans la barre bleue en haut de la page, puis sur « Créer mon compte ». Bon à savoir : la création dure 5 à 10 minutes et comprend 3 étapes. Cliquez sur « Commencer » pour lancer la démarche.",
    "image": "/images/tutoriels/caf/etape_1.png"
  },
  {
    "titre": "Renseigner votre état civil",
    "description": "Complétez votre état civil : numéro de sécurité sociale, civilité, nom de naissance, prénoms, date et lieu de naissance. Ensuite, renseignez le numéro de votre pièce d''identité (carte d''identité, titre de séjour ou passeport). Sans pièce d''identité française, cliquez sur le lien prévu à cet effet.",
    "image": "/images/tutoriels/caf/etape_2.png"
  },
  {
    "titre": "Vérifier vos coordonnées de contact",
    "description": "Choisissez de recevoir un code de vérification par SMS ou par e-mail. Saisissez votre numéro de téléphone ou adresse mail, confirmez-le, puis cliquez sur « Envoyer le code ». Entrez le code reçu et cliquez sur « Valider ».",
    "image": "/images/tutoriels/caf/etape_3.png"
  },
  {
    "titre": "Choisir un mot de passe et finaliser",
    "description": "Créez un mot de passe entre 10 et 64 caractères, avec au moins 1 chiffre, 1 majuscule et 1 minuscule. Confirmez-le puis cliquez sur « Continuer ». Vérifiez le récapitulatif de vos informations et cliquez sur « Se connecter » pour accéder à votre espace.",
    "image": "/images/tutoriels/caf/etape_4.png"
  }
]'::jsonb
WHERE titre LIKE '%CAF%';


UPDATE tutoriels
SET etapes = '[
  {
    "titre": "Aller sur ameli.fr",
    "description": "Ouvrez votre navigateur (Chrome, Firefox, Edge...) et tapez ameli.fr dans la barre d''adresse. Cliquez sur le premier résultat « ameli, le site de l''Assurance Maladie en ligne ».",
    "image": "/images/tutoriels/ameli/etape_1.png"
  },
  {
    "titre": "Cliquer sur « Compte ameli »",
    "description": "Sur la page d''accueil, cliquez sur l''icône « Compte ameli » en haut à droite. Une fenêtre s''ouvre, cliquez sur « Accéder à mon compte ameli ».",
    "image": "/images/tutoriels/ameli/etape_2.png"
  },
  {
    "titre": "Cliquer sur « Créer un compte » en bas de la page",
    "description": "Sur la page de connexion « J''accède à mon compte ameli », faites défiler jusqu''en bas et cliquez sur le lien « Créer un compte ».",
    "image": "/images/tutoriels/ameli/etape_3.png"
  },
  {
    "titre": "Renseigner vos informations personnelles",
    "description": "Saisissez votre nom de famille, votre numéro de sécurité sociale (13 chiffres, sans la clé), votre date de naissance et votre code postal. Cliquez sur « Continuer ».",
    "image": "/images/tutoriels/ameli/etape_4.png"
  },
  {
    "titre": "Confirmer votre identité",
    "description": "Renseignez les 7 derniers chiffres de votre IBAN (présent sur votre RIB). Cette étape permet de vérifier votre identité de manière sécurisée.",
    "image": "/images/tutoriels/ameli/etape_5.png"
  },
  {
    "titre": "Créer votre mot de passe",
    "description": "Choisissez un mot de passe sécurisé comportant au moins 8 caractères avec majuscule, minuscule et chiffre ou caractère spécial. Validez votre compte via le lien reçu par e-mail.",
    "image": "/images/tutoriels/ameli/etape_6.png"
  }
]'::jsonb
WHERE titre LIKE '%Ameli%';


UPDATE tutoriels
SET etapes = '[
  {
    "titre": "Accéder à la page de connexion",
    "description": "Ouvrez votre navigateur et rendez-vous sur francetravail.fr. Sur la page de connexion, repérez la mention « Première connexion ? » et cliquez sur « Créer mon compte » juste à côté.",
    "image": "/images/tutoriels/france-travail/etape_1.jpg"
  },
  {
    "titre": "Préparer vos documents",
    "description": "Avant de commencer, rassemblez : une pièce d''identité, votre carte Vitale, un justificatif de domicile, votre attestation employeur, vos derniers bulletins de salaire, un RIB et votre CV. Ayez également votre adresse e-mail à portée de main. Une fois prêt, cliquez sur « Valider et continuer ».",
    "image": "/images/tutoriels/france-travail/etape_2.jpg"
  },
  {
    "titre": "Vérifier votre situation",
    "description": "France Travail vous demande de préciser votre situation actuelle (salarié, indépendant, sans emploi…). Selon votre réponse, vous serez orienté vers le parcours d''inscription adapté ou informé que vous n''êtes pas éligible.",
    "image": "/images/tutoriels/france-travail/etape_3.jpg"
  },
  {
    "titre": "Choisir le motif d''inscription",
    "description": "Sélectionnez parmi les 4 motifs proposés celui qui correspond à votre situation (fin de CDD, licenciement, démission, etc.) puis cliquez sur « Démarrer l''inscription ».",
    "image": "/images/tutoriels/france-travail/etape_4.jpg"
  },
  {
    "titre": "Remplir votre profil",
    "description": "Complétez l''ensemble des champs : genre, prénom, nom, date et lieu de naissance, nationalité, adresse postale, situation familiale, numéro de sécurité sociale, régime, téléphone et adresse e-mail. Toutes ces informations sont nécessaires pour finaliser votre dossier.",
    "image": "/images/tutoriels/france-travail/etape_5.jpg"
  },
  {
    "titre": "Finaliser l''inscription et recevoir vos accès",
    "description": "Une fois le formulaire validé, vous recevrez vos identifiants par courrier ou e-mail. Connectez-vous ensuite à votre espace personnel pour compléter votre profil, déposer votre CV et consulter vos offres d''emploi personnalisées. Pensez à actualiser votre situation chaque mois.",
    "image": "/images/tutoriels/france-travail/etape_6.jpg"
  }
]'::jsonb
WHERE titre LIKE '%France Travail%';


