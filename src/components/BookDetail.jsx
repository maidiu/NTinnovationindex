import { useState, useEffect } from 'react'
import { bookName } from '../bookNames.js'

// Scores that go in the "innovation signals" panel
const INNOVATION_SCORES = [
  { key: 'conceptual_innovation_score',        label: 'Conceptual Innovation',     color: 'var(--accent2)', max: 100 },
  { key: 'semantic_refunctionalization_score', label: 'Semantic Refunctionalization', color: 'var(--gold)', max: 100 },
  { key: 'collocational_innovation_score',     label: 'Collocational Innovation',  color: 'var(--gold)', max: 100 },
  { key: 'extra_lxx_dependence_score',         label: 'Extra-LXX Dependence',      color: 'var(--accent)', max: 100 },
]

// Scores that go in the "tradition signals" panel
const TRADITION_SCORES = [
  { key: 'lxx_lexical_continuity_score',  label: 'LXX Lexical Continuity', color: 'var(--green)', max: 100 },
  { key: 'mt_anchor_score',               label: 'MT Anchor',               color: 'var(--green)', max: 100 },
]

// Scores that go in the "institutional signals" panel
const INSTITUTIONAL_SCORES = [
  { key: 'institutional_capture_score',   label: 'Institutional Capture',    color: 'var(--red)', max: 100 },
  { key: 'imperial_legibility_degree',    label: 'Imperial Legibility',      color: 'var(--red)', max: 100 },
  { key: 'imperial_respectability_score', label: 'Imperial Respectability',  color: 'var(--red)', max: 100 },
]

const MANUAL_SCORES = [
  { key: 'keeper_obligation',             label: 'Keeper Obligation' },
  { key: 'kingdom_nonhierarchy',          label: 'Kingdom Non-Hierarchy' },
  { key: 'hierarchy_building',            label: 'Hierarchy Building' },
  { key: 'domination_accommodation',      label: 'Domination Accommodation' },
  { key: 'israel_continuity',             label: 'Israel Continuity' },
  { key: 'christological_recomposition',  label: 'Christological Recomposition' },
  { key: 'orthodoxy_production',          label: 'Orthodoxy Production' },
  { key: 'eschatological_deferral',       label: 'Eschatological Deferral' },
  { key: 'creation_ground',              label: 'Creation Ground' },
]

function ScoreRow({ label, value, max = 100, color = 'var(--accent)' }) {
  const pct = Math.min(100, Math.max(0, (parseFloat(value) / max) * 100))
  const display = isNaN(parseFloat(value)) ? '—' : parseFloat(value).toFixed(1)
  return (
    <div className="score-row">
      <span className="score-row-label" title={label}>{label}</span>
      <div className="score-row-bar">
        <div className="score-row-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="score-row-val">{display}</span>
    </div>
  )
}

// Institutional Consolidation ↔ Covenantal Integrity tension bar
function TensionBar({ capture, resistance }) {
  const cap = parseFloat(capture) || 0
  const res = parseFloat(resistance) || 0
  return (
    <div className="tension-wrap">
      <div className="tension-row">
        <div className="tension-label tension-label--capture">
          <span className="tension-dot tension-dot--red" />
          Institutional Consolidation
        </div>
        <div className="tension-track">
          <div className="tension-fill tension-fill--red" style={{ width: `${cap}%` }} />
        </div>
        <span className="tension-value tension-value--red">{cap.toFixed(1)}</span>
      </div>
      <div className="tension-row">
        <div className="tension-label tension-label--resistance">
          <span className="tension-dot tension-dot--green" />
          Covenantal Integrity
        </div>
        <div className="tension-track">
          <div className="tension-fill tension-fill--green" style={{ width: `${res}%` }} />
        </div>
        <span className="tension-value tension-value--green">{res.toFixed(1)}</span>
      </div>
    </div>
  )
}

// Collapsible panel
function CollapsibleSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="detail-section">
      <h3
        onClick={() => setOpen(o => !o)}
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        {title}
        <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{open ? '▲' : '▼'}</span>
      </h3>
      {open && children}
    </div>
  )
}

