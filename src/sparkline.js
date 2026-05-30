renderSparkline(values = [], color = "#2ea8ff") {

  if (!values.length) {
    values = [12,18,15,22,28,25,32,30,38,35,42,40];
  }

  const width = 100;
  const height = 30;

  const min = Math.min(...values);
  const max = Math.max(...values);

  const range = Math.max(max - min, 1);

  const points = values
    .map((v, i) => {

      const x =
        (i / (values.length - 1)) * width;

      const y =
        height -
        ((v - min) / range) * height;

      return `${x},${y}`;
    })
    .join(" ");

  return html`
    <svg
      class="sparkline"
      viewBox="0 0 ${width} ${height}"
      preserveAspectRatio="none"
    >

      <defs>

        <linearGradient
          id="sparkFill"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="${color}"
            stop-opacity="0.4"
          />
          <stop
            offset="100%"
            stop-color="${color}"
            stop-opacity="0"
          />
        </linearGradient>

      </defs>

      <polyline
        fill="none"
        stroke="${color}"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        points="${points}"
      />

    </svg>
  `;
}
