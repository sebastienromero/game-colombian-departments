import { useEffect, useMemo, useState } from 'react'
import departments from '../../data/departments.json'
import colombiaGeo from '../../data/colombian-departments.json'

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')

const getCoordinates = (geometry) => {
  if (!geometry) return []
  if (geometry.type === 'Polygon') return [geometry.coordinates]
  if (geometry.type === 'MultiPolygon') return geometry.coordinates
  return []
}

const tinyIslandTransform = {
  sanandresyprovidencia: {
    size: 10,
    offsetX: 110,
    offsetY: 50,
  },
}

const flattenPoints = (coords, result = []) => {
  if (!Array.isArray(coords)) return result
  if (coords.length === 2 && typeof coords[0] === 'number') {
    result.push(coords)
  } else {
    coords.forEach((item) => flattenPoints(item, result))
  }
  return result
}

const getGeoBounds = (features) => {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  const visit = (coords) => {
    if (!Array.isArray(coords)) return
    if (coords.length === 2 && typeof coords[0] === 'number') {
      const [x, y] = coords
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
      return
    }
    coords.forEach(visit)
  }
  features.forEach((feature) => visit(feature.geometry?.coordinates))
  return { minX, minY, maxX, maxY }
}

const buildPath = (geometry, project, polygonTransforms) =>
  getCoordinates(geometry)
    .map((polygon, polygonIndex) =>
      polygon
        .map((ring) =>
          ring
            .map(([x, y], index) => {
              const [px, py] = project(x, y).split(' ').map(Number)
              const [tx, ty] = polygonTransforms
                ? polygonTransforms[polygonIndex](px, py)
                : [px, py]
              return `${index === 0 ? 'M' : 'L'} ${tx.toFixed(2)} ${ty.toFixed(2)}`
            })
            .join(' ') + ' Z',
        )
        .join(' '),
    )
    .join(' ')

const makeProjector = (bounds, width, height, margin = 20) => {
  const worldWidth = bounds.maxX - bounds.minX
  const worldHeight = bounds.maxY - bounds.minY
  const scale = Math.min((width - margin * 2) / worldWidth, (height - margin * 2) / worldHeight)
  return (x, y) => {
    const px = (x - bounds.minX) * scale + margin
    const py = (bounds.maxY - y) * scale + margin
    return `${px.toFixed(2)} ${py.toFixed(2)}`
  }
}

const getRandomDepartment = (statusMap) => {
  const remaining = departments.filter(
    (dept) => statusMap[dept.id] !== 'green',
  )
  if (remaining.length === 0) return null
  return remaining[Math.floor(Math.random() * remaining.length)]
}

const getProjectedCentroid = (geometry, projector) => {
  const points = flattenPoints(geometry)
  const projected = points.map(([x, y]) => {
    const [px, py] = projector(x, y).split(' ').map(Number)
    return { x: px, y: py }
  })
  const centroid = projected.reduce(
    (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
    { x: 0, y: 0 },
  )
  return projected.length
    ? { x: centroid.x / projected.length, y: centroid.y / projected.length }
    : { x: 0, y: 0 }
}

function MapMode({ onBack }) {
  const [statusMap, setStatusMap] = useState({})
  const [current, setCurrent] = useState(null)
  const [answer, setAnswer] = useState({ department: '', capital: '' })
  const [feedback, setFeedback] = useState(null)

  const score = useMemo(
    () => Object.values(statusMap).filter((value) => value === 'green').length,
    [statusMap],
  )

  const currentState = current ? statusMap[current.id] : null

  const featureByDeptId = useMemo(() => {
    const map = {}
    const deptByName = departments.reduce((acc, dept) => {
      acc[normalize(dept.nom)] = dept.id
      return acc
    }, {})
    colombiaGeo.features.forEach((feature) => {
      const id = normalize(feature.properties.name)
      const deptId = deptByName[id]
      if (deptId) {
        map[deptId] = feature
      }
    })
    return map
  }, [])

  const mapFeatures = useMemo(() => {
    const bounds = getGeoBounds(colombiaGeo.features)
    const projector = makeProjector(bounds, 920, 700)
    return colombiaGeo.features.map((feature) => {
      const normalizedName = normalize(feature.properties.name)
      const override = tinyIslandTransform[normalizedName]
      const polygonList = getCoordinates(feature.geometry)
      const polygonTransforms = override
        ? polygonList.map((polygon) => {
            const polygonPoints = flattenPoints(polygon)
            const projectedPolygon = polygonPoints.map(([x, y]) => {
              const [px, py] = projector(x, y).split(' ').map(Number)
              return { x: px, y: py }
            })
            const centroid = projectedPolygon.reduce(
              (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
              { x: 0, y: 0 },
            )
            const center = projectedPolygon.length
              ? { x: centroid.x / projectedPolygon.length, y: centroid.y / projectedPolygon.length }
              : { x: 0, y: 0 }
            const dx = override.offsetX ?? 0
            const dy = override.offsetY ?? 0
            return (px, py) => [
              center.x + (px - center.x) * override.size + dx,
              center.y + (py - center.y) * override.size + dy,
            ]
          })
        : null
      return {
        ...feature,
        path: buildPath(feature.geometry, projector, polygonTransforms),
        deptId: departments.find(
          (dept) => normalize(dept.nom) === normalizedName,
        )?.id,
      }
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!current) return

    const correctDepartment = answer.department === current.nom
    const correctCapital = answer.capital === current.capitale

    let newStatus = 'red'
    if (correctDepartment && correctCapital) newStatus = 'green'
    else if (correctDepartment || correctCapital) newStatus = 'yellow'

    const updatedStatus = { ...statusMap, [current.id]: newStatus }
    setStatusMap(updatedStatus)
    setFeedback({
      status: newStatus,
      correctDepartment: current.nom,
      correctCapital: current.capitale,
    })
    setAnswer({ department: '', capital: '' })
  }

  const goNextQuestion = () => {
    const next = getRandomDepartment(statusMap)
    setCurrent(next)
    setFeedback(null)
    setAnswer({ department: '', capital: '' })
  }

  const getFillColor = (deptId, isSelected = false) => {
    const state = statusMap[deptId]
    if (isSelected) return '#bfdbfe88'
    if (state === 'green') return '#16a34a33'
    if (state === 'yellow') return '#facc1533'
    if (state === 'red') return '#fca5a533'
    return '#ffffff'
  }

  useEffect(() => {
    if (!current) {
      setCurrent(getRandomDepartment(statusMap))
    }
  }, [current, statusMap])

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

        {current && (
          <div className="current-department-label">
            Département actuellement sélectionné : <strong>{current.nom}</strong>
          </div>
        )}

        <div className="svg-wrapper">
          <svg className="map-svg" viewBox="0 0 920 700" aria-label="Carte des départements de Colombie">
            {mapFeatures.map((feature) => {
              const deptId = feature.deptId
              return (
                <path
                  key={feature.properties.id}
                  d={feature.path}
                  fill={deptId ? getFillColor(deptId, current?.id === deptId) : '#f8fafc'}
                  stroke={current?.id === deptId ? '#2563eb' : '#475569'}
                  strokeWidth={current?.id === deptId ? 2 : 0.6}
                  opacity={0.95}
                  onClick={() => {
                    if (deptId) {
                      const selected = departments.find((dept) => dept.id === deptId)
                      setCurrent(selected)
                    }
                  }}
                />
              )
            })}
          </svg>
        </div>

        {current ? (
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
        ) : null}

        {feedback && (
          <button type="button" className="button secondary" onClick={goNextQuestion}>
            Question suivante
          </button>
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
