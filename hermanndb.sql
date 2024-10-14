-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 14 oct. 2024 à 22:08
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `hermanndb`
--

-- --------------------------------------------------------

--
-- Structure de la table `payements_history`
--

CREATE TABLE `payements_history` (
  `id` int(11) NOT NULL,
  `email` text NOT NULL,
  `product_name` text NOT NULL,
  `date` date NOT NULL,
  `hours` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `payements_history`
--

INSERT INTO `payements_history` (`id`, `email`, `product_name`, `date`, `hours`) VALUES
(3, 'test@test.fr', 'hermann_1_month', '2024-10-14', '21:50:52'),
(4, 'test@test.fr', 'hermann_1_month', '2024-10-14', '21:51:52'),
(5, 'test@test.fr', 'hermann_1_month', '2024-10-14', '21:53:14'),
(6, 'test@test.fr', 'hermann_1_month', '2024-10-14', '21:53:20'),
(7, 'test@test.fr', 'hermann_1_month', '2024-10-14', '21:54:15');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `product_name` text NOT NULL,
  `product_label` text NOT NULL,
  `price` int(11) NOT NULL DEFAULT 0,
  `subscription` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `product_name`, `product_label`, `price`, `subscription`) VALUES
(1, 'hermann_1_month', 'Hermann Coaching 1 Month', 20, 1);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` longtext NOT NULL,
  `password` longtext NOT NULL,
  `name` text NOT NULL,
  `firstname` text NOT NULL,
  `phone` text NOT NULL,
  `adress` text NOT NULL,
  `cp` text NOT NULL,
  `city` text NOT NULL,
  `dob` text NOT NULL,
  `suscription` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`suscription`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `firstname`, `phone`, `adress`, `cp`, `city`, `dob`, `suscription`) VALUES
(5, 'test@test.fr', 'PasswordSecure@1', 'Joran', 'Deroulo', '060325024', '3 rue du pré', '75018', 'Paris', '08/08/1999', '{\"1\":{\"product_name\":\"hermann_1_month\",\"active\":true,\"time_left\":30}}');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `payements_history`
--
ALTER TABLE `payements_history`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `payements_history`
--
ALTER TABLE `payements_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
