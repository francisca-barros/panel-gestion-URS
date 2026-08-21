import React, { useState, useEffect, useMemo } from "react";

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
      { corte: "27-jul-2026", transferido: 34960, pendiente: 12944, pct: 37.0 },
      { corte: "27-feb-2026", transferido: 45797, pendiente: 23849, pct: 52.1 },
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

function DeltaBadge({ curr, prev }) {
  if (prev === null || prev === undefined) return <span style={{ fontSize: 11, color: "#999" }}>sin corte anterior</span>;
  const diff = curr - prev;
  if (Math.abs(diff) < 0.05) return <span style={{ fontSize: 11, color: "#888" }}>≈ igual que el mes pasado</span>;
  const faster = diff < 0; // menos días = más rápido
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: faster ? GREEN_TXT : RED }}>
      {faster ? "▼" : "▲"} {Math.abs(diff).toFixed(1)}d {faster ? "más rápido" : "más lento"} vs. mes pasado ({prev.toFixed(1)}d)
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
      <div style={{ marginBottom: 10 }}><DeltaBadge curr={data.realT} prev={data.prevRealT} /></div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, color: "#666" }}>
        <span>Financiera</span><span>Meta {data.metaF.toFixed(1)}d</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: okF ? GREEN_TXT : RED }}>{data.realF.toFixed(1)} días</div>
      <div><DeltaBadge curr={data.realF} prev={data.prevRealF} /></div>
    </div>
  );
}

