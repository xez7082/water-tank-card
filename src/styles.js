:host {
  --bg-main: #030b18;
  --bg-secondary: #071425;

  --glass:
    rgba(12, 22, 42, 0.55);

  --glass-border:
    rgba(255,255,255,.08);

  --blue:
    #2ea8ff;

  --blue2:
    #00c8ff;

  --green:
    #5dff7f;

  --orange:
    #ff9f43;

  --purple:
    #8b5cf6;

  display:block;
}

/* ==========================
   CARD
========================== */

ha-card.card {

  overflow:hidden;

  border-radius:32px;

  background:
    linear-gradient(
      145deg,
      rgba(8,15,28,.96),
      rgba(4,10,20,.98)
    );

  border:
    1px solid rgba(255,255,255,.06);

  box-shadow:
    0 15px 40px rgba(0,0,0,.55),
    inset 0 1px 0 rgba(255,255,255,.04);

  backdrop-filter:
    blur(20px);

  padding:24px;
}

/* ==========================
   LAYOUT
========================== */

.container {

  display:grid;

  grid-template-columns:
    1.15fr
    .85fr;

  gap:24px;

  min-height:650px;
}

/* ==========================
   TANK AREA
========================== */

.tank-section {

  display:flex;

  justify-content:center;

  align-items:center;

  position:relative;
}

.tank-wrapper {

  width:100%;

  height:100%;

  display:flex;

  align-items:center;

  justify-content:center;

  gap:30px;
}

/* ==========================
   SCALE
========================== */

.scale {

  height:520px;

  display:flex;

  flex-direction:column;

  justify-content:space-between;

  color:
    rgba(255,255,255,.5);

  font-size:14px;

  position:relative;
}

.scale::before {

  content:"";

  position:absolute;

  right:-20px;

  top:0;

  width:2px;

  height:100%;

  background:
    linear-gradient(
      to bottom,
      rgba(255,255,255,.2),
      rgba(255,255,255,.05)
    );
}

.indicator {

  position:absolute;

  right:-28px;

  width:18px;

  height:6px;

  border-radius:50px;

  background:
    var(--blue2);

  transform:
    translateY(50%);

  box-shadow:
    0 0 12px var(--blue2),
    0 0 25px var(--blue2),
    0 0 40px var(--blue2);
}

/* ==========================
   TANK
========================== */

.tank {

  position:relative;

  width:300px;

  height:520px;

  border-radius:
    70px
    70px
    40px
    40px;

  overflow:hidden;

  background:
    rgba(255,255,255,.04);

  border:
    5px solid
    rgba(255,255,255,.14);

  backdrop-filter:
    blur(20px);

  box-shadow:

    inset 0 0 0 1px rgba(255,255,255,.08),

    inset 0 -40px 80px rgba(255,255,255,.03),

    0 0 0 1px rgba(255,255,255,.04),

    0 20px 50px rgba(0,0,0,.45);
}

/* METAL REFLECTION */

.tank::before {

  content:"";

  position:absolute;

  left:14px;

  top:14px;

  bottom:14px;

  width:28px;

  border-radius:30px;

  background:
    linear-gradient(
      to right,
      rgba(255,255,255,.22),
      rgba(255,255,255,0)
    );

  z-index:10;
}

.tank::after {

  content:"";

  position:absolute;

  top:0;

  left:0;

  right:0;

  height:90px;

  background:
    linear-gradient(
      to bottom,
      rgba(255,255,255,.10),
      transparent
    );

  z-index:10;
}

/* ==========================
   WATER
========================== */

.water {

  position:absolute;

  left:0;

  right:0;

  bottom:0;

  overflow:hidden;

  transition:
    height
    1.5s
    cubic-bezier(.22,.61,.36,1);

  background:
    linear-gradient(
      to top,
      #0c7bff,
      #20b4ff
    );

  box-shadow:

    inset
    0 0 60px
    rgba(255,255,255,.20),

    0 0 30px
    rgba(0,200,255,.35);
}

/* GLOW */

