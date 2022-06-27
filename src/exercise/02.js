// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorage(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, desirialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const value = localStorage.getItem(key)

    if (value) return desirialize(value)
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key) // this will referance the privious key always

  // console.log('you tricked me')

  React.useEffect(() => {
    // console.log('pussy')
    const prevKey = prevKeyRef.current

    if (key !== prevKey) {
      console.log('puss')
      localStorage.removeItem(prevKey)
      prevKeyRef.current = key
    }
    localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

function Greeting({initialName}) {
  const [name, setName] = useLocalStorage('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="jobe" />
}

export default App
