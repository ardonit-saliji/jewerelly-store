import React, { useState } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Main from './components/Main/Main.jsx';
import Forgot from './components/ForgotPassword/ForgotPass.jsx';
import TradeItem from './components/Popups/TradeItem/TradeItem.jsx';
import Basket from './components/Basket/Basket.jsx';
import Account from './components/Popups/Account/Account.jsx';
import Checkout from './components/Checkout/Checkout.jsx';
import Footer from './components/Footer/Footer.jsx';

function App() {
  const [trade, setTrade] = useState(false);
  const [gemState, setGemState] = useState('');
  const [basketState, setBasketState] = useState([]);
  const status = JSON.parse(sessionStorage.getItem('loginStatus'));
  const [loginStatus, setLoginStatus] = useState(status);
  const [accountPopup, setAccountPopup] = useState(false);
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.same')) {
      setAccountPopup(false);
    }
  });
  return (
    <HashRouter>
      <div className='app'>
        <Navbar
          accountPopup={accountPopup}
          setAccountPopup={setAccountPopup}
          loginStatus={loginStatus}
          setLoginStatus={setLoginStatus}
          basketState={basketState}
        />
        <Routes>
          <Route
            path='/'
            element={<Main trade={trade} setTrade={setTrade} setGemState={setGemState} />}
          />
          <Route
            path='/reset-password'
            element={
              <Forgot
              // setSignUp={setSignUp} setLogin={setLogin}
              />
            }
          />
          <Route
            path='/basket'
            element={<Basket basketState={basketState} setBasketState={setBasketState} />}
          />
          <Route path='/checkout' element={<Checkout />} />
        </Routes>

        {trade && (
          <TradeItem
            basketState={basketState}
            setBasketState={setBasketState}
            setTrade={setTrade}
            gemState={gemState}
          />
        )}

        <Account
          setLoginStatus={setLoginStatus}
          accountPopup={accountPopup}
          setAccountPopup={setAccountPopup}
        />

        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
