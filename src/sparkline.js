class SparklineCard extends HTMLElement {

  setConfig(config) {

    if (!config.entity)
      throw new Error("Entity required");

    this.config = {
      color: "#2ea8ff",
      hours: 24,
      fill: true,
      ...config
    };
  }

  set hass(hass) {

    this._hass = hass;

    if (!this.shadowRoot) {

      this.attachShadow({ mode: "open" });

      this.shadowRoot.innerHTML = `
        <style>

          ha-card{
            padding:12px;
            background:var(--ha-card-background);
            border-radius:16px;
          }

          svg{
            width:100%;
            height:60px;
          }

        </style>

        <ha-card>
          <svg id="chart"
               viewBox="0 0 100 40"
               preserveAspectRatio="none">
          </svg>
        </ha-card>
      `;

      this.loadHistory();
    }
  }

  async loadHistory() {

    try {

      const end = new Date();

      const start =
        new Date(
          end.getTime() -
          this.config.hours * 3600000
        );

      const url =
        `history/period/${start.toISOString()}`
        + `?filter_entity_id=${this.config.entity}`
        + `&end_time=${end.toISOString()}`;

      const result =
        await this._hass.callApi(
          "GET",
          url
        );

      const history =
        result?.[0] || [];

      const values =
        history
          .map(x => Number(x.state))
          .filter(x => !isNaN(x));

      this.draw(values);

    } catch(err) {

      console.error(err);

    }
  }

  draw(values) {

    const svg =
      this.shadowRoot.getElementById("chart");

    if (!values.length) return;

    const width = 100;
    const height = 40;

    const min =
      Math.min(...values);

    const max =
      Math.max(...values);

    const range =
      Math.max(max - min, 1);

    const points =
      values.map((v,i)=>{

        const x =
          (i/(values.length-1))*width;

        const y =
          height -
          ((v-min)/range)*height;

        return `${x},${y}`;

      }).join(" ");

    const last =
      points.split(" ").pop().split(",");

    svg.innerHTML = `

      <polyline
        points="${points}"
        fill="none"
        stroke="${this.config.color}"
        stroke-width="2.5"
        stroke-linejoin="round"
        stroke-linecap="round"
      />

      <circle
        cx="${last[0]}"
        cy="${last[1]}"
        r="3"
        fill="${this.config.color}"
      />
    `;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define(
  "sparkline-card",
  SparklineCard
);

window.customCards = window.customCards || [];

window.customCards.push({
  type: "sparkline-card",
  name: "Sparkline Card",
  description:
    "Simple Sparkline Graph Card"
});
