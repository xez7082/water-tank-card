renderSparkline(color = "#2ea8ff") {
  const pointsArray = [];
  const totalPoints = 12;
  const width = 100;
  const height = 30;
  const padding = 2; // Évite que l'épaisseur du trait ne déborde en haut ou en bas du SVG

  // Génération des points échantillonnés proportionnellement sur la largeur totale (100)
  for (let i = 0; i < totalPoints; i++) {
    // Calcul de x pour que le premier point soit à 0 et le tout dernier pile à 100
    const x = (i / (totalPoints - 1)) * width;
    
    // Génération d'une valeur y aléatoire cohérente avec la hauteur (ici entre 10 et 25)
    const y = padding + (Math.random() * (height - padding * 2 - 10) + 10);
    
    pointsArray.push({ x, y });
  }

  // Transformation du tableau en chaîne de coordonnées pour la polyline
  const pointsStr = pointsArray.map(p => `${p.x},${p.y}`).join(" ");
  
  // Construction de la zone fermée sous la courbe pour le remplissage
  const areaStr = `${pointsStr} ${width},${height} 0,${height}`;
  
  // Récupération du tout dernier point pour y adosser le cercle lumineux
  const lastPoint = pointsArray[pointsArray.length - 1];

  // Nettoyage du code couleur hexa pour créer un ID unique et valide pour le dégradé SVG
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
