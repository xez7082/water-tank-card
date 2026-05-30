import { LitElement, html } from "https://unpkg.com/lit@3/index.js?module";

// CORRECTION DES CHEMINS : On remonte d'un dossier pour quitter "dist" et aller chercher dans "src"
import { cardStyles } from "../src/styles.js";
import "../src/water-tank-editor.js"; 

class WaterTankCard extends LitElement {
  // Liaison avec le fichier styles.js
  static get styles() {
    return cardStyles;
  }

  // Déclaration des propriétés réactives et internes de Lit
  static get properties() {
    return {
      hass: {},
      config: {},
      _level: { type: Number, state: true },
      _volume: { type: Number, state: true },
      _inflow: { type: String, state: true },
      _usage: { type: String, state: true },
      _remaining: { type: String, state: true }
    };
  }

  constructor() {
    super();
    // Valeurs par défaut pour éviter le rendu de valeurs "undefined" au premier cycle
    this._level = 0;
    this._volume = 0;
    this._inflow = "--";
    this._usage = "--";
    this._remaining = "--";

    // Génère les propriétés des bulles une seule fois pour éviter le clignotement au re-render
    this._bubbles = Array.from({ length: 15 }, () => ({
      left: Math.random() * 100,
      size: 4 + Math.random() * 8,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 6
    }));
  }

  // Liaison avec l'interface graphique de configuration de Home Assistant
  static getConfigElement() {
    return document.createElement("water-tank-editor");
  }

  // Configuration par défaut lors de la prévisualisation ou création initiale
  static getStubConfig() {
    return {
      title: "Cuve Eau",
      subtitle: "Surveillance",
      capacity: 3000,
      tank_level_entity: "",
      tank_volume_entity: "",
      inflow_entity: "",
      usage_entity: "",
      remaining_days_entity: ""
    };
  }

  // Application et validation de la configuration YAML reçue
  setConfig(config) {
    if (!config.tank_level_entity) {
      throw new Error("L'entité 'tank_level_entity' est requise.");
    }

    this.config = {
      title: "Cuve Eau",
      subtitle: "Surveillance",
      capacity: 3000,
      ...config
    };
  }

  // Interception et extraction en temps réel des données d'états de Home Assistant
  set hass(hass) {
    this._hass = hass;
    if (!hass || !this.config) return;

    // 1. Récupération sécurisée du niveau (Conversion en float)
    const levelState = hass.states[this.config.tank_level_entity];
    this._level = levelState && !isNaN(parseFloat(levelState.state)) ? parseFloat(levelState.state) : 0;

    // 2. Récupération ou calcul dynamique du volume en Litres
    if (this.config.tank_volume_entity && hass.states[this.config.tank_volume_entity]) {
      const volumeState = hass.states[this.config.tank_volume_entity];
      this._volume = volumeState && !isNaN(parseFloat(volumeState.state)) ? parseFloat(volumeState.state) : 0;
    } else {
      // Règle de trois proportionnelle basée sur le % actuel et la capacité max
      this._volume = Math.round((this._level / 100) * this.config.capacity);
    }

    // 3. Récupération des capteurs de statistiques optionnels (avec repli si indisponibles)
    this._inflow = this.config.inflow_entity && hass.states[this.config.inflow_entity]
      ? hass.states[this.config.inflow_entity].state
      : "--";

    this._usage = this.config.usage_entity && hass.states[this.config.usage_entity]
      ? hass.states[this.config.usage_entity].state
      : "--";

    this._remaining = this.config.remaining_days_entity && hass.states[this.config.remaining_days_entity]
      ? hass.states[this.config.remaining_days_entity].state
      : "--";
  }

  get hass() {
    return this._hass;
  }

  getCardSize() {
    return 6;
  }

  render() {
    if (!this.hass || !this.config) return html``;

    return html`
      <ha-card>
        <div class="water-tank-dashboard">
          ${this.renderTank()}
          ${this.renderStats()}
        </div>
      </ha-card>
    `;
  }

