import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar.jsx'
import Main from './components/Main/Main.jsx'
import Login from './components/Popups/Login/Login.jsx'
import Signup from './components/Popups/Signup/Signup.jsx'
import Forgot from './components/ForgotPassword/ForgotPass.jsx'
import TradeItem from './components/Popups/TradeItem/TradeItem.jsx'
import Basket from './components/Basket/Basket.jsx'
import './App.css'

function App() {
  const [login, setLogin] = useState(false)
  const [signUp, setSignUp] = useState(false)
  const [trade, setTrade] = useState(false)
  const [gemState, setGemState] = useState('')
  const [basketState, setBasketState] = useState([])

  return (
    <BrowserRouter>
      <div className='app'>
        <Navbar setLogin={setLogin} setSignUp={setSignUp} basketState={basketState} />

        <Routes>
          <Route
            path='/'
            element={<Main trade={trade} setTrade={setTrade} setGemState={setGemState} />}
          />
          <Route
            path='/reset-password'
            element={<Forgot setSignUp={setSignUp} setLogin={setLogin} />}
          />
          <Route
            path='/basket'
            element={<Basket basketState={basketState} setBasketState={setBasketState} />}
          />
        </Routes>

        {login && <Login login={login} setLogin={setLogin} setSignUp={setSignUp} />}
        {signUp && <Signup setLogin={setLogin} setSignUp={setSignUp} />}

        {trade && (
          <TradeItem
            basketState={basketState}
            setBasketState={setBasketState}
            setTrade={setTrade}
            gemState={gemState}
          />
        )}

        <div className='footer'>
          <h2>&copy; Jewellery Traders</h2>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
