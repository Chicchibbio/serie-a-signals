import React, { useState, useEffect } from "react";

// ─── DATI SQUADRE (estratti dal tuo Excel) ───────────────────────────────────
const TEAMS = {
  Inter: {
    winRate: 80.77, drawRate: 3.85, loseRate: 15.38,
    winRateCasa: 76.92, winRateTrasferta: 84.62,
    golFattiPartita: 2.38, golSubitiPartita: 0.81,
    golFattiCasa: 2.77, golSubitiCasa: 0.92,
    golFattiTrasferta: 2.00, golSubitiTrasferta: 0.69,
    tiriPortaCasa: 7.38, tiriPortaSubitiCasa: 3.54,
    tiriPortaTrasferta: 5.62, tiriPortaSubitiTrasferta: 1.92,
    pericolositaOff: 34.7, soliditaDif: 33.2,
    expectedPoints: 2.46,
    poisson: { over15: 68.8, over25: 42.6, over35: 21.8 },
  },
  Milan: {
    winRate: 57.69, drawRate: 34.62, loseRate: 7.69,
    winRateCasa: 53.85, winRateTrasferta: 61.54,
    golFattiPartita: 1.58, golSubitiPartita: 0.77,
    golFattiCasa: 1.38, golSubitiCasa: 0.85,
    golFattiTrasferta: 1.77, golSubitiTrasferta: 0.69,
    tiriPortaCasa: 5.31, tiriPortaSubitiCasa: 2.77,
    tiriPortaTrasferta: 3.77, tiriPortaSubitiTrasferta: 4.08,
    pericolositaOff: 33.6, soliditaDif: 31.3,
    expectedPoints: 2.08,
    poisson: { over15: 46.8, over25: 21.1, over35: 7.6 },
  },
  Napoli: {
    winRate: 57.69, drawRate: 19.23, loseRate: 23.08,
    winRateCasa: 66.67, winRateTrasferta: 50.00,
    golFattiPartita: 1.50, golSubitiPartita: 1.04,
    golFattiCasa: 1.75, golSubitiCasa: 0.92,
    golFattiTrasferta: 1.29, golSubitiTrasferta: 1.14,
    tiriPortaCasa: 5.25, tiriPortaSubitiCasa: 2.83,
    tiriPortaTrasferta: 4.14, tiriPortaSubitiTrasferta: 3.21,
    pericolositaOff: 35.7, soliditaDif: 27.8,
    expectedPoints: 1.92,
    poisson: { over15: 44.2, over25: 19.1, over35: 6.6 },
  },
  Juventus: {
    winRate: 50.00, drawRate: 26.92, loseRate: 23.08,
    winRateCasa: 53.85, winRateTrasferta: 46.15,
    golFattiPartita: 1.65, golSubitiPartita: 0.96,
    golFattiCasa: 1.92, golSubitiCasa: 0.92,
    golFattiTrasferta: 1.38, golSubitiTrasferta: 1.00,
    tiriPortaCasa: 6.92, tiriPortaSubitiCasa: 2.54,
    tiriPortaTrasferta: 5.15, tiriPortaSubitiTrasferta: 3.23,
    pericolositaOff: 36.7, soliditaDif: 28.0,
    expectedPoints: 1.77,
    poisson: { over15: 49.2, over25: 23.1, over35: 8.6 },
  },
  Atalanta: {
    winRate: 46.15, drawRate: 34.62, loseRate: 19.23,
    winRateCasa: 57.14, winRateTrasferta: 33.33,
    golFattiPartita: 1.38, golSubitiPartita: 0.85,
    golFattiCasa: 1.57, golSubitiCasa: 0.79,
    golFattiTrasferta: 1.17, golSubitiTrasferta: 0.92,
    tiriPortaCasa: 5.57, tiriPortaSubitiCasa: 2.71,
    tiriPortaTrasferta: 3.67, tiriPortaSubitiTrasferta: 5.50,
    pericolositaOff: 32.4, soliditaDif: 33.5,
    expectedPoints: 1.73,
    poisson: { over15: 40.3, over25: 16.3, over35: 5.2 },
  },
  Roma: {
    winRate: 61.54, drawRate: 7.69, loseRate: 30.77,
    winRateCasa: 69.23, winRateTrasferta: 53.85,
    golFattiPartita: 1.31, golSubitiPartita: 0.62,
    golFattiCasa: 1.46, golSubitiCasa: 0.46,
    golFattiTrasferta: 1.15, golSubitiTrasferta: 0.77,
    tiriPortaCasa: 5.08, tiriPortaSubitiCasa: 2.69,
    tiriPortaTrasferta: 4.46, tiriPortaSubitiTrasferta: 4.31,
    pericolositaOff: 34.4, soliditaDif: 37.1,
    expectedPoints: 1.92,
    poisson: { over15: 37.6, over25: 14.5, over35: 4.4 },
  },
  Lazio: {
    winRate: 30.77, drawRate: 38.46, loseRate: 30.77,
    winRateCasa: 38.46, winRateTrasferta: 23.08,
    golFattiPartita: 1.00, golSubitiPartita: 0.96,
    golFattiCasa: 1.38, golSubitiCasa: 1.23,
    golFattiTrasferta: 0.62, golSubitiTrasferta: 0.69,
    tiriPortaCasa: 4.62, tiriPortaSubitiCasa: 4.62,
    tiriPortaTrasferta: 3.15, tiriPortaSubitiTrasferta: 4.00,
    pericolositaOff: 34.6, soliditaDif: 31.1,
    expectedPoints: 1.31,
    poisson: { over15: 26.4, over25: 8.0, over35: 1.9 },
  },
  Fiorentina: {
    winRate: 19.23, drawRate: 34.62, loseRate: 46.15,
    winRateCasa: 23.08, winRateTrasferta: 15.38,
    golFattiPartita: 1.15, golSubitiPartita: 1.50,
    golFattiCasa: 1.38, golSubitiCasa: 1.46,
    golFattiTrasferta: 0.92, golSubitiTrasferta: 1.54,
    tiriPortaCasa: 4.54, tiriPortaSubitiCasa: 4.08,
    tiriPortaTrasferta: 2.92, tiriPortaSubitiTrasferta: 5.08,
    pericolositaOff: 26.9, soliditaDif: 34.8,
    expectedPoints: 0.92,
    poisson: { over15: 32.1, over25: 11.1, over35: 3.0 },
  },
  Bologna: {
    winRate: 38.46, drawRate: 23.08, loseRate: 38.46,
    winRateCasa: 38.46, winRateTrasferta: 38.46,
    golFattiPartita: 1.35, golSubitiPartita: 1.23,
    golFattiCasa: 1.00, golSubitiCasa: 1.08,
    golFattiTrasferta: 1.69, golSubitiTrasferta: 1.38,
    tiriPortaCasa: 4.08, tiriPortaSubitiCasa: 2.92,
    tiriPortaTrasferta: 4.00, tiriPortaSubitiTrasferta: 4.62,
    pericolositaOff: 30.5, soliditaDif: 36.2,
    expectedPoints: 1.38,
    poisson: { over15: 38.9, over25: 15.4, over35: 4.8 },
  },
  Torino: {
    winRate: 26.92, drawRate: 23.08, loseRate: 50.00,
    winRateCasa: 30.77, winRateTrasferta: 23.08,
    golFattiPartita: 0.96, golSubitiPartita: 1.81,
    golFattiCasa: 1.00, golSubitiCasa: 1.69,
    golFattiTrasferta: 0.92, golSubitiTrasferta: 1.92,
    tiriPortaCasa: 4.38, tiriPortaSubitiCasa: 4.38,
    tiriPortaTrasferta: 4.00, tiriPortaSubitiTrasferta: 4.31,
    pericolositaOff: 35.9, soliditaDif: 31.0,
    expectedPoints: 1.04,
    poisson: { over15: 25.0, over25: 7.3, over35: 1.7 },
  },
  Genoa: {
    winRate: 23.08, drawRate: 34.62, loseRate: 42.31,
    winRateCasa: 28.57, winRateTrasferta: 16.67,
    golFattiPartita: 1.23, golSubitiPartita: 1.42,
    golFattiCasa: 1.21, golSubitiCasa: 1.29,
    golFattiTrasferta: 1.25, golSubitiTrasferta: 1.58,
    tiriPortaCasa: 4.07, tiriPortaSubitiCasa: 3.50,
    tiriPortaTrasferta: 4.17, tiriPortaSubitiTrasferta: 5.50,
    pericolositaOff: 34.9, soliditaDif: 32.9,
    expectedPoints: 1.04,
    poisson: { over15: 34.8, over25: 12.7, over35: 3.6 },
  },
  Sassuolo: {
    winRate: 38.46, drawRate: 19.23, loseRate: 42.31,
    winRateCasa: 38.46, winRateTrasferta: 38.46,
    golFattiPartita: 1.23, golSubitiPartita: 1.35,
    golFattiCasa: 1.15, golSubitiCasa: 1.46,
    golFattiTrasferta: 1.31, golSubitiTrasferta: 1.23,
    tiriPortaCasa: 3.54, tiriPortaSubitiCasa: 5.00,
    tiriPortaTrasferta: 4.00, tiriPortaSubitiTrasferta: 5.23,
    pericolositaOff: 34.6, soliditaDif: 36.5,
    expectedPoints: 1.35,
    poisson: { over15: 34.8, over25: 12.7, over35: 3.6 },
  },
  Como: {
    winRate: 46.15, drawRate: 34.62, loseRate: 19.23,
    winRateCasa: 46.15, winRateTrasferta: 46.15,
    golFattiPartita: 1.58, golSubitiPartita: 0.73,
    golFattiCasa: 1.62, golSubitiCasa: 0.69,
    golFattiTrasferta: 1.54, golSubitiTrasferta: 0.77,
    tiriPortaCasa: 6.08, tiriPortaSubitiCasa: 3.15,
    tiriPortaTrasferta: 4.08, tiriPortaSubitiTrasferta: 3.92,
    pericolositaOff: 35.5, soliditaDif: 36.5,
    expectedPoints: 1.73,
    poisson: { over15: 46.8, over25: 21.1, over35: 7.6 },
  },
  Udinese: {
    winRate: 34.62, drawRate: 19.23, loseRate: 46.15,
    winRateCasa: 30.77, winRateTrasferta: 38.46,
    golFattiPartita: 1.08, golSubitiPartita: 1.50,
    golFattiCasa: 1.00, golSubitiCasa: 1.38,
    golFattiTrasferta: 1.15, golSubitiTrasferta: 1.62,
    tiriPortaCasa: 3.69, tiriPortaSubitiCasa: 3.46,
    tiriPortaTrasferta: 3.46, tiriPortaSubitiTrasferta: 4.69,
    pericolositaOff: 30.9, soliditaDif: 32.8,
    expectedPoints: 1.23,
    poisson: { over15: 29.3, over25: 9.5, over35: 2.4 },
  },
  Cagliari: {
    winRate: 26.92, drawRate: 30.77, loseRate: 42.31,
    winRateCasa: 30.77, winRateTrasferta: 23.08,
    golFattiPartita: 1.08, golSubitiPartita: 1.35,
    golFattiCasa: 1.15, golSubitiCasa: 1.15,
    golFattiTrasferta: 1.00, golSubitiTrasferta: 1.54,
    tiriPortaCasa: 3.38, tiriPortaSubitiCasa: 4.15,
    tiriPortaTrasferta: 3.23, tiriPortaSubitiTrasferta: 5.69,
    pericolositaOff: 33.1, soliditaDif: 37.0,
    expectedPoints: 1.12,
    poisson: { over15: 29.3, over25: 9.5, over35: 2.4 },
  },
  Verona: {
    winRate: 7.69, drawRate: 34.62, loseRate: 57.69,
    winRateCasa: 8.33, winRateTrasferta: 7.14,
    golFattiPartita: 0.73, golSubitiPartita: 1.77,
    golFattiCasa: 0.92, golSubitiCasa: 1.58,
    golFattiTrasferta: 0.57, golSubitiTrasferta: 1.93,
    tiriPortaCasa: 4.42, tiriPortaSubitiCasa: 4.33,
    tiriPortaTrasferta: 3.29, tiriPortaSubitiTrasferta: 4.50,
    pericolositaOff: 35.1, soliditaDif: 32.5,
    expectedPoints: 0.58,
    poisson: { over15: 16.7, over25: 3.8, over35: 0.7 },
  },
  Pisa: {
    winRate: 3.85, drawRate: 46.15, loseRate: 50.00,
    winRateCasa: 7.69, winRateTrasferta: 0.00,
    golFattiPartita: 0.77, golSubitiPartita: 1.65,
    golFattiCasa: 0.31, golSubitiCasa: 1.23,
    golFattiTrasferta: 1.23, golSubitiTrasferta: 2.08,
    tiriPortaCasa: 2.77, tiriPortaSubitiCasa: 4.00,
    tiriPortaTrasferta: 2.69, tiriPortaSubitiTrasferta: 5.31,
    pericolositaOff: 26.7, soliditaDif: 30.5,
    expectedPoints: 0.58,
    poisson: { over15: 18.0, over25: 4.3, over35: 0.8 },
  },
  Cremonese: {
    winRate: 19.23, drawRate: 34.62, loseRate: 46.15,
    winRateCasa: 16.67, winRateTrasferta: 21.43,
    golFattiPartita: 0.81, golSubitiPartita: 1.38,
    golFattiCasa: 0.92, golSubitiCasa: 1.25,
    golFattiTrasferta: 0.71, golSubitiTrasferta: 1.50,
    tiriPortaCasa: 3.75, tiriPortaSubitiCasa: 4.58,
    tiriPortaTrasferta: 2.57, tiriPortaSubitiTrasferta: 6.57,
    pericolositaOff: 35.1, soliditaDif: 32.6,
    expectedPoints: 0.92,
    poisson: { over15: 19.4, over25: 4.9, over35: 0.9 },
  },
  Lecce: {
    winRate: 23.08, drawRate: 23.08, loseRate: 53.85,
    winRateCasa: 21.43, winRateTrasferta: 25.00,
    golFattiPartita: 0.65, golSubitiPartita: 1.27,
    golFattiCasa: 0.64, golSubitiCasa: 1.29,
    golFattiTrasferta: 0.67, golSubitiTrasferta: 1.25,
    tiriPortaCasa: 2.86, tiriPortaSubitiCasa: 3.71,
    tiriPortaTrasferta: 1.92, tiriPortaSubitiTrasferta: 4.67,
    pericolositaOff: 24.0, soliditaDif: 31.6,
    expectedPoints: 0.92,
    poisson: { over15: 14.0, over25: 2.9, over35: 0.5 },
  },
  Parma: {
    winRate: 30.77, drawRate: 30.77, loseRate: 38.46,
    winRateCasa: 23.08, winRateTrasferta: 38.46,
    golFattiPartita: 0.73, golSubitiPartita: 1.19,
    golFattiCasa: 0.77, golSubitiCasa: 1.38,
    golFattiTrasferta: 0.69, golSubitiTrasferta: 1.00,
    tiriPortaCasa: 2.92, tiriPortaSubitiCasa: 4.38,
    tiriPortaTrasferta: 2.92, tiriPortaSubitiTrasferta: 4.31,
    pericolositaOff: 25.4, soliditaDif: 29.5,
    expectedPoints: 1.23,
    poisson: { over15: 16.7, over25: 3.8, over35: 0.7 },
  },
};

