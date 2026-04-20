import { useMemo, useState } from 'react'
import mapSvg from '../../assets/colombia-departamentos.svg'
import departments from '../../data/departments.json'

const getRandomDepartment = (statusMap) => {
  const remaining = departments.filter(
    (dept) => statusMap[dept.id] !== 'green',
  )
  if (remaining.length === 0) return null
  return remaining[Math.floor(Math.random() * remaining.length)]
}

function MapMode({ onBack }) {
  const [statusMap, setStatusMap] = useState({})
  const [current, setCurrent] = useState(getRandomDepartment(statusMap))
  const [answer, setAnswer] = useState({ department: '', capital: '' })
  const [feedback, setFeedback] = useState(null)

  const score = useMemo(
    () => Object.values(statusMap).filter((value) => value === 'green').length,
    [statusMap],
  )

  const currentState = current ? statusMap[current.id] : null

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!current) return

    const correctDepartment = answer.department === current.nom
    const correctCapital = answer.capital === current.capitale

    let newStatus = 'red'
    if (correctDepartment && correctCapital) newStatus = 'green'
    else if (correctDepartment || correctCapital) newStatus = 'yellow'

    setStatusMap((prev) => ({ ...prev, [current.id]: newStatus }))
    setFeedback({
      status: newStatus,
      correctDepartment: current.nom,
      correctCapital: current.capitale,
    })
    setAnswer({ department: '', capital: '' })

    setTimeout(() => {
      const next = getRandomDepartment({ ...statusMap, [current.id]: newStatus })
      setCurrent(next)
      setFeedback(null)
    }, 1200)
  }

  const getFillColor = (deptId) => {
    const state = statusMap[deptId]
    if (state === 'green') return '#16a34a33'
    if (state === 'yellow') return '#facc1533'
    if (state === 'red') return '#fca5a533'
    return '#ffffff'
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Carte interactive</h1>
        <p>Réponds au département et à la capitale du département sélectionné.</p>
      </header>

      <section className="card quiz-card">
        <div className="quiz-top">
          <div>{current ? `Département aléatoire : ${current.nom}` : 'Tous les départements sont verts !'}</div>
          <div>Validés : {score} / 32</div>
        </div>

        <div className="svg-wrapper">
          <img
            className="map-svg"
            src={mapSvg}
            alt="Carte des départements de Colombie"
          />
        </div>

        <div className="map-grid">
          {departments.slice(0, 8).map((dept) => (
            <div
              key={dept.id}
              className="map-cell"
              style={{ background: getFillColor(dept.id) }}
            >
              {dept.nom}
            </div>
          ))}
        </div>

        {current && (
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Département
              <input
                value={answer.department}
                onChange={(e) => setAnswer({ ...answer, department: e.target.value })}
                placeholder="Nom du département"
                required
              />
            </label>
            <label>
              Capitale
              <input
                value={answer.capital}
                onChange={(e) => setAnswer({ ...answer, capital: e.target.value })}
                placeholder="Nom de la capitale"
                required
              />
            </label>
            <button type="submit" className="button primary">
              Valider
            </button>
          </form>
        )}

        {feedback && (
          <div className={`feedback ${feedback.status}`}>
            {feedback.status === 'green' && <p>Parfait, les deux réponses sont bonnes.</p>}
            {feedback.status === 'yellow' && (
              <p>Une réponse est bonne. Département : {feedback.correctDepartment}, Capitale : {feedback.correctCapital}.</p>
            )}
            {feedback.status === 'red' && (
              <p>Mauvaise réponse. Département : {feedback.correctDepartment}, Capitale : {feedback.correctCapital}.</p>
            )}
          </div>
        )}

        <button className="button secondary" onClick={onBack} type="button">
          Retour au menu
        </button>
      </section>
    </div>
  )
}

export default MapMode
