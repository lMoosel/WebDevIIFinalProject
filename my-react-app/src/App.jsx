import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {HomeScreen} from './components/HomeScreen.jsx'
import {StatsScreen} from './components/StatsScreen.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [onHomeScreen, setHomeScreen] = useState(true)

  const toggleHomeScreen = async () => {
    setHomeScreen(!onHomeScreen)
  }

  if(onHomeScreen) {
    return(
      <>
        <HomeScreen toggleHomeScreen={toggleHomeScreen}/>
      </>
    )
  }
  else{
    return (
      <>
        <StatsScreen/>
      </>
    )
  }
}

export default App