const teamNames = Object.keys(TEAMS).sort();

// ─── MOTORE DI ANALISI ────────────────────────────────────────────────────────
function analyzeMatch(homeName, awayName) {
  const h = TEAMS[homeName];
  const a = TEAMS[awayName];
  if (!h || !a) return null;

  // Gol attesi con Poisson incrociato
  const expGoalHome = (h.golFattiCasa + a.golSubitiTrasferta) / 2;
  const expGoalAway = (a.golFattiTrasferta + h.golSubitiCasa) / 2;
  const expTotalGoal = expGoalHome + expGoalAway;

  // Probabilità 1X2 basata su win rate e xG
  const baseH = h.winRateCasa / 100;
  const baseA = a.winRateTrasferta / 100;
  const baseD = (h.drawRate / 100 + a.drawRate / 100) / 2;
  const tot = baseH + baseA + baseD;
  const prob1 = (baseH / tot) * 100;
  const probX = (baseD / tot) * 100;
  const prob2 = (baseA / tot) * 100;

  // Over/Under 2.5
  const poissonOver25 = (h.poisson.over25 + a.poisson.over25) / 2;
  const expOver25 = expTotalGoal > 2.7 ? Math.min(75, poissonOver25 * 1.15) : Math.max(15, poissonOver25 * 0.85);

  // BTTS
  const bttsProb = Math.min(85, Math.max(10,
    (h.golFattiCasa > 1.2 && a.golFattiTrasferta > 0.9 &&
     h.golSubitiCasa > 0.7 && a.golSubitiTrasferta > 0.7)
      ? 55 + (expGoalHome + expGoalAway - 2) * 10
      : 35 + (expGoalHome + expGoalAway - 1.5) * 8
  ));

  // Pericolosità combinata
  const offensiveStrength = (h.pericolositaOff + a.pericolositaOff) / 2;
  const defensiveWeakness = ((100 - h.soliditaDif) + (100 - a.soliditaDif)) / 2;

  // Score di confidenza
  const xpDiff = Math.abs(h.expectedPoints - a.expectedPoints);
  const confidence = Math.min(92, Math.max(45,
    50 + xpDiff * 8 + (Math.abs(prob1 - prob2) * 0.3)
  ));

  // Segnale principale
  let mainSignal = "";
  let signalType = "";
  let signalStrength = 0;

  if (prob1 > 55 && h.expectedPoints > 1.8) {
    mainSignal = `1 (${homeName} vince)`;
    signalType = "1X2";
    signalStrength = prob1;
  } else if (prob2 > 50 && a.expectedPoints > 1.8) {
    mainSignal = `2 (${awayName} vince)`;
    signalType = "1X2";
    signalStrength = prob2;
  } else if (expOver25 > 55) {
    mainSignal = "Over 2.5";
    signalType = "OVER";
    signalStrength = expOver25;
  } else if (bttsProb > 58) {
    mainSignal = "BTTS Sì";
    signalType = "BTTS";
    signalStrength = bttsProb;
  } else if (prob1 + probX > 70 && prob1 > prob2) {
    mainSignal = "1X (casa non perde)";
    signalType = "DOPPIA";
    signalStrength = prob1 + probX;
  } else {
    mainSignal = "Nessun segnale forte";
    signalType = "NEUTRAL";
    signalStrength = 0;
  }

  return {
    homeName, awayName,
    expGoalHome: expGoalHome.toFixed(2),
    expGoalAway: expGoalAway.toFixed(2),
    expTotalGoal: expTotalGoal.toFixed(2),
    prob1: prob1.toFixed(1),
    probX: probX.toFixed(1),
    prob2: prob2.toFixed(1),
    over25: expOver25.toFixed(1),
    under25: (100 - expOver25).toFixed(1),
    btts: bttsProb.toFixed(1),
    mainSignal, signalType,
    signalStrength: signalStrength.toFixed(1),
    confidence: confidence.toFixed(0),
    expPointsHome: h.expectedPoints,
    expPointsAway: a.expectedPoints,
  };
}

