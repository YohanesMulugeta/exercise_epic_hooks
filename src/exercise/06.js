// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
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

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)

  const [state, setState] = React.useState({
    pokemon: null,
    status: 'idle',
    error: null,
  })

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.

  React.useEffect(() => {
    if (!pokemonName) return

    setState({status: 'pending', error: null, pokemon: null})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({status: 'resolved', pokemon: pokemon})
      },

      error => {
        setState({error: error, status: 'rejected'})
      },
    )
  }, [pokemonName])

  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  // 💣 remove this
  if (state.status === 'rejected') {
    return (
      <div role="alert">
        There was an eror:{' '}
        <pre style={{whiteSpace: 'normal'}}>{state.error.message}</pre>
      </div>
    )
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
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
