import { html } from "https://unpkg.com/lit@3/index.js?module";

export const TankMixin = (SuperClass) =>
  class extends SuperClass {

    constructor() {

      super();

      this.bubbles =
        this.generateBubbles();
    }

    generateBubbles() {

      return Array.from(
        { length: 40 },
        () => ({

          left:
            Math.random() * 100,

          size:
            4 +
            Math.random() * 12,

          delay:
            Math.random() * 10,

          duration:
            5 +
            Math.random() * 10

        })
      );
    }

    renderTank() {

      const level =
        Math.max(
          0,
          Math.min(
            100,
            Number(this._level || 0)
          )
        );

      const volume =
        Number(this._volume || 0);

      return html`

        <div class="tank-section">

          ${this.renderScale(level)}

          <div class="tank-container">

            <div class="tank">

              <div
                class="water"
                style="
                  height:${level}%;
                "
              >

                <div
                  class="water-glow"
                ></div>

                <div
                  class="water-reflection"
                ></div>

                ${this.renderWaves()}

                ${this.renderBubbles()}

              </div>

              <div
                class="tank-overlay"
              >

                <div
                  class="tank-percent"
                >
                  ${level}%
                </div>

                <div
                  class="tank-volume"
                >
                  ${volume} L
                </div>

              </div>

            </div>

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

          <div
            class="tank-indicator"
            style="
              bottom:${level}%;
            "
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

          <path
            d="
            M0,40
            C150,120
            350,0
            600,40
            C850,80
            1050,0
            1200,40
            L1200,120
            L0,120
            Z
          "
          ></path>

        </svg>

        <svg
          class="wave wave2"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >

          <path
            d="
            M0,50
            C200,0
            400,120
            600,50
            C800,0
            1000,120
            1200,50
            L1200,120
            L0,120
            Z
          "
          ></path>

        </svg>

      `;
    }

    renderBubbles() {

      return html`

        ${this.bubbles.map(
          bubble => html`

            <span
              class="bubble"
              style="

                left:
                ${bubble.left}%;

                width:
                ${bubble.size}px;

                height:
                ${bubble.size}px;

                animation-delay:
                ${bubble.delay}s;

                animation-duration:
                ${bubble.duration}s;

              "
            ></span>

          `
        )}

      `;
    }

    updateTankLevel() {

      const water =
        this.renderRoot?.querySelector(
          ".water"
        );

      if (!water)
        return;

      const level =
        Math.max(
          0,
          Math.min(
            100,
            Number(this._level || 0)
          )
        );

      water.style.height =
        `${level}%`;
    }

    getTankStateColor() {

      const level =
        Number(this._level || 0);

      if (level <= 20)
        return "#ff5252";

      if (level <= 50)
        return "#ffb300";

      return "#2ea8ff";
    }

    getTankStatusText() {

      const level =
        Number(this._level || 0);

      if (level <= 10)
        return "Critique";

      if (level <= 25)
        return "Faible";

      if (level <= 75)
        return "Normal";

      return "Plein";
    }

    renderTankFooter() {

      return html`

        <div
          class="tank-footer"
        >

          <div
            class="tank-status"
            style="
              color:
              ${this.getTankStateColor()}
            "
          >

            ${this.getTankStatusText()}

          </div>

          <div
            class="tank-capacity"
          >

            Capacité :

            ${this.config.capacity || 3000}
            L

          </div>

        </div>

      `;
    }

  };
