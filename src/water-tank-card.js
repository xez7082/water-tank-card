renderSparkline(color = "#2ea8ff") {
  const pointsArray = [];
  const totalPoints = 12;
  const width = 100;
  const height = 30;
  const padding = 2; // Empêche l'épaisseur de la ligne ou le point de déborder en haut/bas

  // 1. Calcul des points répartis de manière homogène sur la largeur totale (100)
  for (let i = 0; i < totalPoints; i++) {
    // Calcule 'x' pour que le 1er point soit à 0 et le 12e point soit pile à 100
    const x = (i / (totalPoints - 1)) * width;
    
    // Génère une valeur 'y' aléatoire mais contrainte dans la hauteur du viewBox
    const y = padding + (Math.random() * (height - padding * 2 - 10) + 10);
    
    pointsArray.push({ x, y });
  }

  // Transformation des coordonnées en chaînes de caractères pour les attributs SVG
  const pointsStr = pointsArray.map(p => `${p.x},${p.y}`).join(" ");
  
  // Création de la zone fermée (le polygone) qui descend jusqu'au bas du graphique (y = 30)
  const areaStr = `${pointsStr} ${width},${height} 0,${height}`;
  
  // Récupération du tout dernier point pour y fixer le cercle lumineux animable
  const lastPoint = pointsArray[pointsArray.length - 1];

  // Nettoyage du code couleur (retrait du '#') pour garantir un ID de dégradé SVG valide
  const cleanColorId = color.replace('#', '');

  return html`
    <svg
      class="sparkline"
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id="spark-grad-${cleanColorId}"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stop-color="${color}" stop-opacity="0.25" />
          <stop offset="100%" stop-color="${color}" stop-opacity="0.0" />
        </linearGradient>
      </defs>

      <polygon
        points="${areaStr}"
        fill="url(#spark-grad-${cleanColorId})"
      ></polygon>

      <polyline
        points="${pointsStr}"
        stroke="${color}"
        fill="none"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></polyline>

      <circle
        cx="${lastPoint.x}"
        cy="${lastPoint.y}"
        r="2.5"
        fill="${color}"
      >
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
