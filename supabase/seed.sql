
INSERT INTO tutoriels (titre, categorie, duree, description, infos, lien, etapes) VALUES

-- ============================================================
-- 1. AMELI
-- ============================================================
(
  'Créer un compte Ameli',
  'Santé',
  '10 min',
  'Créez votre compte Ameli pour suivre vos remboursements de santé, télécharger vos attestations et contacter votre caisse en ligne.',
  '["Votre numéro de sécurité sociale (13 chiffres)", "Votre RIB", "Une adresse e-mail valide", "Votre code postal"]'::jsonb,
  'https://www.ameli.fr',
  '[
    {
      "titre": "Aller sur ameli.fr",
      "description": "Ouvrez votre navigateur (Chrome, Firefox, Edge…) et tapez ameli.fr dans la barre d''adresse en haut. Dans la liste qui apparaît, cliquez sur le premier résultat : « ameli, le site de l''Assurance Maladie en ligne | ameli.fr ».",
      "image": "/images/tutoriels/ameli/etape_1.png"
    },
    {
      "titre": "Renseigner votre code postal",
      "description": "Une fenêtre s''ouvre et vous demande votre code postal. Saisissez-le (format : 5 chiffres) puis cliquez sur « Valider ». Cela permet d''afficher les informations de votre caisse locale.",
      "image": "/images/tutoriels/ameli/etape_2.png"
    },
    {
      "titre": "Cliquer sur « Se connecter »",
      "description": "Sur la page d''accueil, cliquez sur le bouton « Se connecter » en haut à droite. Une fenêtre apparaît avec deux options. Cliquez sur « Accéder à mon compte ameli » pour créer ou accéder à votre compte.",
      "image": "/images/tutoriels/ameli/etape_3.png"
    },
    {
      "titre": "Cliquer sur « Créez votre compte »",
      "description": "Vous arrivez sur la page du compte ameli. Sur la droite, sous « Vous n''avez pas de compte ameli », cliquez sur le bouton « Créez votre compte ».",
      "image": "/images/tutoriels/ameli/etape_4.png"
    },
    {
      "titre": "Remplir le formulaire d''inscription",
      "description": "Saisissez les informations demandées : votre nom de famille (sans prénom), votre numéro de sécurité sociale (13 chiffres), votre date de naissance (jj/mm/aaaa) et votre code postal. Tous les champs sont obligatoires. Cliquez sur « Continuer ».",
      "image": "/images/tutoriels/ameli/etape_5.png"
    }
  ]'::jsonb
),

-- ============================================================
-- 2. CAF
-- ============================================================
(
  'Créer un compte CAF',
  'Famille',
  '10 min',
  'Créez votre compte sur caf.fr pour gérer vos allocations familiales, déclarer vos ressources et accéder à toutes vos prestations en ligne.',
  '["Votre numéro de sécurité sociale", "Une pièce d''identité valide (CNI, titre de séjour ou passeport)", "Un téléphone portable ou une adresse e-mail"]'::jsonb,
  'https://www.caf.fr',
  '[
    {
      "titre": "Accéder à Mon Compte sur caf.fr",
      "description": "Rendez-vous sur caf.fr. Cliquez sur le picto « Mon Compte » dans la barre bleue en haut de la page, puis sur « Créer mon compte ». La création dure 5 à 10 minutes et comprend 3 étapes. Cliquez sur « Commencer » pour lancer la démarche.",
      "image": "/images/tutoriels/caf/etape_1.png"
    },
    {
      "titre": "Renseigner votre état civil",
      "description": "Complétez votre état civil : numéro de sécurité sociale, civilité, nom de naissance, prénoms, date et lieu de naissance. Ensuite, renseignez le numéro de votre pièce d''identité (carte d''identité, titre de séjour ou passeport).",
      "image": "/images/tutoriels/caf/etape_2.png"
    },
    {
      "titre": "Vérifier vos coordonnées de contact",
      "description": "Choisissez de recevoir un code de vérification par SMS ou par e-mail. Saisissez votre numéro de téléphone ou adresse mail, confirmez-le, puis cliquez sur « Envoyer le code ». Entrez le code reçu et cliquez sur « Valider ».",
      "image": "/images/tutoriels/caf/etape_3.png"
    },
    {
      "titre": "Choisir un mot de passe et finaliser",
      "description": "Créez un mot de passe entre 10 et 64 caractères, avec au moins 1 chiffre, 1 majuscule et 1 minuscule. Confirmez-le puis cliquez sur « Continuer ». Vérifiez le récapitulatif et cliquez sur « Se connecter » pour accéder à votre espace.",
      "image": "/images/tutoriels/caf/etape_4.png"
    }
  ]'::jsonb
),

