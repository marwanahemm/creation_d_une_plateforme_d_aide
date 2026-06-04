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
    "titre": "Accéder à ameli.fr",
    "description": "Ouvrez votre navigateur (Chrome, Firefox, Edge...) et tapez ameli.fr dans la barre d''adresse, puis appuyez sur Entrée.",
    "image": "/images/tutoriels/ameli/etape_1.png"
  },
  {
    "titre": "Choisir « Mon compte ameli »",
    "description": "Une fenêtre s''affiche : « À quel service souhaitez-vous vous connecter ? ». Cliquez sur « Accéder à mon compte ameli » pour consulter vos remboursements et faciliter vos démarches.",
    "image": "/images/tutoriels/ameli/etape_2 .png"
  },
  {
    "titre": "Créer votre compte",
    "description": "Sur la page de connexion, saisissez votre numéro de sécurité sociale et votre mot de passe, puis cliquez sur « Me connecter ». Si c''est votre première visite, cliquez sur « Créer un compte » en bas de page. Vous pouvez aussi utiliser FranceConnect.",
    "image": "/images/tutoriels/ameli/etape_3.png"
  },
  {
    "titre": "Renseigner vos informations personnelles",
    "description": "Saisissez votre nom de famille (sans prénom), votre numéro de sécurité sociale, votre date de naissance et votre code postal. Une fois les champs remplis, cliquez sur « Continuer ».",
    "image": "/images/tutoriels/ameli/etape_4.png"
  }
]'::jsonb
WHERE titre LIKE '%Ameli%';


UPDATE tutoriels
SET etapes = '[
  {
    "titre": "Accéder à francetravail.fr",
    "description": "Ouvrez votre navigateur (Chrome, Firefox, Edge...) et tapez francetravail.fr dans la barre d''adresse, puis appuyez sur Entrée.",
    "image": "/images/tutoriels/france-travail/Etape 1 barre de recherche.png"
  },
  {
    "titre": "Cliquer sur « Connexion » puis « Candidat »",
    "description": "Sur la page d''accueil de France Travail, cliquez sur le bouton « Connexion » en haut à droite. Un menu déroulant apparaît : sélectionnez « Candidat ».",
    "image": "/images/tutoriels/france-travail/Etape 2 page d''accueil.png"
  },
  {
    "titre": "Se connecter ou créer un compte",
    "description": "Saisissez votre identifiant et votre mot de passe, puis cliquez sur « Se connecter ». Si vous n''avez pas encore de compte, cliquez sur « Créer un compte » en bas de page, ou utilisez FranceConnect pour vous identifier avec vos identifiants d''un autre service de l''État.",
    "image": "/images/tutoriels/france-travail/Etape 3 page de connection.png"
  },
  {
    "titre": "Choisir de vous inscrire comme demandeur d''emploi",
    "description": "France Travail vous demande ce que vous souhaitez faire. Sélectionnez « Vous inscrire comme demandeur d''emploi : vous souhaitez effectuer votre demande d''inscription », puis cliquez sur « Poursuivre ».",
    "image": "/images/tutoriels/france-travail/Etape 4 inscription.jpg"
  },
  {
    "titre": "Vérifier si vous pouvez vous inscrire en ligne",
    "description": "À la première étape de votre demande d''inscription, sélectionnez votre situation dans la liste déroulante pour vérifier votre éligibilité à l''inscription en ligne. Cliquez ensuite sur « Valider et continuer ».",
    "image": "/images/tutoriels/france-travail/etape_5.jpg"
  },
  {
    "titre": "Renseigner vos données personnelles",
    "description": "Complétez le formulaire avec votre état civil : sexe, prénom, nom de naissance, date de naissance, pays et département de naissance, nationalité, numéro de sécurité sociale et situation familiale. Tous les champs sont obligatoires sauf mention contraire.",
    "image": "/images/tutoriels/france-travail/etape_6.jpg"
  },
  {
    "titre": "Préciser votre profil d''inscription",
    "description": "Sélectionnez le profil qui correspond à votre situation : première inscription, dernière inscription avant ou après le 24/03/2019, ou « Je ne sais plus ». Une fois votre profil choisi, cliquez sur « Démarrer l''inscription ».",
    "image": "/images/tutoriels/france-travail/etape_7.png"
  },
  {
    "titre": "Suivre les étapes de votre inscription",
    "description": "Votre inscription se déroule en plusieurs étapes : informations personnelles, codes d''accès, motif d''inscription, demande d''allocations, recherche d''emploi et validation finale. Suivez le fil de progression et complétez chaque section.",
    "image": "/images/tutoriels/france-travail/etape_8.jpg"
  },
  {
    "titre": "Finaliser et valider votre inscription",
    "description": "Une fois toutes les étapes complétées, validez votre inscription. Vous recevrez une confirmation et pourrez accéder à votre espace personnel pour suivre votre dossier, actualiser votre situation chaque mois et consulter vos offres d''emploi personnalisées.",
    "image": "/images/tutoriels/france-travail/etape_9.jpg"
  }
]'::jsonb
WHERE titre LIKE '%France Travail%';


