import { useState } from 'react'
import './App.css'
import QuizMode from './components/Quiz/QuizMode.jsx'
import MapMode from './components/Map/MapMode.jsx'
import AlphabetMode from './components/AlphabetMode/AlphabetMode.jsx'

function App() {
  const [mode, setMode] = useState(null)

  if (mode === 'quiz') {
    return <QuizMode onBack={() => setMode(null)} />
  }

  if (mode === 'map') {
    return <MapMode onBack={() => setMode(null)} />
  }

  if (mode === 'alphabet') {
    return <AlphabetMode onBack={() => setMode(null)} />
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Jeux des départements colombiens</h1>
        <p>Choisis un mode pour apprendre les départements et leurs capitales.</p>
      </header>

      <section className="card welcome-card">
        <div className="mode-grid">
          <button className="mode-button secondary" onClick={() => setMode('quiz')}>
            Mode Quiz
          </button>
          <button className="mode-button secondary" onClick={() => setMode('map')}>
            Mode Carte interactive
          </button>
          <button className="mode-button secondary" onClick={() => setMode('alphabet')}>
            Mode Alphabétique
          </button>
        </div>
      </section>
    </div>
  )
}

export default App