// Inline SVG radar rendered from JSON axes
function RadarChart({ radarData }) {
  if (!radarData?.radar_axes) return null

  const axes = radarData.radar_axes
  const n = axes.length
  const cx = 230, cy = 210, r = 128
  const levels = 3

  function polar(i, val, maxVal = 3) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    const radius = (val / maxVal) * r
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  }

  const rings = Array.from({ length: levels }, (_, i) => {
    const rad = ((i + 1) / levels) * r
    const pts = Array.from({ length: n }, (_, j) => {
      const angle = (Math.PI * 2 * j) / n - Math.PI / 2
      return `${cx + rad * Math.cos(angle)},${cy + rad * Math.sin(angle)}`
    }).join(' ')
    return <polygon key={i} points={pts} fill="none" stroke="#252a35" strokeWidth="1" />
  })

  const spokes = axes.map((ax, i) => {
    const end = polar(i, 3)
    return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#252a35" strokeWidth="1" />
  })

  const pts = axes.map((ax, i) => {
    const p = polar(i, ax.value_normalized)
    return `${p.x},${p.y}`
  }).join(' ')

  const labels = axes.map((ax, i) => {
    const p = polar(i, 3.72)
    // Shorten long axis names to fit
    const name = ax.axis
      .replace(/_score$/, '')
      .replace(/_/g, ' ')
      .replace('semantic refunctionalization', 'refunctionalization')
      .replace('christological recomposition', 'christological recomp.')
      .replace('collocational innovation', 'collocational innov.')
      .replace('domination accommodation', 'dom. accommodation')
    const isComputed = ax.layer === 'computed'
    // Determine text anchor based on position
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    const anchor = Math.cos(angle) < -0.1 ? 'end' : Math.cos(angle) > 0.1 ? 'start' : 'middle'
    return (
      <text
        key={i}
        x={p.x}
        y={p.y}
        textAnchor={anchor}
        dominantBaseline="middle"
        fontSize="9"
        fill={isComputed ? '#6c8ebf' : '#8a9bb0'}
      >
        {name}
      </text>
    )
  })

  const dots = axes.map((ax, i) => {
    const p = polar(i, ax.value_normalized)
    return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="var(--accent)" />
  })

  return (
    <svg viewBox="-80 -20 560 460" style={{ width: '100%', maxWidth: 480 }}>
      {rings}
      {spokes}
      <polygon points={pts} fill="rgba(108,142,191,0.18)" stroke="var(--accent)" strokeWidth="2" />
      {dots}
      {labels}
    </svg>
  )
}

export default function BookDetail({ book, onBack }) {
  const [radarData, setRadarData] = useState(null)

  useEffect(() => {
    if (!book) return
    setRadarData(null)
    import(`../data/radar/${book.book_id}_radar.json`)
      .then(m => setRadarData(m.default))
      .catch(() => setRadarData(null))
  }, [book?.book_id])

  if (!book) return null

  const score = parseFloat(book.final_innovation_index)
  const scoreColor = score >= 57 ? 'var(--red)'
    : score >= 50 ? 'var(--accent2)'
    : score >= 44 ? 'var(--gold)'
    : score >= 38 ? 'var(--accent)'
    : 'var(--green)'

  return (
    <>
      <button className="back-btn" onClick={onBack}>← All Books</button>

      {/* ── Header ── */}
      <div className="detail-header">
        <div className="detail-title">
          <h2>{bookName(book.book_id)}</h2>
          <div className="score-big" style={{ color: scoreColor }}>
            {isNaN(score) ? '—' : score.toFixed(1)}
          </div>
          <div className="score-label">Innovation Index (0–100)</div>
        </div>
        <div className="detail-badges">
          <span className={`badge badge-${book.profile_label}`}>
            {(book.profile_label || '').replace(/_/g, ' ')}
          </span>
          <span className="badge badge-mode">
            {(book.dominant_innovation_mode || '').replace(/_/g, ' ')}
          </span>
          {book.confidence && (
            <span style={{ color: 'var(--muted)', fontSize: '0.72rem' }}>
              confidence: {book.confidence}
            </span>
          )}
        </div>
      </div>

      {/* ── Tension bar — primary visual ── */}
      <div className="tension-panel">
        <div className="tension-panel-title">Institutional Tension</div>
        <TensionBar
          capture={book.capture_pressure}
          resistance={book.resistance_residue}
        />
        {book.dominant_contradiction && (
          <div className="tension-contradiction">
            <span className="tension-contradiction-label">dominant contradiction</span>
            {book.dominant_contradiction}
          </div>
        )}
      </div>

      {/* ── Main grid: radar + score panels ── */}
      <div className="detail-grid">

        {/* Left: radar */}
        <div>
          <CollapsibleSection title="Radar Profile">
            <div className="radar-wrap">
              {radarData
                ? <RadarChart radarData={radarData} />
                : <span style={{ color: 'var(--muted)', padding: '2rem' }}>Loading…</span>
              }
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.71rem', marginTop: '0.5rem' }}>
              Manual axes 0–3 · Computed axes rescaled 0–3 for display
            </p>
          </CollapsibleSection>
        </div>

        {/* Right: score panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <CollapsibleSection title="Innovation Signals">
            {INNOVATION_SCORES.map(({ key, label, color, max }) => (
              <ScoreRow key={key} label={label} value={book[key]} max={max} color={color} />
            ))}
          </CollapsibleSection>

          <CollapsibleSection title="Tradition Signals">
            {TRADITION_SCORES.map(({ key, label, color, max }) => (
              <ScoreRow key={key} label={label} value={book[key]} max={max} color={color} />
            ))}
          </CollapsibleSection>

          <CollapsibleSection title="Institutional Signals">
            {INSTITUTIONAL_SCORES.map(({ key, label, color, max }) => (
              <ScoreRow key={key} label={label} value={book[key]} max={max} color={color} />
            ))}
          </CollapsibleSection>

          <CollapsibleSection title="Manual Annotations (0–3)" defaultOpen={false}>
            {MANUAL_SCORES.map(({ key, label }) => (
              <ScoreRow key={key} label={label} value={book[key]} max={3} color="var(--accent2)" />
            ))}
          </CollapsibleSection>

        </div>
      </div>
    </>
  )
}