// ─── COLORI SEGNALE ───────────────────────────────────────────────────────────
function getSignalColor(type) {
  switch (type) {
    case "1X2": return "#00e5a0";
    case "OVER": return "#f59e0b";
    case "BTTS": return "#818cf8";
    case "DOPPIA": return "#38bdf8";
    default: return "#64748b";
  }
}

function getConfidenceColor(conf) {
  const c = parseInt(conf);
  if (c >= 75) return "#00e5a0";
  if (c >= 60) return "#f59e0b";
  return "#f87171";
}

// ─── COMPONENTE PRINCIPALE ────────────────────────────────────────────────────
export default function App() {
  const [home, setHome] = useState("Inter");
  const [away, setAway] = useState("Milan");
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [matchList, setMatchList] = useState([]);
  const [newHome, setNewHome] = useState("Juventus");
  const [newAway, setNewAway] = useState("Napoli");

  useEffect(() => {
    setResult(analyzeMatch(home, away));
  }, []);

  const handleAnalyze = () => {
    if (home === away) return;
    setAnimating(true);
    setTimeout(() => {
      setResult(analyzeMatch(home, away));
      setAnimating(false);
    }, 400);
  };

  const addToList = () => {
    if (newHome === newAway) return;
    const r = analyzeMatch(newHome, newAway);
    if (r && !matchList.find(m => m.homeName === newHome && m.awayName === newAway)) {
      setMatchList(prev => [...prev, r]);
    }
  };

  const removeFromList = (idx) => {
    setMatchList(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060912",
      color: "#e2e8f0",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      padding: "0",
    }}>
      {/* HEADER */}
      <div style={{
        borderBottom: "1px solid #1e293b",
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        background: "linear-gradient(90deg, #0a0f1e 0%, #060912 100%)",
      }}>
        <div style={{
          width: 40, height: 40,
          background: "linear-gradient(135deg, #00e5a0, #0ea5e9)",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>⚽</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, color: "#f1f5f9" }}>
            SERIE A — SIGNAL ENGINE
          </div>
          <div style={{ fontSize: 11, color: "#475569", letterSpacing: 3 }}>
            STAGIONE 2025/26 · ANALISI STATISTICA
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {["POISSON", "EXPECTED GOALS", "WIN RATE"].map(tag => (
            <span key={tag} style={{
              fontSize: 9, padding: "3px 8px",
              border: "1px solid #1e3a5f",
              color: "#38bdf8", borderRadius: 4, letterSpacing: 2,
            }}>{tag}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, minHeight: "calc(100vh - 89px)" }}>

        {/* LEFT PANEL — Analisi singola */}
        <div style={{
          flex: "0 0 420px",
          borderRight: "1px solid #1e293b",
          padding: "32px 28px",
          display: "flex", flexDirection: "column", gap: 24,
        }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#475569" }}>ANALISI PARTITA</div>

          {/* Selettori */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "CASA", value: home, setter: setHome, accent: "#00e5a0" },
              { label: "TRASFERTA", value: away, setter: setAway, accent: "#f87171" },
            ].map(({ label, value, setter, accent }) => (
              <div key={label}>
                <div style={{ fontSize: 10, color: "#475569", letterSpacing: 3, marginBottom: 6 }}>
                  {label}
                </div>
                <select
                  value={value}
                  onChange={e => setter(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#0f172a",
                    border: `1px solid ${accent}33`,
                    color: accent,
                    padding: "10px 14px",
                    borderRadius: 6,
                    fontSize: 14,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {teamNames.map(t => (
                    <option key={t} value={t} style={{ background: "#0f172a", color: "#e2e8f0" }}>{t}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={home === away}
            style={{
              background: "linear-gradient(135deg, #00e5a0, #0ea5e9)",
              color: "#060912",
              border: "none",
              padding: "12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 3,
              cursor: home === away ? "not-allowed" : "pointer",
              opacity: home === away ? 0.4 : 1,
              fontFamily: "inherit",
            }}
          >
            GENERA SEGNALE →
          </button>

          {/* Risultato */}
          {result && !animating && (
            <div style={{
              background: "#0a1628",
              border: "1px solid #1e293b",
              borderRadius: 10,
              overflow: "hidden",
            }}>
              {/* Header risultato */}
              <div style={{
                padding: "16px 20px",
                background: `${getSignalColor(result.signalType)}11`,
                borderBottom: "1px solid #1e293b",
              }}>
                <div style={{ fontSize: 10, color: "#475569", letterSpacing: 3, marginBottom: 4 }}>
                  SEGNALE PRINCIPALE
                </div>
                <div style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: getSignalColor(result.signalType),
                }}>
                  {result.mainSignal}
                </div>
              </div>

              {/* Metriche */}
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>

                {/* Score confidenza */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: "#475569", letterSpacing: 2 }}>CONFIDENZA</span>
                    <span style={{ fontSize: 12, color: getConfidenceColor(result.confidence), fontWeight: 700 }}>
                      {result.confidence}%
                    </span>
                  </div>
                  <div style={{ height: 3, background: "#1e293b", borderRadius: 2 }}>
                    <div style={{
                      height: "100%",
                      width: `${result.confidence}%`,
                      background: getConfidenceColor(result.confidence),
                      borderRadius: 2,
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                </div>

                {/* Gol attesi */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr auto 1fr",
                  alignItems: "center", textAlign: "center", gap: 8,
                  padding: "12px 0", borderTop: "1px solid #1e293b",
                }}>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "#00e5a0" }}>{result.expGoalHome}</div>
                    <div style={{ fontSize: 9, color: "#475569", letterSpacing: 2 }}>{result.homeName.toUpperCase()}</div>
                  </div>
                  <div style={{ fontSize: 10, color: "#334155" }}>xG</div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "#f87171" }}>{result.expGoalAway}</div>
                    <div style={{ fontSize: 9, color: "#475569", letterSpacing: 2 }}>{result.awayName.toUpperCase()}</div>
                  </div>
                </div>

                {/* Prob 1X2 */}
                <div style={{ borderTop: "1px solid #1e293b", paddingTop: 12 }}>
                  <div style={{ fontSize: 10, color: "#475569", letterSpacing: 2, marginBottom: 8 }}>PROB. 1 · X · 2</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[
                      { label: "1", val: result.prob1, color: "#00e5a0" },
                      { label: "X", val: result.probX, color: "#94a3b8" },
                      { label: "2", val: result.prob2, color: "#f87171" },
                    ].map(({ label, val, color }) => (
                      <div key={label} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ height: 3, background: "#1e293b", borderRadius: 2, marginBottom: 4 }}>
                          <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 2 }} />
                        </div>
                        <div style={{ fontSize: 11, color, fontWeight: 700 }}>{val}%</div>
                        <div style={{ fontSize: 9, color: "#334155" }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Over/BTTS */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: 8, borderTop: "1px solid #1e293b", paddingTop: 12,
                }}>
                  {[
                    { label: "OVER 2.5", val: result.over25, color: "#f59e0b" },
                    { label: "BTTS SÌ", val: result.btts, color: "#818cf8" },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{
                      background: "#0f172a",
                      border: `1px solid ${color}22`,
                      borderRadius: 6, padding: "10px",
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color }}>{val}%</div>
                      <div style={{ fontSize: 9, color: "#475569", letterSpacing: 2, marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* xPoints */}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  borderTop: "1px solid #1e293b", paddingTop: 12,
                  fontSize: 11, color: "#475569",
                }}>
                  <span>xPTS {result.homeName}: <span style={{ color: "#e2e8f0" }}>{result.expPointsHome}</span></span>
                  <span>xPTS {result.awayName}: <span style={{ color: "#e2e8f0" }}>{result.expPointsAway}</span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — Giornata */}
        <div style={{ flex: 1, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#475569" }}>GIORNATA — ANALISI MULTIPLA</div>

          {/* Aggiungi partita */}
          <div style={{
            background: "#0a1628",
            border: "1px solid #1e293b",
            borderRadius: 10, padding: "20px",
            display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap",
          }}>
            {[
              { label: "CASA", value: newHome, setter: setNewHome },
              { label: "TRASFERTA", value: newAway, setter: setNewAway },
            ].map(({ label, value, setter }) => (
              <div key={label} style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontSize: 10, color: "#475569", letterSpacing: 2, marginBottom: 5 }}>{label}</div>
                <select
                  value={value}
                  onChange={e => setter(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    color: "#e2e8f0",
                    padding: "8px 12px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontFamily: "inherit",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {teamNames.map(t => (
                    <option key={t} value={t} style={{ background: "#0f172a" }}>{t}</option>
                  ))}
                </select>
              </div>
            ))}
            <button
              onClick={addToList}
              disabled={newHome === newAway}
              style={{
                background: "#1e3a5f",
                border: "1px solid #38bdf8",
                color: "#38bdf8",
                padding: "8px 20px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              + AGGIUNGI
            </button>
          </div>

          {/* Lista partite */}
          {matchList.length === 0 ? (
            <div style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              color: "#1e293b", fontSize: 13, letterSpacing: 3, textAlign: "center",
            }}>
              AGGIUNGI PARTITE DELLA GIORNATA<br />
              <span style={{ fontSize: 10 }}>PER VEDERE I SEGNALI MULTIPLI</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
              {matchList.map((m, idx) => (
                <div key={idx} style={{
                  background: "#0a1628",
                  border: `1px solid ${getSignalColor(m.signalType)}22`,
                  borderLeft: `3px solid ${getSignalColor(m.signalType)}`,
                  borderRadius: 8, padding: "16px 20px",
                  display: "grid",
                  gridTemplateColumns: "1fr 80px 80px 80px 80px 130px 32px",
                  alignItems: "center", gap: 16,
                }}>
                  {/* Partita */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>
                      {m.homeName} <span style={{ color: "#334155" }}>vs</span> {m.awayName}
                    </div>
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>
                      xG: {m.expGoalHome} — {m.expGoalAway}
                    </div>
                  </div>

                  {/* 1X2 */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#475569", letterSpacing: 1 }}>1·X·2</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                      {m.prob1}·{m.probX}·{m.prob2}
                    </div>
                  </div>

                  {/* Over */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#475569", letterSpacing: 1 }}>OV 2.5</div>
                    <div style={{ fontSize: 13, color: "#f59e0b", fontWeight: 600, marginTop: 2 }}>{m.over25}%</div>
                  </div>

                  {/* BTTS */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#475569", letterSpacing: 1 }}>BTTS</div>
                    <div style={{ fontSize: 13, color: "#818cf8", fontWeight: 600, marginTop: 2 }}>{m.btts}%</div>
                  </div>

                  {/* Confidenza */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#475569", letterSpacing: 1 }}>CONF.</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: getConfidenceColor(m.confidence), marginTop: 2 }}>
                      {m.confidence}%
                    </div>
                  </div>

                  {/* Segnale */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      background: `${getSignalColor(m.signalType)}15`,
                      border: `1px solid ${getSignalColor(m.signalType)}44`,
                      color: getSignalColor(m.signalType),
                      borderRadius: 5, padding: "4px 8px",
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {m.mainSignal}
                    </div>
                  </div>

                  {/* Rimuovi */}
                  <button
                    onClick={() => removeFromList(idx)}
                    style={{
                      background: "transparent", border: "none",
                      color: "#334155", cursor: "pointer", fontSize: 14,
                      padding: 4,
                    }}
                  >✕</button>
                </div>
              ))}

              {/* Sommario */}
              {matchList.length >= 2 && (
                <div style={{
                  marginTop: 8,
                  background: "#0a1628",
                  border: "1px solid #1e293b",
                  borderRadius: 8, padding: "16px 20px",
                  display: "flex", gap: 32,
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: "#475569", letterSpacing: 2 }}>SEGNALI FORTI</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#00e5a0", marginTop: 4 }}>
                      {matchList.filter(m => parseFloat(m.signalStrength) > 50).length}/{matchList.length}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#475569", letterSpacing: 2 }}>CONF. MEDIA</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#38bdf8", marginTop: 4 }}>
                      {(matchList.reduce((s, m) => s + parseInt(m.confidence), 0) / matchList.length).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#475569", letterSpacing: 2 }}>OVER MEDI</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#f59e0b", marginTop: 4 }}>
                      {(matchList.reduce((s, m) => s + parseFloat(m.over25), 0) / matchList.length).toFixed(1)}%
                    </div>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                    <div style={{ fontSize: 10, color: "#1e3a5f", letterSpacing: 2, maxWidth: 200, lineHeight: 1.6 }}>
                      I segnali si basano su statistiche storiche 2025/26.<br />
                      Non costituiscono consulenza finanziaria.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
