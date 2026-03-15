import { useState, useMemo } from 'react'
import { bookName } from '../bookNames.js'

// Profile label → dot color (matches CSS --c0..c5)
const DOT_COLOR = {
  lxx_anchored:            '#3dd68c',
  constrained_departure:   '#82cc58',
  selective_recomposition: '#d4c040',
  composite_recomposition: '#e08038',
  institutional_innovation:'#c04880',
  systemic_recomposition:  '#e04848',
}

function fmtLabel(s) {
  return (s || '').split('_').map(w => {
    if (w === 'lxx') return 'LXX'
    if (w === 'mt')  return 'MT'
    return w.charAt(0).toUpperCase() + w.slice(1)
  }).join(' ')
}

// Quadrant definitions (high X = high institutional consolidation, high Y = high covenantal integrity)
// labelY is in DATA coords. scaleY inverts: high data-Y → near top of SVG.
// So labelY:88 renders near the top (high integrity), labelY:12 near the bottom (low integrity).
const QUADRANTS = [
  { x: 0,  y: 50, w: 50, h: 50, fill: 'rgba(76,175,125,0.06)',  label: 'Covenantal Integrity',  sub: 'low consolidation · high integrity',  labelX: 25, labelY: 88 },
  { x: 50, y: 50, w: 50, h: 50, fill: 'rgba(200,150,80,0.07)',  label: 'Contested',              sub: 'high consolidation · high integrity',  labelX: 75, labelY: 88 },
  { x: 0,  y: 0,  w: 50, h: 50, fill: 'rgba(108,142,191,0.05)', label: 'Moderate Synthesis',     sub: 'low consolidation · low integrity',    labelX: 25, labelY: 12 },
  { x: 50, y: 0,  w: 50, h: 50, fill: 'rgba(224,92,92,0.07)',   label: 'Consolidation Dominant', sub: 'high consolidation · low integrity',   labelX: 75, labelY: 12 },
]

// SVG viewport
const W = 660, H = 460
const M = { top: 28, right: 28, bottom: 52, left: 52 }
const PW = W - M.left - M.right   // 580
const PH = H - M.top - M.bottom   // 380

function scaleX(v) { return (v / 100) * PW }
function scaleY(v) { return PH - (v / 100) * PH }

// ── Label collision avoidance ─────────────────────────────────────────────────
// Estimated character width at font-size 10px (Georgia serif)
const CHAR_W = 5.6
const LH = 11      // label baseline height
const VPAD = 3     // minimum gap between labels
const MAX_DRIFT = 55  // max px a label can wander from its natural position

function estimateWidth(id) {
  return bookName(id).length * CHAR_W
}

function getBBox(label) {
  const { x, y, w, anchor } = label
  const left = anchor === 'end' ? x - w : x
  return { left, right: left + w, top: y - LH, bottom: y }
}

function overlaps(a, b) {
  const ba = getBBox(a), bb = getBBox(b)
  return ba.left  < bb.right  + VPAD &&
         bb.left  < ba.right  + VPAD &&
         ba.top   < bb.bottom + VPAD &&
         bb.top   < ba.bottom + VPAD
}

