import methodologyText from '../data/methodology.md?raw'

// Minimal markdown → JSX renderer (headings, paragraphs, code, lists, tables, bold/code inline)
function renderMarkdown(text) {
  const lines = text.split('\n')
  const elements = []
  let i = 0
  let key = 0

  function inlineRender(str) {
    // bold **text** and inline `code`
    const parts = str.split(/(`[^`]+`|\*\*[^*]+\*\*)/)
    return parts.map((p, idx) => {
      if (p.startsWith('`') && p.endsWith('`')) return <code key={idx}>{p.slice(1, -1)}</code>
      if (p.startsWith('**') && p.endsWith('**')) return <strong key={idx}>{p.slice(2, -2)}</strong>
      return p
    })
  }

  while (i < lines.length) {
    const line = lines[i]

    // Blank line
    if (line.trim() === '') { i++; continue }

    // H1
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++}>{line.slice(2)}</h1>)
      i++; continue
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++}>{line.slice(3)}</h2>)
      i++; continue
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++}>{line.slice(4)}</h3>)
      i++; continue
    }

    // Fenced code block
    if (line.startsWith('```')) {
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing ```
      elements.push(<pre key={key++}><code>{codeLines.join('\n')}</code></pre>)
      continue
    }

    // Table
    if (line.includes('|') && i + 1 < lines.length && lines[i + 1].includes('---')) {
      const headers = line.split('|').map(h => h.trim()).filter(Boolean)
      i += 2 // skip separator
      const tableRows = []
      while (i < lines.length && lines[i].includes('|')) {
        const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean)
        tableRows.push(cells)
        i++
      }
      elements.push(
        <table key={key++}>
          <thead>
            <tr>{headers.map((h, j) => <th key={j}>{inlineRender(h)}</th>)}</tr>
          </thead>
          <tbody>
            {tableRows.map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{inlineRender(cell)}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )
      continue
    }

    // Unordered list
    if (line.match(/^[-*] /)) {
      const items = []
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(<li key={i}>{inlineRender(lines[i].replace(/^[-*] /, ''))}</li>)
        i++
      }
      elements.push(<ul key={key++}>{items}</ul>)
      continue
    }

    // Ordered list
    if (line.match(/^\d+\. /)) {
      const items = []
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(<li key={i}>{inlineRender(lines[i].replace(/^\d+\. /, ''))}</li>)
        i++
      }
      elements.push(<ol key={key++}>{items}</ol>)
      continue
    }

    // Paragraph
    const paraLines = []
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('```') && !lines[i].match(/^[-*] /) && !lines[i].match(/^\d+\. /) && !lines[i].includes('|')) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length) {
      elements.push(<p key={key++}>{inlineRender(paraLines.join(' '))}</p>)
    }
  }

  return elements
}

export default function Methodology() {
  return (
    <div className="methodology">
      {renderMarkdown(methodologyText)}
    </div>
  )
}
