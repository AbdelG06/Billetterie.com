-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 02 mai 2026 à 15:31
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `guichet_billetterie`
--

-- --------------------------------------------------------

--
-- Structure de la table `billets_generes`
--

CREATE TABLE `billets_generes` (
  `id_billet` int(11) NOT NULL,
  `id_commande` int(11) DEFAULT NULL,
  `id_ticket_type` int(11) DEFAULT NULL,
  `code_unique_qr` varchar(100) DEFAULT NULL,
  `est_scanne` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id_categorie` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id_categorie`, `nom`) VALUES
(1, 'Concert'),
(2, 'Festival'),
(3, 'Cinéma'),
(4, 'Théâtre'),
(5, 'Concert'),
(6, 'Festival'),
(7, 'Cinéma'),
(8, 'Théâtre'),
(9, 'Sport'),
(10, 'Humour'),
(11, 'Exposition'),
(12, 'Enfants'),
(13, 'Conférence');

-- --------------------------------------------------------

--
-- Structure de la table `commandes`
--

CREATE TABLE `commandes` (
  `id_commande` int(11) NOT NULL,
  `id_utilisateur` int(11) DEFAULT NULL,
  `date_commande` timestamp NOT NULL DEFAULT current_timestamp(),
  `montant_total` decimal(10,2) DEFAULT NULL,
  `statut_paiement` enum('en_attente','paye','echoue') DEFAULT 'en_attente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `evenements`
--

CREATE TABLE `evenements` (
  `id_evenement` int(11) NOT NULL,
  `titre` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `date_evenement` datetime NOT NULL,
  `lieu_precis` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `id_ville` int(11) DEFAULT NULL,
  `id_categorie` int(11) DEFAULT NULL,
  `id_organisateur` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `evenements`
--

INSERT INTO `evenements` (`id_evenement`, `titre`, `description`, `date_evenement`, `lieu_precis`, `image_url`, `id_ville`, `id_categorie`, `id_organisateur`) VALUES
(1, 'Concert Gims', NULL, '2026-08-15 21:00:00', NULL, NULL, 1, 1, 1),
(2, 'Casablanca du Rire', 'Le gala d\'ouverture avec les plus grandes stars de l\'humour.', '2026-07-10 20:30:00', 'Théâtre Mohammed V', NULL, 1, 7, 1),
(3, 'Match de Gala : Légendes', 'Un match caritatif avec d\'anciennes gloires du football mondial.', '2026-05-25 18:00:00', 'Grand Stade de Marrakech', NULL, 3, 6, 1),
(4, 'Gnaoua Festival', 'Le rendez-vous incontournable de la musique mystique et du jazz.', '2026-06-15 19:00:00', 'Place Moulay Hassan', NULL, 3, 2, 1),
(5, 'Avant-première : Dune Part III', 'Projection exclusive en présence de l\'équipe technique.', '2026-05-12 21:00:00', 'Cinéma Renaissance', NULL, 2, 3, 1);

-- --------------------------------------------------------

--
-- Structure de la table `organisateurs`
--

CREATE TABLE `organisateurs` (
  `id_organisateur` int(11) NOT NULL,
  `nom_societe` varchar(100) NOT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `organisateurs`
--

INSERT INTO `organisateurs` (`id_organisateur`, `nom_societe`, `contact_email`, `telephone`) VALUES
(1, 'Maroc Events', 'info@marocevents.ma', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `tickets_types`
--

CREATE TABLE `tickets_types` (
  `id_ticket_type` int(11) NOT NULL,
  `id_evenement` int(11) DEFAULT NULL,
  `libelle_tarif` varchar(50) DEFAULT NULL,
  `prix` decimal(10,2) NOT NULL,
  `stock_initial` int(11) DEFAULT NULL,
  `stock_actuel` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tickets_types`
--

INSERT INTO `tickets_types` (`id_ticket_type`, `id_evenement`, `libelle_tarif`, `prix`, `stock_initial`, `stock_actuel`) VALUES
(1, 1, 'Zone VIP', 800.00, 100, 100),
(2, 2, 'Normal', 150.00, 400, 400),
(3, 2, 'VIP', 350.00, 50, 50),
(4, 3, 'Tribune Est', 50.00, 2000, 2000),
(5, 3, 'Tribune Ouest', 50.00, 2000, 2000),
(6, 3, 'Premium', 150.00, 500, 500),
(7, 5, 'Ticket Unique', 60.00, 150, 150);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id_utilisateur` int(11) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `date_inscription` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id_utilisateur`, `nom`, `email`, `mot_de_passe`, `date_inscription`) VALUES
(1, 'Ahmed El Mansouri', 'ahmed@mail.ma', 'le_hash_du_mot_de_passe_ici', '2026-05-02 13:28:22'),
(2, 'Aya Idrissi El Bouzaidi', 'Aya@mail.ma', 'password', '2026-05-02 13:29:37'),
(3, 'Amina Yahyaoui', 'Amina@mail.ma', 'password1', '2026-05-02 13:30:06'),
(4, 'Karim Sefrioui', 'Karim@mail.ma', 'KarimKarim', '2026-05-02 13:30:42');

-- --------------------------------------------------------

--
-- Structure de la table `villes`
--

CREATE TABLE `villes` (
  `id_ville` int(11) NOT NULL,
  `nom_ville` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `villes`
--

INSERT INTO `villes` (`id_ville`, `nom_ville`) VALUES
(1, 'Casablanca'),
(2, 'Rabat'),
(3, 'Marrakech'),
(4, 'Tanger'),
(5, 'Casablanca'),
(6, 'Rabat'),
(7, 'Marrakech'),
(8, 'Tanger'),
(9, 'Agadir'),
(10, 'Tanger'),
(11, 'Fès'),
(12, 'Oujda'),
(13, 'El Jadida');

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `vue_accueil_evenements`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `vue_accueil_evenements` (
`id_evenement` int(11)
,`titre` varchar(150)
,`date_evenement` datetime
,`image_url` varchar(255)
,`nom_ville` varchar(100)
,`categorie` varchar(50)
,`prix_min` decimal(10,2)
);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `vue_stats_organisateurs`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `vue_stats_organisateurs` (
`nom_societe` varchar(100)
,`titre` varchar(150)
,`tickets_vendus` decimal(33,0)
,`chiffre_affaires` decimal(43,2)
);

-- --------------------------------------------------------

--
-- Structure de la vue `vue_accueil_evenements`
--
DROP TABLE IF EXISTS `vue_accueil_evenements`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vue_accueil_evenements`  AS SELECT `e`.`id_evenement` AS `id_evenement`, `e`.`titre` AS `titre`, `e`.`date_evenement` AS `date_evenement`, `e`.`image_url` AS `image_url`, `v`.`nom_ville` AS `nom_ville`, `c`.`nom` AS `categorie`, (select min(`tickets_types`.`prix`) from `tickets_types` where `tickets_types`.`id_evenement` = `e`.`id_evenement`) AS `prix_min` FROM ((`evenements` `e` join `villes` `v` on(`e`.`id_ville` = `v`.`id_ville`)) join `categories` `c` on(`e`.`id_categorie` = `c`.`id_categorie`)) WHERE `e`.`date_evenement` >= current_timestamp() ;

-- --------------------------------------------------------

--
-- Structure de la vue `vue_stats_organisateurs`
--
DROP TABLE IF EXISTS `vue_stats_organisateurs`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vue_stats_organisateurs`  AS SELECT `o`.`nom_societe` AS `nom_societe`, `e`.`titre` AS `titre`, sum(`tt`.`stock_initial` - `tt`.`stock_actuel`) AS `tickets_vendus`, sum((`tt`.`stock_initial` - `tt`.`stock_actuel`) * `tt`.`prix`) AS `chiffre_affaires` FROM ((`organisateurs` `o` join `evenements` `e` on(`o`.`id_organisateur` = `e`.`id_organisateur`)) join `tickets_types` `tt` on(`e`.`id_evenement` = `tt`.`id_evenement`)) GROUP BY `e`.`id_evenement` ;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `billets_generes`
--
ALTER TABLE `billets_generes`
  ADD PRIMARY KEY (`id_billet`),
  ADD UNIQUE KEY `code_unique_qr` (`code_unique_qr`),
  ADD KEY `id_commande` (`id_commande`),
  ADD KEY `id_ticket_type` (`id_ticket_type`),
  ADD KEY `idx_qr_code` (`code_unique_qr`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id_categorie`);

--
-- Index pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD PRIMARY KEY (`id_commande`),
  ADD KEY `id_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `evenements`
--
ALTER TABLE `evenements`
  ADD PRIMARY KEY (`id_evenement`),
  ADD KEY `id_organisateur` (`id_organisateur`),
  ADD KEY `idx_evenement_date` (`date_evenement`),
  ADD KEY `idx_evenement_ville` (`id_ville`),
  ADD KEY `idx_evenement_cat` (`id_categorie`);

--
-- Index pour la table `organisateurs`
--
ALTER TABLE `organisateurs`
  ADD PRIMARY KEY (`id_organisateur`);

--
-- Index pour la table `tickets_types`
--
ALTER TABLE `tickets_types`
  ADD PRIMARY KEY (`id_ticket_type`),
  ADD KEY `id_evenement` (`id_evenement`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id_utilisateur`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `villes`
--
ALTER TABLE `villes`
  ADD PRIMARY KEY (`id_ville`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `billets_generes`
--
ALTER TABLE `billets_generes`
  MODIFY `id_billet` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id_categorie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `commandes`
--
ALTER TABLE `commandes`
  MODIFY `id_commande` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `evenements`
--
ALTER TABLE `evenements`
  MODIFY `id_evenement` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `organisateurs`
--
ALTER TABLE `organisateurs`
  MODIFY `id_organisateur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `tickets_types`
--
ALTER TABLE `tickets_types`
  MODIFY `id_ticket_type` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id_utilisateur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `villes`
--
ALTER TABLE `villes`
  MODIFY `id_ville` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `billets_generes`
--
ALTER TABLE `billets_generes`
  ADD CONSTRAINT `billets_generes_ibfk_1` FOREIGN KEY (`id_commande`) REFERENCES `commandes` (`id_commande`),
  ADD CONSTRAINT `billets_generes_ibfk_2` FOREIGN KEY (`id_ticket_type`) REFERENCES `tickets_types` (`id_ticket_type`);

--
-- Contraintes pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD CONSTRAINT `commandes_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id_utilisateur`);

--
-- Contraintes pour la table `evenements`
--
ALTER TABLE `evenements`
  ADD CONSTRAINT `evenements_ibfk_1` FOREIGN KEY (`id_ville`) REFERENCES `villes` (`id_ville`),
  ADD CONSTRAINT `evenements_ibfk_2` FOREIGN KEY (`id_categorie`) REFERENCES `categories` (`id_categorie`),
  ADD CONSTRAINT `evenements_ibfk_3` FOREIGN KEY (`id_organisateur`) REFERENCES `organisateurs` (`id_organisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `tickets_types`
--
ALTER TABLE `tickets_types`
  ADD CONSTRAINT `tickets_types_ibfk_1` FOREIGN KEY (`id_evenement`) REFERENCES `evenements` (`id_evenement`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
