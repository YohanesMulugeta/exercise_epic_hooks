// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
  fetchPokemon,
} from '../pokemon'

function errorFallBack({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something happend:</p>
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)

  const [state, setState] = React.useState({
    pokemon: null,
    status: 'idle',
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) return

    setState({status: 'pending', error: null, pokemon: null})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({status: 'resolved', pokemon: pokemon})
      },

      error => {
        // setState({error: error, status: 'rejected'})
        setState({status: 'rejected', error: error})
        throw error
      },
    )
  }, [pokemonName])

  if (state.status === 'rejected') {
    throw state.error
  }

  if (state.status === 'idle') return 'Submit a pokemon'

  if (state.status === 'pending')
    return <PokemonInfoFallback name={pokemonName} />

  if (state.status === 'resolved')
    return <PokemonDataView pokemon={state.pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={errorFallBack}
          resetKeys={pokemonName}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
