import { useEffect, useMemo, useRef, useState } from 'react'
import departments from '../../data/departments.json'

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5)

const getQuestion = (item, type) => {
  const answer = type === 'capital' ? item.capitale : item.nom
  const prompt =
    type === 'capital'
      ? `Quelle est la capitale du département de ${item.nom} ?`
      : `À quel département appartient la ville de ${item.capitale} ?`

  const candidates = shuffle(
    departments
      .map((department) =>
        type === 'capital' ? department.capitale : department.nom,
      )
      .filter((value) => value !== answer),
  ).slice(0, 3)

  return {
    id: item.id,
    prompt,
    answer,
    options: shuffle([answer, ...candidates]),
  }
}

const buildQuestions = () =>
  shuffle(departments).map((department) =>
    getQuestion(department, Math.random() > 0.5 ? 'capital' : 'department'),
  )

const STORAGE_KEY = 'colombian-departments-quiz-scores'

function QuizMode({ onBack }) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [status, setStatus] = useState(null)
  const [score, setScore] = useState(0)
  const [history, setHistory] = useState([])
  const timeoutRef = useRef(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const data = JSON.parse(raw)
      if (Array.isArray(data)) setHistory(data)
    } catch (error) {
      console.error('Impossible de lire l’historique', error)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const bestScore = useMemo(
    () => (history.length ? Math.max(...history) : null),
    [history],
  )

  const startQuiz = () => {
    setQuestions(buildQuestions())
    setCurrentIndex(0)
    setSelectedOption(null)
    setStatus(null)
    setScore(0)
  }

  const currentQuestion = questions[currentIndex]
  const finished = questions.length > 0 && currentIndex >= questions.length

  const handleSelect = (option) => {
    if (selectedOption || !currentQuestion) return
    setSelectedOption(option)
    const correct = option === currentQuestion.answer
    setStatus(correct ? 'correct' : 'wrong')
    if (correct) {
      setScore((prev) => prev + 1)
      timeoutRef.current = setTimeout(next, 2000)
    }
  }

  const next = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex >= questions.length) {
      const nextHistory = [score, ...history].sort((a, b) => b - a).slice(0, 5)
      setHistory(nextHistory)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory))
    }
    setCurrentIndex(nextIndex)
    setSelectedOption(null)
    setStatus(null)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedOption && event.key === 'Enter') {
        event.preventDefault()
        next()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedOption, next])

  return (
    <div className="app">
      <header className="header">
        <h1>Quiz des départements colombiens</h1>
        <p>Testez vos connaissances sur les départements de Colombie et leurs capitales.</p>
      </header>

      {questions.length === 0 && (
        <section className="card welcome-card">
          <h2>Prêt à jouer ?</h2>
          <p>Commencez un quiz de 32 questions, puis améliorez votre score.</p>
          <button className="button primary" onClick={startQuiz}>
            Démarrer le quiz
          </button>
          <button className="button secondary" onClick={onBack}>
            Retour au menu
          </button>
          {bestScore !== null && (
            <div className="stats-card">
              <p>Meilleur score : <strong>{bestScore} / 32</strong></p>
              <p>Historique : {history.join(' / ')}</p>
            </div>
          )}
        </section>
      )}

      {questions.length > 0 && !finished && currentQuestion && (
        <section className="card quiz-card">
          <div className="quiz-top">
            <div>Question {currentIndex + 1} / {questions.length}</div>
            <div>Score : {score}</div>
          </div>
          <h2 className="prompt">{currentQuestion.prompt}</h2>
          <div className="options-grid">
            {currentQuestion.options.map((option) => {
              const isSelected = option === selectedOption
              const isCorrect = selectedOption && option === currentQuestion.answer
              const isWrong = isSelected && status === 'wrong'
              return (
                <button
                  key={option}
                  type="button"
                  className={`option ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                  onClick={() => handleSelect(option)}
                  disabled={!!selectedOption}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {selectedOption && (
            <div className="feedback-bar">
              {status === 'correct' ? (
                <p className="feedback correct">Correct !</p>
              ) : (
                <p className="feedback wrong">Faux. La bonne réponse est <strong>{currentQuestion.answer}</strong>.</p>
              )}
              <button className="button secondary" onClick={next}>
                {currentIndex + 1 >= questions.length ? 'Voir le résultat' : 'Question suivante'}
              </button>
            </div>
          )}
        </section>
      )}

      {finished && (
        <section className="card result-card">
          <h2>Quiz terminé</h2>
          <p>Ton score : <strong>{score} / {questions.length}</strong></p>
          <p>{score === 32 ? 'Félicitations, 32/32 !' : 'Tu peux encore t’améliorer.'}</p>
          <button className="button primary" onClick={startQuiz}>
            Rejouer
          </button>
          <button className="button secondary" onClick={onBack}>
            Retour au menu
          </button>
          <div className="stats-card">
            <p>Meilleur score : <strong>{bestScore} / 32</strong></p>
            <p>Historique : {history.join(' / ')}</p>
          </div>
        </section>
      )}
    </div>
  )
}

export default QuizMode