function computeLabels(books) {
  // Initial placement: prefer the quadrant away from center
  const labels = books.map(book => {
    const sx = scaleX(book.capture_pressure ?? 0)
    const sy = scaleY(book.resistance_residue ?? 0)
    const right  = sx > PW * 0.6
    const bottom = sy > PH * 0.68
    const anchor = right ? 'end' : 'start'
    const dx     = right ? -13 : 13
    const dy     = bottom ? -8 : 14
    const w      = estimateWidth(book.book_id)
    return {
      book, sx, sy,
      x: sx + dx, y: sy + dy,
      baseX: sx + dx, baseY: sy + dy,
      anchor, w,
    }
  })

  // Iterative force-push (up to 120 iterations or until stable)
  for (let iter = 0; iter < 120; iter++) {
    let moved = false
    for (let i = 0; i < labels.length; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i], b = labels[j]
        if (!overlaps(a, b)) continue
        moved = true

        const ba = getBBox(a), bb = getBBox(b)
        const overlapX = Math.min(ba.right, bb.right) - Math.max(ba.left, bb.left)
        const overlapY = Math.min(ba.bottom, bb.bottom) - Math.max(ba.top, bb.top)

        // Push apart along the axis with less overlap (resolve smallest conflict first)
        if (overlapY <= overlapX) {
          const push = (overlapY + VPAD) / 2
          const aMid = (ba.top + ba.bottom) / 2
          const bMid = (bb.top + bb.bottom) / 2
          if (aMid <= bMid) { a.y -= push; b.y += push }
          else              { a.y += push; b.y -= push }
        } else {
          const push = (overlapX + VPAD) / 2
          const aMid = (ba.left + ba.right) / 2
          const bMid = (bb.left + bb.right) / 2
          if (aMid <= bMid) { a.x -= push; b.x += push }
          else              { a.x += push; b.x -= push }
        }

        // Clamp to MAX_DRIFT from natural position
        a.y = Math.max(a.baseY - MAX_DRIFT, Math.min(a.baseY + MAX_DRIFT, a.y))
        b.y = Math.max(b.baseY - MAX_DRIFT, Math.min(b.baseY + MAX_DRIFT, b.y))
        // Keep inside plot bounds (with a small margin)
        a.y = Math.max(LH + 2, Math.min(PH + 4, a.y))
        b.y = Math.max(LH + 2, Math.min(PH + 4, b.y))
      }
    }
    if (!moved) break
  }

  return labels
}

