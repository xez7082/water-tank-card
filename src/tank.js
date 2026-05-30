import { html } from "https://unpkg.com/lit@3/index.js?module";

export const TankMixin = (SuperClass) =>
  class extends SuperClass {
    constructor() {
      super();
      // Génération unique des données de bulles à l'instanciation pour préserver le CPU
      this.bubbles = this.generateBubbles();
    }

    generateBubbles() {
      // 20 bulles suffisent amplement pour un effet visuel dense et fluide sans surcharger le DOM
      return Array.from({ length: 20 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        size: 3 + Math.random() * 8, // Tailles ajustées entre 3px et 11px
        delay: Math.random() * -10,  // Délai négatif pour que les bulles soient déjà en mouvement au chargement
        duration: 4 + Math.random() * 6 // Vitesse de montée entre 4s et 10s
      }));
    }

    renderTank() {
      // Validation stricte du niveau entre 0% et 100%
      const level = Math.max(0, Math.min(100, Number(this._level ?? 0)));
      
      // Formatage du volume pour éviter les décimales infinies ou les NaN
      const rawVolume = Number(this._volume ?? 0);
      const volume = isNaN(rawVolume) ? 0 : Math.round(rawVolume);

      return html`
        <div class="tank-section">
          
          <div class="tank-container">
            ${this.renderScale(level)}

            <div class="tank">
              <div class="water" style="height: ${level}%;">
                <div class="water-glow"></div>
                <div class="water-reflection"></div>
                
                ${this.renderWaves()}

                ${this.renderBubbles()}
              </div>

              <div class="tank-overlay">
                <div class="tank-percent">${Math.round(level)}%</div>
                <div class="tank-volume">
                  ${volume.toLocaleString()} L
                </div>
              </div>
            </div>
          </div>

          ${this.renderTankFooter()}

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

          <div 
            class="tank-indicator" 
            style="bottom: calc(${level}% - 3px);"
          ></div>
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
        ${this.bubbles.map(
          (bubble) => html`
            <span
              class="bubble"
              style="
                left: ${bubble.left}%;
                width: ${bubble.size}px;
                height: ${bubble.size}px;
                animation-delay: ${bubble.delay}s;
                animation-duration: ${bubble.duration}s;
              "
            ></span>
          `
        )}
      `;
    }

    getTankStateColor() {
      const level = Number(this._level ?? 0);
      if (level <= 15) return "#ff5252"; // Rouge critique
      if (level <= 35) return "#ff9f43"; // Orange d'avertissement
      return "#2ea8ff"; // Bleu nominal
    }

    getTankStatusText() {
      const level = Number(this._level ?? 0);
      if (level <= 10) return "Critique";
      if (level <= 25) return "Faible";
      if (level <= 85) return "Normal";
      return "Plein";
    }

    renderTankFooter() {
      const capacity = this.config?.capacity || 3000;
      
      return html`
        <div class="tank-footer">
          <div 
            class="tank-status" 
            style="color: ${this.getTankStateColor()}"
          >
            ${this.getTankStatusText()}
          </div>
          <div class="tank-capacity">
            Capacité : ${capacity.toLocaleString()} L
          </div>
        </div>
      `;
    }
  };
