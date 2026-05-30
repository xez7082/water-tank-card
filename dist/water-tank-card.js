import { LitElement, html, css } from "https://unpkg.com/lit@3/index.js?module";

class WaterTankCard extends LitElement {

  static properties = {
    hass: {},
    _level: { state: true },
    _volume: { state: true },
    _inflow: { state: true },
    _usage: { state: true },
    _remaining: { state: true }
  };

  static getConfigElement() {
    return document.createElement("water-tank-card-editor");
  }

  static getStubConfig() {
    return {
      title: "Cuve Eau",
      subtitle: "Surveillance",
      capacity: 3000
    };
  }

  setConfig(config) {

    if (!config.tank_level_entity)
      throw new Error("tank_level_entity requis");

    this.config = {
      capacity: 3000,
      ...config
    };
  }

  set hass(hass) {

    this._hass = hass;

    this._level =
      Number(
        hass.states[
          this.config.tank_level_entity
        ]?.state || 0
      );

    this._volume =
      Number(
        hass.states[
          this.config.tank_volume_entity
        ]?.state || 0
      );

    this._inflow =
      hass.states[
        this.config.inflow_entity
      ]?.state || "--";

    this._usage =
      hass.states[
        this.config.usage_entity
      ]?.state || "--";

    this._remaining =
      hass.states[
        this.config.remaining_days_entity
      ]?.state || "--";
  }

  getCardSize() {
    return 6;
  }

  render() {

    return html`

      <ha-card class="card">

        <div class="container">

          ${this.renderTank()}

          ${this.renderStats()}

        </div>

      </ha-card>
    `;
  }

  renderTank() {

    const level =
      Math.max(
        0,
        Math.min(100, this._level)
      );

    return html`

      <div class="tank-section">

        <div class="tank-wrapper">

          ${this.renderScale(level)}

          <div class="tank">

            <div
              class="water"
              style="height:${level}%"
            >

              ${this.renderWaves()}

              ${this.renderBubbles()}

            </div>

            <div class="tank-overlay">

              <div class="percent">
                ${level}%
              </div>

              <div class="volume">
                ${this._volume} L
              </div>

            </div>

          </div>

        </div>

      </div>

    `;
  }

  renderScale(level) {

    return html`

      <div class="scale">

        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>

        <div
          class="indicator"
          style="bottom:${level}%"
        ></div>

      </div>

    `;
  }

  renderWaves() {

    return html`

      <svg
        class="wave wave1"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d="
          M0,40
          C150,120
          350,0
          600,40
          C850,80
          1050,0
          1200,40
          L1200,120
          L0,120
          Z">
        </path>
      </svg>

      <svg
        class="wave wave2"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d="
          M0,50
          C200,0
          400,120
          600,50
          C800,0
          1000,120
          1200,50
          L1200,120
          L0,120
          Z">
        </path>
      </svg>

    `;
  }

  renderBubbles() {

    return html`

      ${Array.from(
        { length: 24 },
        (_, i) => html`

          <span
            class="bubble"
            style="
              left:${Math.random()*100}%;
              width:${6 + Math.random()*10}px;
              height:${6 + Math.random()*10}px;
              animation-delay:${Math.random()*8}s;
              animation-duration:${6 + Math.random()*8}s;
            "
          ></span>

        `
      )}

    `;
  }

  renderStats() {

    return html`

      <div class="stats">

        <div class="header">

          <div class="title">

            <ha-icon
              icon="mdi:water"
            ></ha-icon>

            <div>

              <h2>
                ${this.config.title}
              </h2>

              <span>
                ${this.config.subtitle}
              </span>

            </div>

          </div>

        </div>

        ${this.renderStatCard(
          "mdi:gauge",
          "#2ea8ff",
          "Niveau actuel",
          `${this._level}%`,
          `${this._volume} L`
        )}

        ${this.renderStatCard(
          "mdi:water-plus",
          "#5dff7f",
          "Entrée aujourd'hui",
          this._inflow,
          "litres"
        )}

        ${this.renderStatCard(
          "mdi:water-minus",
          "#ff9f43",
          "Consommation",
          this._usage,
          "litres"
        )}

        ${this.renderStatCard(
          "mdi:calendar-clock",
          "#8b5cf6",
          "Autonomie",
          this._remaining,
          "jours"
        )}

      </div>

    `;
  }

  renderStatCard(
    icon,
    color,
    title,
    value,
    sub
  ) {

    return html`

      <div
        class="stat-card"
        style="--color:${color}"
      >

        <div class="icon">

          <ha-icon
            .icon=${icon}
          ></ha-icon>

        </div>

        <div class="content">

          <div class="label">
            ${title}
          </div>

          <div class="value">
            ${value}
          </div>

          <div class="sub">
            ${sub}
          </div>

        </div>

      </div>

    `;
  }
}

customElements.define(
  "water-tank-card",
  WaterTankCard
);