export default function ScatterPlot({ data, onSelect }) {
  const [tooltip, setTooltip] = useState(null)

  const labels = useMemo(() => computeLabels(data), [data])

  function handleMouseEnter(book) {
    const sx = scaleX(book.capture_pressure ?? 0)
    const sy = scaleY(book.resistance_residue ?? 0)
    setTooltip({ book, sx, sy })
  }

  const ticks = [0, 25, 50, 75, 100]

  return (
    <div className="scatter-wrap">
      <div className="scatter-legend">
        {Object.entries(DOT_COLOR).map(([label, color]) => (
          <span key={label} className="scatter-legend-item">
            <span className="scatter-legend-dot" style={{ background: color }} />
            {fmtLabel(label)}
          </span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="scatter-svg"
        role="img"
        aria-label="Scatter plot: capture pressure vs resistance residue"
        onMouseLeave={() => setTooltip(null)}
      >
        <g transform={`translate(${M.left},${M.top})`}>

          {/* Quadrant shading */}
          {QUADRANTS.map((q, i) => (
            <g key={i}>
              <rect
                x={scaleX(q.x)}
                y={scaleY(q.y + q.h)}
                width={scaleX(q.w)}
                height={scaleY(0) - scaleY(q.h)}
                fill={q.fill}
              />
              <text
                x={scaleX(q.labelX)} y={scaleY(q.labelY)}
                textAnchor="middle" fontSize="10"
                fill="#3d4660" fontStyle="italic" letterSpacing="0.04em"
              >
                {q.label}
              </text>
              <text
                x={scaleX(q.labelX)} y={scaleY(q.labelY) + 14}
                textAnchor="middle" fontSize="8.5"
                fill="#2e3550" letterSpacing="0.02em"
              >
                {q.sub}
              </text>
            </g>
          ))}

          {/* Grid lines */}
          {ticks.map(t => (
            <g key={t}>
              <line x1={scaleX(t)} y1={0} x2={scaleX(t)} y2={PH}
                stroke={t === 50 ? '#2a3045' : '#1e2330'}
                strokeWidth={t === 50 ? 1.5 : 1}
                strokeDasharray={t === 50 ? '' : '4 4'} />
              <line x1={0} y1={scaleY(t)} x2={PW} y2={scaleY(t)}
                stroke={t === 50 ? '#2a3045' : '#1e2330'}
                strokeWidth={t === 50 ? 1.5 : 1}
                strokeDasharray={t === 50 ? '' : '4 4'} />
            </g>
          ))}

          {/* Axis tick numbers */}
          {ticks.map(t => (
            <g key={t}>
              <text x={scaleX(t)} y={PH + 18} textAnchor="middle" fontSize="10" fill="#4a5568">{t}</text>
              <text x={-14} y={scaleY(t) + 4} textAnchor="end"    fontSize="10" fill="#4a5568">{t}</text>
            </g>
          ))}

          {/* Axis titles */}
          <text x={PW / 2} y={PH + 42} textAnchor="middle" fontSize="11" fill="#7c8ba1" letterSpacing="0.06em">
            INSTITUTIONAL CONSOLIDATION →
          </text>
          <text x={-PH / 2} y={-38} textAnchor="middle" fontSize="11" fill="#7c8ba1"
            letterSpacing="0.06em" transform="rotate(-90)">
            COVENANTAL INTEGRITY →
          </text>

          {/* Leader lines (drawn first, underneath dots) */}
          {labels.map(({ book, sx, sy, x, y, anchor, baseX, baseY }) => {
            const dist = Math.hypot(x - baseX, y - baseY)
            if (dist < 6) return null
            // Anchor point on the label edge closest to the dot
            const lx = anchor === 'end' ? x : x
            return (
              <line key={`line-${book.book_id}`}
                x1={sx} y1={sy}
                x2={anchor === 'end' ? x : x}
                y2={y - LH / 2}
                stroke="#2a3248" strokeWidth="0.8"
                strokeDasharray="2 2"
              />
            )
          })}

          {/* Dots + labels */}
          {labels.map(({ book, sx, sy, x, y, anchor }) => {
            const color = DOT_COLOR[book.profile_label] ?? '#7c8ba1'
            const isHovered = tooltip?.book.book_id === book.book_id
            return (
              <g
                key={book.book_id}
                className="scatter-dot-group"
                onClick={() => onSelect(book)}
                onMouseEnter={() => handleMouseEnter(book)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={sx} cy={sy} r={isHovered ? 9 : 7}
                  fill={color} fillOpacity={isHovered ? 1 : 0.85}
                  stroke={color} strokeWidth={1.5} strokeOpacity={0.4}
                />
                <text
                  x={x} y={y}
                  textAnchor={anchor}
                  fontSize="10"
                  fill={isHovered ? '#e2e8f0' : '#6a7a94'}
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  className="scatter-label"
                >
                  {bookName(book.book_id)}
                </text>
              </g>
            )
          })}

          {/* Tooltip */}
          {tooltip && (() => {
            const b = tooltip.book
            const sx = tooltip.sx, sy = tooltip.sy
            const tipW = 182, tipH = 86
            let tx = sx + 14, ty = sy - tipH - 10
            if (tx + tipW > PW) tx = sx - tipW - 14
            if (ty < 0) ty = sy + 14
            return (
              <g style={{ pointerEvents: 'none' }}>
                <rect x={tx} y={ty} width={tipW} height={tipH}
                  rx={5} fill="#151820" stroke="#252a35" strokeWidth={1} />
                <text x={tx+10} y={ty+18} fontSize="12" fontWeight="bold" fill="#e2e8f0">
                  {bookName(b.book_id)}
                </text>
                <text x={tx+10} y={ty+34} fontSize="10" fill="#7c8ba1">
                  Index: {parseFloat(b.final_innovation_index).toFixed(1)}
                </text>
                <text x={tx+10} y={ty+48} fontSize="10" fill="#e05c5c">
                  Consolidation: {parseFloat(b.capture_pressure).toFixed(1)}
                </text>
                <text x={tx+10} y={ty+62} fontSize="10" fill="#4caf7d">
                  Cov. Integrity: {parseFloat(b.resistance_residue).toFixed(1)}
                </text>
                <text x={tx+10} y={ty+76} fontSize="9" fill="#5a6580" fontStyle="italic">
                  {(b.dominant_innovation_mode || '').replace(/_/g, ' ')}
                </text>
              </g>
            )
          })()}
        </g>
      </svg>

      <p className="scatter-note">
        Each dot is one NT book. X axis: degree of institutional consolidation (hierarchy-building, orthodoxy production, eschatological deferral). Y axis: covenantal integrity (keeper obligation, non-hierarchical vision, Israel continuity, creation-groundedness). Color encodes innovation profile tier. Click any dot to open the book detail.
      </p>
    </div>
  )
}
