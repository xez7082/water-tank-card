import { css } from "https://unpkg.com/lit@3/index.js?module";

export const cardStyles = css`
  :host {
    /* Variables de Palette Globale */
    --bg-main: #030b18;
    --bg-secondary: #071425;
    --glass: rgba(12, 22, 42, 0.55);
    --glass-border: rgba(255, 255, 255, 0.08);
    --blue: #2ea8ff;
    --blue2: #00c8ff;
    --green: #5dff7f;
    --orange: #ff9f43;
    --purple: #8b5cf6;
    
    display: block;
    width: 100%; /* Force l'hôte à occuper 100% */
  }

  /* ==========================================================================
     CONTENEUR CARTE PRINCIPALE (ha-card)
     ========================================================================== */
  ha-card {
    overflow: hidden;
    border-radius: var(--ha-card-border-radius, 32px);
    background: linear-gradient(
      145deg,
      rgba(8, 15, 28, 0.96),
      rgba(4, 10, 20, 0.98)
    );
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 
      0 15px 40px rgba(0, 0, 0, 0.55),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 24px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    width: 100%;
    box-sizing: border-box;
  }

  .tank-alert-active {
    border: 1px solid rgba(255, 82, 82, 0.4) !important;
    box-shadow: 0 0 20px rgba(255, 82, 82, 0.25), 0 15px 40px rgba(0, 0, 0, 0.55) !important;
  }

  /* Structure de Grille Principale rééquilibrée à 50% / 50% pour remplir l'espace */
  .water-tank-dashboard {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    min-height: 500px;
    align-items: center;
    width: 100%;
  }

  /* ==========================================================================
     SECTION RÉSERVOIR (Lefthand Side)
     ========================================================================== */
  .tank-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;
    gap: 16px;
  }

  /* Suppression de la largeur fixe (300px) -> Prend toute la place allouée */
  .tank-container {
    position: relative;
    width: 100%;
    max-width: 360px; /* Légère retenue pour garder une forme de cuve harmonieuse */
    height: 440px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ==========================================================================
     ÉCHELLE DE GRADUATION
     ========================================================================== */
  .tank-scale {
    position: absolute;
    left: -45px;
    top: 10px;
    bottom: 10px;
    width: 35px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    color: rgba(255, 255, 255, 0.4);
    font-size: 13px;
    font-weight: 500;
  }

  .tank-scale::before {
    content: "";
    position: absolute;
    right: -12px;
    top: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.05)
    );
  }

  .tank-indicator {
    position: absolute;
    right: -19px;
    width: 16px;
    height: 6px;
    border-radius: 50px;
    background: var(--blue2);
    transform: translateY(50%);
    box-shadow: 
      0 0 10px var(--blue2),
      0 0 20px var(--blue2);
    transition: bottom 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
    z-index: 5;
  }

  /* ==========================================================================
     STRUCTURE 3D DE LA CUVE
     ========================================================================== */
  .tank {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50px 50px 30px 30px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.02);
    border: 5px solid rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
    box-shadow: 
      inset 0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 -40px 80px rgba(255, 255, 255, 0.02),
      0 15px 45px rgba(0, 0, 0, 0.5);
  }

  .tank::before {
    content: "";
    position: absolute;
    left: 12px;
    top: 15px;
    bottom: 15px;
    width: 20px;
    border-radius: 30px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.18),
      rgba(255, 255, 255, 0)
    );
    z-index: 10;
    pointer-events: none;
  }

  .tank::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.08),
      transparent
    );
    z-index: 10;
    pointer-events: none;
  }

  /* ==========================================================================
     FLUIDE INTERNE (L'Eau)
     ========================================================================== */
  .water {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    background: linear-gradient(to top, #0c7bff, #20b4ff);
    box-shadow: 
      inset 0 0 40px rgba(255, 255, 255, 0.2),
      0 0 25px rgba(0, 200, 255, 0.25);
    transition: height 1.5s cubic-bezier(0.22, 0.61, 0.36, 1);
  }

  .water-glow {
    position: absolute;
    top: -15px;
    left: 0;
    right: 0;
    height: 30px;
    background: rgba(0, 200, 255, 0.6);
    filter: blur(15px);
    z-index: 2;
  }

  .water-reflection {
    position: absolute;
    top: 0;
    right: 12px;
    bottom: 0;
    width: 15px;
    background: linear-gradient(to left, rgba(255, 255, 255, 0.1), transparent);
    z-index: 3;
    pointer-events: none;
  }

  /* ==========================================================================
     VAGUES ANIMÉES
     ========================================================================== */
  .wave {
    position: absolute;
    width: 200%;
    height: 70px;
    left: 0;
    top: -35px;
    fill: #20b4ff;
    z-index: 1;
  }

  .wave1 {
    opacity: 0.85;
    animation: waveMove1 12s linear infinite;
  }

  .wave2 {
    opacity: 0.4;
    top: -28px;
    fill: #5ad7ff;
    animation: waveMove2 18s linear infinite;
  }

  @keyframes waveMove1 {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  @keyframes waveMove2 {
    from { transform: translateX(-50%); }
    to { transform: translateX(0); }
  }

  /* ==========================================================================
     BULLES DE FOND
     ========================================================================== */
  .bubble {
    position: absolute;
    bottom: -20px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
    animation: bubbleRise linear infinite;
    pointer-events: none;
  }

  @keyframes bubbleRise {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0;
    }
    15% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% {
      transform: translateY(-500px) scale(0.4);
      opacity: 0;
    }
  }

  /* ==========================================================================
     TEXTE SUPERPOSÉ
     ========================================================================== */
  .tank-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 20;
    pointer-events: none;
  }

  .tank-percent {
    font-size: 56px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -1px;
    text-shadow: 
      0 4px 15px rgba(0, 0, 0, 0.6),
      0 0 30px rgba(0, 200, 255, 0.35);
  }

  .tank-volume {
    font-size: 18px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    margin-top: 4px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  }

  .tank-footer {
    width: 100%;
    max-width: 360px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    padding: 0 4px;
  }

  .tank-status {
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .tank-capacity {
    color: rgba(255, 255, 255, 0.45);
  }

  /* ==========================================================================
     PANNEAU DE STATISTIQUES (Prend 100% de sa colonne disponible)
     ========================================================================== */
  .stats-panel {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
  }

  .stats-header {
    margin-bottom: 4px;
  }

  .stats-title {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .stats-title ha-icon {
    color: var(--blue);
    --mdc-icon-size: 30px;
    filter: drop-shadow(0 0 8px var(--blue));
  }

  .stats-title h2 {
    margin: 0;
    color: #ffffff;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.5px;
  }

  .stats-title span {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.45);
  }

  .stat-card {
    position: relative;
    display: flex;
    align-items: center;
    padding: 14px 16px;
    border-radius: 20px;
    background: rgba(10, 20, 40, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    overflow: hidden;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    width: 100%;
    box-sizing: border-box;
  }

  .stat-card:hover {
    transform: translateX(4px);
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 8px 25px rgba(0, 200, 255, 0.15);
    box-shadow: 0 8px 25px color-mix(in srgb, var(--card-color) 25%, transparent);
  }

  .stat-icon {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    background: color-mix(in srgb, var(--card-color) 15%, transparent);
    color: var(--card-color);
    border: 1px solid color-mix(in srgb, var(--card-color) 20%, transparent);
    box-shadow: 0 0 15px color-mix(in srgb, var(--card-color) 20%, transparent);
    margin-right: 12px;
    flex-shrink: 0;
  }

  .stat-icon ha-icon {
    --mdc-icon-size: 24px;
  }

  .stat-content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    z-index: 2;
  }

  .stat-label {
    color: rgba(255, 255, 255, 0.5);
    font-size: 13px;
    font-weight: 500;
    grid-column: 1;
  }

  .stat-value {
    color: #ffffff;
    font-size: 22px;
    font-weight: 700;
    grid-column: 1;
    margin-top: 1px;
  }

  .stat-sub {
    color: rgba(255, 255, 255, 0.4);
    font-size: 12px;
    grid-column: 2;
    text-align: right;
    align-self: end;
    font-weight: 500;
    margin-bottom: 2px;
  }

  /* ==========================================================================
     SECTION INTERNE DU BANDEAU BAS TECHNIQUE
     ========================================================================== */
  .tank-technical-footer {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    border-bottom-left-radius: var(--ha-card-border-radius, 32px);
    border-bottom-right-radius: var(--ha-card-border-radius, 32px);
    margin: 24px -24px -24px -24px;
    width: calc(100% + 48px);
    box-sizing: border-box;
  }

  /* ==========================================================================
     RESPONSIVE (Bascule sur une seule colonne sur smartphone)
     ========================================================================= */
  @media (max-width: 768px) {
    ha-card {
      padding: 16px;
    }

    .tank-technical-footer {
      margin: 16px -16px -16px -16px;
      width: calc(100% + 32px);
    }
    
    .water-tank-dashboard {
      grid-template-columns: 1fr;
      gap: 32px;
      min-height: auto;
    }

    .tank-container {
      max-width: 280px;
      height: 400px;
    }

    .tank-scale {
      left: -40px;
      font-size: 12px;
    }

    .tank-percent {
      font-size: 46px;
    }

    .stat-card:hover {
      transform: none;
    }
  }
`;
