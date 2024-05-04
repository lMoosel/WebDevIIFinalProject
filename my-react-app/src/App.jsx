import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {HomeScreen} from './components/HomeScreen.jsx'
import {StatsScreen} from './components/StatsScreen.jsx'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';

import './App.css'
import { SocialHub } from './components/SocialHub.jsx'
import { GenreInfo } from './components/GenreInfo.jsx'
import { Chart } from './components/Chart.jsx'
import SignUp from './components/SignUp.jsx'
import { CurrentSong } from './components/CurrentSong.jsx'


function App() {
  const [count, setCount] = useState(0)
  const [cookies, setCookie] = useCookies(['user'])
  /*
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
  else{*/
    return (
      <>
        <CookiesProvider>
            <Routes>

              <Route exact path="/" element={<StatsScreen/>}/>

              <Route path="/login" element={<StatsScreen/>}/>
              <Route path="/signup" element={<SignUp/>}/>

              <Route path="/socialhub" element={<SocialHub hideInfo={true}/>}/>
              <Route path="/topcategories" element={<GenreInfo hideInfo={true}/>}/>
              <Route path="/chart" element={<Chart hideInfo={true}/>}/>
            </Routes>
            <CurrentSong/>
        </CookiesProvider>
      </>
    )
  //}
}

export default App
