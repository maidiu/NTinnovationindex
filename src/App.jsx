import { useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import BookDetail from './components/BookDetail.jsx'
import Methodology from './components/Methodology.jsx'

export default function App() {
  const [page, setPage] = useState('dashboard')   // 'dashboard' | 'detail' | 'methodology'
  const [selectedBook, setSelectedBook] = useState(null)

  function openBook(book) {
    setSelectedBook(book)
    setPage('detail')
    window.scrollTo(0, 0)
  }

  function goBack() {
    setPage('dashboard')
    setSelectedBook(null)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <nav>
        <span className="nav-logo"><span />NT Innovation Index</span>
        <button
          className={page === 'dashboard' || page === 'detail' ? 'active' : ''}
          onClick={() => { setPage('dashboard'); setSelectedBook(null) }}
        >
          Books
        </button>
        <button
          className={page === 'methodology' ? 'active' : ''}
          onClick={() => setPage('methodology')}
        >
          Methodology
        </button>
      </nav>
      <main>
        {page === 'dashboard' && <Dashboard onSelect={openBook} />}
        {page === 'detail'    && <BookDetail book={selectedBook} onBack={goBack} />}
        {page === 'methodology' && <Methodology />}
      </main>
    </>
  )
}