.water::before {

  content:"";

  position:absolute;

  top:-25px;

  left:0;

  right:0;

  height:50px;

  background:
    rgba(0,200,255,.5);

  filter:
    blur(25px);
}

/* ==========================
   WAVES
========================== */

.wave {

  position:absolute;

  width:220%;

  height:90px;

  left:0;

  top:-40px;

  fill:#5ad7ff;
}

.wave1 {

  opacity:.75;

  animation:
    waveMove1
    10s
    linear
    infinite;
}

.wave2 {

  opacity:.35;

  top:-32px;

  animation:
    waveMove2
    15s
    linear
    infinite;
}

@keyframes waveMove1 {

  from {
    transform:
      translateX(0);
  }

  to {
    transform:
      translateX(-50%);
  }
}

@keyframes waveMove2 {

  from {
    transform:
      translateX(-50%);
  }

  to {
    transform:
      translateX(0);
  }
}

/* ==========================
   BUBBLES
========================== */

.bubble {

  position:absolute;

  bottom:-30px;

  border-radius:50%;

  background:
    rgba(255,255,255,.55);

  box-shadow:
    0 0 10px rgba(255,255,255,.6);

  animation:
    bubbleRise linear infinite;
}

@keyframes bubbleRise {

  0% {

    transform:
      translateY(0);

    opacity:0;
  }

  20% {
    opacity:.7;
  }

  100% {

    transform:
      translateY(-650px);

    opacity:0;
  }
}

/* ==========================
   TANK TEXT
========================== */

.tank-overlay {

  position:absolute;

  inset:0;

  display:flex;

  flex-direction:column;

  align-items:center;

  justify-content:center;

  z-index:20;
}

.percent {

  font-size:64px;

  font-weight:700;

  color:white;

  text-shadow:

    0 0 20px rgba(255,255,255,.45),

    0 0 50px rgba(0,200,255,.45);
}

.volume {

  font-size:20px;

  color:
    rgba(255,255,255,.85);

  margin-top:8px;
}

/* ==========================
   STATS
========================== */

.stats {

  display:flex;

  flex-direction:column;

  gap:16px;
}

.header {

  margin-bottom:10px;
}

.title {

  display:flex;

  align-items:center;

  gap:14px;
}

.title ha-icon {

  color:var(--blue);

  --mdc-icon-size:34px;

  filter:
    drop-shadow(
      0 0 10px
      var(--blue)
    );
}

.title h2 {

  margin:0;

  color:white;

  font-size:26px;
}

.title span {

  color:
    rgba(255,255,255,.55);
}

/* ==========================
   STAT CARD
========================== */

.stat-card {

  display:flex;

  align-items:center;

  gap:16px;

  padding:18px;

  border-radius:22px;

  background:
    rgba(10,20,40,.45);

  border:
    1px solid rgba(255,255,255,.06);

  backdrop-filter:
    blur(18px);

  transition:
    transform .3s,
    box-shadow .3s;
}

.stat-card:hover {

  transform:
    translateX(5px);

  box-shadow:
    0 0 30px
    color-mix(
      in srgb,
      var(--color) 45%,
      transparent
    );
}

.icon {

  width:56px;

  height:56px;

  border-radius:50%;

  display:flex;

  align-items:center;

  justify-content:center;

  background:
    color-mix(
      in srgb,
      var(--color) 20%,
      transparent
    );

  color:
    var(--color);

  box-shadow:
    0 0 20px
    color-mix(
      in srgb,
      var(--color) 35%,
      transparent
    );
}

.icon ha-icon {

  --mdc-icon-size:28px;
}

.label {

  color:
    rgba(255,255,255,.6);

  font-size:13px;
}

.value {

  color:white;

  font-size:28px;

  font-weight:700;
}

.sub {

  color:
    rgba(255,255,255,.45);

  font-size:13px;
}

/* ==========================
   RESPONSIVE
========================== */

@media (max-width:900px) {

  .container {

    grid-template-columns:
      1fr;
  }

  .tank {

    width:240px;
    height:420px;
  }

  .percent {

    font-size:48px;
  }
}
