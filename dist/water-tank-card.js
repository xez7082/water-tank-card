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
      _alert: { type: Boolean, state: true },
      
      // Nouvelles propriétés pour les états des entités ajoutées
      _tempCabane: { type: String, state: true },
      _tempMinAnnuelle: { type: String, state: true },
      _tempMaxAnnuelle: { type: String, state: true },
      _priseBeemState: { type: String, state: true },
      _storeTerrasseState: { type: String, state: true },
      _storeTerrassePos: { type: Number, state: true }
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

    // Initialisation des nouveaux états
    this._tempCabane = "--";
    this._tempMinAnnuelle = "--";
    this._tempMaxAnnuelle = "--";
    this._priseBeemState = "off";
    this._storeTerrasseState = "closed";
    this._storeTerrassePos = 0;

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

    // Extraction des capteurs standards
    this._inflow = this.config.inflow_entity && hass.states[this.config.inflow_entity] ? hass.states[this.config.inflow_entity].state : "--";
    this._rain = this.config.rain_entity && hass.states[this.config.rain_entity] ? hass.states[this.config.rain_entity].state : "--";
    this._temp = this.config.temp_entity && hass.states[this.config.temp_entity] ? hass.states[this.config.temp_entity].state : "--";
    this._depth = this.config.depth_entity && hass.states[this.config.depth_entity] ? hass.states[this.config.depth_entity].state : "--";
    this._sensorState = this.config.sensor_state_entity && hass.states[this.config.sensor_state_entity] ? hass.states[this.config.sensor_state_entity].state : "--";
    
    const alertState = this.config.alert_entity && hass.states[this.config.alert_entity];
    this._alert = alertState ? alertState.state === "on" : false;

    // Extraction dynamique des nouvelles entités demandées
    const tCabane = hass.states["sensor.tdeg_cabane_temperature"];
    this._tempCabane = tCabane ? `${parseFloat(tCabane.state).toFixed(1)}°C` : "--";

    const tMin = hass.states["sensor.temperature_minimale_annuelle"];
    this._tempMinAnnuelle = tMin ? `${parseFloat(tMin.state).toFixed(1)}°C` : "--";

    const tMax = hass.states["sensor.temperature_maximale_annuelle"];
    this._tempMaxAnnuelle = tMax ? `${parseFloat(tMax.state).toFixed(1)}°C` : "--";

    const pBeem = hass.states["switch.prise_beem_maison"];
    this._priseBeemState = pBeem ? pBeem.state : "off";

    const sTerrasse = hass.states["cover.store_terrasse"];
    if (sTerrasse) {
      this._storeTerrasseState = sTerrasse.state;
      this._storeTerrassePos = sTerrasse.attributes.current_position ?? 0;
    }
  }

  get hass() { return this._hass; }
  getCardSize() { return 8; }

  // Méthodes d'interaction pour les commandes et boutons
  _togglePrise() {
    this.hass.callService("switch", "toggle", { entity_id: "switch.prise_beem_maison" });
  }

  _callCover(service) {
    this.hass.callService("cover", service, { entity_id: "cover.store_terrasse" });
  }

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

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          ${this.renderStatCard("mdi:gauge", "#2ea8ff", "Volume mesuré", `${this._volume} L`, `Niveau: ${Math.round(this._level)}%`)}
          ${this.renderStatCard("mdi:water-plus", "#5dff7f", "Pluie Directe", this._inflow, this._inflow !== "--" ? "L" : "")}
          ${this.renderStatCard("mdi:weather-rainy", "#00d2ff", "Précipitations", this._rain, this._rain !== "--" ? "mm" : "")}
          ${this.renderStatCard("mdi:thermometer", "#ff9f43", "Temp. Extérieure", this._temp, this._temp !== "--" ? "°C" : "")}
        </div>

        <div class="extra-section" style="margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06);">
          <div style="font-size: 11px; color: rgba(255,255,255,0.4); font-weight: bold; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">Suivi Températures</div>
          <div style="display: flex; gap: 8px; justify-content: space-between;">
            <div style="flex: 1; background: rgba(255,255,255,0.03); border-radius: 8px; padding: 6px 10px; text-align: center;">
              <div style="font-size: 10px; color: rgba(255,255,255,0.5);">Cabane</div>
              <div style="font-size: 13px; font-weight: bold; color: #ff9f43; margin-top: 2px;">${this._tempCabane}</div>
            </div>
            <div style="flex: 1; background: rgba(255,255,255,0.03); border-radius: 8px; padding: 6px 10px; text-align: center;">
              <div style="font-size: 10px; color: rgba(255,255,255,0.5);">Min Annuel</div>
              <div style="font-size: 13px; font-weight: bold; color: #7dd3fc; margin-top: 2px;">${this._tempMinAnnuelle}</div>
            </div>
            <div style="flex: 1; background: rgba(255,255,255,0.03); border-radius: 8px; padding: 6px 10px; text-align: center;">
              <div style="font-size: 10px; color: rgba(255,255,255,0.5);">Max Annuel</div>
              <div style="font-size: 13px; font-weight: bold; color: #f87171; margin-top: 2px;">${this._tempMaxAnnuelle}</div>
            </div>
          </div>
        </div>

        <div class="extra-section" style="margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06);">
          <div style="font-size: 11px; color: rgba(255,255,255,0.4); font-weight: bold; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">Commandes & Équipements</div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 6px 10px; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <ha-icon icon="mdi:solar-power-variant" style="color: #a78bfa; --mdc-icon-size: 18px;"></ha-icon>
                <div style="font-size: 12px; font-weight: 500;">Beem Maison</div>
              </div>
              <button @click=${this._togglePrise} style="background: ${this._priseBeemState === 'on' ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${this._priseBeemState === 'on' ? '#a78bfa' : 'rgba(255,255,255,0.1)'}; border-radius: 6px; padding: 4px 10px; color: #fff; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.2s;">
                ${this._priseBeemState === "on" ? "Allumé" : "Éteint"}
              </button>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 6px 10px; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <ha-icon icon="mdi:blinds" style="color: #34d399; --mdc-icon-size: 18px;"></ha-icon>
                <div style="font-size: 12px; font-weight: 500;">Store Terrasse <span style="color: rgba(255,255,255,0.4); font-size: 11px;">(${this._storeTerrassePos}%)</span></div>
              </div>
              <div style="display: flex; gap: 4px;">
                <button @click=${() => this._callCover('open_cover')} style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 2px 6px; color: #fff; cursor: pointer;"><ha-icon icon="mdi:arrow-up" style="--mdc-icon-size: 14px;"></ha-icon></button>
                <button @click=${() => this._callCover('stop_cover')} style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 2px 6px; color: #fff; cursor: pointer;"><ha-icon icon="mdi:stop" style="--mdc-icon-size: 14px;"></ha-icon></button>
                <button @click=${() => this._callCover('close_cover')} style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 2px 6px; color: #fff; cursor: pointer;"><ha-icon icon="mdi:arrow-down" style="--mdc-icon-size: 14px;"></ha-icon></button>
              </div>
            </div>

          </div>
        </div>

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
