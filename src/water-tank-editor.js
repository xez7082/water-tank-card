import { html, LitElement } from "https://unpkg.com/lit@3/index.js?module";

export class WaterTankEditor extends LitElement {
  // Indique à Home Assistant quelles sont les propriétés réactives
  static get properties() {
    return {
      hass: {},
      _config: {}
    };
  }

  // Configuration initiale reçue de Home Assistant
  setConfig(config) {
    this._config = config;
  }

  // Reçoit l'état de la configuration actuelle
  get config() {
    return this._config;
  }

  // Rendu de l'interface de l'éditeur
  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    // Extraction des entités de type capteur de Home Assistant pour peupler les listes déroulantes
    const sensors = Object.keys(this.hass.states).filter(
      (eid) => eid.startsWith("sensor.") || eid.startsWith("input_number.")
    );

    return html`
      <div class="card-config">
        <div class="config-section">
          <div class="section-title">Configuration Générale</div>
          
          <ha-textfield
            label="Titre principal (ex: Cuve Eau)"
            .value="${this._config.title || ""}"
            .configValue="${"title"}"
            @input="${this._valueChanged}"
          ></ha-textfield>

          <ha-textfield
            label="Sous-titre (ex: Surveillance)"
            .value="${this._config.subtitle || ""}"
            .configValue="${"subtitle"}"
            @input="${this._valueChanged}"
          ></ha-textfield>

          <ha-textfield
            label="Capacité maximale de la cuve (en Litres)"
            type="number"
            .value="${this._config.capacity || 3000}"
            .configValue="${"capacity"}"
            @input="${this._valueChanged}"
          ></ha-textfield>
        </div>

        <div class="config-section">
          <div class="section-title">Entités du Réservoir</div>

          <div class="select-field">
            <label>Niveau de la cuve (en %)*</label>
            <select .value="${this._config.tank_level_entity || ""}" .configValue="${"tank_level_entity"}" @change="${this._valueChanged}">
              <option value="">-- Choisir une entité --</option>
              ${sensors.map(eid => html`<option value="${eid}">${eid}</option>`)}
            </select>
          </div>

          <div class="select-field">
            <label>Volume d'eau actuel (en Litres)*</label>
            <select .value="${this._config.volume_entity || ""}" .configValue="${"volume_entity"}" @change="${this._valueChanged}">
              <option value="">-- Choisir une entité --</option>
              ${sensors.map(eid => html`<option value="${eid}">${eid}</option>`)}
            </select>
          </div>

          <div class="select-field">
            <label>Entrée d'eau aujourd'hui (Optionnel)</label>
            <select .value="${this._config.inflow_entity || ""}" .configValue="${"inflow_entity"}" @change="${this._valueChanged}">
              <option value="">-- Choisir une entité --</option>
              ${sensors.map(eid => html`<option value="${eid}">${eid}</option>`)}
            </select>
          </div>

          <div class="select-field">
            <label>Consommation aujourd'hui (Optionnel)</label>
            <select .value="${this._config.usage_entity || ""}" .configValue="${"usage_entity"}" @change="${this._valueChanged}">
              <option value="">-- Choisir une entité --</option>
              ${sensors.map(eid => html`<option value="${eid}">${eid}</option>`)}
            </select>
          </div>

          <div class="select-field">
            <label>Autonomie restante en jours (Optionnel)</label>
            <select .value="${this._config.remaining_days_entity || ""}" .configValue="${"remaining_days_entity"}" @change="${this._valueChanged}">
              <option value="">-- Choisir une entité --</option>
              ${sensors.map(eid => html`<option value="${eid}">${eid}</option>`)}
            </select>
          </div>
        </div>
      </div>

      <style>
        .card-config {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 8px;
        }
        .config-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.15);
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: var(--secondary-text-color, #2ea8ff);
          margin-bottom: 4px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 6px;
        }
        ha-textfield {
          width: 100%;
        }
        .select-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .select-field label {
          font-size: 13px;
          color: var(--secondary-text-color, #cbd5e1);
        }
        select {
          width: 100%;
          padding: 12px;
          border-radius: 4px;
          border: 1px solid var(--ha-card-border-color, rgba(255, 255, 255, 0.2));
          background-color: var(--card-background-color, #1c2538);
          color: var(--primary-text-color, #ffffff);
          font-size: 14px;
          outline: none;
          cursor: pointer;
        }
        select:focus {
          border-color: var(--primary-color, #2ea8ff);
        }
      </style>
    `;
  }

  // Fonction déclenchée à chaque modification de champ
  _valueChanged(ev) {
    if (!this._config || !this.hass) return;

    const target = ev.target;
    const configValue = target.configValue;
    
    // Détermination de la valeur selon le type de champ
    let newValue = target.value;
    if (target.type === "number") {
      newValue = Number(newValue);
    }

    // Si la valeur n'a pas changé, on ignore
    if (this._config[configValue] === newValue) return;

    // Duplication de la configuration actuelle et application du changement
    const newConfig = {
      ...this._config,
      [configValue]: newValue
    };

    // Si le champ est vidé, on supprime la clé de la configuration pour un rendu propre
    if (newValue === "") {
      delete newConfig[configValue];
    }

    // Envoi de l'événement obligatoire à Home Assistant pour sauvegarder la carte
    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

// Enregistrement de l'élément personnalisé auprès du navigateur
customElements.define("water-tank-editor", WaterTankEditor);
