import { html } from "https://unpkg.com/lit@3/index.js?module";

export const StatsMixin = (SuperClass) =>
  class extends SuperClass {
    // Interception de la mise à jour pour charger l'historique une fois que l'entité est prête
    updated(changedProperties) {
      super.updated(changedProperties);
      
      // On charge l'historique au premier rendu ou si l'API hass devient disponible
      if (!this._historyInitialized && this._hass && this.config) {
        this._historyInitialized = true;
        this.loadStatisticsHistory();
        
        // Rafraîchir l'historique toutes les 5 minutes automatiquement
        this._historyInterval = setInterval(() => {
          this.loadStatisticsHistory();
        }, 5 * 60 * 1000);
      }
    }

    // Sécurité pour nettoyer le timer si la carte est retirée du DOM
    disconnectedCallback() {
      if (this._historyInterval) {
        clearInterval(this._historyInterval);
      }
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }

    renderStats() {
      const level = Number(this._level || 0);
      const volume = Number(this._volume || 0);

      return html`
        <div class="stats-panel">
          <div class="stats-header">
            <div class="stats-title">
              <ha-icon icon="mdi:water"></ha-icon>
              <div>
                <h2>${this.config.title || "Cuve Eau"}</h2>
                <span>${this.config.subtitle || "Surveillance"}</span>
              </div>
            </div>
          </div>

          ${this.renderStatCard({
            icon: "mdi:gauge",
            color: "#2ea8ff",
            title: "Niveau actuel",
            value: `${Math.round(level)}%`,
            sub: `${volume} L`,
            history: this.levelHistory || []
          })}

          ${this.renderStatCard({
            icon: "mdi:water-plus",
            color: "#5dff7f",
            title: "Entrée aujourd'hui",
            value: `${this._inflow ?? "--"}`,
            sub: "Litres",
            history: this.inflowHistory || []
          })}

          ${this.renderStatCard({
            icon: "mdi:water-minus",
            color: "#ff9f43",
            title: "Consommation",
            value: `${this._usage ?? "--"}`,
            sub: "Litres",
            history: this.usageHistory || []
          })}

          ${this.renderStatCard({
            icon: "mdi:calendar-clock",
            color: "#8b5cf6",
            title: "Autonomie",
            value: `${this._remaining ?? "--"}`,
            sub: this._remaining === "1" || this._remaining === "0" ? "Jour" : "Jours",
            history: this.remainingHistory || []
          })}

          <div class="stats-footer">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            Dernière mise à jour : ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      `;
    }

    renderStatCard(config) {
      return html`
        <div class="stat-card" style="--card-color: ${config.color}">
          <div class="stat-icon">
            <ha-icon .icon=${config.icon}></ha-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">${config.title}</div>
            <div class="stat-value">${config.value}</div>
            <div class="stat-sub">${config.sub}</div>
            ${this.renderSparkline(config.history, config.color)}
          </div>
        </div>
      `;
    }

    renderSparkline(values = [], color = "#2ea8ff") {
      // Données factices par défaut si l'entité n'a pas encore chargé son historique
      if (!values || values.length === 0) {
        values = [15, 14, 18, 22, 21, 25, 24, 30, 28, 35, 32, 40];
      }

      const width = 100;
      const height = 30;
      const padding = 2; // Empêche l'épaisseur de ligne de déborder en haut/bas

      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = Math.max(max - min, 1);

      const pointsArray = values.map((value, index) => {
        const x = values.length > 1 ? (index / (values.length - 1)) * width : width;
        const y = padding + (height - padding * 2) * (1 - (value - min) / range);
        return { x, y };
      });

      const points = pointsArray.map(p => `${p.x},${p.y}`).join(" ");
      const area = `${points} ${width},${height} 0,${height}`;
      const lastPoint = pointsArray[pointsArray.length - 1];
      
      // Nettoyage propre du code couleur pour l'identifiant du filtre SVG
      const cleanColorId = color.replace('#', '');

      return html`
        <svg class="sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
          <defs>
            <linearGradient id="spark-${cleanColorId}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${color}" stop-opacity="0.25" />
              <stop offset="100%" stop-color="${color}" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <polygon points="${area}" fill="url(#spark-${cleanColorId})"></polygon>

          <polyline
            points="${points}"
            fill="none"
            stroke="${color}"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></polyline>

          <circle cx="${lastPoint.x}" cy="${lastPoint.y}" r="2.5" fill="${color}">
            <animate
              attributeName="r"
              values="2.5;3.8;2.5"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      `;
    }

    async loadStatisticsHistory() {
      if (!this._hass || !this.config) return;

      // Récupération asynchrone en parallèle de tous les historiques pour de meilleures performances
      const [level, inflow, usage, remaining] = await Promise.all([
        this.fetchHistory(this.config.tank_level_entity),
        this.fetchHistory(this.config.inflow_entity),
        this.fetchHistory(this.config.usage_entity),
        this.fetchHistory(this.config.remaining_days_entity)
      ]);

      this.levelHistory = level;
      this.inflowHistory = inflow;
      this.usageHistory = usage;
      this.remainingHistory = remaining;

      this.requestUpdate();
    }

    async fetchHistory(entityId) {
      if (!entityId) return [];

      try {
        const end = new Date();
        const start = new Date(end.getTime() - 24 * 3600000); // Historique glissant sur 24h

        const url = `history/period/${start.toISOString()}?filter_entity_id=${entityId}&end_time=${end.toISOString()}`;
        const result = await this._hass.callApi("GET", url);

        return (result?.[0] || [])
          .map(x => Number(x.state))
          .filter(x => !isNaN(x));
      } catch (err) {
        console.error(`Erreur historique pour l'entité ${entityId}:`, err);
        return [];
      }
    }
  };
