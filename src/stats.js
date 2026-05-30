import { html } from "https://unpkg.com/lit@3/index.js?module";

export const StatsMixin = (SuperClass) =>
  class extends SuperClass {

    renderStats() {

      const level = Number(this._level || 0);
      const volume = Number(this._volume || 0);

      return html`

        <div class="stats-panel">

          <div class="stats-header">

            <div class="stats-title">

              <ha-icon
                icon="mdi:water"
              ></ha-icon>

              <div>

                <h2>
                  ${this.config.title || "Water Tank"}
                </h2>

                <span>
                  ${this.config.subtitle || "Monitoring"}
                </span>

              </div>

            </div>

          </div>

          ${this.renderStatCard({
            icon: "mdi:gauge",
            color: "#2ea8ff",
            title: "Niveau actuel",
            value: `${level}%`,
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
            sub: "Jours",
            history: this.remainingHistory || []
          })}

          <div class="stats-footer">

            <ha-icon
              icon="mdi:information-outline"
            ></ha-icon>

            Dernière mise à jour :

            ${new Date()
              .toLocaleTimeString()}

          </div>

        </div>

      `;
    }

    renderStatCard(config) {

      return html`

        <div
          class="stat-card"
          style="--card-color:${config.color}"
        >

          <div class="stat-icon">

            <ha-icon
              .icon=${config.icon}
            ></ha-icon>

          </div>

          <div class="stat-content">

            <div class="stat-label">
              ${config.title}
            </div>

            <div class="stat-value">
              ${config.value}
            </div>

            <div class="stat-sub">
              ${config.sub}
            </div>

            ${this.renderSparkline(
              config.history,
              config.color
            )}

          </div>

        </div>

      `;
    }

    renderSparkline(
      values = [],
      color = "#2ea8ff"
    ) {

      if (!values.length) {

        values = [
          12,18,15,22,28,25,
          32,30,38,35,42,40
        ];
      }

      const width = 100;
      const height = 30;

      const min =
        Math.min(...values);

      const max =
        Math.max(...values);

      const range =
        Math.max(max - min, 1);

      const points =
        values
          .map((value, index) => {

            const x =
              (index /
              (values.length - 1))
              * width;

            const y =
              height -
              ((value - min) / range)
              * height;

            return `${x},${y}`;

          })
          .join(" ");

      const area =
        `${points}
         ${width},${height}
         0,${height}`;

      const lastPoint =
        points
          .split(" ")
          .pop()
          .split(",");

      return html`

        <svg
          class="sparkline"
          viewBox="0 0 100 30"
          preserveAspectRatio="none"
        >

          <defs>

            <linearGradient
              id="spark-${color.replace('#','')}"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stop-color="${color}"
                stop-opacity=".35"
              />

              <stop
                offset="100%"
                stop-color="${color}"
                stop-opacity="0"
              />

            </linearGradient>

          </defs>

          <polygon
            points="${area}"
            fill="url(#spark-${color.replace('#','')})"
          ></polygon>

          <polyline
            points="${points}"
            fill="none"
            stroke="${color}"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></polyline>

          <circle
            cx="${lastPoint[0]}"
            cy="${lastPoint[1]}"
            r="2.5"
            fill="${color}"
          >

            <animate
              attributeName="r"
              values="2.5;4;2.5"
              dur="2s"
              repeatCount="indefinite"
            />

          </circle>

        </svg>

      `;
    }

    async loadStatisticsHistory() {

      if (!this._hass)
        return;

      this.levelHistory =
        await this.fetchHistory(
          this.config.tank_level_entity
        );

      this.inflowHistory =
        await this.fetchHistory(
          this.config.inflow_entity
        );

      this.usageHistory =
        await this.fetchHistory(
          this.config.usage_entity
        );

      this.remainingHistory =
        await this.fetchHistory(
          this.config.remaining_days_entity
        );

      this.requestUpdate();
    }

    async fetchHistory(entityId) {

      if (!entityId)
        return [];

      try {

        const end =
          new Date();

        const start =
          new Date(
            end.getTime() -
            24 * 3600000
          );

        const url =
          `history/period/${start.toISOString()}`
          + `?filter_entity_id=${entityId}`
          + `&end_time=${end.toISOString()}`;

        const result =
          await this._hass.callApi(
            "GET",
            url
          );

        return (
          result?.[0] || []
        )
        .map(
          x => Number(x.state)
        )
        .filter(
          x => !isNaN(x)
        );

      } catch (err) {

        console.error(
          "History error",
          err
        );

        return [];
      }
    }
  };