-- ============================================================
-- 3. FRANCE TRAVAIL
-- ============================================================
(
  'S''inscrire à France Travail',
  'Emploi',
  '20 min',
  'Inscrivez-vous comme demandeur d''emploi sur France Travail pour bénéficier d''un accompagnement, percevoir vos allocations et accéder aux offres d''emploi.',
  '["Une pièce d''identité", "Votre carte Vitale", "Un justificatif de domicile", "Vos derniers bulletins de salaire et attestation employeur", "Un RIB et votre CV", "Une adresse e-mail valide"]'::jsonb,
  'https://www.francetravail.fr',
  '[
    {
      "titre": "Aller sur francetravail.fr",
      "description": "Ouvrez votre navigateur (Chrome, Firefox, Edge…) et tapez francetravail.fr dans la barre d''adresse en haut. Dans la liste qui apparaît, cliquez sur le premier résultat : « Accueil | France Travail - francetravail.fr ».",
      "image": "/images/tutoriels/france-travail/Etape 1 barre de recherche.png"
    },
    {
      "titre": "Cliquer sur « Connexion » puis « Candidat »",
      "description": "Sur la page d''accueil, repérez le bouton « Connexion » en haut à droite. Cliquez dessus : un menu apparaît avec trois choix. Cliquez sur « Candidat ».",
      "image": "/images/tutoriels/france-travail/Etape 2 page d''accueil.png"
    },
    {
      "titre": "Lancer l''inscription",
      "description": "Vous arrivez sur la page « Mon inscription à France Travail ». Elle vous explique que la démarche se déroule en 4 grandes étapes : vos données personnelles, votre demande d''allocations, votre situation, puis votre rendez-vous. Cliquez sur le bouton bleu « Je commence » pour démarrer.",
      "image": "/images/tutoriels/france-travail/Etape 3 page de connection.png"
    },
    {
      "titre": "Vérifier si vous pouvez vous inscrire en ligne",
      "description": "France Travail vous demande si vous êtes concerné par l''une des situations listées (travail à temps plein, préavis, congé maladie, mineur de moins de 16 ans…). Si aucune ne vous correspond, cochez « Je ne suis concerné par aucune des situations listées ». Cliquez ensuite sur « Valider et continuer ».",
      "image": "/images/tutoriels/france-travail/etape_3.png"
    },
    {
      "titre": "Remplir votre état civil",
      "description": "Complétez le formulaire « Mon état civil » : sexe, prénom, nom de naissance, date et lieu de naissance, nationalité, numéro de sécurité sociale, situation familiale et nombre d''enfants à charge. Tous les champs sont obligatoires sauf ceux marqués « facultatif ». Cliquez sur « Valider et continuer ».",
      "image": "/images/tutoriels/france-travail/Etape 4 inscription.jpg"
    },
    {
      "titre": "Compléter les autres étapes et finaliser",
      "description": "Poursuivez les étapes dans la barre de gauche : Mon adresse, Mes modalités de contact, Mon motif d''inscription, puis Ma demande d''allocations, Ma situation et votre rendez-vous. Une fois tout validé, vous recevez votre numéro France Travail et l''accès à votre espace personnel. Pensez à actualiser votre situation chaque mois.",
      "image": "/images/tutoriels/france-travail/etape_6.jpg"
    }
  ]'::jsonb
);