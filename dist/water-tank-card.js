import { LitElement, html } from "https://unpkg.com/lit@3/index.js?module";
import { cardStyles } from "./styles.js";

class WaterTankCard extends LitElement {
  // Liaison avec le fichier styles.js
  static styles = cardStyles;

  static properties = {
    hass: {},
    _level: { state: true },
    _volume: { state: true },
    _inflow: { state: true },
    _usage: { state: true },
    _remaining: { state: true }
  };

  constructor() {
    super();
    // Génère les propriétés des bulles une seule fois pour éviter le clignotement au re-render
    this._bubbles = Array.from({ length: 15 }, () => ({
      left: Math.random() * 100,
      size: 4 + Math.random() * 8,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 6
    }));
  }

  static getConfigElement() {
    return document.createElement("water-tank-card-editor");
  }

  static getStubConfig() {
    return {
      title: "Cuve Eau",
      subtitle: "Surveillance",
      capacity: 3000,
      tank_level_entity: ""
    };
  }

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

  set hass(hass) {
    this._hass = hass;

    // Récupération sécurisée du niveau
    const levelState = hass.states[this.config.tank_level_entity];
    this._level = levelState ? Number(levelState.state) : 0;

    // Récupération du volume (ou calcul basé sur la capacité si l'entité n'est pas fournie)
    if (this.config.tank_volume_entity) {
      const volumeState = hass.states[this.config.tank_volume_entity];
      this._volume = volumeState ? Number(volumeState.state) : 0;
    } else {
      this._volume = Math.round((this._level / 100) * this.config.capacity);
    }

    // Récupération des statistiques optionnelles
    this._inflow = this.config.inflow_entity 
      ? (hass.states[this.config.inflow_entity]?.state || "--") 
      : "--";

    this._usage = this.config.usage_entity 
      ? (hass.states[this.config.usage_entity]?.state || "--") 
      : "--";

    this._remaining = this.config.remaining_days_entity 
      ? (hass.states[this.config.remaining_days_entity]?.state || "--") 
      : "--";
  }

  getCardSize() {
    return 6;
  }

  render() {
    if (!this._hass || !this.config) return html``;

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
          "L"
        )}

        ${this.renderStatCard(
          "mdi:water-minus",
          "#ff9f43",
          "Consommation",
          this._usage,
          "L"
        )}

        ${this.renderStatCard(
          "mdi:calendar-clock",
          "#8b5cf6",
          "Autonomie restante",
          this._remaining,
          this._remaining === "1" || this._remaining === "0" ? "jour" : "jours"
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

// Définition de l'élément personnalisé
customElements.define("water-tank-card", WaterTankCard);

// Déclaration pour que Home Assistant le détecte dans la liste des cartes personnalisées
window.customCards = window.customCards || [];
window.customCards.push({
  type: "water-tank-card",
  name: "Water Tank Dashboard Card",
  preview: true,
  description: "Une carte au design Glassmorphism 3D pour surveiller le niveau d'une cuve d'eau et ses statistiques."
});