  renderTank() {
    // Contrainte stricte pour éviter que l'eau ne sorte visuellement de la cuve (0 à 100%)
    const level = Math.max(0, Math.min(100, this._level));

    return html`
      <div class="tank-section">
        ${this.renderScale(level)}
        <div class="tank-container">
          <div class="tank">
            <div class="water" style="height:${level}%">
              <div class="water-glow"></div>
              ${this.renderWaves()}
              ${this.renderBubbles()}
              <div class="water-reflection"></div>
            </div>
            
            <div class="tank-overlay">
              <div class="tank-percent">${Math.round(level)}%</div>
              <div class="tank-volume">${this._volume} L</div>
            </div>
          </div>
        </div>
        
        <div class="tank-footer">
          <div class="tank-status" style="color: ${this.getTankStateColor(level)}">
            ${this.getTankStateLabel(level)}
          </div>
          <div class="tank-capacity">Capacité: ${this.config.capacity}L</div>
        </div>
      </div>
    `;
  }

  renderScale(level) {
    return html`
      <div class="tank-scale">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
        <div class="tank-indicator" style="bottom: ${level}%"></div>
      </div>
    `;
  }

  renderWaves() {
    return html`
      <svg class="wave wave1" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,40 C150,120 350,0 600,40 C850,80 1050,0 1200,40 L1200,120 L0,120 Z"></path>
      </svg>
      <svg class="wave wave2" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,50 C200,0 400,120 600,50 C800,0 1000,120 1200,50 L1200,120 L0,120 Z"></path>
      </svg>
    `;
  }

  renderBubbles() {
    return html`
      ${this._bubbles.map(
        (b) => html`
          <span
            class="bubble"
            style="
              left: ${b.left}%;
              width: ${b.size}px;
              height: ${b.size}px;
              animation-delay: ${b.delay}s;
              animation-duration: ${b.duration}s;
            "
          ></span>
        `
      )}
    `;
  }

  renderStats() {
    // Détermination de l'affichage du pluriel pour l'autonomie restante
    const isPlural = this._remaining !== "1" && this._remaining !== "0" && this._remaining !== "--";
    const dayLabel = isPlural ? "jours" : "jour";

    return html`
      <div class="stats-panel">
        <div class="stats-header">
          <div class="stats-title">
            <ha-icon icon="mdi:water"></ha-icon>
            <div>
              <h2>${this.config.title}</h2>
              <span>${this.config.subtitle}</span>
            </div>
          </div>
        </div>

        ${this.renderStatCard(
          "mdi:gauge",
          "#2ea8ff",
          "Niveau actuel",
          `${Math.round(this._level)}%`,
          `${this._volume} L`
        )}

        ${this.renderStatCard(
          "mdi:water-plus",
          "#5dff7f",
          "Entrée aujourd'hui",
          this._inflow,
          this._inflow !== "--" ? "L" : ""
        )}

        ${this.renderStatCard(
          "mdi:water-minus",
          "#ff9f43",
          "Consommation",
          this._usage,
          this._usage !== "--" ? "L" : ""
        )}

        ${this.renderStatCard(
          "mdi:calendar-clock",
          "#8b5cf6",
          "Autonomie restante",
          this._remaining,
          this._remaining !== "--" ? dayLabel : ""
        )}
      </div>
    `;
  }

  renderStatCard(icon, color, title, value, sub) {
    return html`
      <div class="stat-card" style="--card-color: ${color}">
        <div class="stat-icon">
          <ha-icon .icon=${icon}></ha-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">${title}</div>
          <div class="stat-value">${value}</div>
          <div class="stat-sub">${sub}</div>
        </div>
      </div>
    `;
  }

  getTankStateColor(level) {
    if (level <= 15) return "#ff5252"; // Rouge critique
    if (level <= 35) return "#ff9f43"; // Orange bas
    return "#5dff7f"; // Vert normal/plein
  }

  getTankStateLabel(level) {
    if (level <= 15) return "Critique";
    if (level <= 35) return "Faible";
    if (level <= 85) return "Normal";
    return "Plein";
  }
}

// Définition de l'élément personnalisé auprès du navigateur
customElements.define("water-tank-card", WaterTankCard);

// Déclaration pour que Home Assistant l'ajoute à la liste des cartes personnalisées détectables
window.customCards = window.customCards || [];
window.customCards.push({
  type: "water-tank-card",
  name: "Water Tank Dashboard Card",
  preview: true,
  description: "Une carte au design Glassmorphism 3D pour surveiller le niveau d'une cuve d'eau et ses statistiques."
});
