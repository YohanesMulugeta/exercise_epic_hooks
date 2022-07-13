// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, onClick}) {
  // -------------------------------------------------------------- custom hook

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

// ------------------------------------------------------------------------------------- HISTORY

function History({squares, setSquares}) {
  const [historyArray, setHistory] = useLocalStorageState('history', [
    Array(9).fill(null),
  ])

  React.useEffect(() => {
    const checkAllNull = squares.some(square => square !== null)
    // const checkSimililarity = historyArray.filter(his => {})

    console.log(checkAllNull)

    if (!checkAllNull) setHistory([Array(9).fill(null)])
    else {
      const squaresCurrent = [...squares]
      setHistory([...historyArray, squaresCurrent])
    }
  }, [squares])

  function renderHistory() {
    return historyArray.map((his, i) => {
      return (
        <button
          disabled={i === historyArray.length - 1}
          key={his}
          id={i}
          onClick={() => {
            setSquares(historyArray[i])
          }}
        >
          Go to{' '}
          {`${i === 0 ? 'Game Start' : `Move #${i}`}${
            i === historyArray.length - 1 ? '(Current)' : ''
          }`}
        </button>
      )
    })
  }

  console.log(historyArray)

  return renderHistory()
}

// -------------------------------------------------------------------------------------- GAME

function Game() {
  // -------------------------------------------------------------------------------- step state
  const [currentStep, setCurrentStep] = React.useState(0)
  const [history, setHistory] = React.useState([Array(9).fill(null)])

  const currentSquers = history[currentStep]
  const winner = calculateWinner(currentSquers)
  const nextValue = calculateNextValue(currentSquers)
  const status = calculateStatus(winner, currentSquers, nextValue)

  function selectSquare(i) {
    const stateCopy = [...currentSquers]
    const winner = calculateWinner(stateCopy)
    if (winner || stateCopy[i]) return // ------------------------------------ Guard key

    const newHistory = history.slice(0, currentStep + 1)

    const nextValue = calculateNextValue(stateCopy)
    stateCopy[i] = nextValue

    setHistory([...newHistory, stateCopy])

    setCurrentStep(newHistory.length)
  }

  function restart() {
    setHistory([Array(9).fill(null)])
    setCurrentStep(0)
  }

  const moves = history.map((stepSqueres, step) => {
    const desc = step === 0 ? 'Go To Game Start' : `Go To Move #${step}`

    const isCurrentStep = step === currentStep

    return (
      <li key={step}>
        <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
          {desc} {isCurrentStep ? '(Current)' : null}
        </button>
      </li>
    )
  })

  // function historyHandle(){}

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquers} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
