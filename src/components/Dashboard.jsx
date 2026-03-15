import { useState, useMemo } from 'react'
import bookScores from '../data/book_scores.json'
import ScatterPlot from './ScatterPlot.jsx'
import { bookName } from '../bookNames.js'

const PROFILE_LABELS = [
  { key: 'lxx_anchored',            desc: 'Continuity > 70. Vocabulary and conceptual framework remain tightly bound to LXX patterns. Maximal preservation of the Septuagintal tradition.' },
  { key: 'constrained_departure',   desc: 'Continuity 62–70. Selective divergence from LXX norms, but the inherited tradition remains the dominant frame throughout.' },
  { key: 'selective_recomposition', desc: 'Continuity 56–62. Deliberate reworking of inherited categories in specific domains while preserving others. The tradition is still the primary reference.' },
  { key: 'composite_recomposition', desc: 'Continuity 50–56. Substantial semantic shift across multiple domains. The text works in creative tension with — and at some cost to — its tradition.' },
  { key: 'institutional_innovation',desc: 'Continuity 43–50. The text is actively constructing new normative frameworks that displace inherited covenant obligations.' },
  { key: 'systemic_recomposition',  desc: 'Continuity < 43. Thoroughgoing departure. The inherited tradition has been substantially abandoned and replaced by a new institutional-theological universe.' },
]

const MODES = [
  { key: 'institutional_capture',    desc: 'Institutional consolidation ≥ 75. The text is substantially oriented toward durable institutional structures; covenantal integrity scores are minimal.' },
  { key: 'resistance_preservation',  desc: 'High covenantal integrity, low consolidation. The text actively maintains the founding movement\'s social vision against normative accommodation.' },
  { key: 'contested_recomposition',  desc: 'Both consolidation and covenantal integrity are elevated. The text holds both impulses simultaneously — a genuine site of unresolved tension.' },
  { key: 'institutional_trajectory', desc: 'Moderate-to-high consolidation, low covenantal integrity. The text is moving toward institutional normativity without significant counter-pressure.' },
  { key: 'conceptual_recomposition', desc: 'High conceptual departure, low consolidation. Semantic transformation is driven by theological reworking rather than structural development.' },
  { key: 'dialectical_innovation',   desc: 'High conceptual departure with strong covenantal integrity. The text recomposes inherited categories in ways that preserve or amplify the founding movement\'s material and social vision.' },
  { key: 'moderate_synthesis',       desc: 'Default category. Neither strongly consolidating nor strongly integrity-preserving; moderate departure across several registers.' },
]

const COLS = [
  { key: 'final_innovation_index',      label: 'Continuity', numeric: true  },
  { key: 'profile_label',               label: 'Profile',    numeric: false },
  { key: 'dominant_innovation_mode',    label: 'Mode',       numeric: false },
  { key: 'capture_pressure',            label: 'Consolidation', numeric: true  },
  { key: 'resistance_residue',          label: 'Cov. Integrity', numeric: true  },
  { key: 'conceptual_innovation_score', label: 'Departure',  numeric: true  },
]

function fmt(v) {
  if (v === null || v === undefined || v === '') return '—'
  const n = parseFloat(v)
  return isNaN(n) ? v : n.toFixed(1)
}

// "lxx_anchored" → "LXX Anchored", "selective_recomposition" → "Selective Recomposition"
function fmtLabel(s) {
  return (s || '').split('_').map((w, i) => {
    if (w === 'lxx') return 'LXX'
    if (w === 'mt')  return 'MT'
    return w.charAt(0).toUpperCase() + w.slice(1)
  }).join(' ')
}

