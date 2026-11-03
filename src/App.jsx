import React, { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, ReferenceLine } from "recharts";

// ---------- Paleta institucional (misma de las fichas .docx) ----------
const NAVY = "#0F2942";
const NAVY_SOFT = "#1B3A5C";
const TEAL = "#1B6B8A";
const GRAYBLUE = "#8799A9";
const LIGHTGRAY = "#EDF2F7";
const AMBER_BG = "#FFF3CD";
const AMBER_TXT = "#B7791F";
const RED = "#C53030";
const GREEN_BG = "#D6F0D8";
const GREEN_TXT = "#1F7A3D";

// ---------- Datos de referencia (SEMILLA para carga inicial a Supabase — ya NO se usan en el render, ver useRegionsFromSupabase) ----------
const REGIONS = {
  valparaiso: {
    label: "Valparaíso",
    jefeUrs: "Susanne Spichiguer",
    jefeConfianza: "Seguro",
    ciclo: "Bilateral 28/07/2026 (2ª medición del ciclo)",
    primeraVez: false,
    s2regional: [
      { corte: "27-07-2026", transferido: 34960, pendiente: 12944, pct: 37.0 },
      { corte: "27-02-2026", transferido: 45797, pendiente: 23849, pct: 52.1 },
    ],
    comunas: [
      ["Valparaíso", 4110.5, 2248.8, 54.71],
      ["Juan Fernández", 2939.7, 1135.7, 38.63],
      ["Puchuncaví", 1393.2, 1066.9, 76.58],
      ["Catemu", 923.0, 724.3, 78.48],
      ["Viña Del Mar", 13150.0, 684.0, 5.20],
      ["Calle Larga", 621.5, 510.2, 82.10],
      ["Llaillay", 515.1, 452.8, 87.89],
      ["Calera", 433.5, 433.5, 100.00],
      ["Villa Alemana", 973.7, 414.1, 42.53],
      ["Olmué", 733.9, 394.6, 53.76],
      ["Papudo", 493.5, 365.8, 74.13],
      ["La Ligua", 602.2, 348.2, 57.82],
      ["Putaendo", 733.9, 340.3, 46.37],
      ["Cartagena", 613.5, 322.2, 52.52],
      ["Panquehue", 565.5, 314.2, 55.56],
      ["Rinconada", 544.8, 308.8, 56.67],
      ["Nogales", 374.7, 284.9, 76.04],
      ["Concón", 409.9, 279.8, 68.27],
      ["Isla De Pascua", 305.5, 260.1, 85.13],
      ["Quilpué", 617.1, 225.6, 36.56],
      ["Limache", 479.1, 209.1, 43.65],
      ["San Esteban", 382.2, 194.2, 50.80],
      ["Santo Domingo", 290.5, 187.9, 64.69],
      ["Petorca", 250.5, 155.7, 62.15],
      ["Quillota", 187.7, 137.2, 73.09],
      ["San Antonio", 441.1, 132.8, 30.10],
      ["San Felipe", 185.6, 132.1, 71.20],
      ["Asoc. Municipalidades V Región - ASOMUNISV", 287.2, 128.6, 44.78],
      ["Hijuelas", 123.9, 123.9, 100.00],
      ["Quintero", 295.9, 114.5, 38.70],
      ["Casablanca", 114.1, 90.8, 79.55],
      ["La Cruz", 137.8, 78.6, 57.05],
      ["Algarrobo", 126.9, 42.0, 33.10],
      ["Asoc. Municipalidades V Región Cordillera", 35.0, 35.0, 100.00],
      ["Santa María", 119.2, 25.4, 21.31],
      ["Zapallar", 131.6, 17.5, 13.31],
      ["Cabildo", 48.6, 10.7, 22.01],
      ["Los Andes", 137.8, 10.0, 7.23],
      ["El Quisco", 130.7, 4.3, 3.27],
      ["Asoc. Costeras Puchuncaví-Quintero", 0.0, 0.0, 0.00],
      ["El Tabo", 0.0, 0.0, 0.00],
    ],
    s3: "Villa Alemana → Quilpué → Siguen sin elegibles. Bajaron su rendición de 67% a — Cartagena → Juan Fernández → (contenido original ambiguo, mantenido tal cual)",
    s5: null,
    s6: null,
    s7a: null, // sin dato — no se recibió captura de "evaluación de proyectos" para Valparaíso
    s7b: {
      pmu: { metaT: 18.4, realT: 18.4, metaF: 26.0, realF: 43.3 },
      pmb: { metaT: 9.6, realT: 3.7, metaF: 3.8, realF: 41.4 },
    },
    s8: {
      totalExpedientes: 58, bandejaUrs: 37, bandejaMonto: 1120.4,
      segundasCuota: 36, segundasMonto: 1112.3, pagadas: 9, analista: 5, sinBandeja: 4,
      anomalia: "3 expedientes de La Calera figuran en bandeja 'URS METROPOLITANA' en vez de Valparaíso (E9539/2025, E19615/2025, E15459/2025).",
    },
    s9: { total: 2938, cerrados: 2308, enEjecucion: 80, otros: 550 },
    s10: null,
    s11: {
      cerrados: [47, 134], postulados: [102, 182],
      transferido: [45797, 34960], pendiente: [23849, 12944], pct: [52.1, 37.0],
    },
  },
  atacama: {
    label: "Atacama",
    jefeUrs: "Juan José Moreno Figueras",
    jefeConfianza: "Probable",
    ciclo: "1ª Reunión Bilateral (18/08/2026)",
    primeraVez: true,
    s2regional: null,
    comunas: [
      ["Caldera", 3831.2, 84.5, 2.21],
      ["Tierra Amarilla", 2152.4, 56.5, 2.63],
      ["Alto Del Carmen", 5240.3, 16.5, 0.31],
      ["Chañaral", 10089.4, 9.3, 0.09],
      ["Vallenar", 3561.5, 3.7, 0.10],
      ["Diego De Almagro", 4231.8, 1.6, 0.04],
      ["Copiapó", 5556.4, 1.4, 0.03],
      ["Huasco", 4475.2, 0.0, 0.00],
      ["Asoc. de Municipalidades Región Atacama", 207.7, 0.0, 0.00],
      ["Delegación Presidencial Provincial de Huasco", 24.0, 0.0, 0.00],
      ["Delegación Presidencial Provincial de Chañaral", 13.8, 0.0, 0.00],
      ["Delegación Presidencial Regional de Atacama", 23.9, 0.0, 0.00],
      ["Freirina", 4299.7, -7.3, -0.17],
    ],
    s3: null,
    s5: null, s6: null,
    s7a: { pmu: { meta: 3.8, real: 4.0 }, pmb: { meta: 3.4, real: 4.0 } },
    s7b: {
      pmu: { metaT: 4.9, realT: 11.4, metaF: 4.8, realF: 10.1 },
      pmb: { metaT: 3.7, realT: 8.7, metaF: 7.3, realF: 21.4 },
    },
    s8: null,
    s9: { total: 853, cerrados: 753, enEjecucion: 10, otros: 90 },
    s10: null,
    s11: null,
  },
  magallanes: {
    label: "Magallanes",
    jefeUrs: "Daniela Panicucci (sitio oficial) — noticias ago-2026 mencionan a Javier Labrín Jofré",
    jefeConfianza: "Suposición",
    ciclo: "1ª Reunión Bilateral (18/08/2026)",
    primeraVez: true,
    s2regional: null,
    comunas: [
      ["Natales", 5671.8, 361.0, 6.36],
      ["Cabo De Hornos", 956.2, 213.5, 22.32],
      ["Torres Del Paine", 1894.5, 206.8, 10.92],
      ["Punta Arenas", 8812.1, 201.9, 2.29],
      ["Porvenir", 2168.7, 167.7, 7.73],
      ["San Gregorio", 888.3, 154.4, 17.38],
      ["Timaukel", 2082.9, 49.5, 2.38],
      ["Primavera", 2030.4, 9.1, 0.45],
      ["Río Verde", 800.7, 5.5, 0.68],
      ["Laguna Blanca", 863.4, 0.6, 0.07],
      ["Delegación Presidencial Provincial de Última Esperanza", 26.4, 0.3, 1.05],
      ["Delegación Presidencial Provincial de Tierra Del Fuego", 3.8, 0.0, 0.00],
      ["Asociación Regional de Municipalidades de Magallanes y Antártica Chilena", 161.9, 0.0, 0.00],
      ["Delegación Presidencial Provincial de Antártica Chilena", 9.0, 0.0, 0.00],
      ["Delegación Presidencial Regional de Magallanes y de la Antártica Chilena", 20.7, 0.0, 0.00],
    ],
    s3: null,
    s5: null, s6: null,
    s7a: { pmu: { meta: 4.5, real: null }, pmb: { meta: 5.3, real: null } },
    s7b: {
      pmu: { metaT: 6.1, realT: 10.8, metaF: 7.5, realF: 19.0 },
      pmb: { metaT: 8.5, realT: 29.3, metaF: 11.5, realF: 64.0 },
    },
    s8: null,
    s9: { total: 445, cerrados: 356, enEjecucion: 6, otros: 83 },
    s10: null,
    s11: null,
  },
};

const fmtM = (n) => {
  if (n === null || n === undefined) return "—";
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(n).toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
};
const pctColor = (p) => (p >= 60 ? RED : p >= 30 ? AMBER_TXT : GREEN_TXT);

function Pill({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: LIGHTGRAY, fg: NAVY_SOFT },
    warn: { bg: AMBER_BG, fg: AMBER_TXT },
    bad: { bg: "#FBDADA", fg: RED },
    good: { bg: GREEN_BG, fg: GREEN_TXT },
  };
  const t = tones[tone];
  return (
    <span style={{ background: t.bg, color: t.fg, borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function Pending({ text }) {
  return (
    <div style={{ background: AMBER_BG, border: `1px solid #F0D48A`, borderRadius: 6, padding: "10px 14px", color: AMBER_TXT, fontSize: 13, display: "flex", gap: 8 }}>
      <span>⏳</span>
      <span><strong>Dato pendiente: </strong>{text}</span>
    </div>
  );
}

function SectionTitle({ n, title }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, borderBottom: `2px solid ${NAVY}`, paddingBottom: 6, marginBottom: 14, marginTop: 28 }}>
      <span style={{ color: NAVY, fontWeight: 800, fontSize: 13, letterSpacing: 0.5 }}>{n}</span>
      <h3 style={{ color: NAVY, fontWeight: 700, fontSize: 16, margin: 0, letterSpacing: 0.2 }}>{title}</h3>
    </div>
  );
}

