import React, { useRef } from 'react';
import { AuthContextProvider } from './contexts/AuthContext';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import ConsentForm from './pages/ConsentForm';
import Account from './pages/Account';
import NotFound from './pages/NotFound';
import SignIn from './components/SignIn';
import Menu from './components/Menu';
import Survey from './pages/Survey';
import DataPage1 from './pages/DataPage1';
import DataPage2 from './pages/DataPage2';
import UpdatePassword from './pages/UpdatePassword';
import UpdateEmail from './pages/UpdateEmail';
/**
 * @author Patrick Shaw
 */
function App() {
  const containerRef = useRef(null);

  return (
    <AuthContextProvider>
      <SignIn />
      <Menu />
      <div ref={containerRef} className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/datapage1" element={<DataPage1 />} />
          <Route path="/datapage2" element={<DataPage2 />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/consentform" element={<ConsentForm containerRef={containerRef} />} />
          <Route path="/account" element={<Account />} />
          <Route path="/updatepassword" element={<UpdatePassword />} />
          <Route path="/updateemail" element={<UpdateEmail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthContextProvider>
  );
}

export default App;