export default function Dashboard({ onSelect }) {
  const [view, setView]             = useState('scatter')   // 'scatter' | 'table'
  const [sortKey, setSortKey]       = useState('final_innovation_index')
  const [sortDir, setSortDir]       = useState('asc')
  const [filterLabel, setFilterLabel] = useState(null)
  const [filterMode, setFilterMode]   = useState(null)

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  // Filtered + sorted data used by both scatter and table
  const rows = useMemo(() => {
    let d = [...bookScores]
    if (filterLabel) d = d.filter(r => r.profile_label === filterLabel)
    if (filterMode)  d = d.filter(r => r.dominant_innovation_mode === filterMode)
    d.sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey]
      const na = parseFloat(va), nb = parseFloat(vb)
      const numA = isNaN(na) ? va : na
      const numB = isNaN(nb) ? vb : nb
      if (numA < numB) return sortDir === 'asc' ? -1 : 1
      if (numA > numB) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return d
  }, [sortKey, sortDir, filterLabel, filterMode])

  return (
    <>
      {/* ── Header ── */}
      <div className="dashboard-header">
        <div>
          <h1>New Testament Continuity Index</h1>
          <p>Departure from the LXX/MT covenantal tradition across 27 NT books — plotted by institutional tension.</p>
        </div>
        <div className="view-toggle">
          <button
            className={view === 'scatter' ? 'active' : ''}
            onClick={() => setView('scatter')}
          >
            Scatter
          </button>
          <button
            className={view === 'table' ? 'active' : ''}
            onClick={() => setView('table')}
          >
            Table
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="filters">
        <span className="filter-label">Profile:</span>
        {PROFILE_LABELS.map(({ key, desc }) => (
          <div key={key} className="chip-wrapper">
            <button
              className={`chip ${filterLabel === key ? 'active' : ''}`}
              onClick={() => setFilterLabel(filterLabel === key ? null : key)}
            >
              {fmtLabel(key)}
            </button>
            <div className="chip-tooltip">{desc}</div>
          </div>
        ))}
      </div>

      <div className="filters" style={{ marginBottom: '1.75rem' }}>
        <span className="filter-label">Mode:</span>
        {MODES.map(({ key, desc }) => (
          <div key={key} className="chip-wrapper">
            <button
              className={`chip ${filterMode === key ? 'active' : ''}`}
              onClick={() => setFilterMode(filterMode === key ? null : key)}
            >
              {fmtLabel(key)}
            </button>
            <div className="chip-tooltip">{desc}</div>
          </div>
        ))}
      </div>

      {/* ── Scatter view ── */}
      {view === 'scatter' && (
        <ScatterPlot data={rows} onSelect={onSelect} />
      )}

      {/* ── Table view ── */}
      {view === 'table' && (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort('book_id')}
                    className={sortKey === 'book_id' ? 'sorted' : ''}
                  >
                    Book {sortKey === 'book_id' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  {COLS.map(c => (
                    <th
                      key={c.key}
                      onClick={() => handleSort(c.key)}
                      className={sortKey === c.key ? 'sorted' : ''}
                    >
                      {c.label} {sortKey === c.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={COLS.length + 1} className="empty">
                      No books match the current filters.
                    </td>
                  </tr>
                )}
                {rows.map(book => (
                  <tr key={book.book_id} onClick={() => onSelect(book)}>
                    <td className="book-name">{bookName(book.book_id)}</td>
                    <td>
                      <div className="score-bar-cell">
                        <div className="score-bar-track">
                          <div
                            className="score-bar-fill"
                            style={{ width: `${Math.min(100, 100 - parseFloat(book.final_innovation_index))}%` }}
                          />
                        </div>
                        <span className="score">{fmt(100 - parseFloat(book.final_innovation_index))}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${book.profile_label}`}>
                        {fmtLabel(book.profile_label)}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-mode">
                        {fmtLabel(book.dominant_innovation_mode)}
                      </span>
                    </td>
                    <td className="score">{fmt(book.capture_pressure)}</td>
                    <td className="score">{fmt(book.resistance_residue)}</td>
                    <td className="score">{fmt(book.conceptual_innovation_score)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="table-note">
            {rows.length} of {bookScores.length} books · click any row to open detail
          </p>
        </>
      )}
    </>
  )
}
