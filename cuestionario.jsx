import { useState, useMemo } from "react";

const INVERSE = new Set([3,6,8,24,30,32,43,54,42,15,29,31,33,49,55,7,25,37,40,45,50,5,18,22,27,38]);

const CATEGORIES = [
  { name: "Control de Estrés",                           questions: new Set([1,3,6,8,10,12,13,14,17,19,20,21,24,26,30,32,36,41,43,54]), color: "#1e3a5f" },
  { name: "Influencia de la Evaluación del Rendimiento", questions: new Set([9,16,28,34,35,42,44,46,47,51,52,53]),                      color: "#5b2d8e" },
  { name: "Motivación",                                  questions: new Set([4,15,29,31,33,39,49,55]),                                   color: "#b45309" },
  { name: "Habilidad Mental",                            questions: new Set([2,7,23,25,37,40,45,48,50]),                                 color: "#065f46" },
  { name: "Cohesión de Equipo",                          questions: new Set([5,11,18,22,27,38]),                                         color: "#9f1239" },
];

const ALL_QUESTIONS = Array.from({ length: 55 }, (_, i) => i + 1);

const SCORE_VEC     = [4, 3, 2, 1, 0];
const SCORE_VEC_INV = [0, 1, 2, 3, 4];

function getScore(q, answer) {
  if (answer === "" || answer === undefined || answer === null) return null;
  const a = parseInt(answer);
  if (isNaN(a) || a < 0 || a > 4) return null;
  return INVERSE.has(q) ? SCORE_VEC_INV[a] : SCORE_VEC[a];
}

export default function Cuestionario() {
  const [answers, setAnswers] = useState({});

  const handleChange = (q, val) => setAnswers(prev => ({ ...prev, [q]: val }));

  const scores = useMemo(() => {
    const s = {};
    ALL_QUESTIONS.forEach(q => { s[q] = getScore(q, answers[q]); });
    return s;
  }, [answers]);

  const catScores = useMemo(() => CATEGORIES.map(cat => {
    let total = 0, answered = 0;
    cat.questions.forEach(q => {
      const s = scores[q];
      if (s !== null) { total += s; answered++; }
    });
    return { total, answered, count: cat.questions.size };
  }), [scores]);

  const answered = Object.values(answers).filter(v => v !== "" && v !== undefined).length;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#f0f4f8", padding: "24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "#1e3a5f", borderRadius: 12, padding: "20px 28px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ color: "#fff", margin: 0, fontSize: 22, fontWeight: 700 }}>Cuestionario</h1>
            <p style={{ color: "#a8c4e0", margin: "4px 0 0", fontSize: 13 }}>Normales: 0→4, 4→0 · Inversas: 0→0, 4→4</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#a8c4e0", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Respondidas</div>
              <div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>{answered}<span style={{ color: "#a8c4e0", fontSize: 13 }}>/55</span></div>
            </div>
            <div style={{ width: 1, height: 40, background: "#2e5080" }} />
            <button onClick={() => setAnswers({})} style={{ padding: "8px 16px", borderRadius: 20, border: "1px solid #4a7aaa", cursor: "pointer", background: "transparent", color: "#a8c4e0", fontSize: 13 }}>
              Limpiar todo
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 24 }}>
          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "56px 90px 1fr 80px", padding: "10px 20px", background: "#1e3a5f", gap: 8 }}>
            {["#", "Tipo", "Respuesta", "Resultado"].map((h, i) => (
              <div key={i} style={{ color: "#a8c4e0", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          <div style={{ maxHeight: 560, overflowY: "auto" }}>
            {ALL_QUESTIONS.map((q, idx) => {
              const isInv = INVERSE.has(q);
              const ans   = answers[q];
              const score = scores[q];

              return (
                <div key={q} style={{ display: "grid", gridTemplateColumns: "56px 90px 1fr 80px", padding: "7px 20px", gap: 8, background: idx % 2 === 0 ? "#fff" : "#f8fafc", alignItems: "center", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15 }}>{q}</div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 10, background: isInv ? "#fef3c7" : "#dcfce7", color: isInv ? "#92400e" : "#166534" }}>
                      {isInv ? "↩ Inversa" : "→ Normal"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 5 }}>
                    {[0,1,2,3,4].map(v => (
                      <button key={v} onClick={() => handleChange(q, v)} style={{
                        width: 34, height: 34, borderRadius: 7, border: "2px solid",
                        borderColor: ans === v ? "#1e3a5f" : "#e0e0e0",
                        background:  ans === v ? "#1e3a5f" : "#fff",
                        color:       ans === v ? "#fff"    : "#555",
                        fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.12s"
                      }}>{v}</button>
                    ))}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 18, textAlign: "center", color: score !== null ? "#16a34a" : "#ccc" }}>
                    {score !== null ? score : "–"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category score cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
          {CATEGORIES.map((cat, ci) => (
            <div key={cat.name} style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", borderLeft: `4px solid ${cat.color}`, boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
              <div style={{ color: cat.color, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6, lineHeight: 1.3 }}>{cat.name}</div>
              <div style={{ color: "#1e3a5f", fontWeight: 800, fontSize: 28 }}>{catScores[ci].total}</div>
              <div style={{ color: "#999", fontSize: 12, marginTop: 2 }}>{catScores[ci].answered}/{catScores[ci].count} respondidas</div>
            </div>
          ))}
        </div>

        {/* Grand total */}
        <div style={{ background: "#1e3a5f", borderRadius: 12, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
          <div>
            <div style={{ color: "#a8c4e0", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Puntuación directa total</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 }}>{answered} de 55 preguntas respondidas</div>
          </div>
          <div style={{ color: "#4ade80", fontWeight: 800, fontSize: 36 }}>{catScores.reduce((a, c) => a + c.total, 0)}</div>
        </div>

      </div>
    </div>
  );
}