function Table({ headers, rows, highlightTop = 0 }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 6, border: `1px solid ${LIGHTGRAY}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ background: NAVY, color: "white", textAlign: "left", padding: "8px 10px", fontWeight: 600, fontSize: 12 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i < highlightTop ? AMBER_BG : i % 2 === 0 ? LIGHTGRAY : "white" }}>
              {r.map((c, j) => (
                <td key={j} style={{ padding: "7px 10px", color: NAVY_SOFT, fontWeight: i < highlightTop && j <= 1 ? 700 : 400 }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EvalRow({ label, meta, real }) {
  const hasData = real !== null && real !== undefined;
  const ok = hasData && real <= meta;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: hasData ? (ok ? GREEN_BG : "#FBDADA") : LIGHTGRAY, borderRadius: 6, marginBottom: 8 }}>
      <span style={{ fontWeight: 600, color: NAVY_SOFT, fontSize: 13 }}>{label}</span>
      <span style={{ fontSize: 12, color: "#555" }}>Meta: {meta.toFixed(1)}d</span>
      <span style={{ fontWeight: 700, color: hasData ? (ok ? GREEN_TXT : RED) : "#999", fontSize: 13 }}>
        {hasData ? `${real.toFixed(1)}d real` : "Sin datos"}
      </span>
    </div>
  );
}

// ---------- Fechas: siempre dd-mm-aaaa en pantalla ----------
const MESES_ES = { ene: "01", feb: "02", mar: "03", abr: "04", may: "05", jun: "06", jul: "07", ago: "08", sep: "09", sept: "09", oct: "10", nov: "11", dic: "12" };
// Acepta "2026-09-30" (o con hora) y "30-sep-2026"; cualquier otro texto se deja igual.
const fmtFecha = (v) => {
  if (v === null || v === undefined || v === "") return v;
  const t = String(v).trim();
  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  m = t.match(/^(\d{1,2})-([A-Za-z]{3,4})-(\d{4})$/);
  if (m && MESES_ES[m[2].toLowerCase()]) return `${m[1].padStart(2, "0")}-${MESES_ES[m[2].toLowerCase()]}-${m[3]}`;
  return t;
};
// Texto libre con fechas incrustadas ("corte 20-ago-2026") -> dd-mm-aaaa
const fmtFechasEnTexto = (txt) => String(txt).replace(/\b(\d{1,2})-(ene|feb|mar|abr|may|jun|jul|ago|sept|sep|oct|nov|dic)-(\d{4})\b/gi, (_, d, mes, y) => `${d.padStart(2, "0")}-${MESES_ES[mes.toLowerCase()]}-${y}`);
// true solo si b cae en el mes calendario inmediatamente siguiente a a
const sonMesesConsecutivos = (a, b) => {
  const ma = String(a || "").match(/^(\d{4})-(\d{2})/), mb = String(b || "").match(/^(\d{4})-(\d{2})/);
  if (!ma || !mb) return false;
  return (Number(mb[1]) * 12 + Number(mb[2])) - (Number(ma[1]) * 12 + Number(ma[2])) === 1;
};

// currDate / prevDate: fechas de corte (aaaa-mm-dd). "vs. mes pasado" solo si son meses consecutivos;
// en otro caso se indica la fecha del corte con el que se compara.
function DeltaBadge({ curr, prev, currDate, prevDate }) {
  if (prev === null || prev === undefined) return <span style={{ fontSize: 11, color: "#999" }}>sin corte anterior</span>;
  const diff = curr - prev;
  const ref = !prevDate ? "corte anterior" : sonMesesConsecutivos(prevDate, currDate) ? "mes pasado" : fmtFecha(prevDate);
  if (Math.abs(diff) < 0.05) return <span style={{ fontSize: 11, color: "#888" }}>≈ igual que {ref === "corte anterior" || ref === "mes pasado" ? "el " + ref : ref}</span>;
  const faster = diff < 0; // menos días = más rápido
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: faster ? GREEN_TXT : RED }}>
      {faster ? "▼" : "▲"} {Math.abs(diff).toFixed(1)}d {faster ? "más rápido" : "más lento"} vs. {ref} ({prev.toFixed(1)}d)
    </span>
  );
}

function RendCard({ label, data }) {
  const okT = data.realT <= data.metaT, okF = data.realF <= data.metaF;
  return (
    <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 14, flex: 1, minWidth: 240 }}>
      <div style={{ fontWeight: 700, color: NAVY, marginBottom: 10, fontSize: 14 }}>{label}</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, color: "#666" }}>
        <span>Técnica</span><span>Meta {data.metaT.toFixed(1)}d</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: okT ? GREEN_TXT : RED }}>{data.realT.toFixed(1)} días</div>
      <div style={{ marginBottom: 10 }}><DeltaBadge curr={data.realT} prev={data.prevRealT} currDate={data.corteFecha} prevDate={data.corteFechaPrev} /></div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, color: "#666" }}>
        <span>Financiera</span><span>Meta {data.metaF.toFixed(1)}d</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: okF ? GREEN_TXT : RED }}>{data.realF.toFixed(1)} días</div>
      <div><DeltaBadge curr={data.realF} prev={data.prevRealF} currDate={data.corteFecha} prevDate={data.corteFechaPrev} /></div>
    </div>
  );
}

function DonutMini({ cerrados, enEjecucion, otros, total }) {
  const t = total > 0 ? total : 1;
  const pC = (cerrados / t) * 100, pE = (enEjecucion / t) * 100, pO = (otros / t) * 100;
  const seg = (start, val, color) => {
    const circumference = 2 * Math.PI * 40;
    const len = (val / 100) * circumference;
    return <circle key={color} r="40" cx="50" cy="50" fill="transparent" stroke={color} strokeWidth="16"
      strokeDasharray={`${len} ${circumference - len}`} strokeDashoffset={-((start / 100) * circumference)} transform="rotate(-90 50 50)" />;
  };
  return (
    <svg width="110" height="110" viewBox="0 0 100 100">
      <circle r="40" cx="50" cy="50" fill="transparent" stroke={LIGHTGRAY} strokeWidth="16" />
      {seg(0, pC, TEAL)}
      {seg(pC, pE, "#3B82C4")}
      {seg(pC + pE, pO, GRAYBLUE)}
    </svg>
  );
}

function AcuerdosEditor({ regionId, rows, fetcher, onChanged }) {
  const [form, setForm] = useState({ descripcion: "", responsable: "", plazo: "", estado: "Pendiente" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function addRow() {
    if (!form.descripcion.trim()) return;
    setBusy(true); setErr(null);
    try {
      await fetcher.insertRow("acuerdos_compromisos", { region_id: regionId, descripcion: form.descripcion, responsable: form.responsable || null, plazo: form.plazo || null, estado: form.estado });
      setForm({ descripcion: "", responsable: "", plazo: "", estado: "Pendiente" });
      onChanged();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function updateField(id, field, value) {
    try { await fetcher.updateRow("acuerdos_compromisos", id, { [field]: value, updated_at: new Date().toISOString() }); onChanged(); }
    catch (e) { setErr(e.message); }
  }
  async function removeRow(id) {
    try { await fetcher.deleteRow("acuerdos_compromisos", id); onChanged(); }
    catch (e) { setErr(e.message); }
  }

  const estadoTone = { Pendiente: "neutral", "En curso": "warn", Cumplido: "good", Atrasado: "bad" };

  return (
    <div>
      {err && <div style={{ color: RED, fontSize: 12, marginBottom: 8 }}>Error: {err}</div>}
      <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, overflow: "hidden" }}>
        {rows.length === 0 && <div style={{ padding: 14, fontSize: 13, color: "#888" }}>Sin acuerdos registrados todavía.</div>}
        {rows.map((a) => (
          <div key={a.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 12px", borderBottom: `1px solid ${LIGHTGRAY}`, fontSize: 13 }}>
            <input defaultValue={a.descripcion} onBlur={(e) => e.target.value !== a.descripcion && updateField(a.id, "descripcion", e.target.value)}
              style={{ flex: 3, border: "1px solid transparent", padding: 4, borderRadius: 4 }} onFocus={(e) => e.target.style.border = `1px solid ${LIGHTGRAY}`} />
            <input defaultValue={a.responsable || ""} onBlur={(e) => e.target.value !== a.responsable && updateField(a.id, "responsable", e.target.value)}
              placeholder="Responsable" style={{ flex: 1.2, border: "1px solid transparent", padding: 4, borderRadius: 4 }} onFocus={(e) => e.target.style.border = `1px solid ${LIGHTGRAY}`} />
            <input type="date" defaultValue={a.plazo || ""} onBlur={(e) => e.target.value !== a.plazo && updateField(a.id, "plazo", e.target.value)}
              style={{ flex: 1, border: "1px solid transparent", padding: 4, borderRadius: 4, fontSize: 12 }} onFocus={(e) => e.target.style.border = `1px solid ${LIGHTGRAY}`} />
            <select value={a.estado} onChange={(e) => updateField(a.id, "estado", e.target.value)} style={{ fontSize: 12, borderRadius: 4, padding: 3 }}>
              {["Pendiente", "En curso", "Cumplido", "Atrasado"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => removeRow(a.id)} title="Eliminar" style={{ border: "none", background: "transparent", color: RED, cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, padding: 12, background: LIGHTGRAY, borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: NAVY_SOFT, marginBottom: 8 }}>Agregar nuevo acuerdo</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input placeholder="Descripción del compromiso" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
            style={{ flex: 3, minWidth: 200, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <input placeholder="Responsable" value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })}
            style={{ flex: 1.2, minWidth: 120, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <input type="date" value={form.plazo} onChange={e => setForm({ ...form, plazo: e.target.value })}
            style={{ flex: 1, minWidth: 130, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <button onClick={addRow} disabled={busy || !form.descripcion.trim()}
            style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: busy ? LIGHTGRAY : NAVY, color: "white", fontWeight: 700, fontSize: 13, cursor: busy ? "default" : "pointer" }}>
            {busy ? "Guardando…" : "+ Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CoberturaEditor({ regionId, rows, fetcher, onChanged, comunasCanonicas }) {
  const [form, setForm] = useState({ comuna: comunasCanonicas[0] || "", fecha_visita: "", visitado_por: "", notas: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function addRow() {
    if (!form.comuna || !form.fecha_visita) return;
    setBusy(true); setErr(null);
    try {
      await fetcher.insertRow("cobertura_visitas", { region_id: regionId, comuna: form.comuna, fecha_visita: form.fecha_visita, visitado_por: form.visitado_por || null, notas: form.notas || null });
      setForm({ ...form, fecha_visita: "", visitado_por: "", notas: "" });
      onChanged();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function removeRow(id) {
    try { await fetcher.deleteRow("cobertura_visitas", id); onChanged(); }
    catch (e) { setErr(e.message); }
  }

  const visitCounts = {};
  rows.forEach(r => { visitCounts[r.comuna] = (visitCounts[r.comuna] || 0) + 1; });
  const comunasVisitadas = new Set(rows.map(r => r.comuna));
  const comunasSinVisitar = comunasCanonicas.filter(c => !comunasVisitadas.has(c));

  return (
    <div>
      {err && <div style={{ color: RED, fontSize: 12, marginBottom: 8 }}>Error: {err}</div>}

      <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
        <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 12, flex: 1 }}>
          <div style={{ fontSize: 11, color: "#666" }}>Comunas visitadas</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: NAVY }}>{comunasVisitadas.size}/{comunasCanonicas.length}</div>
        </div>
        <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 12, flex: 1 }}>
          <div style={{ fontSize: 11, color: "#666" }}>Visitas totales registradas</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: NAVY }}>{rows.length}</div>
        </div>
      </div>

      {comunasSinVisitar.length > 0 && (
        <div style={{ background: "#FBDADA", borderRadius: 6, padding: "8px 12px", marginBottom: 12, fontSize: 12.5, color: RED }}>
          ⚠️ Sin visitar ({comunasSinVisitar.length}): {comunasSinVisitar.join(", ")}
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: NAVY_SOFT, marginBottom: 6 }}>Visitas por comuna</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {comunasCanonicas.map(c => (
            <Pill key={c} tone={visitCounts[c] ? "good" : "neutral"}>{c}: {visitCounts[c] || 0}</Pill>
          ))}
        </div>
      </div>

      <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, overflow: "hidden" }}>
        {rows.length === 0 && <div style={{ padding: 14, fontSize: 13, color: "#888" }}>Sin visitas registradas todavía.</div>}
        {rows.map((v) => (
          <div key={v.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px", borderBottom: `1px solid ${LIGHTGRAY}`, fontSize: 13 }}>
            <span style={{ flex: 2, fontWeight: 600 }}>{v.comuna}</span>
            <span style={{ flex: 1, color: "#666", fontSize: 12 }}>{fmtFecha(v.fecha_visita)}</span>
            <span style={{ flex: 1.5, color: "#666", fontSize: 12 }}>{v.visitado_por || "—"}</span>
            <span style={{ flex: 2, color: "#888", fontSize: 12 }}>{v.notas || ""}</span>
            <button onClick={() => removeRow(v.id)} style={{ border: "none", background: "transparent", color: RED, cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, padding: 12, background: LIGHTGRAY, borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: NAVY_SOFT, marginBottom: 8 }}>Registrar nueva visita</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select value={form.comuna} onChange={e => setForm({ ...form, comuna: e.target.value })}
            style={{ flex: 1.5, minWidth: 160, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }}>
            {comunasCanonicas.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={form.fecha_visita} onChange={e => setForm({ ...form, fecha_visita: e.target.value })}
            style={{ flex: 1, minWidth: 130, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <input placeholder="Visitado por (ej. Jefe/a URS)" value={form.visitado_por} onChange={e => setForm({ ...form, visitado_por: e.target.value })}
            style={{ flex: 1.5, minWidth: 150, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <input placeholder="Notas (opcional)" value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })}
            style={{ flex: 2, minWidth: 150, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <button onClick={addRow} disabled={busy || !form.comuna || !form.fecha_visita}
            style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: busy ? LIGHTGRAY : NAVY, color: "white", fontWeight: 700, fontSize: 13, cursor: busy ? "default" : "pointer" }}>
            {busy ? "Guardando…" : "+ Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

const LOOKER_URL = "https://datastudio.google.com/u/0/reporting/4edc75ec-1e9f-4949-9577-1cc7607fc6e0/page/Pz5zF";

function RadarProyectos({ rows }) {
  const linkButton = (
    <a href={LOOKER_URL} target="_blank" rel="noopener noreferrer"
      style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: TEAL, textDecoration: "none", background: LIGHTGRAY, padding: "6px 12px", borderRadius: 6, marginBottom: 10 }}>
      ↗ Ver reporte completo en Looker Studio
    </a>
  );
  if (!rows || rows.length === 0) return (
    <div>
      {linkButton}
      <Pending text="Sin datos del radar de proyectos por mes para esta región. Se completa a partir de capturas del reporte de Looker Studio." />
    </div>
  );

  const estados = ["No Elegibles", "Elegibles", "Asignados", "Transferidos", "En Cierre", "Cerrados"];
  const byEstado = {};
  estados.forEach(e => { byEstado[e] = rows.filter(r => r.estado === e).sort((a, b) => a.orden - b.orden); });

  // Genera alertas simples: tendencia monotónica y mayor variación mes a mes
  const alerts = [];
  estados.forEach(e => {
    const serie = byEstado[e].filter(r => r.n !== null && r.n !== undefined);
    if (serie.length < 2) return;
    const first = serie[0].n, last = serie[serie.length - 1].n;
    const delta = last - first;
    const pct = first !== 0 ? (delta / first) * 100 : 0;
    const monotonic = serie.every((r, i) => i === 0 || r.n >= serie[i - 1].n) || serie.every((r, i) => i === 0 || r.n <= serie[i - 1].n);
    if (Math.abs(pct) >= 15) {
      const worse = (e === "No Elegibles" || e === "En Cierre") ? delta > 0 : (e === "Cerrados" || e === "Elegibles" || e === "Transferidos") ? delta < 0 : null;
      alerts.push({ estado: e, texto: `${e}: ${delta > 0 ? "+" : ""}${delta} proyectos (${pct > 0 ? "+" : ""}${pct.toFixed(0)}%) entre ${serie[0].periodo} y ${serie[serie.length - 1].periodo}${monotonic ? " — tendencia sostenida, no un salto puntual" : ""}.`, critical: worse === true });
    }
  });

  return (
    <div>
      {linkButton}
      <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
        Fuente: captura del reporte "Radar de Proyectos por Mes" (Looker Studio), corte 20-08-2026. No incrustado en vivo — se actualiza cuando se comparte una nueva captura.
      </div>
      {alerts.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{ background: a.critical ? "#FBDADA" : GREEN_BG, borderRadius: 6, padding: "8px 12px", marginBottom: 6, fontSize: 13, color: a.critical ? RED : GREEN_TXT, fontWeight: 600 }}>
              {a.critical ? "⚠️ " : "ℹ️ "}{a.texto}
            </div>
          ))}
        </div>
      )}
      {estados.map(e => {
        const chartData = byEstado[e].map(r => ({ periodo: r.periodo, "N° proyectos": r.n, "Nuevos": r.nuevos }));
        const hasNuevos = byEstado[e].some(r => r.nuevos !== null && r.nuevos !== undefined);
        return (
          <div key={e} style={{ marginBottom: 18, border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: "10px 14px 4px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{e}</div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={LIGHTGRAY} />
                <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="N° proyectos" stroke={NAVY} strokeWidth={2} dot={{ r: 3 }} connectNulls />
                {hasNuevos && <Line type="monotone" dataKey="Nuevos" stroke={RED} strokeWidth={1.5} dot={{ r: 2 }} connectNulls />}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}

function IndicadoresEditor({ regionId, rows, fetcher, onChanged, tipo, vista, metas = [] }) {
  const [form, setForm] = useState({ programa: "PMU", real_tecnica: "", real_financiera: "", corte_fecha: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const filas = rows.filter(r => r.tipo === tipo && (r.vista || "mensual") === vista).sort((a, b) => new Date(b.corte_fecha) - new Date(a.corte_fecha));

  // Meta vigente (cargada una sola vez en "Metas de la región") para el programa elegido
  const metaVig = metas.find(m => m.programa === form.programa && m.tipo === tipo);
  const metaT = metaVig?.meta_tecnica ?? null;
  const metaF = tipo === "rendicion" ? (metaVig?.meta_financiera ?? null) : null;
  const faltaMeta = metaT == null || (tipo === "rendicion" && metaF == null);

  async function addRow() {
    if (!form.corte_fecha) return;
    setBusy(true); setErr(null);
    try {
      // La meta ya no se guarda en el registro: el panel la toma siempre de "Metas de la región"
      await fetcher.insertRow("indicadores_revision", {
        region_id: regionId, programa: form.programa, tipo, vista,
        meta_tecnica: null,
        real_tecnica: form.real_tecnica === "" ? null : Number(form.real_tecnica),
        meta_financiera: null,
        real_financiera: form.real_financiera === "" ? null : Number(form.real_financiera),
        corte_fecha: form.corte_fecha,
      });
      setForm({ ...form, real_tecnica: "", real_financiera: "", corte_fecha: "" });
      onChanged();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function removeRow(id) {
    try { await fetcher.deleteRow("indicadores_revision", id); onChanged(); }
    catch (e) { setErr(e.message); }
  }

  return (
    <div style={{ marginBottom: 16 }}>
      {err && <div style={{ color: RED, fontSize: 12, marginBottom: 8 }}>Error: {err}</div>}
      <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
        {filas.length === 0 && <div style={{ padding: 12, fontSize: 12.5, color: "#888" }}>Sin registros todavía.</div>}
        {filas.map(r => (
          <div key={r.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 10px", borderBottom: `1px solid ${LIGHTGRAY}`, fontSize: 12.5 }}>
            <span style={{ flex: 1, fontWeight: 700 }}>{r.programa}</span>
            <span style={{ flex: 1, color: "#666" }}>{fmtFecha(r.corte_fecha)}</span>
            <span style={{ flex: 1 }}>Téc — Meta: <b>{r.meta_tecnica ?? "—"}</b> · Real: <b>{r.real_tecnica ?? "—"}</b></span>
            {(r.meta_financiera != null || r.real_financiera != null) && (
              <span style={{ flex: 1 }}>Fin — Meta: <b>{r.meta_financiera ?? "—"}</b> · Real: <b>{r.real_financiera ?? "—"}</b></span>
            )}
            <button onClick={() => removeRow(r.id)} style={{ border: "none", background: "transparent", color: RED, cursor: "pointer" }}>✕</button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", background: LIGHTGRAY, padding: 10, borderRadius: 8 }}>
        <select value={form.programa} onChange={e => setForm({ ...form, programa: e.target.value })} style={{ padding: 5, borderRadius: 4, fontSize: 12 }}>
          <option value="PMU">PMU</option><option value="PMB">PMB</option>
        </select>
        <input type="date" value={form.corte_fecha} onChange={e => setForm({ ...form, corte_fecha: e.target.value })} style={{ padding: 5, borderRadius: 4, fontSize: 12, border: `1px solid ${GRAYBLUE}` }} />
        <input placeholder="Real téc." type="number" step="0.1" value={form.real_tecnica} onChange={e => setForm({ ...form, real_tecnica: e.target.value })} style={{ width: 75, padding: 5, borderRadius: 4, fontSize: 12, border: `1px solid ${GRAYBLUE}` }} />
        {tipo === "rendicion" && <>
          <input placeholder="Real fin." type="number" step="0.1" value={form.real_financiera} onChange={e => setForm({ ...form, real_financiera: e.target.value })} style={{ width: 75, padding: 5, borderRadius: 4, fontSize: 12, border: `1px solid ${GRAYBLUE}` }} />
        </>}
        <button onClick={addRow} disabled={busy || !form.corte_fecha} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: busy ? "white" : NAVY, color: busy ? "#999" : "white", fontWeight: 700, fontSize: 12, cursor: busy ? "default" : "pointer" }}>
          {busy ? "..." : "+ Agregar"}
        </button>
        <span style={{ fontSize: 11.5, color: faltaMeta ? RED : "#666", flexBasis: "100%" }}>
          {faltaMeta
            ? `Falta la meta de ${form.programa} (${tipo === "rendicion" ? "técnica y financiera" : "técnica"}): defínela arriba en "Metas de la región". Se guardará sin meta.`
            : `Meta aplicada automáticamente: téc. ${metaT}d${tipo === "rendicion" ? ` · fin. ${metaF}d` : ""}`}
        </span>
      </div>
    </div>
  );
}

// Metas fijas por región (se ingresan una sola vez): 2 de evaluación (PMU, PMB) + 4 de rendición (téc/fin × PMU/PMB)
const METAS_CAMPOS = [
  { key: "evaluacion|PMU|meta_tecnica", label: "Evaluación PMU" },
  { key: "evaluacion|PMB|meta_tecnica", label: "Evaluación PMB" },
  { key: "rendicion|PMU|meta_tecnica", label: "Rendición técnica PMU" },
  { key: "rendicion|PMB|meta_tecnica", label: "Rendición técnica PMB" },
  { key: "rendicion|PMU|meta_financiera", label: "Rendición financiera PMU" },
  { key: "rendicion|PMB|meta_financiera", label: "Rendición financiera PMB" },
];
function MetasEditor({ regionId, metas, fetcher, onChanged }) {
  const inicial = () => {
    const o = {};
    for (const c of METAS_CAMPOS) {
      const [tipo, programa, campo] = c.key.split("|");
      const m = metas.find(x => x.tipo === tipo && x.programa === programa);
      o[c.key] = m?.[campo] != null ? String(m[campo]) : "";
    }
    return o;
  };
  const [vals, setVals] = useState(inicial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => { setVals(inicial()); /* eslint-disable-next-line */ }, [regionId, metas]);
  const faltan = METAS_CAMPOS.filter(c => vals[c.key] === "").length;

  async function guardar() {
    setBusy(true); setMsg(null);
    try {
      // Una fila por (tipo, programa) con meta_tecnica y meta_financiera
      for (const tipo of ["evaluacion", "rendicion"]) for (const programa of ["PMU", "PMB"]) {
        const t = vals[`${tipo}|${programa}|meta_tecnica`];
        const f = tipo === "rendicion" ? vals[`${tipo}|${programa}|meta_financiera`] : "";
        const patch = { meta_tecnica: t === "" ? null : Number(t), meta_financiera: f === "" ? null : Number(f) };
        const filtro = `region_id=eq.${encodeURIComponent(regionId)}&programa=eq.${programa}&tipo=eq.${tipo}`;
        const upd = await fetcher.updateWhere("metas_revision", filtro, patch);
        if (!upd.length) await fetcher.insertRow("metas_revision", { region_id: regionId, programa, tipo, ...patch });
      }
      setMsg("Metas guardadas."); onChanged();
    } catch (e) { setMsg("Error: " + e.message); } finally { setBusy(false); }
  }
  const inp = { width: 70, padding: 5, borderRadius: 4, fontSize: 12, border: `1px solid ${GRAYBLUE}` };
  return (
    <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, marginBottom: 14, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "#EAF1F6", cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: NAVY }}>
        {open ? "▼" : "▶"} Metas de la región (se definen una sola vez){faltan > 0 && <span style={{ color: RED, fontWeight: 600 }}> · faltan {faltan} de 6</span>}
      </button>
      {open && (
        <div style={{ padding: 12 }}>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Días. Al agregar un indicador nuevo se usa esta meta automáticamente. Cambiar una meta aquí actualiza todos los meses de esta región, nuevos y antiguos.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
            {METAS_CAMPOS.map(c => (
              <label key={c.key} style={{ fontSize: 11.5, color: "#444", display: "flex", flexDirection: "column", gap: 3 }}>
                {c.label}
                <input type="number" step="0.1" value={vals[c.key]} onChange={e => setVals({ ...vals, [c.key]: e.target.value })} style={inp} />
              </label>
            ))}
            <button onClick={guardar} disabled={busy} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: busy ? "#ccc" : NAVY, color: "white", fontWeight: 700, fontSize: 12, cursor: busy ? "default" : "pointer" }}>{busy ? "..." : "Guardar metas"}</button>
          </div>
          {msg && <div style={{ fontSize: 12, marginTop: 8, color: msg.startsWith("Error") ? RED : "#2E7D32" }}>{msg}</div>}
        </div>
      )}
    </div>
  );
}

// Gráficos meta vs real: un cuadro por programa y tipo de plazo (técnico / financiero)
function GraficoMetas({ rows, tipo, vista, showFinanciera = false }) {
  const base = rows.filter(r => r.tipo === tipo && (r.vista || "mensual") === vista);
  const medidas = [["tecnica", "Técnica"], ...(showFinanciera ? [["financiera", "Financiera"]] : [])];
  const cuadros = [];
  for (const prog of ["PMU", "PMB"]) for (const [m, nombre] of medidas) {
    const serie = base.filter(r => r.programa === prog && r[`real_${m}`] != null)
      .sort((a, b) => new Date(a.corte_fecha) - new Date(b.corte_fecha))
      .map(r => ({ fecha: fmtFecha(r.corte_fecha), real: Number(r[`real_${m}`]), meta: r[`meta_${m}`] != null ? Number(r[`meta_${m}`]) : null }));
    cuadros.push({ prog, nombre, serie });
  }
  if (cuadros.every(c => c.serie.length === 0)) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: "#666", margin: "4px 0 8px" }}>Real vs meta, en días (línea punteada = meta; punto rojo = sobre la meta):</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 10 }}>
        {cuadros.map(c => {
          const ult = c.serie[c.serie.length - 1];
          const meta = ult?.meta;
          const brecha = ult && meta != null ? ult.real - meta : null;
          const sobre = brecha != null && brecha > 0;
          const meses = c.serie.filter(x => x.meta != null);
          const nSobre = meses.filter(x => x.real > x.meta).length;
          return (
            <div key={c.prog + c.nombre} style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: NAVY }}>{c.prog} · {c.nombre}</span>
                {ult && (brecha == null
                  ? <span style={{ fontSize: 11, color: "#888" }}>sin meta definida</span>
                  : <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 4, padding: "2px 8px", background: sobre ? "#FDE2E2" : GREEN_BG, color: sobre ? RED : GREEN_TXT }}>
                      {sobre ? `+${brecha.toFixed(1)}d sobre la meta` : brecha === 0 ? "en la meta" : `${Math.abs(brecha).toFixed(1)}d bajo la meta`}
                    </span>)}
              </div>
              {c.serie.length === 0 ? <div style={{ fontSize: 12, color: "#888", padding: "20px 0" }}>Sin registros.</div> : <>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>
                  {meses.length > 0 && `${nSobre} de ${meses.length} cortes sobre la meta · `}último: {ult.fecha}
                </div>
                <div style={{ width: "100%", height: 150 }}>
                  <ResponsiveContainer>
                    <LineChart data={c.serie} margin={{ top: 6, right: 12, left: -18, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="fecha" tick={{ fontSize: 9 }} interval="preserveStartEnd" minTickGap={24} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v, n) => [`${v}d`, n === "real" ? "Real" : "Meta"]} labelStyle={{ fontSize: 11 }} contentStyle={{ fontSize: 11 }} />
                      {meta != null && <ReferenceLine y={meta} stroke={TEAL} strokeDasharray="5 4" />}
                      <Line type="stepAfter" dataKey="meta" stroke={TEAL} strokeDasharray="5 4" dot={false} strokeWidth={1.5} isAnimationActive={false} connectNulls />
                      <Line type="monotone" dataKey="real" stroke={NAVY} strokeWidth={2} isAnimationActive={false}
                        dot={({ cx, cy, payload, index }) => <circle key={index} cx={cx} cy={cy} r={4} fill={payload.meta != null && payload.real > payload.meta ? RED : NAVY} stroke="white" strokeWidth={1} />} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Bloque plegable (cerrado por defecto) para el detalle/tabla de indicadores
function Plegable({ titulo, children, abiertoInicial = false }) {
  const [abierto, setAbierto] = useState(abiertoInicial);
  return (
    <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, marginBottom: 14, overflow: "hidden" }}>
      <button onClick={() => setAbierto(a => !a)} style={{ width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "#EAF1F6", cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: NAVY }}>
        {abierto ? "▼" : "▶"} {titulo}
      </button>
      {abierto && <div style={{ padding: 12 }}>{children}</div>}
    </div>
  );
}

function IralResumenEditor({ regionId, rows, fetcher, onChanged }) {
  const [form, setForm] = useState({ programa: "PMU", n_proyectos: "", monto: "", n_revision_urs: "", corte_fecha: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const filas = [...rows].sort((a, b) => new Date(b.corte_fecha) - new Date(a.corte_fecha));

  async function addRow() {
    if (!form.corte_fecha) return;
    setBusy(true); setErr(null);
    try {
      await fetcher.insertRow("iral_resumen", {
        region_id: regionId, programa: form.programa,
        n_proyectos: form.n_proyectos === "" ? null : Number(form.n_proyectos),
        monto: form.monto === "" ? null : Number(form.monto),
        n_revision_urs: form.n_revision_urs === "" ? null : Number(form.n_revision_urs),
        corte_fecha: form.corte_fecha,
      });
      setForm({ ...form, n_proyectos: "", monto: "", n_revision_urs: "", corte_fecha: "" });
      onChanged();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function removeRow(id) {
    try { await fetcher.deleteRow("iral_resumen", id); onChanged(); }
    catch (e) { setErr(e.message); }
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Editar / agregar cortes IRAL</div>
      {err && <div style={{ color: RED, fontSize: 12, marginBottom: 8 }}>Error: {err}</div>}
      <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
        {filas.length === 0 && <div style={{ padding: 12, fontSize: 12.5, color: "#888" }}>Sin registros todavía.</div>}
        {filas.map(r => (
          <div key={r.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 10px", borderBottom: `1px solid ${LIGHTGRAY}`, fontSize: 12.5 }}>
            <span style={{ flex: 1, fontWeight: 700 }}>{r.programa}</span>
            <span style={{ flex: 1, color: "#666" }}>{fmtFecha(r.corte_fecha)}</span>
            <span style={{ flex: 1 }}>N° proyectos: <b>{r.n_proyectos ?? "—"}</b></span>
            <span style={{ flex: 1 }}>Monto: <b>{r.monto != null ? fmtM(r.monto / 1000) + "M" : "—"}</b></span>
            <span style={{ flex: 1 }}>En Revisión URS: <b>{r.n_revision_urs ?? "—"}</b></span>
            <button onClick={() => removeRow(r.id)} style={{ border: "none", background: "transparent", color: RED, cursor: "pointer" }}>✕</button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", background: LIGHTGRAY, padding: 10, borderRadius: 8 }}>
        <select value={form.programa} onChange={e => setForm({ ...form, programa: e.target.value })} style={{ padding: 5, borderRadius: 4, fontSize: 12 }}>
          <option value="PMU">PMU (Tradicional)</option><option value="PMB">PMB Tradicional</option>
        </select>
        <input type="date" value={form.corte_fecha} onChange={e => setForm({ ...form, corte_fecha: e.target.value })} style={{ padding: 5, borderRadius: 4, fontSize: 12, border: `1px solid ${GRAYBLUE}` }} />
        <input placeholder="N° proyectos" type="number" value={form.n_proyectos} onChange={e => setForm({ ...form, n_proyectos: e.target.value })} style={{ width: 100, padding: 5, borderRadius: 4, fontSize: 12, border: `1px solid ${GRAYBLUE}` }} />
        <input placeholder="Monto ($)" type="number" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} style={{ width: 110, padding: 5, borderRadius: 4, fontSize: 12, border: `1px solid ${GRAYBLUE}` }} />
        <input placeholder="En Revisión URS" type="number" value={form.n_revision_urs} onChange={e => setForm({ ...form, n_revision_urs: e.target.value })} style={{ width: 110, padding: 5, borderRadius: 4, fontSize: 12, border: `1px solid ${GRAYBLUE}` }} />
        <button onClick={addRow} disabled={busy || !form.corte_fecha} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: busy ? "white" : NAVY, color: busy ? "#999" : "white", fontWeight: 700, fontSize: 12, cursor: busy ? "default" : "pointer" }}>
          {busy ? "..." : "+ Agregar"}
        </button>
      </div>
    </div>
  );
}

function ComparadorMeses({ rows, programa, tipo, vista, showFinanciera = false, compararActivo = true }) {
  const filas = rows.filter(r => r.programa === programa && r.tipo === tipo && (r.vista || "mensual") === vista).sort((a, b) => new Date(b.corte_fecha) - new Date(a.corte_fecha));
  const fechas = filas.map(r => r.corte_fecha);
  const [m1, setM1] = useState(fechas[1] || fechas[0] || "");
  const [m2, setM2] = useState(fechas[0] || "");

  useEffect(() => {
    if (!fechas.includes(m1)) setM1(fechas[1] || fechas[0] || "");
    if (!fechas.includes(m2)) setM2(fechas[0] || "");
    // eslint-disable-next-line
  }, [rows.length]);

  if (filas.length === 0) return <Pending text={`Sin registros de ${programa} (${vista}) para comparar.`} />;

  const r1 = filas.find(r => r.corte_fecha === m1);
  const r2 = filas.find(r => r.corte_fecha === m2);

  if (!compararActivo) {
    // Vista simple: solo el corte más reciente, sin comparación
    const latest = filas[0];
    return (
      <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 12, marginBottom: 10 }}>
        <div style={{ fontWeight: 700, color: NAVY, marginBottom: 8, fontSize: 13 }}>{programa} — {fmtFecha(latest.corte_fecha)}</div>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#999" }}>Técnica</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: NAVY }}>{latest.real_tecnica ?? "—"}d</div>
            <div style={{ fontSize: 11, color: "#666" }}>Meta {latest.meta_tecnica ?? "—"}d</div>
          </div>
          {showFinanciera && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "#999" }}>Financiera</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: NAVY }}>{latest.real_financiera ?? "—"}d</div>
              <div style={{ fontSize: 11, color: "#666" }}>Meta {latest.meta_financiera ?? "—"}d</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 12, marginBottom: 10 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, fontSize: 12.5 }}>
        <span style={{ fontWeight: 700, color: NAVY }}>{programa}</span>
        <span>Comparar:</span>
        <select value={m1} onChange={e => setM1(e.target.value)} style={{ padding: 4, borderRadius: 4 }}>
          {fechas.map(f => <option key={f} value={f}>{fmtFecha(f)}</option>)}
        </select>
        <span>vs.</span>
        <select value={m2} onChange={e => setM2(e.target.value)} style={{ padding: 4, borderRadius: 4 }}>
          {fechas.map(f => <option key={f} value={f}>{fmtFecha(f)}</option>)}
        </select>
      </div>
      {r1 && r2 ? (
        <div>
          <div style={{ display: "flex", gap: 20, marginBottom: showFinanciera ? 10 : 0 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "#999" }}>Técnica — {fmtFecha(m1)}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{r1.real_tecnica ?? "—"}d</div>
              <div style={{ fontSize: 11, color: "#666" }}>Meta {r1.meta_tecnica ?? "—"}d</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "#999" }}>Técnica — {fmtFecha(m2)}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{r2.real_tecnica ?? "—"}d</div>
              <div style={{ fontSize: 11, color: "#666" }}>Meta {r2.meta_tecnica ?? "—"}d</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "#999" }}>Variación técnica</div>
              {r1.real_tecnica !== null && r2.real_tecnica !== null ? <DeltaBadge curr={r2.real_tecnica} prev={r1.real_tecnica} currDate={m2} prevDate={m1} /> : "—"}
            </div>
          </div>
          {showFinanciera && (
            <div style={{ display: "flex", gap: 20, borderTop: `1px solid ${LIGHTGRAY}`, paddingTop: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "#999" }}>Financiera — {fmtFecha(m1)}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{r1.real_financiera ?? "—"}d</div>
                <div style={{ fontSize: 11, color: "#666" }}>Meta {r1.meta_financiera ?? "—"}d</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "#999" }}>Financiera — {fmtFecha(m2)}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{r2.real_financiera ?? "—"}d</div>
                <div style={{ fontSize: 11, color: "#666" }}>Meta {r2.meta_financiera ?? "—"}d</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "#999" }}>Variación financiera</div>
                {r1.real_financiera !== null && r2.real_financiera !== null ? <DeltaBadge curr={r2.real_financiera} prev={r1.real_financiera} currDate={m2} prevDate={m1} /> : "—"}
              </div>
            </div>
          )}
        </div>
      ) : <div style={{ fontSize: 12, color: "#888" }}>Elige dos meses con datos.</div>}
    </div>
  );
}

function CarteraCriticaEditor({ regionId, rows, fetcher, onChanged }) {
  const [form, setForm] = useState({ comuna_proyecto: "", descripcion: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function addRow() {
    if (!form.comuna_proyecto.trim() || !form.descripcion.trim()) return;
    setBusy(true); setErr(null);
    try {
      await fetcher.insertRow("cartera_critica", { region_id: regionId, comuna_proyecto: form.comuna_proyecto, descripcion: form.descripcion });
      setForm({ comuna_proyecto: "", descripcion: "" });
      onChanged();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function updateField(id, field, value) {
    try { await fetcher.updateRow("cartera_critica", id, { [field]: value, updated_at: new Date().toISOString() }); onChanged(); }
    catch (e) { setErr(e.message); }
  }
  async function removeRow(id) {
    try { await fetcher.deleteRow("cartera_critica", id); onChanged(); }
    catch (e) { setErr(e.message); }
  }

  return (
    <div>
      {err && <div style={{ color: RED, fontSize: 12, marginBottom: 8 }}>Error: {err}</div>}
      <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, overflow: "hidden" }}>
        {rows.length === 0 && <div style={{ padding: 14, fontSize: 13, color: "#888" }}>Sin nudos críticos registrados todavía.</div>}
        {rows.map((c) => (
          <div key={c.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 12px", borderBottom: `1px solid ${LIGHTGRAY}`, fontSize: 13 }}>
            <input defaultValue={c.comuna_proyecto} onBlur={(e) => e.target.value !== c.comuna_proyecto && updateField(c.id, "comuna_proyecto", e.target.value)}
              placeholder="Comuna / proyecto" style={{ flex: 1, border: "1px solid transparent", padding: 4, borderRadius: 4, fontWeight: 700 }} onFocus={(e) => e.target.style.border = `1px solid ${LIGHTGRAY}`} />
            <textarea defaultValue={c.descripcion} onBlur={(e) => e.target.value !== c.descripcion && updateField(c.id, "descripcion", e.target.value)}
              placeholder="Descripción del nudo crítico" rows={2} style={{ flex: 3, border: "1px solid transparent", padding: 4, borderRadius: 4, fontFamily: "Arial", resize: "vertical" }} onFocus={(e) => e.target.style.border = `1px solid ${LIGHTGRAY}`} />
            <button onClick={() => removeRow(c.id)} title="Eliminar" style={{ border: "none", background: "transparent", color: RED, cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, padding: 12, background: LIGHTGRAY, borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: NAVY_SOFT, marginBottom: 8 }}>Agregar nudo crítico (máx. 3 recomendado)</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input placeholder="Comuna / proyecto" value={form.comuna_proyecto} onChange={e => setForm({ ...form, comuna_proyecto: e.target.value })}
            style={{ flex: 1, minWidth: 150, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <input placeholder="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
            style={{ flex: 3, minWidth: 200, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <button onClick={addRow} disabled={busy || !form.comuna_proyecto.trim() || !form.descripcion.trim()}
            style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: busy ? LIGHTGRAY : NAVY, color: "white", fontWeight: 700, fontSize: 13, cursor: busy ? "default" : "pointer" }}>
            {busy ? "Guardando…" : "+ Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProyectosPriorizadosEditor({ regionId, rows, fetcher, onChanged }) {
  const [form, setForm] = useState({ comuna: "", nombre_proyecto: "", justificacion: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function addRow() {
    if (!form.comuna.trim() || !form.nombre_proyecto.trim()) return;
    setBusy(true); setErr(null);
    try {
      await fetcher.insertRow("proyectos_priorizados", { region_id: regionId, comuna: form.comuna, nombre_proyecto: form.nombre_proyecto, justificacion: form.justificacion || null });
      setForm({ comuna: "", nombre_proyecto: "", justificacion: "" });
      onChanged();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function updateField(id, field, value) {
    try { await fetcher.updateRow("proyectos_priorizados", id, { [field]: value, updated_at: new Date().toISOString() }); onChanged(); }
    catch (e) { setErr(e.message); }
  }
  async function removeRow(id) {
    try { await fetcher.deleteRow("proyectos_priorizados", id); onChanged(); }
    catch (e) { setErr(e.message); }
  }

  return (
    <div>
      {err && <div style={{ color: RED, fontSize: 12, marginBottom: 8 }}>Error: {err}</div>}
      <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
        Proyectos sin financiamiento aún, que el/la jefe/a URS considera urgente priorizar.
      </div>
      <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, overflow: "hidden" }}>
        {rows.length === 0 && <div style={{ padding: 14, fontSize: 13, color: "#888" }}>Sin proyectos priorizados todavía.</div>}
        {rows.map((p) => (
          <div key={p.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 12px", borderBottom: `1px solid ${LIGHTGRAY}`, fontSize: 13 }}>
            <input defaultValue={p.comuna} onBlur={(e) => e.target.value !== p.comuna && updateField(p.id, "comuna", e.target.value)}
              placeholder="Comuna" style={{ flex: 1, border: "1px solid transparent", padding: 4, borderRadius: 4, fontWeight: 700 }} onFocus={(e) => e.target.style.border = `1px solid ${LIGHTGRAY}`} />
            <input defaultValue={p.nombre_proyecto} onBlur={(e) => e.target.value !== p.nombre_proyecto && updateField(p.id, "nombre_proyecto", e.target.value)}
              placeholder="Nombre del proyecto" style={{ flex: 2, border: "1px solid transparent", padding: 4, borderRadius: 4 }} onFocus={(e) => e.target.style.border = `1px solid ${LIGHTGRAY}`} />
            <textarea defaultValue={p.justificacion || ""} onBlur={(e) => e.target.value !== p.justificacion && updateField(p.id, "justificacion", e.target.value)}
              placeholder="Por qué es urgente" rows={2} style={{ flex: 3, border: "1px solid transparent", padding: 4, borderRadius: 4, fontFamily: "Arial", resize: "vertical" }} onFocus={(e) => e.target.style.border = `1px solid ${LIGHTGRAY}`} />
            <button onClick={() => removeRow(p.id)} title="Eliminar" style={{ border: "none", background: "transparent", color: RED, cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, padding: 12, background: LIGHTGRAY, borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: NAVY_SOFT, marginBottom: 8 }}>Agregar proyecto priorizado</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input placeholder="Comuna" value={form.comuna} onChange={e => setForm({ ...form, comuna: e.target.value })}
            style={{ flex: 1, minWidth: 130, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <input placeholder="Nombre del proyecto" value={form.nombre_proyecto} onChange={e => setForm({ ...form, nombre_proyecto: e.target.value })}
            style={{ flex: 2, minWidth: 180, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <input placeholder="Justificación (por qué urgente)" value={form.justificacion} onChange={e => setForm({ ...form, justificacion: e.target.value })}
            style={{ flex: 3, minWidth: 200, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <button onClick={addRow} disabled={busy || !form.comuna.trim() || !form.nombre_proyecto.trim()}
            style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: busy ? LIGHTGRAY : NAVY, color: "white", fontWeight: 700, fontSize: 13, cursor: busy ? "default" : "pointer" }}>
            {busy ? "Guardando…" : "+ Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RegionPanel({ data, fetcher, regionId, onDataChanged }) {
  const [tab, setTab] = useState("resumen");
  const [soloPmuPmb, setSoloPmuPmb] = useState(false);
  // Orden de la tabla de comunas: col = índice del dato (0 comuna, 1 transferido, 2 saldo, 3 %deuda, 4 n° numerador, 5 n° denominador, 6 per cápita)
  const [ordenCom, setOrdenCom] = useState({ col: 1, dir: "desc" });
  const [vista7a, setVista7a] = useState("mensual");
  const [vista7b, setVista7b] = useState("mensual");
  const [compararMeses, setCompararMeses] = useState(true);
  const tabs = [
    ["resumen", "Resumen"],
    ["s2", "2. Rendición"],
    ["s3", "3. Cartera crítica"],
    ["s4", "4. Acuerdos"],
    ["s5", "5. Cobertura"],
    ["s6", "6. Viáticos"],
    ["s7", "7. Plazos revisión"],
    ["s8", "8. Deuda flotante"],
    ["s9", "9. Levantamiento"],
    ["s10", "10. IRAL"],
    ["s11", "11. Evolución"],
    ["s12", "12. Priorizados URS"],
  ];

  const comunasActivas = (soloPmuPmb ? data.comunasPmuPmb : data.comunasTodos) || [];

  const totalComunal = useMemo(() => {
    const t = comunasActivas.reduce((a, c) => a + c[1], 0);
    const s = comunasActivas.reduce((a, c) => a + c[2], 0);
    return { t, s, pct: t ? (s / t) * 100 : 0 };
  }, [comunasActivas]);

  const rankedComunas = useMemo(() => [...comunasActivas].sort((a, b) => b[1] - a[1]), [comunasActivas]);

  const percapitaDe = (c) => {
    const v = data.percapita ? data.percapita[String(c[0]).toUpperCase()] : null;
    return v === null || v === undefined || v === "" ? null : Number(v);
  };
  const comunasOrdenadas = useMemo(() => {
    const { col, dir } = ordenCom;
    const val = (c) => (col === 6 ? percapitaDe(c) : c[col]);
    const mult = dir === "asc" ? 1 : -1;
    return [...comunasActivas].sort((a, b) => {
      const x = val(a), y = val(b);
      const nx = x === null || x === undefined, ny = y === null || y === undefined;
      if (nx && ny) return 0;
      if (nx) return 1;   // los sin dato siempre al final
      if (ny) return -1;
      if (col === 0) return mult * String(x).localeCompare(String(y), "es");
      return mult * (Number(x) - Number(y));
    });
    // eslint-disable-next-line
  }, [comunasActivas, ordenCom, data.percapita]);
  const cambiarOrden = (col) => setOrdenCom(o => o.col === col ? { col, dir: o.dir === "asc" ? "desc" : "asc" } : { col, dir: col === 0 ? "asc" : "desc" });
  const CabeceraOrden = ({ col, children }) => (
    <button onClick={() => cambiarOrden(col)} title="Ordenar" style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 600, fontSize: 12, color: "white" }}>
      {children}<span style={{ opacity: ordenCom.col === col ? 1 : 0.45, fontSize: 10 }}>{ordenCom.col === col ? (ordenCom.dir === "asc" ? "▲" : "▼") : "⇅"}</span>
    </button>
  );

  return (
    <div>
      {/* Header region */}
      <div style={{ background: NAVY, borderRadius: 10, padding: "18px 22px", color: "white", marginBottom: 18, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1 }}>REGIÓN</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{data.label}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1 }}>JEFE/A URS</div>
          <div style={{ fontSize: 14, fontWeight: 600, maxWidth: 320, color: data.jefeConfianza !== "Seguro" ? "#FFE8A3" : "white" }}>
            {data.jefeUrs} {data.jefeConfianza !== "Seguro" && "⚠️"}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1 }}>CICLO</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{data.ciclo}</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{totalComunal.pct.toFixed(1)}%</div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>deuda rendición</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{fmtM(totalComunal.s)}M</div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>saldo pendiente</div>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            border: "none", cursor: "pointer", padding: "7px 12px", borderRadius: 6, fontSize: 12.5, fontWeight: 600,
            background: tab === key ? TEAL : LIGHTGRAY, color: tab === key ? "white" : NAVY_SOFT,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ paddingTop: 8 }}>
        {tab === "resumen" && (
          <div>
            <SectionTitle n="" title="Vista rápida" />
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200, border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 12, color: "#666" }}>Top urgencia rendición</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: RED }}>{rankedComunas[0][0]}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{fmtM(rankedComunas[0][2])}M pendiente</div>
              </div>
            </div>
            {data.primeraVez && (
              <div style={{ marginTop: 14 }}>
                <Pending text="Primera bilateral de esta región — S1, S3, S5, S6, S8, S10, S11 aún sin completar." />
              </div>
            )}
          </div>
        )}

        {tab === "s2" && (
          <div>
            <SectionTitle n="2" title="Cuadro de mando presupuestario y rendiciones" />

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, background: LIGHTGRAY, padding: "8px 12px", borderRadius: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: NAVY_SOFT }}>Vista:</span>
              <button onClick={() => setSoloPmuPmb(false)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer", background: !soloPmuPmb ? NAVY : "white", color: !soloPmuPmb ? "white" : NAVY }}>
                Todos los programas
              </button>
              <button onClick={() => setSoloPmuPmb(true)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer", background: soloPmuPmb ? NAVY : "white", color: soloPmuPmb ? "white" : NAVY }}>
                Solo PMU / PMB
              </button>
              {soloPmuPmb && (!data.comunasPmuPmb || data.comunasPmuPmb.length === 0) && (
                <span style={{ fontSize: 11.5, color: RED, marginLeft: 6 }}>⚠️ Sin datos PMU/PMB cargados para esta región todavía.</span>
              )}
            </div>
            {data.comunasTodos && data.comunasTodos.length > 0 && (
              <div style={{ fontSize: 11.5, color: "#666", marginBottom: 10 }}>
                Fuente: Sheet "Deuda Rendición" (Saldo Por Rendir / Fecha Fin de Actividades / Programa){data.comunasCorteFecha ? `, corte ${fmtFecha(data.comunasCorteFecha)}` : ""}. Numerador = saldo con Fecha Fin de Actividades vencida y saldo &gt; 0{soloPmuPmb ? " (solo PMU/PMB)" : " (todos los programas)"}; denominador = transferido de todos los proyectos{soloPmuPmb ? " PMU/PMB" : ""} de la región (vigentes + vencidos).
              </div>
            )}

            {data.s2regional && (
              <>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Nivel regional — evolución de cortes</div>
                <Table headers={["Corte", "Transferido ($M)", "Pendiente rendición ($M)", "% Deuda"]}
                  rows={data.s2regional.map(r => [fmtFecha(r.corte), fmtM(r.transferido), fmtM(r.pendiente), <span style={{ color: pctColor(r.pct), fontWeight: 700 }}>{r.pct.toFixed(1)}%</span>])} />
                <div style={{ height: 16 }} />
              </>
            )}
            <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
              Nivel comunal — haz clic en el encabezado de una columna para ordenar de mayor a menor (o al revés al volver a hacer clic). Orden inicial: monto transferido, de mayor a menor.
            </div>
            <Table headers={[
                "#",
                <CabeceraOrden col={0}>Comuna</CabeceraOrden>,
                <CabeceraOrden col={1}>Transferido ($M)</CabeceraOrden>,
                <CabeceraOrden col={2}>Saldo pendiente ($M)</CabeceraOrden>,
                <CabeceraOrden col={3}>% Deuda</CabeceraOrden>,
                <CabeceraOrden col={4}>N° proy. numerador</CabeceraOrden>,
                <CabeceraOrden col={5}>N° proy. denominador</CabeceraOrden>,
                <CabeceraOrden col={6}>Aporte per cápita (2021-2026)</CabeceraOrden>,
              ]}
              rows={comunasOrdenadas.map((c, i) => {
                const pc = percapitaDe(c);
                return [i + 1, c[0], fmtM(c[1]), fmtM(c[2]), <span style={{ color: pctColor(c[3]) }}>{c[3].toFixed(2)}%</span>, c[4] ?? "—", c[5] ?? "—", pc ? "$" + Math.round(pc).toLocaleString("es-CL") : "—"];
              })} />
          </div>
        )}

        {tab === "s3" && (
          <div>
            <SectionTitle n="3" title="Cartera estratégica y nudos críticos" />
            <CarteraCriticaEditor regionId={regionId} rows={data.s3data || []} fetcher={fetcher} onChanged={onDataChanged} />
          </div>
        )}

        {tab === "s4" && (
          <div>
            <SectionTitle n="4" title="Acuerdos y compromisos" />
            <AcuerdosEditor regionId={regionId} rows={data.s4data || []} fetcher={fetcher} onChanged={onDataChanged} />
          </div>
        )}

        {tab === "s5" && (
          <div>
            <SectionTitle n="5" title="Cobertura territorial — recorrido de comunas" />
            <CoberturaEditor regionId={regionId} rows={data.s5data || []} fetcher={fetcher} onChanged={onDataChanged}
              comunasCanonicas={[...new Set((data.comunasTodos || []).map(c => c[0]))].sort()} />
          </div>
        )}

        {tab === "s6" && (
          <div>
            <SectionTitle n="6" title="Viáticos — jefe/a URS y equipo" />
            {data.s6 ? (
              <div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                  Fuente: Estado de Ejecución del Gasto — Comisiones de Servicio, período {fmtFechasEnTexto(fmtFecha(data.s6.periodo))}.
                </div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
                  <div style={{ flex: 1, minWidth: 160, border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 14 }}>
                    <div style={{ fontSize: 11, color: "#666" }}>Presupuesto vigente</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{fmtM((data.s6.presupuestoVigente || 0) / 1000)}M</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 160, border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 14 }}>
                    <div style={{ fontSize: 11, color: "#666" }}>Ejecutado a la fecha</div>
                    {data.s6.montoTotal === null || data.s6.montoTotal === undefined ? (
                      <div style={{ fontSize: 13, fontWeight: 700, color: AMBER_TXT }}>Dato pendiente</div>
                    ) : (
                      <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{fmtM(data.s6.montoTotal / 1000)}M</div>
                    )}
                    <div style={{ fontSize: 11, color: "#666" }}>{data.s6.nViaticos === null || data.s6.nViaticos === undefined ? "N° de viáticos: dato pendiente" : `${data.s6.nViaticos} viáticos`}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 160, border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 14 }}>
                    <div style={{ fontSize: 11, color: "#666" }}>% ejecución regional</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: pctColor(data.s6.pctEjecucionRegional) }}>{data.s6.pctEjecucionRegional?.toFixed(2)}%</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 160, border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 14 }}>
                    <div style={{ fontSize: 11, color: "#666" }}>Disponible</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: GREEN_TXT }}>{fmtM((data.s6.presupuestoDisponible || 0) / 1000)}M</div>
                  </div>
                </div>

                {data.s6mensual && data.s6mensual.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Ejecución por período (2026)</div>
                    <Table headers={["Período", "Monto ejecutado ($M)"]}
                      rows={data.s6mensual.map(m => [m.periodo, fmtM(m.monto / 1000)])} />
                  </div>
                )}

                {data.s6funcionarios && data.s6funcionarios.length > 0 ? (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Detalle por funcionario (quienes aparecen en el top 10 nacional URS)</div>
                    <Table headers={["Funcionario", "Monto ($M)", "N° viáticos", "Rol"]}
                      rows={data.s6funcionarios.map(f => [f.nombre, fmtM(f.monto / 1000), f.n, f.esJefe ? <Pill tone="good">Jefe/a URS</Pill> : "Equipo"])} />
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: "#999", marginBottom: 10 }}>
                    Nadie de esta región aparece individualizado en el top 10 nacional del reporte — solo se dispone del monto agregado del equipo completo.
                  </div>
                )}
                <Pending text="El reporte fuente solo individualiza al top 10 nacional de gasto — el resto del equipo queda dentro del monto agregado, sin desglose por persona." />
              </div>
            ) : <Pending text="Sin fuente automatizada para esta región." />}
          </div>
        )}

        {tab === "s7" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, background: "#EAF1F6", padding: "8px 12px", borderRadius: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: NAVY_SOFT }}>Comparar meses:</span>
              <button onClick={() => setCompararMeses(true)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer", background: compararMeses ? NAVY : "white", color: compararMeses ? "white" : NAVY }}>Activado</button>
              <button onClick={() => setCompararMeses(false)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer", background: !compararMeses ? NAVY : "white", color: !compararMeses ? "white" : NAVY }}>Desactivado (solo mes actual)</button>
            </div>

            <MetasEditor regionId={regionId} metas={data.s7metas || []} fetcher={fetcher} onChanged={onDataChanged} />

            <SectionTitle n="7A" title="Tiempo de evaluación de proyectos (pre-aprobación)" />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, background: LIGHTGRAY, padding: "8px 12px", borderRadius: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: NAVY_SOFT }}>Vista:</span>
              <button onClick={() => setVista7a("mensual")} style={{ padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer", background: vista7a === "mensual" ? NAVY : "white", color: vista7a === "mensual" ? "white" : NAVY }}>Mensual</button>
              <button onClick={() => setVista7a("acumulado")} style={{ padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer", background: vista7a === "acumulado" ? NAVY : "white", color: vista7a === "acumulado" ? "white" : NAVY }}>Acumulado</button>
            </div>
            <ComparadorMeses rows={data.s7raw || []} programa="PMU" tipo="evaluacion" vista={vista7a} showFinanciera={false} compararActivo={compararMeses} />
            <ComparadorMeses rows={data.s7raw || []} programa="PMB" tipo="evaluacion" vista={vista7a} showFinanciera={false} compararActivo={compararMeses} />
            <GraficoMetas rows={data.s7raw || []} tipo="evaluacion" vista={vista7a} showFinanciera={false} />
            <Plegable titulo={`Detalle de indicadores de evaluación — vista ${vista7a} (ver / agregar / borrar registros)`}>
              <IndicadoresEditor regionId={regionId} rows={data.s7raw || []} fetcher={fetcher} onChanged={onDataChanged} tipo="evaluacion" vista={vista7a} metas={data.s7metas || []} />
            </Plegable>

            <SectionTitle n="7B" title="Tiempo de revisión de rendición (post-transferencia)" />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, background: LIGHTGRAY, padding: "8px 12px", borderRadius: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: NAVY_SOFT }}>Vista:</span>
              <button onClick={() => setVista7b("mensual")} style={{ padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer", background: vista7b === "mensual" ? NAVY : "white", color: vista7b === "mensual" ? "white" : NAVY }}>Mensual</button>
              <button onClick={() => setVista7b("acumulado")} style={{ padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer", background: vista7b === "acumulado" ? NAVY : "white", color: vista7b === "acumulado" ? "white" : NAVY }}>Acumulado</button>
            </div>
            <ComparadorMeses rows={data.s7raw || []} programa="PMU" tipo="rendicion" vista={vista7b} showFinanciera={true} compararActivo={compararMeses} />
            <ComparadorMeses rows={data.s7raw || []} programa="PMB" tipo="rendicion" vista={vista7b} showFinanciera={true} compararActivo={compararMeses} />
            <GraficoMetas rows={data.s7raw || []} tipo="rendicion" vista={vista7b} showFinanciera={true} />
            <Plegable titulo={`Detalle de indicadores de rendición — vista ${vista7b} (ver / agregar / borrar registros)`}>
              <IndicadoresEditor regionId={regionId} rows={data.s7raw || []} fetcher={fetcher} onChanged={onDataChanged} tipo="rendicion" vista={vista7b} metas={data.s7metas || []} />
            </Plegable>
          </div>
        )}

        {tab === "s8" && (
          <div>
            <SectionTitle n="8" title="Gestión de deuda flotante / remesas pendientes" />
            {data.s8 ? (
              <div>
                <Table headers={["Categoría", "N° expedientes", "Monto ($M)"]}
                  rows={[
                    [<strong>En bandeja URS (pendiente revisión)</strong>, <strong>{data.s8.bandejaUrs}</strong>, <strong>{fmtM(data.s8.bandejaMonto)}</strong>],
                    ["   de las cuales: remesas 2ª cuota", data.s8.segundasCuota, fmtM(data.s8.segundasMonto)],
                    ["Ya pagadas", data.s8.pagadas, "—"],
                    ["En bandeja analista nivel central", data.s8.analista, "—"],
                    ["Sin bandeja registrada", data.s8.sinBandeja, "—"],
                  ]} />
                {data.s8.anomalia && <div style={{ marginTop: 10 }}><Pill tone="bad">⚠️ Anomalía</Pill><p style={{ fontSize: 12, color: RED, marginTop: 6 }}>{data.s8.anomalia}</p></div>}

                {data.deudaDetalle && data.deudaDetalle.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Expedientes pendientes de transferir, en bandeja URS</div>
                    <Table headers={["Expediente", "Comuna", "Proyecto", "Código", "Programa", "Monto ($M)", "2ª cuota"]}
                      rows={data.deudaDetalle.map(d => [d.expediente || "—", d.comuna, d.nombre_proyecto || <span style={{ color: "#999" }}>(sin nombre — código: {d.codigo_proyecto || "—"})</span>, d.codigo_proyecto || "—", d.programa || "—", fmtM(d.monto / 1e6), d.segunda_cuota ? <Pill tone="warn">Sí</Pill> : "No"])} />
                  </div>
                )}
              </div>
            ) : <Pending text="Falta CSV de la hoja 'DF P03 Priorización' filtrado a esta región." />}
          </div>
        )}

        {tab === "s9" && (
          <div>
            <SectionTitle n="9" title="Radar de proyectos por mes (No Elegibles / Elegibles / Asignados / Transferidos / En Cierre / Cerrados)" />
            <RadarProyectos rows={data.s9radar} />
          </div>
        )}

        {tab === "s10" && (
          <div>
            <SectionTitle n="10" title="IRAL — proyectos presentados por comuna" />
            {data.s10 ? (
              <div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
                  Resumen con el corte más reciente cargado por programa (ver abajo para editar u otros cortes).
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8 }}>ALERTAS</div>
                  {data.s10.resumen.map((r, i) => (
                    <div key={i} style={{ background: LIGHTGRAY, borderRadius: 6, padding: "8px 12px", marginBottom: 6, fontSize: 13, color: NAVY_SOFT }}>
                      {r.n} proyectos acumulados postulados por la línea {r.programa === "PMU" ? "Tradicional (PMU)" : "PMB Tradicional"} (corte {fmtFecha(r.corteFecha)}) → {r.revision} {r.revision === 1 ? "se encuentra" : "se encuentran"} en Revisión URS
                    </div>
                  ))}
                  {data.s10.nuevos.map((n, i) => (
                    <div key={"n" + i} style={{ background: GREEN_BG, borderRadius: 6, padding: "8px 12px", marginBottom: 6, fontSize: 13, color: GREEN_TXT, fontWeight: 600 }}>
                      ℹ️ Proyecto IRAL nuevo: {n.comuna} — {n.programa} — {fmtM(n.monto / 1000)}M ({n.idp})
                    </div>
                  ))}
                  {data.s10.nuevos.length === 0 && (
                    <div style={{ background: LIGHTGRAY, borderRadius: 6, padding: "8px 12px", fontSize: 13, color: "#888" }}>
                      Sin proyectos IRAL nuevos registrados.
                    </div>
                  )}
                </div>
                <Table headers={["Programa", "N° proyectos", "Monto", "Corte"]}
                  rows={data.s10.resumen.map(r => [r.programa === "PMU" ? "PMU Tradicional" : "PMB Tradicional", r.n, fmtM(r.monto / 1000) + "M", fmtFecha(r.corteFecha)])} />
              </div>
            ) : <Pending text="Sin fuente identificada para esta región." />}
            <div style={{ height: 18 }} />
            <IralResumenEditor regionId={regionId} rows={data.s10raw || []} fetcher={fetcher} onChanged={onDataChanged} />
          </div>
        )}

        {tab === "s11" && (
          <div>
            <SectionTitle n="11" title="Evolución regional" />
            {data.s11 ? (
              <Table headers={["Indicador", "Corte anterior", "Corte actual", "Variación"]}
                rows={[
                  ["Proyectos cerrados (acum.)", data.s11.cerrados[0], data.s11.cerrados[1], <span style={{ color: GREEN_TXT, fontWeight: 700 }}>▲ +{data.s11.cerrados[1] - data.s11.cerrados[0]}</span>],
                  ["Proyectos nuevos postulados", data.s11.postulados[0], data.s11.postulados[1], <span style={{ color: GREEN_TXT, fontWeight: 700 }}>▲ +{data.s11.postulados[1] - data.s11.postulados[0]}</span>],
                  ["Monto transferido ($M)", fmtM(data.s11.transferido[0]), fmtM(data.s11.transferido[1]), <span style={{ color: RED, fontWeight: 700 }}>▼ {fmtM(data.s11.transferido[1] - data.s11.transferido[0])}</span>],
                  ["% deuda rendición", data.s11.pct[0] + "%", data.s11.pct[1] + "%", <span style={{ color: GREEN_TXT, fontWeight: 700 }}>▼ mejora</span>],
                ]} />
            ) : <Pending text="Primera bilateral: sin corte anterior para comparar." />}
          </div>
        )}

        {tab === "s12" && (
          <div>
            <SectionTitle n="12" title="Proyectos priorizados por el/la jefe/a URS" />
            <ProyectosPriorizadosEditor regionId={regionId} rows={data.priorizados || []} fetcher={fetcher} onChanged={onDataChanged} />
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Cliente mínimo vía fetch (sin librería externa) ----------
function makeSupabaseFetcher(url, key) {
  // Normaliza la URL: acepta tanto "https://xxx.supabase.co" como
  // "https://xxx.supabase.co/rest/v1" (con o sin barra final) — evita el error
  // "Invalid path specified" por duplicar /rest/v1 si el usuario ya lo incluyó.
  const base = url.trim().replace(/\/+$/, "").replace(/\/rest\/v1$/i, "");
  const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

  // Lee la tabla completa por tramos de 1.000 filas (Supabase corta cada respuesta en 1.000)
  async function fetchTable(table, order) {
    const PAGE = 1000;
    let todo = [];
    for (let off = 0; off < 500000; off += PAGE) {
      const res = await fetch(`${base}/rest/v1/${table}?select=*${order ? `&order=${order}` : ""}&limit=${PAGE}&offset=${off}`, { headers });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${table}: HTTP ${res.status} ${text.slice(0, 200)}`);
      }
      const parte = await res.json();
      todo = todo.concat(parte);
      if (parte.length < PAGE) break;
    }
    return todo;
  }
  async function insertMany(table, rows) {
    const res = await fetch(`${base}/rest/v1/${table}`, {
      method: "POST", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify(rows),
    });
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  }

  async function insertRow(table, row) {
    const res = await fetch(`${base}/rest/v1/${table}`, {
      method: "POST", headers: { ...headers, Prefer: "return=representation" }, body: JSON.stringify(row),
    });
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
    return res.json();
  }

  async function updateRow(table, id, patch) {
    const res = await fetch(`${base}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH", headers: { ...headers, Prefer: "return=representation" }, body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
    return res.json();
  }

  async function updateWhere(table, filter, patch) {
    const res = await fetch(`${base}/rest/v1/${table}?${filter}`, {
      method: "PATCH", headers: { ...headers, Prefer: "return=representation" }, body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
    return res.json();
  }

  async function deleteRow(table, id) {
    const res = await fetch(`${base}/rest/v1/${table}?id=eq.${id}`, { method: "DELETE", headers });
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  }

  return { fetchTable, insertRow, insertMany, updateRow, updateWhere, deleteRow };
}

// ---------- Carga de datos desde Supabase (reemplaza el REGIONS hardcodeado) ----------
// Cada tabla se carga de forma independiente: si una falla (ej. deuda_flotante,
// que es opcional en la mayoría de las regiones), las demás igual se muestran.
function useRegionsFromSupabase(fetcher, enabled, refreshKey) {
  const [regions, setRegions] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !fetcher) return;
    // No reseteamos 'regions' a null aquí: si es un refresh (tras editar), mantenemos
    // los datos actuales en pantalla mientras llega lo nuevo, para no desmontar
    // RegionPanel y perder en qué pestaña/región estaba el usuario.
    setError(null);
    setWarnings([]);
    async function safeFetch(table) {
      try {
        return await fetcher.fetchTable(table);
      } catch (e) {
        return { __error: e.message || String(e), __table: table };
      }
    }
    async function load() {
      try {
        const results = await Promise.all([
          safeFetch("regiones"),
          safeFetch("comunas_rendicion"),
          safeFetch("indicadores_revision"),
          safeFetch("deuda_flotante"),
          safeFetch("capacidad_cartera"),
          safeFetch("viaticos"),
          safeFetch("viaticos_mensual"),
          safeFetch("viaticos_funcionario"),
          safeFetch("acuerdos_compromisos"),
          safeFetch("cobertura_visitas"),
          safeFetch("estado_proyectos_mensual"),
          safeFetch("iral_resumen"),
          safeFetch("iral_nuevos"),
          safeFetch("cartera_critica"),
          safeFetch("aporte_percapita"),
          safeFetch("deuda_flotante_detalle"),
          safeFetch("proyectos_priorizados"),
          safeFetch("metas_revision"),
        ]);
        const warns = [];
        const clean = results.map((r) => {
          if (r && r.__error) { warns.push(`${r.__table}: ${r.__error}`); return []; }
          return r;
        });
        if (warns.length) setWarnings(warns);

        const [regData, comData, indData, deudaData, cartData, viatData, viatMensualData, viatFuncData, acuerdosData, coberturaData, radarData, iralResumenData, iralNuevosData, carteraCriticaData, percapitaData, deudaDetalleData, priorizadosData, metasData] = clean;
        // Metas fijas por región: la meta de la tabla metas_revision manda sobre todos los registros; si no hay, usa la guardada en el registro
        const metaDe = (rid, prog, tipo) => (metasData || []).find(m => m.region_id === rid && m.programa === prog && m.tipo === tipo);
        const indConMeta = indData.map(i => {
          const m = metaDe(i.region_id, i.programa, i.tipo);
          return { ...i, meta_tecnica: m?.meta_tecnica ?? i.meta_tecnica ?? null, meta_financiera: m?.meta_financiera ?? i.meta_financiera ?? null };
        });
        const regRaw = results[0];
        if (regRaw && regRaw.__error) throw new Error(`No se pudo leer 'regiones': ${regRaw.__error}`);
        if (!regData.length) throw new Error("La tabla 'regiones' respondió correctamente pero devolvió 0 filas. Revisa que las filas existan en el schema 'public' y que la policy de lectura esté activa para el rol 'anon'.");

        const out = {};
        for (const r of regData) {
          out[r.id] = {
            label: r.label, jefeUrs: r.jefe_urs, jefeConfianza: r.jefe_urs_confianza,
            ciclo: r.ciclo, primeraVez: r.primera_vez,
            comunasTodos: comData.filter(c => c.region_id === r.id && (c.grupo_programa || "TODOS") === "TODOS").map(c => [c.comuna, c.transferido_m, c.saldo_pendiente_m, c.pct_deuda, c.n_proyectos_numerador, c.n_proyectos_denominador]),
            comunasPmuPmb: comData.filter(c => c.region_id === r.id && c.grupo_programa === "PMU_PMB").map(c => [c.comuna, c.transferido_m, c.saldo_pendiente_m, c.pct_deuda, c.n_proyectos_numerador, c.n_proyectos_denominador]),
            comunasCorteFecha: (() => {
              const row = comData.find(c => c.region_id === r.id && c.corte_fecha);
              return row ? row.corte_fecha : null;
            })(),
            s2regional: null,
            s3: null,
            s7raw: indConMeta.filter(i => i.region_id === r.id),
            s7metas: (metasData || []).filter(m => m.region_id === r.id),
            s7a: (() => {
              const pmu = indConMeta.find(i => i.region_id === r.id && i.programa === "PMU" && i.tipo === "evaluacion");
              const pmb = indConMeta.find(i => i.region_id === r.id && i.programa === "PMB" && i.tipo === "evaluacion");
              return pmu || pmb ? { pmu: { meta: pmu?.meta_tecnica, real: pmu?.real_tecnica }, pmb: { meta: pmb?.meta_tecnica, real: pmb?.real_tecnica } } : null;
            })(),
            s7b: (() => {
              function latestAndPrev(programa) {
                const rows = indConMeta.filter(i => i.region_id === r.id && i.programa === programa && i.tipo === "rendicion")
                  .sort((a, b) => new Date(b.corte_fecha) - new Date(a.corte_fecha));
                return { latest: rows[0], prev: rows[1] };
              }
              const pmu = latestAndPrev("PMU"), pmb = latestAndPrev("PMB");
              const shape = (x) => ({
                metaT: x.latest?.meta_tecnica ?? 0, realT: x.latest?.real_tecnica ?? 0,
                metaF: x.latest?.meta_financiera ?? 0, realF: x.latest?.real_financiera ?? 0,
                prevRealT: x.prev?.real_tecnica ?? null, prevRealF: x.prev?.real_financiera ?? null,
                corteFecha: x.latest?.corte_fecha, corteFechaPrev: x.prev?.corte_fecha,
              });
              return { pmu: shape(pmu), pmb: shape(pmb) };
            })(),
            s8: (() => {
              const rows = deudaData.filter(x => x.region_id === r.id).sort((a, b) => new Date(b.corte_fecha) - new Date(a.corte_fecha));
              const d = rows[0];
              return d ? { totalExpedientes: d.total_expedientes, bandejaUrs: d.bandeja_urs, bandejaMonto: d.bandeja_monto_m, segundasCuota: d.segundas_cuota, segundasMonto: d.segundas_monto_m, pagadas: d.pagadas, analista: d.analista_central, sinBandeja: d.sin_bandeja, anomalia: d.anomalia_texto, corteFecha: d.corte_fecha } : null;
            })(),
            s9: (() => {
              const c = cartData.find(x => x.region_id === r.id);
              return c ? { total: c.total, cerrados: c.cerrados, enEjecucion: c.en_ejecucion, otros: c.otros } : { total: 0, cerrados: 0, enEjecucion: 0, otros: 0 };
            })(),
            s6: (() => {
              const v = viatData.find(x => x.region_id === r.id);
              return v ? { periodo: v.periodo, montoTotal: v.monto_total, nViaticos: v.n_viaticos, montoJefe: v.monto_jefe, nViaticosJefe: v.n_viaticos_jefe, nombreJefeFuente: v.nombre_jefe_fuente, presupuestoVigente: v.presupuesto_vigente, presupuestoDisponible: v.presupuesto_disponible, pctEjecucionRegional: v.pct_ejecucion_regional, pctEjecucionInstitucional: v.pct_ejecucion_institucional } : null;
            })(),
            s6mensual: viatMensualData.filter(m => m.region_id === r.id).sort((a, b) => a.orden_periodo - b.orden_periodo).map(m => ({ periodo: m.periodo, monto: m.monto_ejecutado })),
            s6funcionarios: viatFuncData.filter(f => f.region_id === r.id).sort((a, b) => b.monto - a.monto).map(f => ({ nombre: f.funcionario, monto: f.monto, n: f.n_viaticos, esJefe: f.es_jefe })),
            s4data: acuerdosData.filter(a => a.region_id === r.id),
            s3data: carteraCriticaData.filter(c => c.region_id === r.id),
            percapita: (() => {
              const map = {};
              percapitaData.filter(p => p.region_id === r.id).forEach(p => { map[p.comuna.toUpperCase()] = p.aporte_percapita; });
              return map;
            })(),
            deudaDetalle: deudaDetalleData.filter(d => d.region_id === r.id),
            priorizados: priorizadosData.filter(p => p.region_id === r.id),
            s5data: coberturaData.filter(c => c.region_id === r.id).sort((a, b) => new Date(b.fecha_visita) - new Date(a.fecha_visita)),
            s9radar: radarData.filter(x => x.region_id === r.id).map(x => ({ estado: x.estado, periodo: x.periodo, orden: x.orden_periodo, n: x.n_proyectos, nuevos: x.n_nuevos })),
            s10raw: iralResumenData.filter(x => x.region_id === r.id),
            s10: (() => {
              const raw = iralResumenData.filter(x => x.region_id === r.id);
              if (raw.length === 0) return null;
              // Para el resumen/alertas se usa el corte más reciente por programa.
              const porPrograma = {};
              raw.forEach(x => {
                const prev = porPrograma[x.programa];
                if (!prev || new Date(x.corte_fecha) > new Date(prev.corte_fecha)) porPrograma[x.programa] = x;
              });
              const resumen = Object.values(porPrograma).map(x => ({ programa: x.programa, n: x.n_proyectos, monto: x.monto, revision: x.n_revision_urs, corteFecha: x.corte_fecha }));
              const nuevos = iralNuevosData.filter(x => x.region_id === r.id).map(x => ({ idp: x.id_proyecto, comuna: x.comuna, programa: x.programa, monto: x.monto, estado: x.estado, nombre: x.nombre_proyecto }));
              return { resumen, nuevos };
            })(),
            s11: null,
          };
        }
        setRegions(out);
      } catch (e) {
        setError(e.message || String(e));
      }
    }
    load();
  }, [enabled, fetcher, refreshKey]);

  return { regions, error, warnings };
}

function ConnectScreen({ onConnect }) {
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [touched, setTouched] = useState(false);

  const canConnect = url.trim().startsWith("https://") && url.includes(".supabase.co") && key.trim().length > 20;

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", background: "#F7F9FB", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 12, padding: 32, maxWidth: 440, width: "100%", boxShadow: "0 2px 12px rgba(15,41,66,0.08)" }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>SUBDERE — PANEL DE GESTIÓN URS</div>
        <h2 style={{ color: NAVY, fontSize: 20, margin: "0 0 18px" }}>Conectar a Supabase</h2>

        <label style={{ fontSize: 12, fontWeight: 700, color: NAVY_SOFT, display: "block", marginBottom: 4 }}>Project URL</label>
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://tu-proyecto.supabase.co"
          style={{ width: "100%", padding: "9px 10px", borderRadius: 6, border: `1px solid ${LIGHTGRAY}`, marginBottom: 14, fontSize: 13, boxSizing: "border-box" }} />

        <label style={{ fontSize: 12, fontWeight: 700, color: NAVY_SOFT, display: "block", marginBottom: 4 }}>Clave anon (pública)</label>
        <input value={key} onChange={e => setKey(e.target.value)} placeholder="eyJhbGc..." type="text"
          style={{ width: "100%", padding: "9px 10px", borderRadius: 6, border: `1px solid ${LIGHTGRAY}`, marginBottom: 6, fontSize: 13, boxSizing: "border-box" }} />
        <div style={{ fontSize: 11, color: "#888", marginBottom: 18 }}>
          Usa la clave <strong>anon / public</strong> de Settings → API. NUNCA la <strong>service_role</strong> aquí — esta pantalla es pública.
        </div>

        <button
          disabled={!canConnect}
          onClick={() => { setTouched(true); if (canConnect) onConnect(url.trim(), key.trim()); }}
          style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 14,
            background: canConnect ? NAVY : LIGHTGRAY, color: canConnect ? "white" : "#999", cursor: canConnect ? "pointer" : "not-allowed" }}>
          Conectar
        </button>
        {touched && !canConnect && (
          <div style={{ fontSize: 12, color: RED, marginTop: 8 }}>Revisa que la URL termine en .supabase.co y que la clave esté completa.</div>
        )}
        <div style={{ fontSize: 11, color: "#888", marginTop: 14 }}>
          Estas credenciales solo se usan en tu navegador para esta sesión — no se guardan en ningún servidor.
        </div>
      </div>
    </div>
  );
}

// ---------- Red de seguridad: si algo falla al renderizar, muestra el error en vez de pantalla en blanco ----------
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("Panel URS crash:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "Arial", maxWidth: 600, margin: "60px auto" }}>
          <div style={{ color: RED, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Se rompió algo al mostrar el panel</div>
          <div style={{ background: "#FBDADA", borderRadius: 8, padding: 12, fontSize: 12, color: RED, fontFamily: "monospace", whiteSpace: "pre-wrap", marginBottom: 12 }}>
            {String(this.state.error && this.state.error.message || this.state.error)}
          </div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>Copia el texto de arriba y mándaselo a Claude para que lo arregle.</div>
          <button onClick={() => this.setState({ error: null })} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: NAVY, color: "white", cursor: "pointer" }}>Reintentar</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// =====================================================================
// SEGUIMIENTO DE PROYECTOS (vista aparte: dirección  …/#seguimiento)
// =====================================================================
const SEG_REG = { 1: "Tarapacá", 2: "Antofagasta", 3: "Atacama", 4: "Coquimbo", 5: "Valparaíso", 6: "O'Higgins", 7: "Maule", 8: "Biobío", 9: "La Araucanía", 10: "Los Lagos", 11: "Aysén", 12: "Magallanes", 13: "Metropolitana", 14: "Los Ríos", 15: "Arica y Parinacota", 16: "Ñuble" };
const SEG_REG_ID = { 1: "tarapaca", 2: "antofagasta", 3: "atacama", 4: "coquimbo", 5: "valparaiso", 6: "ohiggins", 7: "maule", 8: "biobio", 9: "araucania", 10: "los-lagos", 11: "aysen", 12: "magallanes", 13: "metropolitana", 14: "los-rios", 15: "arica-y-parinacota", 16: "nuble" };
const SEG_ORDEN = [15, 1, 2, 3, 4, 5, 13, 6, 7, 16, 8, 9, 14, 10, 11, 12].map(c => SEG_REG_ID[c]);
const SEG_LABEL_FALLBACK = Object.fromEntries(Object.keys(SEG_REG).map(c => [SEG_REG_ID[c], SEG_REG[c]]));
const SEG_ETAPAS = [
  { id: "licitacion", n: "En licitación", s: "Incluye administración directa decretada. El detalle de la licitación (publicación, ofertas, evaluación) está por confirmar: usa la nota." },
  { id: "adjudicado", n: "Adjudicado", s: "Adjudicación aprobada por decreto" },
  { id: "contratado", n: "Contratado", s: "Garantías pedidas y contrato firmado" },
  { id: "obras", n: "En obras", s: "Contrato registrado en SUBDERE en línea (obra en EJECUCIÓN)" },
  { id: "cierre", n: "En cierre", s: "Cierre solicitado o en trámite (guías C·1 y C·2)" },
];
const SEG_ETAPA_IDX = Object.fromEntries(SEG_ETAPAS.map((e, i) => [e.id, i]));
const SEG_LINEA = { "Tradicional": "PMU IRAL", "PMB Tradicional": "PMB IRAL", "Fondo Recuperación de Ciudades": "FRC" };
const SEG_ESTADOS_ALCANCE = ["aprobado", "con anticipo solicitado", "con giro por anticipo", "en ejecucion", "en proceso de cierre"];
const SEG_DIAS_DESACTUALIZADO = 30; // plazo definido por Fran (02-11-2026)
const SEG_ESTADO_LABEL = { sin: "Sin actualizar", vie: "Desactualizado", ok: "Al día" };

const segHoy = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const segDias = (iso) => Math.max(0, Math.round((new Date(segHoy()) - new Date(iso)) / 864e5));
const segClp = (n) => (n ? "$" + Number(n).toLocaleString("es-CL") : "Monto: sin dato");
const segNorm = (s) => String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/_/g, " ").replace(/\s+/g, " ").trim();
// "ALTO DEL CARMEN" / "Alto Del Carmen" -> "Alto del Carmen"
const segTitulo = (s) => String(s == null ? "" : s).trim().toLowerCase().split(/\s+/).map((w, i) => {
  if (i > 0 && ["de", "del", "la", "las", "los", "y", "el"].includes(w)) return w;
  return w.replace(/(^|['\-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
}).join(" ");
const segMsgError = (e) => {
  const t = String((e && e.message) || e);
  if (/23505|duplicate key/i.test(t)) return "Ese código ya existe en otro proyecto.";
  if (/42501|row-level security/i.test(t)) return "Falta el permiso en la base de datos (ejecutar seguimiento_esquema.sql y seguimiento_detalle.sql).";
  if (/PGRST20[45]|does not exist|Could not find the table|Could not find the .* column/i.test(t)) return "Falta crear las tablas o columnas nuevas en la base de datos (ejecutar seguimiento_detalle.sql).";
  return t;
};

// ---------- Lectura de archivos (.xls de SUBDERE en línea = HTML, .xlsx, .csv) ----------
function segDecodificar(bytes) {
  try { return new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
  catch (e) { return new TextDecoder("windows-1252").decode(bytes); }
}
async function segLeerMatriz(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const cabecera = new TextDecoder("latin1").decode(bytes.slice(0, 3000)).toLowerCase();
  const nombre = (file.name || "").toLowerCase();
  if (/<html|<table|<!doctype html/.test(cabecera)) {
    // El "Excel" de SUBDERE en línea es en realidad una página HTML con tablas
    const doc = new DOMParser().parseFromString(segDecodificar(bytes), "text/html");
    const tablas = [...doc.querySelectorAll("table")].filter(t => !t.querySelector("table"));
    if (!tablas.length) throw new Error("No encontré ninguna tabla en el archivo.");
    const mejor = tablas.reduce((a, b) => (b.rows.length > a.rows.length ? b : a));
    return [...mejor.rows].map(r => [...r.cells].map(c => c.textContent.replace(/ /g, " ").trim()));
  }
  const XLSX = await import("xlsx");
  let wb;
  if (nombre.endsWith(".csv") || nombre.endsWith(".txt")) wb = XLSX.read(segDecodificar(bytes).replace(/^﻿/, ""), { type: "string" });
  else wb = XLSX.read(bytes, { type: "array" });
  let mejor = null, n = -1;
  for (const nm of wb.SheetNames) {
    const m = XLSX.utils.sheet_to_json(wb.Sheets[nm], { header: 1, defval: "", raw: false });
    if (m.length > n) { n = m.length; mejor = m; }
  }
  return mejor || [];
}

const SEG_ALIAS = {
  codigo: ["id. proyecto", "id proyecto", "codigo proyecto", "codigo", "id"],
  region: ["region cod", "region"],
  comuna: ["comuna"],
  programa: ["programa"],
  nombre: ["nombre proyecto", "nombre"],
  monto: ["aporte subdere ($)", "aporte subdere", "monto subdere", "monto"],
  estado: ["estado", "estado subdere"],
  anio: ["ano creacion", "anio creacion"],
};
function segRegionId(v) {
  const s = segNorm(v);
  if (!s) return null;
  if (/^\d+$/.test(s)) return SEG_REG_ID[+s] || null;
  for (const c of Object.keys(SEG_REG)) if (segNorm(SEG_REG[c]) === s) return SEG_REG_ID[c];
  for (const c of Object.keys(SEG_REG)) if (s.includes(segNorm(SEG_REG[c]))) return SEG_REG_ID[c];
  return null;
}
// Analiza la matriz leída. regionPermitida: id de región (jefe URS) o null (gabinete: todas)
function segAnalizar(matriz, { regionPermitida, codigosExistentes, autor, codigosCD = new Set() }) {
  let hi = -1, col = {};
  for (let i = 0; i < Math.min(matriz.length, 40) && hi < 0; i++) {
    const celdas = matriz[i].map(segNorm);
    const c = {};
    for (const campo of Object.keys(SEG_ALIAS)) {
      for (const al of SEG_ALIAS[campo]) { const k = celdas.indexOf(al); if (k >= 0) { c[campo] = k; break; } }
    }
    if (c.comuna != null && c.nombre != null && c.programa != null && c.region != null) { hi = i; col = c; }
  }
  if (hi < 0) return { error: "No reconozco las columnas. El archivo debe traer al menos: Región, Comuna, Programa y Nombre Proyecto (como el listado de SUBDERE en línea)." };
  const get = (f, r) => (col[f] == null ? "" : String(r[col[f]] == null ? "" : r[col[f]]).replace(/\s+/g, " ").trim());
  const st = { leidas: 0, fueraAlcance: 0, otraRegion: 0, yaExistian: 0, cdNuevos: 0, cdGirado: 0, sinEstado: col.estado == null };
  const recs = [], rechazos = [], vistos = new Set();
  for (let i = hi + 1; i < matriz.length; i++) {
    const r = matriz[i];
    if (!r || r.every(x => String(x == null ? "" : x).trim() === "")) continue;
    st.leidas++;
    const fila = i + 1, codigo = get("codigo", r), nombre = get("nombre", r);
    // Excepción: los proyectos de la lista Chile Despega entran también si están en «100% Girado»
    const enCD = codigosCD.has(codigo), estNorm = segNorm(get("estado", r));
    if (col.estado != null && !(SEG_ESTADOS_ALCANCE.includes(estNorm) || (enCD && estNorm === "100% girado"))) { st.fueraAlcance++; continue; }
    const rid = segRegionId(get("region", r));
    const rech = (motivo) => rechazos.push({ fila, codigo, nombre, motivo });
    if (!rid) { rech("región no reconocida"); continue; }
    if (regionPermitida && rid !== regionPermitida) { st.otraRegion++; continue; }
    if (!codigo) { rech("sin código (agrégalo a mano para evitar duplicados)"); continue; }
    if (codigosExistentes.has(codigo)) { st.yaExistian++; continue; }
    if (vistos.has(codigo)) { rech("código repetido dentro del archivo"); continue; }
    const comuna = segTitulo(get("comuna", r)), programa = get("programa", r);
    if (!comuna || !nombre || !programa) { rech("faltan datos (comuna, programa o nombre)"); continue; }
    vistos.add(codigo);
    if (enCD) { st.cdNuevos++; if (estNorm === "100% girado") st.cdGirado++; }
    const monto = parseInt(get("monto", r).replace(/[^\d]/g, ""), 10);
    const anio = parseInt(get("anio", r), 10);
    recs.push({ codigo, region_id: rid, comuna, programa, nombre, monto_subdere: Number.isFinite(monto) ? monto : null, anio_creacion: Number.isFinite(anio) ? anio : null, estado_subdere: col.estado != null ? get("estado", r) : null, chile_despega: enCD, origen: "excel", creado_por: autor });
  }
  return { stats: st, recs, rechazos };
}

const SEG_CSS = `.seg{--bg: #FFFFFF; --panel: #EDF0F5; --card: #FFFFFF; --ink: #000000; --muted: #4B5163; --line: #C8CFDD;
  --primary: #25306B; --onprimary: #FFFFFF; --secondary: #006BB9; --alert: #FF1D3D; --onalert: #FFFFFF; --accent: #FFDC00; --onaccent: #000000;
  --ok: #1B6B3A; --okbg: #E3F2E8;
  --font: Verdana, Geneva, "DejaVu Sans", sans-serif;}
@media (prefers-color-scheme: dark){.seg{--bg: #0D1124; --panel: #171D3A; --card: #1B2247; --ink: #EEF1F8; --muted: #A5AECB; --line: #2D3865;
    --primary: #9DAAF2; --onprimary: #0D1124; --secondary: #4DA6EE; --alert: #FF5470; --onalert: #0D1124; --ok: #7BD39A; --okbg: #17321F; color-scheme: dark;}}
.seg *{box-sizing: border-box;}
.seg{background: var(--bg); color: var(--ink); font-family: var(--font); font-size: 16px; line-height: 1.5; padding-block: 12px 56px;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));}
.seg .wrap{max-width: 1100px; margin: 0 auto;}
.seg button, .seg select, .seg input, .seg textarea{font-family: inherit; font-size: inherit; color: inherit;}
.seg :focus-visible{outline: 3px solid var(--secondary); outline-offset: 2px;}
.seg h1{font-size: 24px; line-height: 1.2; margin: 0; color: var(--primary); text-wrap: balance;}
.seg h2{font-size: 19px; margin: 0 0 8px; color: var(--primary);}
.seg .top{display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; justify-content: space-between; margin-bottom: 8px;}
.seg .proto{background: var(--accent); color: var(--onaccent); font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 4px;}
.seg .note{background: var(--panel); border: 1px solid var(--line); padding: 10px 12px; margin: 0 0 14px; font-size: 14px;}
.seg .note p{margin: 0 0 4px;}
.seg .note p:last-child{margin: 0;}
.seg .who{display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center; margin-bottom: 16px;}
.seg .who label{font-weight: 700;}
.seg select, .seg input[type=text], .seg input[type=search], .seg input[type=date], .seg textarea{background: var(--bg); border: 2px solid var(--line); border-radius: 6px; padding: 10px 12px; min-height: 48px; max-width: 100%;}
.seg textarea{width: 100%; min-height: 96px;}
.seg .btn{border: 2px solid var(--primary); background: var(--bg); color: var(--primary); border-radius: 6px; padding: 10px 16px; min-height: 48px; cursor: pointer; font-weight: 700;}
.seg .btn:hover{background: var(--panel);}
.seg .btn.main{background: var(--primary); color: var(--onprimary);}
.seg .btn.main:hover{filter: brightness(1.12);}
.seg .btn.go{background: var(--ok); border-color: var(--ok); color: #FFFFFF;}
.seg .btn.sm{min-height: 40px; padding: 6px 12px; font-size: 14px;}
.seg .chips{display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px;}
.seg .chip{border: 2px solid var(--line); background: var(--bg); border-radius: 22px; padding: 8px 14px; min-height: 44px; cursor: pointer;}
.seg .chip[aria-pressed="true"]{background: var(--primary); border-color: var(--primary); color: var(--onprimary);}
.seg .filters{display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;}
.seg .filters > *{flex: 1 1 200px; min-width: 0;}
.seg .kpis{display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px; margin-bottom: 18px;}
.seg .kpi{background: var(--panel); border: 1px solid var(--line); padding: 12px 14px;}
.seg .kpi b{display: block; font-size: 30px; line-height: 1.1; color: var(--primary); font-variant-numeric: tabular-nums;}
.seg .kpi span{font-size: 14px; color: var(--muted);}
.seg .list{display: grid; gap: 12px;}
.seg .card{background: var(--card); border: 2px solid var(--line); border-left: 8px solid var(--line); padding: 14px; display: grid; gap: 8px; min-width: 0;}
.seg .card.sin{border-left-color: var(--accent);}
.seg .card.vie{border-left-color: var(--alert);}
.seg .card.ok{border-left-color: var(--ok);}
.seg .card h3{margin: 0; font-size: 17px; line-height: 1.3; overflow-wrap: anywhere;}
.seg .meta{font-size: 14px; color: var(--muted); overflow-wrap: anywhere;}
.seg .row{display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: center;}
.seg .pill{font-size: 14px; padding: 4px 10px; border-radius: 16px; border: 2px solid var(--line); background: var(--panel); font-weight: 700;}
.seg .pill.sin{background: var(--accent); color: var(--onaccent); border-color: var(--accent);}
.seg .pill.vie{background: var(--alert); color: var(--onalert); border-color: var(--alert);}
.seg .pill.ok{background: var(--okbg); color: var(--ok); border-color: var(--ok);}
.seg .tag{font-size: 12px; font-weight: 700; background: var(--secondary); color: #FFFFFF; padding: 2px 8px; border-radius: 4px;}
.seg .actions{display: flex; flex-wrap: wrap; gap: 8px;}
.seg .empty{padding: 24px; text-align: center; background: var(--panel); border: 1px dashed var(--line);}
.seg .tw{overflow-x: auto; border: 1px solid var(--line);}
.seg table{border-collapse: collapse; width: 100%; font-size: 14px; font-variant-numeric: tabular-nums;}
.seg th, .seg td{padding: 8px 10px; border-bottom: 1px solid var(--line); text-align: right; white-space: nowrap;}
.seg th:first-child, .seg td:first-child{text-align: left; position: sticky; left: 0; background: var(--bg);}
.seg th{background: var(--panel); font-size: 12px;}
.seg tbody tr:hover td{background: var(--panel);}
.seg td button{background: none; border: 0; color: var(--secondary); text-decoration: underline; cursor: pointer; padding: 6px 0; text-align: left; font-weight: 700;}
.seg .bars{display: grid; gap: 8px; margin: 0 0 20px;}
.seg .bar{display: grid; grid-template-columns: minmax(110px, 190px) 1fr 52px; gap: 8px; align-items: center; font-size: 14px;}
.seg .bar{padding: 4px 8px; border: 2px solid transparent; border-radius: 6px; transition: background .12s, border-color .12s;}
.seg .bar[data-drill]{cursor: pointer;}
.seg .bar[data-drill]:hover, .seg .bar[data-drill]:focus-within{background: var(--panel); border-color: var(--secondary);}
.seg .bar button{background: none; border: 0; text-align: left; padding: 4px 0; cursor: pointer; color: var(--ink);}
.seg .bar button::after, .seg td button::after{content: " ›"; color: var(--secondary); font-weight: 700;}
.seg .bar[data-drill]:hover button{font-weight: 700; color: var(--primary); text-decoration: underline;}
.seg .bar[data-drill]:hover .fill{background: var(--secondary);}
.seg tbody tr[data-drill]{cursor: pointer;}
.seg tbody tr[data-drill]:hover td{background: var(--panel); box-shadow: inset 0 -2px 0 var(--secondary);}
.seg tbody tr[data-drill]:hover td button{color: var(--primary);}
.seg .track{background: var(--panel); height: 18px; border: 1px solid var(--line);}
.seg .fill{background: var(--primary); height: 100%;}
.seg .more{margin: 14px 0; text-align: center;}
.seg .sheet{position: fixed; inset: 0; background: rgba(13,17,36,.62); z-index: 50; display: flex; align-items: flex-end; justify-content: center;}
.seg .sheet[hidden]{display: none;}
.seg .sbox{background: var(--bg); width: min(640px, 100%); max-height: 94%; overflow: auto; border-top: 6px solid var(--primary); padding: 16px max(16px, env(safe-area-inset-right, 0px)) calc(16px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px));}
@media (min-width: 700px){.seg .sheet{align-items: center;} .seg .sbox{border: 1px solid var(--line); border-top: 6px solid var(--primary);}}
.seg .opt{display: flex; gap: 12px; align-items: flex-start; border: 2px solid var(--line); border-radius: 6px; padding: 12px; margin: 0 0 8px; cursor: pointer; min-height: 52px;}
.seg .opt input{width: 24px; height: 24px; margin-top: 2px; flex: none;}
.seg .opt.cur{border-color: var(--primary); background: var(--panel);}
.seg .opt small{display: block; color: var(--muted); font-size: 12px;}
.seg .opt .n{flex: none; width: 28px; height: 28px; border-radius: 50%; background: var(--primary); color: var(--onprimary); display: grid; place-items: center; font-size: 13px; font-weight: 700;}
.seg .fld{margin: 12px 0;}
.seg .fld > label{display: block; font-weight: 700; margin-bottom: 4px;}
.seg .hist{font-size: 14px; color: var(--muted); padding-left: 18px;}
.seg .toast{position: fixed; left: 50%; transform: translateX(-50%); bottom: calc(16px + env(safe-area-inset-bottom, 0px)); background: var(--primary); color: var(--onprimary); padding: 12px 18px; border-radius: 6px; z-index: 60; display: flex; gap: 14px; align-items: center; max-width: calc(100% - 32px);}
.seg .toast[hidden]{display: none;}
.seg .toast button{background: none; border: 0; color: var(--accent); text-decoration: underline; font-weight: 700; cursor: pointer; min-height: 40px;}
.seg .foot{margin-top: 28px; color: var(--muted); font-size: 12px; max-width: 90ch;}
@media (max-width: 600px){.seg h1{font-size: 21px;} .seg .bar{grid-template-columns: 1fr 52px;} .seg .bar .track{grid-column: 1 / -1; grid-row: 2;}}
.seg .gate{display: grid; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); margin-top: 12px;}
.seg .who[hidden], .seg .note[hidden]{display: none;}
.seg .who-opt{text-align: left; font-size: 17px; min-height: 56px;}
.seg .who{display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin: 8px 0 16px;}
.seg .dsec{border: 2px solid var(--line); margin: 0 0 10px;}
.seg .dtit{display: block; width: 100%; text-align: left; background: var(--panel); border: 0; padding: 12px; min-height: 48px; font-weight: 700; cursor: pointer; color: var(--primary);}
.seg .dbody{padding: 12px;}
.seg .detlista{list-style: none; padding: 0; margin: 0 0 10px;}
.seg .detfila{display: flex; flex-wrap: wrap; gap: 6px 10px; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--line); font-size: 14px;}
.seg .detbtn{display: flex; gap: 6px; flex-wrap: wrap;}
.seg .dform{background: var(--panel); border: 1px solid var(--line); padding: 4px 12px 12px; margin: 8px 0;}
.seg .resumen-det{font-size: 14px; display: grid; gap: 2px;}
.seg .detprom{color: var(--ok); font-weight: 700;}
`;

function Hoja({ children, titulo, onClose }) {
  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={titulo} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sbox">{children}</div>
    </div>
  );
}
function textoHist(a) {
  const quien2 = a.autor ? ` — ${a.autor}` : "";
  if (a.tipo === "retiro") return `${fmtFecha(a.fecha)}: retirado del seguimiento${a.nota ? ` (${a.nota})` : ""}${quien2}`;
  if (a.tipo === "reintegro") return `${fmtFecha(a.fecha)}: reintegrado al seguimiento${quien2}`;
  const e = SEG_ETAPAS[SEG_ETAPA_IDX[a.etapa]];
  return `${fmtFecha(a.fecha)}: ${e ? e.n : a.etapa}${a.nota ? ` (${a.nota})` : ""}${quien2}`;
}

function HojaActualizar({ ctx, it, foco }) {
  const { fetcher, setHoja, mostrarToast, nuevaAnotacion, patchAn, patchPr } = ctx;
    const [etapa, setEtapa] = useState(it.cur ? it.cur.etapa : "");
    const [fecha, setFecha] = useState(segHoy());
    const [nota, setNota] = useState("");
    const [codigo, setCodigo] = useState(it.p.codigo || "");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    async function guardar() {
      if (!etapa) { setErr("Elige en qué está el proyecto."); return; }
      if (!fecha) { setErr("Indica la fecha."); return; }
      if (fecha > segHoy()) { setErr("La fecha no puede ser futura."); return; }
      setBusy(true); setErr("");
      try {
        const cod = codigo.trim();
        if (!it.p.codigo && cod) { await fetcher.updateRow("seg_proyectos", it.p.id, { codigo: cod }); patchPr(it.p.id, { codigo: cod }); }
        const fila = await nuevaAnotacion(it, { tipo: "avance", etapa, fecha, nota: nota.trim() || null });
        setHoja(null);
        mostrarToast("Listo, guardado.", async () => { try { await fetcher.updateRow("seg_anotaciones", fila.id, { anulada: true }); patchAn(fila.id, { anulada: true }); } catch (e) { mostrarToast("No se pudo deshacer: " + segMsgError(e)); } });
      } catch (e) { setErr(segMsgError(e)); setBusy(false); }
    }
    const previas = it.hist.filter(a => !a.anulada).slice().reverse().slice(0, 5);
    return (
      <Hoja titulo="Actualizar proyecto" onClose={() => setHoja(null)}>
        <h2>{it.p.nombre}</h2>
        <p className="meta">{it.p.comuna} · {it.p.programa}</p>
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend style={{ fontWeight: 700, marginBottom: 8 }}>¿En qué está hoy este proyecto?</legend>
          {SEG_ETAPAS.map((s, i) => (
            <label key={s.id} className={"opt" + (etapa === s.id ? " cur" : "")}>
              <input type="radio" name="etapa" checked={etapa === s.id} onChange={() => setEtapa(s.id)} />
              <span className="n">{i + 1}</span><span>{s.n}<small>{s.s}</small></span>
            </label>
          ))}
        </fieldset>
        {!it.p.codigo && (
          <div className="fld"><label htmlFor="seg-cod">Código del proyecto</label>
            <input type="text" id="seg-cod" autoFocus={!!foco} value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Ejemplo: 14102250601-C" autoComplete="off" />
            <p className="meta">Este proyecto aún no tiene código. Anótalo aquí cuando lo tenga.</p></div>
        )}
        <div className="fld"><label htmlFor="seg-fecha">Fecha</label><input type="date" id="seg-fecha" value={fecha} max={segHoy()} onChange={e => setFecha(e.target.value)} /></div>
        <div className="fld"><label htmlFor="seg-nota">Nota (opcional)</label>
          <textarea id="seg-nota" value={nota} onChange={e => setNota(e.target.value)} placeholder="Por ejemplo: licitación publicada, se reciben ofertas hasta el 20 de noviembre." /></div>
        {previas.length > 0 && <><p className="meta"><b>Anotaciones anteriores</b></p><ul className="hist">{previas.map(a => <li key={a.id}>{textoHist(a)}</li>)}</ul></>}
        {err && <p className="meta" style={{ color: "var(--alert)", fontWeight: 700 }}>{err}</p>}
        <div className="actions"><button type="button" className="btn main" disabled={busy} onClick={guardar}>{busy ? "Guardando…" : "Guardar"}</button><button type="button" className="btn" onClick={() => setHoja(null)}>Cancelar</button></div>
      </Hoja>
    );
}

function HojaRetiro({ ctx, it }) {
  const { fetcher, setHoja, mostrarToast, nuevaAnotacion, patchPr } = ctx;
    const [motivo, setMotivo] = useState("");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    async function retirar() {
      if (!motivo.trim()) { setErr("Escribe el motivo: queda en el historial."); return; }
      setBusy(true); setErr("");
      try {
        await nuevaAnotacion(it, { tipo: "retiro", etapa: null, fecha: segHoy(), nota: motivo.trim() });
        await fetcher.updateRow("seg_proyectos", it.p.id, { activo: false });
        patchPr(it.p.id, { activo: false });
        setHoja(null);
        mostrarToast("Proyecto retirado. Queda en «Retirados» con su historial.");
      } catch (e) { setErr(segMsgError(e)); setBusy(false); }
    }
    return (
      <Hoja titulo="Retirar del seguimiento" onClose={() => setHoja(null)}>
        <h2>Retirar del seguimiento</h2>
        <p className="meta"><b>{it.p.nombre}</b><br />{it.p.comuna} · {it.p.programa}</p>
        <p className="meta">El proyecto sale de las listas y de los conteos, pero no se borra: queda en «Retirados» con su historial y se puede reintegrar.</p>
        <div className="fld"><label htmlFor="seg-mot">Motivo (obligatorio)</label>
          <textarea id="seg-mot" value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Por ejemplo: proyecto cerrado en SUBDERE en línea." /></div>
        {err && <p className="meta" style={{ color: "var(--alert)", fontWeight: 700 }}>{err}</p>}
        <div className="actions"><button type="button" className="btn main" disabled={busy} onClick={retirar}>{busy ? "Guardando…" : "Retirar"}</button><button type="button" className="btn" onClick={() => setHoja(null)}>Cancelar</button></div>
      </Hoja>
    );
}

function HojaHistorial({ ctx, it }) {
  const { setHoja } = ctx;
  return (
    <Hoja titulo="Historial" onClose={() => setHoja(null)}>
      <h2>{it.p.nombre}</h2>
      <p className="meta">{it.p.comuna} · {it.p.programa}</p>
      {it.hist.filter(a => !a.anulada).length === 0 ? <p className="meta">Sin anotaciones.</p> :
        <ul className="hist">{it.hist.filter(a => !a.anulada).slice().reverse().map(a => <li key={a.id}>{textoHist(a)}</li>)}</ul>}
      <div className="actions"><button type="button" className="btn main" onClick={() => setHoja(null)}>Cerrar</button></div>
    </Hoja>
  );
}

function HojaAgregar({ ctx, regionInicial }) {
  const { datos, esGab, as, autor, fetcher, labelReg, recargar, setHoja, mostrarToast } = ctx;
    const [rid, setRid] = useState(esGab ? (regionInicial && SEG_ORDEN.includes(regionInicial) ? regionInicial : "") : as);
    const [comuna, setComuna] = useState("");
    const [programa, setPrograma] = useState("");
    const [nombre, setNombre] = useState("");
    const [monto, setMonto] = useState("");
    const [codigo, setCodigo] = useState("");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    const programas = [...new Set(datos.pr.map(p => p.programa))].sort((a, b) => a.localeCompare(b, "es"));
    const comunasReg = [...new Set(datos.pr.filter(p => p.region_id === rid).map(p => p.comuna))].sort((a, b) => a.localeCompare(b, "es"));
    async function guardar() {
      if (!rid) { setErr("Elige la región."); return; }
      if (!comuna.trim() || !programa || !nombre.trim()) { setErr("Faltan datos: comuna, programa y nombre son obligatorios."); return; }
      const cod = codigo.trim();
      if (cod && datos.pr.some(p => p.codigo === cod)) { setErr("Ese código ya existe en el panel."); return; }
      const m = monto.trim() ? parseInt(monto.replace(/[^\d]/g, ""), 10) : null;
      setBusy(true); setErr("");
      try {
        await fetcher.insertRow("seg_proyectos", { codigo: cod || null, region_id: rid, comuna: segTitulo(comuna), programa, nombre: nombre.trim(), monto_subdere: Number.isFinite(m) ? m : null, origen: "manual", creado_por: autor });
        recargar(); setHoja(null); mostrarToast("Proyecto agregado.");
      } catch (e) { setErr(segMsgError(e)); setBusy(false); }
    }
    return (
      <Hoja titulo="Agregar proyecto" onClose={() => setHoja(null)}>
        <h2>Agregar un proyecto</h2>
        {esGab && <div className="fld"><label htmlFor="seg-a-reg">Región</label>
          <select id="seg-a-reg" value={rid} onChange={e => setRid(e.target.value)}><option value="">Elige una región</option>{SEG_ORDEN.map(id => <option key={id} value={id}>{labelReg(id)}</option>)}</select></div>}
        <div className="fld"><label htmlFor="seg-a-com">Comuna</label>
          <input type="text" id="seg-a-com" list="seg-comunas" value={comuna} onChange={e => setComuna(e.target.value)} autoComplete="off" />
          <datalist id="seg-comunas">{comunasReg.map(c => <option key={c} value={c} />)}</datalist></div>
        <div className="fld"><label htmlFor="seg-a-prog">Programa</label>
          <select id="seg-a-prog" value={programa} onChange={e => setPrograma(e.target.value)}><option value="">Elige un programa</option>{programas.map(p => <option key={p} value={p}>{p}{SEG_LINEA[p] ? ` (${SEG_LINEA[p]})` : ""}</option>)}</select></div>
        <div className="fld"><label htmlFor="seg-a-nom">Nombre del proyecto</label><textarea id="seg-a-nom" value={nombre} onChange={e => setNombre(e.target.value)} /></div>
        <div className="fld"><label htmlFor="seg-a-mon">Monto SUBDERE en pesos (opcional)</label><input type="text" inputMode="numeric" id="seg-a-mon" value={monto} onChange={e => setMonto(e.target.value)} /></div>
        <div className="fld"><label htmlFor="seg-a-cod">Código del proyecto (opcional)</label><input type="text" id="seg-a-cod" value={codigo} onChange={e => setCodigo(e.target.value)} autoComplete="off" placeholder="Si aún no lo tiene, déjalo vacío" /></div>
        {err && <p className="meta" style={{ color: "var(--alert)", fontWeight: 700 }}>{err}</p>}
        <div className="actions"><button type="button" className="btn main" disabled={busy} onClick={guardar}>{busy ? "Guardando…" : "Guardar"}</button><button type="button" className="btn" onClick={() => setHoja(null)}>Cancelar</button></div>
      </Hoja>
    );
}

function HojaCarga({ ctx }) {
  const { datos, esGab, as, autor, fetcher, labelReg, recargar, setHoja } = ctx;
    const [fase, setFase] = useState("elegir"); // elegir | leyendo | resumen | guardando | listo
    const [res, setRes] = useState(null);
    const [err, setErr] = useState("");
    const [nGuardados, setNGuardados] = useState(0);
    const [cdTxt, setCdTxt] = useState("");
    async function leer(file) {
      if (!file) return;
      setFase("leyendo"); setErr("");
      try {
        const matriz = await segLeerMatriz(file);
        const codigosCD = new Set(esGab ? cdTxt.split(/[\n\r\t;]+/).map(x => x.trim()).filter(Boolean) : []);
        const r = segAnalizar(matriz, { regionPermitida: esGab ? null : as, codigosExistentes: new Set(datos.pr.map(p => p.codigo).filter(Boolean)), autor, codigosCD });
        if (r.error) { setErr(r.error); setFase("elegir"); return; }
        r.marcar = datos.pr.filter(p => p.codigo && codigosCD.has(p.codigo) && !p.chile_despega).map(p => p.id); // ya cargados que se marcarán Chile Despega
        r.nCD = codigosCD.size;
        setRes(r); setFase("resumen");
      } catch (e) { setErr("No pude leer el archivo: " + (e.message || e) + ". Guárdalo como .xlsx o .csv y vuelve a intentar."); setFase("elegir"); }
    }
    async function guardar() {
      setFase("guardando"); setErr("");
      try {
        const LOTE = 300;
        let n = 0;
        for (let i = 0; i < res.recs.length; i += LOTE) {
          await fetcher.insertMany("seg_proyectos", res.recs.slice(i, i + LOTE));
          n += Math.min(LOTE, res.recs.length - i); setNGuardados(n);
        }
        for (let i = 0; i < (res.marcar || []).length; i += 150) await fetcher.updateWhere("seg_proyectos", `id=in.(${res.marcar.slice(i, i + 150).join(",")})`, { chile_despega: true });
        recargar(); setFase("listo");
      } catch (e) { setErr(`Se guardaron ${nGuardados} proyectos y luego falló: ${segMsgError(e)}. Vuelve a cargar el mismo archivo: los ya guardados se omiten.`); recargar(); setFase("resumen"); }
    }
    const st = res && res.stats;
    return (
      <Hoja titulo="Cargar proyectos desde Excel" onClose={() => setHoja(null)}>
        <h2>Cargar proyectos desde Excel</h2>
        {fase === "elegir" && <>
          <p className="meta">Sirve el listado de SUBDERE en línea (.xls), un .xlsx o un .csv. {esGab ? "Se aceptan todas las regiones." : `Solo se aceptan proyectos de la región de ${labelReg(as)}.`} Solo entran proyectos desde Aprobado en adelante; los códigos que ya existen se omiten.</p>
          {esGab && <div className="fld"><label htmlFor="seg-cdl">Lista Chile Despega (opcional)</label>
            <textarea id="seg-cdl" style={{ minHeight: 90 }} value={cdTxt} onChange={e => setCdTxt(e.target.value)} placeholder="Pega aquí los códigos Chile Despega, uno por línea" />
            <p className="meta">Los proyectos de esta lista entran aunque estén en «100% Girado», quedan marcados como Chile Despega y los que ya estaban cargados también se marcan. Pega la lista ANTES de elegir el archivo.</p></div>}
          <div className="fld"><label htmlFor="seg-file">Archivo</label><input type="file" id="seg-file" accept=".xls,.xlsx,.csv,.txt" onChange={e => leer(e.target.files[0])} /></div>
        </>}
        {fase === "leyendo" && <p>Leyendo el archivo… puede tardar unos segundos.</p>}
        {(fase === "resumen" || fase === "guardando") && st && <>
          <div className="kpis">
            <div className="kpi"><b>{res.recs.length}</b><span>proyectos nuevos que entran</span></div>
            <div className="kpi"><b>{st.yaExistian}</b><span>ya estaban en el panel (se omiten)</span></div>
            <div className="kpi"><b>{res.rechazos.length}</b><span>rechazados</span></div>
          </div>
          {res.nCD > 0 && <p className="meta"><b>Chile Despega:</b> la lista trae {res.nCD} códigos. Entran {st.cdNuevos} nuevos (de ellos {st.cdGirado} en «100% Girado») y se marcan {res.marcar.length} que ya estaban cargados.</p>}
          <p className="meta">Filas leídas: {st.leidas}. Fuera de alcance (estado distinto de Aprobado, Con Anticipo Solicitado, Con Giro por Anticipo, En Ejecución o En Proceso de Cierre): {st.fueraAlcance}.{!esGab && ` De otra región (se ignoran): ${st.otraRegion}.`}{st.sinEstado && " ATENCIÓN: el archivo no trae columna «Estado», no se pudo filtrar por alcance."}</p>
          {res.rechazos.length > 0 && <>
            <p className="meta"><b>Rechazados</b> (no se guardan):</p>
            <div className="tw"><table><thead><tr><th>Fila</th><th>Código</th><th>Motivo</th></tr></thead><tbody>
              {res.rechazos.slice(0, 50).map((r, i) => <tr key={i}><td>{r.fila}</td><td style={{ textAlign: "left" }}>{r.codigo || "—"}</td><td style={{ textAlign: "left", whiteSpace: "normal" }}>{r.motivo}</td></tr>)}
            </tbody></table></div>
            {res.rechazos.length > 50 && <p className="meta">…y {res.rechazos.length - 50} más.</p>}
          </>}
          {err && <p className="meta" style={{ color: "var(--alert)", fontWeight: 700 }}>{err}</p>}
          <div className="actions" style={{ marginTop: 12 }}>
            {(res.recs.length > 0 || res.marcar.length > 0) && <button type="button" className="btn main" disabled={fase === "guardando"} onClick={guardar}>{fase === "guardando" ? `Guardando… ${nGuardados} de ${res.recs.length}` : (res.recs.length > 0 ? `Guardar ${res.recs.length} proyectos` : `Marcar ${res.marcar.length} como Chile Despega`)}</button>}
            <button type="button" className="btn" onClick={() => setHoja(null)}>Cancelar</button>
          </div>
        </>}
        {fase === "listo" && <>
          <p><b>{res && res.recs.length === 0 ? `Listo: se marcaron ${res.marcar.length} proyectos como Chile Despega.` : `Listo: se guardaron ${nGuardados} proyectos.`}</b></p>
          <div className="actions"><button type="button" className="btn main" onClick={() => setHoja(null)}>Cerrar</button></div>
        </>}
        {err && fase === "elegir" && <p className="meta" style={{ color: "var(--alert)", fontWeight: 700 }}>{err}</p>}
        {fase === "elegir" && <div className="actions"><button type="button" className="btn" onClick={() => setHoja(null)}>Cancelar</button></div>}
      </Hoja>
    );
}

// ---------- Detalle por etapa (licitación, adjudicación, contrato, obras) ----------
const SEG_RESULTADO = { en_curso: "En curso", desierta: "Desierta", adjudicada: "Adjudicada" };
const SEG_TIPO_CONTRATO = {
  inicial: "Contrato inicial",
  modificacion_plazo: "Modificación: aumento de plazo",
  modificacion_monto: "Modificación: cambio de monto",
  paralizacion: "Paralización de obra",
};
const segNum = (v) => { const n = parseFloat(String(v).replace(",", ".")); return Number.isFinite(n) ? n : null; };
const segEntero = (v) => { const n = parseInt(String(v).replace(/[^\d-]/g, ""), 10); return Number.isFinite(n) ? n : null; };
const segClpSigno = (n) => (n < 0 ? "−$" : "+$") + Math.abs(n).toLocaleString("es-CL");

function segTextoContrato(r) {
  const f = fmtFecha;
  const nota = r.nota ? ` (${r.nota})` : "";
  if (r.tipo === "inicial") return `Contrato inicial: inicio ${f(r.fecha_inicio)}, plazo ${r.plazo_dias} días, término ${f(r.fecha_termino)}${nota}`;
  if (r.tipo === "modificacion_plazo") return `Aumento de plazo (${f(r.fecha_modificacion)}): +${r.plazo_dias} días, nuevo término ${f(r.fecha_termino)}${nota}`;
  if (r.tipo === "modificacion_monto") return `Cambio de monto (${f(r.fecha_modificacion)}): ${segClpSigno(r.monto_modificacion)}${nota}`;
  return `Paralización: desde ${f(r.fecha_paralizacion)}, ${r.fecha_reinicio ? `reinicio ${f(r.fecha_reinicio)}` : "sin reinicio aún"}${nota}`;
}
// Líneas de resumen que se muestran en la tarjeta
function segResumenDetalle(p, lic, con, ep) {
  const out = [];
  if (lic.length) {
    const u = lic[lic.length - 1];
    out.push(`Licitación: ${lic.length} ${lic.length > 1 ? "procesos" : "proceso"}. Último (N° ${u.numero}): publicación ${fmtFecha(u.fecha_publicacion)}${u.fecha_apertura ? `, apertura ${fmtFecha(u.fecha_apertura)}` : ""} — ${SEG_RESULTADO[u.resultado] || u.resultado}`);
  }
  if (p.adj_fecha) out.push(`Decreto de adjudicación: ${fmtFecha(p.adj_fecha)}${p.adj_n_decreto ? ` (N° ${p.adj_n_decreto})` : ""}`);
  if (con.length) {
    const conTermino = con.filter(r => r.fecha_termino);
    const vig = conTermino[conTermino.length - 1];
    const ini = con.find(r => r.tipo === "inicial");
    const nMod = con.filter(r => r.tipo !== "inicial").length;
    if (vig) out.push(`Contrato: término ${fmtFecha(vig.fecha_termino)}${ini ? ` (plazo inicial ${ini.plazo_dias} días)` : ""}${nMod ? ` · ${nMod} ${nMod > 1 ? "modificaciones" : "modificación"}` : ""}`);
    else if (nMod) out.push(`Contrato: ${nMod} ${nMod > 1 ? "modificaciones" : "modificación"}`);
    const par = con.filter(r => r.tipo === "paralizacion" && !r.fecha_reinicio).pop();
    if (par) out.push(`⚠ Obra paralizada desde ${fmtFecha(par.fecha_paralizacion)}`);
  }
  if (ep.length) {
    const u = ep.slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)) || a.numero - b.numero).pop();
    out.push(`Avance: ${String(u.pct_avance).replace(".", ",")}% — estado de pago N° ${u.numero} (${fmtFecha(u.fecha)})`);
  }
  return out;
}

function DetFila({ children, onEdit, onQuitar }) {
  const [conf, setConf] = useState(false);
  return (
    <li className="detfila">
      <span>{children}</span>
      <span className="detbtn">
        <button type="button" className="btn sm" onClick={onEdit}>Editar</button>
        <button type="button" className="btn sm" onClick={() => { if (!conf) { setConf(true); return; } onQuitar(); }}>{conf ? "¿Seguro? Toca otra vez" : "Quitar"}</button>
      </span>
    </li>
  );
}
function Campo({ id, label, ayuda, children }) {
  return <div className="fld"><label htmlFor={id}>{label}</label>{children}{ayuda && <p className="meta">{ayuda}</p>}</div>;
}
function FormBotones({ busy, onGuardar, onCancelar, texto }) {
  return <div className="actions"><button type="button" className="btn main" disabled={busy} onClick={onGuardar}>{busy ? "Guardando…" : (texto || "Guardar")}</button><button type="button" className="btn" onClick={onCancelar}>Cancelar</button></div>;
}
const segErr = (err) => err && <p className="meta" style={{ color: "var(--alert)", fontWeight: 700 }}>{err}</p>;

function LicForm({ ctx, it, fila, sugerido, onDone }) {
  const [numero, setNumero] = useState(fila ? String(fila.numero) : String(sugerido));
  const [pub, setPub] = useState(fila ? fila.fecha_publicacion || "" : "");
  const [ape, setApe] = useState(fila ? fila.fecha_apertura || "" : "");
  const [res, setRes] = useState(fila ? fila.resultado : "en_curso");
  const [nota, setNota] = useState(fila ? fila.nota || "" : "");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function guardar() {
    const n = segEntero(numero);
    if (!n || n < 1) { setErr("Indica el número del proceso (1, 2, 3…)."); return; }
    if (!pub) { setErr("Indica la fecha de publicación."); return; }
    if (ape && ape < pub) { setErr("La fecha de apertura no puede ser anterior a la de publicación."); return; }
    setBusy(true); setErr("");
    try { await ctx.guardarDet("lic", "seg_licitaciones", fila && fila.id, { numero: n, fecha_publicacion: pub, fecha_apertura: ape || null, resultado: res, nota: nota.trim() || null }, it); onDone(); }
    catch (e) { setErr(segMsgError(e)); setBusy(false); }
  }
  return (
    <div className="dform">
      <Campo id="l-n" label="N° del proceso de licitación"><input type="text" inputMode="numeric" id="l-n" value={numero} onChange={e => setNumero(e.target.value)} /></Campo>
      <Campo id="l-p" label="Fecha de publicación"><input type="date" id="l-p" value={pub} onChange={e => setPub(e.target.value)} /></Campo>
      <Campo id="l-a" label="Fecha de apertura (cierre de ofertas)"><input type="date" id="l-a" value={ape} onChange={e => setApe(e.target.value)} /></Campo>
      <Campo id="l-r" label="Resultado del proceso">
        <select id="l-r" value={res} onChange={e => setRes(e.target.value)}>{Object.entries(SEG_RESULTADO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      </Campo>
      <Campo id="l-o" label="Nota (opcional)"><textarea id="l-o" value={nota} onChange={e => setNota(e.target.value)} /></Campo>
      {segErr(err)}
      <FormBotones busy={busy} onGuardar={guardar} onCancelar={onDone} />
    </div>
  );
}
function SecLic({ ctx, it }) {
  const [edit, setEdit] = useState(null);
  return (
    <>
      <p className="meta">Si el proyecto se adjudica en el segundo o tercer proceso, agrega cada proceso por separado.</p>
      {it.lic.length === 0 && !edit && <p className="meta">Sin procesos anotados.</p>}
      <ul className="detlista">
        {it.lic.map(r => (
          <DetFila key={r.id} onEdit={() => setEdit(r)} onQuitar={async () => { try { await ctx.quitarDet("lic", "seg_licitaciones", r.id); } catch (e) { ctx.mostrarToast("No se pudo quitar: " + segMsgError(e)); } }}>
            <b>Proceso N° {r.numero}</b>: publicación {fmtFecha(r.fecha_publicacion)}{r.fecha_apertura ? `, apertura ${fmtFecha(r.fecha_apertura)}` : ""} — {SEG_RESULTADO[r.resultado] || r.resultado}{r.nota ? ` (${r.nota})` : ""}
          </DetFila>
        ))}
      </ul>
      {edit ? <LicForm key={edit.id || "nuevo"} ctx={ctx} it={it} fila={edit.id ? edit : null} sugerido={it.lic.length ? Math.max(...it.lic.map(r => r.numero)) + 1 : 1} onDone={() => setEdit(null)} />
        : <button type="button" className="btn" onClick={() => setEdit({})}>+ Agregar proceso de licitación</button>}
    </>
  );
}

function SecAdj({ ctx, it }) {
  const [abierto, setAbierto] = useState(false);
  const [fecha, setFecha] = useState(it.p.adj_fecha || "");
  const [dec, setDec] = useState(it.p.adj_n_decreto || "");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function guardar(borrar) {
    if (!borrar) {
      if (!fecha) { setErr("Indica la fecha del decreto de adjudicación."); return; }
      if (fecha > segHoy()) { setErr("La fecha del decreto no puede ser futura."); return; }
    }
    setBusy(true); setErr("");
    try { await ctx.guardarAdj(it, borrar ? { adj_fecha: null, adj_n_decreto: null } : { adj_fecha: fecha, adj_n_decreto: dec.trim() || null }); if (borrar) { setFecha(""); setDec(""); } setAbierto(false); setBusy(false); }
    catch (e) { setErr(segMsgError(e)); setBusy(false); }
  }
  return (
    <>
      {it.p.adj_fecha ? <p className="meta">Decreto de adjudicación: <b>{fmtFecha(it.p.adj_fecha)}</b>{it.p.adj_n_decreto ? ` · N° ${it.p.adj_n_decreto}` : ""}</p> : <p className="meta">Sin decreto de adjudicación anotado.</p>}
      {abierto ? (
        <div className="dform">
          <Campo id="a-f" label="Fecha del decreto de adjudicación"><input type="date" id="a-f" value={fecha} max={segHoy()} onChange={e => setFecha(e.target.value)} /></Campo>
          <Campo id="a-d" label="N° del decreto (opcional)"><input type="text" id="a-d" value={dec} onChange={e => setDec(e.target.value)} autoComplete="off" /></Campo>
          {segErr(err)}
          <FormBotones busy={busy} onGuardar={() => guardar(false)} onCancelar={() => setAbierto(false)} />
        </div>
      ) : (
        <div className="actions">
          <button type="button" className="btn" onClick={() => setAbierto(true)}>{it.p.adj_fecha ? "Editar decreto de adjudicación" : "+ Anotar decreto de adjudicación"}</button>
          {it.p.adj_fecha && <button type="button" className="btn sm" disabled={busy} onClick={() => guardar(true)}>Quitar</button>}
        </div>
      )}
    </>
  );
}

function ConForm({ ctx, it, fila, onDone }) {
  const hayInicial = it.con.some(r => r.tipo === "inicial" && (!fila || r.id !== fila.id));
  const [tipo, setTipo] = useState(fila ? fila.tipo : (hayInicial ? "modificacion_plazo" : "inicial"));
  const [fIni, setFIni] = useState(fila ? fila.fecha_inicio || "" : "");
  const [plazo, setPlazo] = useState(fila && fila.plazo_dias != null ? String(fila.plazo_dias) : "");
  const [fTer, setFTer] = useState(fila ? fila.fecha_termino || "" : "");
  const [fMod, setFMod] = useState(fila ? fila.fecha_modificacion || "" : "");
  const [monto, setMonto] = useState(fila && fila.monto_modificacion != null ? String(fila.monto_modificacion) : "");
  const [fPar, setFPar] = useState(fila ? fila.fecha_paralizacion || "" : "");
  const [fRei, setFRei] = useState(fila ? fila.fecha_reinicio || "" : "");
  const [nota, setNota] = useState(fila ? fila.nota || "" : "");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function guardar() {
    const d = { tipo, fecha_inicio: null, plazo_dias: null, fecha_termino: null, fecha_modificacion: null, monto_modificacion: null, fecha_paralizacion: null, fecha_reinicio: null, nota: nota.trim() || null };
    if (tipo === "inicial") {
      const pz = segEntero(plazo);
      if (!fIni || !pz || pz < 1 || !fTer) { setErr("Indica fecha de inicio, plazo en días y fecha de término."); return; }
      if (fTer < fIni) { setErr("La fecha de término no puede ser anterior a la de inicio."); return; }
      Object.assign(d, { fecha_inicio: fIni, plazo_dias: pz, fecha_termino: fTer });
    } else if (tipo === "modificacion_plazo") {
      const pz = segEntero(plazo);
      if (!fMod || !pz || pz < 1 || !fTer) { setErr("Indica la fecha de la modificación, los días de aumento y la nueva fecha de término."); return; }
      Object.assign(d, { fecha_modificacion: fMod, plazo_dias: pz, fecha_termino: fTer });
    } else if (tipo === "modificacion_monto") {
      const m = segEntero(monto);
      if (!fMod || !m) { setErr("Indica la fecha de la modificación y el monto (con signo menos si disminuye)."); return; }
      Object.assign(d, { fecha_modificacion: fMod, monto_modificacion: m });
    } else {
      if (!fPar) { setErr("Indica la fecha de paralización."); return; }
      if (fRei && fRei < fPar) { setErr("La fecha de reinicio no puede ser anterior a la de paralización."); return; }
      Object.assign(d, { fecha_paralizacion: fPar, fecha_reinicio: fRei || null });
    }
    setBusy(true); setErr("");
    try { await ctx.guardarDet("con", "seg_contratos", fila && fila.id, d, it); onDone(); }
    catch (e) { setErr(segMsgError(e)); setBusy(false); }
  }
  return (
    <div className="dform">
      <Campo id="c-t" label="¿Qué quieres anotar?">
        <select id="c-t" value={tipo} disabled={!!fila} onChange={e => { setTipo(e.target.value); setErr(""); }}>
          {Object.entries(SEG_TIPO_CONTRATO).filter(([k]) => k !== "inicial" || !hayInicial).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </Campo>
      {tipo === "inicial" && <>
        <Campo id="c-i" label="Fecha de inicio"><input type="date" id="c-i" value={fIni} onChange={e => setFIni(e.target.value)} /></Campo>
        <Campo id="c-p" label="Plazo (días)"><input type="text" inputMode="numeric" id="c-p" value={plazo} onChange={e => setPlazo(e.target.value)} /></Campo>
        <Campo id="c-f" label="Fecha de término"><input type="date" id="c-f" value={fTer} onChange={e => setFTer(e.target.value)} /></Campo>
      </>}
      {tipo === "modificacion_plazo" && <>
        <Campo id="c-m" label="Fecha de la modificación"><input type="date" id="c-m" value={fMod} onChange={e => setFMod(e.target.value)} /></Campo>
        <Campo id="c-p" label="Días de aumento"><input type="text" inputMode="numeric" id="c-p" value={plazo} onChange={e => setPlazo(e.target.value)} /></Campo>
        <Campo id="c-f" label="Nueva fecha de término"><input type="date" id="c-f" value={fTer} onChange={e => setFTer(e.target.value)} /></Campo>
      </>}
      {tipo === "modificacion_monto" && <>
        <Campo id="c-m" label="Fecha de la modificación"><input type="date" id="c-m" value={fMod} onChange={e => setFMod(e.target.value)} /></Campo>
        <Campo id="c-$" label="Aumento o disminución del monto (pesos)" ayuda="Escribe el monto con signo menos si el contrato disminuye. Ejemplo: 2500000 o -1000000."><input type="text" id="c-$" value={monto} onChange={e => setMonto(e.target.value)} /></Campo>
      </>}
      {tipo === "paralizacion" && <>
        <Campo id="c-a" label="Fecha de paralización"><input type="date" id="c-a" value={fPar} onChange={e => setFPar(e.target.value)} /></Campo>
        <Campo id="c-r" label="Fecha de reinicio" ayuda="Déjala vacía si la obra sigue paralizada."><input type="date" id="c-r" value={fRei} onChange={e => setFRei(e.target.value)} /></Campo>
      </>}
      <Campo id="c-o" label="Nota (opcional)"><textarea id="c-o" value={nota} onChange={e => setNota(e.target.value)} /></Campo>
      {segErr(err)}
      <FormBotones busy={busy} onGuardar={guardar} onCancelar={onDone} />
    </div>
  );
}
function SecCon({ ctx, it }) {
  const [edit, setEdit] = useState(null);
  return (
    <>
      <p className="meta">Aquí va toda la información del contrato: el contrato inicial y cada modificación (plazo, monto, paralización).</p>
      {it.con.length === 0 && !edit && <p className="meta">Sin información de contrato anotada.</p>}
      <ul className="detlista">
        {it.con.map(r => (
          <DetFila key={r.id} onEdit={() => setEdit(r)} onQuitar={async () => { try { await ctx.quitarDet("con", "seg_contratos", r.id); } catch (e) { ctx.mostrarToast("No se pudo quitar: " + segMsgError(e)); } }}>
            {segTextoContrato(r)}
          </DetFila>
        ))}
      </ul>
      {edit ? <ConForm key={edit.id || "nuevo"} ctx={ctx} it={it} fila={edit.id ? edit : null} onDone={() => setEdit(null)} />
        : <button type="button" className="btn" onClick={() => setEdit({})}>+ Agregar contrato o modificación</button>}
    </>
  );
}

function EpForm({ ctx, it, fila, sugerido, onDone }) {
  const [numero, setNumero] = useState(fila ? String(fila.numero) : String(sugerido));
  const [fecha, setFecha] = useState(fila ? fila.fecha : segHoy());
  const [pct, setPct] = useState(fila ? String(fila.pct_avance).replace(".", ",") : "");
  const [nota, setNota] = useState(fila ? fila.nota || "" : "");
  const [aviso, setAviso] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function guardar() {
    const n = segEntero(numero), p = segNum(pct);
    if (!n || n < 1) { setErr("Indica el N° del estado de pago (1, 2, 3…)."); return; }
    if (!fecha) { setErr("Indica la fecha del estado de pago."); return; }
    if (fecha > segHoy()) { setErr("La fecha del estado de pago no puede ser futura."); return; }
    if (p == null || p < 0 || p > 100) { setErr("El porcentaje de avance debe estar entre 0 y 100."); return; }
    if (!aviso) {
      const otros = it.ep.filter(r => !fila || r.id !== fila.id);
      const choque = otros.find(r => (r.fecha < fecha && Number(r.pct_avance) > p) || (r.fecha > fecha && Number(r.pct_avance) < p));
      if (choque) { setAviso(`Ojo: el estado de pago N° ${choque.numero} (${fmtFecha(choque.fecha)}) tiene ${String(choque.pct_avance).replace(".", ",")}% y el avance no debería bajar con el tiempo. Revisa el dato; si está correcto, vuelve a guardar.`); return; }
    }
    setBusy(true); setErr("");
    try { await ctx.guardarDet("ep", "seg_estados_pago", fila && fila.id, { numero: n, fecha, pct_avance: p, nota: nota.trim() || null }, it); onDone(); }
    catch (e) { setErr(segMsgError(e)); setBusy(false); }
  }
  return (
    <div className="dform">
      <Campo id="e-n" label="N° del estado de pago"><input type="text" inputMode="numeric" id="e-n" value={numero} onChange={e => { setNumero(e.target.value); setAviso(""); }} /></Campo>
      <Campo id="e-f" label="Fecha del estado de pago"><input type="date" id="e-f" value={fecha} max={segHoy()} onChange={e => { setFecha(e.target.value); setAviso(""); }} /></Campo>
      <Campo id="e-p" label="Porcentaje de avance (%)" ayuda="Entre 0 y 100. Ejemplo: 45 o 45,5."><input type="text" inputMode="decimal" id="e-p" value={pct} onChange={e => { setPct(e.target.value); setAviso(""); }} /></Campo>
      <Campo id="e-o" label="Nota (opcional)"><textarea id="e-o" value={nota} onChange={e => setNota(e.target.value)} /></Campo>
      {aviso && <p className="meta" style={{ background: "var(--accent)", color: "var(--onaccent)", padding: 8, fontWeight: 700 }}>{aviso}</p>}
      {segErr(err)}
      <FormBotones busy={busy} onGuardar={guardar} onCancelar={onDone} texto={aviso ? "Guardar de todos modos" : "Guardar"} />
    </div>
  );
}
function SecEp({ ctx, it }) {
  const [edit, setEdit] = useState(null);
  const orden = it.ep.slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)) || a.numero - b.numero);
  return (
    <>
      <p className="meta">Una línea por cada estado de pago: su fecha y el porcentaje de avance de la obra.</p>
      {orden.length === 0 && !edit && <p className="meta">Sin estados de pago anotados.</p>}
      <ul className="detlista">
        {orden.map(r => (
          <DetFila key={r.id} onEdit={() => setEdit(r)} onQuitar={async () => { try { await ctx.quitarDet("ep", "seg_estados_pago", r.id); } catch (e) { ctx.mostrarToast("No se pudo quitar: " + segMsgError(e)); } }}>
            <b>Estado de pago N° {r.numero}</b>: {fmtFecha(r.fecha)} — avance {String(r.pct_avance).replace(".", ",")}%{r.nota ? ` (${r.nota})` : ""}
          </DetFila>
        ))}
      </ul>
      {edit ? <EpForm key={edit.id || "nuevo"} ctx={ctx} it={it} fila={edit.id ? edit : null} sugerido={orden.length ? Math.max(...orden.map(r => r.numero)) + 1 : 1} onDone={() => setEdit(null)} />
        : <button type="button" className="btn" onClick={() => setEdit({})}>+ Agregar estado de pago</button>}
    </>
  );
}

function HojaDetalle({ ctx, it }) {
  const etapa = it.cur ? it.cur.etapa : "licitacion";
  const [sec, setSec] = useState({ licitacion: "lic", adjudicado: "adj", contratado: "con", obras: "ep", cierre: "ep" }[etapa] || "lic");
  const secciones = [["lic", "1. En licitación"], ["adj", "2. Adjudicado"], ["con", "3. Contratado"], ["ep", "4. En obras"]];
  return (
    <Hoja titulo="Detalle del proyecto" onClose={() => ctx.setHoja(null)}>
      <h2>{it.p.nombre}</h2>
      <p className="meta">{it.p.comuna} · {it.p.programa}</p>
      <p className="meta">Todo esto es opcional. Anota lo que tengas; puedes volver cuando haya novedades.</p>
      {secciones.map(([k, l]) => (
        <div key={k} className="dsec">
          <button type="button" className="dtit" aria-expanded={sec === k} onClick={() => setSec(sec === k ? "" : k)}>{sec === k ? "▼" : "▶"} {l}</button>
          {sec === k && <div className="dbody">
            {k === "lic" && <SecLic ctx={ctx} it={it} />}
            {k === "adj" && <SecAdj ctx={ctx} it={it} />}
            {k === "con" && <SecCon ctx={ctx} it={it} />}
            {k === "ep" && <SecEp ctx={ctx} it={it} />}
          </div>}
        </div>
      ))}
      <div className="actions"><button type="button" className="btn main" onClick={() => ctx.setHoja(null)}>Cerrar</button></div>
    </Hoja>
  );
}

// Marcar proyectos "Chile Despega" pegando una lista de códigos (solo gabinete)
function HojaCD({ ctx }) {
  const { datos, fetcher, setHoja, mostrarToast, patchPrVarios } = ctx;
  const [txt, setTxt] = useState("");
  const [reemplazar, setReemplazar] = useState(false);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const porCodigo = {};
  for (const p of datos.pr) if (p.codigo) porCodigo[p.codigo] = p;
  const codigos = [...new Set(txt.split(/[\n\r\t;]+/).map(s => s.trim()).filter(Boolean))];
  const hallados = codigos.filter(c => porCodigo[c]), noHallados = codigos.filter(c => !porCodigo[c]);
  const aMarcar = hallados.map(c => porCodigo[c]).filter(p => !p.chile_despega);
  const idsLista = new Set(hallados.map(c => porCodigo[c].id));
  const aQuitar = reemplazar ? datos.pr.filter(p => p.chile_despega && !idsLista.has(p.id)) : [];
  async function parchar(ids, valor) {
    for (let i = 0; i < ids.length; i += 150) await fetcher.updateWhere("seg_proyectos", `id=in.(${ids.slice(i, i + 150).join(",")})`, { chile_despega: valor });
  }
  async function aplicar() {
    setBusy(true); setErr("");
    try {
      await parchar(aMarcar.map(p => p.id), true); patchPrVarios(aMarcar.map(p => p.id), true);
      await parchar(aQuitar.map(p => p.id), false); patchPrVarios(aQuitar.map(p => p.id), false);
      setHoja(null); mostrarToast(`Listo: ${aMarcar.length} marcados${aQuitar.length ? `, ${aQuitar.length} desmarcados` : ""}.`);
    } catch (e) { setErr(segMsgError(e)); setBusy(false); }
  }
  return (
    <Hoja titulo="Marcar proyectos Chile Despega" onClose={() => setHoja(null)}>
      <h2>Marcar proyectos Chile Despega</h2>
      <p className="meta">Pega aquí los códigos de los proyectos (uno por línea; puedes copiar la columna desde Excel). Hoy hay {datos.pr.filter(p => p.chile_despega).length} marcados.</p>
      <div className="fld"><label htmlFor="cd-t">Códigos de proyecto</label><textarea id="cd-t" style={{ minHeight: 160 }} value={txt} onChange={e => setTxt(e.target.value)} /></div>
      {codigos.length > 0 && <p className="meta">{codigos.length} códigos leídos: <b>{hallados.length}</b> existen en el panel ({aMarcar.length} se marcarán ahora, el resto ya estaba marcado) y <b>{noHallados.length}</b> no existen{noHallados.length > 0 ? `: ${noHallados.slice(0, 8).join(", ")}${noHallados.length > 8 ? "…" : ""}` : ""}.</p>}
      <label className="opt" style={{ minHeight: 44 }}><input type="checkbox" checked={reemplazar} onChange={e => setReemplazar(e.target.checked)} /><span>Quitar la marca a los que no estén en esta lista{reemplazar && aQuitar.length > 0 ? ` (se desmarcarán ${aQuitar.length})` : ""}</span></label>
      {segErr(err)}
      <div className="actions"><button type="button" className="btn main" disabled={busy || (aMarcar.length === 0 && aQuitar.length === 0)} onClick={aplicar}>{busy ? "Guardando…" : "Aplicar"}</button><button type="button" className="btn" onClick={() => setHoja(null)}>Cancelar</button></div>
    </Hoja>
  );
}

function SeguimientoInner() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const [creds, setCreds] = useState(envUrl && envKey ? { url: envUrl, key: envKey } : null);
  const fetcher = useMemo(() => (creds ? makeSupabaseFetcher(creds.url, creds.key) : null), [creds]);
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);
  const [as, setAs] = useState(() => { try { return localStorage.getItem("seg-as") || ""; } catch (e) { return ""; } });
  const [drill, setDrill] = useState(null);
  const [flt, setFlt] = useState("all");
  const [q, setQ] = useState("");
  const [com, setCom] = useState("");
  const [lim, setLim] = useState(25);
  const [hoja, setHoja] = useState(null);
  const [soloCD, setSoloCD] = useState(false);
  const [cdRegion, setCdRegion] = useState(null); // región abierta dentro de «Proyectos por etapa»
  const [toast, setToast] = useState(null); // { msg, undo }
  const toastTimer = React.useRef(null);

  useEffect(() => {
    if (!fetcher) return;
    let vivo = true;
    (async () => {
      try {
        const opc = (t) => fetcher.fetchTable(t, "id").catch(() => []); // tablas de detalle: si aún no existen, el resto funciona igual
        const [reg, pr, an, lic, con, ep] = await Promise.all([fetcher.fetchTable("regiones"), fetcher.fetchTable("seg_proyectos", "id"), fetcher.fetchTable("seg_anotaciones", "id"), opc("seg_licitaciones"), opc("seg_contratos"), opc("seg_estados_pago")]);
        if (vivo) { setDatos({ reg, pr, an, lic, con, ep }); setError(null); }
      } catch (e) { if (vivo) setError(segMsgError(e)); }
    })();
    return () => { vivo = false; };
  }, [fetcher, tick]);
  useEffect(() => {
    const f = (e) => { if (e.key === "Escape") setHoja(null); };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);

  const regs = useMemo(() => { const m = {}; if (datos) for (const r of datos.reg) m[r.id] = r; return m; }, [datos]);
  const labelReg = (id) => (regs[id] && regs[id].label) || SEG_LABEL_FALLBACK[id] || id;
  const nombreJefe = (id) => (regs[id] && regs[id].jefe_urs) || null;
  const quien = (a) => (a === "gab" ? "Gabinete" : (nombreJefe(a) ? `${nombreJefe(a)} (${labelReg(a)})` : `Jefe/a URS · Región de ${labelReg(a)}`));

  const items = useMemo(() => {
    if (!datos) return [];
    const por = {};
    for (const a of datos.an) (por[a.proyecto_id] = por[a.proyecto_id] || []).push(a);
    const grupo = (arr) => { const m = {}; for (const r of arr || []) if (!r.anulada) (m[r.proyecto_id] = m[r.proyecto_id] || []).push(r); return m; };
    const gLic = grupo(datos.lic), gCon = grupo(datos.con), gEp = grupo(datos.ep);
    return datos.pr.map(p => {
      const lic = (gLic[p.id] || []).slice().sort((a, b) => a.numero - b.numero || a.id - b.id);
      const con = (gCon[p.id] || []).slice().sort((a, b) => String(a.creado_en).localeCompare(String(b.creado_en)) || a.id - b.id);
      const ep = gEp[p.id] || [];
      const hist = (por[p.id] || []).slice().sort((x, y) => String(x.creado_en).localeCompare(String(y.creado_en)) || x.id - y.id);
      let cur = null;
      for (const a of hist) if ((a.tipo || "avance") === "avance" && !a.anulada) cur = a;
      const est = !cur ? "sin" : (segDias(cur.fecha) > SEG_DIAS_DESACTUALIZADO ? "vie" : "ok");
      const retiro = p.activo === false ? hist.filter(a => a.tipo === "retiro" && !a.anulada).pop() || null : null;
      return { p, hist, cur, est, retiro, activo: p.activo !== false, lic, con, ep, det: segResumenDetalle(p, lic, con, ep) };
    });
  }, [datos]);

  if (!creds) return <ConnectScreen onConnect={(url, key) => setCreds({ url, key })} />;
  if (error && !datos) return (
    <div className="seg"><style>{SEG_CSS}</style><div className="wrap"><h2>No se pudo cargar el seguimiento</h2><p className="meta">{error}</p>
      <button type="button" className="btn main" onClick={() => { setError(null); setTick(t => t + 1); }}>Reintentar</button></div></div>
  );
  if (!datos) return <div className="seg"><style>{SEG_CSS}</style><div className="wrap"><p>Cargando seguimiento…</p></div></div>;

  const esGab = as === "gab";
  const asValido = esGab || SEG_ORDEN.includes(as);
  const region = esGab ? drill : as;

  const elegir = (a) => { try { localStorage.setItem("seg-as", a); } catch (e) { /* sin almacenamiento */ } setAs(a); setDrill(null); setLim(25); setFlt("all"); setQ(""); setCom(""); window.scrollTo(0, 0); };
  const cambiar = () => { try { localStorage.removeItem("seg-as"); } catch (e) { /* ignorar */ } setAs(""); setDrill(null); setHoja(null); };
  const mostrarToast = (msg, undo) => { setToast({ msg, undo }); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 8000); };
  const recargar = () => setTick(t => t + 1);
  const addAn = (row) => setDatos(d => ({ ...d, an: [...d.an, row] }));
  const patchAn = (id, patch) => setDatos(d => ({ ...d, an: d.an.map(a => (a.id === id ? { ...a, ...patch } : a)) }));
  const patchPr = (id, patch) => setDatos(d => ({ ...d, pr: d.pr.map(p => (p.id === id ? { ...p, ...patch } : p)) }));
  const perfil = esGab ? "gabinete" : as;
  const autor = quien(as);

  async function nuevaAnotacion(it, campos) {
    const [fila] = await fetcher.insertRow("seg_anotaciones", { proyecto_id: it.p.id, autor, perfil, ...campos });
    addAn(fila);
    return fila;
  }
  const addDet = (key, row) => setDatos(d => ({ ...d, [key]: [...(d[key] || []), row] }));
  const patchDet = (key, id, patch) => setDatos(d => ({ ...d, [key]: (d[key] || []).map(r => (r.id === id ? { ...r, ...patch } : r)) }));
  const patchPrVarios = (ids, valor) => setDatos(d => { const set = new Set(ids); return { ...d, pr: d.pr.map(p => (set.has(p.id) ? { ...p, chile_despega: valor } : p)) }; });
  async function guardarDet(key, tabla, id, payload, it) {
    const marca = { modificado_por: autor, modificado_en: new Date().toISOString() };
    if (id) {
      const [fila] = await fetcher.updateRow(tabla, id, { ...payload, ...marca });
      if (!fila) throw new Error("No se pudo guardar el cambio (sin permiso en la base de datos).");
      patchDet(key, id, fila);
    } else {
      const [fila] = await fetcher.insertRow(tabla, { proyecto_id: it.p.id, autor, ...payload });
      if (!fila) throw new Error("No se pudo guardar (sin permiso en la base de datos).");
      addDet(key, fila);
    }
  }
  async function quitarDet(key, tabla, id) {
    const [fila] = await fetcher.updateRow(tabla, id, { anulada: true, modificado_por: autor, modificado_en: new Date().toISOString() });
    if (!fila) throw new Error("sin permiso en la base de datos");
    patchDet(key, id, { anulada: true });
  }
  async function guardarAdj(it, patch) {
    const [fila] = await fetcher.updateRow("seg_proyectos", it.p.id, patch);
    if (!fila) throw new Error("No se pudo guardar (sin permiso en la base de datos).");
    patchPr(it.p.id, patch);
  }
  async function marcarCD(it) {
    try {
      const valor = !it.p.chile_despega;
      const [fila] = await fetcher.updateRow("seg_proyectos", it.p.id, { chile_despega: valor });
      if (!fila) throw new Error("sin permiso en la base de datos");
      patchPr(it.p.id, { chile_despega: valor });
    } catch (e) { mostrarToast("No se pudo cambiar la marca: " + segMsgError(e)); }
  }
  async function avanzar(it) {
    const i = it.cur ? SEG_ETAPA_IDX[it.cur.etapa] : -1;
    if (i < 0 || i >= SEG_ETAPAS.length - 1) return;
    const sig = SEG_ETAPAS[i + 1];
    try {
      const fila = await nuevaAnotacion(it, { tipo: "avance", etapa: sig.id, fecha: segHoy(), nota: null });
      mostrarToast(`Listo: ahora está en «${sig.n}».`, async () => { try { await fetcher.updateRow("seg_anotaciones", fila.id, { anulada: true }); patchAn(fila.id, { anulada: true }); } catch (e) { mostrarToast("No se pudo deshacer: " + segMsgError(e)); } });
    } catch (e) { mostrarToast("No se pudo guardar: " + segMsgError(e)); }
  }
  async function reintegrar(it) {
    try {
      await nuevaAnotacion(it, { tipo: "reintegro", etapa: null, fecha: segHoy(), nota: null });
      await fetcher.updateRow("seg_proyectos", it.p.id, { activo: true });
      patchPr(it.p.id, { activo: true });
      mostrarToast("Proyecto reintegrado al seguimiento.");
    } catch (e) { mostrarToast("No se pudo reintegrar: " + segMsgError(e)); }
  }

  // ---------- Pantallas ----------
  const nCD = items.filter(x => x.activo && x.p.chile_despega).length;
  const activos = items.filter(x => x.activo);
  const retirados = items.filter(x => !x.activo);

  const Puerta = () => (
    <>
      <h2>¿Quién eres?</h2>
      <p className="meta">Elige tu nombre para entrar.</p>
      <div className="gate">
        <button type="button" className="btn who-opt main" onClick={() => elegir("gab")}>Gabinete</button>
        {SEG_ORDEN.map(id => (
          <button key={id} type="button" className="btn who-opt" onClick={() => elegir(id)}>
            {nombreJefe(id) ? <>{nombreJefe(id)}<br /><small className="meta">Región de {labelReg(id)}</small></> : <>Jefe/a URS · Región de {labelReg(id)}</>}
          </button>
        ))}
      </div>
    </>
  );

  const Resumen = () => {
    const por = {};
    SEG_ORDEN.forEach(id => { por[id] = { t: 0, sin: 0, vie: 0, ok: 0, et: {} }; });
    for (const x of activos) { const b = por[x.p.region_id]; if (!b) continue; b.t++; b[x.est]++; if (x.cur) b.et[x.cur.etapa] = (b.et[x.cur.etapa] || 0) + 1; }
    const T = { t: 0, sin: 0, vie: 0, ok: 0 };
    SEG_ORDEN.forEach(id => ["t", "sin", "vie", "ok"].forEach(k => { T[k] += por[id][k]; }));
    // La tabla «por etapa» puede filtrarse a Chile Despega; los números de arriba no
    const porT = {};
    SEG_ORDEN.forEach(id => { porT[id] = { t: 0, sin: 0, et: {} }; });
    for (const x of activos) { if (soloCD && !x.p.chile_despega) continue; const b = porT[x.p.region_id]; if (!b) continue; b.t++; if (x.est === "sin") b.sin++; if (x.cur) b.et[x.cur.etapa] = (b.et[x.cur.etapa] || 0) + 1; }
    const TT = { t: 0, sin: 0 };
    SEG_ORDEN.forEach(id => { TT.t += porT[id].t; TT.sin += porT[id].sin; });
    return (
      <>
        <div className="kpis">
          <div className="kpi"><b>{T.t}</b><span>proyectos en seguimiento</span></div>
          <div className="kpi"><b>{T.ok}</b><span>al día (actualizados en los últimos {SEG_DIAS_DESACTUALIZADO} días)</span></div>
          <div className="kpi"><b>{T.vie}</b><span>desactualizados (más de {SEG_DIAS_DESACTUALIZADO} días sin anotar)</span></div>
          <div className="kpi"><b>{T.sin}</b><span>sin actualizar (nunca anotados)</span></div>
        </div>
        <div className="actions" style={{ marginBottom: 18 }}>
          <button type="button" className="btn main" onClick={() => setHoja({ tipo: "carga" })}>Cargar proyectos desde Excel</button>
          <button type="button" className="btn" onClick={() => setHoja({ tipo: "agregar" })}>Agregar un proyecto a mano</button>
          {retirados.length > 0 && <button type="button" className="btn" onClick={() => { setDrill("__ret"); setFlt("ret"); }}>Ver retirados ({retirados.length})</button>}
        </div>
        <h2>Avance de actualización por región</h2>
        <p className="meta">Toca una región para ver sus proyectos.</p>
        <div className="bars">
          {SEG_ORDEN.map(id => { const b = por[id], pc = b.t ? Math.round(100 * b.ok / b.t) : 0; return (
            <div key={id} className="bar" data-drill="1" onClick={() => { setDrill(id); setFlt("all"); setLim(25); setQ(""); setCom(""); window.scrollTo(0, 0); }}>
              <button type="button">{labelReg(id)} · {b.ok} de {b.t}</button>
              <div className="track" aria-hidden="true"><div className="fill" style={{ width: pc + "%" }} /></div>
              <b>{pc}%</b>
            </div>); })}
        </div>
        <h2>Proyectos por etapa de seguimiento{soloCD ? " · solo Chile Despega" : ""}</h2>
        <div className="chips" role="group" aria-label="Proyectos por etapa">
          <button type="button" className="chip" aria-pressed={!soloCD} onClick={() => { setSoloCD(false); setCdRegion(null); }}>Todos los proyectos</button>
          <button type="button" className="chip" aria-pressed={soloCD} onClick={() => { setSoloCD(true); setCdRegion(null); }}>Proyectos Chile Despega ({nCD})</button>
          {esGab && <button type="button" className="btn sm" onClick={() => setHoja({ tipo: "cd" })}>Marcar proyectos Chile Despega</button>}
        </div>
        {soloCD && nCD === 0 && <p className="meta">Todavía no hay proyectos marcados como Chile Despega.{esGab ? " Usa «Marcar proyectos Chile Despega»." : ""}</p>}
        {soloCD && nCD > 0 && <p className="meta">Toca una región de la tabla para ver aquí sus proyectos Chile Despega.</p>}
        <div className="tw"><table>
          <thead><tr><th>Región</th><th>Total</th><th>Sin actualizar</th>{SEG_ETAPAS.map(e => <th key={e.id}>{e.n}</th>)}</tr></thead>
          <tbody>
            {SEG_ORDEN.map(id => { const b = porT[id]; return (
              <tr key={id} data-drill="1" aria-selected={soloCD && cdRegion === id} style={soloCD && cdRegion === id ? { boxShadow: "inset 0 -2px 0 var(--secondary)", background: "var(--panel)" } : undefined}
                onClick={() => { if (soloCD) { setCdRegion(cdRegion === id ? null : id); setLim(25); setTimeout(() => { const el = document.getElementById("seg-cd-lista"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 80); } else { setDrill(id); setFlt("all"); setLim(25); setQ(""); setCom(""); window.scrollTo(0, 0); } }}>
                <td><button type="button">{labelReg(id)}</button></td><td>{b.t}</td><td>{b.sin}</td>{SEG_ETAPAS.map(e => <td key={e.id}>{b.et[e.id] || 0}</td>)}
              </tr>); })}
            <tr><td><b>Total</b></td><td><b>{TT.t}</b></td><td><b>{TT.sin}</b></td>{SEG_ETAPAS.map(e => <td key={e.id}><b>{SEG_ORDEN.reduce((a, id) => a + (porT[id].et[e.id] || 0), 0)}</b></td>)}</tr>
          </tbody>
        </table></div>
        {soloCD && cdRegion && (() => {
          const lista = activos.filter(x => x.p.region_id === cdRegion && x.p.chile_despega);
          return (
            <div id="seg-cd-lista" style={{ marginTop: 16 }}>
              <h2>Chile Despega · Región de {labelReg(cdRegion)} ({lista.length})</h2>
              <div className="list">
                {lista.length === 0 ? <div className="empty">Esta región no tiene proyectos Chile Despega.</div> : lista.slice(0, lim).map(it => Tarjeta({ it }))}
                {lista.length > lim && <div className="more"><button type="button" className="btn" onClick={() => setLim(l => l + 25)}>Ver {Math.min(25, lista.length - lim)} más (faltan {lista.length - lim})</button></div>}
              </div>
              <div className="actions" style={{ marginTop: 10 }}>
                <button type="button" className="btn" onClick={() => setCdRegion(null)}>Cerrar lista</button>
                <button type="button" className="btn" onClick={() => { setDrill(cdRegion); setFlt("all"); setLim(25); setQ(""); setCom(""); window.scrollTo(0, 0); }}>Ver todos los proyectos de la región</button>
              </div>
            </div>
          );
        })()}
      </>
    );
  };

  const Tarjeta = ({ it }) => {
    const { p, cur, est } = it;
    const i = cur ? SEG_ETAPA_IDX[cur.etapa] : -1;
    const sig = i >= 0 && i < SEG_ETAPAS.length - 1 ? SEG_ETAPAS[i + 1] : null;
    if (!it.activo) return (
      <article key={p.id} className="card">
        <h3>{p.nombre}</h3>
        <div className="meta">{p.comuna} · {p.programa}{SEG_LINEA[p.programa] && <> <span className="tag">{SEG_LINEA[p.programa]}</span></>} · {segClp(p.monto_subdere)} · {p.codigo ? "Código " + p.codigo : "Sin código"}</div>
        <div className="meta">Retirado del seguimiento{it.retiro ? `: ${fmtFecha(it.retiro.fecha)} por ${it.retiro.autor}${it.retiro.nota ? `. Motivo: ${it.retiro.nota}` : ""}` : ""}</div>
        <div className="actions"><button type="button" className="btn go" onClick={() => reintegrar(it)}>Reintegrar al seguimiento</button><button type="button" className="btn" onClick={() => setHoja({ tipo: "historial", id: p.id })}>Ver historial</button></div>
      </article>
    );
    return (
      <article key={p.id} className={"card " + est}>
        <h3>{p.nombre}</h3>
        <div className="meta">{p.comuna} · {p.programa}{SEG_LINEA[p.programa] && <> <span className="tag">{SEG_LINEA[p.programa]}</span></>} · {segClp(p.monto_subdere)} · {p.codigo ? "Código " + p.codigo : <span className="pill sin">Sin código, completar por URS</span>}</div>
        <div className="row"><span className="meta">En qué está:</span><span className={"pill " + est}>{cur ? SEG_ETAPAS[SEG_ETAPA_IDX[cur.etapa]].n : "Sin actualizar"}</span>{p.chile_despega && <span className="tag">Chile Despega</span>}</div>
        {it.det.length > 0 && <div className="resumen-det">{it.det.map((t, k) => <div key={k} className="meta">{t}</div>)}</div>}
        {cur && <div className="meta">Última anotación: {fmtFecha(cur.fecha)} (hace {segDias(cur.fecha)} días){cur.autor ? ` · por ${cur.autor}` : ""}{cur.nota ? `. Nota: ${cur.nota}` : ""}</div>}
        <div className="actions">
          {sig && <button type="button" className="btn go" onClick={() => avanzar(it)}>Pasar a: {sig.n}</button>}
          <button type="button" className="btn main" onClick={() => setHoja({ tipo: "actualizar", id: p.id })}>Actualizar Estado del Proyecto</button>
          <button type="button" className="btn" onClick={() => setHoja({ tipo: "detalle", id: p.id })}>Detalle: licitación, contrato y obras</button>
          {!p.codigo && <button type="button" className="btn" onClick={() => setHoja({ tipo: "actualizar", id: p.id, foco: true })}>Ingresar código</button>}
          {esGab && <button type="button" className="btn sm" onClick={() => marcarCD(it)}>{p.chile_despega ? "Quitar de Chile Despega" : "Marcar Chile Despega"}</button>}
          {esGab && <button type="button" className="btn sm" onClick={() => setHoja({ tipo: "retiro", id: p.id })}>Retirar del seguimiento</button>}
        </div>
      </article>
    );
  };

  const Lista = () => {
    const base = region === "__ret" ? retirados : (flt === "ret" ? retirados.filter(x => x.p.region_id === region) : activos.filter(x => x.p.region_id === region));
    const todas = (region === "__ret" ? retirados : items.filter(x => x.p.region_id === region));
    const act = todas.filter(x => x.activo);
    const cnt = { sin: 0, vie: 0, ok: 0 };
    act.forEach(x => { cnt[x.est]++; });
    const comunas = [...new Set(todas.map(x => x.p.comuna))].sort((a, b) => a.localeCompare(b, "es"));
    const ql = q.trim().toLowerCase();
    const filtrados = base.filter(x => (!com || x.p.comuna === com) &&
      (flt === "all" || flt === "ret" || (flt === "nocode" ? !x.p.codigo : x.est === flt)) &&
      (!ql || `${x.p.nombre} ${x.p.comuna} ${x.p.codigo || ""}`.toLowerCase().includes(ql)));
    const chips = [["all", "Todos"], ["sin", "Sin actualizar"], ["vie", "Desactualizados"], ["ok", "Al día"], ["nocode", "Sin código"]];
    if (esGab) chips.push(["ret", `Retirados (${todas.filter(x => !x.activo).length})`]);
    const titulo = region === "__ret" ? "Proyectos retirados del seguimiento" : `Región de ${labelReg(region)}`;
    return (
      <>
        {esGab && <p><button type="button" className="btn" onClick={() => { setDrill(null); setFlt("all"); window.scrollTo(0, 0); }}>← Volver al resumen</button></p>}
        <h2>{titulo}</h2>
        {region !== "__ret" && <div className="kpis">
          <div className="kpi"><b>{act.length}</b><span>proyectos en seguimiento</span></div>
          <div className="kpi"><b>{cnt.sin}</b><span>sin actualizar</span></div>
          <div className="kpi"><b>{cnt.vie}</b><span>desactualizados (más de {SEG_DIAS_DESACTUALIZADO} días)</span></div>
          <div className="kpi"><b>{cnt.ok}</b><span>al día</span></div>
        </div>}
        {region !== "__ret" && (
          <div className="actions" style={{ marginBottom: 12 }}>
            <button type="button" className="btn" onClick={() => setHoja({ tipo: "agregar", region })}>Agregar un proyecto a mano</button>
            <button type="button" className="btn" onClick={() => setHoja({ tipo: "carga" })}>Cargar proyectos desde Excel</button>
          </div>
        )}
        {region !== "__ret" && <div className="chips" role="group" aria-label="Mostrar">
          {chips.map(([k, l]) => <button key={k} type="button" className="chip" aria-pressed={flt === k} onClick={() => { setFlt(k); setLim(25); }}>{l}</button>)}
        </div>}
        <div className="filters">
          <input type="search" placeholder="Buscar por nombre, comuna o código" value={q} onChange={e => { setQ(e.target.value); setLim(25); }} aria-label="Buscar" />
          <select aria-label="Comuna" value={com} onChange={e => { setCom(e.target.value); setLim(25); }}>
            <option value="">Todas las comunas</option>
            {comunas.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <p className="meta">{filtrados.length} proyectos</p>
        <div className="list">
          {filtrados.length === 0 ? <div className="empty">No hay proyectos con este filtro.</div> : filtrados.slice(0, lim).map(it => Tarjeta({ it }))}
          {filtrados.length > lim && <div className="more"><button type="button" className="btn" onClick={() => setLim(l => l + 25)}>Ver {Math.min(25, filtrados.length - lim)} más (faltan {filtrados.length - lim})</button></div>}
        </div>
      </>
    );
  };

  const ctx = { datos, esGab, as, autor, fetcher, labelReg, recargar, setHoja, mostrarToast, nuevaAnotacion, patchAn, patchPr, guardarDet, quitarDet, guardarAdj, patchPrVarios };
  const hojaItem = hoja && hoja.id != null ? items.find(x => x.p.id === hoja.id) : null;

  return (
    <div className="seg">
      <style>{SEG_CSS}</style>
      <div className="wrap">
        <div className="top"><h1>Seguimiento de proyectos asignados</h1></div>
        {asValido && (
          <div className="who">
            <span>Estás como: <b>{quien(as)}</b></span>
            <button type="button" className="btn sm" onClick={cambiar}>Cambiar</button>
            {esGab && <button type="button" className="btn sm" onClick={() => { window.location.hash = ""; }}>← Volver al panel de gestión</button>}
          </div>
        )}
        {error && <p className="meta" style={{ color: "var(--alert)", fontWeight: 700 }}>No se pudo actualizar: {error}</p>}
        {!asValido ? Puerta() : (esGab && !drill ? Resumen() : Lista())}
        <p className="foot">Fuente de los proyectos: listado de SUBDERE en línea. Las etapas las anotan los jefes URS y el gabinete; no reemplazan a SUBDERE en línea. «Desactualizado» = más de {SEG_DIAS_DESACTUALIZADO} días sin anotar avance.</p>
      </div>
      {hoja && hoja.tipo === "actualizar" && hojaItem && <HojaActualizar ctx={ctx} it={hojaItem} foco={hoja.foco} />}
      {hoja && hoja.tipo === "retiro" && hojaItem && <HojaRetiro ctx={ctx} it={hojaItem} />}
      {hoja && hoja.tipo === "historial" && hojaItem && <HojaHistorial ctx={ctx} it={hojaItem} />}
      {hoja && hoja.tipo === "agregar" && <HojaAgregar ctx={ctx} regionInicial={hoja.region} />}
      {hoja && hoja.tipo === "carga" && <HojaCarga ctx={ctx} />}
      {hoja && hoja.tipo === "detalle" && hojaItem && <HojaDetalle ctx={ctx} it={hojaItem} />}
      {hoja && hoja.tipo === "cd" && <HojaCD ctx={ctx} />}
      {toast && (
        <div className="toast"><span>{toast.msg}</span>
          {toast.undo && <button type="button" onClick={() => { const u = toast.undo; setToast(null); u(); }}>Deshacer</button>}</div>
      )}
    </div>
  );
}

function PanelURSInner() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const [creds, setCreds] = useState(envUrl && envKey ? { url: envUrl, key: envKey } : null); // { url, key } o null
  const fetcher = useMemo(() => (creds ? makeSupabaseFetcher(creds.url, creds.key) : null), [creds]);
  const [refreshTick, setRefreshTick] = useState(0);
  const { regions, error, warnings } = useRegionsFromSupabase(fetcher, !!creds, refreshTick);
  const [region, setRegion] = useState(null);

  if (!creds) return <ConnectScreen onConnect={(url, key) => setCreds({ url, key })} />;
  if (error) return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 500, margin: "60px auto", textAlign: "center" }}>
      <div style={{ color: RED, fontWeight: 700, marginBottom: 8 }}>No se pudo cargar desde Supabase</div>
      <div style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>{error}</div>
      <button onClick={() => setCreds(null)} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: NAVY, color: "white", cursor: "pointer" }}>Volver a intentar</button>
    </div>
  );
  if (!regions) return <div style={{ padding: 20, fontFamily: "Arial", color: NAVY }}>Cargando datos desde Supabase…</div>;
  const activeRegion = region || Object.keys(regions)[0];
  const data = regions[activeRegion];

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", background: "#F7F9FB", minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: 1.5 }}>SUBDERE — DIVISIÓN DE MUNICIPALIDADES</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: "2px 0 0" }}>Panel de Gestión URS</h1>
            <div style={{ fontSize: 12, color: "#666" }}>Prototipo — cobertura: 3 de 16 regiones (datos verificados a ago-2026)</div>
            <button onClick={() => { window.location.hash = "seguimiento"; window.scrollTo(0, 0); }} style={{ marginTop: 8, border: `2px solid ${NAVY}`, background: "white", color: NAVY, cursor: "pointer", padding: "7px 14px", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>Seguimiento de proyectos →</button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(regions).map(([key, r]) => (
              <button key={key} onClick={() => setRegion(key)} style={{
                border: "none", cursor: "pointer", padding: "8px 14px", borderRadius: 8, fontWeight: 700, fontSize: 13, whiteSpace: "nowrap",
                background: activeRegion === key ? NAVY : "white", color: activeRegion === key ? "white" : NAVY,
                boxShadow: activeRegion === key ? "none" : "0 0 0 1px " + LIGHTGRAY,
              }}>{r.label}</button>
            ))}
          </div>
        </div>

        <div style={{ background: AMBER_BG, border: "1px solid #F0D48A", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12.5, color: AMBER_TXT }}>
          ⏳ Cobertura desigual entre regiones: todas tienen datos de rendición (S2), pero PMU/PMB (S7), viáticos (S6), deuda flotante (S8) e IRAL (S10) solo están cargados para Valparaíso, Atacama y Magallanes por ahora.
        </div>

        {warnings.length > 0 && (
          <div style={{ background: "#FBDADA", border: "1px solid #F5B5B5", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: RED }}>
            ⚠️ Algunas tablas no se pudieron leer (se muestran como "sin datos" en vez de bloquear el panel):
            <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
              {warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        <RegionPanel data={data} fetcher={fetcher} regionId={activeRegion} onDataChanged={() => setRefreshTick(t => t + 1)} />
      </div>
    </div>
  );
}

export default function PanelURS() {
  // La sección "Seguimiento de proyectos" vive en la misma dirección con #seguimiento
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const f = () => setHash(window.location.hash);
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return (
    <ErrorBoundary>
      {hash === "#seguimiento" ? <SeguimientoInner /> : <PanelURSInner />}
    </ErrorBoundary>
  );
}
