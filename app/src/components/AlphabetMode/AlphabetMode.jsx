import { useEffect, useMemo, useRef, useState } from 'react'
import departments from '../../data/departments.json'
import BackToMenuButton from '../BackToMenuButton.jsx'

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const buildAlphabeticalList = () =>
  [...departments].sort((a, b) =>
    a.nom.localeCompare(b.nom, 'es', { sensitivity: 'base' }),
  )

const buildRandomList = () => [...departments].sort(() => Math.random() - 0.5)

function AlphabetMode({ onBack }) {
  const alphabeticalList = useMemo(() => buildAlphabeticalList(), [])
  const departmentInputRef = useRef(null)
  const [sequence, setSequence] = useState([])
  const [variant, setVariant] = useState('alphabet')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [validatedCount, setValidatedCount] = useState(0)
  const [departmentInput, setDepartmentInput] = useState('')
  const [capitalInput, setCapitalInput] = useState('')
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [feedback, setFeedback] = useState(null)

  const total = sequence.length
  const current = sequence[currentIndex] ?? null
  const finished = total > 0 && currentIndex >= total
  const masteryValidated = finished && score === total

  const startGame = (selectedVariant) => {
    const nextSequence =
      selectedVariant === 'random' ? buildRandomList() : alphabeticalList
    setVariant(selectedVariant)
    setSequence(nextSequence)
    setCurrentIndex(0)
    setValidatedCount(0)
    setDepartmentInput('')
    setCapitalInput('')
    setScore(0)
    setMistakes(0)
    setFeedback(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!current) return

    const isCorrect =
      variant === 'expert'
        ? normalize(departmentInput) === normalize(current.nom) &&
          normalize(capitalInput) === normalize(current.capitale)
        : normalize(capitalInput) === normalize(current.capitale)

    if (isCorrect) {
      setScore((prev) => prev + 1)
    } else {
      setMistakes((prev) => prev + 1)
    }

    setFeedback({
      status: isCorrect ? 'correct' : 'wrong',
      correctDepartment: current.nom,
      correctCapital: current.capitale,
    })
    setValidatedCount((prev) => Math.min(prev + 1, total))
  }

  const goNext = () => {
    if (!current) return
    setCurrentIndex((prev) => prev + 1)
    setDepartmentInput('')
    setCapitalInput('')
    setFeedback(null)
  }

  const getVariantLabel = (value) => {
    if (value === 'alphabet') return 'Ordre alphabétique'
    if (value === 'random') return 'Rappel aléatoire'
    return 'Mode expert'
  }

  const getNextVariant = (value) => {
    if (value === 'alphabet') return 'random'
    if (value === 'random') return 'expert'
    return 'alphabet'
  }

  useEffect(() => {
    if (variant === 'expert' && sequence.length > 0 && !finished && !feedback) {
      departmentInputRef.current?.focus()
    }
  }, [variant, sequence.length, finished, feedback, currentIndex])

  useEffect(() => {
    if (!feedback || finished) return

    const handleEnterToNext = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        goNext()
      }
    }

    window.addEventListener('keydown', handleEnterToNext)
    return () => window.removeEventListener('keydown', handleEnterToNext)
  }, [feedback, finished])

  return (
    <div className="app app--with-back">
      <BackToMenuButton onBack={onBack} />
      <header className="header">
        <h1>Mode Alphabétique</h1>
        <p>
          Complète les capitales des départements dans l’ordre alphabétique pour
          valider la compétence.
        </p>
      </header>

      {sequence.length === 0 && (
        <section className="card welcome-card">
          <h2>Choisis ton entraînement</h2>
          <p>
            Commence par l’ordre alphabétique, puis consolide avec le rappel
            aléatoire.
          </p>
          <div className="mode-grid">
            <button
              className="button secondary"
              type="button"
              onClick={() => startGame('alphabet')}
            >
              Ordre alphabétique
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={() => startGame('random')}
            >
              Rappel aléatoire
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={() => startGame('expert')}
            >
              Mode expert
            </button>
          </div>
        </section>
      )}

      {sequence.length > 0 && !finished && current && (
        <section className="card quiz-card">
          <div className="quiz-top">
            <div>{getVariantLabel(variant)}</div>
            <div>
              {currentIndex + 1} / {total}
            </div>
          </div>

          {variant !== 'expert' && (
            <p className="current-department-label">
              Département : <strong>{current.nom}</strong>
            </p>
          )}

          <div className={variant === 'expert' ? 'expert-layout' : ''}>
            <form className="form-grid" onSubmit={handleSubmit}>
              {variant === 'expert' && (
                <label>
                  Département
                  <input
                    ref={departmentInputRef}
                    value={departmentInput}
                    onChange={(event) => setDepartmentInput(event.target.value)}
                    placeholder="Nom du département"
                    disabled={!!feedback}
                  />
                </label>
              )}
              <label>
                Capitale
                <input
                  value={capitalInput}
                  onChange={(event) => setCapitalInput(event.target.value)}
                  placeholder="Nom de la capitale"
                  disabled={!!feedback}
                />
              </label>
              <button className="button primary" type="submit" disabled={!!feedback}>
                Valider
              </button>
            </form>

            {variant === 'expert' && (
              <aside className="expert-departments">
                <p className="expert-departments-title">Ordre alphabétique</p>
                <ol>
                  {sequence.slice(0, validatedCount).map((department, index) => (
                    <li
                      key={department.id}
                      className={index === validatedCount - 1 ? 'current' : ''}
                    >
                      {department.nom}
                    </li>
                  ))}
                </ol>
              </aside>
            )}
          </div>

          {feedback && (
            <div className={`feedback ${feedback.status}`}>
              {feedback.status === 'correct' ? (
                <p>Correct.</p>
              ) : (
                <p>
                  Incorrect. Réponse attendue :{' '}
                  <strong>{feedback.correctDepartment}</strong> -{' '}
                  <strong>{feedback.correctCapital}</strong>.
                </p>
              )}
            </div>
          )}

          <div className="quiz-top">
            <div>Score : {score}</div>
            <div>Erreurs : {mistakes}</div>
          </div>

          {feedback && (
            <button className="button secondary" type="button" onClick={goNext}>
              {currentIndex + 1 >= total ? 'Voir le résultat' : 'Suivant'}
            </button>
          )}
        </section>
      )}

      {finished && (
        <section className="card result-card">
          <h2>Session terminée</h2>
          <p>
            Score : <strong>{score} / {total}</strong>
          </p>
          <p>Erreurs : <strong>{mistakes}</strong></p>
          <p>
            {masteryValidated
              ? 'Compétence validée : tu connais tous les départements et leurs capitales.'
              : 'Compétence non validée : rejoue pour atteindre 100%.'}
          </p>
          <div className="mode-grid">
            <button
              className="button secondary"
              type="button"
              onClick={() => startGame(variant)}
            >
              Rejouer ce mode
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={() => startGame(getNextVariant(variant))}
            >
              Basculer de mode
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

export default AlphabetMode
