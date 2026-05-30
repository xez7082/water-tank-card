class SparklineCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) throw new Error("L'attribut 'entity' est requis");

    this.config = {
      color: "#2ea8ff",
      hours: 24,
      fill: true,
      ...config
    };
  }

  set hass(hass) {
    this._hass = hass;
    const entityState = hass.states[this.config.entity];

    if (!entityState) return;

    // Initialisation du Shadow DOM
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <style>
          ha-card {
            padding: 12px;
            background: var(--ha-card-background, rgba(255, 255, 255, 0.03));
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: var(--ha-card-border-radius, 16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
          }
          svg {
            width: 100%;
            height: 60px;
            overflow: visible; /* Évite que le point de fin soit tronqué */
          }
        </style>
        <ha-card>
          <svg id="chart" viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient-${this.config.entity.replace('.', '-')}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${this.config.color}" stop-opacity="0.25" />
                <stop offset="100%" stop-color="${this.config.color}" stop-opacity="0.0" />
              </linearGradient>
            </defs>
          </svg>
        </ha-card>
      `;
      this._lastState = entityState.state;
      this.loadHistory();
    } 
    // Si l'état change, on recharge l'historique pour mettre à jour la courbe
    else if (entityState.state !== this._lastState) {
      this._lastState = entityState.state;
      this.loadHistory();
    }
  }

  async loadHistory() {
    try {
      const end = new Date();
      const start = new Date(end.getTime() - this.config.hours * 3600000);

      const url = `history/period/${start.toISOString()}?filter_entity_id=${this.config.entity}&end_time=${end.toISOString()}`;
      const result = await this._hass.callApi("GET", url);
      const history = result?.[0] || [];

      const values = history
        .map(x => Number(x.state))
        .filter(x => !isNaN(x));

      // Si l'historique est vide, on utilise au moins l'état actuel pour afficher un point/ligne stable
      if (values.length === 0 && this._lastState !== undefined) {
        values.push(Number(this._lastState));
      }

      this.draw(values);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'historique Sparkline :", err);
    }
  }

  draw(values) {
    const svg = this.shadowRoot.getElementById("chart");
    if (!svg || !values.length) return;

    const width = 100;
    const height = 40;
    const padding = 3; // Évite que le trait de épaisseur 2.5 déborde et soit coupé en haut/bas

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(max - min, 1);

    // Si une seule valeur, on trace une ligne droite horizontale au milieu
    const pointsArray = values.map((v, i) => {
      const x = values.length > 1 ? (i / (values.length - 1)) * width : width;
      const y = padding + (height - padding * 2) * (1 - (v - min) / range);
      return { x, y };
    });

    const pointsStr = pointsArray.map(p => `${p.x},${p.y}`).join(" ");
    const lastPoint = pointsArray[pointsArray.length - 1];

    // Construction dynamique du contenu du SVG
    let svgContent = "";

    // 1. Ajout du remplissage dégradé sous la courbe si l'option est active
    if (this.config.fill && values.length > 1) {
      const gradientId = `gradient-${this.config.entity.replace('.', '-')}`;
      const fillPoints = `0,${height} ${pointsStr} ${width},${height}`;
      svgContent += `<polygon points="${fillPoints}" fill="url(#${gradientId})" />`;
    }

    // 2. Ligne principale de la Sparkline
    svgContent += `
      <polyline
        points="${pointsStr}"
        fill="none"
        stroke="${this.config.color}"
        stroke-width="2.5"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
    `;

    // 3. Point lumineux final (Glow)
    svgContent += `
      <circle
        cx="${lastPoint.x}"
        cy="${lastPoint.y}"
        r="3"
        fill="${this.config.color}"
        style="filter: drop-shadow(0px 0px 3px ${this.config.color});"
      />
    `;

    // Conserver les <defs> du dégradé tout en injectant les nouveaux éléments graphiques
    const defs = svg.querySelector("defs");
    svg.innerHTML = "";
    if (defs) svg.appendChild(defs);
    svg.insertAdjacentHTML("beforeend", svgContent);
  }

  getCardSize() {
    return 1;
  }
}

customElements.define("sparkline-card", SparklineCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "sparkline-card",
  name: "Sparkline Card",
  preview: true,
  description: "Un mini-graphique fluide avec effet de remplissage pour suivre l'historique d'une entité."
});
