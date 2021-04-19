# Speedtest

Tester la rapidité de votre connexion internet ainsi que votre ping en utilisant [speedtest.net](https://www.speedtest.net) depuis un CLI.

<img src="screenshot.gif" width="404">

## Installation

Assure-toi d'avoir [Node.js et npm](https://nodejs.org) d'installer puis suis ces étapes dans l'ordre (tu auras peut-être besoin de redémarrer ton terminal / ton appareil après l'installation pour l'utiliser) :

* Télécharger tous les fichiers nécessaires (sauf quelques fichiers genres screenshot.gif ou readme.md mais c'est pas obligé)
* Ouvrir un terminal et aller dans le dossier où se trouve les fichiers téléchargé lors de la dernière étape.
* Faire quelques commandes...
```
$ npm i
.......
$ npm link
```

## Utilisation

```
$ speed-test --help

  Utilisation
    $ speedtest

  Options
    --fast -f  Speedtest plus rapide / plus court
```

## Nouveautés (entre l'original et l'edit)

* Traduction en FR
* Suppression de l'option "json" et "bytes" (elle était pas très utile)
* Activation par défaut de l'option "verbose" (qui affiche plus de détail)
* Ajout de l'option "fast" qui rend le test plus rapide / court
* Modification du temps pris par le test : **Normal :** 15 secondes, **Fast :** 6 secondes
* Suppression du module pour afficher un symbole à côté des erreurs (au moins ça fait gagner en peu de stockage)
* Suppression du système de mise à jour

## En lien avec


- [speed-test (original)](https://github.com/sindresorhus/fast-cli) - Test your download speed using speedtest.net | Projet original
- [fast-cli](https://github.com/sindresorhus/fast-cli) - Test your download speed using fast.com | Projet original, version fast.com

## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
(là tu regarde une version modifié faite par [Johan](https://johan-perso.glitch.me))
