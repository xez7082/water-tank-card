import { LitElement, html } from "https://unpkg.com/lit@3/index.js?module";

import { cardStyles } from "../src/styles.js";
import "../src/water-tank-editor.js"; 

class WaterTankCard extends LitElement {
  static get styles() {
    return cardStyles;
  }

  static get properties() {
    return {
      hass: {},
      config: {},
      _level: { type: Number, state: true },
      _volume: { type: Number, state: true },
      _inflow: { type: String, state: true },
      _rain: { type: String, state: true },
      _temp: { type: String, state: true },
      _depth: { type: String, state: true },
      _sensorState: { type: String, state: true },
      _alert: { type: Boolean, state: true }
    };
  }

  constructor() {
    super();
    this._level = 0;
    this._volume = 0;
    this._inflow = "--";
    this._rain = "--";
    this._temp = "--";
    this._depth = "--";
    this._sensorState = "--";
    this._alert = false;

    this._bubbles = Array.from({ length: 15 }, () => ({
      left: Math.random() * 100,
      size: 4 + Math.random() * 8,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 6
    }));
  }

  setConfig(config) {
    if (!config.tank_level_entity) {
      throw new Error("L'entité 'tank_level_entity' est requise.");
    }
    this.config = {
      title: "Cuves IBC",
      subtitle: "Surveillance",
      capacity: 2000,
      ...config
    };
  }

  set hass(hass) {
    this._hass = hass;
    if (!hass || !this.config) return;

    // Niveau & Volume
    const levelState = hass.states[this.config.tank_level_entity];
    this._level = levelState && !isNaN(parseFloat(levelState.state)) ? parseFloat(levelState.state) : 0;

    if (this.config.tank_volume_entity && hass.states[this.config.tank_volume_entity]) {
      this._volume = parseFloat(hass.states[this.config.tank_volume_entity].state) || 0;
    } else {
      this._volume = Math.round((this._level / 100) * this.config.capacity);
    }

    // Extraction des autres capteurs
    this._inflow = this.config.inflow_entity && hass.states[this.config.inflow_entity] ? hass.states[this.config.inflow_entity].state : "--";
    this._rain = this.config.rain_entity && hass.states[this.config.rain_entity] ? hass.states[this.config.rain_entity].state : "--";
    this._temp = this.config.temp_entity && hass.states[this.config.temp_entity] ? hass.states[this.config.temp_entity].state : "--";
    this._depth = this.config.depth_entity && hass.states[this.config.depth_entity] ? hass.states[this.config.depth_entity].state : "--";
    this._sensorState = this.config.sensor_state_entity && hass.states[this.config.sensor_state_entity] ? hass.states[this.config.sensor_state_entity].state : "--";
    
    const alertState = this.config.alert_entity && hass.states[this.config.alert_entity];
    this._alert = alertState ? alertState.state === "on" : false;
  }

  get hass() { return this._hass; }
  getCardSize() { return 7; }

  render() {
    if (!this.hass || !this.config) return html``;

    return html`
      <ha-card class="${this._alert ? 'tank-alert-active' : ''}">
        <div class="water-tank-dashboard">
          ${this.renderTank()}
          ${this.renderStats()}
        </div>
        ${this.renderTechnicalFooter()}
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
          <div class="tank-status" style="color: ${this._alert ? '#ff5252' : this.getTankStateColor(level)}">
            ${this._alert ? 'Alerte Cuve' : this.getTankStateLabel(level)}
          </div>
          <div class="tank-capacity">Capacité: ${this.config.capacity}L</div>
        </div>
      </div>
    `;
  }

  renderScale(level) {
    return html`
      <div class="tank-scale">
        <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
        <div class="tank-indicator" style="bottom: ${level}%"></div>
      </div>
    `;
  }

  renderWaves() {
    return html`
      <svg class="wave wave1" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,40 C150,120 350,0 600,40 C850,80 1050,0 1200,40 L1200,120 L0,120 Z"></path></svg>
      <svg class="wave wave2" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,50 C200,0 400,120 600,50 C800,0 1000,120 1200,50 L1200,120 L0,120 Z"></path></svg>
    `;
  }

  renderBubbles() {
    return html`${this._bubbles.map(b => html`<span class="bubble" style="left: ${b.left}%; width: ${b.size}px; height: ${b.size}px; animation-delay: ${b.delay}s; animation-duration: ${b.duration}s;"></span>`)}`;
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

        ${this.renderStatCard("mdi:gauge", "#2ea8ff", "Volume mesuré", `${this._volume} L`, `Niveau: ${Math.round(this._level)}%`)}
        ${this.renderStatCard("mdi:water-plus", "#5dff7f", "Pluie Directe (Apport)", this._inflow, this._inflow !== "--" ? "L" : "")}
        ${this.renderStatCard("mdi:weather-rainy", "#00d2ff", "Précipitations Météo", this._rain, this._rain !== "--" ? "mm" : "")}
        ${this.renderStatCard("mdi:thermometer", "#ff9f43", "Température Extérieure", this._temp, this._temp !== "--" ? "°C" : "")}
      </div>
    `;
  }

  renderStatCard(icon, color, title, value, sub) {
    return html`
      <div class="stat-card" style="--card-color: ${color}">
        <div class="stat-icon"><ha-icon .icon=${icon}></ha-icon></div>
        <div class="stat-content">
          <div class="stat-label">${title}</div>
          <div class="stat-value">${value}</div>
          <div class="stat-sub">${sub}</div>
        </div>
      </div>
    `;
  }

  renderTechnicalFooter() {
    return html`
      <div class="tank-technical-footer" style="display: flex; justify-content: space-between; padding: 12px 16px; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: rgba(255,255,255,0.6);">
        <div><ha-icon icon="mdi:ruler" style="--mdc-icon-size: 16px; vertical-align: middle; margin-right: 4px;"></ha-icon> Profondeur: <strong>${this._depth} cm</strong></div>
        <div><ha-icon icon="mdi:connection" style="--mdc-icon-size: 16px; vertical-align: middle; margin-right: 4px;"></ha-icon> Capteur: <strong>${this._sensorState}</strong></div>
      </div>
    `;
  }

  getTankStateColor(level) {
    if (level <= 15) return "#ff5252";
    if (level <= 35) return "#ff9f43";
    return "#5dff7f";
  }

  getTankStateLabel(level) {
    if (level <= 15) return "Critique";
    if (level <= 35) return "Faible";
    if (level <= 85) return "Normal";
    return "Plein";
  }
}

customElements.define("water-tank-card", WaterTankCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "water-tank-card",
  name: "Water Tank Dashboard Card",
  preview: true,
  description: "Une carte au design Glassmorphism 3D pour surveiller le niveau d'une cuve d'eau et ses statistiques."
});