function DonutMini({ cerrados, enEjecucion, otros, total }) {
  const pC = (cerrados / total) * 100, pE = (enEjecucion / total) * 100, pO = (otros / total) * 100;
  const seg = (start, val, color) => {
    const circumference = 2 * Math.PI * 40;
    const len = (val / 100) * circumference;
    return <circle key={color} r="40" cx="50" cy="50" fill="transparent" stroke={color} strokeWidth="16"
      strokeDasharray={`${len} ${circumference - len}`} strokeDashoffset={-((start / 100) * circumference)} transform="rotate(-90 50 50)" />;
  };
  return (
    <svg width="110" height="110" viewBox="0 0 100 100">
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

function CoberturaEditor({ regionId, rows, fetcher, onChanged }) {
  const [form, setForm] = useState({ comuna: "", fecha_visita: "", visitado_por: "", notas: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function addRow() {
    if (!form.comuna.trim() || !form.fecha_visita) return;
    setBusy(true); setErr(null);
    try {
      await fetcher.insertRow("cobertura_visitas", { region_id: regionId, comuna: form.comuna, fecha_visita: form.fecha_visita, visitado_por: form.visitado_por || null, notas: form.notas || null });
      setForm({ comuna: "", fecha_visita: "", visitado_por: "", notas: "" });
      onChanged();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function removeRow(id) {
    try { await fetcher.deleteRow("cobertura_visitas", id); onChanged(); }
    catch (e) { setErr(e.message); }
  }

  const comunasUnicas = new Set(rows.map(r => r.comuna));

  return (
    <div>
      {err && <div style={{ color: RED, fontSize: 12, marginBottom: 8 }}>Error: {err}</div>}
      <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
        <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 12, flex: 1 }}>
          <div style={{ fontSize: 11, color: "#666" }}>Comunas distintas visitadas</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: NAVY }}>{comunasUnicas.size}</div>
        </div>
        <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 12, flex: 1 }}>
          <div style={{ fontSize: 11, color: "#666" }}>Visitas totales registradas</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: NAVY }}>{rows.length}</div>
        </div>
      </div>

      <div style={{ border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, overflow: "hidden" }}>
        {rows.length === 0 && <div style={{ padding: 14, fontSize: 13, color: "#888" }}>Sin visitas registradas todavía.</div>}
        {rows.map((v) => (
          <div key={v.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px", borderBottom: `1px solid ${LIGHTGRAY}`, fontSize: 13 }}>
            <span style={{ flex: 2, fontWeight: 600 }}>{v.comuna}</span>
            <span style={{ flex: 1, color: "#666", fontSize: 12 }}>{v.fecha_visita}</span>
            <span style={{ flex: 1.5, color: "#666", fontSize: 12 }}>{v.visitado_por || "—"}</span>
            <span style={{ flex: 2, color: "#888", fontSize: 12 }}>{v.notas || ""}</span>
            <button onClick={() => removeRow(v.id)} style={{ border: "none", background: "transparent", color: RED, cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, padding: 12, background: LIGHTGRAY, borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: NAVY_SOFT, marginBottom: 8 }}>Registrar nueva visita</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input placeholder="Comuna" value={form.comuna} onChange={e => setForm({ ...form, comuna: e.target.value })}
            style={{ flex: 1.5, minWidth: 140, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <input type="date" value={form.fecha_visita} onChange={e => setForm({ ...form, fecha_visita: e.target.value })}
            style={{ flex: 1, minWidth: 130, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <input placeholder="Visitado por (ej. Jefe/a URS)" value={form.visitado_por} onChange={e => setForm({ ...form, visitado_por: e.target.value })}
            style={{ flex: 1.5, minWidth: 150, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <input placeholder="Notas (opcional)" value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })}
            style={{ flex: 2, minWidth: 150, padding: 7, borderRadius: 6, border: `1px solid ${GRAYBLUE}`, fontSize: 13 }} />
          <button onClick={addRow} disabled={busy || !form.comuna.trim() || !form.fecha_visita}
            style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: busy ? LIGHTGRAY : NAVY, color: "white", fontWeight: 700, fontSize: 13, cursor: busy ? "default" : "pointer" }}>
            {busy ? "Guardando…" : "+ Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RegionPanel({ data, fetcher, regionId, onDataChanged }) {
  const [tab, setTab] = useState("resumen");
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
  ];

  const totalComunal = useMemo(() => {
    const t = data.comunas.reduce((a, c) => a + c[1], 0);
    const s = data.comunas.reduce((a, c) => a + c[2], 0);
    return { t, s, pct: (s / t) * 100 };
  }, [data]);

  const rankedComunas = useMemo(() => [...data.comunas].sort((a, b) => b[2] - a[2]), [data]);

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
                <div style={{ fontSize: 12, color: "#666" }}>Cartera total</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: NAVY }}>{data.s9.total.toLocaleString("es-CL")}</div>
                <div style={{ fontSize: 12, color: "#666" }}>proyectos</div>
              </div>
              <div style={{ flex: 1, minWidth: 200, border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <DonutMini {...data.s9} />
                <div style={{ fontSize: 12 }}>
                  <div><span style={{ color: TEAL, fontWeight: 700 }}>●</span> Cerrados {(data.s9.cerrados / data.s9.total * 100).toFixed(0)}%</div>
                  <div><span style={{ color: "#3B82C4", fontWeight: 700 }}>●</span> En ejecución {(data.s9.enEjecucion / data.s9.total * 100).toFixed(0)}%</div>
                  <div><span style={{ color: GRAYBLUE, fontWeight: 700 }}>●</span> Otros {(data.s9.otros / data.s9.total * 100).toFixed(0)}%</div>
                </div>
              </div>
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
            {data.s2regional && (
              <>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Nivel regional — evolución de cortes</div>
                <Table headers={["Corte", "Transferido ($M)", "Pendiente rendición ($M)", "% Deuda"]}
                  rows={data.s2regional.map(r => [r.corte, fmtM(r.transferido), fmtM(r.pendiente), <span style={{ color: pctColor(r.pct), fontWeight: 700 }}>{r.pct.toFixed(1)}%</span>])} />
                <div style={{ height: 16 }} />
              </>
            )}
            <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
              Nivel comunal — ordenado por urgencia (saldo pendiente ↓). Fórmula corregida: denominador = todos los proyectos vencidos.
            </div>
            <Table headers={["#", "Comuna", "Transferido ($M)", "Saldo pendiente ($M)", "% Deuda"]}
              highlightTop={5}
              rows={rankedComunas.map((c, i) => [i + 1, c[0], fmtM(c[1]), fmtM(c[2]), <span style={{ color: pctColor(c[3]), fontWeight: i < 5 ? 700 : 400 }}>{c[3].toFixed(2)}%</span>])} />
          </div>
        )}

        {tab === "s3" && (
          <div>
            <SectionTitle n="3" title="Cartera estratégica y nudos críticos" />
            {data.s3 ? <p style={{ fontSize: 13, color: NAVY_SOFT, lineHeight: 1.6 }}>{data.s3}</p> : <Pending text="Sin nudos críticos identificados previamente. Completar con la URS antes de la reunión." />}
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
            <CoberturaEditor regionId={regionId} rows={data.s5data || []} fetcher={fetcher} onChanged={onDataChanged} />
          </div>
        )}

        {tab === "s6" && (
          <div>
            <SectionTitle n="6" title="Viáticos — jefe/a URS y equipo" />
            {data.s6 ? (
              <div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                  Fuente: Estado de Ejecución del Gasto — Comisiones de Servicio, período {data.s6.periodo}.
                </div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
                  <div style={{ flex: 1, minWidth: 160, border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 14 }}>
                    <div style={{ fontSize: 11, color: "#666" }}>Presupuesto vigente</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{fmtM((data.s6.presupuestoVigente || 0) / 1000)}M</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 160, border: `1px solid ${LIGHTGRAY}`, borderRadius: 8, padding: 14 }}>
                    <div style={{ fontSize: 11, color: "#666" }}>Ejecutado a la fecha</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{fmtM(data.s6.montoTotal / 1000)}M</div>
                    <div style={{ fontSize: 11, color: "#666" }}>{data.s6.nViaticos} viáticos</div>
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
            <SectionTitle n="7A" title="Tiempo de evaluación de proyectos (pre-aprobación)" />
            {data.s7a ? (
              <div>
                <EvalRow label="PMU — Evaluación" meta={data.s7a.pmu.meta} real={data.s7a.pmu.real} />
                <EvalRow label="PMB — Evaluación" meta={data.s7a.pmb.meta} real={data.s7a.pmb.real} />
              </div>
            ) : <Pending text="Sin captura de 'Tiempo Evaluación de Proyectos' para esta región." />}

            <SectionTitle n="7B" title="Tiempo de revisión de rendición (post-transferencia)" />
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <RendCard label="PMU" data={data.s7b.pmu} />
              <RendCard label="PMB" data={data.s7b.pmb} />
            </div>
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
              </div>
            ) : <Pending text="Falta CSV de la hoja 'DF P03 Priorización' filtrado a esta región." />}
          </div>
        )}

        {tab === "s9" && (
          <div>
            <SectionTitle n="9" title="Capacidad de levantamiento de proyectos" />
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 14 }}>
              <DonutMini {...data.s9} />
              <Table headers={["Categoría", "N° proyectos", "%"]} rows={[
                ["Cartera total", data.s9.total, "100,0%"],
                ["Cerrados", data.s9.cerrados, (data.s9.cerrados / data.s9.total * 100).toFixed(1) + "%"],
                ["En ejecución", data.s9.enEjecucion, (data.s9.enEjecucion / data.s9.total * 100).toFixed(1) + "%"],
                ["Otros estados", data.s9.otros, (data.s9.otros / data.s9.total * 100).toFixed(1) + "%"],
              ]} />
            </div>
            <Pending text="'Elegibles' y 'En creación municipal' no están en el Excel de cartera — requiere fuente de postulaciones." />
          </div>
        )}

        {tab === "s10" && (
          <div>
            <SectionTitle n="10" title="IRAL — proyectos presentados por comuna" />
            <Pending text="Sin fuente identificada para ninguna región aún." />
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

  async function fetchTable(table) {
    const res = await fetch(`${base}/rest/v1/${table}?select=*`, { headers });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${table}: HTTP ${res.status} ${text.slice(0, 200)}`);
    }
    return res.json();
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

  async function deleteRow(table, id) {
    const res = await fetch(`${base}/rest/v1/${table}?id=eq.${id}`, { method: "DELETE", headers });
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  }

  return { fetchTable, insertRow, updateRow, deleteRow };
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
    setRegions(null);
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
        ]);
        const warns = [];
        const clean = results.map((r) => {
          if (r && r.__error) { warns.push(`${r.__table}: ${r.__error}`); return []; }
          return r;
        });
        if (warns.length) setWarnings(warns);

        const [regData, comData, indData, deudaData, cartData, viatData, viatMensualData, viatFuncData, acuerdosData, coberturaData] = clean;
        const regRaw = results[0];
        if (regRaw && regRaw.__error) throw new Error(`No se pudo leer 'regiones': ${regRaw.__error}`);
        if (!regData.length) throw new Error("La tabla 'regiones' respondió correctamente pero devolvió 0 filas. Revisa que las filas existan en el schema 'public' y que la policy de lectura esté activa para el rol 'anon'.");

        const out = {};
        for (const r of regData) {
          out[r.id] = {
            label: r.label, jefeUrs: r.jefe_urs, jefeConfianza: r.jefe_urs_confianza,
            ciclo: r.ciclo, primeraVez: r.primera_vez,
            comunas: comData.filter(c => c.region_id === r.id).map(c => [c.comuna, c.transferido_m, c.saldo_pendiente_m, c.pct_deuda]),
            s2regional: null,
            s3: null,
            s7a: (() => {
              const pmu = indData.find(i => i.region_id === r.id && i.programa === "PMU" && i.tipo === "evaluacion");
              const pmb = indData.find(i => i.region_id === r.id && i.programa === "PMB" && i.tipo === "evaluacion");
              return pmu || pmb ? { pmu: { meta: pmu?.meta_tecnica, real: pmu?.real_tecnica }, pmb: { meta: pmb?.meta_tecnica, real: pmb?.real_tecnica } } : null;
            })(),
            s7b: (() => {
              function latestAndPrev(programa) {
                const rows = indData.filter(i => i.region_id === r.id && i.programa === programa && i.tipo === "rendicion")
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
            s5data: coberturaData.filter(c => c.region_id === r.id).sort((a, b) => new Date(b.fecha_visita) - new Date(a.fecha_visita)),
            s10: null,
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

export default function PanelURS() {
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: 1.5 }}>SUBDERE — DIVISIÓN DE MUNICIPALIDADES</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: "2px 0 0" }}>Panel de Gestión URS</h1>
            <div style={{ fontSize: 12, color: "#666" }}>Prototipo — cobertura: 3 de 16 regiones (datos verificados a ago-2026)</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(regions).map(([key, r]) => (
              <button key={key} onClick={() => setRegion(key)} style={{
                border: "none", cursor: "pointer", padding: "10px 18px", borderRadius: 8, fontWeight: 700, fontSize: 13,
                background: activeRegion === key ? NAVY : "white", color: activeRegion === key ? "white" : NAVY,
                boxShadow: activeRegion === key ? "none" : "0 0 0 1px " + LIGHTGRAY,
              }}>{r.label}</button>
            ))}
          </div>
        </div>

        <div style={{ background: AMBER_BG, border: "1px solid #F0D48A", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12.5, color: AMBER_TXT }}>
          ⏳ 13 regiones restantes sin datos aún — este panel muestra solo lo verificado. No representa el estado nacional.
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
