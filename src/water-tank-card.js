renderSparkline(color = "#2ea8ff") {

  const points = [];

  let x = 0;

  for (let i = 0; i < 12; i++) {

    const y =
      10 +
      Math.random() * 15;

    points.push(`${x},${y}`);

    x += 9;
  }

  return html`

    <svg
      class="sparkline"
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
    >

      <polyline
        points="${points.join(" ")}"
        stroke="${color}"
        fill="none"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></polyline>

    </svg>

  `;
}
