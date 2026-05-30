# 💧 Water Tank Monitor Card

Une carte Home Assistant (Lovelace) moderne, animée et hautement personnalisable pour suivre en temps réel le niveau, le volume et les statistiques de votre cuve de récupération d'eau de pluie ou de votre réservoir.

![Version](https://img.shields.io/github/v/release/xez7082/water-tank-card?style=flat-square)
![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square)
![Licence](https://img.shields.io/github/license/xez7082/water-tank-card?style=flat-square)

---

## ✨ Fonctionnalités

* **Cuve 3D Dynamique :** Rendu visuel de la cuve avec une animation fluide de l'eau, des vagues de surface (SVG) et des bulles montantes.
* **Indicateur de niveau intelligent :** Une échelle de graduation (0% à 100%) accompagnée d'un curseur lumineux néon qui s'aligne automatiquement sur la hauteur de l'eau.
* **Panneau de statistiques complet :** Affichage de 4 tuiles d'informations clés (Niveau actuel, Entrées d'eau, Consommation, Autonomie restante).
* **Graphiques Sparklines :** Mini-graphiques temporels intégrés à chaque tuile de statistique avec effet de halo translucide et point final palpitant.
* **Statut dynamique :** Pied de cuve adaptatif affichant un code couleur et un message selon le niveau restant (*Critique*, *Faible*, *Normal*, *Plein*).
* **Éditeur de carte visuel :** Intégration complète de l'interface de configuration native de Home Assistant pour configurer vos entités sans toucher au code YAML.
* **Design Moderne :** Effets de flou d'arrière-plan (*Glassmorphism*), dégradés de couleurs soignés et mode responsive pour smartphones, tablettes et PC.

---

## 📸 Aperçu de la carte

*(Une fois la carte installée, prenez une capture d'écran, nommez-la `preview.png` et déposez-la à la racine de votre projet GitHub pour qu'elle s'affiche ici).*

![Aperçu de la carte](preview.png)

---

## 🚀 Installation

### Méthode 1 : Via HACS (Recommandée)

1. Ouvrez **HACS** dans votre instance Home Assistant.
2. Cliquez sur les **3 petits points** en haut à droite, puis sélectionnez **Dépôts personnalisés** (*Custom repositories*).
3. Collez l'URL de votre dépôt GitHub : `https://github.com/xez7082/water-tank-card`
4. Sélectionnez la catégorie **Interface (Lovelace)** puis cliquez sur **Ajouter**.
5. Cherchez **Water Tank Monitor Card**, cliquez dessus puis faites **Télécharger**.
6. Redémarrez Home Assistant ou videz le cache de votre navigateur.

### Méthode 2 : Installation Manuelle

1. Téléchargez l'ensemble des fichiers source du dépôt.
2. Créez un dossier nommé `water-tank-card` dans votre répertoire `www` de Home Assistant : `/config/www/water-tank-card/`.
3. Placez-y tous les fichiers téléchargés (`water-tank-card.js`, `styles.js`, `tank.js`, `stats.js`, `water-tank-editor.js`).
4. Ajoutez la ressource dans votre tableau de bord Lovelace (*Paramètres* -> *Tableaux de bord* -> *3 points en haut à droite* -> *Ressources*) :
    * **URL :** `/local/water-tank-card/water-tank-card.js`
    * **Type de ressource :** `JavaScript Module`

---

## 🛠️ Configuration

Grâce à l'éditeur visuel intégré (`water-tank-editor.js`), vous pouvez ajouter et configurer la carte directement depuis l'interface graphique de Home Assistant en cliquant sur **"Ajouter une carte"** puis en cherchant **"Water Tank Monitor Card"**.

Si vous préférez utiliser le mode **YAML**, voici un exemple de configuration complète :

```yaml
type: custom:water-tank-card
title: "Cuve Eau Pluviale"
subtitle: "Jardin & Maison"
capacity: 5000
tank_level_entity: sensor.cuve_niveau_pourcentage
volume_entity: sensor.cuve_volume_litres
inflow_entity: sensor.cuve_entree_aujourdhui
usage_entity: sensor.cuve_consommation_aujourdhui
remaining_days_entity: sensor.cuve_autonomie_jours
📋 Options de ConfigurationParamètreTypeStatutPar défautDescriptiontypestringRequiscustom:water-tank-cardIdentifiant technique de la carte.tank_level_entitystringRequis-Entité capteur renvoyant le niveau en % (0 à 100).volume_entitystringRequis-Entité capteur renvoyant le volume actuel en Litres.titlestringOptionnelCuve Eau PluvialeTitre principal affiché en haut de la section statistiques.subtitlestringOptionnelSurveillanceSous-titre affiché juste en dessous du titre principal.capacitynumberOptionnel3000Capacité maximale de votre cuve (affichée dans le pied de cuve).inflow_entitystringOptionnel-Entité mesurant l'apport en eau du jour (ex: pluie récupérée).usage_entitystringOptionnel-Entité mesurant la consommation d'eau de la journée.remaining_days_entitystringOptionnel-Entité estimant le nombre de jours d'autonomie restants.📦 Structure du ProjetLe projet est découpé de manière modulaire en utilisant l'héritage par Mixins de JavaScript pour faciliter la maintenance et garder un code propre :📄 water-tank-card.js : Point d'entrée principal qui importe les styles et combine les différents Mixins pour assembler le tableau de bord final.📄 tank.js (TankMixin) : Gère toute la logique de rendu de la cuve 3D (niveau d'eau, vagues SVG, flux de bulles, curseur physique et le pied de cuve dynamique).📄 stats.js (StatsMixin) : Gère l'affichage des 4 tuiles de statistiques latérales (Niveau, Apport, Consommation, Autonomie) et l'intégration des graphiques dynamiques.📄 styles.js (cardStyles) : Feuille de style globale optimisée avec flous d'arrière-plan (Glassmorphism), lueurs adaptatives via color-mix() et gestion du responsive (Mobiles / Tablettes).📄 water-tank-editor.js : Formulaire d'édition visuel natif utilisé par Home Assistant en mode édition.📄 LicenceCe projet est sous licence MIT. Vous pouvez librement le copier, le modifier et le distribuer.👤 AuteurDéveloppé avec passion par xez7082. N'hésitez pas à ouvrir une Issue ou une Pull Request sur GitHub si vous rencontrez un problème ou si vous souhaitez proposer des améliorations !
